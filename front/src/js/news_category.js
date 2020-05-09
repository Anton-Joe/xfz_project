function NewsCategory(){

}
NewsCategory.prototype.run = function () {
    var self = this;
    self.listenAddCategoryEvent();
    self.listenEditCategoryEvent();
    self.listenDeletCategoryEvent();
};


NewsCategory.prototype.listenDeletCategoryEvent = function(){
    var self = this;
    var btn = $('.delete-btn');
    btn.click(function(){
        // 得到当前btn对象
        var currentBtn = $(this);
        var pk = currentBtn.parent().parent().attr('data-pk');
        var name = currentBtn.parent().parent().attr('data-name');
        xfzalert.alertConfirm({
            'title':'删除新闻类别',
            'text':'确认要删除“'+ name +'”类别吗？',
            'confirmCallback': function(){
                xfzajax.post({
                    'url': '/cms/delete_news_category/',
                    'data':{
                        'pk': pk
                    },
                    'success':function(){
                        window.location.reload();
                    },
                })
            },
        });
    });
};

NewsCategory.prototype.listenEditCategoryEvent = function(){
  var self = this;
  var btn = $('.edit-btn');
  btn.click(function(){
     // 得到当前btn对象
      var currentBtn = $(this);
      var pk = currentBtn.parent().parent().attr('data-pk');
      var name = currentBtn.parent().parent().attr('data-name');
      console.log(pk);
      console.log(name);
      xfzalert.alertOneInput({
          'title': '修改新闻类别名称',
          'placeholder': '请输入新的分类名称',
          'value': name,
          'confirmCallback': function (inputValue) {
              xfzajax.post({
                  'url': '/cms/edit_news_category/',
                  'data':{
                      'pk': pk,
                      'name': inputValue
                  },
                  'success': function (result) {
                      if(result['code'] === 200){
                          window.location.reload();
                      }
                  }
              })
          }
      })
  });
};

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



$(function () {
    var news_category = new NewsCategory();
    news_category.run();
});