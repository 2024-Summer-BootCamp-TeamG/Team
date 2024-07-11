
import os
import django
import textwrap
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import AlbumCover
from .serializers import AlbumCoverSerializer
import requests
from googletrans import Translator

# DJANGO_SETTINGS_MODULE 환경 변수 설정
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

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

    # 응답 상태 코드와 본문을 출력
    print(f"Response Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")

    return response.json(),prompt

def translate_to_english(text):
    try:
        translator = Translator()
        translation = translator.translate(text, src='ko', dest='en')
        return translation.text
    except Exception as e:
        print(f"Translation Error: {e}")
        return text  # 번역에 실패하면 원본 텍스트를 반환

def truncate_text(text, limit):
    return textwrap.shorten(text, width=limit, placeholder="...")

@api_view(['POST'])
def create_album_cover(request):
    if request.method == 'POST':
        serializer = AlbumCoverSerializer(data=request.data)
        if serializer.is_valid():
            mood = serializer.validated_data.get('mood', '')
            image_text = serializer.validated_data.get('image_text', '')
            analysis_text = serializer.validated_data.get('analysis_text', '')


            #프롬프트를 영어로 번역
            translated_image_text = translate_to_english(image_text)
            translated_analysis_text = translate_to_english(analysis_text)

            prompt = (
                f"Create an album cover that accurately depicts: {translated_image_text}. "
                f"The overall mood should be: {mood}."
                f"Include elements that convey the emotions described in: {translated_analysis_text}. "
            )
            #1000자 이내로 축약
            prompt = f"The overall mood should be :{mood} and Please ensure the image contains no text."+truncate_text(prompt, 930)

            print("Generated prompt: " + prompt)

            api_key = os.getenv("MY_API_KEY")
            response = generate_album_cover(api_key, prompt)

            if "data" in response and len(response["data"]) > 0:
                image_url = response["data"][0]["url"]
                serializer.save(image_url=image_url)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Failed to generate album cover"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({"error": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)
