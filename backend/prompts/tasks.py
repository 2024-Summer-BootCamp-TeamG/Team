from celery import shared_task
from .models import Media
from django.contrib.auth import get_user_model
import logging
import requests
import os
import json
from django.core.files.base import ContentFile
import time
import boto3
from botocore.exceptions import NoCredentialsError, ClientError

logger = logging.getLogger(__name__)

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
SUNO_API_KEY = os.getenv('SUNO_API_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

@shared_task
def analyze_image_task(base64_image, user_id):
    try:
        logger.info(f"Starting image analysis task for user_id: {user_id}")

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }
        payload = {
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "이 이미지를 상세히 분석해주세요. 다음 요소들을 포함해 설명해 주세요:\n1. 주요 피사체와 그 특징\n2. 색상 구성과 전반적인 색조\n3. 구도와 레이아웃\n4. 이미지의 전체적인 분위기와 느낌\n5. 제품이나 브랜드의 핵심 특징이나 장점\n6. 타겟 고객층이나 사용 상황"},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                    ]
                }
            ],
            "max_tokens": 1000
        }
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        response.raise_for_status()
        response_json = response.json()

        analysis_result = response_json['choices'][0]['message']['content']

        # 사용자 객체 가져오기
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
            logger.info(f"User found: {user.username}")
        except User.DoesNotExist:
            logger.error(f"User with ID {user_id} not found")
            return None

        # 결과를 데이터베이스에 저장
        media = Media.objects.create(user=user, text_result=analysis_result)
        logger.info("Image analysis task completed successfully")

        # Suno 클립 작업 호출
        suno_clip_task.delay(media.id)

        return media.id  # Media 객체 ID 반환
    except Exception as e:
        logger.error(f"Error in analyze_image_task: {e}")
        return str(e)  # 오류 메시지 반환

@shared_task
def suno_clip_task(media_id):
    try:
        logger.info("Starting suno clip task")

        media = Media.objects.get(id=media_id)

        create_url = "https://api.sunoapi.com/api/v1/suno/create"
        create_payload = {
            "prompt": "",
            "tags": "CM song",
            "custom_mode": True,
            "title": ""
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {SUNO_API_KEY}"
        }

        create_response = requests.post(create_url, headers=headers, json=create_payload)
        create_response.raise_for_status()

        task_data = create_response.json()
        task_id = task_data['data']['task_id']
        logger.info(f"Suno API Task ID: {task_id}")

        clip_url = f"https://api.sunoapi.com/api/v1/suno/clip/{task_id}"

        while True:
            clip_response = requests.get(clip_url, headers=headers)
            clip_response.raise_for_status()

            clip_data = clip_response.json()
            clip_status = clip_data['data']['status']
            if clip_status == 'completed':
                logger.info("Suno Clip completed!")
                clips = clip_data['data']['clips']
                audio_url = next((clip_info['audio_url'] for clip_id, clip_info in clips.items()), None)
                break
            elif clip_status == 'processing':
                logger.info("Suno Clip is still processing. Checking again in 10 seconds...")
                time.sleep(10)
            else:
                logger.error(f"Unexpected Suno API status: {clip_status}")
                return "Unexpected Suno API status"

        response = requests.get(audio_url)
        response.raise_for_status()
        audio_content = ContentFile(response.content)

        # S3에 업로드
        s3_url = upload_to_s3(audio_content, f"music/{media_id}.mp3")

        if s3_url:
            media.music_url = s3_url
            media.save()
            logger.info("Suno clip task completed successfully")
            return s3_url  # 생성된 클립의 S3 URL 반환
        else:
            logger.error("Failed to upload to S3")
            return "Failed to upload to S3"
    except Exception as e:
        logger.error(f"Error in suno_clip_task: {e}")
        return str(e)  # 오류 메시지 반환

def upload_to_s3(file_content, object_name):
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )

        s3_client.upload_fileobj(file_content, AWS_STORAGE_BUCKET_NAME, object_name)
        s3_url = f"https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{object_name}"
        return s3_url
    except NoCredentialsError:
        logger.error("S3 credentials not available")
        return None
    except ClientError as e:
        logger.error(f"S3 Client Error: {e}")
        return None