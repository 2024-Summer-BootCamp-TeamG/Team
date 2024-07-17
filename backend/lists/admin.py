from django.contrib import admin
from .models import SavedContent

@admin.register(SavedContent)
class SavedContentAdmin(admin.ModelAdmin):
    list_display = ('user', 'logo_url', 'created_at')
    list_filter = ('user', 'created_at')
    search_fields = ('user__username', 'logo_url')