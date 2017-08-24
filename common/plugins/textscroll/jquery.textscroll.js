/**
 * jQuery text scroll plugin v0.2
 *
**/

;(function($){
	$.fn.textscroll = function(settings){
		settings = $.extend({
			interval: 2000,
			animate: 300,
			panel: 'ul',
			first: 'li:first'
		}, settings);
		
		return this.each(function(){
			var $this = $(this),
				$panel = $this.find(settings.panel),
				$item = $this.find(settings.first),
				height = $item.height(),
				interval = settings.interval,
				timer;
			
			if($panel.children().length * height > $this.height()){
				
				$this.hover(function(){
					clearInterval(timer);
				}, function(){
					timer = setInterval(function(){
						var $first = $this.find(settings.first);
						var h = $first.height();
						$first.next().addClass('first').end().animate({marginTop: -h + 'px'}, settings.animate, function(){
							$first.css('marginTop', 0).appendTo($panel).removeClass('first');
						});
					}, interval);
				}).trigger('mouseleave');
			
			}
						
		});
	};
})(jQuery);