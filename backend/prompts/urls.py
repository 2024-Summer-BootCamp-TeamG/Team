from django.urls import path
from .views import create_album_cover

urlpatterns = [
    path('album_cover', create_album_cover, name='create_album_cover'),
]
