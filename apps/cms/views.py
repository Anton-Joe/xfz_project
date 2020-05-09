from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import View
from django.views.decorators.http import require_GET, require_POST
from ..news.models import NewsCategory
from utils import restful
from .forms import EditNewsCategoryForm
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
