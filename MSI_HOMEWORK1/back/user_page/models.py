from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserPage(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)


class Meme(models.Model):
    userPage = models.ForeignKey(UserPage, on_delete=models.CASCADE)
    imageUrl = models.CharField(max_length=1024)
