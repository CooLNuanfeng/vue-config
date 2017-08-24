/**
 * jQuery spinner plugin v0.2
 * 
 * HTML:
	
**/
// Spinner
//
// Usage
//
// <div class="spinner">
//  <button class="increment">+</button>
//    <input type="number" val="0" min="0" max="0" />
//  <button class="decrement">-</button>
// </div>
//

;(function($){
	$.fn.spinner = function(settings){
		settings = $.extend({
			'disabled': false,
			'max': null,
			'min': null,
			'upText': '+',
			'downText': '-',
			'step': 1,
			'value': null,
			'onChange': null
		}, settings);
		
		return this.each(function(){
			var $this = $(this),
				$document = $(document),
				max = $this.attr('max') || settings.max,
				min = $this.attr('min') || settings.min,
				value = $this.val() || settings.value,
				step = parseInt($this.attr('step') || settings.step),
				html = '<div class="wrap-spinner"><a href="javascript:void(0)" class="spinner spinner-add">' + settings.upText + '</a><a href="javascript:void(0)" class="spinner spinner-down">' + settings.downText + '</a></div>';
			$this.after(html);
			var $max = $this.next().find('.spinner-add');
			var $min = $max.next();
			var val = parseInt($this.val());
			
			if(val == max){
				$max.addClass('spinner-disabled');
			}
			if(val == min){
				$min.addClass('spinner-disabled');
			}
			
			function up(){
				var val = parseInt($this.val());
				$min.removeClass('spinner-disabled');
				if(val < max){
					val = val + step;
					$this.val(val);
				}
				if(val == max){
					$max.addClass('spinner-disabled');
				}

				if(typeof(settings.onChange) === 'function'){
					settings.onChange();
				}
			}
			function down(){
				var val = parseInt($this.val());
				$max.removeClass('spinner-disabled');
				if(val > min){
					val = val - step;
					$this.val(val);
				}
				if(val == min){
					$min.addClass('spinner-disabled');
				}

				if(typeof(settings.onChange) === 'function'){
					settings.onChange();
				}
			}
			
			$max.click(function(){
				up();
			});
			$min.click(function(){
				down();
			});
			$this.keydown(function(e){
				var key = e.keyCode;
				if(key == 38){
					up();
				}
				if(key == 40){
					down();
				}
			});
			
		});
	}
})(typeof(jQuery) !== 'undefined' ? jQuery : Zepto);
