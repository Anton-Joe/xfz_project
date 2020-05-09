from django import forms
from ..forms import FormMixin


class EditNewsCategoryForm(forms.Form, FormMixin):
    pk = forms.IntegerField(error_messages={'required': '需要传入分类id'})
    name = forms.CharField(max_length=100)

