from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import SavedContent
from .serializers import SavedContentSerializer, SavedContentDetailSerializer
from drf_yasg.utils import swagger_auto_schema
from django.apps import apps

SavedContent = apps.get_model('contents', 'SavedContent')

class SavedContentListView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="저장된 콘텐츠 목록 조회",
        operation_description="사용자의 저장된 콘텐츠 목록을 반환합니다.",
        responses={200: SavedContentSerializer(many=True)}
    )
    def get(self, request):
        saved_contents = SavedContent.objects.filter(user=request.user)
        serializer = SavedContentSerializer(saved_contents, many=True)
        return Response({
            'id': request.user.id,
            'email': request.user.email,
            'saved_contents': serializer.data,
            'debug_info': {
                'count': saved_contents.count(),
                'query': str(saved_contents.query)
            }
        })

class SavedContentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="저장된 콘텐츠 상세 조회",
        operation_description="특정 저장된 콘텐츠의 상세 정보를 조회합니다.",
        responses={200: SavedContentDetailSerializer}
    )
    def get(self, request, pk):
        try:
            saved_content = SavedContent.objects.get(pk=pk, user=request.user)
            serializer = SavedContentDetailSerializer(saved_content)
            return Response(serializer.data)
        except SavedContent.DoesNotExist:
            return Response({'error': 'Content not found'}, status=status.HTTP_404_NOT_FOUND)

