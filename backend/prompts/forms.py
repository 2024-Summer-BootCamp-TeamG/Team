from django import forms
from .models import AlbumCover

class AlbumCoverForm(forms.ModelForm):
    class Meta:
        model = AlbumCover
        fields = ['image_url', 'analysis_text', 'mood']