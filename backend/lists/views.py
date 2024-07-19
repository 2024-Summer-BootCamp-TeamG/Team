from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import SavedContent
from .serializers import SavedContentSerializer, MediaSerializer
from drf_yasg.utils import swagger_auto_schema
from django.apps import apps


class SavedContentListView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="저장된 콘텐츠 목록 조회",
        operation_description="사용자의 저장된 콘텐츠 목록을 반환합니다.",
        responses={200: SavedContentSerializer(many=True)}
    )
    def get(self, request):
        saved_contents = SavedContent.objects.filter(user=request.user)
        print(saved_contents)
        serializer = SavedContentSerializer(saved_contents, many=True)
        print(serializer)
        return Response({
            'id': request.user.id,
            'saved_contents': serializer.data,
            'debug_info': {
                'email': request.user.email
            }
        })

class SavedContentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="저장된 콘텐츠 상세 조회",
        operation_description="특정 저장된 콘텐츠의 상세 정보를 조회합니다.",
        responses={200: MediaSerializer}
    )
    def get(self, request, pk):
        try:
            saved_content = SavedContent.objects.get(pk=pk, user=request.user)
            serializer = MediaSerializer(saved_content)
            return Response(serializer.data)
        except SavedContent.DoesNotExist:
            return Response({'error': 'Content not found'}, status=status.HTTP_404_NOT_FOUND)

