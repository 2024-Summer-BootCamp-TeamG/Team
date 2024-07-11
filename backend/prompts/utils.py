# cover/utils.py

import boto3
import base64
from django.conf import settings
from io import BytesIO

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