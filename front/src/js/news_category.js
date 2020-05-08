function NewsCategory(){

}


NewsCategory.prototype.listenAddCategoryEvent = function(){
    var btn = $(".add-btn");
    btn.click(function(){
        xfzalert.alertOneInput({
           'title': '添加新闻分类',
            'Placeholder': '请输入新闻分类',
            'confirmCallback' : function(InputValue){
               xfzajax.post({
                   'url':'/cms/add_news_category/',
                   'data':{
                       'category': InputValue
                   },
                   'success': function (result) {
                     if(result['code']===200){
                         window.location.reload();
                     }
                   },
               });
            }
        });
    });
};

NewsCategory.prototype.run = function () {
    var self = this;
    self.listenAddCategoryEvent();
};


$(function () {
    var news_category = new NewsCategory();
    news_category.run();
});