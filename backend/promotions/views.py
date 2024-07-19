from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from prompts.models import Media
from .serializers import MediaListSerializer, MediaDetailSerializer

class MediaListView(generics.ListAPIView):
    serializer_class = MediaListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Media.objects.filter(user=user)

class MediaDetailView(generics.RetrieveAPIView):
    queryset = Media.objects.all()
    serializer_class = MediaDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
