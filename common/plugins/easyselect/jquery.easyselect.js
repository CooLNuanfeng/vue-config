/*
 * jQuery easyselect plugin 0.1 
 * author:Hao Chen 
 *
 */
;(function ($) {
	$.fn.easyselect = function(options){
		var defaultSettings = {
				maxHeight:300,
				onChange: $.noop,
				onShow: $.noop,
				onClose: $.noop
			};
		// settings
		var settings = $.extend(defaultSettings, options);

		// check IE6
		var isIe6 = (typeof document.body.style.maxHeight === "undefined");

		//select option show or hide effect
		function hideOption(obj){
			var $arrow = obj.prev(),
				$wrap = obj.parent();
			
			$wrap.removeClass('ui-select-selected');
			obj.hide();
			
			//callback
			settings.onClose();
		}

		function showOption(obj){
			var $arrow = obj.prev(),
				$options = obj.find('li'),
				$wrap = obj.parent(),
				selected = $wrap.find('.ui-select-title').data('selected');
			
			$('.ui-select-selected .ui-select-options').hide(); //hide other esOptions
			$wrap.addClass('ui-select-selected');
			$options.removeClass('selected').eq(selected).addClass('selected'); //reset if hover
			obj.show();

			//ie6 set max height
			if(isIe6 && !obj.data('hasSetMaxHeight') && obj.height() > settings.maxHeight){
				obj.height(settings.maxHeight).data('hasSetMaxHeight',1);
			}
			
			//callback
			settings.onShow();
		}

		//build select option DOM & bind event
		function buildOption(target){
			var $target = $(target),
				esWrap, esSelector, esToggle, esOptions,
				isDisabled = $target.prop('disabled'),
				$option = $target.find('option'),
				inst = {
				'id' : target.id ? target.id : '',
				'name' : target.name ? target.name : '',
				'tabindex' : target.tabindex ? target.tabindex : ''
				};

			var ui = {};
			ui.getTarget = $target;

			// build wrap
			esWrap = $('<div>', {
				'id': (inst.id ? 'ui-select-' + inst.id : 'ui-select-' + inst.name),
				'class': 'ui-select ' + (inst.id ? 'ui-select-' + inst.id : 'ui-select-' + inst.name) + (isDisabled ? ' ui-select-disabled' : ''),
				'tabindex': inst.tabindex
			});


			//build selector
			esSelector = $('<div>',{
				'class': 'ui-select-title'
			});
			esSelector.click(function(e){
				e.stopPropagation();
				if(!esWrap.hasClass('ui-select-disabled')){
					if(esOptions.is(':visible')){
						hideOption(esOptions);
					}
					else{
						showOption(esOptions);
					}
				}
			});
			var $selected =  $option.filter(':selected');
			if($selected.length > 0){
				esSelector.text($selected.text()).data('selected', $selected.index());
			}
			else{
				esSelector.text($option.eq(0).text()).data('selected', 0);
			}
	
			// build toggle arrow
			esToggle = $('<em>',{
				'class' : 'ui-select-arrow',
				'html': '<i></i>'
			});
			esToggle.click(function(e){
				e.stopPropagation();
				if(!esWrap.hasClass('ui-select-disabled')){
					if(esOptions.is(':visible')){
						hideOption(esOptions);
					}
					else{
						showOption(esOptions);
					}
				}
			});

			// build dropdown options
			esOptions = $('<ul>',{
				'class': 'ui-select-options clearfix'

			});
			esOptions.on('mouseenter', '.J-esTrigger', function(){
				$(this).addClass('selected').siblings().removeClass('selected');
			}).on('click', '.J-esTrigger', function(e){
				e.stopPropagation();
				var $this = $(this),
					text = $this.text(),
					val = $this.data('value');
				esSelector.text(text).data('selected', $this.data('index'));
				esOptions.children().removeClass('selected');
				$this.addClass('selected');
				$target.val(val);
				hideOption(esOptions);
				settings.onChange(ui);
			}).on('click', '.J-esTrigger-disabled', function(e){
				e.stopPropagation();
				esOptions.show();
			});

			var init = [];
			$option.each(function(index){
				var $obj = $(this),
					kclass,
					alt = {
						'value': this.value,
						'text': this.text,
						'selected': this.selected,
						'disabled': this.disabled
					};
				kclass = alt.selected ? 'selected ' : '';
				kclass += alt.disabled ? 'disabled' : '';
				kclass = $.trim(kclass);
				
				if(alt.disabled){
					init.push('<li class=\"', kclass,' ui-option ui-option-disabled J-esTrigger-disabled\" data-value=\"', alt.value, '\" data-index=\"',index , '\">', alt.text);
				}
				else{
					init.push('<li class=\"', kclass,' ui-option J-esTrigger\" data-value=\"', alt.value, '\" data-index=\"', index, '\">', alt.text);
				}
				init.push('</li>');
			});
			var html = init.join('');
			esOptions.append(html);

			// combine selectbox
			esWrap.append(esSelector, esToggle, esOptions);

			$target.hide().after(esWrap);

			$target.on('change', function(){
				var val = $target.val(),
					$that = esOptions.find('[data-value="' + val + '"]');
				esSelector.text($option.filter(':selected').text());
				esOptions.children().removeClass('selected');
				$that.addClass('selected');
			});

			$(document).on('click',function(){
				if(esOptions.is(':visible')){
					hideOption(esOptions);
				}
			});  
		}

		// api扩展data
		function dataSelect(target){
			var self = this,
				$that = target.next('.ui-select');
			$.extend(self, {
				disable: function() {
					$that.addClass('ui-select-disabled');
				},
				enable: function() {
					$that.removeClass('ui-select-disabled');
				},
				destroy: function() {
					target.removeData('easyselect');
					$that.remove();
				}
			});
		}

		return this.each(function(){
			//if mobile
			if(navigator.userAgent.match(/iPad|iPhone|Android|IEMobile|BlackBerry/i)){
				$(this).show();
                return false;
			}

			var $this = $(this),
				data = $this.data('easyselect');
			if(!data){
				buildOption(this);
				var el = new dataSelect($this);
				$this.data('easyselect',el);
			}
		});
	} 

})(jQuery);