(function(n){n.fn.overlayGuide=function(t){return t=n.extend({onBeforeLoad:n.noop,onLoad:n.noop,onClose:n.noop,zIndex:9999,triggerEvents:"click",tipsSelector:"",triggerSelector:"",closeBtnSelector:".J-close-btn",maskId:"J-guid-mask-box",opacity:.8,offset:[0,0],autoplay:!1,backTo:!1},t),this.each(function(){function f(){t.onBeforeLoad(),s(),c(),o(),t.onLoad()}function e(){h()}function o(){var u=n("#{0}".format(t.maskId)).length==0?n('<div id="{0}" style="position:absolute; top:0; left:0; z-index:{1}; width:100%; height:{2}px; background:#000; filter:alpha(opacity={3}); opacity:{4};"><\/div>'.format(t.maskId,t.zIndex-1,r.height(),t.opacity*100,t.opacity)).fadeIn("fast").appendTo("body"):n("#{0}".format(t.maskId)).fadeIn("fast");i.on("scroll resize",function(){u.css({height:Math.max(r.height(),i.height())+"px",width:Math.max(r.width(),i.width())})})}function s(){n(t.tipsSelector).css({position:"absolute","z-index":t.zIndex}),i.on("resize",function(){n(t.tipsSelector).css({top:u.offset().top-t.offset[1],left:u.offset().left-t.offset[0]})}).trigger("resize"),n(t.tipsSelector).fadeIn("fast")}function h(){n(t.tipsSelector).find(t.closeBtnSelector).on("click",function(){n("#{0}".format(t.maskId)).fadeOut(),n(t.tipsSelector).fadeOut("fast",function(){t.onClose()})})}function c(){t.backTo&&n("body, html").animate({scrollTop:u.offset().top-t.offset[1]},120)}function l(){if(!t.autoplay||t.triggerSelector)r.on(t.triggerEvents,t.triggerSelector,function(){f()})}var u=n(this),i=n(window),r=n(document);t.autoplay&&f(),e(),l()})}})(jQuery)