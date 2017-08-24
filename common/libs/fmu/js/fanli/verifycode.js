///<reference path="../core/fmu.js" />
///<reference path="../../../../libs/jquery/jquery.js" />

/**
 * @file verifycode
 * @import core/fmu.js, vendors/jquery/jquery.js, plugins/countdownbutton.js, core/widget.js, widget/toast.js
 */

FMU.namespace("Fanli.VerifyCode").prop("send", function (options) {

    var settings = $.extend(true, {}, {
        // 发送 api
        apiUrl: "//passport{0}/center/safephone/sendverifycode?jsoncallback=?".format(Fanli.Utility.rootDomain),
        // 位置码
        pos: 601,
        // 发送验证码按钮
        $trigger: "",
        // 发送按钮默认是激活状态，设置为true不可点
        activeModel: false,
        // 发送目标参数
        dest: "mobile",
        // 手机号码/邮箱地址容器
        $dest: "",
        // 切换发送通道
        isresend: 0,
        //验证类型, 支持trigger的data-vertype="voice"
        vertype: "",
        // 发送成功后触发
        onSendSuccess: $.noop,
        // 发送失败后触发
        onSendError: $.noop,
        // 发送之前的条件判断，返回为值为true的时候，发送验证码
        sendCondition: function () {
            return true;
        },
        // countdown button参数
        countDown: {
            until: 60,
            prependText: "",
            appendText: "秒后重新发送",
            disabledClass: "fui-vcode-disabled-btn",
            onComplete: $.noop
        }
    }, options);

    if (!settings.$trigger) {
        // 无触发按钮时，退出函数
        return;
    }

    var $trigger = settings.$trigger;
    var $dest = settings.$dest;
    var phoneReg = /^0{0,1}1[34578]{1}[0-9]{9}$/ig;

    var isSending = false;

    var disabledBtnClass = settings.countDown.disabledClass;
    var disabledAttr = "disabled";

    var onSendSuccess = settings.onSendSuccess;
    var onSendError = settings.onSendError;
    var isresend = settings.isresend;

    var postData = {
        pos: settings.pos,
        vertype: $trigger.data("vertype") || settings.vertype,
        isresend: isresend
    };

    function setup() {
        $trigger.on("click.SVC", clickHandler);

        $trigger.data("countdownComplete", function () {
            isSending = false;
        });

        if (settings.activeModel) {
            $dest.on("input", function () {
                phoneReg.lastIndex = 0;

                if (!isSending) {
                    if (phoneReg.test($.trim($dest.val()))) {
                        $trigger.removeClass(disabledBtnClass).prop(disabledAttr, false);
                    } else {
                        $trigger.addClass(disabledBtnClass).prop(disabledAttr, true);
                    }
                }
            });
        }
    }

    function clickHandler() {
        if (!settings.sendCondition()) {
            return;
        }

        postData[settings.dest] = $dest ? $.trim($dest.val()) : "";

        isSending = true;
        $trigger.addClass(disabledBtnClass).prop(disabledAttr, true);

        $.getJSON(settings.apiUrl, postData).done(function (res) {
            $trigger.removeClass(disabledBtnClass).prop(disabledAttr, false);
      
            if (res.status == 1) {
                if (res.data["send_voice"] == 1) {
                    Fanli.Utility.Toast.open("如有来电，请接听电话，验证码是您听到的6位数字");
                }

                $trigger.countdownButton(settings.countDown);

                onSendSuccess(res.data);

            } else{
                onSendError(res.info, res);
                isSending = false;
            }
            postData.isresend = 1;

        }).fail(function () {
            onSendError("发送失败");
            postData.isresend = 1;
            isSending = false;
            $trigger.removeClass(disabledBtnClass).prop(disabledAttr, false);
        });
    }

    setup();

});