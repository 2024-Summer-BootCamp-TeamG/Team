# lists/models.py
from django.db import models
from django.conf import settings
from users.models import User
from prompts.models import Media

class SavedContent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    media = models.ForeignKey(Media, on_delete=models.CASCADE)

    def __str__(self):
        return f"SavedContent {self.id}"
