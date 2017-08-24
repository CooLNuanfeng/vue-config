/**
 * jQuery simple sidebar plugin v1.6
 * zhe.fu@fanli.com
 * 
 * HTML:
	<div id="sidebar">
		<a id="backToTop" href="#top">Back to Top</a>
	</div>

 * CSS:
	#sidebar{display:none; position:fixed; right:5px; bottom:5px;}
**/

;(function($){
	$.fn.sidebar = function(settings){
		settings = $.extend({
			min: 1,
			fadeSpeed: 200,
			position: 'bottom',
			anchorOffset: 0,
			relative: false,
			relativeWidth: 960,
			backToTop: false,
			backContainer: '#backToTop',
			smooth: '.smooth',
			overlay: false,
			onShow: null
		}, settings);
		
		return this.each(function(){
			var $this = $(this),
				$browser = $.browser,
				$window = $(window),
				$document = $(document),
				$page = $('body, html'),
				fadeSpeed = settings.fadeSpeed,
				pos = $this.css(settings.position),
				ieOffset = /^\d+%$/.test(pos) ? parseInt(parseInt(pos, 10)/100 * $window.height()) : parseInt(pos),
				isAutoDisplay = ($window.height() + settings.min >= $document.height()) && !settings.backToTop;

			var update = function(){
				if(!!window.ActiveXObject && !window.XMLHttpRequest){
					$this.css({'position': 'absolute'});
					if(settings.position == 'bottom'){
						$this.css({'top': $window.scrollTop() + $window.height() - $this.height() - ieOffset});
					}
					if(settings.position == 'top'){
						$this.css({'top': $window.scrollTop() + ieOffset});
					}
				}
				if($window.scrollTop() >= settings.min || isAutoDisplay){
					$this.fadeIn(fadeSpeed);
					if(typeof(settings.onShow) === 'function'){
						settings.onShow();
					}
				}
				else{
					$this.fadeOut(fadeSpeed);
				}
			};
			
			if(settings.min == 0 || isAutoDisplay){
				update();
			}
			$window.on('scroll.sidebar', function(){
				update();
			});
			
			if(settings.relative){
				var sw = settings.relativeWidth,
					tw = $this.width(),
					x = ($window.width() + sw) / 2;
				
				$this.css('left', x);
				$window.on('resize.sidebar scroll.sidebar', function(){
					var ww = $window.width();
					
					if(settings.overlay){
						x = (ww - tw * 2 > sw) ? ((ww + sw) / 2) : (ww - tw);
					}
					else{
						x = (ww + sw) / 2;
					}
					
					$this.css('left', x);
				});
			}
			
			if(settings.backToTop){
				$(settings.backContainer).click(function(){
					$page.animate({
						scrollTop: 0
					}, 100);
					return false;
				});
			}
			
			//smooth
			$this.find(settings.smooth).click(function(ev){
				var $href = $($(this).attr('href'));
				if($(this).attr('href').charAt(0) == '#' && $href.length > 0){
					ev.preventDefault();
					$page.animate({
						scrollTop: $href.offset().top - settings.anchorOffset
					}, 100);
				}
			});
		});
	};
})(jQuery);