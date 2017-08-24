///<reference path="../core/fmu.js" />
///<reference path="../extend/jquery.extend.js" />
///<reference path="../../../../libs/jquery/jquery-2.1.1.js" />

/**
 * @file imglazyload
 * @import core/fmu.js, vendors/jquery/jquery-2.1.1.js, extend/jquery.extend.js.js
 */
(function ($) {

    $.fn.imglazyload = function (options) {
        var $window = $(window);

        var settings = $.extend({
            threshold: $window.height() * 3,
            container: window,
            skip_invisible: true,
            data_attribute: 'original',
            viewportModel: false,
            onLoad: $.noop
        }, options);

        var elements = this;
        var len = elements.length;
        var count = 0;
        var eventNamespace = '.IMGLAZYLOAD';

        $(window).on("scroll resize", function () {
            elements.each(function () {
                var $this = $(this);

                if (!$this.is(":visible")) {
                    return true;
                }

                if (settings.viewportModel) {
                    if ($.inviewport($this, settings)) {
                        $this.trigger("appear");
                    }
                } else {
                    if (!$.belowthefold($this, settings) && !$.rightoffold($this, settings)) {
                        $this.trigger("appear");
                    }
                }
            });
        });

        return this.each(function () {
            var $this = $(this);
            var imgSrc = $this.attr('src');
            var imgAttribute = $this.data(settings.data_attribute);

            if (!$this.is(":visible")) {
                return true;
            }

            function setup() {
                $this.one("appear", function () {
                    $this.attr('src', imgAttribute);
                    settings.onLoad($this);
                    count++;
                    /*
                    if (count >= len) {
                        $window.off(eventNamespace);
                    }
                    */
                });

                initialition();
            }

            function initialition() {
                if (settings.viewportModel) {
                    if ($.inviewport($this, settings)) {
                        $this.trigger("appear");
                    }
                } else {
                    if (!$.belowthefold($this, settings) && !$.rightoffold($this, settings)) {
                        $this.trigger("appear");
                    }
                }
            }

            setup();
        });
    };
})(jQuery);