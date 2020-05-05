// 点击登录按钮弹出模态对话框
$(function () {
   $("#btn").click(function () {
       $(".mask-wrapper").show()
   });

   $(".close-btn").click(function(){
       $(".mask-wrapper").hide();
    });
});


//登录注册切换
$(function () {
    $(".switch").click(function () {
        var scrollWrapper = $(".scroll-wrapper");
        var current_left = scrollWrapper.css("left");
        current_left = parseInt(current_left);
        if(current_left === 0){
            scrollWrapper.animate({'left':-400},400);
        }else{
            scrollWrapper.animate({'left':0},400);
        }
    });
});




