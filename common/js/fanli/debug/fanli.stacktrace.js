; (function (exports) {

    exports.BowserDetect = (function () {
        // navigator.userAgent
        // [firefox] "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:30.0) Gecko/20100101 Firefox/30.0"
        // [chrome]  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36"
        // [safari]  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2" 
        // Apple iPhone 5 "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53" 
        // Fanli ios "Fanli/4.3.0.31 (iPhone; iPhone OS 8.3; zh_CN; ID:1-9642472-632496606223-17-2)" 
        // Samsung Galaxy Note "Mozilla/5.0 (Linux; U; Android 2.3; en-us; SAMSUNG-SGH-I717 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
        // Xiaomi2s "Fanli/4.3.0.26 (Xiaomi MI 2SC;Android 4.1.1;zh_CN;ID:2-4255770-25159133448136-4-6)"
        // Apple iPad3/4 "Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53" 
        // Samsung Galaxy S4 "Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53" 

        var ua = navigator.userAgent;

        var _IE = (function () {
            var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );

            return v > 4 ? v : false;

        }());

        function _platform() {
            var pf = "", matches;

            if (matches = /(Fanli)?.*?iPhone/i.exec(ua)) {
                pf = "iphone" + (matches[1] ? "(fanli)" : "");
            } else if (matches = /(Fanli)?.*?iPad/i.exec(ua)) {
                pf = "ipad" + (matches[1] ? "(fanli)" : "");
            } else if (matches = /(Fanli)?.*?Android/i.exec(ua)) {
                pf = "android" + (matches[1] ? "(fanlli)" : "");
            } else if (/linux/i.exec(ua)) {
                pf = "linux";
            } else if (/macintosh|mac os x/i.exec(ua)) {
                pf = "mac";
            } else if (/windows|win32/i.exec(ua)) {
                pf = "windows";
            }

            return pf;
        }

        function _bname() {
            var bn = "";
            if (/firefox/i.test(ua)) {
                bn = "Firefox";
            } else if (/chrome/i.test(ua)) {
                if (/LBBROWSER/i.test(ua)) {
                    bn = "Liebao";
                } else if (/QQBrowser/i.test(ua)) {
                    bn = "QQBrowser";
                } else if (/MAXTHON/i.test(ua)) {
                    bn = "MAXTHON";
                } else if (/QIHU|360SE|360EE/i.test(ua)) {
                    bn = "360";
                } else if (/SE 2.x|MetaSr/i.test(ua)) {
                    bn = "Sougou";
                } else {
                    bn = "Chrome";
                }
            } else if (/safari/i.test(ua)) {
                bn = "Safari";
            } else if (/msie 10.0/i.test(ua)) {
                bn = "IE";
                this.bversion = 10;
            }

            return bn;
        }

        return {
            platform: _platform(),
            bname: _IE ? "IE" : _bname(),
            bversion: _IE ? _IE : (/msie 10.0/i.test(ua) ? 10 : "")
        };

    }());

    exports.CookieOperation = (function () {

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

}(this));

; (function () {
    var StackTrace = function () { },
        proto = StackTrace.prototype;

    proto.postUrl = "http://eagle.fanli.com/index.php";
    proto.forbiddenRegs = [/Baiduspider/i];

    proto.xmlHttpRequst = (function () {
        var rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
            rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
            ajaxLocation,
            ajaxLocParts,
            isLocal;
        try {
            ajaxLocation = location.href;
        }
        catch (e) {
            ajaxLocation = document.createElement("a");
            ajaxLocation.href = "";
            ajaxLocation = ajaxLocation.href;
        }
        ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
        isLocal = rlocalProtocol.test(ajaxLocParts[1]);

        function createStandardXHR() {
            try {
                return new window.XMLHttpRequest();
            } catch (e) { }
        }

        function createActiveXHR() {
            try {
                return new window.ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) { }
        }

        return window.ActiveXObject ? (function () {
            return !isLocal && createStandardXHR() || createActiveXHR();
        }()) : createStandardXHR();

    })();

    proto.validate = function (ua) {
        var ret = true;
        var regs = this.forbiddenRegs;
        var i = 0, len = regs.length, reg;

        for (; i < len; i++) {
            reg = regs[i];
            if (reg.test(ua)) {
                ret = false;
                break;
            }
        }

        return ret;
    };

    proto.post = function (message, url, line) {
        var img = new Image(), builder = [];

        builder.push(this.postUrl);
        builder.push("?")
        builder.push("u=" + encodeURIComponent(window.location.href));
        builder.push("&");
        builder.push("em=" + encodeURIComponent((message ? message : "")));
        builder.push("&");
        builder.push("ln=" + encodeURIComponent((line != undefined ? line : "")));
        builder.push("&");
        builder.push("ua=" + encodeURIComponent(navigator.userAgent));
        builder.push("&");
        builder.push("su=" + encodeURIComponent((url ? url : "")));
        builder.push("&");
        builder.push("a=c");
        builder.push("&");
        builder.push("pf=" + BowserDetect.platform);
        builder.push("&");
        builder.push("bn=" + BowserDetect.bname);
        builder.push("&");
        builder.push("bv=" + BowserDetect.bversion);

        img.onload = img.onerror = function () {
            img.onload = img.onerror = null;
        }

        img.src = builder.join("");
    };

    proto.log = function () {
        var that = this;

        return function (message, url, line) {
            var hassentCookieName = "hassenterror";
            var hassentCookie = CookieOperation.getCookie(hassentCookieName);
            var permit = that.validate(navigator.userAgent);

            if (permit && hassentCookie < 5 && parseInt(Math.random() * 500) == 277) {
                CookieOperation.setCookie(hassentCookieName, hassentCookie ? parseInt(hassentCookie) + 1 : 1 , (24 - new Date().getHours()) / 24, location.host, "/");
                that.post(message, url, line);
            }
        };
    };

    window.onerror = new StackTrace().log();

})();