function NewsList(){

}

NewsList.prototype.run = function(){
    var self = this;
    self.listenSubmitEvent();
};

NewsList.prototype.listenSubmitEvent = function(){
    var self = this;
    var submitBtn = $('.submit-btn');
    var textarea = $("textarea[name='comment']");
    submitBtn.click(function(event){
        content = textarea.val();
        news_id = submitBtn.attr('data-news-id');
        xfzajax.post({
           'url': '/news/publish_comment/',
            'data': {
               'content': content,
                'news_id': news_id,
            },
            'success': function(result){
               if(result['code'] === 200){
                   var data = result['data'];
                   var htmlToPreappend = template('comment-item', {'comment': data});
                   var commentGroup = $('.comment-list');
                   commentGroup.prepend(htmlToPreappend);
                   window.messageBox.showSuccess("评论发布成功");
                   textarea.val("");
               }
            }
        });
    });
};

$(function(){
    var nlist = new NewsList();
    nlist.run();
});
