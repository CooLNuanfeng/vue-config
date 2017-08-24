/*
pageflip

HTML: <div id="J-pageflip" class="pageflip" data-name="" data-type="list"></div>

require adloader
*/

;(function($){

    var defaults = {
        largeW: '350px',
        largeH: '350px',
        smallW: '50px',
        smallH: '50px'
    };

    $.fn.pageflip = function(opts){
        var conf = $.extend({},defaults,opts);
        
        return this.each(function(){
            
            var el = new Pageflip($(this),conf);
            
            return this;
        });
    };

    function Pageflip(trigger,conf){ //trigger:jQuery object
        var faName = trigger.data('name');
        var cookie = 'ad-pageflip-' + faName;

        if(cookie.getCookie()==1){return;}
        
        trigger.adloader({
            onLoad: function(){

                var $links = trigger.find('a');
                var $imgs = trigger.find('img');
                
                trigger.append('<a href="javascript:void(0);" class="flip-close">&times;</a>');
                
                trigger.on('click', '.flip-close', function(){
                    trigger.remove();
                    cookie.setCookie('1', '1', Fanli.Utility.rootDomain, '/');
                });
                
                if($links.length > 1){
                    var $small = $links.eq(1);
                    
                    trigger.show();
                    $large.addClass('flip-large');
                    $small.addClass('flip-small');
                    
                    trigger.on('mouseenter', function(){
                        $large.stop().animate({width: conf.largeW, height: conf.largeH}, 500);
                    }).on('mouseleave', function(){
                        $large.stop().animate({width: conf.smallW, height: conf.smallH}, 200);
                    });
                }

                trigger.show();
            }
        });
    }

})(jQuery);