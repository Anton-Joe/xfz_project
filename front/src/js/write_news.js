function NEWS(){

}

NEWS.prototype.run = function(){
    var self = this;
    self.listenUploadFileEvent();
};

NEWS.prototype.listenUploadFileEvent = function(){
    var self = this;
    var btn = $("#thumbnail-upload-btn");
    btn.change(function(){
       var file = btn[0].files[0];
       var formData = new FormData();
       formData.append('file',file);
       xfzajax.post({
           'url': '/cms/upload_file/',
           'data':formData,
           'processData': false,
           'contentType': false,
           'success': function(result){
               if(result['code'] === 200){
                   var url = result['data']['url'];
                   var inputForm = $('#thumbnail-from');
                   inputForm.val(url);
               }
           },
       })

    });
}

$(function () {
    var news = new NEWS();
    news.run();
});