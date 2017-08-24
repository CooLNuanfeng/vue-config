///<reference path="../core/fmu.js" />
///<reference path="../vendors/jquery/jquery.js" />

/**
 * @file suggestion
 * @import core/fmu.js, vendors/jquery/jquery.js
 */

//JSON Data
//{
//    "data": {
//        "source": [
//            {
//                "value": "value",
//                "text": "1"
//            }, {
//                "value": "value",
//                "text": "21"
//            }
//        ]
//    },
//    "info": "",
//    "status": 1
//}

(function ($) {

    $.fn.suggestion = function (options) {
        var settings = $.extend(true, {}, {
            // 源
            source: [],
            // 搜索结果的最大值
            limit: 10,
            delay: 10,
            // 搜索完成
            complete: $.noop,
            select: $.noop,
            resultClass: "fmu-suggestion-result",
            offset: { x: 0, y: 0, w: 0 },
            adjustResultPanel: true,
            hidePanelBlur: false,//blur时是否隐藏resultPanel
            noResultHanlder: $.noop,
            resultTpl:"<li class='fmu-suggestion-item J_fmu_suggestion_item' data-value='{0}'>{1}</li>",
            enableHistory: false, //是否开启记录查找历史功能,默认不开启
            historyCount: 10,//默认记录10条历史记录
            clearText: '清除历史',
            storeKey: '__fl_search_history'//localstorage记录搜索历史
        }, options);
        //对外暴露store
        $.fn.suggestion.store = store;

        var source = settings.source;
        var resultClass = settings.resultClass;
        var settingsOffset = settings.offset;
        var $result = $(".{0}".format(resultClass));
        var isLocalSearch = $.isArray(source);
        var timeId;
        var $input;
        var cachedVal;
        var search_history_key = settings.storeKey;

        return this.each(applyBehavior);

        function applyBehavior() {
            var $this = $(this);
            $this.attr("autocomplete") == "off" ? '' : $this.attr("autocomplete", "off");
            
            if ($result.length == 0) {
                $result = $("<div class='{0}'></div>".format(resultClass)).appendTo("body");
            }

            if (settings.enableHistory) {
                $result.addClass("fmu-suggestion-history");
            }

            $result.on("click", ".J_fmu_suggestion_item", function (ev) {
                ev.preventDefault();
                var $item = $(this);
                var text = $item.text();
                $input.val(text);
                settings.select($item);
                store(text);
            });

            $input = $this.on("keydown.suggestion input.keydown", keydownHandler);

            if (settings.hidePanelBlur) {
                $input.on("focusout.suggestion", function () {
                    setTimeout(function () {
                        $result.hide();
                        cachedVal = $.trim($input.val());
                    }, 250);
                });
            }

            $input.on("focusin.suggestion", function () {
                var val = $.trim($input.val());
                adjustResultPosition();
                if (val && val == cachedVal) {
                    $result.show();
                }
                if (val == "") {
                    showHistory();
                }
            });

            $result.on("click", "#J_clear_history", function (ev) {
                ev.preventDefault();
                window.localStorage.removeItem(search_history_key);
                flush();
            });
        }

        function keydownHandler() {
            var val = $.trim($input.val());
            timeId && clearTimeout(timeId);
            if (val) {
                timeId = setTimeout(function () { search(val); }, settings.delay);
            } else {
                flush();
                showHistory();
            }
        }

        function search(val) {
            if (isLocalSearch) {
                filterSource(val, source);
            } else {
                getRemoteSource(val);
            }
        }

        function getRemoteSource(val) {
            $.getJSON(source, { k: val }, function (res) {
                if (res.status == 1) {
                    filterSource(val, res.data.source || []);
                }
            });
        }

        function filterSource(val, source) {
            var len;
            var result;
            var resultString;

            source = source || [];
            len = source.length;

            if (len == 0) {
                settings.noResultHanlder();
                return;
            }

            result = [];
            resultString = new StringBuilder();
            var matcher = new RegExp(escapeRegex(val), "i" );
            $.each(source, function (idx, item) {
                if (result.length < settings.limit) {
                    if (isLocalSearch) {
                        if (matcher.test( item.text || item.value || item )) {
                            result.push(item);
                        }
                    } else {
                        result.push(item);
                    }
                }
            });

            if (result.length > 0) {
                settings.complete(result);
                resultString.append("<ul>");
                $.each(result, function (idx, item) {
                    resultString.append(settings.resultTpl.format(item.value, item.text));
                });

                resultString.append("</ul>");

                flush();

                $result.append(resultString.toString()).show();

            } else {
                flush();
                settings.noResultHanlder();
            }

        }

        function adjustResultPosition() {

            if (!settings.adjustResultPanel) {
                return;
            }

            var inputOffset = $input.offset();

            $result.css({
                left: inputOffset.left + settingsOffset.x + "px",
                top: inputOffset.top + settingsOffset.y + $input.height() + "px",
                width: $input.width() + settingsOffset.w + "px"
            });
        }

        function flush() {
            $result.html('').hide();
        }

        /*
        * 增加搜索历史功能，记录十条，排重，后面的搜索历史先展示
        */
        function store(val) {
            if (!settings.enableHistory) {
                return;
            }
            var text = encodeURIComponent($.trim(val));
            var storage = window.localStorage.getItem(search_history_key) ? JSON.parse(window.localStorage.getItem(search_history_key)) : [];
            //排重
            var flag = true;
            for (var i=0,len=storage.length; i<len; i++) {
                if (storage[i] == text) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                storage.push(text);
                if (storage.length > settings.historyCount) {
                    storage.splice(0,1);
                }
                var valString = JSON.stringify(storage);
                window.localStorage.setItem(search_history_key, valString);
            }
        }

        function showHistory(){
            if (!settings.enableHistory) {
                return;
            }
            var storage = window.localStorage.getItem(search_history_key);
            if (storage){
                try {
                    var history = JSON.parse(storage);
                } catch (e) {
                    return;
                }

                var liString = "";
                //倒序，后面的搜索历史先展示
                history.reverse().forEach(function(text) {
                    liString += '<li class="fmu-suggestion-item J_fmu_suggestion_item">'+ decodeURIComponent(text) +'</li>';
                })

                if (liString) {
                    var resultString = new StringBuilder();
                    resultString.append("<ul>");
                    resultString.append(liString);
                    resultString.append("</ul>");
                    resultString.append('<div class="fmu-suggestion-clear"><a href="javascript:;" id="J_clear_history">'+ settings.clearText +'</a></div>');

                    flush();

                    $result.append(resultString.toString()).show();
                }
            }
        }

        function escapeRegex( value ) {
            return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        }
    };

})(jQuery);