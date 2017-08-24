///<reference path="../core/fmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../vendors/jquery/jquery-2.1.1.js" />

/**
 * @file dialog
 * @import vendors/jquery/jquery-2.1.1.js, core/fmu.js, core/widget.js
 */

FMU.UI.define("Dialog", {
    init: function() {
        //dialog出现的位置 center top bottom
        this.position = 'center';
        //dialog动画 false true
        this.animation = false;
        this.closeSelector = '.J_fmu_dl_close';
        this.maskClass = 'fmu-dl-mask'; //string or ''
        this.maskClose = false;
        this.opened = false;
        this.touchDefault = true;
        this.excludeDialog = false;
        //step
        this.stepContainerSelector = '.J_fmu_dl_step';
        this.goNextStepSelector = '.J_fmu_dl_gonext';

        //支持事件: onBeforeLoad,onLoad,onBeforeClose,onClose
        this.$dialog = $('#J_fmu_dl');

        // 用于销毁事件
        this.eventNamespace = '.CLOSEDL';

        this.render = false;

        this.confirmHandler = $.noop;

        this.autoClose = false;


    },

    setup: function() {
        if (this.render == "alert") {
            this._buildDefaultTemplate();
        } else if (this.render == "confirm") {
            this._buildDefaultTwoTemplate();
        }

        if (this.$dialog.length == 0) {
            return;
        }

        var $win = $(window),
            $dialog = this.$dialog,
            $mask = $('.{0}'.format(this.maskClass));

        this._step();

        this.$mask = $mask.length > 0 ? $mask : $('<section class="{0}" style="display:none"></section>'.format(this.maskClass)).appendTo('body');

        if (this.touchDefault) {
            this.$mask.on('touchmove', function(e) {
                e.preventDefault();
            });

            if (!this.excludeDialog) {
                $dialog.on('touchmove', function(e) {
                    e.preventDefault();
                });
            }
        }

        $win.resize(this.proxy(function() {
            this._updatePosition();
        }));

        $dialog.on('click{0}'.format(this.eventNamespace), this.closeSelector, this.proxy(function(e) {
            e.preventDefault();
            this.close();
        }));

        if (this.maskClose) {
            this.$mask.on('click{0}'.format(this.eventNamespace), this.proxy(function() {
                this.close();
            }));
        }

        $dialog.on('click{0}'.format(this.eventNamespace), '.J_fmu_dl_confirmed', this.proxy(function(ev) {
            var $this = $(ev.target);
            $this.attr("disabled", true);
            this.close();
            this.confirmHandler();
            $this.removeAttr("disabled");
        }));

        // callbacks
        $.each('onBeforeLoad,onLoad,onBeforeClose,onClose'.split(','), this.proxy(function(i, name) {
            if ($.isFunction(this[name])) {
                $dialog.on(name, this[name]);
            }
        }));

        $dialog.data('dialog', this);
    },

    getAlertBtnContent: function() {
        return this.$dialog.find(".fmu-alert-btn");
    },

    getContent: function() {
        return this.$dialog.find(".fmu-dl-content");
    },

    getDialog: function() {
        return this.$dialog;
    },

    _step: function(reset) {
        var self = this;
        var $stepCon = self.$dialog.find(self.stepContainerSelector);

        if (reset) {
            $stepCon.hide();
            $stepCon.eq(0).show();
            return;
        }

        $stepCon.each(function() {

            var $curStep = $(this);

            $curStep.find(self.goNextStepSelector).on('click{0}'.format(self.eventNamespace), function() {

                var goStepIndex = parseInt($(this).data('gonext'));

                if (!goStepIndex) {
                    console.info('请正确写上data-gonext的值，只支持正整数');
                    return;
                }

                $curStep.hide();
                $stepCon.eq(goStepIndex - 1).show();

                self._updatePosition();
            });
        });
    },

    _buildDefaultTemplate: function() {
        var defaultTemplate = new StringBuilder();
        defaultTemplate.append('<section class="fmu-dl-wrap fmu-dl-default-wrap" style="display:none">')
            //.append('<div class="fmu-dl-title"><a href="javascript:void(0);" class="fmu-dl-close J_fmu_dl_close">&times;</a></div>')
            .append('<div class="fmu-dl-content">default</div>')
            .append('<div class="fmu-dl-btns">')
            .append('<button class="J_fmu_dl_close fmu-alert-btn">确定</button>')
            .append('</div>')
            .append('</section>');

        this.$dialog = $(defaultTemplate.toString()).appendTo("body");
    },

    _buildDefaultTwoTemplate: function() {
        var defaultTemplate = new StringBuilder();
        defaultTemplate.append('<section class="fmu-dl-wrap fmu-dl-default-wrap fmu-dl-defaulttwo-wrap" style="display:none">')
            //.append('<div class="fmu-dl-title"><a href="javascript:void(0);" class="fmu-dl-close J_fmu_dl_close">&times;</a></div>')
            .append('<div class="fmu-dl-content">default two</div>')
            .append('<div class="fmu-dl-btns">')
            .append('<button class="J_fmu_dl_close">取消</button><button class="J_fmu_dl_confirmed">确定</button>')
            .append('</div>')
            .append('</section>');

        this.$dialog = $(defaultTemplate.toString()).appendTo("body");
    },

    _updatePosition: function() {
        var $win = $(window);
        var w = $win.width(),
            h = $win.height(),
            $dialog = this.$dialog,
            oWidth = $dialog.outerWidth(true),
            oHeight = $dialog.outerHeight(true);

        var lastH, lastW;

        switch (this.position) {
            case 'top':
                lastH = 0;
                lastW = (w - oWidth) / 2;
                break;
            case 'bottom':
                lastH = h - oHeight;
                lastW = (w - oWidth) / 2;
                break;
            case 'center':
            default:
                lastH = (h - oHeight) / 2;
                lastW = (w - oWidth) / 2;
                break;
        }

        var lastH, lastW;

        switch (this.position) {
            case 'top':
                lastH = 0;
                lastW = (w - oWidth) / 2;
                break;
            case 'bottom':
                lastH = h - oHeight;
                lastW = (w - oWidth) / 2;
                break;
            case 'center':
            default:
                lastH = (h - oHeight) / 2;
                lastW = (w - oWidth) / 2;
                break;
        }

        $dialog.css({
            top: lastH,
            left: lastW
        });
    },

    updatePosition: function() {
        this._updatePosition();
    },

    load: function(e) {

        if (this.opened) {
            return this;
        }

        var $dialog = this.$dialog;
        var $mask = this.$mask;
        var startProp, endProp;

        e = e || $.Event();
        e.type = "onBeforeLoad";
        $dialog.trigger(e);
        if (e.isDefaultPrevented()) {
            return; }

        this._updatePosition();

        if (this.animation == true) {

            switch (this.position) {
                case 'top':
                    startProp = { '-webkit-transform': 'translateY(-100%)' };
                    endProp = { '-webkit-transform': 'translateY(0)' };
                    break;
                case 'bottom':
                    startProp = { '-webkit-transform': 'translateY(100%)' };
                    endProp = { '-webkit-transform': 'translateY(0)' };
                    break;
                case 'center':
                default:
                    startProp = { '-webkit-transform': 'translateX(-200%)' };
                    endProp = { '-webkit-transform': 'translateX(0)' };
                    break;
            }

            $dialog.show().css(startProp).css("-webkit-transition", "all 1s ease-in-out")
            setTimeout(function() {
                $dialog.css(endProp);
            }, 0)

        } else {
            $dialog.show();
        }

        //$dialog.show();
        $mask.show();

        this.opened = true;
        $dialog.trigger('onLoad');

        if (this.autoClose) {
            setTimeout(this.proxy(function() {
                this.close();
            }), this.autoClose);
        }
    },

    close: function(e) {
        var $dialog = this.$dialog;

        if (this.opened == false || $dialog.is(':hidden')) {
            return;
        }

        var $mask = this.$mask;

        $dialog.trigger('onBeforeClose');

        $dialog.hide();
        $mask.hide();

        this._step(true);

        $dialog.trigger('onClose');
        this.opened = false;
    }
});
