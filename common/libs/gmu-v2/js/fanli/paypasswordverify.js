
(function ($, Module) {
    var inited,
        settings,  
        $uiDialog, 
        $veriDialog, 
        $submitForm,
        $closeBtn, 
        pincode, 
        maskClose;
        
    //'//passport{0}/center/safephone/sendverifycode?jsoncallback=?'.format(Fanli.Utility.rootDomain),
    var defaults = {
        /*
        head: '<h5>请输入支付密码</h5>', 
        head: (new StringBuilder)
                .append('<h5 class="err">支付密码错误</h5>')
                .append('<span class="sub">您还有<em>4次</em>输入机会</span>').toString(), 
        */
        head: (new StringBuilder)
                .append('<h5 class="err">您的账户已被锁定</h5>')
                .append('<span class="sub">请<em>3小时</em>后重试</span>').toString(),
        forgetUrl: '', 
        verifyUrl: '', 
        onSuccess: $.noop
    };
    
    var dialogTpl = (new StringBuilder)
                        .append('<div id="J_paypassword_verify_dialog" class="paypassword-verify-dl clearfix">')
                            .append('<a class="dialog-close J_dialog_close" href="javascript:void(0);">&times;</a>')
                            .append('<form class="J_submit_form">')
                                .append('<div class="J_verify_head verify-head">{0}</div>')
                                .append('<div class="J_pincode" data-type="gmu"></div>')
                                .append('<a href="{1}" class="forget">忘记支付密码?</a>')
                            .append('</form>')
                        .append('</div>');
    
    function checkInited () {
        return !!inited;
    }

    function setup () {
        renderDialog();
        bindEvents(); 
    }
    
    function renderDialog () {
        var htmlStr = dialogTpl.toString().format(settings.head, settings.forgetUrl);
        $('body').append($(htmlStr));
        ($veriDialog = $('#J_paypassword_verify_dialog'))
            .dialog({
                width: '6.9rem', 
                autoOpen: false,
                closeBtn: false, 
                maskClick: function () {
                    maskClose && $veriDialog.dialog('close');
                }
            });
        $submitForm = $veriDialog.find('.J_submit_form');
        $uiDialog = $veriDialog.closest('.ui-dialog');
        
        refineDialog();
        inited = true; 
    }
    
    function refineDialog () {
        var $content = $uiDialog.find('.ui-dialog-content');
        var $btns = $uiDialog.find('.ui-dialog-btns');
        
        $uiDialog.css({ "borderRadius": 0 });
        $content.css({ "padding": 0 });
        $btns.hide();
    }
    
    function renderPincode () {
        if (pincode) {
            return; 
        }

        pincode = new FMU.UI.Pincode($veriDialog.find('.J_pincode'));
    }
    
    function bindEvents () {
        $veriDialog.on('click', '.J_dialog_close', function () {
            $veriDialog.dialog('close');
        });
        
        $submitForm.on('submit', function (ev) {
            ev.preventDefault(); 
            sendPincode();
        });
    }
    
    function sendPincode () {
        $.ajax({
            url: settings.verifyUrl,
            type: "GET",
            data: postData,
            dataType: "jsonp",
            success: function (res) {
                if (res.status == 1) {
                    var onSuccessFunc = settings.onSuccess;
                    typeof onSuccessFunc === 'function' && onSuccessFunc.call(null);
                }
                else {
                    $submitForm.find('.J_verify_head').html(res.info);
                }
            }
        });
    }
    
    function transformToSuccess () {
        maskClose = true; 
        
        $succ.show();
        $submitForm.parent().remove();
        $veriDialog.css({ background: 'transparent' });
    }
    
    Module.prop('verify', function (options) {
        if (!checkInited()) {
            settings = $.extend(true, {}, defaults, options);
            setup();
        }
        
        $veriDialog.dialog('open');
        renderPincode();
        pincode.clearCode();
    });
})($, FMU.namespace("Fanli.PaypasswordVerifier"));