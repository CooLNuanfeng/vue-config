///<reference path="../core/fmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../vendors/jquery/jquery-2.1.1.js" />
/**
 * @file dialog
 * @import vendors/jquery/jquery-2.1.1.js, core/fmu.js, core/widget.js
 */

FMU.UI.define("TogglePanel", {
    init: function () {
        // toggle direction, up down left right
        this.direction = "up";
        this.offset = "0";
        this.effect = "all .3s ease-in-out";
        this.$toggleEle = "";
        this.mask = false;
        this.beforeShowCallback = $.noop;
        this.afterShowCallback = $.noop;
        this.afterHideCallback = $.noop;
    },

    setup: function () {
        this.transitionCssProp = "-webkit-transition";
        this.transformCssProp = "-webkit-transform";
        this.translateX = "translateX";
        this.translateY = "translateY";
        this.translateX0 = "translateX(0)";
        this.translateX100 = "translateX(100%)";
        this.translateX_100 = "translateX(-100%)";
        this.translateY0 = "translateY(0)";
        this.translateY100 = "translateY(100%)";
        this.translateY_100 = "translateY(-100%)";

        /*
        if (this.mask) {
            this.$toggleEle.wrap("<div style='width:100%;height:100%; background:rgba(0, 0, 0, .4);'></div>");
            this.$toggleEle = this.$toggleEle.parent();
        }
        */

        if (this.mask) {
            this.$mask = $("<div style='position:fixed; left:0; top: 0; z-index: 98; display:none; width:100%;height:100%; background:rgba(0, 0, 0, .4);'></div>").appendTo("body")
            this.$mask.on("touchmove", function (ev) {
                ev.preventDefault();
            });
        }

        this.$toggleEle.css(this.transitionCssProp, this.effect)
            .css({
                position: "fixed",
                zIndex: 99
            });

        this["_{0}_deactivate".format(this.direction)]();

        //this.deactivate();

        /*
        this.$toggleEle[0].addEventListener('webkitTransitionEnd', function (ev) {
            console.log(ev.type);
        }, false);
        */
    },

    _up_deactivate: function () {
        return this.$toggleEle.css("bottom", this.offset).css(this.transformCssProp, this.translateY100);
    },

    _up_activate: function () {
       return this.$toggleEle.css(this.transformCssProp, this.translateY0);
    },

    _down_deactivate: function () {
        return this.$toggleEle.css("top", this.offset).css(this.transformCssProp, this.translateY_100);
    },

    _down_activate: function () {
        return this.$toggleEle.css(this.transformCssProp, this.translateY0);
    },

    _left_deactivate: function () {
        return this.$toggleEle.css("left", this.offset).css(this.transformCssProp, this.translateX_100);
    },

    _left_activate: function () {
        return this.$toggleEle.css(this.transformCssProp, this.translateX0);
    },

    _right_deactivate: function () {
        return this.$toggleEle.css("right", this.offset).css(this.transformCssProp, this.translateX100);
    },

    _right_activate: function () {
        this.$toggleEle.css(this.transformCssProp, this.translateX0);
    },

    activate: function () {
        this.beforeShowCallback();
        this.$mask && this.$mask.show();
        this.$toggleEle.show();
        this.afterShowCallback();
        setTimeout(this.proxy(function () {
            this["_{0}_activate".format(this.direction)]();
        }), 0);
    },

    deactivate: function () {
        this.$mask && this.$mask.hide();
        this["_{0}_deactivate".format(this.direction)]();
        setTimeout(this.proxy(function () {
            this.$toggleEle.hide();
            this.afterHideCallback();
        }), 350);
    }
});