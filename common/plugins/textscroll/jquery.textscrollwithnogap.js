/*
    DOM:

    <div id="J_sng" class="scroll_inner clearfix">
        <ul class="clearfix">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
        </ul>
    </div>

    CSS: 
        .scroll_inner {position:relative; width: 160px; overflow: hidden; }
        .scroll_inner ul { position:absolute; left: 0; top: 0; width: 2000px;}
        .scroll_inner li { float: left; width: 40px; border: 1px solid #f60; list-style-type: none; }

    CALL: $("#J_sng").textScrollWithNoGap();

*/

; (function ($)
{
    $.fn.textScrollWithNoGap = function (options)
    {
        var settings = $.extend(true, {}, {
            step: 1,
            interval: 50
        }, options);

        return this.each(function ()
        {
            var $this = $(this);
            var visualWidth = $this.width();
            var $ul = $this.children().eq(0);
            var $ulclone;
            var w = 0;
            var h = 0;
            var intervalId;

            //$this.css("height", $ul.outerHeight() + "px");
            $ul.children().each(function (idx, el)
            {
                w += $(el).outerWidth();
                h += $(el).outerHeight();
            });

            if (w < visualWidth)
            {
                return;
            }

            $ul.width(w);
            $ulclone = $ul.clone().css("left", w + "px");
            $this.append($ulclone);

            function start()
            {
                intervalId = setInterval(function ()
                {
                    $ul.css({ left: parseInt($ul.css("left")) - settings.step + "px" });
                    $ulclone.css({ left: parseInt( $ulclone.css("left")) - settings.step + "px" });

                    if (parseInt($ul.css("left")) + w <= 0)
                    {
                        $ul.css("left", "{0}px".format(parseInt($ulclone.css("left")) + w));
                    }
       
                    if (parseInt($ulclone.css("left")) + w <= 0)
                    {
                        $ulclone.css("left", "{0}px".format(parseInt($ul.css("left")) + w));
                    }
                }, settings.interval);
            }

            function stop()
            {
                clearInterval(intervalId);
            }

            $this.hover(stop, start);
            start();
        });
    };
}(jQuery));