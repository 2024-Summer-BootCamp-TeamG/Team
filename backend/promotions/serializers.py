from rest_framework import serializers
from prompts.models import Media

class MediaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'logo_url']

class MediaDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'logo_url', 'poster_url', 'music_url']
