# member/urls.py
from django.urls import path
from .views import UserManageView, LoginAPIView, LogoutAPIView

urlpatterns = [
    # 회원가입 경로
    path('signup', UserManageView.as_view(), name='signup'),
    # 로그인 경로
    path('signin', LoginAPIView.as_view(), name='signin'),
    # 로그아웃 경로
    path('signout', LogoutAPIView.as_view(), name='signout'),
]