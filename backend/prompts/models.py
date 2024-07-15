# prompts/models.py

from django.db import models

class PosterImage(models.Model):
    style = models.CharField(max_length=50)
    color = models.CharField(max_length=20)
    poster_text = models.TextField()
    poster_url = models.URLField(max_length=1000, blank=True, null=True)  # 길이를 충분히 늘림
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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