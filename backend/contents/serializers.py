from rest_framework import serializers
from .models import SavedContent

class SavedContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedContent
        fields = ['id', 'user', 'logo_url', 'poster_url', 'audio_url', 'created_at']
