from django.urls import path
from .views import PosterImageView
from .views import LogoImageView
from .views import SunoClipView
from .views import AnalyzeImageView
urlpatterns = [
    path('analysis_text',AnalyzeImageView.as_view(), name='analyze_image'),
    path('poster_generate', PosterImageView.as_view(), name='create_poster'),
    path('logo_generate',LogoImageView.as_view(),name='create_logo'),
    path('music',SunoClipView.as_view(), name='create_song'),
]
