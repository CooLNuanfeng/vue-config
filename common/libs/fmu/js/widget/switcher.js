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
        this.$checkboxEle = "";
        this.children = [];
        this.style = "";
        this.onCallback = $.noop;
        this.offCallback = $.noop;
        this.confirmOnCallback = function () {
            return true;
        }
        this.confirmOffCallback = function () {
            return true;
        }
    },

    setup: function () {
        var $checkboxEle = this.$checkboxEle;
        var style = this.style != "" ? "-{0}".format(this.style) : "";
        var $parent = $('<a class="fmu-switcher{0} J_fmu_switcher" href="javascript:void(0);"><i></i></a>'.format(style));
        this.onClass = "fmu-switcher{0}-on".format(style);
        this.offClass = "fmu-switcher{0}-off".format(style);

        $checkboxEle.prop("checked") ? $parent.addClass(this.onClass) : $parent.addClass(this.offClass);

        $checkboxEle.replaceWith($parent);
        $parent.append($checkboxEle.hide());

        // retrieve parent node
        $parent = $checkboxEle.parents(".J_fmu_switcher");

        // global $parent variant
        this.$parent = $parent;

        $parent.on("click", this.proxy(function (ev) {
            if (!$parent.hasClass(this.onClass)) {
                if (this.confirmOnCallback()) {
                    this.checkedSelf();
                    this.onCallback();
                }
            } else {
                if (this.confirmOffCallback()) {
                    this.unCheckedSelf();
                    this.offCallback();
                }
            }
        }));

        $checkboxEle.data("switcher", this);
    },

    addToParent: function () {
        var p = this.parent;
        p && p.children.push(this);
    },

    removeFromParent: function () {
        var p = this.parent;
        p && p.children.splice(p.children.indexOf(this), 1);
    },

    checkedSelf: function () {
        this.$parent.removeClass(this.offClass).addClass(this.onClass);
        this.$checkboxEle.prop("checked", true);
        this._checkedParent();
        this._checkedChildren();
    },

    unCheckedSelf: function () {
        this.$parent.removeClass(this.onClass).addClass(this.offClass);
        this.$checkboxEle.prop("checked",false);
        this._unCheckedParent();
        this._unCheckedChildren();
    },

    _checkedParent: function () {
        var p = this.parent;

        if (p && this._checkAll(p)) {
            p.$checkboxEle.prop("checked", true);
            p.$parent.removeClass(this.offClass).addClass(this.onClass);
            this._checkedParent.call(p);
        }
    },

    _unCheckedParent: function () {
        var p = this.parent;
        if (p) {
            p.$checkboxEle.prop("checked", false);
            p.$parent.removeClass(this.onClass).addClass(this.offClass);
            this._unCheckedParent.call(p);
        }
    },

    _unCheckedChildren: function () {
        for (var i = 0, children = this.children, len = children.length; i < len; i++) {
            var child = children[i];
            child.$parent.removeClass(this.onClass).addClass(this.offClass)
            child.$checkboxEle.prop("checked", false);

            if (child.children.length) {
                this._unCheckedChildren.call(child);
            }
        }
    },

    _checkedChildren: function () {
        for (var i = 0, children = this.children, len = children.length; i < len; i++) {
            var child = children[i];
            child.$parent.removeClass(this.offClass).addClass(this.onClass)
            child.$checkboxEle.prop("checked", true);

            if (child.children.length) {
                this._checkedChildren.call(child);
            }
        }
    },

    _checkAll: function (parent) {
        var returnVal = true;

        for (var i = 0, children = parent.children, len = children.length; i < len; i++) {
            var $childrenCheckbox = children[i].$checkboxEle;

            if (!$childrenCheckbox.prop("checked")) {
                returnVal = false;
                break;
            }
        }

        return returnVal;
    }
});