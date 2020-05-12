function NEWS(){

}

NEWS.prototype.run = function(){
    var self = this;
    self.listenUploadFileEvent();
    self.listenSubmitNewsEvnet();
};

NEWS.prototype.listenSubmitNewsEvnet = function(){
    var self = this;
    var submit_btn = $("#submit-btn");
    submit_btn.click(function(event){
        event.preventDefault();
        var title = $("input[name='title']").val();
        var category = $("select[name='category']").val();
        var desc = $("input[name='desc']").val();
        var thumbnail = $("input[name='thumbnail']").val();
        var content = $("textarea[name='content']").val();
        xfzajax.post({
            'url': '/cms/write_news/',
            'data':{
                'title': title,
                'category': category,
                'desc': desc,
                'thumbnail': thumbnail,
                'content': content
            },
            'success': function(result){
                if(result['code'] === 200){
                    xfzalert.alertSuccess("成功添加新闻",function(){
                        window.location.reload();
                    })
                }else{
                    console.log(result['message']);
                }
            },
        })

    });

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
};

$(function () {
    var news = new NEWS();
    news.run();
});