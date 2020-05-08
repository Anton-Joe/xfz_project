from django.db import models

# Create your models here.


class NewsCategory(models.Model):
    name = models.CharField(max_length=100)

