///<reference path="../core/fmu.js" />
///<reference path="../vendors/jquery/jquery.js" />

/**
 * @file cleanup
 * @import vendors/jquery/jquery.js, core/fmu.js, core/widget.js
 */

(function ($) {

    FMU.UI.define("Cleanup", {
        init: function () {
            this.$input = "";
            this.$cleanup = "";
            this.offset = {
                left: 0,
                top: 0
            };
            this.cleanupComplete = $.noop;
        },

        setup: function () {
            var $input = this.$input;

            if (!$input) {
                return;
            }

            this._buildCleanup();

            $input.on("focusin.UC input.UC", this.proxy(function () {
                this._focusinHandler();
            }));

            this.$cleanup.on("click.UC", this.proxy(function () {
                this._deleteHandler();
            }));

            $(window).on("resize.UC ortchange.UC", this.proxy(function () {
                this._adjustCleanup();
            }));
        },

        _buildCleanup: function () {
            var id = "J_{0}".format(Math.random().toString(16).substr(2, 6));
            var $input = this.$input;
            $input.before("<a href='javascript:void(0);' style='display:none;' class='fmu-cleanup' id='{0}'><i class='icon-delete'></i></a>".format(id));
            this.$cleanup = $("#{0}".format(id));
            $input.parent().css("position", "relative");
            this._adjustCleanup();

            if ($.trim($input.val())) {
                this.$cleanup.show();
            }
        },

        _adjustCleanup: function () {
            var $input = this.$input;
            var inputOffset = $input.offset();
            this.$cleanup.css({
                "left": inputOffset.left - $input.parent().offset().left + $input.outerWidth() - this.$cleanup.outerWidth() - this.offset.left + "px",
                "top": this.offset.top + "px"
            });
        },

        _focusinHandler: function () {
            var $input = this.$input;
            var $cleanup = this.$cleanup;
            var ph = $input.attr("placeholder");
            var val = $.trim($input.val());
            if (val && val != ph) {
                $cleanup.show();
            }
            else {
                $cleanup.hide();
            }
        },

        _deleteHandler: function () {
            this.$cleanup.hide();
            this.$input.val('').focus();
            this.cleanupComplete();
        }
    });

    $.fn.cleanup = function (options) {
        var cleanupInstance = this.data("cleanup");
        if (cleanupInstance) {
            return cleanupInstance;
        }

        var settings = $.extend(true, {}, {
            offset: {
                left: 0,
                top: 0
            },
            cleanupComplete: $.noop
        }, options);

        return this.each(function () {
            cleanupInstance = new FMU.UI.Cleanup();
            cleanupInstance.$input = $(this);
            cleanupInstance.offset = settings.offset;
            cleanupInstance.cleanupComplete = settings.cleanupComplete;
            cleanupInstance.setup();

            cleanupInstance.$input.data("cleanup", cleanupInstance);

        });
    }

})(jQuery);
