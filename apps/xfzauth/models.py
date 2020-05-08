from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from shortuuidfield import ShortUUIDField
from django.db import models


class UserManager(BaseUserManager):
    def _create_user(self, telephone, username, password, **kwargs):
        if not telephone:
            raise ValueError('请传入手机号码！')
        if not username:
            raise ValueError('请传入用户名！')
        if not password:
            raise ValueError('请传入密码！')

        user = self.model(telephone=telephone, username=username, password=password, **kwargs)
        user.set_password(password)
        user.save()
        return user

    def create_user(self, telephone, username, password, **kwargs):
        kwargs['is_superuser'] = False
        return self._create_user(telephone=telephone, username=username, password=password, **kwargs)

    def create_superuser(self, telephone, username, password, **kwargs):
        kwargs['is_superuser'] = True
        return self._create_user(telephone=telephone, username=username, password=password, **kwargs)


class User(AbstractBaseUser, PermissionsMixin):
    # 不使用默认自增长的主键
    # 将short_uuid定为主键，此时需要一个第三方包：django-shortuuidfield:pip install django-shortuuidfield
    uid = ShortUUIDField(primary_key=True)
    username = models.CharField(max_length=100)
    telephone = models.CharField(max_length=11, unique=True)
    # password 已经存在于父类 AbstractBaseUser中
    # password = models.CharField(max_length=200)
    email = models.EmailField(unique=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    # auto_now_add 自动记录当前用户被创建的时间为date_joined
    date_joined = models.DateTimeField(auto_now_add=True)

    # 定义 '是否登录' 判断时所用的字段
    USERNAME_FIELD = 'telephone'

    # 创建super_user时，强制需要确认的字段，同时会包括上方的USERNAME_FIELD指定的字段，同时也会包括password
    REQUIRED_FIELDS = ['username']

    EMAIL_FIELD = 'email'

    objects = UserManager()

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username


