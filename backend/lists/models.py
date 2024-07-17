from django.db import models
from django.conf import settings

class SavedContent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_contents')
    logo_url = models.URLField()
    poster_url = models.URLField()
    music_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s saved content"