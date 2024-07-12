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
from django.db import connection
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.parsers import MultiPartParser, FormParser
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from .models import Album, ImageAnalysis
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
        operation_description="Analyze an uploaded image",
        manual_parameters=[
            openapi.Parameter(
                name="image",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=True,
                description="Image file to analyze"
            ),
        ],
        responses={
            200: openapi.Response('Successful Response', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'analysis_result': openapi.Schema(type=openapi.TYPE_STRING,
                                                      description='Analysis result from OpenAI'),
                }
            )),
            400: 'Bad Request',
            500: 'Internal Server Error',
        }
    )
    def post(self, request):
        """이미지 분석 API"""
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'Image file is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # S3에 이미지 업로드
            s3_url = self.upload_to_s3(image_file)
            if not s3_url:
                return Response({'error': 'Failed to upload image to S3'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # 이미지 데이터 가져오기
            image_data = self.get_image_from_url(s3_url)
            # 이미지를 base64로 인코딩
            base64_image = self.encode_image(image_data)
            # OpenAI API를 사용하여 이미지 분석
            analysis_result = self.analyze_image(settings.OPENAI_API_KEY, base64_image)

            # 분석 결과를 MySQL에 저장
            self.save_to_mysql(s3_url, analysis_result)

            return Response(analysis_result)
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
        if image_data is None:
            return None
        """이미지 데이터를 base64로 인코딩"""
        return base64.b64encode(image_data).decode('utf-8')

    def analyze_image(self, api_key, base64_image):
        """OpenAI API를 사용하여 이미지 분석"""
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        payload = {
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "이 이미지에 대해 다음 두 가지 관점에서 분석해 주세요:\n\n1. 이미지 분석: 이미지의 내용, 구도, 색감, 분위기 등에 대해 상세히 설명해 주세요.\n\n2. 심리학적 해석: 이 이미지가 주는 심리적 인상과 잠재적 의미에 대해 분석해 주세요.\n\n각 부분을 명확히 구분하여 응답해 주시기 바랍니다."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 500
        }
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        return response.json()

    def save_to_mysql(self, image_url, analysis_result):
        """분석 결과를 MySQL에 저장"""
        content = analysis_result.get('choices', [{}])[0].get('message', {}).get('content', '')
        ImageAnalysis.objects.create(
            image_url=image_url,
            analysis_result=content
        )

@method_decorator(csrf_exempt, name='dispatch')
class CreateAlbumView(APIView):
    @swagger_auto_schema(
        operation_description="Create a new album",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['title', 'image_key', 'music_key', 'album_cover_key'],
            properties={
                'title': openapi.Schema(type=openapi.TYPE_STRING),
                'image_key': openapi.Schema(type=openapi.TYPE_STRING),
                'music_key': openapi.Schema(type=openapi.TYPE_STRING),
                'album_cover_key': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
        responses={
            201: openapi.Response('Created', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'album_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                },
            )),
            400: 'Bad Request',
            500: 'Internal Server Error',
        }
    )
    def post(self, request):
        """앨범 생성 API"""
        try:
            # 필수 필드 확인
            required_fields = ['title', 'image_key', 'music_key', 'album_cover_key']
            for field in required_fields:
                if field not in request.data:
                    return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)

            # S3에서 파일 URL 가져오기
            image_url = self.get_s3_file_url('images', request.data.get('image_key'))
            music_url = self.get_s3_file_url('music', request.data.get('music_key'))
            album_cover_url = self.get_s3_file_url('album_covers', request.data.get('album_cover_key'))

            # 이미지 분석 결과 가져오기
            analysis_result = self.get_analysis_result(image_url) or ''  # None일 경우 빈 문자열로 설정

            # 앨범 생성
            album = Album.objects.create(
                title=request.data.get('title'),
                image_url=image_url,
                music_url=music_url,
                album_cover_url=album_cover_url,
                analysis_result=analysis_result
            )

            return Response({'album_id': album.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error in CreateAlbumView: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_s3_file_url(self, folder, file_key):
        """S3 파일의 URL 생성"""
        s3 = boto3.client('s3',
                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                          region_name=settings.AWS_DEFAULT_REGION)

        url = s3.generate_presigned_url('get_object',
                                        Params={'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                                                'Key': f"{folder}/{file_key}"},
                                        ExpiresIn=3600)
        return url

    def get_analysis_result(self, image_url):
        """이미지 URL에 해당하는 분석 결과 가져오기"""
        try:
            analysis = ImageAnalysis.objects.filter(image_url=image_url).latest('created_at')
            return analysis.analysis_result
        except ImageAnalysis.DoesNotExist:
            return None


@method_decorator(csrf_exempt, name='dispatch')
class DeleteAlbumView(APIView):
    @swagger_auto_schema(
        operation_description="Delete an album",
        responses={
            204: openapi.Response(description="Album successfully deleted"),
            404: openapi.Response(description="Album not found"),
        }
    )
    def delete(self, request, album_id):
        """앨범 삭제 API"""
        try:
            album = get_object_or_404(Album, id=album_id)
            album.delete()
            return Response({"message": "앨범이 성공적으로 삭제되었습니다."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error in DeleteAlbumView: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

