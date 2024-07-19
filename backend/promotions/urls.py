from django.urls import path
from .views import MediaListView, MediaDetailView

urlpatterns = [
    path('', MediaListView.as_view(), name='media-list'),
    path('<int:id>', MediaDetailView.as_view(), name='media-detail'),
]
