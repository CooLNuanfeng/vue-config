/**
 * jQuery simple overlay guide plugin v0.1
 * chao.ming@fanli.com
 * 
**/

/**
HTML
<div id="J-guide-tips" class="tips-box" style="display:none;">
	<a class="close-btn J-close-btn" href="javascript:void(0);">close</a>
</div>
**/

; (function ($)
{
    $.fn.overlayGuide = function (settings)
    {
        settings = $.extend({
            onBeforeLoad: $.noop,
            onLoad: $.noop,
            onClose: $.noop,
            zIndex: 9999,
            triggerEvents: "click",
            tipsSelector: "",
            triggerSelector: "",
            closeBtnSelector: ".J-close-btn",
            maskId: "J-guid-mask-box",
            opacity: 0.8,
            offset: [0, 0],
            autoplay: false,
            backTo: false
        }, settings);

        return this.each(function ()
        {
            var $this = $(this);
            var $window = $(window);
            var $document = $(document);

            function setup()
            {
                settings.onBeforeLoad();
                buildTips();
                backTo();
                expose();
                settings.onLoad();
            }

            function bindBaseEvents()
            {
                bindClose();
            }

            function expose()
            {
                var $expose;

                if ($("#{0}".format(settings.maskId)).length == 0)
                {
                    $expose = $('<div id="{0}" style="position:absolute; top:0; left:0; z-index:{1}; width:100%; height:{2}px; background:#000; filter:alpha(opacity={3}); opacity:{4};"></div>'.format(settings.maskId, settings.zIndex - 1, $document.height(), settings.opacity * 100, settings.opacity)).fadeIn("fast").appendTo("body");
                } else
                {
                    $expose = $("#{0}".format(settings.maskId)).fadeIn("fast");
                }

                $window.on("scroll resize", function ()
                {
                    $expose.css({ "height": Math.max($document.height(), $window.height()) + "px", "width": Math.max($document.width(), $window.width()) });
                });
            }

            function buildTips()
            {
                $(settings.tipsSelector).css({ "position": "absolute", "z-index": settings.zIndex });

                $window.on("resize", function ()
                {
                    $(settings.tipsSelector).css({ "top": $this.offset().top - settings.offset[1], "left": $this.offset().left - settings.offset[0] });
                }).trigger("resize");

                $(settings.tipsSelector).fadeIn("fast");
            }

            function bindClose()
            {
                $(settings.tipsSelector).find(settings.closeBtnSelector).on("click", function ()
                {
                    $("#{0}".format(settings.maskId)).fadeOut();
                    $(settings.tipsSelector).fadeOut("fast", function ()
                    {
                        settings.onClose();
                    });
                });
            }

            function backTo()
            {
                if (settings.backTo) { $("body, html").animate({ scrollTop: $this.offset().top - settings.offset[1] }, 120) }
            }

            function bindClickEvents()
            {
                if (settings.autoplay && !settings.triggerSelector) { return; }

                $document.on(settings.triggerEvents, settings.triggerSelector, function ()
                {
                    setup();
                });
            }

            if (settings.autoplay)
            {
                setup();
            }

            bindBaseEvents();
            bindClickEvents();

        });
    };
})(jQuery);