///<reference path="../core/fmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../vendors/jquery/jquery-2.1.1.js" />

/**
 * @file pincode
 * @import vendors/jquery/jquery-2.1.1.js, core/fmu.js, core/widget.js
 */
FMU.UI.define("Pincode", (function () {
    var defaults = {
        max: 6, 
        onInput: function (code) {}
    };
    var pincodeTpl = (new StringBuilder)
                        .append('<span class="pincode-item J_pincode_item"></span>')
                        .toString(), 
        inputTpl = (new StringBuilder)
                        .append('<input type="tel" class="pincode-input J_pincode_input" />')
                        .toString(),
        circleCls = 'pincode-circle', 
        pincodeCls = 'pincode', 
        guid = 0, 
        ticket = {};
    var caches = {};
    var isAndroid = navigator.userAgent.toLowerCase().indexOf('android') != -1;
    var EMPTY = '';
    var disabled = false;
    
    return (function () {
        function setup () {
            var self = this;
            renderHtml.call(self);
            bindEvents.call(self);
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
                w += $item.width();
            });
            $container.addClass(pincodeCls).width(w + 8);
        }
        
        function bindEvents () {
            var self = this, 
                $container = self.$container, 
                onInput = self.onInput;
            
            $container.on('input', '.J_pincode_input', function (e) {
                var $input = $(this);
                handleIput.call(self, $input, $input.val(), onInput);
            }).on('click', '.J_pincode_item', function () {
                if (disabled) {
                    return;
                }
                $('.J_pincode_input').focus();
            });
        }
        
        function handleIput ($input, val, cb) {
            var self = this, 
                keys = caches[self._getId(ticket)], 
                code = keys['code'], 
                prev = code.join(EMPTY), 
                last = val.split(EMPTY).pop(), 
                isRemove = prev !== val && prev.length > val.length, 
                activeIndex = keys['activeIndex'], 
                $container = self.$container, 
                $items = $container.find('.J_pincode_item'), 
                len = $items.length, 
                w = $items.width();
                
            $input.empty();
            if (activeIndex < len - 1 && !isRemove) {
                go.call(self, ++activeIndex);
                code.push(last);
                
                typeof cb === 'function' && cb.call(self, code.join(''));
                keys['activeIndex'] = Math.min(activeIndex, defaults.max - 1);
            }
            else if (isRemove) {
                back.call(self, activeIndex);
                code.pop();
                keys['activeIndex'] = Math.max(--activeIndex, -1);
                typeof cb === 'function' && cb.call(self, code.join(''));
            }
            
            $input.val(code.slice(0, defaults.max).join(EMPTY));
        }
        
        function go (index) {
            var self = this;
                $container = self.$container, 
                $item = $container.find('.J_pincode_item:eq({0})'.format(index)), 
                keys = caches[self._getId(ticket)]; 
                
            $item.addClass(circleCls);
        }
    
        function makeCirle(index) {
            var self = this;
            var $items = self.$container.find('.J_pincode_item');
            
            $($items.eq(index)).addClass(circleCls);
        }
    
        function back(index) {
            var self = this, 
                $item = $container.find('.J_pincode_item:eq({0})'.format(index)), 
                keys = caches[self._getId(ticket)]; 
            
            $item.removeClass(circleCls);
        }
        
        function getCode () {
            var code = caches[this._getId(ticket)]['code'];
            return code.slice(0, defaults.max).join('');
        }
        
        function clearCode (cb) {
            var self = this;
            var $container = self.$container;
            var keys = caches[this._getId(ticket)];
            
            $container.find('.J_pincode_item').each(function (i, item) {
                $(item).removeClass(circleCls);
            });
            
            typeof cb === 'function' && cb.call(self);
            
            keys['code'] = [];
            keys['activeIndex'] = -1; 
            
            return self;
        }
        
        function getFocus () {
            var self = this;
            var $container = self.$container;
            var $input = $container.find('.J_pincode_input');
            
            $('.J_pincode_input').blur();
            setTimeout(function () {
                $input.focus();
            });
        }
        
        function disablePincode () {
            var self = this;
            var $container = self.$container;
            
            disabled = true;
            return self;
        }
        
        return {
            init: function ($container, settings) {
                if (!$container || !$container.length) {
                    return;
                }

                var self = this;
                var id = guid++;
                settings = $.extend(true, {}, defaults, settings);
                caches[id] = { activeIndex: -1, code: [] };
                for (var pro in settings) {
                    self[pro] === undefined && (self[pro] = settings[pro]);
                }
                self.$container = $container;
                self._getId = function (t) {
                    if (t === ticket) {
                        return id;
                    }
                }
                setup.call(self);
            }, 

            getCode: getCode,  
            
            getFocus: getFocus, 

            clearCode: clearCode, 
            
            disable: disablePincode
        }; 
    })(); 
})());