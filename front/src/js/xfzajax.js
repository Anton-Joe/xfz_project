/**
 * Created by hynev on 2018/5/15.
 */

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var xfzajax = {
    // 没有仔细看过！
    'get': function (args) {
        args['method'] = 'get';
        this.ajax(args);
    },
    'post': function (args) {
        args['method'] = 'post';
        this._ajaxSetup();
        this.ajax(args);
    },
    'ajax': function (args) {
        // 获取用户自己写的success事件
        var success = args['success'];
        // 重写success事件
        args['success'] = function(result){
            //code===200
            if (result['code'] === 200){
                // 如果存在用户自己的sucess事件，则执行用户的sucess事件 并且
                if(success){
                    success(result);
                }
            }else{
                var messageObject = result['message'];
                if (typeof messageObject == 'string' || messageObject.constructor == String){
                    // console.log(messageObject);
                    window.messageBox.showError(messageObject)
                }else {
                    for(var key in messageObject){
                        var messages = messageObject[key];
                        var message = messages[0];
                        // console.log(message)
                        window.messageBox.showError(message);
                    }
                }
                if(success){
                    success(result);
                }
            }
        };
        args['fail'] = function(error){
            window.messageBox.showError('服务器内部错误');
            console.log(error)
        };
        $.ajax(args);
    },
    '_ajaxSetup': function () {
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            }
        });
    }
};
