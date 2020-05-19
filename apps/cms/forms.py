from django import forms
from ..forms import FormMixin
from ..news.models import News, Banner


class EditNewsCategoryForm(forms.Form, FormMixin):
    pk = forms.IntegerField(error_messages={'required': '需要传入分类id'})
    name = forms.CharField(max_length=100)


class WriteNewsForm(forms.ModelForm, FormMixin):
    category = forms.IntegerField()

    class Meta:
        model = News
        exclude = ['pub_time', 'category', 'author']


class AddBannerForm(forms.ModelForm, FormMixin):
    class Meta:
        model = Banner
        fields = ('priority', 'image_url', 'link_to')


class EditBannerForm(forms.ModelForm, FormMixin):
    pk = forms.IntegerField()

    class Meta:
        model = Banner
        fields = ('priority', 'image_url', 'link_to')
