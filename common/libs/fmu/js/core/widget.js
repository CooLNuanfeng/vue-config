/// <reference path="fmu.js" />
/**
 * @file 定义了创建fmu组件的方法
 * @import core/fmu.js
 */

(function () {

    FMU.UI.Base = new FMU.Class();

    FMU.UI.Base.include({
        eventNamespace: ".FMUEVENT",

        destroy: function () {
            /*
            // 遍历有事件的元素，然后off掉事件，释放内存
            for (var i = 0, cachedElementsArr = this.eventElementsArr, len = cachedElementsArr.length; i < len; ++i) {
                var currentItem = cachedElementsArr[i];
                if (currentItem.off || (typeof jQuery !== "undefined" && currentItem instanceof jQuery)) {
                    currentItem.off(this.eventNamespace);
                }
            }
            */
            $("a,button,input").off(this.eventNamespace);
        }
    });

    FMU.UI.prop("define", function (name, protypes, superclass) {
        if (typeof superclass != "function") {
            superclass = this.Base;
        }

        protypes = protypes || {};

        // syntactic sugar
        FMU.UI.prop(name, new FMU.Class(superclass), true).include(protypes);

    });

}(FMU.namespace("FMU.UI")));