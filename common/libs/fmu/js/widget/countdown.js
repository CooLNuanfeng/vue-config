///<reference path="../core/fmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../vendors/jquery/jquery.js" />

/**
 * @file cuntdown
 * @import vendors/jquery/jquery-2.1.1.js, core/fmu.js, core/widget.js
 */

FMU.UI.define("Countdown", {
    init: function () {
        this.$output = "";
        this.type = "all",  // all/day/hour/minute/second
        this.daySelector = ".J_day";
        this.hourSelector = ".J_hour";
        this.minuteSelector = ".J_minute";
        this.secondSelector = ".J_second";
        this.dhMerge = false;
        this.onExpiry = $.noop;
        this.showZeroDay = false;
        this.dayFillZero = false;
    },

    setup: function () {
        var $output = this.$output;
        this.remain = parseInt($output.data("remain"), 10);
        if (!$output || !this.remain || this.remain < 0) {
            return;
        }

        this.$day = $(this.daySelector, $output);
        this.$hour = $(this.hourSelector, $output);
        this.$minute = $(this.minuteSelector, $output);
        this.$second = $(this.secondSelector, $output);
        this.start();
    },

    start: function () {
        
        this.run();

        this.intervalId = setInterval(this.proxy(function () {
            this.run();
        }), 1 * 1000);
    },

    run: function(){
        if (this.remain < 0) {
            this.stop();
            return;
        }

        this.get();
        this.remain--;
    },

    pause: function () {
        clearInterval(this.intervalId);
    },

    stop: function () {
        this.pause();
        this.remain = -1;
        this.onExpiry();
    },

    reset: function () {
        this.pause();
        this.start();
    },

    get: function () {
        switch (this.type) {
            case "all":
                this.getAll();
                break;
            case "day":
                this.$day.html(this.getDay());
                break;
            case "hour":
                this.$hour.html(this.getHour());
                break;
            case "minute":
                this.$minute.html(this.getMinute());
                break;
            case "second":
                this.$second.html(this.getSecond());
                break;
            default:
                this.getAll();
                break;
        }
    },

    getAll: function () {
        var d = this.getDay();
        var h = this.getHour();
        var m = this.getMinute();
        var s = this.getSecond();

        if (!this.dhMerge) { 
            if (!this.showZeroDay && d == 0) { 
                this.$day.parent().remove(); 
            } else if (this.dayFillZero) { 
                this.$day.html(this.fillZero(d, 2)); 
            } else {
                this.$day.html(d);
            }

            this.$hour.html(h);
        } else { 
            this.$day.parent().remove(); 
            this.$hour.html(this.fillZero(parseInt(d) * 24 + parseInt(h), 2)); 
        }

        this.$minute.html(m);
        this.$second.html(s);
    },

    getDay: function () {
        var day = parseInt(this.remain / 86400, 10);
        return day !== 0 ? day : 0;
    },

    getHour: function () {
        var hour = parseInt((this.remain % 86400) / 3600, 10);
        if (this.type === "hour") {
            hour = parseInt(this.getDay() * 24 + (this.remain % 86400) / 3600, 10);
        }
        else {
            hour = this.fillZero(hour, 2);
        }
        return hour;
    },

    getMinute: function () {
        var minute = parseInt((this.remain % 3600) / 60, 10);
        if (this.type === "minute") {
            minute = parseInt(this.getDay() * 24 * 60 + this.getHour() * 60 + (this.remain % 3600) / 60, 10);
        }
        else {
            minute = this.fillZero(minute, 2);
        }

        return minute;
    },

    getSecond: function () {
        var second = this.remain % 60;
        if (this.type === "second") {
            second = this.getDay() * 24 * 60 * 60 +
                this.getHour() * 60 * 60 +
                this.getMinute() * 60 +
                this.remain % 60;
        }
        else {
            second = this.fillZero(second, 2);
        }
        return second;
    },

    fillZero: function (num, digit) {
        var str = '' + num;
        while (str.length < digit) {
            str = '0' + str;
        }
        return str;
    }
});