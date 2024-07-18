import os
import uuid
import django
import textwrap
import boto3
from botocore.config import Config
from botocore.exceptions import NoCredentialsError
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import PosterImage, LogoImage, ImageAnalysis
from .serializers import PosterImageSerializer, LogoImageSerializer
import requests
from googletrans import Translator
from io import BytesIO
from drf_yasg.utils import swagger_auto_schema
from dotenv import load_dotenv
import json
import logging
import time
import base64
from django.conf import settings
from drf_yasg import openapi
from rest_framework.parsers import MultiPartParser, FormParser

# Load environment variables
load_dotenv()

# DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Django setup
django.setup()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class AnalyzeImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = []
    permission_classes = []

    @swagger_auto_schema(
        operation_description="이미지를 업로드하여 분석합니다",
        manual_parameters=[
            openapi.Parameter(
                name="image",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=True,
                description="분석할 이미지 파일"
            ),
        ],
        responses={
            200: openapi.Response('성공적인 응답', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'analysis_result': openapi.Schema(type=openapi.TYPE_STRING,
                                                      description='OpenAI로부터의 분석 결과'),
                    'analysis_id': openapi.Schema(type=openapi.TYPE_INTEGER,
                                                  description='생성된 ImageAnalysis 객체의 ID'),
                }
            )),
            400: '잘못된 요청',
            500: '내부 서버 오류',
        }
    )
    def post(self, request):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'Image file is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            image_data = image_file.read()
            base64_image = base64.b64encode(image_data).decode('utf-8')
            analysis = self.analyze_image(base64_image)

            image_analysis = ImageAnalysis.objects.create(
                image_url="",
                analysis_result=analysis
            )

            return Response({'analysis': analysis, 'analysis_id': image_analysis.id}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in image analysis: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def analyze_image(self, base64_image):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"
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

        if response.status_code != 200:
            logger.error(f"API request failed with status {response.status_code}: {response.text}")
            raise ValueError(f"API request failed with status {response.status_code}: {response.text}")

        response_json = response.json()
        if 'choices' in response_json and len(response_json['choices']) > 0:
            return response_json['choices'][0]['message']['content']
        else:
            logger.error(f"Unexpected response format: {response_json}")
            raise ValueError(f"Unexpected response format: {response_json}")

def generate_image(api_key, prompt):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"
    }

    payload = {
        "prompt": prompt,
        "size": "1024x1024",
        "n": 1,
        "model": "dall-e-3"
    }

    try:
        response = requests.post("https://api.openai.com/v1/images/generations", headers=headers, json=payload)
        response.raise_for_status()
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"OpenAI API request failed: {e}")
        return {"error": str(e)}


def translate_to_english(text):
    try:
        translator = Translator()
        translation = translator.translate(text, src='ko', dest='en')
        return translation.text
    except Exception as e:
        logger.error(f"Translation Error: {e}")
        return text  # 번역에 실패하면 원본 텍스트를 반환

def truncate_text(text, limit):
    return textwrap.shorten(text, width=limit, placeholder="...")

# def upload_to_s3(image_data, bucket_name, object_name):
#     s3 = boto3.client(
#         's3',
#         aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
#         aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
#         region_name=os.getenv('AWS_DEFAULT_REGION')
#     )
#     try:
#         s3.upload_fileobj(
#             image_data,
#             bucket_name,
#             object_name,
#             ExtraArgs={'ACL': 'public-read'}  # 공개 읽기 권한 설정
#         )
#         object_url = f"https://{bucket_name}.s3.{os.getenv('AWS_DEFAULT_REGION')}.amazonaws.com/{object_name}"
#         return object_url
#     except NoCredentialsError:
#         logger.error("S3 Upload Error: No AWS credentials found.")
#         return None
#     except Exception as e:
#         logger.error(f"S3 Upload Error: {e}")
#         return None
def upload_to_s3(image_data, bucket_name, object_name):
    # TODO 1 사진을 s3 버킷에 올리기
    s3 = boto3.resource(  # S3 버킷 등록하기
        's3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
        config=Config(signature_version='s3v4')  # 이건 뭘까
    )
    random_number = str(uuid.uuid4())
    s3.Bucket(bucket_name).put_object(Key=random_number, Body=image_data, ContentType='image/jpg')

    # TODO 2 사진 url을 받아옴
    image_url = f"https://{bucket_name}.s3.ap-northeast-2.amazonaws.com/{random_number}"
    print("###############")
    print(image_url)
    print("###############")
    return image_url


class PosterImageView(APIView):

    @swagger_auto_schema(
        request_body=PosterImageSerializer,
        responses={201: PosterImageSerializer, 400: 'Bad Request'}
    )
    def post(self, request):
        logging.info(f"Request data: {request.data}")

        serializer = PosterImageSerializer(data=request.data)
        if serializer.is_valid():
            style = serializer.validated_data.get('style', '')
            color = serializer.validated_data.get('color', '')
            poster_user_text = serializer.validated_data.get('poster_user_text', '')  # 사용자 텍스트 받기

            # 가장 최근의 ImageAnalysis 객체 가져오기
            try:
                image_analysis = ImageAnalysis.objects.latest('id')
                poster_text = image_analysis.analysis_result
            except ImageAnalysis.DoesNotExist:
                return Response({"error": "No ImageAnalysis found"}, status=status.HTTP_400_BAD_REQUEST)

            # 프롬프트를 영어로 번역
            translated_poster_text = translate_to_english(poster_text)
            translated_user_text = translate_to_english(poster_user_text)

            prompt = (
                f"Create a poster that accurately depicts: {translated_poster_text}. "
            )
            # 1000자 이내로 축약
            prompt = f"The overall mood should be: {style} and primary color is {color}. Include the following text: {translated_user_text}" + truncate_text(
                prompt, 900)

            logging.info(f"Generated prompt: {prompt}")

            api_key = os.getenv("OPENAI_API_KEY")
            response = generate_image(api_key, prompt)

            # 응답 데이터 로그 추가
            logging.info(f"OpenAI API response: {response}")

            if "data" in response and len(response["data"]) > 0:
                poster_url = response["data"][0]["url"]

                # 이미지 다운로드
                image_response = requests.get(poster_url)
                if image_response.status_code == 200:
                    image_data = BytesIO(image_response.content)

                    # S3에 업로드
                    bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")
                    object_name = f"Poster/{uuid.uuid4().hex}.png"
                    object_url = upload_to_s3(image_data, bucket_name, object_name)

                    if object_url:
                        # PosterImage 객체 생성
                        poster_image = PosterImage.objects.create(
                            style=style,
                            color=color,
                            poster_user_text=poster_user_text,
                            poster_url=object_url,
                            image_analysis=image_analysis  # ForeignKey 필드 설정
                        )
                        return Response(PosterImageSerializer(poster_image).data, status=status.HTTP_201_CREATED)
                    else:
                        return Response({"error": "Failed to upload to S3"},
                                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    logging.error(f"Failed to download image: Status code {image_response.status_code}")
                    return Response({"error": "Failed to download image"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                logging.error("OpenAI API response does not contain 'data' or 'data' is empty")
                return Response({"error": "Failed to generate album cover"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        logging.error(f"Invalid data: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoImageView(APIView):

    @swagger_auto_schema(
        request_body=LogoImageSerializer,
        responses={201: LogoImageSerializer, 400: 'Bad Request'}
    )
    def post(self, request):
        serializer = LogoImageSerializer(data=request.data)
        if serializer.is_valid():
            style = serializer.validated_data.get('style', '')
            color = serializer.validated_data.get('color', '')
            logo_text = serializer.validated_data.get('logo_text', '')

            translated_logo_text = translate_to_english(logo_text)

            prompt = f"Create a logo that accurately depicts: {translated_logo_text}. The overall mood should be: {style} and primary color is {color}."
            prompt = truncate_text(prompt, 1000)

            logger.info(f"Generated prompt for logo: {prompt}")

            try:
                response = generate_image(prompt)

                if "data" in response and len(response["data"]) > 0:
                    logo_url = response["data"][0]["url"]

                    image_response = requests.get(logo_url)
                    if image_response.status_code == 200:
                        image_data = BytesIO(image_response.content)

                        bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")
                        object_name = f"Logo/{os.path.basename(logo_url)}"
                        object_url = upload_to_s3(image_data, bucket_name, object_name)

                        if object_url:
                            serializer.save(logo_url=object_url)
                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        else:
                            return Response({"error": "Failed to upload to S3"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    else:
                        return Response({"error": "Failed to download image"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    return Response({"error": "Failed to generate logo"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                logger.error(f"Error generating logo: {str(e)}")
                return Response({"error": f"Error generating logo: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def download_file(url, local_filename):
    try:
        with requests.get(url, stream=True) as r:
            r.raise_for_status()
            with open(local_filename, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
        return local_filename
    except Exception as e:
        logger.error(f"Failed to download file: {e}")
        return None

class SunoClipView(APIView):

    def post(self, request):
        create_url = "https://api.sunoapi.com/api/v1/suno/create"
        create_payload = {
            "prompt": "",
            "tags": "CM song",
            "custom_mode": True,
            "title": ""
        }

        logger.debug(f"Suno API Create payload: {create_payload}")

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.getenv('SUNO_API_KEY')}"
        }

        try:
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
                    return Response({"error": "Unexpected status"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            local_file_name = 'downloaded_file.mp3'
            bucket_name = os.getenv('AWS_STORAGE_BUCKET_NAME')
            unique_id = uuid.uuid4()
            s3_object_name = f'music/{unique_id}.mp3'

            downloaded_file = download_file(audio_url, local_file_name)
            if not downloaded_file:
                return Response({"error": "Failed to download file"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            s3_url = upload_to_s3(downloaded_file, bucket_name, s3_object_name)

            if s3_url:
                return Response({"audio_url": s3_url}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Failed to upload to S3"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except requests.exceptions.RequestException as e:
            logger.error(f"Suno API request failed: {e}")
            return Response({"error": f"Failed to create clip due to request exception: {e}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)