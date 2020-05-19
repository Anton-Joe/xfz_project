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
        self.createBannerItem();
    });
};

Banners.prototype.createBannerItem = function(banner){
    var self = this;
    var bannerListGroup = $('.banner-list-group');
    var bannerItem = null;
    if(banner){
        var tpl = template('banner-item',{"banner":banner});
        bannerListGroup.append(tpl);
        bannerItem = bannerListGroup.find(".banner-item:first");
    }else{
        var tpl = template('banner-item');
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
    saveBtn.click(function(){
        var image_url = imageTag.attr("src");
        var priority = priorityTag.val();
        var link_to = linkToTag.val();
        xfzajax.post({
            'url': '/cms/add_banner/',
            'data':{
                'image_url':image_url,
                'link_to': link_to,
                'priority': priority,
            },
            'success': function(result){
                if(result['code'] === 200){
                    var banner_id = result['data']['banner_id'];
                    console.log(banner_id)
                }
            }
        })
    });
};

Banners.prototype.addRemoveBannerEvent = function(bannerItem){
    var closeBtn = bannerItem.find('.close-item');
    var bannerId = bannerItem.attr("data-banner-id");
    closeBtn.click(function(){
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

