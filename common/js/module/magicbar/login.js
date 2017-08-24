///<reference path="magicbar.js" />
///<reference path="../../js/base.js" />
var MagicBarLogin = new Fanli.Class(MagicBarBase);

MagicBarLogin.extend({
    clientBlankErrorMap: {
        "requireEmail": { t: "notice", txt: "请输入您的用户名或邮箱地址" },
        "regEmail": { t: "notice", txt: "邮箱格式不正确" },
        "requirePassword": { t: "notice", txt: "请输入您的密码,或者您<a target='_blank' class='green' href='http://passport{0}/password/'>忘记了密码?</a>".format(Fanli.Utility.rootDomain) },
        "requireVerifyCode": { t: "notice", txt: "请输入验证码！" }
    },
    serverErrorMap: {
        "20001": { t: "notice", txt: "为保障广大用户的返利资产安全，返利网账户安全保护等级已经提升，您的账号被评估为可能存在风险。恳请您立即修改您的密码！" },
        "20002": { t: "error", txt: "您输入的帐号和密码不匹配，请重新输入。或者您<a class='green' target='_blank' href='http://passport{0}/password/'>忘记了密码?</a>".format(Fanli.Utility.rootDomain) },
        "20003": { t: "error", txt: "用户名与邮箱重复,请联系客<a href='javascript:void(0);' class='green contact-us'>联系客服</a>处理！" },
        "20004": { t: "notice", txt: "很抱歉,您的帐号可能已被禁用,请联系客服咨询。" },
        "20005": { t: "notice", txt: "您的账号可能存在安全问题，暂时不能登录，您可以<a href='javascript:void(0);' class='green contact-us'>联系客服</a>咨询具体情况。" },
        "20006": { t: "error", txt: "验证码输入错误！" },
        "20007": { t: "notice", txt: "尝试为您登录时遇到问题，请您重新登录！" },
        "20009": { t: "notice", txt: "您已经登录过了,请刷新页面或关闭登录框。" },
        "20010": { t: "notice", txt: "该用户名尚未注册返利网，试试用邮箱登录。" },
        "20011": { t: "error", txt: "不允许登陆" },
        "20012": { t: "notice" },
        "20013": { t: "error", txt: "输入的密码与账号不匹配，或者您<a class='green' target='_blank' href='http://passport{0}/password/'>忘记了密码?</a><br/>如未启用手机号登录，请使用邮箱或用户名登录".format(Fanli.Utility.rootDomain) },
        "20014": { t: "error", txt: "该手机号尚未注册返利网，请用邮箱登录试试" },
        "20015": { t: "error", txt: "您的账号未开启手机号登录，请用手机动态密码登录或邮箱登录" }
    }
});

MagicBarLogin.inculde({
    init: function () {
        // STORY #8788::全站左侧通知消息栏需求
        this.trigger = "";
        //STORY #8788::全站左侧通知消息栏需求
        this.view = "";
        // 账号输入框选择器
        this.userNameSelector = "";
        // 密码输入框选择器
        this.passwordSelector = "";
        // 验证码输入框选择器
        this.verifyCodeSelector = "";
        this.verifyCodeImageSelector = "";
        this.updateCodeImageSelector = "";
        this.toServerSelector = ".J_mbl_tos";
        this.goUrlSelector = "";
        this.autoLoginSelector = "";
        this.toolTips = {
            tSwitch: false,
            // 2周自动登录 tool tips选择器
            twoWeeksTipsSelector: "",
            // 什么是2周自动登录 tool tips选择器
            twoWeeksExplainTipsSelector: ""
        };
        // 登录按钮选择器
        this.submitSelector = "";
        // 登录中按钮选择器
        this.spoofSubmitSelector = "";
        // 验证码行选择器
        this.verifyCodeRowSelector = "";
        // 提交成功回调函数
        this.onSubmitSuccess = $.noop;
        // 提交失败回调函数
        this.onSubmitError = $.noop;
        // 显示提示信息逻辑函数
        this.showMessage = $.noop;
        // 删除提示信息逻辑函数
        this.removeMessage = $.noop;
        this.verifyCode = {
            onSuccess: $.noop,
            onError: $.noop
        };
        this.submitWithEnter = true;
    },
    setup: function () {
        this.$un = $(this.userNameSelector, this.view);
        this.$pw = $(this.passwordSelector, this.view);
        this.$vc = $(this.verifyCodeSelector, this.view);
        this.$vcImg = $(this.verifyCodeImageSelector, this.view);
        this.$updateImageTrigger = $(this.updateCodeImageSelector, this.view);
        this.$vcRow = $(this.verifyCodeRowSelector, this.view);
        this.$cal = $(this.autoLoginSelector, this.view);
        this.$goUrl = $(this.goUrlSelector, this.view);
        this.$submit = $(this.submitSelector, this.view);
        this.$spoofSubmit = $(this.spoofSubmitSelector, this.view);
        this.showMessage = this.showMessage;
        this.removeMessage = this.removeMessage;
        this.clientBlankErrorMap = $.extend({}, MagicBarLogin.clientBlankErrorMap);
        this.serverErrorMap = $.extend(true, {}, MagicBarLogin.serverErrorMap, {
            "20001": { ele: this.$submit },
            "20002": { ele: this.$un },
            "20003": { ele: this.$un },
            "20004": { ele: this.$submit },
            "20005": {},
            "20006": { ele: this.$vc },
            "20007": { ele: this.$submit },
            "20009": { ele: this.$submit },
            "20010": { ele: this.$un },
            "20011": { ele: this.$submit },
            "20012": { txt: "该邮箱尚未注册返利网， <a href='http://passport{1}/reg?action=yes&go_url={0}' target='_blank' class='green'>马上注册</a>".format(this.$goUrl.val(), Fanli.Utility.rootDomain), ele: this.$submit },
            "20013": { ele: this.$un },
            "20014": { ele: this.$submit },
            "20015": { ele: this.$un }
        });

        var loginAjaxUrl = "http://passport{0}/login/ajaxlogin".format(Fanli.Utility.rootDomain);
        var unCookieName = "51fanli_login_username";
        var unCookieValue = decodeURIComponent("prousernameutf".getCookie()) || unCookieName.getCookie();
        var logCountCookieName = "LOGERRTIMES";
        var currentDomain = Fanli.Utility.rootDomain;
        var postData = {};
        var inputFocusClass = "mbl-input-focus";

        this.toolTips.tSwitch && this.bindToolTips();
        if ($.fn.placeholder) {
            setTimeout(this.proxy(function () {
                this.$un.placeholder({ type: 'label' });
                this.$vc.placeholder({ type: 'label' });
            }), 25);
         }

        this.$vc.wrap('<span class="mbl-wrap-verify"></span>').after('<i></i>').keyup(this.proxy(function (ev) {
            var self = this;
            var $this = self.$vc;
            var $tipsVerify = $this.next();
            var val = $.trim($this.val())
            var len = val.length;
            if (len >= 4) {
                $.getJSON('http://fun{1}/client/verify/check?passcode={0}&jsoncallback=?'.format(val, Fanli.Utility.rootDomain))
                 .done(function (res) {
                     if (res.status == 1) {
                         if (res.data == 1) {
                             $tipsVerify.removeClass('error').show();
                         } else if (res.data == 2) {
                             $tipsVerify.addClass('error').show();
                             self.$vcImg.attr("src", verifyCodeImageUrl + new Date().getTime());
                         } else {
                             $tipsVerify.addClass('error').show();
                         }
                     }
                 });
            }
            else {
                $tipsVerify.removeClass('error').hide();
            }
        }));

        $(this.toServerSelector).on("focusin", function () {
            $(this).addClass(inputFocusClass).focusEnd();
        })
        .on("focusout", this.proxy(function (ev) {
            var $el = $(ev.target);
            $el.removeClass(inputFocusClass)
            this.trimSpace($el);
        }));

        $(this.toServerSelector).on("keyup", this.proxy(function (ev) {
            if (ev.keyCode === 13) {
                submitHandler.call(this);
            }
        }));

        this.$submit.on("click", this.proxy(function (ev) {
            ev.preventDefault();
            submitHandler.call(this);
        }));

        this.$updateImageTrigger.on("click", this.proxy(function (ev) {
            ev.preventDefault();
            this.verc();
        }));

        function preparePostData() {
            postData.username = $.trim(this.$un.val());
            postData.userpassword = md5($.trim(this.$pw.val()));
            postData.passcode = $.trim(this.$vc.val());
            postData.cooklogin = 1;//this.$cal.is(":checked") ? 1 : 0;
        }

        function toggleLoginButton() {
            this.$submit.is(":visible") ? this.$submit.hide() : this.$submit.show();
            this.$spoofSubmit.is(":visible") ? this.$spoofSubmit.hide() : this.$spoofSubmit.show();
        }

        function storeUserName() {
            var unVal = $.trim(this.$un.val());
            var unPh = this.$un.attr("placeholder");

            if (unVal && unVal != unPh) {
                unCookieName.setCookie(unVal, 30, currentDomain, "/");
            }
        }

        function showVerifyCodeRow() {
            var lc = logCountCookieName.getCookie();
            if (lc >= 3) {
                this.$vcRow.slideDown();
            }
        }

        function submitHandler() {
            if (!this.blankValidation()) {
                return;
            }
            this.removeMessage();
            this.proxy(toggleLoginButton)();
            this.proxy(storeUserName)();
            this.proxy(preparePostData)();

            $.ajax({
                url: loginAjaxUrl,
                data: postData,
                dataType: "jsonp",
                jsonp: "jsoncallback"
            })
            .done(this.proxy(function (response) {
                if (response.status == "20000") {
                    this.onSubmitSuccess.call(response, null);
                }
                else {
                    this.proxy(showVerifyCodeRow)();
                    this.proxy(this.fillupMsgRow)(response.status, this.serverErrorMap);
                    if (this.serverErrorMap[response.status]["ele"]) {
                        this.serverErrorMap[response.status]["ele"].focus();
                    }

                    this.proxy(toggleLoginButton)();
                }
            }))
            .fail(this.proxy(function (xhr, ts, et) {
                xhr = null;
                this.onSubmitError();
            }));
        }
    },
    bindToolTips: function () {
        var $twoWeeksTips = $(this.toolTips.twoWeeksTipsSelector);
        var $twoWeeksExplainTips = $(this.toolTips.twoWeeksExplainTipsSelector);

        $twoWeeksTips.tooltip({
            position: 'bottom right',
            offset: [-2, -54],
            predelay: 300,
            layout: '<div id="tooltip-check" class="tooltip tooltip-br"><div class="tip-arrow tip-tr"></div></div>'
        });

        $twoWeeksExplainTips.tooltip({
            position: 'bottom right',
            offset: [-2, -6],
            predelay: 100,
            layout: '<div id="tooltip-cooklogin" class="tooltip tooltip-br"><div class="tip-arrow tip-tr"></div><a href="http://help.fanli.com/a/dengluzhucewenti/#6" class="green" target="_blank">什么是两周自动登录</a></div>'
        });
    },
    trimSpace: function ($el) {
        var cVal = $el.val();
        $el.val($.trim(cVal));
    },
    fillupMsgRow: function (k, collection) {
        this.showMessage("<div class='top-tips top-tips-{0}'>{1}</div>".format(collection[k]["t"], collection[k]["txt"]));
    },
    blankValidation: function () {
        var unVal = $.trim(this.$un.val());
        var unPh = this.$un.attr("placeholder");
        var pwVal = $.trim(this.$pw.val());
        var vcVal = $.trim(this.$vc.val());
        var fillupMsgRow = this.proxy(this.fillupMsgRow);

        if (!unVal || unVal == unPh) {
            fillupMsgRow("requireEmail", this.clientBlankErrorMap);
            this.$un.focus();
            return false;
        }

        if (unVal.indexOf("@") > -1 && !InputValidation.isEmail(unVal)) {
            fillupMsgRow("regEmail", this.clientBlankErrorMap);
            this.$un.focus();
            return false;
        }

        if (!pwVal) {
            fillupMsgRow("requirePassword", this.clientBlankErrorMap);
            this.$pw.focus();
            return false;
        }

        if (this.$vcRow.is(":visible") && !vcVal) {
            fillupMsgRow("requireVerifyCode", this.clientBlankErrorMap);
            this.$vc.focus();
            return false;
        }

        return true;
    },
    verc: function () {
        var that = this;
        setTimeout(function () {
            that.$vcImg.attr("src", verifyCodeImageUrl + new Date().getTime());
            that.$vc.val('').focus();
        }, 25);
    },
    activate: function () {
        this.showing = true;
        this.adjustPosition();
        this.view.show();
    },

    deactivate: function () {
        this.showing = false;
        this.view.hide();
    }
});

var loginController = new MagicBarLogin();

// 账号输入框选择器
loginController.userNameSelector = ".J_mb_un";
// 密码输入框选择器
loginController.passwordSelector = ".J_mb_pw";
// 验证码输入框选择器
loginController.verifyCodeSelector = ".J_mb_vc";
loginController.verifyCodeImageSelector = ".J_mb_vc_img";
loginController.updateCodeImageSelector = ".J_mb_vc_img_trigger";
loginController.toServerSelector = ".J_mbl_tos";
loginController.goUrlSelector = ".J_mb_go_url";
// 登录按钮选择器
loginController.submitSelector = ".J_mb_sb_btn";
// 登录中按钮选择器
loginController.spoofSubmitSelector = ".J_mb_sb_spoof_btn";
// 验证码行选择器
loginController.verifyCodeRowSelector = ".J_mblr_ver_row";
// 提交成功回调函数
loginController.onSubmitSuccess = function () {
     window.location.href = "{0}?go_url={1}".format(redirectPrefixAfterLogin, encodeURIComponent(window.location.href));
};
// 提交失败回调函数
loginController.onSubmitError = $.noop;
// 显示提示信息逻辑函数
loginController.showMessage = function (msg) {
    $(".J_mbar_login_msg_row").html(msg).show();
};
// 删除提示信息逻辑函数
loginController.removeMessage = function () {
    $(".J_mbar_login_msg_row").html('').hide();
};