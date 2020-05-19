function CMSNewsList(){

}

CMSNewsList.prototype.run = function(){
    this.initDatePicker();
};

CMSNewsList.prototype.initDatePicker = function(){
    var startPicker = $('#start-picker');
    var endPicker = $('#end-picker');

    var todayDate = new Date();
    var todayStr = todayDate.getFullYear() + '/' + (todayDate.getMonth() + 1) + '/' + todayDate.getDate();
    var options = {
        // 允许有额外的面板，放置其他按钮
        'showButtonPanel': true,
        'format': 'yyyy/mm/dd',
        'startDate': '2017/6/1',
        'endDate': todayStr,
        'language': 'zh-CN',
        'todayBtn': 'linked',
        'todayHighlight': true,
        'clearBtn': true,
        'autoclose': true
    };
    startPicker.datepicker(options);
    endPicker.datepicker(options);
};


$(function(){
   var newsList = new CMSNewsList();
   newsList.run();
});