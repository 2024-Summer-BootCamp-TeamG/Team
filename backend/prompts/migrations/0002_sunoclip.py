# Generated by Django 5.0.6 on 2024-07-13 11:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prompts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SunoClip',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('audio_url', models.URLField(max_length=1024)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
            ],
        ),
    ]
