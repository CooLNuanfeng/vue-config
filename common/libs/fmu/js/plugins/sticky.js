///<reference path="../../../../libs/jquery/jquery.js" />

/**
 * @file sticky
 * @import vendors/jquery/jquery.js
 */

(function ($) {
    $.fn.sticky = function (options) {
        var settings = $.extend(true, {
            top: 0,
            zIndex: 9,
            defaultPosition: "static",
            stickyClass: "",
            threshold: 0
        }, options);

        var ua = navigator.userAgent;
        var av = navigator.appVersion;

        return this.each(function () {
            var $this = $(this);
            var $placeholder=$("#J_sticky_placeholder");

            function iOSversion() {
                // av in fanli app => 5.1.0.52 (iPhone; iPhone OS 9.3.2; zh_CN; ID:1-4255770-12571050803617-17-1)
                // av in other app => 5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1

                var v = ua.indexOf('Fanli') > -1 ? av.match(/OS (\d+).(\d+).?(\d+)?/) : av.match(/OS (\d+)_(\d+)_?(\d+)?/);
                //return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
                return parseInt(v[1], 10);
            }

            function renderSticky() {
                if (/iP(hone|od|ad)/.test(ua) && iOSversion() >= 6 && settings.stickyClass == "") {
                    $this.css({
                        "position": "-webkit-sticky",
                        "left": "0",
                        "top": settings.top,
                        "z-index": settings.zIndex
                    });
                } else {
                    var compareVal = $this.offset().top;

                    $(window).on("scroll", function () {

                        if (!$this.is(":visible")) { return; }

                        if (window.scrollY > compareVal + settings.threshold) {
                            $this.css({
                                "position": "fixed",
                                "left": "0",
                                "top": settings.top,
                                "z-index": settings.zIndex
                            }).addClass(settings.stickyClass);
                            $placeholder && $placeholder.show();
                        } else {
                            $this.removeAttr("style").removeClass(settings.stickyClass);
                            $this.css({
                                "position": settings.defaultPosition
                            });
                            $placeholder && $placeholder.hide();
                        }
                    });
                }
            }

            function setup() {
                renderSticky();
            }

            setup();
        });
    };
}(jQuery));