import os
import django
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import AlbumCover
from .serializers import AlbumCoverSerializer
import requests

# DJANGO_SETTINGS_MODULE 환경 변수 설정
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

# Django 설정 초기화
django.setup()

# DALL-E API 요청 보내기
def generate_album_cover(api_key, prompt):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "prompt": prompt,
        "size": "1024x1024",
        "n": 1
    }

    response = requests.post("https://api.openai.com/v1/images/generations", headers=headers, json=payload)
    return response.json()

@api_view(['POST'])
def create_album_cover(request):
    if request.method == 'POST':
        serializer = AlbumCoverSerializer(data=request.data)
        if serializer.is_valid():
            mood = serializer.validated_data.get('mood', '')
            analysis_text = serializer.validated_data.get('analysis_text', '')
            image_text = serializer.validated_data.get('image_text', '')

            prompt = f" {image_text}이거랑 {analysis_text}이거랑{mood}이거를 기반으로 앨범커버 생성해줘"

            api_key = "MY_API_KEY"
            response = generate_album_cover(api_key, prompt)

            if "data" in response and len(response["data"]) > 0:
                image_url = response["data"][0]["url"]
                serializer.save(image_url=image_url)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Failed to generate album cover"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({"error": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)

