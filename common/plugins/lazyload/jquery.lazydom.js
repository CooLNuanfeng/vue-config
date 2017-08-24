/**
 * jQuery simple sticky plugin v0.1
 * chao.ming@fanli.com
 * 

* HTML:(textarea mast have "J_html_pack" class name)
	<div id="Div1" class="J_demo_box">
		<textarea class="J_html_pack"><div>把另外一个我显示出来</div></textarea>
	</div>

* EXAMPLE:
	$(".J_demo_box").lazydom({
		threshold: 200,
		callback: function ()
		{
			alert(0);
		}
	});

**/
; (function ($)
{
	$.fn.lazydom = function (settings)
	{
		settings = $.extend({
			autoload: false,
			threshold: 0,
			callback: $.noop
		}, settings);

		return this.each(function ()
		{
			var $this = $(this);
			var $window = $(window);
			var $htmlPack = $this.find("textarea.J_html_pack");
			var destroyed = 0;

			function setup()
			{
				if (destroyed == 1) { return; }

				if ($window.scrollTop() >= $this.offset().top - $window.height() - settings.threshold)
				{
					appendHtml();
				}
			}

			function appendHtml()
			{
				if (destroyed == 1) { return; }

				$htmlPack.before($this.find("textarea.J_html_pack").val());
				destroy();
				settings.callback($this);
			}

			function destroy()
			{
				destroyed = 1;
				$this.addClass("finish-load");
				$htmlPack.remove();
			}

			function bindEvents()
			{
				$window.on("scroll.lazydom resize.lazydom", function ()
				{
					setup();
				});
			}

			if (settings.autoload)
			{
				appendHtml();
			}
			else
			{
				setup();
				bindEvents();
			}

		});
	};
})(jQuery);