///<reference path="../../js/base.js" />
var MagicBarBase = new Fanli.Class();

MagicBarBase.inculde({
    init: function () {
        this.view = "";
        this.trigger = "";
    },

    adjustPosition: function (offset) {
        if (typeof offset === "undefined") {
            offset = 0;
        }
        this.view.css('top', this.trigger.offset().top - $(window).scrollTop() - offset + "px");
    },

    nailTop: function (top) {
        var $arrow = $(".J-mbar-mod-arrow", this.view);
        $arrow.css('top', this.trigger.offset().top - $(window).scrollTop() + "px");
        this.view.css({ "top": top + "px" });
    }

});