#encoding:utf-8

from django.http import JsonResponse


class HttpCode(object):
    ok = 200
    # 参数错误
    paramserror = 400
    # 没有授权
    unauth = 401
    # 请求方法错误
    methoderror = 405
    # 服务器内部错误
    servererror = 500


def result(code=HttpCode.ok, message="", data=None, kwargs=None):
    json_dict = {"code": code, "message": message, "data": data}
    if kwargs and issubclass(kwargs, dict) and kwargs.keys():
        json_dict.update(kwargs)

    return JsonResponse(json_dict, json_dumps_params={'ensure_ascii': False})


def ok():
    return result()


def params_error(message="", data=None):
    return result(code=HttpCode.paramserror, message=message, data=data)


def unauth_error(message="", data=None):
    return result(code=HttpCode.unauth, message=message, data=data)


def method_error(message="", data=None):
    return result(code=HttpCode.methoderror, message=message, data=data)


def server_error(message="", data=None):
    return result(code=HttpCode.servererror, message=message, data=data)