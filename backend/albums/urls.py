from django.urls import path
from .views import AnalyzeImageView, CreateAlbumView, DeleteAlbumView
from django.views.decorators.csrf import csrf_exempt
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


# Swagger 문서화를 위한 스키마 뷰 설정
schema_view = get_schema_view(
   openapi.Info(
      title="Image Analysis and Album API",
      default_version='v1',
      description="API for image analysis, album creation and deletion",
   ),
   public=True,
)

urlpatterns = [
    # Swagger UI URL
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    # 이미지 분석 API
    path('analyze-image/', csrf_exempt(AnalyzeImageView.as_view()), name='analyze_image'),
    # 앨범 생성 API
    path('create-album/', csrf_exempt(CreateAlbumView.as_view()), name='create_album'),
    # 앨범 삭제 API
    path('delete-album/<int:album_id>/', csrf_exempt(DeleteAlbumView.as_view()), name='delete_album'),
]
# 에러 핸들러 설정
handler500 = 'albums.views.handler500'  # 500 에러 핸들러
handler404 = 'albums.views.handler404'  # 404 에러 핸들러