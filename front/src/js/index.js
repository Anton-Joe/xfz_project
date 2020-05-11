

function Banner(){
    this.bannerWidth = 798;
    this.bannerGroup = $('#banner-group');
    this.index = 1;
    this.leftArrow = $('.left-arrow');
    this.rightArrow = $('.right-arrow');
    this.bannerUl = $("#banner-ul");
    this.liList = this.bannerUl.children('li');
    this.bannerCount = this.liList.length;
    this.pageControl = $('.page-control');
}

// 轮播图启动入口
Banner.prototype.run = function(){
    this.loop();
    this.initPageControl();
    this.listenArrorClick();
    this.initBanner();
    this.listenPageControl();
    this.listenBannerHover();
};



// 轮播动画
Banner.prototype.animate = function(second){
    var self = this;
    self.bannerUl.animate({"left":-798 * self.index },second);
    // 更新轮播图小点是否选中
    var index = self.index;
    if (index === 0) {
        index = self.bannerCount - 1;
    }else if(index === self.bannerCount + 1){
        index = 0;
    }else{
        index = self.index - 1;
    }
    self.pageControl.children('li').eq(index).addClass('active').siblings().removeClass('active');
};

// 轮播图默认轮播
Banner.prototype.loop = function(){
    var self = this;

    // 定时器轮播
    this.timer = setInterval(function () {
        if(self.index >= self.bannerCount + 1){
            self.bannerUl.css({'left': - self.bannerWidth});
            self.index = 1;
        }
        self.index = self.index + 1;
        self.animate(500);
    },2000);
};


// 轮播图点击事件
Banner.prototype.listenArrorClick = function(){
  var self = this;
  self.leftArrow.click(function () {
      if(self.index === 0){
          self.bannerUl.css({'left': -(self.bannerCount) * self.bannerWidth})
          self.index = self.bannerCount - 1;
      }else{
          self.index--;
      }
      // self.bannerUl.animate({"left":-798 * self.index },500)
      self.animate(500);
  });
  self.rightArrow.click(function () {
      if(self.index === self.bannerCount + 1){
          self.bannerUl.css({'left': -self.bannerWidth});
          self.index = 2;
      }else{
          self.index++;
      }
      // self.bannerUl.animate({"left":-798 * self.index },500)
      self.animate(500);
  });
};

// 初始化轮播图的小点
Banner.prototype.initPageControl = function(){
    var self = this;
    // 根据图片数量创建小点
    for(var i=0; i< self.bannerCount; i++){
        var dot = $("<li></li>");
        self.pageControl.append(dot);
        if(i === 0){
            dot.addClass('active');
        }
    }
    self.pageControl.css({'width': self.bannerCount * 10 + 8*2 + 16*(self.bannerCount - 1) });

};

Banner.prototype.initBanner = function(){
    var self =  this;
    var firstBanner = self.liList.eq(0).clone();
    var lastBanner = self.liList.eq(self.bannerCount - 1).clone();
    self.bannerUl.append(firstBanner);
    self.bannerUl.prepend(lastBanner);
    self.bannerUl.css({'width': self.bannerWidth  * (self.bannerCount+2),'left': -self.bannerWidth});
};

// 显示轮播图箭头
Banner.prototype.toggleArrow = function(isShow){
    var self = this;
    if(isShow){
        self.leftArrow.show();
        self.rightArrow.show();
    }else{
        self.leftArrow.hide();
        self.rightArrow.hide();
    }
};

// 轮播图鼠标悬停显示
Banner.prototype.listenBannerHover = function(){
    var self = this;
    this.bannerGroup.hover(function(){
        // 第一个函数，鼠标移动到Banner上面执行的函数
        clearInterval(self.timer);
        self.toggleArrow(true);
    },function(){
        // 第二个函数，鼠标移走的时候执行的函数
        self.loop();
        self.toggleArrow(false);
    });
};

// 小圆点点击事件
Banner.prototype.listenPageControl = function(){
    var self = this;
    self.pageControl.children('li').each(function(index, obj){
        $(obj).click(function () {
            self.index = index + 1;
            self.animate(500);
        });
    });
};

function Index(){
    var self = this;
    self.p = 2;
    // 时间过滤器
    template.defaults.imports.timeSince = function(dateValue){
        var date = new Date(dateValue);
        var dateTimeStamp = date.getTime();//毫秒，传入的时间
        var nowTimeStamp = (new Date()).getTime();//毫秒，当前时间
        var timeStamp = (nowTimeStamp - dateTimeStamp) / 1000;
        if(timeStamp < 60){
            return '刚刚';
        }else if(timeStamp >= 60 && timeStamp < 60*60){
            var minutes = parseInt(timeStamp/60);
            return minutes + '分钟前';
        }else if(timeStamp >= 60 * 60 && timeStamp < 60*60*24){
            var hours = parseInt(timeStamp/60/60);
            return hours + '小时前';
        }else if(timeStamp >= 60 * 60 *24 && timeStamp < 60*60*24*30){
            var days = parseInt(timeStamp/60/60/24);
            return days + '天前';
        }else{
            var year = date.getFullYear();
            var month = date.getMonth();
            var day  = date.getDay();
            var hour = date.getHours();
            var minute = date.getMinutes();
            return year+'/'+month+'/'+day+' '+hour+":"+minute;
        }
    }
}
Index.prototype.run = function(){
    var self = this;
    self.listenLoadMoreEvent();

};
Index.prototype.listenLoadMoreEvent = function(){
    var self = this;
    var btn = $("#load-more-btn");
    btn.click(function(){
       xfzajax.get({
           'url': '/news/list/',
           'data': {
               'p': self.p
           },
           'success': function (result) {
               if(result['code'] === 200){
                   var data = result['data'];
                   if(data.length > 0){
                       var html = template('news-item',{'newses':data});
                       var ul = $(".list-inner-group");
                       ul.append(html);
                       self.p++;
                   }else{
                       btn.hide();
                   }
               }
           }
       })
    });
};


// 静态文档渲染完成之后执行其他方法
$(function(){
    var banner = new Banner();
    banner.run();
    var index = new Index();
    index.run();
});



// 练习
// function Banner(){
//     // 相当于Python中的__init__方法
//     console.log('构造函数');
//     // 添加属性
//     this.person = 'zhiliao';
// }
//
// // 为Banner 添加方法
// Banner.prototype.greet = function () {
//     console.log("添加方法");
// };
//
// var banner = new Banner();
// console.log(banner.person);
// banner.greet();
