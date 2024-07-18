from rest_framework import serializers
from django.apps import apps

SavedContent = apps.get_model('contents', 'SavedContent')

class SavedContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedContent
        fields = ['id', 'logo_url']
        ref_name = 'ListsSavedContentSerializer'  # 명시적으로 ref_name 설정

class SavedContentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedContent
        fields = ['id', 'logo_url', 'poster_url', 'audio_url']