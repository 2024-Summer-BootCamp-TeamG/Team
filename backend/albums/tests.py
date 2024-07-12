from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from .models import Album, ImageAnalysis

class AlbumViewsTestCase(TestCase):
    def setUp(self):
        # 테스트용 앨범 생성
        self.album = Album.objects.create(
            title="Test Album",
            image_url="https://example.com/image.jpg",
            music_url="https://example.com/music.mp3",
            album_cover_url="https://example.com/cover.jpg",
            analysis_result="Test analysis result"
        )

    def test_analyze_image_view(self):
        url = reverse('analyze_image')
        with open('test_image.jpg', 'wb') as img:
            img.write(b'fake image data')
        with open('test_image.jpg', 'rb') as img:
            response = self.client.post(url, {'image': img})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_album_view(self):
        url = reverse('create_album')
        data = {
            'title': 'New Test Album',
            'image_key': 'test_image.jpg',
            'music_key': 'test_music.mp3',
            'album_cover_key': 'test_cover.jpg'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_album_view(self):
        url = reverse('delete_album', kwargs={'album_id': self.album.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Album.DoesNotExist):
            Album.objects.get(id=self.album.id)