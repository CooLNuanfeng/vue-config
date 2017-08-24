/**
 * 验证码
 * @import youmi.js,widget.js
 * Demo: http://static2.51fanli.net/common/js/fanli/ui/demo/vercode.html
**/

///<reference path="youmi.js" />
///<reference path="widget.js" />

Youmi.UI.define("VerCode", {
    init: function (superclass) {
        this.$vcBox = $("#J_ym_vc_box");
        this.onVerifySuccess = $.noop;
    },

    setup: function () {

        if (this.$vcBox.length == 0) {
            return;
        }

        this.$vc = this.$vcBox.find(".J_ym_vc_input");
        this.$tipsVerify = this.$vcBox.find(".J_ym_vc_icon_top");
        this.$vcImg = this.$vcBox.find(".J_ym_vc_img");
        this.$updateImageTrigger = this.$vcBox.find(".J_ym_vc_up");

        var $vc = this.$vc;
        var $tipsVerify = this.$tipsVerify;
        var $vcImg = this.$vcImg;

        $vc.on("keyup", this.proxy(function (ev) {
            var val = $.trim($vc.val())
            var len = val.length;
            var tipErrorClass = "ym-vc-error";

            if (len >= 4) {
                $.getJSON('http://fun{1}/client/verify/check?passcode={0}&jsoncallback=?'.format(val, Fanli.Utility.rootDomain))
                 .done(this.proxy(function (res) {
                     if (res.status == 1) {
                         if (res.data == 1) {
                             $tipsVerify.removeClass(tipErrorClass).show();
                             this.onVerifySuccess();
                         } else if (res.data == 2) {
                             $tipsVerify.addClass(tipErrorClass).show();
                             $vcImg.attr("src", verifyCodeImageUrl + new Date().getTime());
                         } else {
                             $tipsVerify.addClass(tipErrorClass).show();
                         }
                     }
                 }));
            }
            else {
                $tipsVerify.removeClass(tipErrorClass).hide();
            }
        }));

        /*
        this.$vc.on("focusin", this.proxy(function () {
            this.$vc.addClass("ym-vc-input-focus");
        })).on("focusout", this.proxy(function () {
            this.$vc.removeClass("ym-vc-input-focus");
        }));
        */

        this.$updateImageTrigger.on("click", this.proxy(function (ev) {
            ev.preventDefault();
            this.updateVerImg();
        }));
    },

    updateVerImg: function (withoutfocus) {
        setTimeout(this.proxy(function () {
            this.$tipsVerify.removeClass('ym-vc-error').hide();
            this.$vcImg.attr("src", verifyCodeImageUrl + new Date().getTime());
            this.$vc.val('');
            if (!withoutfocus) {
                this.$vc.focus();
            }
        }), 25);
    }
});