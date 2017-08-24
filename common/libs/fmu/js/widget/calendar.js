///<reference path="../core/fmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../vendors/jquery/jquery-2.1.1.js" />
///<reference path="../widget/togglepanel.js" />

/**
 * @file calendar
 * @import vendors/jquery/jquery-2.1.1.js, core/fmu.js, core/widget.js, widget/togglepanel.js
 */

FMU.UI.define("Calendar", (function () {

    var noop = $.noop; 

    var defaults = {

        "direct": 'up', 
        "dateFormat": 'mm/dd/yyyy', 
        "defaultDate": null, 
        "firstDay": 0, 
        "maxDate": null, 
        "minDate": null, 
        "titleText": '选择日期', 
        "defaultText": '', 
        "selectText": '', 
        "toastText": '', 
        "toast": false, 
        "monthRange": 12, 
        "onBeforeShow": noop, 
        "onShow": noop, 
        "onSelect": noop, 
        "onClose": noop 

    };

    var zeros = [ '', '0', '00', '000', '0000' ];

    var template = {

        calendarHeader: (new StringBuilder)
                            .append('<div class="fmu-cld-header J_cld_header">')
                                .append('<span class="fmu-header-icon J_fmu_cld_back"><i class="fmu-icon-back J_fmu_cld_back"></i></span>')
                                .append('<h1 class="fmu-header-title"><% titleContent %></h1>')
                            .append('</div>').toString(), 

        calendarBody: (new StringBuilder)
                        .append('<div class="fmu-cld-body J_cld_body">')
                            .append('<div class="fmu-cld-week J_cld_week">')
                                .append('<% weekContent %>')
                            .append('</div>')
                            .append('<section class="fmu-cld-unit J_cld_unit">')
                                .append('<% unitContent %>')
                            .append('</section>')
                        .append('</div>').toString(),

        calendarToast: (new StringBuilder)
                        .append('<div class="fmu-cld-toast J_cld_toast">')
                            .append('<% toastContent %>')
                        .append('</div>').toString(), 

        calendarTip: (new StringBuilder)
                        .append('<i><% tipContent %></i>').toString()

    }; 

    var TITLECONTENT = '<% titleContent %>';
    var WEEKCONTENT = '<% weekContent %>';
    var UNITCONTENT = '<% unitContent %>';
    var TOASTCONTENT = '<% toastContent %>';
    var TIPCONTENT = '<% tipContent %>';

    var cldItemDisableCls = 'fmu-cld-item-disable'; 
    var cldItemActiveCls = 'fmu-cld-item-active';
    var cldItemHastipCls = 'fmu-cld-hastip'; 
    var cldTodyCls = 'J_fmu_cld_today'; 

    var cldMainSlt = '.J_fmu_cld_main'; 
    var cldItemSlt = '.J_fmu_cld_item'; 
    var cldBackSlt = '.J_fmu_cld_back'; 
    var cldBodySlt = '.J_cld_body'; 
    var cldUnitSlt = '.J_cld_unit'; 
    var cldWeekSlt = '.J_cld_week'; 
    var cldHeadSlt = '.J_cld_header';
    var cldToastSlt = '.J_cld_toast'; 

    var today = refineDate(new Date); 

    var maxDayCnt = 9999; 
    var admission = {};

    var slice = Array.prototype.slice; 
    var pop = Array.prototype.pop; 

    var seed = 0; 

    function setup (options) {

        options = $.extend(true, {}, options, { "calendar": this });
        shiftMethod(renderCalendar, [ options ])();
        shiftMethod(bindEvents, [ options ])();

    }

    function renderCalendar () {

        var args = slice.call(arguments); 
        var opts = pop.call(args); 
        var calendar = opts.calendar; 
        var $container = calendar.getContainer(); 
        var $main = $container.find(cldMainSlt); 
        var $toast = $container.find(cldToastSlt); 

        $main.empty();
        $toast.remove();
        renderHeader(opts);
        renderBody(opts);
        if (opts.toast) {
            renderToast(opts);
        }

    }

    function renderBody (opts) {

        var range = opts.monthRange; 
        var calendar = opts.calendar;
        var $container = calendar.getContainer().find(cldMainSlt); 
        var wContent = (function () {

            var i = 0; 
            var days = opts.days;
            var len = days.length; 
            var ct = new StringBuilder();
            ct.append('<ul>'); 
            for (; i < len; i++) {
                ct.append('<li class="{0}">{1}</li>'.format(days[i] === '六' || days[i] === '日' ? 'fmu-cld-week-end' : '', days[i]));
            }
            ct.append('</ul>');
            return ct.toString(); 

        })(); 
        var dContent = (function () {

            var firstDay = opts.firstDay;
            var lastDay = opts.lastDay; 
            var curDate = new Date(today.getFullYear(), today.getMonth(), 1); 
            var cMonth = curDate.getMonth(); 
            var selDate = opts.selDate; 
            var days = opts.days; 
            var start = 0; 
            var end = 0; 
            var i = 0; 
            var j = 0; 
            var len = 0; 
            var ct = new StringBuilder(); 
            var minTime = opts.minDate.getTime(); 
            var maxTime = opts.maxDate.getTime(); 
            var tip = template.calendarTip; 
            var defaultText = opts.defaultText; 

            for (; i < range; i++) {
                start = (curDate.getDay() + days.length - firstDay) % days.length; 
                ct.append('<h2 class="fmu-cld-month">{0}年{1}月</h2>'.format(curDate.getFullYear(), curDate.getMonth() + 1));
                ct.append('<ul class="fmu-cld-daybox">');
                for (j = 0, len = start; j < start; j++) {
                    ct.append('<li class="fmu-cld-item">&nbsp;</li>'); 
                    end = ++end % days.length; 
                }
                for (j = start, len = days.length; j < len; j++) {
                    ct.append('<li id="J_fmu_cld{0}_item{1}" class="fmu-cld-item {2} {3} {4} J_fmu_cld_item" data-year="{5}" data-month="{6}" data-date="{7}" data-day="{8}" data-dtime="{9}"><em>{10}</em></li>'.format(
                                                calendar.seed, 
                                                curDate.getTime(), 
                                                curDate.getTime() < minTime || curDate.getTime() > maxTime ? 'fmu-cld-item-disable' : '', 
                                                curDate.getTime() === selDate.getTime() && curDate.getTime() >= minTime && curDate.getTime() <= maxTime ? 'fmu-cld-item-active' : '', 
                                                curDate.getDay() === 6 || curDate.getDay() === 0 ? 'fmu-cld-week-end' : '', 
                                                curDate.getFullYear(), 
                                                curDate.getMonth() + 1, 
                                                curDate.getDate(), 
                                                curDate.getDay(), 
                                                curDate.getTime(), 
                                                curDate.getDate()));

                    curDate.setDate(curDate.getDate() + 1);
                    end = ++end % days.length; 
                }

                while (curDate.getMonth() == cMonth) {
                    ct.append('<li id="J_fmu_cld{0}_item{1}" class="fmu-cld-item {2} {3} {4} {5} {6} J_fmu_cld_item" data-year="{7}" data-month="{8}" data-date="{9}" data-day="{10}" data-dtime="{11}"><em>{12}</em>{13}</li>'.format(
                                                calendar.seed, 
                                                curDate.getTime(), 
                                                curDate.getTime() < minTime || curDate.getTime() > maxTime ? 'fmu-cld-item-disable' : '', 
                                                curDate.getTime() === selDate.getTime() && curDate.getTime() >= minTime && curDate.getTime() <= maxTime ? 'fmu-cld-item-active' : '', 
                                                curDate.getTime() === selDate.getTime() && defaultText ? 'fmu-cld-hastip' : '', 
                                                curDate.getDay() === 6 || curDate.getDay() === 0 ? 'fmu-cld-week-end' : '', 
                                                curDate.getTime() === selDate.getTime() ? 'J_fmu_cld_today' : '', 
                                                curDate.getFullYear(), 
                                                curDate.getMonth() + 1, 
                                                curDate.getDate(), 
                                                curDate.getDay(), 
                                                curDate.getTime(),
                                                curDate.getDate(),
                                                curDate.getTime() === selDate.getTime() && defaultText ? tip.replace('{0}'.format(TIPCONTENT), defaultText) : ''));

                    curDate.setDate(curDate.getDate() + 1);
                    end = ++end % days.length; 
                }

                cMonth = curDate.getMonth(); 

                // if there's date cells which has't been rendered 
                if (end) {
                    for (j = end; j < days.length; j++) {
                        ct.append('<li class="fmu-cld-item">&nbsp;</li>'); 
                    }
                }

                ct.append('</ul>');
                end = 0; 
            }

            return ct.toString(); 

        })(); 
        var html = template.calendarBody.replace('{0}'.format(WEEKCONTENT), wContent)
                                        .replace('{0}'.format(UNITCONTENT), dContent); 

        $container.append($(html)); 

        var $unit = $(cldUnitSlt); 
        var ch = document.documentElement.clientHeight;
        var hh = $(cldHeadSlt).outerHeight(); 
        var wh = $(cldWeekSlt).outerHeight(); 
        var top = parseInt($unit.css('paddingTop'), 10); 
        var bottom = parseInt($unit.css('paddingBottom'), 10);

        $unit.height(document.documentElement.clientHeight - (top + hh + wh + bottom));

        calendar._kernels('curDate', 0, admission); 

    }

    function renderHeader (opts) {

        var calendar = opts.calendar; 
        var $container = calendar.getContainer().find(cldMainSlt);
        var content = opts.titleText;
        var html = template.calendarHeader.replace('{0}'.format(TITLECONTENT), content);
        $container.append($(html));

    }

    function renderToast (opts) {

        var calendar = opts.calendar; 
        var $container = calendar.getContainer(); 
        var content = opts.toastText;
        var html = template.calendarToast.replace('{0}'.format(TOASTCONTENT), content);
        $container.append($(html)); 

    }

    function bindEvents () {

        var args = slice.call(arguments);
        var opts = pop.call(args);
        var calendar = opts.calendar;
        var $container = calendar.getContainer(); 

        $container.on('click.fmu.cld.back', cldBackSlt, shiftHandler(close, getEventArgs.bind(calendar)));
        $container.on('click.fmu.cld.item', cldItemSlt, shiftHandler(select, getEventArgs.bind(calendar)));

    }

    function show () {

        var args = slice.call(arguments);
        var opts = pop.call(args);
        var calendar = opts.calendar; 
        var selDate = opts.selDate; 
        var $container = calendar.getContainer(); 
        var funcBefore = opts.onBeforeShow; 
        var func = opts.onShow; 
        var tpi = calendar._getTogglePanel(admission); 

        if ($.isFunction(funcBefore)) {
            funcBefore.apply(calendar, [ selDate, $container, calendar ]); 
        }

        $container.find(cldToastSlt).show(); 
        tpi.activate(); 

        if ($.isFunction(func)) {
            func.apply(calendar, [ selDate, $container, calendar ]); 
        }

    }

    function select () {

        var args = slice.call(arguments);
        var opts = pop.call(args);
        var calendar = opts.calendar; 
        var minDate = opts.minDate; 
        var maxDate = opts.maxDate; 
        var curDate = opts.curDate; 
        var $item = $(this); 
        var year = parseInt($item.data('year'), 10); 
        var month = parseInt($item.data('month'), 10); 
        var date = parseInt($item.data('date'), 10); 
        var time = parseInt($item.data('dtime'), 10);
        var $container = calendar.getContainer(); 
        var func = opts.onSelect;
        var selectText = opts.selectText;
        var defaultText = opts.defaultText; 

        if ($item.hasClass(cldItemDisableCls)) {
            return; 
        }

        $container.find('.{0}'.format(cldItemHastipCls))
                  .removeClass(cldItemHastipCls)
                  .removeClass(cldItemActiveCls)
                  .each(function () {

                        var $tip = $(this);
                        $tip.hasClass(cldTodyCls)
                            ? $tip.addClass(cldItemHastipCls) 
                            : $tip.find('i').remove(); 

                  });

        if (!$item.hasClass(cldTodyCls)) {
            $('.{0}'.format(cldTodyCls)).find('i').html(defaultText);
        }

        if (time < minDate.getTime() || time > maxDate.getTime()) {
            return; 
        }
        curDate = new Date(year, month - 1, date); 
        calendar._kernels('curDate', curDate, admission); 
        calendar._kernels('selDate', refineDate(curDate), admission); 

        $item.addClass(cldItemActiveCls); 
        if (selectText) {
            $item.hasClass(cldItemHastipCls) 
                ? $item.find('i').html(selectText) 
                : $item.addClass(cldItemHastipCls)
                       .append($('<i>{0}</i>'.format(selectText))); 
        }

        if ($.isFunction(func)) {
            func.apply(calendar, [ curDate, $item, calendar ]); 
        }

        calendar.hide(); 

    }

    function close () {

        var args = slice.call(arguments);
        var opts = pop.call(args);
        var selDate = opts.selDate; 
        var calendar = opts.calendar; 
        var $container = calendar.getContainer(); 
        var func = opts.onClose; 
        var tpi = calendar._getTogglePanel(admission); 

        if ($.isFunction(func)) {
           func.apply(calendar, [ selDate, $container, calendar ]);
        }

        tpi.deactivate(); 
        $container.find(cldToastSlt).hide(); 

    }

    function getEventArgs () {

        var calendar = this; 
        return $.extend(true, {}, calendar.options(), calendar._kernels(admission), { "calendar": calendar });

    }

    function shiftHandler (func, opts) {

        return function () {

            var ret = $.isFunction(opts) ? opts() : opts;

            shiftMethod(func, [ ret ], this)();

        };

    }

    function shiftMethod (func, args, ctx) {

        if (!$.isFunction(func)) {
            return func; 
        }

        var concat = Array.prototype.concat;

        args = $.isArray(args) ? args : []; 

        return function () {

            func.apply(ctx || this, concat.call(arguments, args));

        };

    }

    function shift (obj, key, vals) {

        var args = Array.prototype.slice.call(arguments);
        var key = args[1]; 
        var vals = args[2]; 
        var slice = Array.prototype.slice; 

        if (typeof key === 'object'){
            vals = key;
            key = null;
        }

        if (key == null && vals == null) {
            return $.extend(true, {}, obj);
        }

        if (vals == undefined && typeof key === 'string') {
            if (typeof obj[key] !== 'object') {
                return obj[key];
            }
            else {
                if ($.isFunction(obj[key])) {
                    return function () {

                        var ctx = this;
                        return obj[key].apply(ctx, slice.call(arguments));

                    };
                }
                else if ($.isArray(obj[key])) {
                    return [].concat(slice.call(obj[key]));
                }
                else if (obj[key] instanceof Date) {
                    return refineDate(obj[key]);
                }
                else if (obj[key] instanceof RegExp) {
                    return new RegExp(obj[key].source, '{0}{1}{3}'.format(obj[key].global ? 'g' : '', 
                                                                          obj[key].ignoreCase ? 'i' : '', 
                                                                          obj[key].multiline ? 'm' : ''));
                }
                else {
                    return $.extend(true, {}, obj[key]);
                }
            }
        }
        else {
            if (typeof key === 'string') {
                obj[key] = vals;
            }
            else {
                $.extend(true, obj, vals);
            }
        }

        return obj; 

    }

    function addDay (day, offset) {

        offset = isNaN(offset) ? 0 : parseInt(offset, 10); 

        var time = day.getTime(); 

        return new Date(time + offset * 1000 * 60 * 60 * 24);

    }

    function shiftZero (num, size) {

        var len = 0;

        num = num + ''; 
        size = isNaN(size) ? 2 : parseInt(size, 10);

        len = Math.max(size - num.length, len); 

        return len ? zeros[len] + num : num; 

    }

    function refineDate (date) {

        return new Date(date.getFullYear(), date.getMonth(), date.getDate());

    }

    return (function () {

        var caches = {};

        var calendar = {

            init: function (container, options) {

                var days = [ '日', '一', '二', '三', '四', '五', '六' ]; 
                var kernel = { 

                    curDate: refineDate(today),
                    selDate: refineDate(today), 
                    days: days.slice(), 
                    firstDay: 0, 
                    lastDay: 6 

                }; 

                if (this.seed && this._getArgument('inited', admission)) {
                    return this; 
                }

                var $elem = (function () {

                            var $el;

                            if (container && (typeof container === 'string' || container.nodeType)) {
                                $el = $(typeof container === 'string' ? '#{0}'.format(container) : container); 
                            }
                            else if (container instanceof $) {
                                $el = container; 
                            }
                            else {
                                options = container; 
                                $el = $('<div></div>').appendTo('body');
                            }

                            $el.addClass('fmu-cld')
                               .empty()
                               .append('<div class="fmu-cld-main J_fmu_cld_main"></div>')
                               .appendTo('body'); 

                            return $el;

                })(); 

                var settings = $.extend(true, {}, defaults, (function () {

                    var opts = {}; 
                    var attrs = $elem[0].attributes; 
                    var pro; 
                    var val; 

                    for (var attr in attrs) {
                        if (attrs.hasOwnProperty(attr) && attr !== 'length') {
                            pro = attrs[attr]; 
                            if (pro.name.indexOf('data-') > -1) {
                                for (var att in defaults) {
                                    if ((new RegExp('^{0}$'.format(att), 'i')).test(pro.name.replace('data-', ''))) {
                                        attr = att; 
                                        break; 
                                    }
                                }
                                val = pro.value; 
                                opts[attr] = isNaN(Math.max(0, val)) ? val : Math.max(0, val); 
                                if (opts[attr] === 'false' || opts[attr] === '') {
                                    opts[attr] = false; 
                                }
                            }
                        }
                    }

                    return opts;

                })(), (options = options || {})); 

                if (!$elem.length) {
                    return this; 
                }

                this.seed = seed;
                $elem.prop('id') || $elem.prop('id', 'J_fmu_cld{0}{1}'.format(seed, today.getTime())); 

                var tpi = new FMU.UI.TogglePanel(); 

                caches[seed] = {

                    "settings": settings, 
                    "kernel": kernel, 
                    "days": days, 
                    "tpi": tpi, 
                    "$elem": $elem 

                }; 

                this._applyConfig(admission); 

                setup.call(this, $.extend(true, {}, settings, kernel, { "$container": $elem })); 

                $elem.data('calendar', this); 

                caches[seed].inited = true; 
                seed++;

            },

            getContainer: function () {

                var seed = this.seed;
                return caches[seed].$elem;

            }, 

            options: function (key, vals) {

                var specialList = [];
                var settings = this._getArgument('settings', admission); 
                var ret = shift(settings, key, vals);
                if (vals != null || (vals == null && typeof key == 'object')) {
                    if ((key === 'direct' || (vals && 'direct' in vals)) && inited) {
                        specialList.push('direct');
                    }
                    this._applyConfig(specialList, admission); 
                    return this; 
                }

                return ret; 

            }, 

            getDate: function () {

                var kernel = this._getArgument('kernel', admission); 
                return shift(kernel, 'curDate'); 

            }, 

            setDate: function (date) {

                var curDate; 
                var settings = this._getArgument('settings', admission); 
                var kernel = this._getArgument('kernel', admission); 

                if (typeof date === 'string') {
                    curDate = this.parseDate(date); 
                }
                else if (typeof date === 'number') {
                    curDate = new Date(date); 
                }
                else if (date instanceof Date && !isNaN(date.getTime())) {
                    curDate = date; 
                }

                if (!curDate || curDate < settings.minDate || curDate > settings.maxDate) {
                    return this; 
                }

                shift(kernel, 'curDate', curDate); 

                var $item = $('#J_fmu_cld{0}_item{1}'.format(this.seed, curDate.getTime())); 
                $item.trigger('click.fmu.cld.item'); 

                return this; 

            }, 

            clear: function () {

                var seed = this.seed; 
                caches[seed].inited = false; 
                this._applyConfig($.extend(true, {}, defaults), admission).refresh(); 
                caches[seed].inited = true; 

                return this; 

            }, 

            show: function () {

                var settings = this._getArgument('settings', admission); 
                var kernel = this._getArgument('kernel', admission); 
                shiftMethod(show, [ $.extend(true, {}, settings, kernel, { "calendar": this }) ])();

                return this; 

            }, 

            hide: function () {

                var settings = this._getArgument('settings', admission); 
                var kernel = this._getArgument('kernel', admission); 
                shiftMethod(close, [ $.extend(true, {}, settings, kernel, { "calendar": this }) ])();

                return this; 

            }, 

            refresh: function () {

                var settings = this._getArgument('settings', admission); 
                var kernel = this._getArgument('kernel', admission); 
                var options = $.extend(true, {}, settings, kernel, { "calendar": this }); 
                shiftMethod(renderCalendar, [ options ])(); 

                return this; 

            }, 

            formatDate: function () {

                var settings = this._getArgument('settings', admission); 
                return FMU.UI.Utility.formatDate.apply(null, [ settings.dateFormat ].concat(slice.call(arguments)));

            }, 

            parseDate: function () {

                var settings = this._getArgument('settings', admission);  
                return FMU.UI.Utility.parseDate.apply(null, [ settings.dateFormat ].concat(slice.call(arguments)));

            },

            _kernels: function (key, vals) {

                var kernel = this._getArgument('kernel', admission); 
                var args = slice.call(arguments);
                return shift.apply(null, [kernel].concat(args)); 

            }, 

            _applyConfig: function () {

                var settings = this._getArgument('settings', admission); 
                var kernel = this._getArgument('kernel', admission); 
                var days = this._getArgument('days', admission); 
                var inited = this._getArgument('inited', admission); 
                var $elem = this._getArgument('$elem', admission); 
                var tpi = this._getArgument('tpi', admission); 
                var args = slice.call(arguments);
                var specialList = $.isArray(args[0]) ? args[0] : []; 

                /** defaultDate **/
                // check typeof defaultDate, String, Number and Date can work e.g.('+7', -19, new Date) 
                // and set kernel.curDate as today by default. 
                settings.defaultDate || (settings.defaultDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())); 
                if (typeof settings.defaultDate === 'string') {
                    if (!isNaN(parseInt(settings.defaultDate, 10))) { 
                        settings.defaultDate = parseInt(settings.defaultDate, 10); 
                        kernel.selDate = settings.defaultDate > maxDayCnt
                                            ? refineDate(new Date(settings.defaultDate)) 
                                            : addDay(kernel.curDate, settings.defaultDate);
                    }
                    else {
                        kernel.selDate = new Date(settings.defaultDate);
                        if (isNaN(kernel.selDate)){
                            kernel.selDate = new Date(today.getTime());
                        }
                        else {
                            kernel.selDate = refineDate(kernel.selDate);
                        }
                    }
                }
                else if (typeof settings.defaultDate === 'number') {
                    kernel.selDate = settings.defaultDate > maxDayCnt
                                            ? refineDate(new Date(settings.defaultDate)) 
                                            : addDay(kernel.curDate, settings.defaultDate); 
                }
                else if (settings.defaultDate instanceof Date && !isNaN(settings.defaultDate)) {
                    kernel.selDate = refineDate(settings.defaultDate);
                }

                /** firstDay **/
                settings.firstDay = Math.abs(settings.firstDay % 7); 

                kernel.firstDay = settings.firstDay; 
                kernel.days = days.slice(Math.min(settings.firstDay, days.length), days.length).concat(days.slice(0, settings.firstDay)); 
                kernel.lastDay = (kernel.lastDay + settings.firstDay) % kernel.days.length; 

                /** minDate **/
                settings.minDate = settings.minDate && settings.minDate instanceof Date && !isNaN(settings.minDate)
                                    ? refineDate(settings.minDate) 
                                    : settings.minDate === +settings.minDate 
                                        ? new Date(settings.minDate) 
                                        : refineDate(kernel.selDate); 

                /** maxDate **/
                settings.maxDate = settings.maxDate && settings.maxDate instanceof Date && !isNaN(settings.maxDate)
                                    ? refineDate(settings.maxDate) 
                                    : settings.maxDate === +settings.maxDate 
                                        ? new Date(settings.maxDate) 
                                        : refineDate(kernel.selDate); 

                /** monthRange **/
                settings.monthRange = settings.monthRange === +settings.monthRange ? Math.max(settings.monthRange, 1) : defaults.monthRange; 

                /** direct **/
                if (!inited || (specialList.length && specialList.indexOf('direct') !== -1)) {
                    if (this.inited) {
                        this.hide(); 
                    }
                    tpi.direction = settings.direct;
                    tpi.mask = true; 
                    tpi.$toggleEle = $elem.find(cldMainSlt);
                    tpi.setup();
                }

                return this; 

            }, 

            _getTogglePanel: function () {

                return this._getArgument('tpi', admission); 

            }, 

            _getArgument: function (name) {

                if (!name) {
                    return;
                }

                var seed = this.seed;

                return caches[seed][name];

            }

        };

        for (var key in calendar) {
            if (calendar.hasOwnProperty(key) && (/^_/).test(key)) {
                calendar[key] = (function (method) {

                    return function () {

                        var args = slice.call(arguments);
                        var ticket = pop.call(args);

                        if (ticket !== admission) {
                            return this; 
                        }

                        return method.apply(this, args);

                    };

                })(calendar[key]);
            }
        }

        return calendar; 

    })();

})());