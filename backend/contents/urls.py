from django.urls import path
from .views import SavedContentView

urlpatterns = [
    path('save/', SavedContentView.as_view(), name='saved_contents'),
    path('save/<int:pk>/', SavedContentView.as_view(), name='saved_content_detail'),
]
