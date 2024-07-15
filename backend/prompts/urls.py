from django.urls import path
from .views import PosterImageView
from .views import LogoImageView
from .views import SunoClipView

urlpatterns = [
    path('poster_generate', PosterImageView.as_view(), name='create_poster'),
    path('logo_generate',LogoImageView.as_view(),name='create_logo'),
    path('music',SunoClipView.as_view(), name='create_song'),
]
