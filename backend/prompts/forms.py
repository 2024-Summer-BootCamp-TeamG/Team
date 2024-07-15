from django import forms
from .models import PosterImage,LogoImage

class PosterImageForm(forms.ModelForm):
    class Meta:
        model = PosterImage
        fields = ['poster_url', 'poster_text', 'style','color']

class LogoImageForm(forms.ModelForm):
    class Meta:
        model = LogoImage
        fields = ['logo_url','logo_text','style','color']