from django.contrib import admin
from django.urls import path, re_path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


# Swagger 문서화를 위한 스키마 뷰 설정
schema_view = get_schema_view(
    openapi.Info(
        title="API Documentation",
        default_version='v1',
        description="API documentation for myproject",
    ),
    public=True,
)

urlpatterns = [
    path('admin/', admin.site.urls),  # 관리자 페이지 URL
    path('users/', include('users.urls')),  # 사용자 관련 URL
    path('prompts/', include('prompts.urls')),  # 프롬프트 관련 URL
    # Swagger 문서화 URL
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/', include('albums.urls'))  # 앨범 관련 API URL
]

# 에러 핸들러 설정
handler500 = 'albums.views.handler500'  # 500 에러 핸들러
handler404 = 'albums.views.handler404'  # 404 에러 핸들러