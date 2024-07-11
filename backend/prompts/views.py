import os
import django
import textwrap
import boto3
from botocore.exceptions import NoCredentialsError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import AlbumCover
from .serializers import AlbumCoverSerializer
import requests
from googletrans import Translator
from io import BytesIO
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi



# DJANGO_SETTINGS_MODULE 환경 변수 설정
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Django 설정 초기화
django.setup()

# DALL-E API 요청 보내기
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

    # 응답 상태 코드와 본문을 출력
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

@swagger_auto_schema(    #테스트용 나중에지우셈 이부분
    method='post',
    request_body=AlbumCoverSerializer,
    responses={201: AlbumCoverSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
def create_album_cover(request):
    if request.method == 'POST':
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
                f"The overall mood should be: {mood}."
                f"Include elements that convey the emotions described in: {translated_analysis_text}. "
            )
            # 1000자 이내로 축약
            prompt = f"The overall mood should be: {mood} and Please ensure the image contains no text." + truncate_text(prompt, 930)

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

    return Response({"error": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)
