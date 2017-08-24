///<reference path="../core/fmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../vendors/jquery/jquery.js" />

/**
 * @file cuntdown
 * @import vendors/jquery/jquery-2.1.1.js, core/fmu.js, core/widget.js
 * @link <link rel="stylesheet" href="../css/toast.css" />
 */

FMU.UI.define("Toast", {
    init: function () {
        this.$wrap = $('.J_toast').length>0 ? $('.J_toast') : $('<div class="J_toast fmu-toast"></div>').appendTo('body');
    },

    setup: function () {
        //没有使用
    },

    open: function(html){
        var me = this;
        var _html = html || '成功添加';
        var $wrap = me.$wrap;
        var size;
       
        $wrap.html(_html).removeClass('fmu-toast-act');
       
        setTimeout(function(){
            var size = $wrap.outerWidth();
            var w = $(window).width();
            $wrap.css({marginLeft: Math.round((w-size)/2) +'px'}).addClass('fmu-toast-act');
        },0);
    }
    
});