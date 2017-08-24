///<reference path="../../js/base.js" />
///<reference path="statemachine.js" />

/* HTML
<a data-mbtag="login" class="J_mb_trigger" href="javascript:void(0);"/>
<a data-mbtag="msg" class="J_mb_trigger" href="javascript:void(0);"/>
<a data-mbtag="cs" class="J_mb_trigger" href="javascript:void(0);"/>
<a data-mbtag="account" class="J_mb_trigger" href="javascript:void(0);" />
*/


var MagicBar = new Fanli.Class(MagicBarBase);

MagicBar.inculde({
    init: function () {
        this.view = "";
        this.trigger = "";
    },

    setup: function () {
        var sm = new StateMachine();
        var loadedModule = [];
        var v = parseInt(new Date().getTime() / 300000);
        //var v = Math.random(); // debug code;
        var $window = $(window);
        var $document = $(document);
        var $mb = $('#magicbar');
        var $mbody = $('#J-mbar-body');
        var $mShow = $('#J-mbar-show');
        var isIe6 = !!window.ActiveXObject && !window.XMLHttpRequest;
        var userid = "prouserid".getCookie();

        var mapMB = {
            "login": {
                contentUrl: passportAppUrl + "/magicbar/user/login",
                js: "http://static2.51fanli.net/static/?f=common/js/module/magicbar/login.js",
                instance: "loginController"
            },
            "msg": {
                contentUrl: passportAppUrl + "/magicbar/user/message",
                js: "http://static2.51fanli.net/static/?f=common/js/module/magicbar/message.js",
                instance: "msgController"
            },
            "cs": {
                contentUrl: passportAppUrl + "/magicbar/user/customService",
                js: "http://static2.51fanli.net/static/?f=common/js/module/magicbar/customservice.js,common/js/module/magicbar/cscontroller.js",
                instance: "csController"
            },
            "account": {
                contentUrl: passportAppUrl + "/magicbar/user/account",
                js: "http://static2.51fanli.net/static/?f=common/js/module/magicbar/account.js",
                instance: "accountController"
            }
        };

        function start() {
            appearMagicbar();
            this.proxy(bindEvents)();
            if ($(window).width() > 1600 && "FL_MAGICBAR_AUTOPLAY".getCookie() != 1)
            {
                setTimeout(function () {
                    $.each(mapMB, function (idx, maptag) {
                        if (userid && maptag.autoShow) {
                            loadModule(idx, $(".J_mb_trigger[data-mbtag={0}]".format(idx)));
                            return false;
                        }
                    });
                }, 250);
            }
        }

        function appearMagicbar() {
            var winWidth = $window.width();
            var winHeight = $window.height();
            if (winWidth >= 1024) {
                showMB();
            } else {
                hideMB();
            }
            if (isIe6) {
                $mb.height(winHeight);
            }
            fixedMagicbar();
        }

        function fixedMagicbar() {
            if (isIe6) {
                $mb.css({
                    'position': 'absolute',
                    'top': $window.scrollTop()
                });
            }
        }

        function showMB() {
            $mbody.animate({
                'left': 0
            }, 300);
            $mShow.animate({
                'left': '-48px'
            }, 300);
        }

        function hideMB() {
            $mbody.animate({
                'left': '-41px'
            }, 300);
            $mShow.animate({
                'left': 0
            }, 300);
            sm.deactiveAll();
        }

        function bindEvents() {
            (this.view || $document).on("click", ".J_mb_trigger", function (ev) {
                ev.preventDefault();

                var $trigger = $(this);
                var mbtag = $trigger.attr("data-mbtag");
                if ($.inArray(mbtag, loadedModule) == -1) {
                    loadModule(mbtag, $trigger);
                }
                else {
                    var currentController = window[mapMB[mbtag]["instance"]];
                    var previousTrigger = currentController.trigger;
                    currentController.trigger = $trigger;

                    if (currentController.showing) {
                        if (previousTrigger[0] === currentController.trigger[0]) {
                            currentController.deactivate();
                        } else {
                            currentController.activate();
                        }
                    } else {
                        currentController.active();
                    }
                }
       
            })
            .on('click', '#J-mbar-close', function (e) {
                e.stopPropagation();
                hideMB();
            })
            .on('click', '#J-mbar-show', function () {
                showMB();
            });

            $document.on('click', function (e) {
                var $this = $(e.target);

                if ($this.parents("#magicbar").length == 0) {
                    // e.stopPropagation();
                    sm.deactiveAll();
                }
            });

            $window.on('scroll.mbar', function () {
                fixedMagicbar();
            });

            $window.on("resize.mbar", function () {
                sm.deactiveAll();
            });
        }

        function loadModule(mbtag, $trigger) {
            var cmb = mapMB[mbtag];
            var $view;

            $.getJSON("{0}?jsoncallback=?".format(cmb["contentUrl"]))
             .done(function (res) {
                 if (!res.status) {
                     return;
                 }

                 $view = $(res.data).appendTo($mbody);
                 setTimeout(function () {
                     $.ajax({
                         dataType: "script",
                         url: "{0}&v={1}".format(cmb["js"], v),
                         cache: true
                     }).done(function (res) {
                         var currentController = window[cmb["instance"]];
                         loadedModule.push(mbtag);
                         currentController.view = $view;
                         currentController.trigger = $trigger;
                         sm.add(currentController);
                         currentController.setup();
                         currentController.active();
                     });
                 }, 0);
             });
        }

        this.proxy(start)();
    }
});