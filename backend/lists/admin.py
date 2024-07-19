# lists/admin.py
from django.contrib import admin
from .models import SavedContent

@admin.register(SavedContent)
class SavedContentAdmin(admin.ModelAdmin):
    list_display = ('user', 'logo_url', 'id')
    list_filter = ('user',)
    search_fields = ('user__username', 'logo_url')

    def logo_url(self, obj):
        return obj.media.logo_url  # Media 모델의 logo_url 필드를 반환

    logo_url.short_description = 'Logo URL'
