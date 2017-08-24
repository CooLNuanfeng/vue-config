(function ($)
{
    Fanli.Weibo.add("buildDom", function (options)
    {
        var settings = $.extend(true, {}, {
            containerSelector: ""
        }, options);

        var stylelinkurl = "http://static2.51fanli.net/common/css/module/weibo.css";

        /*
        var tmpl = ['<div class="withdraw-weibo">',
                       '<h4 class="t ht">马上发布微博，分享提现乐趣，享提现优先特权！ -新浪微博weibo.com</h4>',
                       '<div class="c">',
                           '<textarea maxlength="140" class="arial" name="" id="J_weibo_textarea"></textarea>',
                           '<div class="l">还可以输入<strong id="J_weibo_textsum" data-maxLength="140" class="red charsLeft">140</strong>字 <span class="error" id="J_weibo_error"></span></div>',
                               '<a class="r btn-withdraw-publisher" href="javascript:void(0);" id="J_weibo_publisher">发布到微博</a>',
                               '<div class="clear"></div>',
                        '</div>',
                     '</div>'].join('');
        */

        var ie6tmpl = '<div class="wb-ie6box" id="wbie6Box"><a class="wb_publishbtn" href="javascript:void(0);" id="wb_publishie6"><span>发布到微博</span></a></div>';

        var tmpl = ['<div class="wb-box" id="wbBox">',
                        '<div class="wb-title">',
                            '<h6>马上发布微博，分享提现乐趣，享提现优先特权！</h6>',
                        '</div>',
                        '<textarea id="J_weibo_textarea" class="wb-textarea" maxlength="300"></textarea>',
                        '<div class="wb-btn">',
                            '<span class="wb-textsum">还可以输入<span class="red bold" id="J_weibo_textsum" data-maxlength="112">112</span>字 &nbsp;&nbsp;<span id="J_weibo_error" class="red"></span></span>',
                            '<a class="wb_publishbtn" href="javascript:void(0);" id="wb_publisher"><span>发布到微博</span></a>',
                        '</div>',
                    '</div>'].join('');

        $("head").append('<link rel="stylesheet" href="{0}?{1}" />'.format(stylelinkurl, parseInt(new Date().getTime() / 300000)));
        $(settings.containerSelector).append(GeneralValidation.isIe6() ? ie6tmpl : tmpl);

        return this;
    });

    Fanli.Weibo.add("bindBehavior", function (options)
    {
        var settings = $.extend(true, {}, {
            wbsdk: "http://tjs.sjs.sinajs.cn/open/api/js/wb.js",
            appkey: "1321169129"
        }, options);

        var $sum = $("#J_weibo_textsum");
        var $input = $("#J_weibo_textarea");
        var $error = $("#J_weibo_error");

        var fullString = "抱歉，您输入的文字太多了";
        var randomText = randomDefaultText();

        var getLength = (function ()
        {
            var trim = function (h)
            {
                try
                {
                    return h.replace(/^\s+|\s+$/g, "")
                }
                catch (j)
                {
                    return h
                }
            }

            var byteLength = function (b)
            {
                if (typeof b == "undefined")
                {
                    return 0
                }
                var a = b.match(/[^\x00-\x80]/g);

                return (b.length + (!a ? 0 : a.length))
            };

            return function (q, g)
            {
                g = g || {};
                g.max = g.max || 140;
                g.min = g.min || 41;
                g.surl = g.surl || 20;
                var p = trim(q).length;
                if (p > 0)
                {
                    var j = g.min,
                    s = g.max,
                    b = g.surl,
                    n = q;    //输入字符串
                    var r = q.match(/(http|https):\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+([-A-Z0-9a-z\$\.\+\!\_\*\(\)\/\,\:;@&=\?~#%]*)*/gi) || [];
                    var h = 0;
                    for (var m = 0, p = r.length; m < p; m++)
                    {
                        var o = byteLength(r[m]);
                        if (/^(http:\/\/t.cn)/.test(r[m]))
                        {
                            continue
                        }
                        else
                        {
                            if (/^(http:\/\/)+(weibo.com|weibo.cn)/.test(r[m]))
                            {
                                h += o <= j ? o : (o <= s ? b : (o - s + b))
                            } else
                            {
                                h += o <= s ? b : (o - s + b)
                            }
                        }
                        n = n.replace(r[m], "")
                    }
                    return Math.ceil(((h - 1) + byteLength(n)) / 2)
                }
                else
                {
                    return 0
                }
            }
        })();

        setup();

        function setup()
        {
            if (GeneralValidation.isIe6())
            {
                publishInIe6();
            }
            else
            {
                $input.on("keyup", function () { textSum(); });
                $input.val(randomText);
                textSum();
                publish();
            }
        }

        function publish()
        {
            loadSDK(function ()
            {
                $("#wb_publisher").on("click", function (ev)
                {
                    ev.preventDefault();
                    WB2.anyWhere(function (W)
                    {
                        W.widget.publish({
                            toolbar: "face,image,topic",

							default_text: $input.val() + "@返利网官方微博 #返利网提现优先特权#http://t.cn/zl4VGNi",
							id: "wb_publish",

							callback: function () {}
                        });
                    });
                });
            });
        }

        function publishInIe6()
        {
            loadSDK(function ()
            {
                WB2.anyWhere(function (W)
                {
                    W.widget.publish({
                        toolbar: "face,image,topic",

						default_text: randomText + "@返利网官方微博 #返利网提现优先特权#http://t.cn/zl4VGNi",
						id: "wb_publishie6",
						callback: function (){}
                    });
                });
            });
        }

        function loadSDK(callback)
        {
            $.getScript("{0}?appkey={1}".format(settings.wbsdk, settings.appkey), function ()
            {
                callback();
            });
        }

        function randomDefaultText()
        {
            var map = ["哈哈，我在返利网提现啦，网购省钱还是蛮快的 [笑哈哈]",
                "才用返利网没多久，现在已经省了不少钱啦，现在提现哈！ [hold住]",
                "用了返利网，上网买东西省钱简直是刷刷的快，我又要提现啦！[好爱哦] [偷乐]",
                "返利网就是省钱，实在，[熊猫][兔子]",
                "又可以提现了，嘿嘿，返利网还蛮好的[带感]",
                "服务不错，提现速度也快，顶返利网[笑哈哈]",
                "网购，省钱，返利网好样的[din推撞]",
                "每天上返利网，常常看到很多优惠，买东西也省钱，顶一个[得瑟]",
                "提现很好，省钱很好，什么都好，赞赞的～[许愿]",
                "网购因返利更实惠，提现啦！[转发]",
                "网上买东西能返利省钱，幸福！[真V5]",
                "返利省钱，是件快乐的事～[拍手]",
                "网购里遇到返利网，省钱实惠～[lxhx笑]",
                "在返利网上看到很多给力的优惠，也返利很好[lxhx逗转圈]",
                "在返利网找到了很多实惠[din天哦]",
                "有了返利网，买很多东西都有返利，省钱很方便[din害羞]",
                "返利、实惠、省钱，很好[lt耳朵]",
                "哈哈，又可以提现啦[笑哈哈][带感]",
                "返利可以买券、换东西，但是现在还是小小提现下[得意地笑]",
                "各位亲们，我在返利网提现啦[不好意思]",
                "返利网挺给力的。[bed飞吻]",
                "常常在返利网及时看到很多实惠的商家促销，不错[冒个泡]",
                "哈哈，又可以提现了，返利真快！[bed踏步]",
                "小小返利，用处大，提现啦！[偷乐][din转转]",
                "通过返利网去买东西一段时间了，收到不少返利了，嘻嘻[得意地笑][bed跳]"];

            return map[parseInt((map.length - 1) * Math.random())];
        }

        function textSum()
        {
            var maxLength = $sum.attr("data-maxlength");
            var val = $input.val();
            var lastLength = maxLength - getLength(val, maxLength);
            $sum.text(lastLength);

            if (lastLength <= 0)
            {
                $("#wb_publisher,#wb_publishie6").hide();
                $error.text(fullString);
            }
            else
            {
                $("#wb_publisher,#wb_publishie6").show();
                $error.text('');
            }

            return lastLength;
        }
    });

})(jQuery, FLNS.register("Fanli.Weibo"));
//jQuery(function () { Fanli.Weibo.buildDom().bindBehavior(); });