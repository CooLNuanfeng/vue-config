/// <reference path="zepto.js" />
/*
    @import zepto.js
*/
Zepto.extend(Zepto, {

    isHidden: function ($el)
    {
        if ($el.length == 0)
        {
            return true;
        }
        var elem = $el[0];
        var width = elem.offsetWidth;
        var height = elem.offsetHeight;

        return (width === 0 && height === 0) || $el.css("display") === "none";
    },

    UA: (function ()
    {
        /*
         * 浏览器判断，来自yui3
         * @property
         * @static
         */
        var numberfy = function (s)
        {
            var c = 0;
            return parseFloat(s.replace(/\./g, function ()
            {
                return (c++ == 1) ? '' : '.';
            }));
        },

        nav = navigator,

        o = {
            ie: 0,
            opera: 0,
            gecko: 0,
            webkit: 0,
            mobile: null,
            air: 0,
            caja: nav.cajaVersion,
            secure: false,
            os: null
        },

            ua = nav && nav.userAgent,
            loc = window.location,
            href = loc && loc.href,
            m;

        o.secure = href && (href.toLowerCase().indexOf("https") === 0);
        if (ua)
        {
            if ((/windows|win32/i).test(ua))
            {
                o.os = 'windows';
            } else if ((/macintosh/i).test(ua))
            {
                o.os = 'macintosh';
            }

            // Modern KHTML browsers should qualify as Safari X-Grade
            if ((/KHTML/).test(ua))
            {
                o.webkit = 1;
            }
            // Modern WebKit browsers are at least X-Grade
            m = ua.match(/AppleWebKit\/([^\s]*)/);
            if (m && m[1])
            {
                o.webkit = numberfy(m[1]);

                // Mobile browser check
                if (/ Mobile\//.test(ua))
                {
                    o.mobile = "Apple"; // iPhone or iPod Touch
                } else
                {
                    m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/);
                    if (m)
                    {
                        o.mobile = m[0]; // Nokia N-series, Android, webOS, ex: NokiaN95
                    }
                }

                m = ua.match(/AdobeAIR\/([^\s]*)/);
                if (m)
                {
                    o.air = m[0]; // Adobe AIR 1.0 or better
                }

            }

            if (!o.webkit)
            { // not webkit
                // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
                m = ua.match(/Opera[\s\/]([^\s]*)/);
                if (m && m[1])
                {
                    o.opera = numberfy(m[1]);
                    m = ua.match(/Opera Mini[^;]*/);
                    if (m)
                    {
                        o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
                    }
                } else
                { // not opera or webkit
                    m = ua.match(/MSIE\s([^;]*)/);
                    if (m && m[1])
                    {
                        o.ie = numberfy(m[1]);
                    } else
                    { // not opera, webkit, or ie
                        m = ua.match(/Gecko\/([^\s]*)/);
                        if (m)
                        {
                            o.gecko = 1; // Gecko detected, look for revision
                            m = ua.match(/rv:([^\s\)]*)/);
                            if (m && m[1])
                            {
                                o.gecko = numberfy(m[1]);
                            }
                        }
                    }
                }
            }
        }

        return o;
    }()),

    guid: function () {
        // get it from https://github.com/maccman/book-assets/blob/master/ch03/guid.js
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    },

    "random": function (n) {
        var uid = Math.random().toString(16).substr(2, n);

        while (uid.length < n) {
            uid = Math.random().toString(16).substr(2, n);
        }

        return uid;
    },

    isNumeric: function (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    },

    noop: function () { }
    
});