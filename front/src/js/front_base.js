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
    self.smsCaptcha = $(".sms-captcha-btn");
}

Auth.prototype.run = function(){
    var self = this;
    self.listenShowHideEvent();
    self.listenSwitchEvent();
    self.listenSigninEvent();
    self.listenImgCaptchaEvent();
    self.listenSMSCaptchaEvent();
    self.listenSignupEvent();
};

Auth.prototype.listenSignupEvent = function(){
    var signupGroup = $(".signup-group");
    var submitBtn = signupGroup.find('.submit-btn');


    submitBtn.click(function(event){
        // 阻止表单的默认行为
        event.preventDefault();

        var telephoneInput = signupGroup.find("input[name='telephone']");
        var usernameInput = signupGroup.find("input[name='username']");
        var password1Input = signupGroup.find("input[name='password1']");
        var password2Input = signupGroup.find("input[name='password2']");
        var img_captchaInput = signupGroup.find("input[name='img_captcha']");
        var sms_captchaInput = signupGroup.find("input[name='sms_captcha']");

        var telephone = telephoneInput.val();
        var username = usernameInput.val();
        var password1 = password1Input.val();
        var password2 = password2Input.val();
        var img_captcha = img_captchaInput.val();
        var sms_captcha = sms_captchaInput.val();


        console.log(" here");
        xfzajax.post({
            'url': '/account/register/',
            'data':{
                'telephone': telephone,
                'username': username,
                'password1': password1,
                'password2': password2,
                'img_captcha': img_captcha,
                'sms_captcha': sms_captcha,
            },
            'success': function(result){
                // 重新加载当前页面
                window.location.reload();
            },
        })

    });

};

Auth.prototype.smsSuceessEvnet = function(){
    var self = this;
    messageBox.showSuccess('短信验证码发送成功！');
    self.smsCaptcha.addClass("disabled");
    var count = 60;
    // 取消点击事件
    self.smsCaptcha.unbind('click');
    var timer = setInterval(function(){
        self.smsCaptcha.text(count + 's');
        count--;
        if (count<=0){
            clearInterval(timer);
            self.smsCaptcha.removeClass("disabled");
            self.smsCaptcha.text("发送验证码");
            // 重新绑定一次点击事件
            self.listenSMSCaptchaEvent();
        }
    }, 1000);
};

Auth.prototype.listenSMSCaptchaEvent = function(){
    var self = this;
    var telephoneInput = $(".signup-group input[name='telephone']");
    self.smsCaptcha.click(function(){
        var telephone =  telephoneInput.val();
        if(!telephone){
            window.messageBox.showInfo("请输入手机号码！");
        }
        xfzajax.get({
            'url': '/account/sms_captcha/',
            'data':{
                'telephone': telephone
            },
            'success': function(result){
                if(result['code'] == 200){
                    self.smsSuceessEvnet();
                }
            },
            'fail': function(error){
                console.log(error)
            },
        })
    });
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
                self.hideEvent();
                console.log("成功登陆！")
                window.location.reload();
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



