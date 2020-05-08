from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
# Create your views here.

app_name = 'cms'


@staff_member_required(login_url="index")
def index(request):
    return render(request, 'cms/index.html')

