///<reference path="../../../libs/jquery/jquery-1.7.2.js" />

(function (exports) {

    // 跨页面跟踪
    var traceCrossPageCookie = "__fl_trace_cpc";
    var traceCrossNativeAndPageCookie = "__fl_trace_cnpc";
    var traceCrossPageCookie1 = "__fl_trace_cpc1";

    var tid = (function () {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

    }()).toUpperCase();


    var domain = (function () {
        var tryExecLocation = /.*(\.\w*\.\w*)$/ig.exec(location.hostname);
        var rootDomain = ".fanli.com";
        if (tryExecLocation) {
            rootDomain = tryExecLocation[1];
        }
        return rootDomain;
    }());

    var urlReg = /^(?:(?:http(?:s)?:\/\/)?[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])|(?:\/.*))*$/ig;
    var CookieOperation = (function () {
        function _setCookie(name, value, expiryDays, domain, path, secure) {
            var builder = [name, "=", escape(value)];
            if (expiryDays) {
                var date = new Date();
                date.setTime(date.getTime() + (expiryDays * 86400000));
                builder.push(";expires=");
                builder.push(date.toUTCString());
            }
            if (domain) {
                builder.push(";domain=");
                builder.push(domain);
            }
            if (path) {
                builder.push(";path=");
                builder.push(path);
            }
            if (secure) { builder.push(";secure"); }

            document.cookie = builder.join("");
        }

        function _getCookie(name) {
            var re = new RegExp('\\b' + name + '\\s*=\\s*([^;]*)', 'i');
            var match = re.exec(document.cookie);
            return (match && match.length > 1 ? unescape(match[1]) : '');
        }

        return {
            setCookie: _setCookie,
            getCookie: _getCookie
        };

    }());

    var StringOperation = {
        format: function (s, args) {
            for (var i = 0; i < args.length; ++i) {
                s = s.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
            }
            return s;
        },

        isUrl: function (url) {
            if (!url) {
                return false;
            }

            urlReg.lastIndex = 0;
            url = url.toString();

            return urlReg.test(url);
        }
    };

    var traceCrossNativeAndPageCookieValue = CookieOperation.getCookie(traceCrossNativeAndPageCookie);
    if (traceCrossNativeAndPageCookieValue) {
        // ptid cookie
        CookieOperation.setCookie(traceCrossPageCookie, traceCrossNativeAndPageCookieValue, "", domain, "/");
        CookieOperation.setCookie(traceCrossNativeAndPageCookie, null, -1, domain, "/");
    }
    var ptid = CookieOperation.getCookie(traceCrossPageCookie);
    exports.UBT = {
        isObject: function (obj) {
            return Object.prototype.toString.call(obj) === "[object Object]";
        },

        // used to enable or disable ubt, default is true(enable)
        uswitch: true,

        commonData: {
            referrer: encodeURIComponent(document.referrer),
            resolution_h: window.screen.height || 0,
            resolution_v: window.screen.width || 0,
            resolution_r: window.devicePixelRatio || 1,
            language: navigator.language || navigator.userLanguage,
            url: encodeURIComponent(location.href)
        },

        behaviorData: {
            tab: "" //need to know current tab when tabs changed
        },

        mergeData: function (options) {
            var dataObj = this.commonData;

            if (this.isObject(options)) {
                for (var k in options) {
                    if (options.hasOwnProperty(k)) {
                        dataObj[k] = options[k];
                    }
                }
            }

            // scope chain
            return this;
        },

        _sendPV: function () {
            var builder = [];
            var dataObj = this.commonData;

            var $flMeta = $("meta[name=flpn]"); //<meta name="flpn" content="home_brand_index" />

            if ($flMeta.length > 0) {
                builder.push(StringOperation.format("flpn={0}", [$flMeta.attr("content")]));
            }

            for (var j in dataObj) {
                if (dataObj.hasOwnProperty(j)) {
                    builder.push(StringOperation.format("{0}={1}", [j, dataObj[j]]));
                }
            }

            builder.push("eventtype=pv");

            this._buildTrackImg(builder.join("&"));
        },

        track: function () {
            if (!this.uswitch) {
                return;
            }

            var tArr = [];
            var builder = [];

            var length = arguments.length;

            if (/evttype\=.+/.test(arguments[length - 1])) {
                builder.push(arguments[length - 1]);
                length = length - 1;
            } else {
                builder.push("evttype=cd");
            }

            for (var i = 0; i < length; i++) {
                tArr.push([arguments[i]]);
            }

            builder.push(StringOperation.format("spm={0}", [encodeURIComponent(tArr.join("."))]));
            this._buildTrackImg(builder.join("&"));

            return false;
        },

        _buildTrackImg: (function () {

            var imgs = [];

            return function (parastr) {
                var img = new Image();

                var userid = CookieOperation.getCookie("prouserid");
                var utmo = CookieOperation.getCookie("__utmo");
                var utmp = CookieOperation.getCookie("__utmp");
                var utmt = CookieOperation.getCookie("__utmt");

                var defaultParameterArr = [];

                var sliceNo = 0;

                if (utmo) {
                    defaultParameterArr.push("utmo=" + utmo);
                }

                if (utmp) {
                    defaultParameterArr.push("utmp=" + utmp);
                }

                if (utmt) {
                    defaultParameterArr.push("utmt=" + utmt);
                }

                if (userid) {
                    defaultParameterArr.push("userid=" + userid);
                }

                defaultParameterArr.push("tid=" + tid);

                if (ptid) {
                    defaultParameterArr.push("ptid=" + ptid);
                }
                defaultParameterArr.push("timestamp=" + new Date().getTime());

                img.onload = img.onerror = function () {
                    img.onload = img.onerror = null;
                }

                imgs.push(img);

                sliceNo = Math.round(Math.random() * 9);

                // hack here, will remove. STORY #19943::[前端优化-WEBAPP]域名收敛解决方案步骤二
                if (location.pathname.toLowerCase().indexOf("zhide") > -1) {
                    sliceNo = 0
                }

                img.src = "//ubt" + sliceNo + ".fanli.com/index.html?" + parastr + "&" + defaultParameterArr.join("&");
            }

        })(),

        // used to define custom behavior
        PlugIns: (function () {

            var $window = $(window);

            return {
                clickOperation: function (options) {
                    var timeId;

                    $(document).on("click", "a, button, i, span, input[type=button], input[type=submit], .J_fanli_ubt_trigger", function (ev) {
                        var $this = $(this);
                        var $ancestor = $this.parents();
                        var ancestorLen = $ancestor.length;
                        var temArr = [];
                        var traceStr = "";
                        var parameterArr = [];
                        var $module = $this.closest(".J_ubt_module");
                        var module = $module.length > 0 && $module.data("spm");
                        var ubtindex = $this.data("ubtindex");
                        var halfScreen = (window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth)/2;
                        var tagName = $this[0].tagName;
                        var dataId = $this.data("id");
                        var elementId = $this.attr("id");
                        var klass = $.trim($this.attr("class") || "");
                        var href = $this.attr("href");
                        var text = $.trim($this.attr("data-ubttext") || $this.text() || "");
                        var val = $this.val();
                        var spm = $this.data("spm") || "";
                        var tryHash; // 检查href是否有hash
                        var xpathArr = [];
                        var coordinate = {x: ev.pageX - halfScreen, y: ev.pageY};

                        //点击坐标上报
                        parameterArr.push("coordinate="+encodeURIComponent("{x:"+coordinate.x+",y:"+coordinate.y+"}"));

                        if (StringOperation.isUrl(href) && spm) {
                            if (href.indexOf("spm") > -1) {
                                href = href.replace(/spm=[^&#]*/, "spm=" + spm);
                            } else {
                                tryHash = href.match(/.*(#.*)$/);

                                if (tryHash) {
                                    href = href.replace(/(#.*)$/ig, '');
                                }

                                if (href.indexOf("?") > -1) {
                                    href = href + "&spm=" + spm;
                                } else {
                                    href = href + "?spm=" + spm;
                                }

                                if (tryHash) {
                                    href = href + tryHash[1];
                                }
                            }

                            $this.attr("href", href);
                        }

                        parameterArr.push("evttype=click");

                        if (href && href != "javascript:void(0);" && href != "javascript:void(0)") {
                            parameterArr.push("href=" + encodeURIComponent(href));
                        }

                        if (spm) {
                            parameterArr.push("spm=" + spm);
                        }

                        if (module) {
                            parameterArr.push("module=" + module);
                        }

                        if (ubtindex) {
                            parameterArr.push("index=" + ubtindex);
                        }

                        parameterArr.push("depth=" + Math.round(($(window).scrollTop() / $(document).height()) * 100));

                        xpathArr.push(tagName.toLowerCase() + "[" + $this.index() + "]");

                        /** look for path logic **/
                        temArr.push(tagName);
                        if (dataId) {
                            temArr.push(StringOperation.format("[data-id={0}]", [dataId]));
                        }

                        if (href) {
                            temArr.push(StringOperation.format("[href={0}]", [href]));
                        }

                        if (elementId) {
                            temArr.push(StringOperation.format("[id={0}]", [elementId]));
                        }

                        if (klass) {
                            temArr.push(StringOperation.format("[class={0}]", [klass]));
                        }

                        if (text) {
                            temArr.push(StringOperation.format("[text={0}]", [text]));
                        }

                        if (val) {
                            temArr.push(StringOperation.format("[value={0}]", [val]));
                        }

                        traceStr += temArr.join("");
                        temArr.length = 0;

                        for (var i = 0; i < ancestorLen; i++) {
                            var $currentNode = $ancestor.eq(i);
                            var currentNode = $ancestor.get(i);
                            var id = $currentNode.attr("id");
                            var klass = $.trim($currentNode.attr("class") || "");
                            var tagName = currentNode.tagName;

                            if (tagName == "HTML" || tagName == "BODY") {
                                break;
                            }

                            temArr.push(tagName);

                            if (id) {
                                temArr.push(StringOperation.format("[id={0}]", [id]));
                            }

                            if (klass) {
                                temArr.push(StringOperation.format("[class={0}]", [klass]));
                            }
                            if (i >= 5 - 1) {
                                break;
                            }

                            traceStr += "_" + temArr.join("");
                            temArr.length = 0;
                        }

                        for (var i = 0; i < ancestorLen; i++) {
                            var $currentNode = $ancestor.eq(i);
                            var tagName = $currentNode[0].tagName.toLowerCase();
                            if (tagName == "html" || tagName == "body") {
                                xpathArr.push(tagName);
                            } else {
                                xpathArr.push(tagName + "[" + $currentNode.index() + "]");
                            }
                        }
                        /** look for path logic **/

                        parameterArr.push("evt=click_" + encodeURIComponent(traceStr));
                        parameterArr.push("xpath=" + xpathArr.reverse().join('/'));

                        if (timeId) {
                            clearTimeout(timeId);
                        }

                        CookieOperation.setCookie(traceCrossPageCookie, tid, "", domain, "/");

                        timeId = setTimeout(function () {
                            UBT._buildTrackImg(parameterArr.join("&"));
                            CookieOperation.setCookie(traceCrossPageCookie1, location.href + "@@" + xpathArr.join('/'), "", domain, "/");
                        }, 25);
                    });

                    return UBT.PlugIns;
                },

                scrollOperation: function () {
                    var $w = $(window);
                    var $d = $(document);
                    var sid;
                    var parameterArr = [];

                    $w.on("scroll", function (ev) {
                        if (sid) {
                            clearTimeout(sid);
                        }

                        sid = setTimeout(function () {
                            var scrollTop = $w.scrollTop();
                            var documentHeight = $d.height();

                            parameterArr.push("dept={0}-{1}".format(scrollTop, documentHeight));
                            parameterArr.push("spm=" + Math.round((scrollTop / documentHeight) * 100));
                            parameterArr.push("evttype=scroll");

                            if( UBT.behaviorData.tab ) {
                                parameterArr.push("tab=" + UBT.behaviorData.tab);
                            }

                            UBT._buildTrackImg(parameterArr.join("&"));

                            parameterArr.length = 0;
                        }, 800);
                    });

                    return UBT.PlugIns;
                },

                Exposure: {
                    exposureArr: [],

                    uniqueExposureObj: {},

                    init: function (options) {
                        /**
                         * 1. 非折叠、隐藏区域一次发出
                         * 2. 滚动区域一次发送10个，直到发完
                         */
                        var settings = $.extend(true, {
                            $ele: $(".lazy, .J_lazy, .J_lazy_img, .J_lazyimg, .J_need_exposure").filter("[data-expo]")
                        }, options);

                        var $ele = settings.$ele;

                        $ele.each(function () {
                            var $this = $(this);
                            var dataExpo = $this.data("expo");

                            if (UBT.PlugIns.Exposure.__isHidden($this)) {
                                // 当元素不可见，直接跳过
                                return true;
                            }

                            if (dataExpo && !$this.hasPush && UBT.PlugIns.Exposure.__inViewport($this)) {
                                $this.hasPush = true;
                                if (!UBT.PlugIns.Exposure.uniqueExposureObj[dataExpo]) {
                                    UBT.PlugIns.Exposure.exposureArr.push(dataExpo);
                                    UBT.PlugIns.Exposure.uniqueExposureObj[dataExpo] = true;
                                }
                                return true;
                            }

                            if ($this.hasBindScroll) {
                                return true;
                            }

                            $ele.hasBindScroll = true;

                            function scrollHandler() {
                                if (!$this.hasPush && UBT.PlugIns.Exposure.__inViewport($this)) {
                                    $this.hasPush = true;
                                    if (!UBT.PlugIns.Exposure.uniqueExposureObj[dataExpo]) {
                                        UBT.PlugIns.Exposure.exposureArr.push(dataExpo);
                                        UBT.PlugIns.Exposure.uniqueExposureObj[dataExpo] = true;
                                    }
                                }
                            }

                            $window.on("scroll.EXPOSURE resize.EXPOSURE", scrollHandler);
                        });

                        $window.on("scroll.EXPOSURESEND resize.EXPOSURE",
                            UBT.PlugIns.Exposure.__throttle(250, UBT.PlugIns.Exposure.send)
                        );

                        UBT.PlugIns.Exposure.send();

                        return UBT.PlugIns;
                    },

                    send: function () {
                        //发送后清空，考虑PC和手机屏幕情况，不会存在get请求超出情况
                        setTimeout(function () {
                            if (UBT.PlugIns.Exposure.exposureArr.length > 0) {
                                UBT.track('common_baoguang',
                                'prouserid'.getCookie() || 'ZYSCUSERID'.getCookie() || '[userid]',
                                UBT.PlugIns.Exposure.exposureArr.join(","), "evttype=exposure");
                                UBT.PlugIns.Exposure.exposureArr = [];
                            }
                        }, 200);
                    },

                    prepareToSend: function (dataExpo) {
                        if (!UBT.PlugIns.Exposure.uniqueExposureObj[dataExpo]) {
                            UBT.PlugIns.Exposure.exposureArr.push(dataExpo);
                            UBT.PlugIns.Exposure.uniqueExposureObj[dataExpo] = true;
                        }

                        //装载后主动触发一次
                        setTimeout(function () {
                            UBT.PlugIns.Exposure.send();
                        }, 250);
                    },

                    __inViewport: function ($el) {
                        // 考虑使用transform或是position的情况，此判断方法覆盖率最广
                        // 参考jquery.lazyload.js
                        return !UBT.PlugIns.Exposure.__abovethetop($el) &&
                            !UBT.PlugIns.Exposure.__belowthefold($el) &&
                            !UBT.PlugIns.Exposure.__leftofbegin($el) &&
                            !UBT.PlugIns.Exposure.__rightoffold($el);
                    },

                    __belowthefold: function ($el) {
                        var fold = $window.height() + $window.scrollTop();
                        return fold <= $el.offset().top;
                    },

                    __abovethetop: function ($el) {
                        var fold = $window.scrollTop();
                        return fold >= $el.offset().top + $el.height();
                    },

                    __rightoffold: function ($el) {
                        var fold = $window.width() + (typeof Zepto === 'function' ? window.pageXOffset : $window.scrollLeft());
                        return fold <= $el.offset().left;
                    },

                    __leftofbegin: function ($el) {
                        var fold = typeof Zepto === 'function' ? window.pageXOffset : $window.scrollLeft();
                        return fold >= $el.offset().left + $el.width();
                    },

                    __isHidden: function ($el) {
                        if (typeof jQuery === "function") {
                            return jQuery($el).is(":hidden");
                        }

                        if ($el.length == 0) {
                            return true;
                        }

                        var elem = $el[0];
                        var width = elem.offsetWidth;
                        var height = elem.offsetHeight;

                        return (width === 0 && height === 0) || $el.css("display") === "none";
                    },

                    __throttle: function (delay, fn, debounce_mode) {
                        var last = 0,
                            timeId;

                        if (typeof fn !== 'function') {
                            debounce_mode = fn;
                            fn = delay;
                            delay = 250;
                        }

                        function wrapper() {
                            var that = this,
                                period = (new Date()).getTime() - last,
                                args = arguments;

                            function exec() {
                                last = (new Date()).getTime();
                                fn.apply(that, args);
                            };

                            function clear() {
                                timeId = undefined;
                            };

                            if (debounce_mode && !timeId) {
                                // debounce模式 && 第一次调用
                                exec();
                            }

                            timeId && clearTimeout(timeId);
                            if (debounce_mode === undefined && period > delay) {
                                // throttle, 执行到了delay时间
                                exec();
                            } else {
                                // debounce, 如果是start就clearTimeout
                                timeId = setTimeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - period : delay);
                            }
                        };

                        return wrapper;
                    }
                }
            }
        })(),

        init: function () {
            var traceCrossPageCookie1Value = CookieOperation.getCookie(traceCrossPageCookie1);
            this._sendPV();

            CookieOperation.setCookie(traceCrossPageCookie, tid, "", domain, "/");

            if (traceCrossPageCookie1Value) {
                UBT.track(traceCrossPageCookie1Value, "evttype=autotracefromlastpage");
                CookieOperation.setCookie(traceCrossPageCookie1, null, -1, domain, "/");
            }
            // scope chain
            return this;
        }
    };

}(this));

(function () {

    if (UBT.uswitch) {
        // merge override/business data and initialize UBT.
        // pv request will be sent.
        // "tid" will be the one at current page trace behavior.
        UBT.mergeData(typeof fgv != "undefined" && fgv.fanlitrace ? fgv.fanlitrace : {}).init();

        // click, scroll event traces are standard, please copy below code to executed JS file/area in project.
        // If you need to track logic, please use UBT.track(), will have a querystring likes evt=argument[0]_argument[1]_...
        UBT.PlugIns.clickOperation().scrollOperation();
        //曝光
        UBT.PlugIns.Exposure.init();
    }

}());
