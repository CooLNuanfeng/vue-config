///<reference path="../core/fmu.js" />
///<reference path="../extend/jquery.extend.js" />
///<reference path="../vendors/jquery/jquery-2.1.1.js" />

/**
 * @file scrollloaddom
 * @import core/fmu.js, vendors/jquery/jquery-2.1.1.js, extend/jquery.extend.js.js
 */

(function ($) {

    $.fn.scrollloaddom = function (options) {
        var settings = $.extend({
            threshold: 0,
            perCallback: $.noop,
            allCallback: $.noop,
            container: window,
            finishClass: "finish-load"
        }, options);

        var elements = this;
        var len = elements.length;
        var count = 0;
        var eventNamespace = '.SCROLLLOADDOM';
        var $window = $(window);

        $window.on("scroll{0} resize{0}".format(eventNamespace), function () {
            elements.each(function () {
                var $this = $(this);

                if (!$this.is(":visible")) {
                    return true;
                }

                if (!$.belowthefold($this, settings) && !$.rightoffold($this, settings)) {
                    $this.trigger("appear");
                }
            });
        });

        return this.each(function () {
            var $this = $(this);
            var $textarea = $this.find("textarea").eq(0);

            if (!$this.is(":visible")) {
                return true;
            }

            function setup() {
                $this.one("appear", function () {
                    appendHtml();
                });

                initialition();
            }

            function initialition() {
                if (!$.belowthefold($this, settings) && !$.rightoffold($this, settings)) {
                    $this.trigger("appear");
                }
            }

            function appendHtml() {
                $textarea.before($textarea.val());
                $this.addClass(settings.finishClass);
                $textarea.remove();
                settings.perCallback($this);
                count++;
                if (count >= len) {
                    settings.allCallback();
                    $window.off(eventNamespace);
                }
            }

            setup();
        });
    };
})(jQuery);