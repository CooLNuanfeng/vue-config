/**
 * jQuery checkverify plugin v0.5
 * hao.chen@fanli.com
**/
// example
// $('#test').checkverify();

/* css
.wrap-verify {position:relative;}
.wrap-verify s {position: absolute;right: 10px;top:7px;display: none;width: 16px;height: 16px;background: url(http://static2.51fanli.net/common/images/icon/ico-success-s.png) no-repeat;}
.wrap-verify .error {background: url(http://static2.51fanli.net/common/images/icon/ico-error-s.png) no-repeat;}
*/


;(function($){
    $.fn.extend({ 
        checkverify: function(options) {
            var defaults = {
                success: null,
                error: null
            };
            
            var options = $.extend(defaults, options);

            return this.each(function() {
                var o = options;
                var $obj = $(this);
               

                $obj.wrap('<span class="wrap-verify"></span>').after('<s></s>').keyup(function(){
                    var $this =$obj;
                    var $tipsVerify = $this.next();
                    var len = this.value.length;
                    if(len >= 4){
                        $.ajax({
                            url: '//fun{0}/client/verify/check?passcode='.format(Fanli.Utility.rootDomain) + this.value,
                            dataType:'jsonp',
                            jsonp:'jsoncallback',
                            success:function(data){
                                if(data.status == 1){
                                    if(data.data==1){
                                        $tipsVerify.removeClass('error').show();
                                        $('#codeinfo').html('');
                                        if(typeof(o.success) === 'function'){
                                            o.success();
                                        }
                                    }else if(data.data==2){
                                        $tipsVerify.addClass('error').show();
                                        $("#codeimg").attr("src",verifyCodeImageUrl+(new Date()).getTime());
                                        if(typeof(o.error) === 'function'){
                                            o.error();
                                        }
                                    }else{
                                        $tipsVerify.addClass('error').show();
                                        if(typeof(o.error) === 'function'){
                                            o.error();
                                        }
                                    }
                                }
                            }
                        });
                    }else{
                        $tipsVerify.removeClass('error').hide();
                    }
                });
            });
        }
    });
})(jQuery);