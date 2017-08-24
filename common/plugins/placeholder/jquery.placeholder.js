/**
 * jQuery placeholder plugin v0.1
 * zhe.fu@fanli.com
**/

;(function($){
	$.fn.placeholder = function(settings){
		settings = $.extend({
			type: 'value',
			color: '#BCBCBC',
			zIndex: false,
			klass: false,
			offset: [0, 0],
			repair: false,
			onLoad: false
		}, settings);
		
		var input = document.createElement('input');
		var support = 'placeholder' in input;
		
		if(!support){
			return this.each(function(){
				var $this = $(this);
				var placeholder = $this.attr('placeholder');
				var type = settings.type;
				
				if(type == 'label'){
					var $label = $('<label style="display:none;position:absolute;cursor:text;"></label>');
					var id = $this.attr('id');
					var position = $this.position();
					var width = $this.width();
					var height = $this.outerHeight();
					var paddingLeft = $this.css('padding-left');
					var zIndex = $this.css('z-index');
					var fontSize = $this.css('font-size');
					var textIndent = $this.css('text-indent');
					
					if(!id){
						id = 'placeholderId' + Math.random();
						$this.attr('id', id);
					}
					
					if(zIndex != 'auto'){
						zIndex = zIndex + 1;
					}
					
					if(!settings.klass){
						//auto set styles
						$label.css({
							'z-index': zIndex,
							'left': position.left + settings.offset[0],
							'top': position.top + settings.offset[1],
							'width': width + 'px',
							'padding-left': paddingLeft,
							'color': settings.color,
							'font-size': fontSize,
							'line-height': height + 'px',
							'text-indent': textIndent
						});
					}
					else{
						$label.addClass(settings.klass);
					}
					
					$label.text(placeholder).attr('for', id).insertBefore(this);
					
					function hide(){
						$label.hide();
					}
	
					function show(){
						var placeholder = $this.attr('placeholder');
						if($this.val() == ''){
							$label.text(placeholder).show();
						};
					};

					if(settings.onLoad){
						$(window).load(show);
					}
					else{
						show();
					}
	
					function repair(){
						var position = $this.position();
						$label.css({
							'left': position.left + settings.offset[0],
							'top': position.top + settings.offset[1]
						});
					}
	
					$this.on({
						'focus.placeholder': hide,
						'blur.placeholder': show,
						'change.placeholder': show,
						'input.placeholder': show,
						'show.placeholder': function(){
							repair();
							show();
						}
					});
					
					if (!window.screenX){
						$this.on('keyup.placeholder', hide);
						$label[0].onpaste = function() {
							setTimeout(hide, 30);	
						}
					}
					
					$label[0].oncontextmenu = function(){
						$this.focus();
						return false;	
					}
					
					$label.on('click.placeholder', function(){
						$this.focus();
					});
					
					if($this.prop('disabled')){
						$label.off('click.placeholder');
					}
	
					$(window).on({
						'resize.placeholder': repair,
						'load.placeholder': repair
					});
				
				}
				else if(type == 'value'){
					
					if($this.val() == ''){
						$this.addClass(settings.klass).css('color', settings.color).val($this.attr('placeholder'));
					}
					$this.focus(function(){
						if($this.val() == $this.attr('placeholder')){
							$this.removeClass(settings.klass).css('color', '').val('');
						}
					}).blur(function(){
						if($this.val() == ''){
							$this.addClass(settings.klass).css('color', settings.color).val($this.attr('placeholder'));
						}
					});
					
				}
				
			});
		}
	};
})(jQuery);