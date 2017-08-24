/**
 * @file sticky
 * @import zepto.js
 */

(function ($) {
    $.fn.sticky = function (options) {
        var settings = $.extend(true, {
            top: 0,
            zIndex: 99,
            stickyClass: 'stickybox',
            afterStickyOnAndroid: function(){},
        }, options);

        var ua = navigator.userAgent;
        var av = navigator.appVersion;

        return this.each(function () {
            var $this = $(this);

            function iOSversion() {
                // av in fanli app => 5.1.0.52 (iPhone; iPhone OS 9.3.2; zh_CN; ID:1-4255770-12571050803617-17-1)
                // av in other app => 5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1

                var v = ua.indexOf('Fanli') > -1 ? av.match(/OS (\d+).(\d+).?(\d+)?/) : av.match(/OS (\d+)_(\d+)_?(\d+)?/);
                //return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
                return parseInt(v[1], 10);
            }

            function renderSticky() {
                if (/iP(hone|od|ad)/.test(ua) && iOSversion() >= 6) {
                    $this.css({
                        "position": "-webkit-sticky",
                        "left": "0",
                        "top": settings.top,
                        "z-index": settings.zIndex
                    });
                    $this.addClass(settings.stickyClass);
                } else {
                    var compareVal = $this.offset().top;
                    var isfixed = false;

                    $(window).on("scroll", function () {
                        if (window.scrollY >= compareVal) {
                            $this.css({
                                "position": "fixed",
                                "left": "0",
                                "top": settings.top,
                                "z-index": settings.zIndex
                            });
                            $this.addClass(settings.stickyClass);
                            isfixed = true;
                        } else {
                            $this.removeAttr("style");
                            $this.css({
                                "position": "static"
                            });
                            $this.removeClass(settings.stickyClass);
                            isfixed = false;
                        }

                        settings.afterStickyOnAndroid($this, isfixed);
                    });
                }
            }

            function setup() {
                renderSticky();
            }

            setup();
        });
    };
}($));