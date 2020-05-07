# encoding: utf-8

from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm
from utils import restful
from django.shortcuts import reverse, redirect
from utils.captcha.xfzcaptcha import Captcha
from io import BytesIO
from django.http import HttpResponse
from utils.aliyundsk.aliyunsmsapi import aliyunsms


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

    return response


def sms_captach(request):
    result = aliyunsms.send_sms(phone_numbers=185806666, code="181545")
    print(result)

