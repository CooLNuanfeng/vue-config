/// <reference path="../core/fmu.js" />

/**
 * @file fmu.extend.js
 * @import core/fmu.js
 */
(function (FDO) {

    var publisher = {
        subscribers: {
            any: []
        },

        subscribe: function (fn, type) {
            type = type || "any";

            if (typeof this.subscribers[type] === "undefined") {
                this.subscribers[type] = [];
            }

            this.subscribers[type].push(fn);
        },

        unsubscribe: function (fn, type) {
            this.visitSubscribers("unsubscribe", fn, type);
        },

        publish: function (publication, type) {
            this.visitSubscribers("publish", publication, type);
        },

        visitSubscribers: function (action, arg, type) {
            var pubtype = type || "any";
            var subscribers = this.subscribers[pubtype] || [];
            var len = subscribers.length;

            for (var i = 0; i < len; ++i) {
                if (action == "publish") {
                    subscribers[i](arg);
                } else {
                    if (subscribers[i] === arg) {
                        subscribers.splice(i, 1);
                    }
                }
            }
        }
    };

    FDO.prop("makePublisher", function (o) {
        for (var i in publisher) {
            if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
                o[i] = publisher[i]
            }
        }

        o.subscribers = {
            any: []
        };
        return o;
    });

}(FMU.namespace("FMU.DP.Observer")));

FMU.namespace("FMU.UI").prop('Utility', (function () {
    var datRegs = ['yyyy', 'yy', 'mm', 'dd', 'd'];
    var days = [ '日', '一', '二', '三', '四', '五', '六' ];

    return {

        formatDate: function (format, date) {

            if (!format || !(date instanceof Date) || isNaN(date.getTime())) {
                return ret;
            }

            return format.replace(new RegExp(datRegs.join('|'), 'gi'), function (match) {

                var part = '';
                if (match === 'yyyy') {
                    part = '{0}'.format(date.getFullYear());
                }
                else if (match === 'yy') {
                    part = '{0}'.format(date.getFullYear()).slice(2, 4);
                }
                else if (match === 'mm') {
                    part = '{0}{1}'.format(date.getMonth() < 9 ? '0' : '', date.getMonth() + 1);
                }
                else if (match === 'dd') {
                    part = '{0}'.format(date.getDate());
                }
                else if (match === 'd') {
                    part = '{0}'.format(days[date.getDay()]);
                }

                return part;

            });

        },

        parseDate: function (format, string) {

            if (!format || !string) {
                return null;
            }

            var parts = {};
            var datInfo = {};
            var idx = 0;
            var len = datRegs.length;

            format.replace(new RegExp(datRegs.join('|'), 'gi'), function (match, offset) {

                for (idx = 0; idx < len; idx++) {
                    if (match === datRegs[idx]) {
                        parts[offset] = datRegs[idx];
                        break;
                    }
                }

                return match;

            });

            for (idx in parts) {
                if (parts[idx] === 'yyyy') {
                    datInfo.year = parseInt(string.slice(idx, idx + 4), 10);
                }
                else if (parts[idx] === 'yy') {
                    datInfo.year = parseInt('{0}'.format(refineDate(today).getFullYear()).slice(0, 2) + string.slice(idx, idx + 2), 10);
                }
                else if (parts[idx] === 'mm') {
                    datInfo.month = parseInt(string.slice(idx, idx + 2), 10) - 1;
                }
                else if (parts[idx] === 'dd') {
                    datInfo.date = parseInt(string.slice(idx, idx + 2), 10);
                }
            }

            return new Date(datInfo.year, datInfo.month, datInfo.date);

        }

    };

})());