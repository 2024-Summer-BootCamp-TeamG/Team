from django.contrib import admin
from .models import SavedContent

@admin.register(SavedContent)
class SavedContentAdmin(admin.ModelAdmin):
    list_display = ('user', 'logo_url', 'id')  # 'created_at' 제거
    list_filter = ('user',)  # 'created_at' 제거
    search_fields = ('user__username', 'logo_url')