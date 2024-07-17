from django.db import models
from users.models import User

class Media(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # 외래 키 설정
    text_result = models.TextField(null=True, blank=True)
    poster_url = models.CharField(max_length=500, null=True, blank=True)
    logo_url = models.CharField(max_length=500, null=True, blank=True)
    music_url = models.CharField(max_length=500, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Media {self.id}'
