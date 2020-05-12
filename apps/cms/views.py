from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import View
from django.views.decorators.http import require_GET, require_POST
from ..news.models import NewsCategory, News
from utils import restful
from .forms import EditNewsCategoryForm, WriteNewsForm
import os
from django.conf import settings
# Create your views here.

app_name = 'cms'


@staff_member_required(login_url="index")
def index(request):
    return render(request, 'cms/index.html')


class WriteNewsView(View):
    def get(self, request):
        categories = NewsCategory.objects.all()
        context = {
            'categories': categories
        }
        return render(request, 'cms/write_news.html', context=context)

    def post(self, request):
        form = WriteNewsForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data.get('title')
            desc = form.cleaned_data.get('desc')
            content = form.cleaned_data.get('content')
            thumbnail = form.cleaned_data.get('thumbnail')

            category_id = form.cleaned_data.get('category')
            category_obj = NewsCategory.objects.get(pk=category_id)
            author = request.user
            News.objects.create(title=title, desc=desc, content=content, thumbnail=thumbnail, category=category_obj, author=author)
            return restful.ok()
        else:
            return restful.params_error(message=form.get_errors())





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
        return restful.params_error('新闻类别已存在!')
    else:
        NewsCategory.objects.create(name=category)
        return restful.ok()


@require_POST
def edit_news_category(request):
    form = EditNewsCategoryForm(request.POST)
    if form.is_valid():
        pk = form.cleaned_data.get('pk')
        name = form.cleaned_data.get('name')
        try:
            NewsCategory.objects.filter(pk=pk).update(name=name)
        except:
            return restful.params_error("此分类id不存在！")
        return restful.ok()
    else:
        return restful.params_error(message=form.get_errors())


@require_POST
def delete_news_category(request):
    pk = request.POST.get('pk')
    try:
        NewsCategory.objects.filter(pk=pk).delete()
    except:
        return restful.params_error("此分类id不存在！")
    return restful.ok()


@require_POST
def upload_file(request):
    file = request.FILES.get('file')
    print(file)
    name = file.name
    with open(os.path.join(settings.MEDIA_ROOT, name), 'wb') as fp:
        for chunk in file.chunks():
            fp.write(chunk)
    url = request.build_absolute_uri(settings.MEDIA_URL + name)
    return restful.result(data={'url': url})


def banners(request):
    return render(request, 'cms/banners.html')