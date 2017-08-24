FLNS.register("Fanli.Countdown").add("init", function (options) {
    /*
    应用于一个页面只有一个倒计时的情况
    <div id="J_main_cd_wrap" data-time="<?php echo strtotime('2015-11-11'); ?>,<?php echo strtotime('2015-11-11:23:59:59'); ?>" style="display:none;">
       距离活动<span class="J_cd_text"></span>还有<span class="J_cd_time"></span>
    </div>

    data-time="开始时间，结束时间"
    */

    /*
    "//common/plugins/countdown/js/jquery.countdown.min.js",
    "//common/plugins/countdown/js/jquery.countdown-zh-CN.js",
    */

    var settings = $.extend(true, {
        $wrap: $("#J_main_cd_wrap"),
        textSelector: ".J_cd_text",
        timeSelector: ".J_cd_time",
        startText: "开始",
        overText: "结束",
        layout: '{d<}<em>{dnn}</em>天{d>}<em>{hnn}</em>时<em>{mnn}</em>分<em>{snn}</em>秒',
        onEnd: $.noop
    }, options);

    var $wrap = settings.$wrap;
    var $text = $wrap.find(settings.textSelector);
    var $time = $wrap.find(settings.timeSelector);
    var onEnd = settings.onEnd;

    opbarGetInfo.done(function () {
        var timestamp = $('#topbar').data('timestamp');
        //var timestamp = 1394416790;
        bindCountDown(timestamp);
    });

    function bindCountdown(timestamp) {
        var time = $wrap.attr("data-time") ? $wrap.attr("data-time").split(",") : [0, 0];
        var starttime = time[0];
        var endtime = time[1];
        var layout = settings.layout;

        if (starttime > timestamp) {
            $text.text(settings.startText);

            $time.countdown({
                until: starttime - timestamp,
                format: 'dHMS',
                layout: layout,
                onExpiry: function () {
                    $text.text(settings.overText);
                    $time.countdown('option', 'until', endtime - starttime);
                    $time.countdown('option', layout);
                    $time.countdown('option', 'onExpiry', function () {
                        $wrap.hide();
                        onEnd();
                    });
                }
            });
        }
        else if (starttime <= timestamp && endtime >= timestamp) {
            $text.text(settings.overText);

            $time.countdown({
                until: endtime - timestamp,
                format: 'dHMS',
                layout: layout,
                onExpiry: function () {
                    $wrap.hide();
                    onEnd();
                }
            });
        }
        else {
            onEnd();
        }

        $wrap.fadeIn(200);
    }
});