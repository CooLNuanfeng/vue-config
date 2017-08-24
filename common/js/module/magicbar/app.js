(function () {
    "use strict";

    var mbContentUrl = passportAppUrl + "/magicbar/user/magicbar";
    var mbJs = "http://static2.51fanli.net/static/magicbar-js.js";
    var v = Fanli.Utility.staticTimeStamp();
    var isShow = $('#topbar').data('closemagicbar') != 1;

    if(isShow){
        $.getCacheJSONP("{0}?jsoncallback=?".format(mbContentUrl))
         .done(function (res) {
             if (!res.status) {
                 return;
             }

             var $view = $(res.data).appendTo("body");

             setTimeout(function () {
                 $.ajax({url: "{0}?v={1}".format(mbJs,v), dataType: "script", cache: true })
                 .done(function () {
                     var mb = new MagicBar();
                     mb.view = $view;
                     mb.setup();
                 });
             }, 0);
         });
    }

}());