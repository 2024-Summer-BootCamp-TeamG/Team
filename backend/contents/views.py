from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import SavedContent
from .serializers import SavedContentSerializer
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404

class SavedContentView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=SavedContentSerializer,
        responses={201: SavedContentSerializer, 400: 'Bad Request'}
    )
    def post(self, request):
        serializer = SavedContentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        responses={200: SavedContentSerializer(many=True), 400: 'Bad Request'}
    )
    def get(self, request):
        user = request.user
        saved_contents = SavedContent.objects.filter(user=user)
        serializer = SavedContentSerializer(saved_contents, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        responses={204: 'No Content', 404: 'Not Found'}
    )
    def delete(self, request, pk):
        user = request.user
        saved_content = get_object_or_404(SavedContent, pk=pk, user=user)
        saved_content.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
