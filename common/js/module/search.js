/**
* jQuery fanli search plugin v1.2
* require jquery-ui-autocomplete-min.js
**/
(function ($)
{
    var defaults = {
        sInputSelector: "#search-field",
        apiUrl: "//fun.fanli.com/api/search/searchshop",
        selectedClass: "ui-state-hover",
        sHiddenSelector: "#J_url",
        dUrlHiddenSelector: "#J_durl"
    };

    $.extend({
      flSearch: function (options){
        var settings = $.extend(true, {}, defaults, options);
        var $sInput = $(settings.sInputSelector);
        var $form = $sInput.closest("form");
        var $vh = $(settings.sHiddenSelector);
        var $durlh = $(settings.dUrlHiddenSelector);
        var currentMenuItem = {};
        var isSelectedRedirect = 0;
        var $taobaoTips = $("<div class='hp_taobao_71_tips' style='width:{0}px;' id='J_taobao_71_tips'>淘宝/天猫宝贝不能使用链接搜索！请复制宝贝标题进行搜索！</div>".format($sInput.outerWidth(true) - 30 - 2));
        var searchFlag = false;

        var $erOverlay;
        var filterKey = $sInput.data("yyg_keyword");
        var filterArray = filterKey && $sInput.attr("data-yyg_keyword").indexOf(",") > 0 ? filterKey.split(",") : [];

        //跳转taobao s8的弹层提示
        var $s8TipsPopup;

        bindBehavior();
        bindS8SearchOverlay();

        function bindBehavior(){
            if ($.fn.placeholder){
              $sInput.placeholder({
                  type: 'label',
                  klass: 'search-placeholder'
              });
            }

            $sInput.on("input.autocomplete", function () { currentMenuItem = {}; $sInput.trigger('keydown.autocomplete');})
                .autocomplete({
                   source: function (request, response){
                     var painVal = $.trim(request.term);

                       // 当输入任意空格时候，不执行任何操作，直接返回
                     if (!painVal) {
                         $(".ui-autocomplete").hide();
                         $("#J_taobao_71_tips").hide();
                         return;
                     }
                       // 判断搜索内容是否为连接
                       // InputValidation.isUrl(painVal) ? $durlh.val("1") : $durlh.val("0");
                     if (/(taobao|tmall){1}\.com/g.test(painVal)) {
                         if ($("#J_taobao_71_tips").length == 0) {
                             $taobaoTips.appendTo($sInput.parent());
                         }
                         else {
                             $("#J_taobao_71_tips").show();
                         }
                         $(".ui-autocomplete").hide();
                         return;
                     } else {
                         $("#J_taobao_71_tips").hide();
                     }

                     sourceSetting(request, response, painVal);
                   },
                   select: function (event, ui){
                     selectSetting(event, ui);
                     return false;
                   },
                   focus: function (event, ui){
                     focusSetting(event, ui);
                     return false;
                   },
                   position: { offset: "-2 1" },
                   appendTo: "#suggestmenu",
                   minLength: 1,
                   autoSubmitViaEnter: 1
                 })
                 .data("autocomplete")._renderItem = function (ul, item){
                   return renderItem(ul, item);
                 };

            $sInput.on("click", function (ev){
                var kc = ev.keyCode;
                if (kc && (kc == 38 || kc == 40)) {
                    return;
                }
                currentMenuItem = {};
                $sInput.data("autocomplete")._search($sInput.val());
            });

          $form.on("submit", submitHandler);

          $("#suggestmenu").delegate(".{0}".format(settings.selectedClass), "mousedown", function (event) {
                isSelectedRedirect = 1;
          });
        }

        function buildErOverlay() {
            if (!$.tools.overlay) {
                return false;
            }

            var erHtml = new StringBuilder();

            erHtml.append('<div class="yahei popover">')
                  .append('    <div class="pop-header"><h3 class="pop-title">返利网温馨提示</h3><a href="javascript:void(0);" class="close">&times;</a></div>')
                  .append('    <div><img src="//static2.51fanli.net/common/images/header/er.png" alt="扫码下载APP参与1元购活动实际只花1块钱" /></div>')
                  .append('</div>');

            $erOverlay = $(erHtml.toString()).appendTo("body").overlay({
                top: "20%",
                api: true,
                fixed: false,
                onLoad: function () {
                    UBT.track("top_serach_er_open", "pc", "wd-{0}".format($.trim($sInput.val())));
                },
                onClose: function () {
                    UBT.track("top_serach_er_close", "pc", "wd-{0}".format($.trim($sInput.val())));
                }
            });

            $erOverlay.load();
        }

        function bindS8SearchOverlay() {
            if (!("header-tbs8pop".getCookie() > 0)) {
                $.getJSON("//fun.fanli.com/topheader/ajaxCheckHeaderPop?jsoncallback=?", function (res) {
                    if (res.status == 1) {
                        Fanli.Utility.requirejs(["overlay", "expose"], function () {
                            var aHtml = new StringBuilder();

                            aHtml.append('<div id="J_tb_s8_pop" class="yahei tb-s8-popover" style="display:none;">')
                                .append('<div class="pop-header"><h3 class="pop-title">返利网温馨提示</h3><a href="javascript:void(0);" class="close">&times;</a></div>')
                                .append('<div class="pop-content">')
                                .append('<p class="tbpop-h2">亲~您将跳到<span class="red">爱淘宝</span>~</p>')
                                .append('<p class="tbpop-h3">淘宝返利升级了！搜索结果都有返利哦~</p>')
                                .append('<p class="tb-pop-btndiv"><a id="J_tb_s8_confirm" href="javascript:void(0);" class="tb-pop-btn">确定</a> <label><input id="J_tb_s8_checkbox" type="checkbox" class="confirm-tb-nopop"/>不再提示</label></p>')
                                .append('</div>')
                                .append('</div>');

                            $s8TipsPopup = $(aHtml.toString()).appendTo("body").overlay({
                                top: "20%",
                                api: true
                            });

                            $("#J_tb_s8_confirm").on("click", function (ev) {
                                ev.preventDefault();

                                if ($("#J_tb_s8_checkbox").prop("checked")) {
                                    $.getJSON("//fun.fanli.com/topheader/ajaxSetHeaderPop?jsoncallback=?");
                                }

                                searchFlag = true;

                                $s8TipsPopup.close();
                                $form.submit();
                            });

                            $("#J_tb_s8_pop").find('.close').click(function (ev) {
                                ev.preventDefault();

                                searchFlag = true;
                                $s8TipsPopup.close();
                                $form.submit();
                            });
                        });
                    }
                });
            }
        }

        function sourceSetting(request, response, searchValue){
            $.getCacheJSONP(settings.apiUrl + '?jsoncallback=?', {'keywords': searchValue}, function(result){
                response(buildSearchResult(result, searchValue));
            });
        }

        function focusSetting(event, ui){
          var item = ui.item;
          if (item.idx > 0){
            $("#suggestmenu li a:eq(0)").removeClass(settings.selectedClass);
          }
        }

        function selectSetting(event, ui){
          var item = ui.item;
          currentMenuItem = item;

          $sInput.val(item.val);
          $vh.val(item.url);
          if (isSelectedRedirect == 1){
            isSelectedRedirect = 0;
            $form.trigger("submit");
          }
        }

        function renderItem(ul, item){
          var sb = new StringBuilder();
          var $li = !item.isadvise ? $("<li class='stitleli'></li>") : $("<li class='sitemli'></li>");
          var $a = $("<a href='javascript:void(0);'></a>");

          if (item.hasspace) { $a.addClass("sitem"); }
          if (item.idx == 0) { $a.addClass(settings.selectedClass); }

          sb.append(item.benefit ? "<span class='hasfl'>{0}</span>".format(item.benefit) : "")
            .append(item.icon ? "<span style='_float:left;vertical-align:middle;margin:-2px 4px 0 0;_margin-top:8px;display:inline-block;width:16px;height:16px;background: transparent url({0}) no-repeat 0 0 scroll;'></span>".format(item.icon) : "")
            .append(item.text);

          return $li.data("item.autocomplete", item)
                    .append($a.html(sb.toString()))
                    .appendTo(ul.addClass('search-suggest'));
        }

        function submitHandler(ev) {
            var ival = $.trim($sInput.val());
            var sval = currentMenuItem.val || ival;

            // fix bug#6968 - 解决autocomplete在IE6用鼠标直接操作不触发的问题
            // InputValidation.isUrl(ival) ? $durlh.val("1") : $durlh.val("0");

            if (filterArray && $.inArray (ival, filterArray) > -1) {
                if ($erOverlay) {
                    $erOverlay.load();
                }
                else {
                    buildErOverlay();
                }

                return false;
            }

            var special = $sInput.data("special");

            if (typeof special != "undefined" && !ival && $sInput.attr("placeholder") != "粘贴淘宝/天猫宝贝标题，购物拿返利") {
                window.location.href = special;
                return false;
            }

            if (!ival || ival == $sInput.attr("placeholder")) {
                return false;
            }

            if (!("header-tbs8pop".getCookie() > 0) && !searchFlag && currentMenuItem.type == 'taobao') {
                $s8TipsPopup.load();
                return false;
            }
            else {
                searchFlag = false;
            }

            UBT.track("global", "pc", "wd-{0}".format(ival));

            $vh.val(currentMenuItem.url ? currentMenuItem.url : "");
        }

        function buildSearchResult(result, sval){
          var sb = new StringBuilder();
          var data = result.data;
          var len;
          var temObj;
          var temDataItem;

          // 请求失败或是无返回结果时，直接返回
          if (!result.status || data.length == 0) { currentMenuItem = {}; return sb.strings; }

          len = data.length;
          for (var i = 0; i <= len - 1; ++i){
            temObj = {};
            temDataItem = data[i];
            temObj.idx = (function () { return i; })();
            temObj.id = temDataItem.id;
            temObj.url = temDataItem.url;
            temObj.text = temDataItem.name;
            temObj.val = temDataItem.val;
            temObj.type = temDataItem.stype;
            temObj.icon = temDataItem.icon;
            temObj.benefit = temDataItem.benefit;
            temObj.isadvise = temDataItem.isadvise;
            temObj.hasspace = temDataItem.hasspace;
            sb.append(temObj);
          }

          // cache first item
          currentMenuItem = sb.strings[0];

          return sb.strings;
        }

      }
    });

    $.extend($.flSearch, { defaults: defaults });

})(jQuery);