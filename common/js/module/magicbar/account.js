///<reference path="magicbar.js" />
///<reference path="../../js/base.js" />
var MagicBarAccount = new Fanli.Class(MagicBarBase);

MagicBarAccount.inculde({

    init: function () {
        this.view = "";
        this.trigger = "";
    },

    setup: function () {
        
    },

    activate: function () {
        this.showing = true;
        this.adjustPosition();
        this.view.show();
    },

    deactivate: function () {
        this.showing = false;
        this.view.hide();
    }

});

var accountController = new MagicBarAccount();