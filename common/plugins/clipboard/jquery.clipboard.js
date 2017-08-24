/*
 ************************************************************
 * PC版选中及复制插件, 兼容IE,chrome,FF等. 
 * 没有安装flash的除ie外的其他浏览器,如果不支持document.execCommand('copy'),则无法复制
 ************************************************************
 *
 * require: //static2.51fanli.net/common/libs/jquery/jquery.min.js
 * require: //static2.51fanli.net/common/libs/headjs/head.load.min.js
 *
 * html
 * <span id="foo_notinput">hello(notinput)</span>
 * <button class="btn" data-clipboard-target="foo_notinput">Copy</button>
 * <br><br>
 * <input id="foo_input" type="text" value="hello(input)">
 * <button class="btn" data-clipboard-target="foo_input">Copy</button>
 * <br><br>
 * <textarea id="foo_textarea">hello(textarea)</textarea>
 * <button class="btn" data-clipboard-target="foo_textarea">Copy</button>
 * 
 * JS
 * $('.btn').fclipboard();
 *
*/

(function($){

    var defaultConf = {
        //此js用于引入flash复制组件, js地址必须与swf文件在同一目录
        ZeroClipboardJsUrl: '//static2.51fanli.net/common/plugins/clipboard/zeroclipboard/zeroclipboard.min.js',
        onSuccess: function(copytext){
            alert('复制成功')
        },
        //没有安装flash的除ie外的其他浏览器,如果不支持document.execCommand('copy'),会调用出错回调
        onError: function(){
            alert('请ctrl+c手动复制');
        }
    };

    function FClipboard( $trigger, conf ) {

        var targetId = $trigger.data('clipboardTarget'),
            $target  = $('#'+targetId),
            copytext = '';

        if( $target.length==0 ){
            conf.onError();
            return;
        }

        // 1.选择好目标文字
        $trigger.on('click.SelectText', function(){
            copytext = '';
            $trigger.focus();
            copytext = _selectText($target[0]);
        });

        // 2.添加目标文字到剪贴板
        // 2.1 判断是否ie, 先兼容老浏览器
        if ( window.clipboardData ) {
            $trigger.on('click.SetClipboard', function(){
                if(copytext.length>0){
                    window.clipboardData.setData('text', copytext);
                    conf.onSuccess(copytext);
                }else{
                    window.clipboardData.clearData('text');
                    conf.onError();
                }
            });
            return;
        }

        // 2.2 其他浏览器
        if (typeof ZeroClipboard=='undefined') {
            head.load(conf.ZeroClipboardJsUrl, _setClipboardNotIE);
        } else {
            _setClipboardNotIE();
        }

        function _setClipboardNotIE(){

            // 2.2.1 flash不可用
            if(ZeroClipboard.isFlashUnusable()){

                $trigger.on('click.SetClipboard', function(){
                    var succeeded;
                    try {
                        //其他浏览器的老版本报错
                        succeeded = document.execCommand('copy');
                    } catch (err) {
                        succeeded = false;
                    }
                    
                    if( succeeded ){
                        conf.onSuccess(copytext);
                    } else{
                        conf.onError();
                    }
                });
            }
            // 2.2.2 flash可用
            else{
                var clip = new ZeroClipboard( $trigger );

                clip.on("ready", function() {
                    this.on("aftercopy", function(event) {
                        conf.onSuccess(copytext);
                    });
                });
                clip.on("error", function(event) {
                    ZeroClipboard.destroy();
                    conf.onError();
                });
            }
        }
    }

    function _selectText(element) {
        var selectedText = '';

        if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
            var start = 0;
            var end = element.value.length;
            if(element.createTextRange){
                var range = element.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
            else if(element.setSelectionRange){
                element.focus();
                element.setSelectionRange(start, end);
            }
            selectedText = element.value;
        }
        else {
            if(element.hasAttribute&&window.getSelection){
                if (element.hasAttribute('contenteditable')) {
                    element.focus();
                }
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
                selectedText = selection.toString();
            }else{
                // 兼容老ie
                selectedText = _selectAtOldIE(element);
            }
        }
        return selectedText;
    }

    function _selectAtOldIE(element){
        var $el = $(element),
            selectedText = '',
            $spoof;

        selectedText = $el.text();

        if(!selectedText || selectedText.length<=0){
            return '';
        }

        $spoof = $('<textarea style="position:absolute; z-index: 2; border:0; outline:0; overflow:hidden; padding:0; margin:0;"></textarea>').appendTo('body');

        $spoof.css({
            'top':        $el.offset().top,
            'left':       $el.offset().left,
            'width':      $el.width(),
            'height':     $el.height(),
            'font-size':  $el.css('fontSize'),
            'font-family':$el.css('fontFamily'),
            'font-weight':$el.css('fontWeight'),
            'line-height':$el.css('lineHeight')
        });

        $spoof.text(selectedText).focus();

        var start = 0;
        var end = selectedText.length;

        if($spoof[0].createTextRange){
            var range = $spoof[0].createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }

        return selectedText;
    }

    $.fn.fclipboard = function (conf) {

        var el = this.data('fclipboard');

        if (el) { return el; }

        var conf = $.extend({}, defaultConf, conf);

        this.each(function(){
            el = new FClipboard( $(this), conf );
            $(this).data('fclipboard', el);
        });

        return this;

    };

})(jQuery);