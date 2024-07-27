from django.urls import path
from .views import PosterImageView
from .views import LogoImageView
from .views import SunoClipView
from .views import AnalyzeImageView
from .views import StartAnalysisAndClipView, GetTaskStatusView

urlpatterns = [
    path('analysis_text',AnalyzeImageView.as_view(), name='analyze_image'),
    path('generate_poster', PosterImageView.as_view(), name='create_poster'),
    path('generate_logo',LogoImageView.as_view(),name='create_logo'),
    path('generate_music',SunoClipView.as_view(), name='create_song'),
    path('generate_textandmusic', StartAnalysisAndClipView.as_view(), name='start_analysis_and_clip'),
    path('generate_textandmusic/<str:task_id>', GetTaskStatusView.as_view(), name='get_task_status'),
]
