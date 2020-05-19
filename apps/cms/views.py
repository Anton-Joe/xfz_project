from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import View
from django.views.decorators.http import require_GET, require_POST
from ..news.models import NewsCategory, News, Banner
from utils import restful
from .forms import EditNewsCategoryForm, WriteNewsForm, AddBannerForm, EditBannerForm
import os
from django.conf import settings
from ..news.serializers import BannerSerializer
from django.core.paginator import Paginator
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


class NewsListView(View):
    def get(self, request):
        categories = NewsCategory.objects.all()

        page = int(request.GET.get('p', 1))
        newses = News.objects.select_related('category', 'author').all()

        paginator = Paginator(newses, 2)
        page_pbj = paginator.page(page)

        context_data = self.get_pagination_data(paginator, page_pbj)
        context = {
            'categories': categories,
            'newses': page_pbj.object_list
        }
        context.update(context_data)
        return render(request, 'cms/news_list.html', context=context)

    def get_pagination_data(self, paginator, page_obj, around_count=2):
        current_page = page_obj.number
        num_pages = paginator.num_pages

        left_has_more = False
        right_has_more = False

        if current_page <= around_count + 2:
            left_pages = range(1, current_page)
        else:
            left_has_more = True
            left_pages = range(current_page-around_count, current_page)

        if current_page >= num_pages - around_count - 1:
            right_pages = range(current_page+1, num_pages+1)
        else:
            right_has_more = True
            right_pages = range(current_page+1, current_page+around_count+1)

        return {
            # left_pages：代表的是当前这页的左边的页的页码
            'left_pages': left_pages,
            # right_pages：代表的是当前这页的右边的页的页码
            'right_pages': right_pages,
            'current_page': current_page,
            'left_has_more': left_has_more,
            'right_has_more': right_has_more,
            'num_pages': num_pages
        }


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


def add_banner(request):
    form = AddBannerForm(request.POST)
    if form.is_valid():
        priority = form.cleaned_data.get('priority')
        image_url = form.cleaned_data.get('image_url')
        link_to = form.cleaned_data.get('link_to')
        banner = Banner.objects.create(priority=priority, image_url=image_url, link_to=link_to)
        return restful.result(data={'banner_id': banner.pk})
    else:
        return restful.params_error(message=form.get_errors())


def banner_list(request):
    banners = Banner.objects.all()
    serializer = BannerSerializer(banners, many=True)
    return restful.result(data=serializer.data)


def delete_banner(request):
    banner_id = request.POST.get('banner_id')
    print(banner_id)
    Banner.objects.filter(pk=banner_id).delete()
    return restful.ok()


def edit_banner(request):
    form = EditBannerForm(request.POST)
    if form.is_valid():
        pk = form.cleaned_data.get('pk')
        image_url = form.cleaned_data.get('image_url')
        link_to = form.cleaned_data.get('link_to')
        priority = form.cleaned_data.get('priority')
        Banner.objects.filter(pk=pk).update(image_url=image_url, link_to=link_to, priority=priority)
        return restful.ok()
    else:
        return restful.params_error(form.get_errors())



