/*
##@import
    * "/common/libs/fmu/css/keybord.css"

    * "/common/libs/fmu/js/vendors/jquery/jquery.js"
    * "/webapp/js/base.js"
    * "/common/libs/fmu/js/core/fmu.js"
    * "/common/libs/fmu/js/core/widget.js"

##参数
    * inputWrap: $("body"),    //input父级容器
    * keybordWrap: $("body"),  //keybord父级容器
    * touchCallout: false,     //键盘是否需要点击唤起。默认键盘可见
    * avtiveClass: "active",   //键盘弹出效果依赖class，可更换class后自定义
    * keyOnClass: "on",        //键盘点击效果class，可更换class后自定义
    * hideKeybord: false,      //键盘可隐藏，默认不显示取消按钮
    * callback: $.noop,        //输入6位后回调函数，第一个参数为passwrod，第二个参数为keybord，可调用内部所有方法
    * cancelCbk: $.noop        //点击取消后回调函数，参数为keybord，可调用内部所有方法
    * delCbk: $.noop            //点击删除回调函数，第一个参数为passwrod，第二个参数为keybord，可调用内部所有方法
*/

(function ($) {

    FMU.UI.define("KeyBord",{
        password: [],
        $input: $('<ul class="fmu-keybord-input clearfix" id="J_keybord_input">\
                        <li></li>\
                        <li></li>\
                        <li></li>\
                        <li></li>\
                        <li></li>\
                        <li></li>\
                    </ul>'),
        $keybord: $('<ul class="fmu-keyboard" id="J_keyboard">\
                        <li data-key="1"><span>1</span></li>\
                        <li data-key="2"><span>2</span><span class="fmu-keyboard-letter">ABC</span></li>\
                        <li data-key="3"><span>3</span><span class="fmu-keyboard-letter">DEF</span></li>\
                        <li data-key="4"><span>4</span><span class="fmu-keyboard-letter">GHI</span></li>\
                        <li data-key="5"><span>5</span><span class="fmu-keyboard-letter">JKL</span></li>\
                        <li data-key="6"><span>6</span><span class="fmu-keyboard-letter">MNO</span></li>\
                        <li data-key="7"><span>7</span><span class="fmu-keyboard-letter">PQRS</span></li>\
                        <li data-key="8"><span>8</span><span class="fmu-keyboard-letter">TUV</span></li>\
                        <li data-key="9"><span>9</span><span class="fmu-keyboard-letter">WXYZ</span></li>\
                        <li class="fmu-keyboard-gray J_keyboard_cancel"></li>\
                        <li data-key="0"><span>0</span></li>\
                        <li class="fmu-keyboard-gray J_keyboard_del" data-key="del"><i class="fmu-keyboard-del"><img class="w100" src="//static2.51fanli.net/common/images/keybord/del.png" alt=""></i></li>\
                    </ul>'),
        settings: {
            inputWrap: $("body"),
            keybordWrap: $("body"),
            touchCallout: false,
            avtiveClass: "active",
            keyOnClass: "on",
            hideKeybord: false,
            callback: $.noop,
            cancelCbk: $.noop,
            delCbk: $.noop
        },
        setUp: function(){
            this.buildInput();
            this.buildKeybord();
            return this;
        },
        buildInput: function(){
            var _this = this;
            _this.$input.appendTo(_this.settings.inputWrap)
                  .on("click",function(){
                    _this.$keybord.addClass(_this.settings.avtiveClass)
                  });
        },
        buildKeybord: function(){
            var _this = this;
            _this.$keybord.appendTo(_this.settings.keybordWrap);
            var $key = _this.$keybord.children("li");
            var $keyCancel = $(".J_keyboard_cancel");
            var $keyDel = $(".J_keyboard_del");
            
            _this.settings.hideKeybord && $keyCancel.html('<span class="fmu-keyboard-letter">取消</span>');

            !_this.settings.touchCallout && _this.$keybord.addClass(_this.settings.avtiveClass);
            

            $key.on("touchstart",function(){
                var $this = $(this);
                var len = _this.password.length;

                if($this.hasClass("J_keyboard_cancel")){
                    _this.settings.hideKeybord && $this.addClass(_this.settings.keyOnClass) && _this.hideKeybord();
                    return;
                }

                $this.addClass(_this.settings.keyOnClass);

                if($this.hasClass("J_keyboard_del")){
                    if(len > 0){
                        _this.$input.children("li").eq(len - 1).html("");
                        _this.password.pop();
                        _this.settings.delCbk(_this.password.join(""),_this);
                    };
                    return;
                }

                if(len >= 6) return;

                _this.password.push($this.data("key"));
                _this.$input.children("li").eq(len).html('<div class="keybord-dot"></div>');
                _this.password.length === 6 && _this.settings.callback(_this.password.join(""),_this);

            })
            .on("touchend touchcancel",function(){
                $(this).removeClass(_this.settings.keyOnClass);
            })
        },
        hideKeybord: function(){
            this.$keybord.removeClass(this.settings.avtiveClass);
            this.settings.cancelCbk(this);
            return this;
        },
        clearPassword: function(){
            this.password = [];
            this.$input.children("li").html("");
            return this;
        }
    })

    $.fn.bindKeybord = function(options){

        var $keybord = new FMU.UI.KeyBord();
        $keybord.settings = $.extend(true, {}, $keybord.settings, options, {
            inputWrap: $(this)
        });
        $keybord.setUp();
        return $keybord;
    }
})($)
