from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import MemberRegistrationSerializer
from drf_yasg import openapi
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login

# swagger 테스트를 위한 일시적으로 csrf 보호 비활성화
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

#회원관리 뷰
class MemberManageView(APIView):
    # 회원가입인 POST형 메소드에 대해서는 인증 절차 적용 안함
    def get_permissions(self):  #회원가입에 대해 인증받지 않겠따!
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]

    @swagger_auto_schema(
        request_body=MemberRegistrationSerializer,
        responses={201: '회원가입 완료', 400: '잘못된 요청'}
    )
    def post(self, request):
        serializer = MemberRegistrationSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'name': serializer.validated_data.get('name'),
                'message': '회원가입 완료.'
            }, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)