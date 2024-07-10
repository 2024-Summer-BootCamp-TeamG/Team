# cover/utils.py

import boto3
import base64
from django.conf import settings
from io import BytesIO
"""
#S3에서 이미지를 가져와 Base64로 인코딩하는 유틸리티 함수입니다.
def get_image_base64_from_s3(image_url):
    s3 = boto3.client('s3', region_name=settings.AWS_DEFAULT_REGION,
                      aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                      aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    key = image_url.split(f"https://{bucket_name}.s3.amazonaws.com/")[-1]

    response = s3.get_object(Bucket=bucket_name, Key=key)
    image_data = response['Body'].read()
    encoded_image = base64.b64encode(image_data).decode('utf-8')
    return encoded_image
"""
#생성된 앨범커버를 s3에 업로드
def upload_image_to_s3(image_data, filename):
    s3 = boto3.client('s3', region_name=settings.AWS_S3_REGION_NAME,
                      aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                      aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
    buffer = BytesIO()
    buffer.write(base64.b64decode(image_data))
    buffer.seek(0)
    s3.upload_fileobj(buffer, settings.AWS_STORAGE_BUCKET_NAME, filename)
    return f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{filename}"