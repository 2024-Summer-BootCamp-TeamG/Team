from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class SavedContent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    logo_url = models.URLField()
    poster_url = models.URLField()
    audio_url = models.URLField()
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'contents_savedcontent'

    def __str__(self):
        return f"SavedContent {self.id} for {self.user.username}"