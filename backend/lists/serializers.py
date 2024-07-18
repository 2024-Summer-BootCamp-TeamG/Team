from rest_framework import serializers
from .models import SavedContent
from prompts.models import Media

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'logo_url', 'poster_url', 'music_url']  # 'music_url'로 수정

class SavedContentSerializer(serializers.ModelSerializer):
    media = MediaSerializer()  # 중첩된 시리얼라이저 사용

    class Meta:
        model = SavedContent
        fields = ['id', 'user', 'media']  # 필요한 필드만 포함
