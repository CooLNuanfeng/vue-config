///<reference path="../core/fmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../vendors/jquery/jquery.js" />

/**
 * @file dialog
 * @import vendors/jquery/jquery-2.1.1.js, core/fmu.js, core/widget.js
 */

FMU.UI.define("Switcher", {
    init: function () {
        this.parent = null;
        this.children = [];
        this.style = "";
        this.$checkboxEle = "";
        this.onCallback = $.noop;
        this.offCallback = $.noop;
    },

    setup: function () {
        var $checkboxEle = this.$checkboxEle;
        var style = this.style != "" ? "-{0}".format(this.style) : "";
        var $parent = $('<a class="fmu-switcher{0} J_fmu_switcher" href="javascript:void(0);"><i></i></a>'.format(style));

        this.onClass = "fmu-switcher{0}-on".format(style);
        this.offClass = "fmu-switcher{0}-off".format(style);

        if ($checkboxEle.is(":checked")) {
            $parent.addClass(this.onClass);
            this.status = 1;
        } else {
            $parent.addClass(this.offClass);
            this.status = 0;
        }

        $checkboxEle.replaceWith($parent);
        $parent.append($checkboxEle.hide());

        // retrieve parent node
        $parent = $checkboxEle.parents(".J_fmu_switcher");

        this.$parent = $parent;

        $parent.on("click", this.proxy(function (ev) {
            $checkboxEle.trigger("click");

            if (this.children.length) {
                if (!$parent.hasClass(this.onClass)) {
                    this._collapseChildren();
                } else {
                    this._expandChildren();
                }
            }
        }));

        $checkboxEle.on("change", this.proxy(function (ev) {
            if ($checkboxEle.is(":checked")) {
                $parent.removeClass(this.offClass).addClass(this.onClass);
                this.status = 1;
                this._checkedParent();
                this.onCallback($parent);
            }
            else {
                $parent.removeClass(this.onClass).addClass(this.offClass);
                this.status = 0;
                this._unCheckedParent();
                this.offCallback($parent);
            }
        }));

        $checkboxEle.data("switcher", this);
    },

    addToParent: function () {
        if (this.parent) {
            this.parent.children.push(this);
        }
    },

    removeFromParent: function () {
        if (this.parent) {
            this.parent.children.splice(this.parent.children.indexOf(this), 1);
        }
    },

    unCheckedSelf: function () {
        this.$checkboxEle.removeAttr("checked");
        this.$parent.removeClass(this.onClass).addClass(this.offClass);
        this.status = 0;
    },

    _unCheckedParent: function () {
        if (this.parent) {
            this.parent.$checkboxEle.removeAttr("checked");
            this.parent.$parent.removeClass(this.onClass).addClass(this.offClass);
            this.parent.status = 0;
        }
    },

    _checkedParent: function () {
        if (this.parent && this._checkAll(this.parent)) {
            //this.parent.$checkboxEle.attr("checked", true);
            this.parent.$checkboxEle.trigger("click");
            this.parent.$parent.removeClass(this.offClass).addClass(this.onClass);
            this.parent.status = 1;
        }
    },

    _expandChildren: function () {
        for (var i = 0, children = this.children, len = children.length; i < len; i++) {
            var $childrenCheckbox = $(children[i].$checkboxEle);
            if (!$childrenCheckbox.is(":checked")) {
                $childrenCheckbox.trigger("click");
            }
        }
    },

    _collapseChildren: function () {
        for (var i = 0, children = this.children, len = children.length; i < len; i++) {
            var $childrenCheckbox = $(children[i].$checkboxEle);
            if ($childrenCheckbox.is(":checked")) {
                $childrenCheckbox.trigger("click");
            }
        }
    },

    _checkAll: function (parent) {
        var returnVal = true;

        for (var i = 0, children = parent.children, len = children.length; i < len; i++) {
            var $childrenCheckbox = $(children[i].$checkboxEle);
            if (children[i].status == 0) {
                returnVal = false;
                break;
            }
        }

        return returnVal;
    }
});