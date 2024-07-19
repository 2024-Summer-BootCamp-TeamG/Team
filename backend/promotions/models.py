from django.db import models
from django.conf import settings
from prompts.models import Media

class SavedContent(models.Model):
    media = models.ForeignKey(Media, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        db_table = 'lists_savedcontent'
