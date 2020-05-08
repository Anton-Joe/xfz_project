from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import View
from django.views.decorators.http import require_GET, require_POST
from ..news.models import NewsCategory
from utils import restful
# Create your views here.

app_name = 'cms'


@staff_member_required(login_url="index")
def index(request):
    return render(request, 'cms/index.html')


class WriteNewsView(View):
    def get(self, request):
        return render(request, 'cms/write_news.html')


@require_GET
def news_category(request):
    categories = NewsCategory.objects.all()
    context = {
        'categories': categories
    }
    return render(request, 'cms/news_category.html', context=context)


@require_POST
def add_news_category(request):
    category = request.POST.get('category')
    # 判断是否存在
    exists = NewsCategory.objects.filter(name=category).exists()
    if exists:
        return restful.params_error('新闻类别已存在1')
    else:
        NewsCategory.objects.create(name=category)
        return restful.ok()
