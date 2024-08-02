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
from django.db import transaction
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
                        {"type": "text",
                         "text": "이 이미지를 상세히 분석해주세요. 다음 요소들을 포함해 설명해 주세요:\n1. 주요 피사체와 그 특징\n2. 색상 구성과 전반적인 색조\n3. 구도와 레이아웃\n4. 이미지의 전체적인 분위기와 느낌\n5. 제품이나 브랜드의 핵심 특징이나 장점\n6. 타겟 고객층이나 사용 상황"},
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
            return {"error": "User not found"}

        # 결과를 데이터베이스에 저장
        media = Media.objects.create(user=user, text_result=analysis_result)
        logger.info("Image analysis task completed successfully")

        # 이미지 분석 결과를 바탕으로 CM송 가사 생성
        lyrics_payload = {
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "user",
                    "content": f"다음 이미지 분석 결과를 바탕으로 CM송(commercial song) 가사를 1절만 생성해 주세요 제발 가사만 주세요 가사 제외한 내용 싹 다 뺴주세요:\n{analysis_result}"
                }
            ],
            "max_tokens": 500
        }
        lyrics_response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=lyrics_payload)
        lyrics_response.raise_for_status()
        lyrics_response_json = lyrics_response.json()

        #generated_lyrics = lyrics_response_json['choices'][0]['message']['content']
        generated_lyrics ="""
        (Verse 1)
꿈을 향해 달려가, 테커와 함께 해
새로운 길을 열어줘, 여기서 시작해
코딩의 세계로, 한 발짝 더 가까이
우리와 함께라면, 뭐든지 할 수 있어

(Chorus)
테커, 테커, 미래를 여는 열쇠
함께라면 두려움은 없어
테커, 테커, 꿈을 이룰 그 날까지
우리 손잡고 나아가자

(Verse 2)
도전은 어렵지만, 포기하지 않아
함께하는 친구들, 우리 힘이 돼줄게
성장의 기쁨을, 느낄 수 있게 해
테커와 함께라면, 빛나는 내일로

(Chorus)
테커, 테커, 미래를 여는 열쇠
함께라면 두려움은 없어
테커, 테커, 꿈을 이룰 그 날까지
우리 손잡고 나아가자

(Bridge)
고민하지 말고, 지금 바로 시작해
테커와 함께라면, 한계는 없어
우린 해낼 수 있어, 믿고 나아가
미래의 주인공은 바로 너야

(Chorus)
테커, 테커, 미래를 여는 열쇠
함께라면 두려움은 없어
테커, 테커, 꿈을 이룰 그 날까지
우리 손잡고 나아가자

(Outro)
테커와 함께라면, 모든 꿈이 현실로
우리의 도전은 지금부터 시작이야
"""
        # Suno 클립 작업 호출
        suno_clip_task.delay(media.id, generated_lyrics)

        return media.id  # Media 객체 ID 반환
    except requests.exceptions.RequestException as e:
        logger.error(f"Error in analyze_image_task: {e}")
        return {"error": str(e)}
    except Exception as e:
        logger.error(f"Unexpected error in analyze_image_task: {e}")
        return {"error": "Unexpected error"}


@shared_task
def suno_clip_task(media_id, generated_lyrics):
    try:
        logger.info("Suno 클립 작업 시작")

        with transaction.atomic():
            media = Media.objects.select_for_update().get(id=media_id)
            
        create_url = "https://api.sunoapi.com/api/v1/suno/create"
        create_payload = {
            "prompt": generated_lyrics,
            "tags": "logo song, joyful, excited, upbeat",
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
        logger.info(f"Suno API 작업 ID: {task_id}")

        clip_url = f"https://api.sunoapi.com/api/v1/suno/clip/{task_id}"

        while True:
            clip_response = requests.get(clip_url, headers=headers)
            clip_response.raise_for_status()

            clip_data = clip_response.json()
            clip_status = clip_data['data']['status']
            logger.info(f"Suno API 상태: {clip_status}")

            if clip_status == 'completed':
                logger.info("Suno 클립 완료!")
                clips = clip_data['data']['clips']
                audio_url = next((clip_info['audio_url'] for clip_id, clip_info in clips.items()), None)
                if audio_url is None:
                    logger.error("Suno 클립 응답에서 오디오 URL을 찾을 수 없습니다")
                    return {"error": "Audio URL not found"}
                break
            elif clip_status in ['processing', 'pending']:
                logger.info(f"Suno 클립이 {clip_status} 상태입니다. 10초 후 다시 확인합니다...")
                time.sleep(10)
            else:
                logger.error(f"예상치 못한 Suno API 상태: {clip_status}")
                return {"error": f"Unexpected Suno API status: {clip_status}"}

        response = requests.get(audio_url)
        response.raise_for_status()
        audio_content = ContentFile(response.content)

        # S3에 업로드
        s3_url = upload_to_s3(audio_content, f"music/{media_id}.mp3")

        if s3_url:
            media.music_url = s3_url
            media.save(update_fields=['music_url'])            
            logger.info("Suno 클립 작업이 성공적으로 완료되었습니다")
            return {"s3_url": s3_url}
        else:
            logger.error("S3 업로드 실패")
            return {"error": "Failed to upload to S3"}
    except requests.exceptions.RequestException as e:
        logger.error(f"요청 오류 발생: {e}")
        return {"error": str(e)}
    except Media.DoesNotExist:
        logger.error(f"Media 객체를 찾을 수 없습니다: {media_id}")
        return {"error": "Media not found"}
    except Exception as e:
        logger.error(f"알 수 없는 오류 발생: {e}")
        return {"error": str(e)}



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