function Banners(){

}

Banners.prototype.run = function(){
    var self = this;
    self.listenAddBannerEvent();
    self.LoadData();
};

Banners.prototype.LoadData = function(){
  var self = this;
  xfzajax.get({
      'url': '/cms/banner_list/',
      'success': function (result) {
          if(result['code'] === 200){
            var banners = result['data'];
            for(var i = 0; i < banners.length;i++){
                var banner = banners[i];
                self.createBannerItem(banner);
            }
          }
      }
  })
};

Banners.prototype.listenAddBannerEvent = function(){
    var self = this;
    var btn = $('#add-banner-btn');

    btn.click(function(){
        var bannerListGroup = $('.banner-list-group');
        var bannerItems = bannerListGroup.children().length;
        if(bannerItems>=6){
            window.messageBox.showInfo("最多只能添加六张录播图");
            return ;
        }
        self.createBannerItem();
    });
};

Banners.prototype.createBannerItem = function(banner){
    var self = this;
    var tpl = template('banner-item',{"banner":banner});
    var bannerListGroup = $('.banner-list-group');

    var bannerItem = null;
    if(banner){
        bannerListGroup.append(tpl);
        bannerItem = bannerListGroup.find(".banner-item:last");
    }else{
        bannerListGroup.prepend(tpl);
        bannerItem = bannerListGroup.find(".banner-item:first");
    }
    self.addImageSelectEvent(bannerItem);
    self.addRemoveBannerEvent(bannerItem);
    self.addBannerSaveEvent(bannerItem)
};

Banners.prototype.addBannerSaveEvent = function(bannerItem){
    var self = this;
    var saveBtn = bannerItem.find('.save-btn');
    var imageTag = bannerItem.find('.thumbnail');
    var priorityTag = bannerItem.find("input[name='priority']");
    var linkToTag = bannerItem.find("input[name='link_to']");
    var span = bannerItem.find('.priority');
    var bannerId = bannerItem.attr('data-banner-id');
    var url = null;
    saveBtn.click(function(){
        console.log("clicked save......");
        var image_url = imageTag.attr("src");
        var priority = priorityTag.val();
        var link_to = linkToTag.val();
        if(bannerId){
            url = '/cms/edit_banner/';
        }else {
            url = '/cms/add_banner/';
        }
        xfzajax.post({
            'url': url,
            'data':{
                'image_url':image_url,
                'link_to': link_to,
                'priority': priority,
                'pk': bannerId,
            },
            'success': function(result){
                if(result['code'] === 200){
                    if(bannerId){
                        window.messageBox.showSuccess("修改成功！");
                    }else{
                        var banner_id2 = result['data']['banner_id'];
                        window.messageBox.showSuccess("添加成功！");
                        bannerItem.attr('data-banner-id',banner_id2);
                    }
                    span.text("优先级："+ priority);
                }
            }
        })
    });
};

Banners.prototype.addRemoveBannerEvent = function(bannerItem){
    var closeBtn = bannerItem.find('.close-item');
    closeBtn.click(function(){
        console.log("clicked remove......");
        var bannerId = bannerItem.attr("data-banner-id");
        if(bannerId){
            xfzalert.alertConfirm({
                'text': '您确定要删除这个轮播图吗？',
                'confirmCallback' : function(){
                    xfzajax.post({
                        'url': '/cms/delete_banner/',
                        'data': {
                            'banner_id': bannerId
                        },
                        'success' : function(result){
                            if(result['code'] === 200){
                                bannerItem.remove();
                                window.messageBox.showSuccess('删除成功');
                            }
                        }
                    })
                }
            })
        }else {
            bannerItem.remove();
        }
    });
};

Banners.prototype.addImageSelectEvent = function(bannerItem){
    var image = bannerItem.find(".thumbnail");
    var imageInput = bannerItem.find(".image-input");
    image.click(function(){
       imageInput.click()
    });
    imageInput.change(function(){
       var file = this.files[0];
       var formData = new FormData();
       formData.append('file', file);
       xfzajax.post({
           'url': '/cms/upload_file/',
           'data': formData,
           'processData': false,
           'contentType': false,
           'success': function(result){
               if(result['code'] === 200){
                   var url = result['data']['url'];
                   image.attr('src', url);
               }
           }
       })
    });


};

$(function(){
   var banner = new Banners();
   banner.run();
});

