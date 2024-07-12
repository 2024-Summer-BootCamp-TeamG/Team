from django.db import models
import boto3
from django.conf import settings

class Album(models.Model):
    title = models.CharField(max_length=255)
    image_url = models.URLField(max_length=1000)
    music_url = models.URLField(max_length=1000)
    album_cover_url = models.URLField(max_length=1000)
    analysis_result = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # 데이터베이스 테이블 이름 지정
        db_table = 'album'

    def delete(self, *args, **kwargs):
        # S3 클라이언트 생성
        s3 = boto3.client('s3',
                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                          region_name=settings.AWS_DEFAULT_REGION)

        # 이미지, 음악, 앨범 커버 파일 삭제
        for url_field in ['image_url', 'music_url', 'album_cover_url']:
            url = getattr(self, url_field)
            if url and settings.AWS_STORAGE_BUCKET_NAME in url:
                try:
                    # URL에서 S3 객체 키 추출
                    key = url.split(f"{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/")
                    if len(key) > 1:
                        s3.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key[1])
                except Exception as e:
                    print(f"Error deleting file from S3: {e}")

        # 상위 클래스의 delete 메소드 호출
        super().delete(*args, **kwargs)

class ImageAnalysis(models.Model):
    # 분석된 이미지의 URL
    image_url = models.URLField(max_length=255)
    # 이미지 분석 결과
    analysis_result = models.TextField()
    # 분석 실행 시간
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # 데이터베이스 테이블 이름 지정
        db_table = 'image_analysis'
        # 생성 시간 역순으로 정렬
        ordering = ['-created_at']