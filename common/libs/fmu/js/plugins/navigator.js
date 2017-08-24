///<reference path="../core/fmu.js" />
///<reference path="../vendors/jquery/jquery-2.1.1.js" />
///<reference path="../vendors/iscroll/iscroll-lite-v5.js" />

/**
 * @file navigator
 * @import core/fmu.js, vendors/jquery/jquery-2.1.1.js, vendors/iscroll/iscroll-lite-v5.js, plugins/scrollspy.js
 */

(function ($) {
    $.extend({
        navigator: function (options) {
            var settings = $.extend(true, {}, {
                wrapperSelector: "#J_fmu_navigator_wrapper",
                scrollerSelector: "#J_fmu_navigator_scroller",
                navMoreSelector: "#J_fmu_navigator_more",
                allPanelSelector: "#J_fmu_navigator_panel",
                scrollEnd: $.noop,
                beforeEventStart: $.noop,
                trackway: false,
                dropDown: false,
                navScroll: true,
                currentClass: "cur",
                needMask: false,
                maskClass : '',
                initFirst: true
            }, options);

            var $window = $(window);
            var $scroller = $(settings.scrollerSelector);
            var $navMore = $(settings.navMoreSelector);
            var $allPanel = $(settings.allPanelSelector);
            var wrapperHeight = $(settings.wrapperSelector).height();
            var $lis = $scroller.find("li");
            var $firstLi = $lis.eq(0);
            var currentClass = settings.currentClass;
            var myScroll;
            var $mask = settings.needMask ? $("<div class='fmu-navigator-mask'></div>").appendTo("body") : "";
                $mask = settings.maskClass ? $(settings.maskClass): $mask;

            function bindEvents() {
                $("a", $lis).on("click", function () {
                    var $this = $(this);
                    if( settings.trackway ){
                        documentScrollTo($this.parent());
                    }

                    hideAllPanel();

                    (settings.beforeEventStart($this) !== false) && scrollTo($this.parent());
                });
            }

            function bindDropDownEvent() {
                $navMore.on("click", function () {
                    if ($allPanel.css("display") == "none") {
                        $allPanel.show();
                        $navMore.addClass(settings.currentClass);
                        $mask && $mask.show();

                        // 当无trackway元素时，启动下拉面板时指定选中标签
                        !settings.trackway &&
                            $allPanel.find("li")
                            .removeClass(currentClass)
                            .eq($scroller.find("li.{0}".format(currentClass)).index()).addClass(currentClass);

                    } else {
                        hideAllPanel();
                    }
                });

                $allPanel.on("click", "li", function () {
                    var $this = $(this);
                    var index = $this.index();
                    var $link = $this.find("a");

                    if ($link.attr("href").indexOf("javascript:") > -1) {
                        scrollTo($lis.eq(index));
                        if( settings.trackway ){
                            documentScrollTo($this);
                        }
                        setTimeout(function () { hideAllPanel(); }, 50);
                    }
                });

                $window.on("scroll.ISCROLLNAV", function () {
                    hideAllPanel();
                });
            }

            function hideAllPanel() {
                $allPanel.hide();
                $navMore.removeClass(settings.currentClass);
                $mask && $mask.hide();
            }

            function bindIScroll() {
                // rest sroller的宽度，方便水平滚动是实际宽度，必须在实例化ISCROLL之前
                initSrollerWidth();

                myScroll = new IScroll(settings.wrapperSelector, {
                    scrollX: true,
                    scrollY: false,
                    eventPassthrough: "vertical"
                });
            }

            function initSrollerWidth() {
                var srollerWidth = 0;

                $lis.each(function (i, e) {
                    var $this = $(this);
                    srollerWidth += $this.width() + parseInt($this.css("margin-left")) + parseInt($this.css("margin-right"));
                });

                $scroller.width(srollerWidth);
            }

            function bindScrollSpy() {
                $(".J_color").each(function (i) {

                    if( $lis.eq(i).length==0 ){
                        return;
                    }

                    var $this = $(this);
                    var position = $this.position();
                    $this.scrollspy({
                        min: position.top,
                        max: position.top + $this.height(),
                        buffer: wrapperHeight,
                        onEnter: function (element, position) {
                            //console.log('entering ' + element.id);

                            //scrollTo($("[data-spy={0}]".format(element.id)).parent());
                            scrollTo($lis.eq(i));

                            if (settings.dropDown) {
                                $allPanel.find("li").removeClass(currentClass).eq(i).addClass(settings.currentClass);
                            }
                        },
                        onLeave: function (element, position) {
                            //console.log('leaving ' + element.id);
                            if (settings.dropDown) {
                                $allPanel.find("li").eq(i).removeClass(settings.currentClass);
                            }

                            $scroller.find("li").eq(i).removeClass(settings.currentClass);
                        }
                    });
                });
            }

            function scrollTo($cur) {
                var $light = $cur.index() == 0 ? $cur[0] : $cur.prev()[0];

                $scroller.find(".{0}".format(currentClass)).removeClass(currentClass);
                $cur.addClass(currentClass);
                myScroll.scrollToElement($light, 400, "", "", "");
            }

            function documentScrollTo($cur) {
                //var spy = $cur.data("spy");
                var index = $cur.index();

                setTimeout(function () {
                    window.scrollTo(0, $(".J_color").eq(index).offset().top - wrapperHeight + 4);
                }, 0);
            }

            function hashHandler() {
                var id = location.hash;
                var i = $(id).index(".J_color");

                if ($(id).length == 0) {
                    return;
                }

                if (i >= 0) {
                    scrollTo($lis.eq(i));
                    if (settings.dropDown) {
                        $allPanel.find("li").eq(i).addClass(settings.currentClass);
                    }
                    if (settings.trackway) {
                        documentScrollTo($lis.eq(i))
                    }
                } else {
                    $(".{0}".format(currentClass)).removeClass(currentClass);
                    setTimeout(function () {
                        window.scrollTo(0, $(id).offset().top - wrapperHeight + 4);
                    }, 0);
                }
            }

            function setup() {
                var $cur = $(".{0}".format(currentClass));
                bindIScroll();

                $.each(["beforeScrollStart", "scrollStart", "scrollEnd"], function (idex, item) {
                    myScroll.on(item, function () {
                        if ($.isFunction(settings[item])) {
                            settings[item]();
                        }
                    });
                });

                if ($cur.length == 0) {
                    settings.initFirst && $firstLi.addClass(settings.currentClass);
                } else {
                    scrollTo($cur);
                    if (settings.trackway) {
                        documentScrollTo($cur.children().eq(0));
                    }
                }

                if (settings.trackway) {
                    bindScrollSpy();
                }

                if (settings.navScroll) {
                    bindEvents();
                }

                if (settings.dropDown) {
                    bindDropDownEvent();
                }

                if (location.hash.indexOf("#") > -1) {
                    hashHandler();
                }

                $(window).on("hashchange", hashHandler);

                $mask && $mask.on("click", function () {
                    hideAllPanel();
                });

                $.navigator.iscroll = myScroll;
            }

            $.navigator.bindScrollSpy = bindScrollSpy;

            setup();
        }
    });

}(jQuery));
