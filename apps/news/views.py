from django.shortcuts import render
from .models import NewsCategory
from .models import News, NewsCategory

# Create your views here.


def index(request):
    newses = News.objects.all()
    categories = NewsCategory.objects.all()
    context = {
        'newses': newses,
        'categories': categories,
    }
    return render(request, 'news/index.html', context=context)


def news_detail(request, news_id):
    return render(request, 'news/news_detail.html')


def search(request):
    return render(request, 'search/search_index.html')




