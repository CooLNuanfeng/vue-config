(function($){
	$.fn.pincode = function(keys){
        var settings, method, self, _code = [];
        
        var pincodeTpl = (new StringBuilder)
                            .append('<span class="pincode-item J_pincode_item"></span>')
                            .toString(), 
			inputTpl = (new StringBuilder)
                        .append('<input type="text" class="pincode-input J_pincode_input" />')
                        .toString(),
            numReg = /\d/, 
			clearFixCls = 'clearfix', 
            circleCls = 'pincode-circle', 
            pincodeCls = 'pincode', 
			EMPTY = '';

        typeof keys === 'string'
            ? method = keys
            : settings = $.extend({
    			max: 6, 
                onInput: function (code) {}
    		}, keys);

        function setup () {
            var self = this;
            renderHtml.call(self);
            bindEvents.call(self);
			self.activeIndex = 0;
        }

        function renderHtml () {
            var self = this,
                $container = self.$container,
                pincodeHtml = '', 
                w = 0; 

            for (var i = 0; i < self.max; i++) {
                pincodeHtml += pincodeTpl;
            }
			
			pincodeHtml += inputTpl;

            $container.append($(pincodeHtml));
            $container.find('.J_pincode_item').each(function (i, item) {
                var $item = $(item);
                w += $item.outerWidth();
            });
            $container.addClass('{0} {1}'.format(pincodeCls, clearFixCls)).width(w + 1);
			if (!!window.ActiveXObject && !window.XMLHttpRequest) {
				$container.position() && $container.find('.J_pincode_input').css({left: 0, top: 0});
			}
        }

        function bindEvents () {
            var self = this, 
                $container = self.$container, 
                onInput = self.onInput, 
                $items = $container.find('.J_pincode_item'); 
            
            $container.on('keydown', '.J_pincode_input', function (e) {
                e.preventDefault();

				if(e.which == 229){
                    // alert("发生错误！");
                    $('#J_err_msg_box').html("请切换到英文状态下输入");
                    $(this).val("");
                    $("#J_err_tip").show();
                    return;
                }
				var $this = $(this), 
					len = $items.length, 
					activeIndex = self.activeIndex, 
					code = (e.which >= 96 && e.which <= 105) ? e.which - 48 : e.which;
					
				$(this).val(EMPTY);
				if (activeIndex < len && code != 8) {
					var k = String.fromCharCode(code);
					if (numReg.test(k)) {
						$($items.eq(activeIndex)).addClass(circleCls);
						_code.push(k);
						++self.activeIndex;
						
						go.call(self, self.activeIndex);
                        $("#J_err_tip").hide();

                        typeof onInput === 'function' && onInput.call(self, _code.join(''));
                    }
                }
                else if (code == 8) {
                    if (activeIndex > 0) {
                        self.activeIndex--;
                        back.call(self, self.activeIndex);
                        _code.pop();
                        
                        typeof onInput === 'function' && onInput.call(self, _code.join(''));
                    }
                }
            });
		}

		function getCode () {
			return _code.join('');
		}
        
        function clearCode () {
            var self = this;
            var $container = self.$container;
            $container.find('.J_pincode_item').each(function (i, item) {
                var $item = $(item);
                $item.removeClass(circleCls)
                     .empty();
            });
            _code = [];
			self.activeIndex = 0;
			moveInput.call(self, {left: 0});
			
			return self;  
        }
		
		function disablePincode () {
			var self = this;
			var $container = self.$container; 
			$container.find('.J_pincode_input')
								.css({left: -9999})
								.blur();
			
			return self;
		}
        
        function go(index) {
            var self = this, 
				$item = self.$container.find('.J_pincode_item:eq({0})'.format(index)), 
	            pos = $item.position();
            
            pos && moveInput.call(self, pos);
        }
		
		function moveInput (pos) {
            var self = this;
            var $input = self.$container.find('.J_pincode_input');
            $input.css({left: pos.left});
        }
    
        function makeCirle(index) {
            var self = this;
            var $items = self.$container.find('.J_pincode_item');
            
            $($items.eq(index)).addClass(circleCls);
        }
    
        function back(index) {
            if (index == -1) {
                return;
            }
            
            var self = this;
				$item = self.$container.find('.J_pincode_item:eq({0})'.format(index)), 
				pos = $item.position(); 
			
			$item.removeClass(circleCls);
			moveInput.call(self, pos);
        }

        if (settings !== undefined) {
			if (!this[0]) {
				return;
			}

			var pincode = $.extend(true, {}, settings),
				$this = $(this[0]);

			pincode.$container = $this;
			setup.call(pincode);

			return $.extend(true, pincode, {
				"getCode": getCode, 
                "clearCode": clearCode, 
				"disable": disablePincode
			});

        }
        else if (method !== undefined) {
            return this[method] && 
                   typeof this[method] === 'function' && 
                   this[method].apply(this, arguments.slice(1));
        }
	};
})(jQuery);
