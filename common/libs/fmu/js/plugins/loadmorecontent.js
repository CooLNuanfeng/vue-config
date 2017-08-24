///<reference path="../core/fmu.js" />
///<reference path="../extend/jquery.extend.js" />
///<reference path="../vendors/jquery/jquery-2.1.1.js" />

/**
 * @file loadmorecontent
 * @import core/fmu.js, vendors/jquery/jquery-2.1.1.js, extend/jquery.extend.js.js
*/

(function ($) {

    $.fn.loadMoreContent = function (options) {
        var eventNamespace = '.LOADMORECONTENT';
        var eventName = "scroll{0} resize{0}".format(eventNamespace);

        //传入options为'destroy'，会摧毁这个事件
        if (typeof options == 'string' && options == 'destroy') {
            $(window).off(eventName);
            return this;
        }

        var settings = $.extend({
            cache: true, //接口是否缓存
            cacheTime: 5, //如果cache为true, 默认缓存时间5分钟,
            ajaxUrl: '', //ajax请求数据
            postData: {},
            threshold: $(window).height() * 3, //距离底部多少距离，belowthefold(滚动判断)需要用到的参数
            container: window, // belowthefold(滚动判断)需要用到的参数
            callback: function (p1, p2) { }, //加载后的callback()
            errorCallback: function (p1, p2) { },
            emptyCallback: function () { }, // 如果第一页都没有数据,即这个条件下根本一条数据都没有,则调用emptyCallback
            replacePre: 'page=',  //replaceInitIndex之前的前缀，防止误伤其他数字  默认page=页码
            replaceInitIndex: 2, //初始ajax加载的页码
            ajaxTagSelector: '.J_load_more_content_tag', //计算ajax加载的标记，放在滚动内容的最下面
            ajaxLoadingSelector: '.J_load_more_content_loading' //ajax加载的loading状态，放在ajaxTagSelector的下面
        }, options);

        var index = settings.replaceInitIndex;
        var replacePre = settings.replacePre;
        var ajaxType = settings.ajaxType;
        var isSending = false;

        return this.each(function () {
            var $container = $(this);
            var $ajaxTag = $container.find(settings.ajaxTagSelector);

            if ($ajaxTag.length == 0) {
                return;
            }

            var $loading = $container.find(settings.ajaxLoadingSelector);
            var ajaxUrl = settings.ajaxUrl;
            var callback = settings.callback;

            $(window).on("scroll{0} resize{0}".format(eventNamespace), function () {
                if (!isSending && !$.belowthefold($ajaxTag, settings)) {
                    ajaxLoad();
                }

                if ($ajaxTag == 0) {
                    $(window).off("scroll{0} resize{0}".format(eventNamespace));
                }
            });

            // 滑动后，chrome会记住滚动条位置，主动触发一次
            if (!isSending && !$.belowthefold($ajaxTag, settings)) {
                ajaxLoad();
            }

            function ajaxLoad() {
                isSending = true;
                $loading && $loading.show();
                var jsonParam = {};

                jsonParam.type = 'GET';
                jsonParam.url = /jsoncallback/.test(ajaxUrl) ? ajaxUrl.replace('?jsoncallback=?', '') : ajaxUrl;
                jsonParam.data = settings.postData;
                jsonParam.dataType = "jsonp";
                jsonParam.success = function (json) {
                    if (json.status == 1 && json.data) {
                        breakLoading();
                        callback(json, $container);
                    } else {
                        settings.errorCallback(json, $container);
                    }
                };

                jsonParam.jsonp = 'jsoncallback';

                if (settings.cache) {
                    jsonParam.cache = true;
                    jsonParam.jsonpCallback = "jQuery83088605_" + parseInt(new Date().getTime() / (settings.cacheTime * 60000));
                }

                $.ajax(jsonParam);
            }

            function breakLoading() {
                $loading && $loading.hide();
                isSending = false;
                ajaxUrl = ajaxUrl.replace(new RegExp(replacePre + index, 'i'), replacePre + (++index));
            }
        });
    };
})(jQuery);