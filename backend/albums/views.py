import base64
import uuid
import requests
import boto3
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

@method_decorator(csrf_exempt, name='dispatch')
class AnalyzeImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = []  # 인증 비활성화
    permission_classes = []  # 권한 체크 비활성화

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
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'Image file is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            s3_url = self.upload_to_s3(image_file)
            if not s3_url:
                return Response({'error': 'Failed to upload image to S3'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            image_data = self.get_image_from_url(s3_url)
            base64_image = self.encode_image(image_data)
            analysis_result = self.analyze_image(settings.OPENAI_API_KEY, base64_image)

            analysis_id = self.save_to_mysql(s3_url, analysis_result)

            return Response({
                'analysis_id': analysis_id,
                'image_url': s3_url,
                'image_analysis': analysis_result['image_analysis'],
                'psychological_interpretation': analysis_result['psychological_interpretation']
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # 나머지 메서드들은 그대로 유지

    def upload_to_s3(self, file):
        # AWS S3 클라이언트 생성
        s3 = boto3.client('s3',
                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                          region_name=settings.AWS_DEFAULT_REGION)

        try:
            # 파일 이름에 UUID 추가하여 고유성 보장
            file_name = f"{uuid.uuid4()}.{file.name.split('.')[-1]}"
            # S3에 파일 업로드
            s3.upload_fileobj(file, settings.AWS_STORAGE_BUCKET_NAME, file_name)
            # 업로드된 파일의 URL 반환
            return f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_DEFAULT_REGION}.amazonaws.com/{file_name}"
        except NoCredentialsError:
            print("AWS 자격 증명을 찾을 수 없습니다.")
        except Exception as e:
            print(f"S3에 이미지를 업로드하는 중 오류 발생: {str(e)}")
        return None

    def get_image_from_url(self, url):
        parsed_url = urlparse(url)

        if parsed_url.scheme == 's3':
            # S3 URL (s3://bucket-name/path/to/image.jpg)
            bucket_name = parsed_url.netloc
            object_key = parsed_url.path.lstrip('/')
            return self.get_image_from_s3(bucket_name, object_key)
        elif 's3.amazonaws.com' in parsed_url.netloc:
            # S3 public URL (https://bucket-name.s3.region.amazonaws.com/path/to/image.jpg)
            bucket_name = parsed_url.netloc.split('.')[0]
            object_key = parsed_url.path.lstrip('/')
            return self.get_image_from_s3(bucket_name, object_key)
        else:
            # Regular HTTP/HTTPS URL
            response = requests.get(url)
            if response.status_code == 200:
                return response.content
        return None

    def get_image_from_s3(self, bucket_name, object_key):
        # S3 클라이언트 생성
        s3 = boto3.client('s3',
                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                          region_name=settings.AWS_DEFAULT_REGION)
        try:
            # S3에서 객체 가져오기
            response = s3.get_object(Bucket=bucket_name, Key=object_key)
            return response['Body'].read()
        except NoCredentialsError:
            print("AWS 자격 증명을 찾을 수 없습니다.")
        except Exception as e:
            print(f"S3에서 이미지를 불러오는 중 오류 발생: {str(e)}")
        return None

    def encode_image(self, image_data):
        # 이미지 데이터를 base64로 인코딩
        return base64.b64encode(image_data).decode('utf-8')

    import json

    def analyze_image(self, api_key, base64_image):
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
                            "text": "이 이미지에 대해 다음 두 가지 관점에서 분석해 주세요:\n\n1. 이미지 분석: 이미지의 내용, 구도, 색감, 분위기 등에 대해 상세히 설명해 주세요.\n\n2. 심리학적 해석: 이 이미지가 주는 심리적 인상과 잠재적 의미에 대해 분석해 주세요.\n\n각 부분을 '이미지 분석:'과 '심리학적 해석:'으로 시작하여 명확히 구분해 주세요."
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

        try:
            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            response.raise_for_status()  # 이 줄이 HTTP 오류를 검출합니다

            print(f"API Response Status: {response.status_code}")
            print(f"API Response Headers: {json.dumps(dict(response.headers), indent=2)}")
            print(f"API Response Content: {response.text}")

            result = response.json()

            if 'choices' not in result or not result['choices']:
                raise ValueError(f"Unexpected API response structure: {result}")

            return self.parse_analysis_result(result)

        except requests.RequestException as e:
            print(f"API request failed: {e}")
            raise
        except json.JSONDecodeError as e:
            print(f"Failed to decode API response: {e}")
            print(f"Response content: {response.text}")
            raise
        except ValueError as e:
            print(f"Failed to parse API response: {e}")
            raise
        except Exception as e:
            print(f"Unexpected error: {e}")
            raise

    def parse_analysis_result(self, result):
        content = result['choices'][0]['message']['content']
        image_analysis = ''
        psychological_interpretation = ''

        parts = content.split('심리학적 해석:')
        if len(parts) > 1:
            image_analysis = parts[0].replace('이미지 분석:', '').strip()
            psychological_interpretation = parts[1].strip()

        return {
            'image_analysis': image_analysis,
            'psychological_interpretation': psychological_interpretation
        }

    def save_to_mysql(self, image_url, analysis_result):
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO image_analysis (image_url, image_analysis, psychological_interpretation, created_at)
                VALUES (%s, %s, %s, NOW())
            """, [image_url, analysis_result['image_analysis'], analysis_result['psychological_interpretation']])
        return cursor.lastrowid
