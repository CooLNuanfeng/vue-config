/*
    move one ponint to another
    lei.zhang@fanli.com
*/
(function ($)
{
    $.fn.lookForLight = function (options)
    {
        var settings = $.extend(true, {}, {
            targetSelector: "",
            beforeMove: $.noop,
            running: $.noop,
            completed: $.noop,
            offset: { top: 1, left: 2 },
            interval: 10
        }, options);

        return this.each(function ()
        {
            var $this = $(this).css("position", "absolute");
            var $target = $(settings.targetSelector);
            var triggerOffset = $this.offset();
            var targetOffset = $target.offset();
            var intervalId;
            var count = 1;

            var distance = {
                top: targetOffset.top - triggerOffset.top,
                left: targetOffset.left - triggerOffset.top
            };

            $this.one("click", function ()
            {
                settings.beforeMove();
                $this.promise().done(clickHandler);
            });

            function clickHandler()
            {
                intervalId = setInterval(function ()
                {
                    if ($this.offset().left <= $target.offset().left)
                    {
                        clearInterval(intervalId);
                        settings.completed();
                    }

                    count++;

                    if (count == 10)
                    {
                        settings.running();
                    }

                    $this.offset({
                        top: $this.offset().top - settings.offset.top,
                        left: $this.offset().left - settings.offset.left
                    });
                }, settings.interval);
            }
        });
    };
}(jQuery));