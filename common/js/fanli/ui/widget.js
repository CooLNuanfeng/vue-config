/**
* used to create ur own UI framework
*/
///<reference path="youmi.js" />
; (function () {

    Youmi.UI.Base = new Youmi.Class();

    Youmi.UI.Base.include({
        eventElementsArr: [],

        eventNameSpace: ".YMEVENT",

        destory: function () {
            // �������¼���Ԫ�أ�Ȼ��off���¼����ͷ��ڴ�
            var cachedElementsArr = this.eventElementsArr;

            for (var i = 0, len = cachedElementsArr.length ; i < len; ++i) {
                if (cachedElementsArr[i] instanceof jQuery) {
                    cachedElementsArr[i].off(this.eventNameSpace);
                }
            }
        }
    });

    Youmi.UI.prop("define", function (name, protypes, superclass) {
        if (typeof superclass != "function") {
            superclass = this.Base;
        }

        protypes = protypes || {};

        // syntactic sugar
        Youmi.UI.prop(name, new Youmi.Class(superclass), true).include(protypes);
    });

}(Youmi.namespace("Youmi.UI")));