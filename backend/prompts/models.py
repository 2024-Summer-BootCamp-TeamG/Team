# prompts/models.py

from django.db import models
class ImageAnalysis(models.Model):
    image_url = models.URLField(max_length=1000)
    analysis_result = models.TextField()
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # 데이터베이스 테이블 이름을 'image_analysis'로 설정합니다
        db_table = 'image_analysis'
        # 레코드를 기본적으로 'created_at' 필드를 기준으로 내림차순으로 정렬합니다
        ordering = ['-created_at']

    # 모델의 문자열 표현을 정의합니다
    def __str__(self):
        return f"Image Analysis {self.id}"




class PosterImage(models.Model):
    style = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    poster_user_text = models.TextField()
    poster_url = models.URLField(max_length=500)
    image_analysis = models.ForeignKey(ImageAnalysis, on_delete=models.CASCADE)  # ForeignKey로 정의
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.style



class LogoImage(models.Model):
    style = models.CharField(max_length=50)
    color = models.CharField(max_length=20)
    logo_text = models.TextField()
    logo_url = models.URLField(max_length=1000, blank=True, null=True)  # 길이를 충분히 늘림
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SunoClip(models.Model):
    title = models.CharField(max_length=255)
    audio_url = models.URLField(max_length=1024)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return self.title