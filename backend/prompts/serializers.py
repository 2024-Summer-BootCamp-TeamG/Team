from rest_framework import serializers
from .models import Media



class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = '__all__'

class PosterImageSerializer(serializers.ModelSerializer):
    style = serializers.CharField(required=True)
    color = serializers.CharField(required=True)
    poster_user_text = serializers.CharField(required=True)
    poster_url = serializers.URLField(read_only=True)
    image_analysis_id = serializers.IntegerField(source='image_analysis.id', read_only=True)  # 수정된 부분

    class Meta:
        model = Media
        fields = ['style', 'color', 'poster_user_text', 'image_analysis_id', 'poster_url']


class LogoImageSerializer(serializers.ModelSerializer):
    style = serializers.CharField(required=True)
    color = serializers.CharField(required=True)
    logo_text = serializers.CharField(required=True)
    logo_url = serializers.URLField(read_only=True)
    class Meta:
        model = Media
        fields = ['style', 'color', 'logo_text', 'logo_url']

class SunoClipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = '__all__'