#encoding: utf-8

from django import forms
from apps.forms import FormMixin


class LoginForm(forms.Form, FormMixin):
    telephone = forms.CharField(max_length=11)
    password = forms.CharField(max_length=20, min_length=6, error_messages={"min_length": '密码长度不得小于6'})
    # 默认可以不传此参数
    remember = forms.IntegerField(required=False)


