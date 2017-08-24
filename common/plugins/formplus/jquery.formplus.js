/**
 * jQuery form plus plugin v0.5
 * zhe.fu@fanli.com
 * 
**/

;(function($){
	//focus set char position
	$.fn.focusPosition = function(position){
		if(this.length == 0){
			return this;
		}
		return $(this).focusSelect(position, position);
	};
	
	//focus select the chars
	$.fn.focusSelect = function(start, end){
		if(this.length == 0){
			return this;
		}
		input = this[0];
		
		if(input.createTextRange){
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
		else if(input.setSelectionRange){
			input.focus();
			input.setSelectionRange(start, end);
		}
		return this;
	};
	
	//focus set the cursor at end
	$.fn.focusEnd = function(){
		this.focusPosition(this.val().length);
	};
	
	//card number subsection
	$.fn.numberGap = function(){
		return this.each(function(){
			$(this).keyup(function(){
				var val = $(this).val().replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,'$1 ');
				$(this).val(val);
			});
		});
	};
	
	//disabled button with countdown
	$.fn.countdownButton = function(settings){
		settings = $.extend({
			until: 10,
			position: 0,
			text: null,
			prepend: null,
			append: null,
			after: null,
			notActiveClass: "cd_notactive",
            completeHanlder: $.noop
		}, settings);
		
		return this.each(function(){
			var $this = $(this),
				until = settings.until,
				position = settings.position,
				prepend = settings.prepend,
				append = settings.append,
				after = settings.after,
				val = settings.text || $this.val(),
				original = $this.val(),
				len = val.length;
				
			var timer,
				f = val.slice(0, position),
				e = val.slice(position, len);
			
			if(prepend != null){
				f += prepend;
			}
			if(append != null){
				e = append + e;
			}			
			
			$this.attr('disabled', true);
			$this.addClass(settings.notActiveClass);
			$this.data("retry", retry);
			timer = setInterval(function(){
				countdown();
			}, 1000);
			
			function update(time){
			    if (position == "self") {
			        $this.val(time);
			        return;
			    }

			    if (position == 'front' || position == 0) {
			        $this.val(time + val);
			    }

			    if (position == 'end' || position == len) {
			        $this.val(val + time);
			    }
			    else {
			        $this.val(f + time + e);
			    }
			}
			
			function countdown(){
				update(until);
				until--;
				if(until < 1){
					if(after != null){
						val = after;
					}
					$this.val(original).attr('disabled', false);
					$this.removeClass(settings.notActiveClass);
					clearInterval(timer);
					settings.completeHanlder();
					return;
				}
			}

			function retry() {
			    $this.val(original).attr('disabled', false);
			    $this.removeClass(settings.notActiveClass);
			    clearInterval(timer);
			}
		});
	};
	
    //以后统一使用//static2.51fanli.net/common/plugins/fclipboard/jquery.fclipboard.min.js的fclipboard方法, 这个clipboard将逐步淘汰
	//copy to clipboard (*require 'http://static2.51fanli.net/common/plugins/zclip/jquery.zclip-min.js')
	$.fn.clipboard = function(settings){
		settings = $.extend({
			zclip: true,
			onComplete: null
		}, settings);

		return this.each(function(){
			var $this = $(this),
				field = $this.attr('data-field'),
				$field = field ? $(field) : $this.prev();
			
			if(window.clipboardData){
				$this.click(function(){
					var val = $field.val() || $field.text(),
						len = val.length;
					window.clipboardData.setData('text', val);
					$field.focusSelect(0, len);
					settings.onComplete();
				});
			}
			else{
				$this.zclip({
					path: '//static2.51fanli.net/common/plugins/zclip/ZeroClipboard.swf',
					copy: function(){
						var val = $field.val() || $field.text();
						return val;
					},
					clickAfter: false,
					afterCopy: function(){
						settings.onComplete();
					}
				});
			}
		});
	};
})(jQuery);