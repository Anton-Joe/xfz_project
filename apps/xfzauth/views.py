# encoding: utf-8

from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm, RegisterForm
from utils import restful
from django.shortcuts import reverse, redirect
from utils.captcha.xfzcaptcha import Captcha
from io import BytesIO
from django.http import HttpResponse
from utils.aliyundsk.aliyunsmsapi import aliyunsms
from utils import restful
from django.core.cache import cache
from django.contrib.auth import get_user_model

User = get_user_model()


def logout_view(request):
    logout(request)
    return redirect(reverse('index'))


@require_POST
def login_view(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        # 验证
        user = authenticate(request, username=telephone, password=password)
        if user:
            if user.is_active:
                login(request, user)
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return restful.ok()
            else:
                return restful.unauth_error(message="您的账号无权限或没有被激活")
        else:
            return restful.params_error( message="账号或密码错误")
    else:
        errors = form.get_errors()
        return restful.params_error(message=errors)


# from utils.captcha.xfzcaptcha import Captcha
# from io import BytesIO
# from django.http import HttpResponse
# from django.core.cache import cache
def img_captcha(request):
    text, image = Captcha.gene_code()
    # 存储图片数据流
    out = BytesIO()
    # 将图片对象保存到BytesIO中
    image.save(out, 'png')
    # 将文件指针移到开头
    out.seek(0)

    response = HttpResponse(content_type='image/png')
    response.write(out.read())
    # .tell()，获得文件指针的位置，也就是文件长度
    response['Content-length'] = out.tell()

    # 将图形验证码的文字存储到memcached中，全部统一为小写形式
    cache.set(text.lower(), text.lower(), 5*60)
    return response


def sms_captcha(request):
    # /sms_captcah/?telephone=xxx
    telephone = request.GET.get('telephone')
    code = Captcha.gene_text()
    aliyunsms.send_sms(phone_numbers=telephone, code=str(code))
    cache.set(telephone, code, 5*60)
    return restful.ok()


@require_POST
def register(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password1')
        username = form.cleaned_data.get('username')
        user = User.objects.create_user(telephone=telephone, username=username, password=password)
        login(request, user)
        return restful.ok()
    else:
        return restful.params_error(message=form.get_errors())



