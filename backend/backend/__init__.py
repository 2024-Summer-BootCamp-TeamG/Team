# my_project/__init__.py

from __future__ import absolute_import, unicode_literals

# Celery 앱을 임포트합니다.
from .celery import app as celery_app

# Celery 앱을 모듈 수준에서 사용할 수 있게 만듭니다.
__all__ = ('celery_app',)
