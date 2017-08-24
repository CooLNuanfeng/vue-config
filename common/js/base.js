/// <reference path="http://static2.51fanli.net/common/libs/jquery/jquery.min.js" />

(function (exports) {

    Function.prototype.method = function (name, fn) {
		if (typeof this.prototype[name] == "undefined") this.prototype[name] = fn;
    };

    !String.prototype.trim && String.method("trim", function () {
        // " hello world! ".trim() -> "hello world!"
        return this.replace(/^\s+|\s+$/g, '');
    });

    !Function.prototype.bind && Function.method("bind", function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () { },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    });

    String.method("format", function () {
        //"welcome to {0}, {1}!".format("Fanli", "dude") -> welcome to Fanli, dude!
        for (var s = this, i = 0; i < arguments.length; ++i) {
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        }
        return s;
    });

    String.method("setCookie", function (value, expiryDays, domain, path, secure) {
        // "cookiename".setCookie('1', 365, ".fanli.com", '/');
        if (this.length == 0) {
            return;
        }

        var builder = [this, "=", escape(value)];

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
        if (secure) {
            builder.push(";secure");
        }

        document.cookie = builder.join("");
    });

    String.method("getCookie", function () {
        // "cookiename".getCookie();
        if (this.length == 0) {
            return '';
        }

        var re = new RegExp('\\b' + this + '\\s*=\\s*([^;]*)', 'i');
        var match = re.exec(document.cookie);
        return (match && match.length > 1 ? unescape(match[1]) : '');
    });

    String.method("delCookie", function (domain, path) {
        // "cookiename".delCookie(".fanli.com", '/');
        document.cookie = this + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
            (domain ? "; domain=" + domain : "") +
            (path ? "; path=" + path : "");
    });

    function StringBuilder() {
        // var sb = new StringBuilder();
        // sb.append("hello").append(" ").append("world!").toString();
        // output "hello world!"
        this.strings = new Array();
    }

    StringBuilder.prototype.append = function (str) {
        this.strings.push(str); return this;
    };

    StringBuilder.prototype.toString = function () {
        return this.strings.join("");
    };

    var GeneralRegs = {
        // 支付宝账号-只能是邮箱和手机
        alipay: /^(([a-zA-Z0-9])+([a-zA-Z0-9_\.\-])*\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4}))|(0{0,1}1[34578]{1}[0-9]{9})$/ig,
        // 银行账号-仅包含英文字母、数字及中划线
        bankaccount: /^([a-zA-Z0-9]|-)+$/ig,
        // 空
        blank: /^\s*$/,
        // 移动电话
        cellphone: /^0{0,1}1[34578]{1}[0-9]{9}$/ig,
        // 邮箱
        email: /^([a-zA-Z0-9])+([a-zA-Z0-9_\.\-])*\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$/ig,
        // 大陆身份证-弱判断，只需位数和形式满足
        icard: /^(\d{18}|\d{15}|\d{17}x)$/ig,
        // 香港身份证
        ihkcard: /^[a-z0-9]{1}\d{6,7}[a-z0-9]{1}$/ig,
        // 台湾身份证
        itwcard: /^[a-z]{1}\d{8,}$/ig,
        // 用户名-仅包含汉字英文字母及空格
        uname: /^[\u4e00-\u9fa5a-zA-Z\s]+$/ig,
        // url
        url: /^http(s)?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ig,
        // 验证码
        vercode: /^\d{6}$/
    };

    ///////////////////////////////////////////////////////////////////////////////
    //  注册命名空间
    //  FLNS.register("Fanli");
    //  Fanli.add("publicFunctionOne", function(){})
    //       .add("publicProperty", "my email is lei.zhang@fanli.com")
    ///////////////////////////////////////////////////////////////////////////////
    var FLNS = {
        "register": function () {
            var a = arguments, o = null, i, j, d, rt;
            for (i = 0; i < a.length; ++i) {
                d = a[i].split(".");
                rt = d[0];
                if (typeof window[rt] == "undefined") {
                    window[rt] = {
                        add: function (k, v) {
                            if (!this[k]) {
                                this[k] = v;
                            }
                            return this;
                        }
                    };
                }
                o = window[rt];
                for (j = 1; j < d.length; ++j) {
                    o[d[j]] = o[d[j]] || {};
                    o = o[d[j]];
                    o.add = function (k, v) {
                        if (!this[k]) { this[k] = v; } return this;
                    };
                }
            }

            return o;
        }
    };

    ///////////////////////////////////////////////////////////////////////////////
    //  输入验证
    //  isNumber :  数字
    //  isEmail  :  邮箱
    //  isName   :  名字只能是汉字，字母，数字及下划线组成
    //  isUrl    :  有效的url格式，以http/https开头
    //  isPhone  :  有效的手机号码
    ///////////////////////////////////////////////////////////////////////////////
    var InputValidation = {
        "isNumber": function (intArg) {
            return Object.prototype.toString.call(intArg) === "[object Number]";
        },
        "isEmail": function (emailStr) {
            GeneralRegs.email.lastIndex = 0;
            return GeneralRegs.email.test(emailStr);
        },
        "isName": function (nameStr) {
            GeneralRegs.uname.lastIndex = 0;
            return GeneralRegs.uname.test(nameStr);
        },
        "isUrl": function (urlStr) {
            GeneralRegs.url.lastIndex = 0;
            return GeneralRegs.url.test(urlStr);
        },
        "isPhone": function (phoneArg) {
            GeneralRegs.cellphone.lastIndex = 0;
            return GeneralRegs.cellphone.test(phoneArg);
        },
        "isICard": function (icard) {
            return /^(?:(?:\d{18})|(?:\d{15})|(?:\d{17}x)|(?:[a-z0-9]{1}\d{6,7}[a-z0-9]{1})|(?:[a-z]{1}\d{8,}))$/ig.test(icard);
        }
    };

    ///////////////////////////////////////////////////////////////////////////////
    //  常用验证
    //  isIe    :  IE浏览器
    //  isIe6   :  IE6浏览器
    ///////////////////////////////////////////////////////////////////////////////
    var GeneralValidation = {
        "isIe": function () {
            return /*@cc_on !@*/false;
        },
        "isIe6": function () {
            return !-[1, ] && !window.XMLHttpRequest;
        }
    };

    var GrenralEscape = {
        "escapeRegExp": function (text) {
            return text.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        },

        "escapeHTML": function (value) {
            return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    };

    //expose namespace
    exports.StringBuilder = StringBuilder;
    exports.InputValidation = InputValidation;
    exports.GeneralValidation = GeneralValidation;
    exports.GeneralRegs = GeneralRegs;
    exports.GrenralEscape = GrenralEscape;
    exports.FLNS = FLNS;

}(this));

(function ($) {

    $.extend(FLNS.register("Fanli"), {

        "Class": function (parent) {
            //OOP Class constructor
            var klass = function () {
                this.init.apply(this, arguments);
            };

            if (parent) {
                var subclass = function () { };
                subclass.prototype = parent.prototype;
                klass.prototype = new subclass();
            }

            klass.prototype.init = function () { };
            klass.fn = klass.prototype;
            klass.fn.parent = klass;

            // static method
            klass.extend = function (obj) {
                var extended = obj.extended;
                for (var i in obj) {
                    klass[i] = obj[i];
                }

                if (extended) extended(klass);
            };

            // instance method
            klass.inculde = function (obj) {
                var included = obj.included;

                for (var i in obj) {
                    klass.fn[i] = obj[i];
                }

                if (included) included(klass);
            };

            klass.proxy = function (func) {
                var self = this;

                return (function () {
                    return func.apply(self, arguments);
                });
            };

            klass.fn.proxy = klass.proxy;

            return klass;
        }
    });

    $.extend(FLNS.register("Fanli.Utility"), {

        "random": function (n) {
            var uid = Math.random().toString(16).substr(2, n);

            while (uid.length < n) {
                uid = Math.random().toString(16).substr(2, n);
            }

            return uid;
        },

        "guid": function () {
            // get it from https://github.com/maccman/book-assets/blob/master/ch03/guid.js
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
        },

        "staticTimeStamp": function (t) {
            var getTime = new Date().getTime();
            var returnts = parseInt(getTime / 300000);
            var currentScriptPath = $('link[rel=stylesheet]').eq(0).attr('href');

            if (t) {
                returnts = parseInt(getTime / (60 * 1000 * t));
            }
            else if(typeof(currentScriptPath) !== "undefined") {
                var timeStampArr = currentScriptPath.match(/^.*[\?\&](\d+\_\d+){1}$/i);
                if (timeStampArr) {
                    returnts = timeStampArr[1];
                }
            }

            return returnts;
        },

        "requirejs": function (jsArr, callback) {
            //Example: FLNS.requirejs( ['overlay','expose','easing','light','switchable'] , callbackFunction );
            var v = parseInt(new Date().getTime() / 300000);

            if (!callback) {
                callback = $.noop;
            }

            $.tools = $.tools || {};

            var jsListConfig = {
                'overlay': {
                    isload: $.tools.overlay,
                    jsUrl: "//static2.51fanli.net/common/libs/tools/overlay.min.js"
                },
                'expose': {
                    isload: $.tools.expose,
                    jsUrl: "//static2.51fanli.net/common/libs/tools/expose.min.js"
                },
                'light': {
                    isload: $.light,
                    jsUrl: "//static2.51fanli.net/static/?f=passport/js/light/createpopup.js"
                },
                'easing': {
                    isload: $.easing["easeOutBack"],
                    jsUrl: "//static2.51fanli.net/common/plugins/easing/jquery.easing-min.js"
                },
                'switchable': {
                    isload: $.fn.switchable,
                    jsUrl: "//static2.51fanli.net/common/plugins/switchable/jquery.switchable-min.js"
                }
            };

            var loadJs = (function () {
                var arr = [];
                $.each(jsArr, function (i, item) {
                    if (!jsListConfig[item]) {
                        return true;
                    }
                    var jsObj = jsListConfig[item];

                    if (!jsObj['isload']) {
                        var connect = /\?/.test(jsObj['jsUrl']) ? '&' : '?';
                        var url = jsObj['jsUrl'];
                        if (url.indexOf('/common/plugins/') > -1) {
                            arr.push(url);
                        }
                        else {
                            arr.push(url + connect + "v={0}".format(v));
                        }
                    }
                });
                return arr;
            })();

            loadJs.length > 0 ? head && head.load(loadJs, callback) : callback();
        },

        "isLogin": "prouserid".getCookie() > 0,

        "rootDomain": (function () {
            var tryExecLocation = /^.*?(\.(?:51)?fanli\.com)$/ig.exec(location.hostname);
            var rootDomain = ".fanli.com";
            if (tryExecLocation) {
                rootDomain = tryExecLocation[1];
            }
            return rootDomain;
        }()),

        "currentDomain": document.domain
    });

})(jQuery);

(function (FPO) {

    var $origin = $({});

    FPO.add("subscribe", function () {
        $origin.on.apply($origin, arguments);
    });

    FPO.add("unsubscribe", function () {
        $origin.off.apply($origin, arguments);
    });

    FPO.add("publish", function () {
        $origin.trigger.apply($origin, $.makeArray(arguments));
    });
}(FLNS.register("Fanli.Pattern.Observer")));


(function () {
    //fix IE image cache
    try {
        document.execCommand('BackgroundImageCache', false, true);
    }
    catch (err) { }
})();

(function ($) {

    var jsonpid = 0;

    $.extend({
        "getScript": function (url, callback) {
            return $.ajax({ url: url, cache: true, dataType: "script" }).done(callback);
        },

        "getCacheJSONP": function (url, data, callback, isFixed) {
            var linkTs = $('link[rel="stylesheet"]').attr("href").split("?")[1];
            var lastPrm = arguments[arguments.length - 1];
            var isFixed = $.isFunction(lastPrm) ? isFixed = true : isFixed = lastPrm;
            var ts = (typeof linkTs != "undefined" && isFixed) ? linkTs : "83088605" + "_" + parseInt(new Date().getTime() / 300000);

            if ($.isFunction(data)) {
                callback = data;
                data = undefined;
            }

            return $.ajax({
                type: "GET",
                url: url,
                cache: true,
                data: data,
                jsonpCallback: "jQuery" + ts + (++jsonpid),
                success: callback,
                dataType: "jsonp"
            });
        }
    });
}(jQuery));

(function ($) {
    //set url cookie !important
    if (!'FirstUrl'.getCookie()) {
        var ref = (!!document.referrer && document.referrer.indexOf('fanli.com') < 0)
                    ? document.referrer
                    : 'http://www{0}/'.format(Fanli.Utility.rootDomain);
        'FirstUrl'.setCookie(ref, '', Fanli.Utility.rootDomain, '/');
    }
    if (!'LandingUrl'.getCookie()) {
        'LandingUrl'.setCookie(window.location.href, '', Fanli.Utility.rootDomain, '/');
    }

    //anti url cache
    $(document).on('click', 'a', function () {
        var $this = $(this);
        var url = $this.attr('href') || '';
        var re = /&v=(\d+)/gi;

        if (url.indexOf('fun.51fanli.com/goshop') != -1 || url.indexOf('fun.fanli.com/goshop') != -1) {
            if (url.indexOf('v=') == -1) {
                url = url + '&v=' + new Date().getTime();
            }
            else {
                url = url.replace(re, '&v=' + new Date().getTime());
            }
            $this.attr('href', url);
        }
    });
})(jQuery);

//customer services popup
function open53kf() {
    $.getJSON('//fun{0}/client/homepage/monitor?title=kefu&jsoncallback=?'.format(Fanli.Utility.rootDomain));
    var userId = 'prouserid'.getCookie();
    window.open('http://customerservice.fanli.com/WebChat/fanlionline.jsp{0}'.format(userId ? "?custid={0}".format(userId) : ""), '_blank');
    return false;
}

//add to favorite
function addFavorite(obj, msg) {
    var url = obj.rev || window.location.href,
        title = obj.title || document.title;
    try {
        if (window.sidebar) {
            window.sidebar.addPanel(title, url, '');
        }
        else {
            if (window.opera && window.print) {
                obj.setAttribute('rel', 'sidebar');
                obj.setAttribute('href', url);
                obj.click();
            }
            else {
                window.external.AddFavorite(url, title);
            }
        }
    }
    catch (e) {
        alert(msg ? msg : '加入收藏失败，请使用Ctrl+D进行添加');
    }
    return false;
}

(function ($) {
    FLNS.register("taobaoRate");

    FLNS.taobaoRate = (function () {
        var rate = 0.45;//default rate

        //rate setting
        //** NOTICE： year,mouth,day,time;
        //Eg: from 2007-01-02 00:00:00 to 2013-09-27 23:59:59
        //should set as:"st":[2007, 0, 1, 0, 0, 0, 0],"ed":[2013, 8, 27, 23, 59, 59, 999]
        var rateArr = [
            //2007-01-01 00:00 - 2013-09-27 23:59
            { "st": [2007, 0, 1, 0, 0, 0, 0], "ed": [2013, 8, 27, 23, 59, 59, 999], "rate": 0.45 },
            //2013-09-28 00:00 - 2013-11-01 23:59
            { "st": [2013, 8, 28, 0, 0, 0, 0], "ed": [2013, 10, 1, 23, 59, 59, 999], "rate": 0.36 },
            //2013-11-02 00:00 - 2099-12-31 23:59
            { "st": [2013, 10, 2, 0, 0, 0, 0], "ed": [2099, 11, 31, 23, 59, 59, 999], "rate": 0.45 }
        ];

        var nowTime = new Date();

        function getT(date) {

            return new Date(date[0], date[1], date[2], date[3], date[4], date[5], date[6]);
        }

        for (var i = 0; i < rateArr.length; i++) {
            if (nowTime >= getT(rateArr[i]["st"]) && nowTime <= getT(rateArr[i]["ed"])) {
                rate = rateArr[i]["rate"];
                break;
            }
        }

        return rate;
    }());

    FLNS.register("UserBenifit");

    UserBenifit.add("calculate", function (priceJSON, callback) {
        var price = priceJSON.price;
        var originalPrice = priceJSON.originalPrice;

        if (!$.isNumeric(price)) {
            callback.call({ price: 0 }, null);
            return;
        }

        var userIdCookieValue = "prouserid".getCookie();
        var experientCookieName = "tb_rate";
        var experientCookieValue = experientCookieName.getCookie().toLowerCase();
        var ajaxUrl = "http://taobao.fanli.com/service/getUserRateType";

        var baseRate = FLNS.taobaoRate;
        var criticalPointOne = 5.5;
        var criticalPointTwo = 2;
        var aboveRate = 0.25;
        var aboveRate1 = 0.55;
        var aboveRate2 = 0.25;
        var aboveRate3 = 0.35;
        var belowRate = 0.8;
        // 2013-2-1
        var beginDate = new Date(2013, 1, 1, 0, 0, 0, 0);
        // 2013-4-30
        var endDate = new Date(2013, 3, 30, 23, 59, 59, 999);
        // 2013-5-1
        var newBeginDate = new Date(2013, 4, 1, 0, 0, 0, 0);
        // 2013-6-30
        var newEndDate = new Date(2013, 5, 30, 23, 59, 59, 999);
        // story 4196 Start
        // 2013-6-1
        var nEndDate = new Date(2013, 5, 1, 0, 0, 0, 0);
        // 2013-7-30
        var nnEndDate = new Date(2013, 6, 30, 23, 59, 59, 999);
        // story 4196 End

        var currentDate = new Date();
        var callback = $.isFunction(callback) ? callback : $.noop;

        var resultConfig =
            {
                basal: price * baseRate,
                colorful: price > criticalPointTwo ? belowRate * criticalPointTwo + aboveRate * (price - criticalPointTwo) : price * belowRate,
                firstStrategy: theFirstStrategy(),
                secondStrategy: theSecondStrategy(),
                thirdStrategy: theThirdStrategy(),
                fourthStrategy: theFourthStategy(),
                fifthStrategy: theFifthStategy()
            };

        var experientConfig =
            {
                "a": "basal",
                "b": "colorful",
                "c": "thirdStrategy",
                "d": "firstStrategy",
                "e": "secondStrategy",
                "f": "fourthStrategy",
                "g": "fifthStrategy",
                "p": "basal"
            };

        var experientConfig1 =
            {
                "a": "basal",
                "b": "basal",
                "c": "basal",
                "d": "basal",
                "e": "basal",
                "f": "fourthStrategy",
                "g": "fifthStrategy",
                "p": "basal"
            };

        var experientConfig2 =
            {
                "a": "basal",
                "b": "basal",
                "c": "basal",
                "d": "basal",
                "e": "basal",
                "f": "basal",
                "g": "basal",
                "p": "basal"
            };

        if (currentDate > nnEndDate) {
            callback.call({ price: numberConvert(resultConfig["basal"]) }, null);
            return;
        }

        if (currentDate >= newBeginDate && currentDate <= nEndDate) {
            experientConfig = experientConfig1;
        }
        else if (currentDate > nEndDate && currentDate <= nnEndDate) {
            experientConfig = experientConfig2;
        }


        if (!userIdCookieValue) {
            unloginHandler();
        }
        else {
            if (!experientCookieValue || experientCookieValue == "null") {
                $.ajax(
                    {
                        url: ajaxUrl,
                        dataType: "jsonp",
                        jsonp: "jsoncallback",
                        success: function (result) {
                            if (result.status == "1") {
                                callback.call({ price: numberConvert(resultConfig[experientConfig[result.data.rateType.toLowerCase()]]) }, null);
                            }
                            else {
                                unloginHandler();
                            }
                        },
                        error: function () {
                            unloginHandler();
                        }
                    });
            }
            else {
                var tem = experientConfig[experientCookieValue] || 'basal';
                callback.call({ price: numberConvert(resultConfig[tem]) }, null);
            }
        }

        function unloginHandler() {
            callback.call({ price: numberConvert(resultConfig["basal"]) }, null);
        }

        function numberConvert(i) {
            return Number(new Number(i).toFixed(2));
        }

        function theFirstStrategy() {
            return price >= criticalPointTwo ? belowRate * criticalPointTwo + aboveRate1 * (price - criticalPointTwo) : price * belowRate;
        }

        function theSecondStrategy() {
            if (price < criticalPointTwo) {
                return price * belowRate;
            }
            else if (price >= criticalPointTwo && price < criticalPointOne) {
                return belowRate * criticalPointTwo + aboveRate2 * (price - criticalPointTwo)
            }
            else {
                return price * baseRate;
            }
        }

        function theThirdStrategy() {
            return price < criticalPointOne ? price * baseRate : baseRate * criticalPointOne + aboveRate3 * (price - criticalPointOne);
        }

        function theFourthStategy() {
            if (price < criticalPointTwo) {
                return price * belowRate;
            }
            else if (price >= criticalPointTwo && price < criticalPointOne) {
                return criticalPointTwo * belowRate + aboveRate * (price - criticalPointTwo)
            }
            else {
                return price * baseRate;
            }
        }

        function theFifthStategy() {
            var maxOne = 0.5;
            var maxTwo = 1;

            if (price <= 0.5) {
                return Math.min(maxOne, originalPrice * 0.35);
            }
            else if (price > 0.5 && price <= 1) {
                return Math.min(maxTwo, originalPrice * 0.35);
            }
            else if (price > 1 && price < criticalPointTwo) {
                return price * belowRate;
            }
            else if (price >= criticalPointTwo && price < criticalPointOne) {
                return criticalPointTwo * belowRate + aboveRate * (price - criticalPointTwo);
            }
            else {
                return price * baseRate;
            }
        }
    });

})(jQuery);

(function ($) {

    //STORY #9727::淘宝返利首页超返链接中lc=taobao_super使用JS来实现
    $("a[data-lc]").on("click", function () {
        var $this = $(this);
        var originHref = $this.attr("href");
        var lc = $this.attr("data-lc");

        if (!originHref) {
            return;
        }

        if (originHref.indexOf("?") > -1) {
            $this.attr("href", "{0}&lc={1}".format(originHref, lc));
        } else {
            $this.attr("href", "{0}?lc={1}".format(originHref, lc));
        }

    });

}(jQuery));

//STORY #13091::passport域名301跳转
(function(){
	var hostDomain = Fanli.Utility.rootDomain;
	var host = location.host.toLowerCase();
	var newLocation = location.href.replace(/51fanli\.com/i, 'fanli.com');

	if (!host || hostDomain == '.fanli.com' || /^(fun|trace)\./.test(host)){
		return;
	}
	else{
		window.location.href = newLocation;
	}
})();

var passportAppUrl = "//passport{0}".format(Fanli.Utility.rootDomain);
var redirectPrefixAfterLogin = "{0}/redirect/loginsuccess".format(passportAppUrl);
var redirectPrefixAfterRegister = "{0}/redirect/regsuccess".format(passportAppUrl);
var verifyCodeImageUrl = "//fun{0}/verify.png?".format(Fanli.Utility.rootDomain);