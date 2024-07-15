from django.db import models
import boto3
from django.conf import settings
from django.db import models


class PosterGeneration(models.Model):
    original_image_url = models.URLField(max_length=1000)
    poster_url = models.URLField(max_length=1000)
    image_analysis = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'poster_generation'
        ordering = ['-created_at']

    def __str__(self):
        return f"Poster Generation {self.id}"

    def delete(self, *args, **kwargs):
        s3 = boto3.client('s3',
                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                          region_name=settings.AWS_DEFAULT_REGION)

        for url_field in ['original_image_url', 'poster_url']:
            url = getattr(self, url_field)
            if url and settings.AWS_STORAGE_BUCKET_NAME in url:
                try:
                    key = url.split(f"{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/")
                    if len(key) > 1:
                        s3.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key[1])
                except Exception as e:
                    print(f"Error deleting file from S3: {e}")

        super().delete(*args, **kwargs)