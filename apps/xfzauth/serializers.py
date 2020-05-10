from rest_framework import serializers
from .models import User


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('uid', 'username', 'telephone', 'email', 'is_staff')

