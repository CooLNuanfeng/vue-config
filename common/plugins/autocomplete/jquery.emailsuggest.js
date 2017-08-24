/**
 * jQuery email suggest plugin
 * request common/plugins/autocomplete/jquery-ui-autocomplete-min.js
**/

;(function($){
	$.fn.emailsuggest = function(settings){
		settings = $.extend({
			emailList:['@qq.com','@163.com','@126.com','@sina.com','@sina.cn','@hotmail.com','@gmail.com','@sohu.com','@139.com','@vip.qq.com','@vip.sina.com','@foxmail.com','@sogou.com'],
			maxList:null,
			delay:200,
			appendTo:'body',
			position: {offset: "0 -1"},
			onOpen: null,
			onClose: null,
			btnClear:false
		}, settings);

		return this.each(function(){
			var $this = $(this);
			var $btnClear = $('<a class="btn-clear" href="javascript:void(0);"></a>');
			var inputWidth = $this.outerWidth();
			if(settings.btnClear){
				$this.wrap('<span class="wrap-mail"></span>').after($btnClear).on('keyup.suggest',function(e){
					if(settings.btnClear){
						if ($this.val() !='') {
							$btnClear.show();
						}else{
							$btnClear.hide();
						}
						$this.html('');
					}
				});
			}
			$this.on('input.autocomplete', function(){
					$(this).trigger('keydown.autocomplete');
			}).autocomplete({
				source: function(request, response)	{
					var emailVendors = settings.emailList;
					var val = request.term;
					var sP = val.indexOf("@");
					var mailVal = (sP>-1) ? val.substring(0, sP):val;
					var aArray = [];
					$(emailVendors).each(function(idx, item){
						aArray.push(mailVal + item);
					});
					var filterArray = [];
					filterArray.push(val);
					for(var j=0;j<=aArray.length-1; j++){
						if(aArray[j].indexOf(request.term) >-1 && aArray[j] != request.term){
						  filterArray.push(aArray[j]);
					    }
					}
					if(settings.maxList){
						filterArray = filterArray.slice(0,settings.maxList + 1);
					}
					response(filterArray);
				},
				open: function(event, ui){
					if(typeof(settings.onOpen) === 'function'){
						settings.onOpen();
					}
					$this.autocomplete("widget").css('width','{0}px'.format(inputWidth-2)).prepend('<li class="nine">&#35831;&#36873;&#25321;&#25110;&#32487;&#32493;&#36755;&#20837;&#8230;</li>');//Unicode提示文字：请选择或继续输入…
				},
				minLength:1,
				focus: function( event, ui ) {
					return false;
				},
				select: function( event, ui ) {
					var name = ui.item.value;
					$this.val(name);
					return false;
				},
				close:function( event, ui ) {
					if(typeof(settings.onClose) === 'function'){
						settings.onClose();
					}
					if($this.val() == ''){
						$this.focus();
					}
					return false;
				},
				autoFocus:true,
				delay: settings.delay,
				appendTo: settings.appendTo,
				position: settings.position
			}).data( "autocomplete" )._renderItem = function( ul, item ) {
				var $li = $("<li></li>");
				return $li.data("item.autocomplete", item)
						  .append('<a href="javascript:void(0);">{0}</a>'.format(item.label))
						  .appendTo(ul);
			};
			$btnClear.click(function(){
				$this.val('');
				$btnClear.hide();
			});
		});
	};
})(jQuery);