///<reference path="../core/fmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../widget/dialog.js" />
///<reference path="../vendors/jquery/jquery.js" />


/**
 * @file dialog.tipbox.js
 * @import vendors/jquery/jquery.js, core/fmu.js, core/widget.js, widget/dialog.js
 */

FMU.UI.Dialog.hookPlugin({
    "modal": function (options) {
        var content = (options && options.content) || "操作成功" ;
        if (options && options.autoClose) {
            this.autoClose = options.autoClose;
        }
        
        this.$dialog = $("<div class='fmu-dl-wrap fmu-dl-scale fmu-dl-modal-wrap'><div class='fmu-dl-content'>{0}</div></div>".format(content)).appendTo("body");
        this._updatePosition();
    },

    "loading": function (options) {
        if (options && options.autoClose) {
            this.autoClose = options.autoClose;
        }

        this.$dialog = $("<div class='fmu-dl-wrap fmu-dl-scale fmu-dl-loading-wrap'><div class='fmu-dl-content fmu-dl-loading'></div></div>").appendTo("body");
        this._updatePosition();
    }
});