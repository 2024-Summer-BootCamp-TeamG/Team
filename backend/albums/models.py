from django.db import models

class ImageAnalysis(models.Model):
    image_url = models.URLField(max_length=255)
    image_analysis = models.TextField()
    psychological_interpretation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'image_analysis'