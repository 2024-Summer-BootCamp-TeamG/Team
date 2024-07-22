from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import UserRegistrationSerializer
class UserManageView(APIView):
  def get_permissions(self):
    if self.request.method == 'POST':
      return [AllowAny()]
    return [IsAuthenticated()]
  @swagger_auto_schema(
    request_body=UserRegistrationSerializer,
    responses={201: '회원가입 완료', 400: '잘못된 요청'}
  )
  def post(self, request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
      user = serializer.save()
      login(request, user)
      return Response({
        'message': '회원가입 완료'
      }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  @swagger_auto_schema(
    operation_description="Delete the authenticated user's account.",
    responses={
      204: 'Successfully deleted',
      403: 'Not authenticated',
    }
  )
  def delete(self, request):
    user = request.user
    logout(request)
    user.delete()
    return Response({'message': 'Successfully deleted'}, status=status.HTTP_204_NO_CONTENT)
class LoginAPIView(APIView):
  permission_classes = [AllowAny]
  @swagger_auto_schema(
    operation_description="로그인 API",
    request_body=openapi.Schema(
      type=openapi.TYPE_OBJECT,
      properties={
        'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
        'password': openapi.Schema(type=openapi.TYPE_STRING, description='User password'),
      }
    ),
    responses={200: '로그인 성공', 401: '인증 실패'}
  )
  def post(self, request, *args, **kwargs):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, email=email, password=password)
    if user is not None:
      login(request, user)
      return Response({
        'message': '로그인 성공!'
      }, status=status.HTTP_200_OK)
    return Response({
      'message': '로그인 실패. 이메일 또는 비밀번호를 확인해주세요.'
    }, status=status.HTTP_401_UNAUTHORIZED)
class LogoutAPIView(APIView):
  permission_classes = [IsAuthenticated]
  @swagger_auto_schema(
    operation_description="로그아웃 API",
    responses={200: '로그아웃 성공', 401: '인증되지 않음'}
  )
  def post(self, request, *args, **kwargs):
    if request.user.is_authenticated:
      user_email = request.user.email
      logout(request)
      return Response({
        'email': user_email,
        'message': '로그아웃 되었습니다.'
      }, status=status.HTTP_200_OK)
    else:
      return Response({
        'message': '로그인된 사용자가 없습니다.'
      }, status=status.HTTP_401_UNAUTHORIZED)