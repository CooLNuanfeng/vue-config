/*
 * jScratchcard jQuery plugin - Rel. 0.0
 *
 * Copyright (c) 2010 Giovanni Casassa (senamion.com - senamion.it)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://www.senamion.com
 *
 */


(function ($)
{
    var methods = {
        init: function (options)
        {
            var o = {
                opacity: 0.2,
                color: '#666666',
                stepx: 10,
                stepy: 10,
                fillImg: "",
                mousedown: true,
                beginMove: $.noop,
                supportIrisMode: false,
                overCompleted: $.noop,
                callCallbackPerc: false,
                callbackFunction: null
            };

            return this.each(function (i)
            {
                var el = $(this);
                var h = el.height();
                var w = el.width();
                var position = el.position();
                var x = position.left;
                var y = position.top;
                var uuid = (el.attr('name') || el.attr('id') || el.attr('class') || 'internalName') + '__sc';
                var spritex = spritey = 0;
                var hasTriggeredCB = 0;

                if (options)
                    $.extend(o, options);

                var remainder = (w / o.stepx) * (h / o.stepy);
                var limitRem = remainder * o.callCallbackPerc / 100;

                over = "";
                for (i = 0; i < w; i += o.stepx)
                {
                    for (j = 0; j < h; j += o.stepy)
                    {
                        over += "<div class='" + uuid +
                                "' style='height:" + o.stepy +
                                "px; width:" + o.stepx +
                                "px; position: absolute; z-index:99;border: 0;overflow: hidden;top:" + (y + j) + "px; left:" + (x + i) + "px; background:";
                        if (o.fillImg)
                        {
                            over += ' transparent url(' + o.fillImg + ') -' + spritex + 'px -' + spritey + 'px no-repeat;';
                            spritey += o.stepy;
                        }
                        else
                        {
                            over += o.color + ';';
                        }

                        over += "'/>";
                    }

                    if (o.fillImg)
                    {
                        spritey = 0;
                        spritex += o.stepx;
                    }
                }
                el.after(over);
                setTimeout(function () { o.overCompleted.call(el); }, 250);
                $('.' + uuid)
                    .mouseover(function ()
                    {
                        o.beginMove.call();
                        if (o.mousedown == false || el.data('okMouse'))
                        {
                            op = $(this).css('opacity') - o.opacity;

                            if (o.callCallbackPerc != false && (remainder-- < limitRem))
                            {
                                $("." + uuid).remove();
                                o.callbackFunction();
                            }
                            if (op <= 0)
                                $(this).remove();
                            else
                                $(this).css({ 'opacity': op });
                        }
                    });

                if (o.supportIrisMode)
                {
                    $('.' + uuid).mouseup(function ()
                    {
                        o.beginMove.call();
                        var $this = $(this);
                        var $allels = $('.' + uuid);
                        $allels.each(function (idx, el)
                        {
                            var $cel = $(el);
                            var t1 = parseFloat($this.css("top"));
                            var l1 = parseFloat($this.css("left"));
                            var t2 = parseFloat($cel.css("top"));
                            var l2 = parseFloat($cel.css("left"));

                            if (((t2 + o.stepy == t1 || t2 - o.stepy == t1) && l2 == l1) ||
                                ((l2 + o.stepx == l1 || l2 - o.stepx == l1) && t2 == t1))
                            {
                                $cel.animate({ opacity: 0 }, function ()
                                {
                                    $(this).remove();
                                    $this.remove();
                                    if (o.callCallbackPerc != false && (remainder-- < limitRem) && hasTriggeredCB == 0)
                                    {
                                        $("." + uuid).remove();
                                        o.callbackFunction();

                                        hasTriggeredCB = 1;
                                    }
                                });
                            }
                        });
                    });
                }
                if (o.mousedown)
                    $('.' + uuid)
                        .mousedown(function ()
                        {
                            el.data('okMouse', true);
                            return false;
                        })
                        .mouseup(function ()
                        {
                            el.data('okMouse', false);
                            return false;
                        });
            });
        }
    };

    $.fn.jScratchcard = function (method)
    {
        if (methods[method])
        {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method)
        {
            return methods.init.apply(this, arguments);
        } else
        {
            $.error('Method ' + method + ' does not exist on jQuery.jScratchcard');
        }
    };

})(jQuery);