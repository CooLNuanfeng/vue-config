///<reference path="magicbar.js" />
///<reference path="../../js/base.js" />
var MagicBarMessage = new Fanli.Class(MagicBarBase);

MagicBarMessage.inculde({

    init: function () {
        this.view = "";
        this.trigger = "";
        this.myMsgSelector = "#J-mbar-mymsg-list";
        this.icoNewMsgSelector = "#J-mbar-ico-new-msg";
    },

    setup: function () {
        this.$mymsg = $(this.myMsgSelector);
        this.$mymsgLi = this.$mymsg.find('li');
        this.$del = this.$mymsg.find('.J-del-item');
        this.$delTrigger = this.$mymsg.find('.del-item');
        this.$icoNewMsg = $(this.icoNewMsgSelector);

        var delMsgAjaxUrl = "http://passport{0}/magicbar/user/delMessage".format(Fanli.Utility.rootDomain);
        var newUserTaskRewardAjaxUrl = "http://passport{0}/magicbar/user/getTaskAward".format(Fanli.Utility.rootDomain);

        this.$mymsgLi.on('mouseenter', this.proxy(function (e) {
            this.$delTrigger.hide();
            $(e.target).find('.del-item').show();

        })).on('mouseleave', this.proxy(function (e) {
            this.$delTrigger.hide();
        }));
        this.$del.on('click', this.proxy(function (e) {
            var $target = $(e.target);
            var type = $target.data('type');
            var shopid = $target.data('shopid') || '';
            var postData = {};

            postData = {
                'type': type,
                'shopid': shopid
            }

            $.getJSON("{0}?jsoncallback=?".format(delMsgAjaxUrl), postData).done(this.proxy(function (res) {
                if (res.status == 1) {
                    $target.parent('li').remove();
                    if (this.$mymsg.find('li').length == 0) {
                        this.$mymsg.hide().before('<div class="mbar-mymsg-list-empty"><i></i><p>没有新消息了~</p></div>');
                        this.$icoNewMsg.hide();
                    }
                }

            }));
        }));

        $(".J_newuser_reward_trigger", this.view).on("click", this.proxy(function (ev) {
            var $this = $(ev.target);
            var $gettingRow = $this.closest(".J_newuser_reward_getting");
            var $loadingRow = $gettingRow.next(".J_newuser_reward_loading");
            var $successRow = $loadingRow.next(".J_newuser_reward_success");

            $gettingRow.hide();
            $loadingRow.show();

            $.getJSON("{0}?jsoncallback=?".format(newUserTaskRewardAjaxUrl)).done(function (res) {
                $loadingRow.hide();
                if (res.status == 1) {
                    $successRow.show();
                } else {
                    alert(res.info);
                    $gettingRow.show();
                }
            }).fail(function (res) {
                $loadingRow.hide();
                $successRow.show();
            });
        }));
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

var msgController = new MagicBarMessage();