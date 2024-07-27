import os
import uuid
import django
import textwrap
import boto3
from botocore.config import Config
from botocore.exceptions import NoCredentialsError
from django.utils.decorators import method_decorator
# from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Media
from .serializers import PosterImageSerializer, LogoImageSerializer, MediaSerializer, PosterURLSerializer
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
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BasicAuthentication
from django.http import JsonResponse
from celery.result import AsyncResult
from .tasks import analyze_image_task



# Load environment variables
load_dotenv()

# DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Django setup
django.setup()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AuthenticatedAPIView(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]


from .tasks import analyze_image_task, suno_clip_task

class StartAnalysisAndClipView(AuthenticatedAPIView):
    parser_classes = (MultiPartParser, FormParser)

    @swagger_auto_schema(
        operation_description="이미지를 업로드하여 분석하고, Suno 클립을 생성합니다",
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
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description='작업 시작 메시지'),
                }
            )),
            400: '잘못된 요청',
            401: '인증되지 않음',
            500: '내부 서버 오류',
        }
    )
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'Image file is required'}, status=status.HTTP_400_BAD_REQUEST)

        image_data = image_file.read()

        user_id = request.user.id
        logger.info(f"Starting task for user_id: {user_id}")

        # Celery 비동기 작업 시작
        task = analyze_image_task.delay(base64.b64encode(image_data).decode('utf-8'), user_id)

        return Response({"task_id": task.id}, status=202)


class GetTaskStatusView(APIView):

    @swagger_auto_schema(
        operation_description="비동기 작업의 상태를 조회합니다",
        manual_parameters=[
            openapi.Parameter(
                name="task_id",
                in_=openapi.IN_PATH,
                type=openapi.TYPE_STRING,
                required=True,
                description="비동기 작업 ID"
            ),
        ],
        responses={
            200: openapi.Response('성공적인 응답', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'task_id': openapi.Schema(type=openapi.TYPE_STRING, description='작업 ID'),
                    'task_status': openapi.Schema(type=openapi.TYPE_STRING, description='작업 상태'),
                    'analysis_result': openapi.Schema(type=openapi.TYPE_STRING, description='분석 결과'),
                    'clip_url': openapi.Schema(type=openapi.TYPE_STRING, description='클립 URL'),
                }
            )),
            400: '잘못된 요청',
        }
    )
    def get(self, request, task_id):
        logger.info(f"Received status request for task: {task_id}")

        if not task_id:
            logger.warning("No task ID provided")
            return Response({'error': 'Task ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        task_result = AsyncResult(task_id)
        media_id = task_result.result

        if media_id:
            media = Media.objects.get(id=media_id)
            result = {
                "task_id": task_id,
                "task_status": task_result.status,
                "analysis_result": media.text_result,
                "clip_url": media.music_url,
            }
            logger.info(f"Task {task_id} completed. Status: {task_result.status}")
        else:
            result = {
                "task_id": task_id,
                "task_status": task_result.status,
                "analysis_result": None,
                "clip_url": None,
            }
            logger.info(f"Task {task_id} in progress. Status: {task_result.status}")
        return Response(result, status=200)
class AnalyzeImageView(AuthenticatedAPIView):
    parser_classes = (MultiPartParser, FormParser)

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
                    'text_result': openapi.Schema(type=openapi.TYPE_STRING,description='OpenAI로부터의 분석 결과'),
                }
            )),
            400: '잘못된 요청',
            401: '인증되지 않음',
            500: '내부 서버 오류',
        }
    )
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'Image file is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            image_data = image_file.read()
            base64_image = base64.b64encode(image_data).decode('utf-8')
            analysis = self.analyze_image(base64_image)

            Media.objects.create(
                user=request.user,  # 현재 로그인된 사용자 설정
                text_result=analysis
            )

            return Response({'analysis': analysis}, status=status.HTTP_200_OK)
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
api_key = os.getenv("OPENAI_API_KEY")
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

def upload_to_s3_music(file_name, bucket, object_name=None):
    s3_client = boto3.client('s3')
    if object_name is None:
        object_name = file_name

    try:
        with open(file_name, 'rb') as file_obj:
            s3_client.upload_fileobj(file_obj, bucket, object_name)
        s3_url = f"https://{bucket}.s3.amazonaws.com/{object_name}"
        return s3_url
    except NoCredentialsError:
        logger.error("S3 credentials not available")
        return None
    except Exception as e:
        logger.error(f"S3 Upload Error: {e}")
        return None

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
                latest_id = Media.objects.latest('id')
                poster_text = latest_id.text_result
            except Media.DoesNotExist:
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
                        latest_id = Media.objects.latest('id')
                        # Media 모델의 poster_url 필드 업데이트
                        latest_id.poster_url = object_url
                        latest_id.save()

                        # 올바른 필드로 MediaSerializer 생성
                        return Response(PosterURLSerializer({'poster_url': object_url}).data,status=status.HTTP_201_CREATED)
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
    permission_classes = [IsAuthenticated]

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

            prompt = (
                f"Create a single, professional logo for: {translated_logo_text}.\n\n"
                f"Logo specifications:\n"
                f"1. Style: {style} - Apply this style to the overall design.\n"
                f"2. Primary color: {color} - Use this as the main color.\n"
                f"3. Simplicity: Design a clean, uncluttered logo that's instantly recognizable.\n"
                f"4. Concept: Visually represent the core idea or value of '{translated_logo_text}' in an abstract or literal way.\n"
                f"6. Typography: If including text, choose a font that reflects the brand's personality.\n"
                f"8. Uniqueness: Create a logo that stands out and is not generic.\n"
                f"9. Relevance: The logo should clearly relate to the brand's industry or purpose.\n\n"
                f"Additional instructions:\n"
                f"- Focus on creating only ONE logo design, not multiple variations.\n"
                f"- Avoid using generic or cliché symbols unless they are highly relevant to the brand.\n"
                f"Generate a single, impactful logo that effectively represents the brand and its values."
            )
            prompt = truncate_text(prompt, 1000)

            logger.info(f"Generated prompt for logo: {prompt}")

            try:
                response = generate_image(api_key, prompt)

                if "data" in response and len(response["data"]) > 0:
                    logo_url = response["data"][0]["url"]

                    image_response = requests.get(logo_url)
                    if image_response.status_code == 200:
                        image_data = BytesIO(image_response.content)

                        bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")
                        object_name = f"Logo/{os.path.basename(logo_url)}"
                        object_url = upload_to_s3(image_data, bucket_name, object_name)

                        if object_url:
                            # 로그인한 사용자 정보를 추가
                            user = request.user

                            # 가장 최근에 생성된 Media 객체를 찾기
                            try:
                                media = Media.objects.filter(user=user).latest('created_at')
                                media.logo_url = object_url
                                media.save()
                            except Media.DoesNotExist:
                                return Response({"error": "Media object not found for the user"}, status=status.HTTP_404_NOT_FOUND)

                            return Response({
                                'user_id': media.user.id,
                                'logo_url': media.logo_url
                            }, status=status.HTTP_201_CREATED)
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
            "prompt": f"",
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

            s3_url = upload_to_s3_music(downloaded_file, bucket_name, s3_object_name)

            if s3_url:
                # 가장 최근의 Media 객체 가져오기
                try:
                    latest_media = Media.objects.latest('id')
                    latest_media.music_url = s3_url
                    latest_media.save()
                except Media.DoesNotExist:
                    return Response({"error": "No Media found"}, status=status.HTTP_400_BAD_REQUEST)

                return Response({"audio_url": s3_url}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Failed to upload to S3"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except requests.exceptions.RequestException as e:
            logger.error(f"Suno API request failed: {e}")
            return Response({"error": f"Failed to create clip due to request exception: {e}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)