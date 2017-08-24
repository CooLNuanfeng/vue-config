///<reference path="../core/fmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../vendors/jquery/jquery-2.1.1.js" />

/**
 * @file spinner
 * @import vendors/jquery/jquery-2.1.1.js, core/fmu.js, core/widget.js
 */

FMU.UI.define("Spinner", {

    init: function () {
        this.$container = "";
        this.min = 1;
        this.minText = "已经是最小值啦";
        this.max = 100000;
        this.maxText = "已经是最大值啦";
        this.defVal = 1;
        this.plusNum = 1; //一次加减数量
        this.useDefaultTip = true;
        this.limitDisable = false; //达到阈值后是否加disableClass
        this.disableClass = 'disable';
        this.biggerThanMaxHandler = $.noop;
        this.smallerThanMinHandler = $.noop;
        this.name = "";
        this.plusHanlder = $.noop;
        this.subtractHandler = $.noop;
        this.valueChangeHandler = $.noop;
        this.isInputAble = false;
        this.limitBuyOne = false; //显示限购1件提示,此时按钮处于不可点状态，点击不改变值
    },

    setup: function () {
        var $container = this.$container;

        if (!$container) {
            return;
        }

        var name = this.name;
        var domString = new StringBuilder();
        var subtractClass = "J_fmu_spinner_subtract";
        var numberClass = "J_fmu_spinner_number";
        var plusClass = "J_fmu_spinner_plus";

        var readonlyText = this.isInputAble ? '' : 'readonly="readonly"';

        this.min = parseInt(this.min);
        this.max = parseInt(this.max);

        // 限购1件时，无法修改
        if (this.limitBuyOne) {
            this.min = this.max = 1;
        }

        domString.append('<div class="fmu-spinner"><i class="subtract-icon {0}"></i>'.format(subtractClass))
                    .append('<input {3} type="tel" {0} class="number {1}" value="{2}"/>'.format(name ? "name={0}".format(name) : "", numberClass, this.defVal, readonlyText))
                 .append('<i class="plus-icon {0}"></i>{1}</div>'.format(plusClass, this.limitBuyOne ? '<span class="limit-buyone">限购1件</span>' : ''));

        $container.append(domString.toString());

        this.$subtractBtn = $container.find(".{0}".format(subtractClass));
        this.$plusBtn = $container.find(".{0}".format(plusClass));
        this.$number = $container.find(".{0}".format(numberClass));

        if (this.limitDisable) {
            if (this.defVal == this.min) {
                this.$subtractBtn.addClass(this.disableClass);
            }

            if (this.defVal == this.max) {
                this.$plusBtn.addClass(this.disableClass);
            }
        }

        if (!this.limitBuyOne) {
            this.$plusBtn.on("touchend", this.proxy(function () {
                this.$number.blur();
                this._plusClickHandler();
            }));

            this.$subtractBtn.on("touchend", this.proxy(function () {
                this.$number.blur();
                this._subtractClickHandler();
            }));
        }

        this.isInputAble && this.$number.on("focusout", this.proxy(function () {
            this._focusoutHandler();
        }));

        if (this.useDefaultTip) {
            this.toast = FMU.UI.Toast ? new FMU.UI.Toast() : Fanli.Utility.Toast;
        }
    },

    restore: function () {
        this.$number.val(this.min);
    },

    setVal: function (val) {
        this.$number.val(val);
        if (this.limitDisable) {
            this.$plusBtn.removeClass(this.disableClass);
            this.$subtractBtn.removeClass(this.disableClass);

            if (val >= this.max) {
                this.$plusBtn.addClass(this.disableClass);
            }

            if (val <= this.min) {
                this.$subtractBtn.addClass(this.disableClass);
            }
        }
    },

    getVal: function () {
        return $.trim(this.$number.val());
    },

    _plusClickHandler: function () {
        var currentVal = $.trim(this.$number.val());
        var afterPlus = parseInt(currentVal) + this.plusNum;

        if (this.limitDisable) {
            if (afterPlus == this.max) {
                this.$plusBtn.addClass(this.disableClass);
            }
            this.$subtractBtn.removeClass(this.disableClass);
        }

        if (afterPlus <= this.max) {
            this.$number.val(afterPlus);
            this.plusHanlder();
        } else {
            if (this.useDefaultTip) {
                this.toast.open(this.maxText);
            }
            this.biggerThanMaxHandler();
        }
    },

    _subtractClickHandler: function () {
        var currentVal = $.trim(this.$number.val());
        var afterSubtract = parseInt(currentVal) - this.plusNum;

        if (this.limitDisable) {
            if (afterSubtract == this.min) {
                this.$subtractBtn.addClass(this.disableClass);
            }
            this.$plusBtn.removeClass(this.disableClass);
        }

        if (afterSubtract >= this.min) {
            this.$number.val(afterSubtract);
            this.subtractHandler();
        } else {
            if (this.useDefaultTip) {
                this.toast.open(this.minText);
            }
            this.smallerThanMinHandler();
        }
    },

    _focusoutHandler: function () {
        var currentVal = $.trim(this.$number.val());
        currentVal = isNaN(parseInt(currentVal)) ? this.min : parseInt(currentVal);

        if (currentVal < this.min) {
            this.setVal(this.min);

            if (this.useDefaultTip) {
                this.toast.open(this.minText);
            }
            this.smallerThanMinHandler();

        } else if (currentVal > this.max) {
            this.setVal(this.max);
            if (this.useDefaultTip) {
                this.toast.open(this.maxText);
            }
            this.biggerThanMaxHandler();
        } else {
            this.setVal(currentVal);
            this.valueChangeHandler();
        }
    }
});