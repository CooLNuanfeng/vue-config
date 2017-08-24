///<reference path="../core/fmu.js" />
///<reference path="../../../../libs/jquery/jquery.js" />

/**
 * @file countdownbutton
 * @import vendors/jquery/jquery.js
 */

(function ($) {
    $.fn.countdownButton = function (options) {
        var settings = $.extend(true, {
            until: 10,
            prependText: "",
            appendText: "",
            disabledClass: "fui-vcode-disabled-btn",
            onComplete: $.noop
        }, options);

        return this.each(function () {
            var $this = $(this);
            var originalText = $this.val();
            var until = settings.until;
            var prependText = settings.prependText;
            var appendText = settings.appendText;
            var disabledAttr = "disabled";
            var disabledClass = settings.disabledClass;
            var intervalId;

            function start() {
                $this.addClass(disabledClass).prop(disabledAttr, true);
                $this.val("{0}{1}{2}".format(prependText, until, appendText));
                $this.data("countdownstop", stop);
                intervalId = setInterval(function () {
                    update();
                }, 1000);
            }

            function stop() {
                clearInterval(intervalId);
                $this.val(originalText).removeClass(disabledClass).prop(disabledAttr, false);
            }

            function update() {
                $this.val("{0}{1}{2}".format(prependText, --until, appendText));
                if (until < 1) {
                    stop();
                    settings.onComplete();

                    if ($.isFunction($this.data("countdownComplete"))) {
                        $this.data("countdownComplete")();
                    }
                }
            }

            start();
        });
    };
}(jQuery));