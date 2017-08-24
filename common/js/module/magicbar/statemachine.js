///<reference path="../../js/base.js" />
var StateMachine = function () {
    this.controllerArr = [];
};
StateMachine.fn = StateMachine.prototype;

$.extend(StateMachine.fn, {
    bind: function () {
        if (!this.o) this.o = $({});
        this.o.bind.apply(this.o, arguments);
    },

    trigger: function () {
        if (!this.o) this.o = $({});
        this.o.trigger.apply(this.o, arguments);
    }
});

StateMachine.fn.add = function (controller) {
    this.bind("change", function (e, current) {
        controller == current ? controller.activate() : controller.deactivate();
    });

    controller.active = $.proxy(function () {
        this.trigger("change", controller);
    }, this);

    this.controllerArr.push(controller);
};

StateMachine.fn.deactiveAll = function () {
    for (var len = this.controllerArr.length; len--;) {
        this.controllerArr[len].deactivate();
    }
};