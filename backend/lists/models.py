from django.db import models
from django.conf import settings

class SavedContent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_contents')
    logo_url = models.URLField()
    poster_url = models.URLField()
    audio_url = models.URLField()
    # deleted = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"SavedContent {self.id} for {self.user.username}"