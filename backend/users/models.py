from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class MemberManager(BaseUserManager):
    # 사용자 생성 메소드
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)  # 이메일 정규화
        user = self.model(email=email, **extra_fields)  # 사용자 인스턴스 생성
        user.set_password(password)  # 사용자 비밀번호 해시처리
        user.save(using=self._db)
        return user

    # 관리자 사용자 생성 메소드
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    email = models.EmailField(unique=True)  # 이메일 필드 유니크하게
    deleted_at = models.DateTimeField(null=True, blank=True)
    username = None  # username 필드 제거
    first_name = None
    last_name = None

    def __str__(self):
        return self.email

    USERNAME_FIELD = 'email'  # 이메일 주소로 사용자를 식별
    REQUIRED_FIELDS = []  # 관리자 생성 시 필요한 필드 설정
