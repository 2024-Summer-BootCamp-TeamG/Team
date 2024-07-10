# prompts/models.py

from django.db import models

class AlbumCover(models.Model):
    mood = models.CharField(max_length=50)
    analysis_text = models.TextField()
    image_text = models.TextField()
    image_url = models.URLField(max_length=1000, blank=True, null=True)  # 길이를 충분히 늘림
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.mood
