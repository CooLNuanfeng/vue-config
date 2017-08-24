/*
    场景1： 
    DOM:
    <div class="box J_box" data-tw="1">1
    ...
    <div class="box J_box" data-tw="9">9
    </div>

    <div class="nav">
        <ul>
            <li class="selected" data-tw="1">1</li>
             ...
            <li data-tw="9">9</li>
        </ul>
    </div>

    Style:
    .box { height: 200px; border:2px solid #00ff21; margin-bottom: 10px; line-height: 200px; font-size: 50px; font-weight:bold; text-align:center; }
    .nav { position: fixed; top:30px; right: 20px; width:50px; border:1px solid #ffd800; text-align:center;}
    .nav ul { background-color: #fff;}
    .nav li { height:30px; line-height:30px; border-bottom: 1px solid #808080;}
    .nav li.selected { background-color: #808080; color: #fff; }

    Call: 
     $.trackWay({
         $eles: $(".J_box")
     });

     $.subscribe("TrackWay", function() {
         $("li.selected").removeClass("selected");
         $("li[data-tw={0}]".format(arguments[1])).addClass("selected");
     });

     外部调用逻辑只需订阅"TrackWay", 该方法的第一个参数为对应的data-tw
*/

(function($) {
     var o = $({});

     $.subscribe = function() {
         o.bind.apply(o, arguments);
     };

     $.unsubscribe = function() {
         o.unbind.apply(o, arguments);
     };

     $.publish = function() {
         o.trigger.apply(o, $.makeArray(arguments));
     };
 })(jQuery);

 $.extend({
     trackWay: function(options) {
         var settings = $.extend(true, {}, {
             $eles: "", //jQuery object
             offsetY: 0
         }, options);

         var $w = $(window);

         $w.on("scroll.trackway resize.trackway", function() {
             var st = $w.scrollTop();
             var tw;

             settings.$eles.each(function() {
                 var $this = $(this);

                 if ($this.offset().top + $this.height() - settings.offsetY >= st) {
                     tw = $this.data("tw");
                     if (tw) {
                         $.publish("TrackWay", tw);
                     }
                     return false;
                 }
             });
         });
     }
 });