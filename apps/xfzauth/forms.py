#encoding: utf-8

from django import forms
from apps.forms import FormMixin
from django.core.cache import cache
from .models import User


class LoginForm(forms.Form, FormMixin):
    telephone = forms.CharField(max_length=11)
    password = forms.CharField(max_length=20, min_length=6, error_messages={"min_length": '密码长度不得小于6'})
    # 默认可以不传此参数
    remember = forms.IntegerField(required=False)


class RegisterForm(forms.Form, FormMixin):
    telephone = forms.CharField(max_length=11)
    username = forms.CharField(max_length=20)
    password1 = forms.CharField(max_length=20, min_length=6, error_messages={"min_length": '密码长度不得小于6'})
    password2 = forms.CharField(max_length=20, min_length=6, error_messages={"min_length": '密码长度不得小于6'})
    img_captcha = forms.CharField(max_length=4, min_length=4)
    sms_captcha = forms.CharField(max_length=4, min_length=4)

    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 != password2:
            raise forms.ValidationError("两次密码输入不一致！")

        img_captcha = cleaned_data.get('img_captcha')
        cached_img_captcha = cache.get(img_captcha.lower())
        if not cached_img_captcha.lower() or cached_img_captcha.lower() != img_captcha.lower():
            raise forms.ValidationError("图形验证码错误")

        sms_captcha = cleaned_data.get('sms_captcha')
        telephone = cleaned_data.get('telephone')
        cached_sms_captcha = cache.get(telephone)
        if not cached_sms_captcha.lower() or cached_sms_captcha.lower() != sms_captcha.lower():
            raise forms.ValidationError("短信验证码错误")

        exists = User.objects.filter(telephone=telephone).exists()
        if exists:
            raise forms.ValidationError("手机号码已经被注册")
