from django.urls import path
from .views import SavedContentListView, SavedContentDetailView

urlpatterns = [
    path('saved-content/', SavedContentListView.as_view(), name='saved-content-list'),
    path('saved-content/<int:pk>/', SavedContentDetailView.as_view(), name='saved-content-detail'),
]