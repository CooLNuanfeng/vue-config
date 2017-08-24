///<reference path="magicbar.js" />
///<reference path="../../js/base.js" />
var MagicBarCustomService = new Fanli.Class(MagicBarBase);

MagicBarCustomService.inculde({

    init: function () {
        this.view = "";
        this.trigger = "";
        this.csListSelector = ".J-mbar-qa-list";
        this.kfSelector = ".J-mbar-contact-us";
        this.topbarSelector = "#topbar";
    },

    setup: function () {
        this.$list = $(this.csListSelector, this.view);
        this.$cat = this.$list.find('.J-mbar-qa-list-cat');
        this.$qa = this.$list.find('.J-qa-wrap');
        this.$questions = this.$list.find('.J-qa-dt');
        this.$answers = this.$list.find('.J-aq-dd');
        this.$topbar = $(this.topbarSelector);
        this.$kfStatusOnline = this.$list.find('.J-kf-online');
        this.$kfStatusOffline = this.$list.find('.J-kf-offline');

        this.$questions.on('click',this.proxy(function(e)
        {
            var $this = $(e.target).closest('.J-qa-dt');
            var $arrow = $this.find('.J-arrow')
            var $dd = $this.next('dd');

            if($dd.is(':hidden')){
                this.$answers.not($dd).slideUp();
                $dd.slideDown();
                $arrow.addClass('arrow-show');
            }else{
                $dd.slideUp();
                $arrow.removeClass('arrow-show');
            }
        }));

        this.$cat.on('click',this.proxy(function(e)
        {
            var $this = $(e.target).closest('.J-mbar-qa-list-cat');
            var $arrow = $this.find('.J-arrow');
            var $content = $this.next('.J-qa-wrap');

            if($content.is(':hidden')){
                this.$qa.not($content).slideUp();
                this.$cat.find('.J-arrow').removeClass('arrow-show');
                $content.slideDown();
                $arrow.addClass('arrow-show');
            }else{
                $content.slideUp();
                $arrow.removeClass('arrow-show');
            }
        }));

        $(this.kfSelector,this.view).on('click',function()
        {
            open53kf();
        });

        topbarGetInfo.done(this.proxy(function()
        {
            if(this.$topbar.data('kfStatus')){
                this.$kfStatusOnline.show();
            }else{
                this.$kfStatusOffline.show();
            }
        }));

    },

    activate: function () {
        this.showing = true;
        this.adjustPosition(100);
        this.view.show();
    },

    deactivate: function () {
        this.showing = false;
        this.view.hide();
    }
});