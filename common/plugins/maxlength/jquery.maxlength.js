/**
 * jQuery maxlength plugin v1.2
 * zhe.fu@fanli.com
 *
 * Usuage:
 * <form>
 *     <textarea id="id" maxlength="100"></textarea>
 *     <span class="charsLeft">100</span>
 * </form>
 *
 * $('#id').maxlength();
 * 
**/
;(function($){
	//textarea or input letter count
	$.fn.maxlength = function(settings){
		if(typeof settings == 'string'){
			settings = {callback: settings};
		}
		settings = $.extend({
			limit: true,
			desc: true,
			trim: true,
			chinese: false,
			callback: '.charsLeft'
		}, settings);
		
		function length(el){
			var val = settings.trim ? $.trim(el.value) : el.value;
			if(!settings.chinese){
				return val.length;
			}
			else{
				return val.replace(/[^\x00-\xff]/g, '**').length;
			}
		}
		
		return this.each(function(){
			var field = this,
				$field = $(field),
				$document = $(document),
				$form = $field.closest('form'),
				limit = $field.attr('data-maxlength') || $field.attr('maxlength'),
				$charsLeft = $form.find(settings.callback);

			if(limit == undefined){
				return;
			}
				
			var limitCheck = function(event){
				var len = length(this),
					exceeded = len >= limit,
					code = event.keyCode;
					
				if(!exceeded){
					return;
				}
				
				switch(code){
					case 8:
					case 9:
					case 17:
					case 36:
					case 35:
					case 37:
					case 38:
					case 39:
					case 40:
					case 46:
					case 65:
					return;
					
					default:
						return code != 32 && code != 13 && len == limit;
				}
			};
			
			var updateCount = function(){
				if(this.count){
					clearTimeout(this.count);
				}
				this.count = setTimeout(function(){
					var len = length(field);
					var sublen = len - $field.val().length;
					var diff = limit - len;
					
					if(sublen > 0){
						$field.attr('maxlength', limit - sublen);
					}
					
					if(settings.desc){
						$charsLeft.html(diff > 0 ? diff : '0');
					}
					else{
						$charsLeft.html(diff > 0 ? len : limit);
					}
				}, 100);
			};
			
			$field.on('keyup change', updateCount);
			if(settings.limit){
				$field.keydown(limitCheck);
			}
			updateCount();
		});
	};
})(jQuery);