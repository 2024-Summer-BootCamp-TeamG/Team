from rest_framework import serializers
from .models import SavedContent

class SavedContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedContent
        fields = ['id', 'logo_url']
        ref_name = "ListsSavedContent"

class SavedContentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedContent
        fields = ['id', 'logo_url', 'poster_url', 'music_url']
        ref_name = "ListsSavedContentDetail"