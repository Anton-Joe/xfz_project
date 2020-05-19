from rest_framework import serializers
from .models import News, NewsCategory, Comment, Banner
from ..xfzauth.serializers import AuthorSerializer


class NewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = ('id', 'name')


class NewsSerializer(serializers.ModelSerializer):
    category = NewsCategorySerializer()
    # author跟上方的NewsCategorySerializer同理，文件在别处，就不展示
    author = AuthorSerializer()

    class Meta:
        model = News
        fields = ('id', 'title', 'desc', 'thumbnail', 'pub_time', 'category', 'author')


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()

    class Meta:
        model = Comment
        fields = ('content', 'pub_time', 'id', 'author')


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ('id', 'image_url', 'link_to', 'priority')


