from django.urls import path
from . import views

app_name = 'cms'

urlpatterns = [
    path('', views.index, name='index'),
    path('write_news/', views.WriteNewsView.as_view(), name='write_news'),
    path('news_category/', views.news_category, name='news_category'),
]