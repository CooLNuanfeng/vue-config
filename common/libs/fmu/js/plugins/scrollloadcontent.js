///<reference path="../core/fmu.js" />
///<reference path="../extend/jquery.extend.js" />
///<reference path="../vendors/jquery/jquery-2.1.1.js" />

/**
 * @file scrollloadcontent
 * @import core/fmu.js, vendors/jquery/jquery-2.1.1.js, extend/jquery.extend.js.js
 */

(function ($) {

    $.fn.scrollloadcontent = function (options) {

        var $window = $(window);
        var eventNamespace = '.SCROLLLOADCONTENT';

        //传入options为'destroy'，会摧毁这个事件
        if (typeof options == 'string' && options == 'destroy') {
            $window.off("scroll{0} resize{0}".format(eventNamespace));
            return this;
        }

        var settings = $.extend({
            //接口是否缓存
            cache: true,
            //如果cache为true, 默认缓存时间5分钟,
            cacheTime: 5,
            //ajax请求数据
            ajaxUrl: '',
            //数据传输参数
            postData: {},
            //距离底部多少距离，belowthefold(滚动判断)需要用到的参数
            threshold: $window.height() * 3,
            //belowthefold(滚动判断)需要用到的参数
            container: window,
            //是否需要主动将data数据append到指定的ajaxTagSelector的前面
            appendData: true,
            //加载后的callback()
            callback: function (p1, p2) { },
            //如果第一页都没有数据,即这个条件下根本一条数据都没有,则调用emptyCallback
            emptyCallback: function () { },
            //replaceInitIndex之前的前缀，防止误伤其他数字  默认page=页码
            emptyHtml: "没有更多",
            replacePre: 'page=',
            //初始ajax加载的页码
            replaceInitIndex: 2,
            //计算ajax加载的标记，放在滚动内容的最下面。ajax jsonp返回的json.data为新加载html
            ajaxTagSelector: '.J_scrollloadcontent_tag',
            //ajax加载的loading状态，放在ajaxTagSelector的下面
            ajaxLoadingSelector: '.J_scrollloadcontent_loading',
            //ajax方式   jsonp or html  默认jsonp
            ajaxType: 'jsonp'
        }, options);

        var index = settings.replaceInitIndex;
        var replacePre = settings.replacePre;
        var ajaxType = settings.ajaxType;
        var abortLimit = settings.abortLimit;

        return this.each(function () {
            var $container = $(this);
            var $ajaxTag = $container.find(settings.ajaxTagSelector);

            if ($ajaxTag.length == 0) {
                return;
            }

            var $loading = $container.find(settings.ajaxLoadingSelector);
            var ajaxUrl = settings.ajaxUrl;

            var callback = settings.callback;
            var ajaxsending = false;
            var isEnd = false;

            $window.on("scroll{0} resize{0}".format(eventNamespace), function () {
                if (ajaxsending) {
                    return true;
                }

                if (!$.belowthefold($ajaxTag, settings)) {
                    ajaxLoad();
                }
            }).triggerHandler("scroll{0} resize{0}".format(eventNamespace));

            function ajaxLoad() {
                $loading && $loading.show();

                if (isEnd) {
                    if ($loading.length > 0) {
                        $loading.html(settings.emptyHtml);
                    }
                    if (index == 1) {
                        settings.emptyCallback();
                    }
                    return;
                }

                ajaxsending = true;

                if (ajaxType == 'html') {
                    htmlAjax();
                } else {
                    jsonAjax();
                }
            }

            function htmlAjax() {
                $.ajax({
                    url: ajaxUrl,
                    type: 'GET',
                    data: settings.postData,
                    dataType: "html"
                }).done(function (html) {
                    appendHtml(html);
                });
            }

            function jsonAjax() {
                var jsonParam = {};

                jsonParam.type = 'GET';
                jsonParam.url = /jsoncallback/.test(ajaxUrl) ? ajaxUrl.replace('?jsoncallback=?', '') : ajaxUrl;
                jsonParam.data = settings.postData;
                jsonParam.dataType = "jsonp";
                jsonParam.jsonp = 'jsoncallback';

                if (settings.cache) {
                    jsonParam.cache = true;
                    jsonParam.jsonpCallback = "jQuery83088605_" + parseInt(new Date().getTime() / (settings.cacheTime * 60000));
                }

                jsonParam.success = function (json) {
                    if (json.status == 1 && json.data) {
                        if (settings.appendData) {
                            appendHtml(json.data);
                        } else {
                            breakLoading();
                            callback(json, $container);
                        }
                    } else {
                        isEnd = true;
                        ajaxLoad();
                    }
                };

                $.ajax(jsonParam);
            }

            function appendHtml(html) {
                var $newHtml = $(html);

                $ajaxTag.before($newHtml);
                breakLoading();
                callback($newHtml, $container);
            }

            function breakLoading() {
                $loading && $loading.hide();
                ajaxsending = false;
                ajaxUrl = ajaxUrl.replace(new RegExp(replacePre + index, 'i'), replacePre + (++index));
            }
        });
    };
})(jQuery);