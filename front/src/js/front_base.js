// 用于处理导航条
function FrontBase(){

}

FrontBase.prototype.run = function(){
  var self = this;
  self.listenAuthBoxHover();
};

FrontBase.prototype.listenAuthBoxHover = function(){
    var authBox = $(".auth-box");
    var userMoreBox = $(".user-more-box");
    authBox.hover(function(){
        userMoreBox.show();
    },function(){
        userMoreBox.hide();
    });
};

$(function(){
   var frontBase = new FrontBase();
   frontBase.run();
});


// 用于处理登录与注册
function Auth(){
    var self = this;
    self.maskWrapper = $('.mask-wrapper');
    self.scrollWrapper = $(".scroll-wrapper");
}

Auth.prototype.run = function(){
    var self = this;
    self.listenShowHideEvent();
    self.listenSwitchEvent();
    self.listenSigninEvent();
    self.listenImgCaptchaEvent();
};

Auth.prototype.listenImgCaptchaEvent = function(){
  var imgCaptcha = $('.img-captcha');
  imgCaptcha.click(function () {
      // /account/img_captcha/?random=xxx
     imgCaptcha.attr("src", "/account/img_captcha"+"?random="+Math.random());
  });
};

Auth.prototype.showEvent = function(){
    var self = this;
    self.maskWrapper.show();
};

Auth.prototype.hideEvent = function(){
    var self = this;
    self.maskWrapper.hide();
};

Auth.prototype.listenShowHideEvent = function(){
    var self = this;
    $(".signin-btn").click(function(){
        self.scrollWrapper.css({'left':0});
        self.showEvent();
    });
    $(".signup-btn").click(function(){
        self.scrollWrapper.css({'left':-400});
        self.showEvent();

    });
    $(".close-btn").click(function(){
        $(".mask-wrapper").hide();
        // 清理input输入框内的数据
    });
};

Auth.prototype.listenSwitchEvent= function(){
    var self = this;
    var switcher =  $(".switch");
    switcher.click(function () {
        var current_left = self.scrollWrapper.css("left");
        current_left = parseInt(current_left);
        if(current_left === 0){
            self.scrollWrapper.animate({'left':-400},400);
        }else{
            self.scrollWrapper.animate({'left':0},400);
        }
    });
};

Auth.prototype.listenSigninEvent = function(){
    var self = this;
    var signinGroup = $('.signin-group');
    var telephoneInput = signinGroup.find("input[name='telephone']");
    var passwordInput = signinGroup.find("input[name='password']");
    var rememberInput = signinGroup.find("input[name='remember']");

    var submitBtn = signinGroup.find('.submit-btn');
    submitBtn.click(function(){
        var telephone = telephoneInput.val();
        var password = passwordInput.val();
        var remember = rememberInput.prop('checked');

        xfzajax.post({
            'url': '/account/login/',
            'data': {
                'telephone': telephone,
                'password': password,
                'remember': remember?1:0,
            },
            'success': function(result){
                if(result['code'] == 200){
                    self.hideEvent();
                    window.location.reload();
                }else {
                    var messageObject = result['message'];
                    if (typeof messageObject == 'string' || messageObject.constructor == String){
                        // console.log(messageObject);
                        window.messageBox.show(messageObject)
                    }else {
                        for(var key in messageObject){
                            var messages = messageObject[key];
                            var message = messages[0];
                            // console.log(message)
                            window.messageBox.show(message)
                        }
                    }
                }
            },
            'fail': function(error){
                console.log('error');
            },
        });
    });
};

$(function () {
    var auth = new Auth();
    auth.run();
});



