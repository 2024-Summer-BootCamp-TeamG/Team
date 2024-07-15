from django.urls import path
from .views import AlbumCoverView
from .views import SunoClipView
urlpatterns = [
    path('album_cover', AlbumCoverView.as_view(), name='create_album_cover'),
    path('album_music',SunoClipView.as_view(), name='create_album_music'),
]
