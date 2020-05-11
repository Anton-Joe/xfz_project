from django.shortcuts import render
from .models import NewsCategory
from .models import News, NewsCategory
from .serializers import NewsSerializer
from django.conf import settings
from utils import restful
from django.http import Http404
import json
# Create your views here.


def index(request):
    newses = News.objects.order_by('-pub_time')[0:settings.ONE_PAGE_NEWS_COUNT]
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
        newses = News.objects.all()[start:end]
    else:
        newses = News.objects.filter(category__id=category_id)[start:end]

    serializer = NewsSerializer(newses, many=True)
    data = serializer.data
    return restful.result(data=data)


def news_detail(request, news_id):
    try:
        news = News.objects.get(pk=news_id)
        return render(request, 'news/news_detail.html', context={'news': news})
    except:
        raise Http404



def search(request):
    return render(request, 'search/search_index.html')




