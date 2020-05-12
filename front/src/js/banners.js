function Banners(){

}

Banners.prototype.run = function(){
    var self = this;
    self.listenAddBannerEvent();
};

Banners.prototype.listenAddBannerEvent = function(){
    var self = this;
    var btn = $('#add-banner-btn');
    btn.click(function(){
        var tpl = template('banner-item');
        var bannerListGroup = $('.banner-list-group');
        bannerListGroup.prepend(tpl);

        var bannerItem = bannerListGroup.find(".banner-item:first");
        self.addImageSelectEvent(bannerItem);
        self.addRemoveBannerEvent(bannerItem);
    });
};

Banners.prototype.addRemoveBannerEvent = function(bannerItem){
    var closeBtn = $('.close-item');
    closeBtn.click(function(){
       bannerItem.remove();
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

