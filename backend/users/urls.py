from django.urls import path
from .views import MemberManageView

urlpatterns=[
    path('signup',MemberManageView.as_view(),name='signup')
]