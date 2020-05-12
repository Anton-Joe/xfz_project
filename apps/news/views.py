from django.shortcuts import render
from .models import News, NewsCategory, Comment
from .serializers import NewsSerializer, CommentSerializer
from django.conf import settings
from utils import restful
from django.http import Http404
from .forms import PublicCommentForm
from ..xfzauth.decorators import xfz_login_required


def index(request):
    newses = News.objects.select_related('category', 'author').all()[0:settings.ONE_PAGE_NEWS_COUNT]
    categories = NewsCategory.objects.all()
    context = {
        'newses': newses,
        'categories': categories,
    }
    return render(request, 'news/index.html', context=context)


def news_list(request):
    # 若没有获得p的值，默认为1
    page = int(request.GET.get('p', 1))
    start = (page - 1) * settings.ONE_PAGE_NEWS_COUNT
    end = start + settings.ONE_PAGE_NEWS_COUNT

    category_id = int(request.GET.get('category_id', 0))

    if category_id == 0:
        newses = News.objects.select_related('category', 'author').all()[start:end]
    else:
        newses = News.objects.select_related('category', 'author').filter(category__id=category_id)[start:end]

    serializer = NewsSerializer(newses, many=True)
    data = serializer.data
    return restful.result(data=data)


def news_detail(request, news_id):
    try:
        news = News.objects.select_related('category', 'author').prefetch_related('comments__author').get(pk=news_id)
        return render(request, 'news/news_detail.html', context={'news': news})
    except:
        raise Http404


def search(request):
    return render(request, 'search/search_index.html')


@xfz_login_required
def publish_comment(request):
    form = PublicCommentForm(request.POST)
    if form.is_valid():
        content = form.cleaned_data.get('content')
        news_id = form.cleaned_data.get('news_id')
        news = News.objects.get(pk=news_id)
        author = request.user
        comment = Comment.objects.create(content=content, news_id=news_id, news=news, author=author)
        comment_serializer = CommentSerializer(comment)
        return restful.result(data=comment_serializer.data)
    else:
        return restful.params_error(message=form.get_errors())






