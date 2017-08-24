(function ($, Module) {
    var inited,
        settings,  
        veriDl, 
        $veriDialog, 
        //$submitForm,
        $succ,
        $closeBtn, 
        pincode;
        
    //'//passport{0}/center/safephone/sendverifycode?jsoncallback=?'.format(Fanli.Utility.rootDomain),
    var defaults = {
        head: '<h5>请输入支付密码</h5>', 
        forgetUrl: 'http://m.fanli.com/safecenter/paypwd1', 
        verifyUrl: '', 
        onSuccess: $.noop
    };
    
    var dialogTpl = (new StringBuilder)
                        .append('<div class="fmu-dl-wrap paypassword-verify-dl-container" id="J_paypassword_verify_dialog">')
                            .append('<div class="paypassword-verify-dl clearfix">')
                                .append('<a class="dialog-close J_dialog_close" href="javascript:void(0);">&times;</a>')
                                //.append('<form class="J_submit_form">')
                                    .append('<div class="J_verify_head verify-head">{0}</div>')
                                    .append('<div class="J_pincode"></div>')
                                    .append('<a href="{1}" class="forget">忘记支付密码?</a>')
                                //.append('</form>')
                            .append('</div>')
                        .append('</div>');
    
    function checkInited () {
        return !!inited;
    }

    function setup () {
        renderDialog();
        bindEvents(); 
    }
    
    function renderDialog () {
        var htmlStr = dialogTpl.toString().format(settings.head, settings.forgetUrl), 
            $dialog;
        $('body').append($(htmlStr));
        veriDl = new FMU.UI.Dialog();
        veriDl.$dialog = ($veriDialog = $('#J_paypassword_verify_dialog'));
        veriDl.setup();
        //$submitForm = $veriDialog.find('.J_submit_form');
        $succ = $veriDialog.find('.J_success');
        
        inited = true; 
    }
    
    function renderPincode () {
        if (pincode) {
            return; 
        }

        pincode = new FMU.UI.Pincode($veriDialog.find('.J_pincode'), {
            onInput: function (code) {
                code && code.length == 6 && sendPincode();
            }
        });
    }
    
    function bindEvents () {
        $veriDialog.on('click', '.J_dialog_close', function () {
            veriDl.close();
        });
        
        $veriDialog.on('blur', '.J_pincode_input', function () {
            setTimeout(function () { window.scrollTo(0, 0); }, 0);
        });
        
        /*
        $submitForm.on('submit', function (ev) {
            ev.preventDefault();
            
            if (pincode && pincode.getCode().length === 6) {
                sendPincode();
            }
        });
        */
    }
    
    /**
    {
        status: 1, 
        data: {
            key: 1, // 1: 成功; 2:　账户被锁定; 3: 支付码错误;
            msg: '<h5 class="err">支付密码错误</h5><span class="sub">您还有<em>4次</em>输入机会</span>' // 错误信息
        }, 
        info: 'error'
    }
    */
    function sendPincode () {
        $veriDialog.find('.J_pincode_input').blur();
        $.ajax({
            url: settings.verifyUrl,
            type: "GET", 
            data: $.extend(true, settings.postData, pincode ? { paypwd: pincode.getCode() } : {}),
            success: function (res) {
                if (res.status == 1) {
                    if (res.data.key === 1) {
                        var onSuccessFunc = settings.onSuccess;
                        typeof onSuccessFunc === 'function' && onSuccessFunc.call(null);
                    }
                    else if (res.data.key === 2) {
                        $veriDialog.find('.J_verify_head').html(res.data.msg);
                        pincode.clearCode();
                    }
                    else if (res.data.key === 3) {
                        $veriDialog.find('.J_verify_head').html(res.data.msg);
                        setTimeut(function () {
                            window.location.reload();
                        }, 2000);
                    }
                }
                else {
                    pincode.clearCode();
                    veriDl.close();
                    Fanli.Utility.Toast.open(res.info);
                }
            }
        });
    }
    
    Module.prop('verify', function (options) {
        if (!checkInited()) {
            settings = $.extend(true, {}, defaults, options);
            setup();
        }
        
        veriDl.load();
        renderPincode();
        pincode.clearCode();
    });
})($, FMU.namespace("Fanli.PaypasswordVerifier"));