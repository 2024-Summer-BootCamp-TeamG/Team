import base64
import uuid
import requests
import boto3
import logging
from botocore.exceptions import NoCredentialsError
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from urllib.parse import urlparse
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.parsers import MultiPartParser, FormParser
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from .models import PosterGeneration
from django.http import JsonResponse

# 로깅 설정
logger = logging.getLogger(__name__)


def handler500(request):
    return JsonResponse({'error': 'Internal server error'}, status=500)


def handler404(request, exception):
    return JsonResponse({'error': 'Not found'}, status=404)


@method_decorator(csrf_exempt, name='dispatch')
class AnalyzeImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = []
    permission_classes = []

    @swagger_auto_schema(
        operation_description="Analyze an uploaded image and generate a poster",
        manual_parameters=[
            openapi.Parameter(
                name="image",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=True,
                description="Image file to analyze and create poster from"
            ),
            openapi.Parameter(
                name="prompt",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_STRING,
                required=False,
                description="Additional instructions for poster generation"
            ),
        ],
        responses={
            200: openapi.Response('Successful Response', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'poster_url': openapi.Schema(type=openapi.TYPE_STRING, description='URL of the generated poster'),
                    'image_analysis': openapi.Schema(type=openapi.TYPE_STRING,
                                                     description='Analysis of the original image'),
                }
            )),
            400: 'Bad Request',
            500: 'Internal Server Error',
        }
    )
    def post(self, request):
        image_file = request.FILES.get('image')
        prompt = request.POST.get('prompt', '')

        if not image_file:
            return Response({'error': 'Image file is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            s3_url = self.upload_to_s3(image_file)
            if not s3_url:
                return Response({'error': 'Failed to upload image to S3'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            image_data = self.get_image_from_url(s3_url)
            base64_image = self.encode_image(image_data)

            analysis = self.analyze_image(base64_image)
            poster_url = self.generate_poster(analysis, prompt)

            poster_generation = PosterGeneration.objects.create(
                original_image_url=s3_url,
                poster_url=poster_url,
                image_analysis=analysis
            )

            return Response({
                'poster_url': poster_url,
                'image_analysis': analysis,
                'generation_id': poster_generation.id
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in AnalyzeImageView: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def upload_to_s3(self, file):
        """S3에 파일 업로드"""
        s3 = boto3.client('s3',
                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                          region_name=settings.AWS_DEFAULT_REGION)

        try:
            file_name = f"{uuid.uuid4()}.{file.name.split('.')[-1]}"
            s3.upload_fileobj(file, settings.AWS_STORAGE_BUCKET_NAME, file_name)
            return f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_DEFAULT_REGION}.amazonaws.com/{file_name}"
        except NoCredentialsError:
            logger.error("AWS credentials not found")
        except Exception as e:
            logger.error(f"Error uploading to S3: {str(e)}")
        return None

    def get_image_from_url(self, url):
        """URL에서 이미지 데이터 가져오기"""
        parsed_url = urlparse(url)

        if parsed_url.scheme == 's3':
            bucket_name = parsed_url.netloc
            object_key = parsed_url.path.lstrip('/')
            return self.get_image_from_s3(bucket_name, object_key)
        elif 's3.amazonaws.com' in parsed_url.netloc:
            bucket_name = parsed_url.netloc.split('.')[0]
            object_key = parsed_url.path.lstrip('/')
            return self.get_image_from_s3(bucket_name, object_key)
        else:
            response = requests.get(url)
            if response.status_code == 200:
                return response.content
        return None

    def get_image_from_s3(self, bucket_name, object_key):
        """S3에서 이미지 데이터 가져오기"""
        s3 = boto3.client('s3',
                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                          region_name=settings.AWS_DEFAULT_REGION)
        try:
            response = s3.get_object(Bucket=bucket_name, Key=object_key)
            return response['Body'].read()
        except NoCredentialsError:
            logger.error("AWS credentials not found")
        except Exception as e:
            logger.error(f"Error getting image from S3: {str(e)}")
        return None

    def encode_image(self, image_data):
        """이미지 데이터를 base64로 인코딩"""
        if image_data is None:
            return None
        return base64.b64encode(image_data).decode('utf-8')

    def analyze_image(self, base64_image):
        """OpenAI API를 사용하여 이미지 분석"""
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}"
        }
        payload = {
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "이 이미지를 자세히 분석해주세요. 주요 요소, 색상, 분위기 등을 설명해주세요."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 300
        }
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        response_json = response.json()
        return response_json['choices'][0]['message']['content']

    def generate_poster(self, analysis, prompt):
        """DALL-E를 사용하여 포스터 생성"""
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}"
        }
        payload = {
            "model": "dall-e-3",
            "prompt": f"다음 이미지 분석을 바탕으로 이 제품의 장점을 강조한 포스터를 만들어주세요. 그리고 로고도 생성해서 포스터 좌측하단에 넣어주세요.: {analysis}\n추가 지시사항: {prompt}",
            "size": "1024x1024",
            "quality": "standard",
            "n": 1
        }
        response = requests.post("https://api.openai.com/v1/images/generations", headers=headers, json=payload)
        response_json = response.json()
        return response_json['data'][0]['url']


@method_decorator(csrf_exempt, name='dispatch')
class CreateAlbumView(APIView):
    def post(self, request):
        # AnalyzeImageView로 리다이렉트
        return AnalyzeImageView.as_view()(request._request)


@method_decorator(csrf_exempt, name='dispatch')
class DeleteAlbumView(APIView):
    @swagger_auto_schema(
        operation_description="Delete a generated poster",
        responses={
            204: openapi.Response(description="Poster successfully deleted"),
            404: openapi.Response(description="Poster not found"),
        }
    )
    def delete(self, request, album_id):
        try:
            poster = get_object_or_404(PosterGeneration, id=album_id)
            poster.delete()
            return Response({"message": "포스터가 성공적으로 삭제되었습니다."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error in DeleteAlbumView: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)