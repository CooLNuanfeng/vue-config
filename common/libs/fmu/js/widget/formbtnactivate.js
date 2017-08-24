///<reference path="../core/fmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../vendors/jquery/jquery-2.1.1.js" />

/**
 * @file form
 * @import vendors/jquery/jquery-2.1.1.js, core/fmu.js, core/widget.js
 */

FMU.UI.define("FormBtnActivate", {
    init: function () {
        this.$form = $('#J_fmu_form');
        //selector
        this.requiredInputSel = '.J_required_input';
        this.submitBtnSel = '#J_form_submit';
        //class name
        this.submitBtnDisableCls = 'fui-btn-disabled';
        // 用于销毁事件
        this.eventNamespace = '.BTNACTIVATE';
    },

    setup: function () {
        this.btnactivate();
    },

    btnactivate: function () {
        var form = this;
        var requiredInputSel = form.requiredInputSel;

        form.$form.each(function () {
            var $curform = $(this);
            var $inputs = $curform.find(requiredInputSel);
            $inputs.on('input change' + form.eventNamespace, function () {
                if (form._checkInputAll($inputs)) {
                    form._activateSubmit($curform);
                } else {
                    form._deactivateSubmit($curform);
                }
            });

            if (form._checkInputAll($inputs)) {
                form._activateSubmit($curform);
            } else {
                form._deactivateSubmit($curform);
            }
        });
    },

    _checkInputAll: function ($inputs) {
        var isInputAll = true;
        $inputs.each(function () {
            var val = $.trim($(this).val());

            if (!val) {
                isInputAll = false;

                return false;
            }
        });
        return isInputAll;
    },

    _activateSubmit: function ($curform) {
        $curform.find(this.submitBtnSel).removeClass(this.submitBtnDisableCls).prop('disabled', false);
    },

    _deactivateSubmit: function ($curform) {
        $curform.find(this.submitBtnSel).addClass(this.submitBtnDisableCls).prop('disabled', true);
    }
});