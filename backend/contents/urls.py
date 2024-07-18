from django.urls import path
from .views import SavedContentView

urlpatterns = [
    path('save/', SavedContentView.as_view()),
]
