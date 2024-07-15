from django.contrib import admin
from .models import PosterGeneration  # ImageAnalysis 대신 PosterGeneration을 import

@admin.register(PosterGeneration)
class PosterGenerationAdmin(admin.ModelAdmin):
    list_display = ['id', 'original_image_url', 'poster_url', 'created_at']
    search_fields = ['original_image_url', 'poster_url']
    list_filter = ['created_at']