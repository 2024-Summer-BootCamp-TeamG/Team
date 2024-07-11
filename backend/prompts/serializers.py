from rest_framework import serializers
from .models import AlbumCover

class AlbumCoverSerializer(serializers.ModelSerializer):
    mood = serializers.CharField(required=True)
    image_text = serializers.CharField(required=True)
    analysis_text = serializers.CharField(required=True)
    image_url = serializers.URLField(read_only=True)

    class Meta:
        model = AlbumCover
        fields = ['mood', 'image_text', 'analysis_text', 'image_url']
