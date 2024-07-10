from rest_framework import serializers
from .models import AlbumCover

class AlbumCoverSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlbumCover
        fields = '__all__'
