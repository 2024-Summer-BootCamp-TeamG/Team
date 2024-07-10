from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import ImageAnalysis

@admin.register(ImageAnalysis)
class ImageAnalysisAdmin(admin.ModelAdmin):
    list_display = ('image_url', 'created_at')
    search_fields = ('image_url', 'analysis_result')
    list_filter = ('created_at',)
    readonly_fields = ('created_at',)