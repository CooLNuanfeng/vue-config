/**
* Zepto countdown plugin v0.1 + Fanli
* 
* HTML:
    <div id="J_countdown" data-remain="3660" style="display: none;">
        <span><span class="J_day"></span>天</span>
        <span><span class="J_hour"></span>时</span>
        <span><span class="J_minute"></span>分</span>
        <span><span class="J_second"></span>秒</span>
    </div>

* JS:
$("#J_countdown").countdown({
    type: "all"
});
**/

(function ($) {
    $.fn.countdown = function (config) {
        return this.each(function () {
            Countdown(this, config);
        });
    };

    function Countdown(elem, config) {
        var settings = {
            output: ".J_countdown",
            // 倒计时类型
            // 默认为all - 正常的按秒计数
            // 覆盖为minute - 按分计数，此时DOM不应该写J_second元素
            type: "all", //all, minute,
            // 显示类型，
            // 默认是all - 呈现为 1天01时01分01秒，
            // 覆盖为excludeday - 呈现为25时01分01秒，不显示天。此时DOM不应该写J_day元素
            showType: "all", // all, excludeday
            day: ".J_day",
            hour: ".J_hour",
            minute: ".J_minute",
            second: ".J_second",
            onExpiry: function () { },
            onDayExpiry: function () { },
            onHourExpiry: function () { },
            onMinuteExpiry: function () { },
            onSecondExpiry: function () { },
            openFlex: false //开启day, hour, minute, second过期事件，默认为false
        };

        if (!(this instanceof Countdown)) {
            return new Countdown(elem, config);
        }

        this.config = $.extend(settings, config);
        this.$elem = $(elem);
        this.init();
    }

    $.extend(Countdown.prototype, {
        init: function () {
            var $output = this.$elem;
            var remain = parseInt($output.data("remain"), 10);
            var that = this;
            var config = this.config;
            var intervalPeriod = 1000;

            if ($output.size() === 0 || !remain) {
                return;
            }

            this.type = config.type;
            this.showType = config.showType;
            this.$day = $(config.day, $output);
            this.$hour = $(config.hour, $output);
            this.$minute = $(config.minute, $output);
            this.$second = $(config.second, $output);

            if (this.type == "minute") {
                intervalPeriod = 60 * intervalPeriod;
            } 

            this.remain = remain;
            this._buildDom();

            this.interval = window.setInterval(function () {
                that.start();
            }, intervalPeriod);

        },

        _buildDom: function () {
            this.get();
            this.$elem.show();

            if (this.type == "minute") {
                this.remain -= 60;
            } else {
                this.remain--;
            }
        },

        start: function () {
            if (this.remain < 0) {
                this.stop();
                return;
            }

            this.get();

            if (this.type == "minute") {
                this.remain -= 60;
            } else {
                this.remain--;
            }
        },

        pause: function () {
            if (this.interval) {
                clearInterval(this.interval);
            }
        },

        stop: function () {
            this.pause();
            this.remain = -1;
            this.$elem.remove();
            this.config.onExpiry();
        },

        get: function () {
            var d = this.getDay();
            var h = this.getHour();
            var m = this.getMinute();
            var s = this.getSecond();

            if (this.config.openFlex) {
                if (d == 0) {
                    this.config.onDayExpiry();
                }

                if ($(this.config.day, this.$elem).length > 0) {
                    this.$day.html(d);
                }

                if (h == 0) {
                    this.config.onHourExpiry();
                }

                if ($(this.config.hour, this.$elem).length > 0) {
                    this.$hour.html(h);
                }

                if (m == 0) {
                    this.config.onMinuteExpiry();
                }

                if ($(this.config.minute, this.$elem).length > 0) {
                    this.$minute.html(m);
                }

                if (s == 0) {
                    this.config.onSecondExpiry();
                }

                if ($(this.config.second, this.$elem).length > 0) {
                    this.$second.html(s);
                }

            } else {
                this.$day.html(d);
                this.$hour.html(h);
                this.$minute.html(m);
                this.$second.html(s);
            }
        },

        getDay: function () {
            var day = parseInt(this.remain / 86400, 10);
            return day !== 0 ? day : 0;
        },

        getHour: function () {
            var hour = parseInt((this.showType == "excludeday" ? this.remain : (this.remain % 86400)) / 3600, 10);
            hour = this.fillZero(hour, 2);

            return hour;
        },

        getMinute: function () {
            var minute = parseInt((this.remain % 3600) / 60, 10);
            minute = this.fillZero(minute, 2);

            return minute;
        },

        getSecond: function () {
            var second = this.remain % 60;
            second = this.fillZero(second, 2);

            return second;
        },

        fillZero: function (num, digit) {
            var str = "" + num;
            while (str.length < digit) {
                str = "0" + str;
            }
            return str;
        }
    });
})(Zepto);