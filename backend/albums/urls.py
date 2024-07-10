from django.urls import path,re_path
from .views import AnalyzeImageView
from django.contrib import admin
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Image Analysis API",
      default_version='v1',
      description="API for image analysis",
   ),
   public=True,
)




urlpatterns = [
    path('analyze-image/', AnalyzeImageView.as_view(), name='analyze_image'),
# Swagger UI
path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]