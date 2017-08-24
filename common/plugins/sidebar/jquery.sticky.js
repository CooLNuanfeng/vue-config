/**
 * jQuery simple sticky plugin v0.1
 * chao.ming@fanli.com
 * 
**/
; (function ($) {

	var defaults = {
			min: 1,
			max: null,
			top: 0,
			$parent: '',
			stickyClass: 'stickybox',
			zIndex: 999,
			relative: false,
			relativeWidth: 990,
		};

	$.fn.sticky = function (settings) {
		settings = $.extend({}, defaults, settings);

		var method = {};

		method.updateData = function( newSettings ){
			settings = $.extend({}, settings, newSettings);
		};

		return this.each(function () {
			var $this = $(this),
				$parent = settings.$parent,
				$browser = $.browser,
				$window = $(window),
				isIE6 = !!window.ActiveXObject && !window.XMLHttpRequest;

			$this.data('stricky', method);

			function update() {
				var st = $window.scrollTop();
				if ((settings.max == null && st >= settings.min) || (settings.max != null && st >= settings.min && st < settings.max)) {
					$this.addClass(settings.stickyClass);
					if (!isIE6)
					{
						$this.css({
							'position': 'fixed',
							'top': settings.top,
							'z-index': settings.zIndex
						});
					} else {
						var pt = $parent.length ? settings.$parent.offset().top : 0;

						$this.css({
							'position': 'absolute',
							'top': st + settings.top - pt,
							'z-index': settings.zIndex
						});
					}
				}
				else {
					$this.removeClass(settings.stickyClass).removeAttr('style');
				}
			};

			if (settings.relative) {
				var sw = settings.relativeWidth,
					tw = $this.width(),
					x = ($window.width() + sw) / 2;

				$window.on('scroll.sticky', function () {
					var ww = $window.width();

					$this.css('left', ((ww + sw) / 2) - tw);
				});
			}

			$window.on('scroll.sticky', function () {
				update();
			});

		});
	};
})(jQuery);