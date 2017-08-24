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
        .scroll_inner { width: 160px; overflow: hidden; }
        .scroll_inner ul { width: 2000px;}
        .scroll_inner li { float: left; list-style-type: none; }

    CALL: $("#J_sng").textScroll({ "scrollType": "H", interval: 2000 });

*/

(function ($)
{
    var defaults =
        {
            scrollType: "V",
            animationTimer: 800,
            interval: 4000,
            once: 1
        };

    $.fn.textScroll = function (options)
    {
        var settings = $.extend(true, {}, defaults, options);
        var scrollType = settings.scrollType;
        var timer = settings.animationTimer;
        var VH = { V: verticalScroll, H: horizontalScroll };
        var $container;
        var intervalId;


        return this.each(function ()
        {
            $container = $(this);
            var $lis = $container.find("li");
            var totalWidth = 0;
            var totalHeight = 0;

            $lis.each(function ()
            {
                var $this = $(this);
                totalHeight += $this.outerHeight();
                totalWidth += $this.outerWidth();
            });

            if ((scrollType == "V" && totalHeight > $container.height())
                || (scrollType == "H" && totalWidth > $container.width()))
            {
                $container.hover(stop, start);
                start();
            }

        });

        function applyBehavior()
        {
            var firstUl = $container.find("ul:first");
            var firstLi = firstUl.find("li:lt({0})".format(settings.once));
            VH[scrollType](firstUl, firstLi);
        }

        function verticalScroll(fu, fi)
        {
            var height = -(fi.outerHeight(true)) + "px";
            fu.animate({ marginTop: height }, timer, function ()
            {
                $(this).css({ marginTop: "0px" }).find("li:lt({0})".format(settings.once)).appendTo(this);
            });
        }

        function horizontalScroll(fu, fi)
        {
            var width = -(fi.outerWidth(true)) + "px";
            fu.animate({ marginLeft: width }, timer, function ()
            {
                $(this).css({ marginLeft: "0px" }).find("li:first").appendTo(this);
            });
        }

        function start()
        {
            intervalId = setInterval(function () { applyBehavior(); }, settings.interval);
        }

        function stop()
        {
            clearInterval(intervalId);
        }
    };

    $.fn.textScroll.defaults = defaults;

})(jQuery);