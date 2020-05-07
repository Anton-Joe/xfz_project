#!/usr/bin/env python
#coding=utf-8

from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest
ACCESS_KEY_ID = 'LTAI4FzoTry5y8M6jBnuzfop'
ACCESS_SECRET = 'sFwPKWEInwzQvCj52sT6dUtRZeYsw2'

client = AcsClient(ACCESS_KEY_ID, ACCESS_SECRET, 'cn-hangzhou')


def send_sms(phone_numbers, code):
    sign_name = "django小饭桌练习"
    template_code = "SMS_189613713"
    request = CommonRequest()
    request.set_accept_format('json')
    request.set_domain('dysmsapi.aliyuncs.com')
    request.set_method('POST')
    request.set_protocol_type('http') # https | http
    request.set_version('2017-05-25')
    request.set_action_name('SendSms')
    request.add_query_param('RegionId', "cn-hangzhou")
    request.add_query_param('PhoneNumbers', phone_numbers)
    request.add_query_param('SignName', sign_name)
    request.add_query_param('TemplateCode', template_code)
    template = {
        'code': code,
    }
    request.add_query_param('TemplateParam', f"{template}")
    response = client.do_action_with_exception(request)
    return response

