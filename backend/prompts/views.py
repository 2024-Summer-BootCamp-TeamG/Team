import os
import uuid
import django
import textwrap
import boto3
from botocore.exceptions import NoCredentialsError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import AlbumCover
from .serializers import AlbumCoverSerializer
import requests
from googletrans import Translator
from io import BytesIO
from drf_yasg.utils import swagger_auto_schema
from dotenv import load_dotenv
import json
import logging
import time
#저장용
# Load environment variables
load_dotenv()

# DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Django setup
django.setup()

def generate_album_cover(api_key, prompt):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "prompt": prompt,
        "size": "1024x1024",
        "n": 1
    }

    response = requests.post("https://api.openai.com/v1/images/generations", headers=headers, json=payload)

    # Print response status code and body
    print(f"Response Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")

    return response.json(), prompt

def translate_to_english(text):
    try:
        translator = Translator()
        translation = translator.translate(text, src='ko', dest='en')
        return translation.text
    except Exception as e:
        print(f"Translation Error: {e}")
        return text  # 번역에 실패하면 원본 텍스트를 반환

def truncate_text(text, limit):
    return textwrap.shorten(text, width=limit, placeholder="...")

def upload_to_s3(image_data, bucket_name, object_name):
    s3 = boto3.client(
        's3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('AWS_DEFAULT_REGION')
    )
    try:
        s3.upload_fileobj(image_data, bucket_name, object_name)
        s3_url = f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
        return s3_url
    except NoCredentialsError:
        print("S3 Upload Error: No AWS credentials found.")
        return None
    except Exception as e:
        print(f"S3 Upload Error: {e}")
        return None

class AlbumCoverView(APIView):

    @swagger_auto_schema(
        request_body=AlbumCoverSerializer,
        responses={201: AlbumCoverSerializer, 400: 'Bad Request'}
    )
    def post(self, request):
        serializer = AlbumCoverSerializer(data=request.data)
        if serializer.is_valid():
            mood = serializer.validated_data.get('mood', '')
            image_text = serializer.validated_data.get('image_text', '')
            analysis_text = serializer.validated_data.get('analysis_text', '')

            # 프롬프트를 영어로 번역
            translated_image_text = translate_to_english(image_text)
            translated_analysis_text = translate_to_english(analysis_text)

            prompt = (
                f"Create an album cover that accurately depicts: {translated_image_text}. "
                f"The overall mood should be: {mood}. "
                f"Include elements that convey the emotions described in: {translated_analysis_text}. "
            )
            # 1000자 이내로 축약
            prompt = f"The overall mood should be: {mood} and Please ensure the image contains no text." + truncate_text(
                prompt, 930)

            print("Generated prompt: " + prompt)

            api_key = os.getenv("MY_API_KEY")
            response, _ = generate_album_cover(api_key, prompt)

            if "data" in response and len(response["data"]) > 0:
                image_url = response["data"][0]["url"]

                # 이미지 다운로드
                image_response = requests.get(image_url)
                if image_response.status_code == 200:
                    image_data = BytesIO(image_response.content)

                    # S3에 업로드
                    bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")
                    object_name = f"album_covers/{os.path.basename(image_url)}"
                    s3_url = upload_to_s3(image_data, bucket_name, object_name)

                    if s3_url:
                        serializer.save(image_url=s3_url)
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
                    else:
                        return Response({"error": "Failed to upload to S3"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    return Response({"error": "Failed to download image"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({"error": "Failed to generate album cover"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

logging.basicConfig(level=logging.INFO)

class SunoClipView(APIView):

    def post(self, request):
        create_url = "https://api.sunoapi.com/api/v1/suno/create"
        create_payload = {
            "prompt": request.data.get("prompt", ""),
            "tags": request.data.get("tags", ""),
            "custom_mode": request.data.get("custom_mode", False),
            "title": request.data.get("title", "")
        }

        # 페이로드 확인을 위한 로깅
        logging.debug(f"Create payload: {create_payload}")

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.getenv('SUNO_API_KEY')}"
        }

        try:
            create_response = requests.post(create_url, headers=headers, data=json.dumps(create_payload))
            create_response.raise_for_status()

            task_data = create_response.json()
            task_id = task_data['data']['task_id']
            logging.info(f"Task ID: {task_id}")

            clip_url = f"https://api.sunoapi.com/api/v1/suno/clip/{task_id}"

            while True:
                clip_response = requests.get(clip_url, headers=headers)
                clip_response.raise_for_status()

                clip_data = clip_response.json()
                clip_status = clip_data['data']['status']
                if clip_status == 'completed':
                    logging.info("Clip completed!")
                    clips = clip_data['data']['clips']
                    audio_url = next((clip_info['audio_url'] for clip_id, clip_info in clips.items()), None)
                    break
                elif clip_status == 'processing':
                    logging.info("Clip is still processing. Checking again in 10 seconds...")
                    time.sleep(10)
                else:
                    logging.error(f"Unexpected status: {clip_status}")
                    return Response({"error": "Unexpected status"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except requests.exceptions.RequestException as e:
            logging.error(f"Request failed: {e}")
            return Response({"error": f"Failed to create clip due to request exception: {e}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def download_file(url, local_filename):
            try:
                with requests.get(url, stream=True) as r:
                    r.raise_for_status()
                    with open(local_filename, 'wb') as f:
                        for chunk in r.iter_content(chunk_size=8192):
                            f.write(chunk)
                return local_filename
            except Exception as e:
                logging.error(f"Failed to download file: {e}")
                return None

        def upload_to_s3(file_name, bucket, object_name=None):
            s3_client = boto3.client(
                's3',
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
                region_name=os.getenv('AWS_DEFAULT_REGION')
            )

            try:
                s3_client.upload_file(file_name, bucket, object_name or file_name, ExtraArgs={'ACL': 'public-read'})
                s3_url = f"https://{bucket}.s3.amazonaws.com/{object_name or file_name}"
                logging.info(f"File uploaded successfully to {s3_url}")
                return s3_url
            except FileNotFoundError:
                logging.error("The file was not found")
                return None
            except NoCredentialsError:
                logging.error("Credentials not available")
                return None

        file_url = audio_url
        local_file_name = 'downloaded_file.mp3'
        bucket_name = os.getenv('AWS_STORAGE_BUCKET_NAME')
        unique_id = uuid.uuid4()
        s3_object_name = f'uploaded_file_{unique_id}.mp3'

        downloaded_file = download_file(file_url, local_file_name)
        if not downloaded_file:
            return Response({"error": "Failed to download file"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        s3_url = upload_to_s3(downloaded_file, bucket_name, s3_object_name)

        if s3_url:
            return Response({"audio_url": s3_url}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Failed to upload to S3"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)