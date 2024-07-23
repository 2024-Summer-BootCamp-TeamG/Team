# celery.py

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# 기본 Django 설정 파일 경로
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')

# Django 설정 파일을 Celery에 적용
app.config_from_object('django.conf:settings', namespace='CELERY')

# tasks.py 파일에서 비동기 작업을 자동으로 탐지
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
