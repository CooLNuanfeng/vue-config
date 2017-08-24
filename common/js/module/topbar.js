/// <reference path="//static2.51fanli.net/common/libs/jquery/jquery.min.js" />
/// <reference path="//static2.51fanli.net/common/js/base.js" />

(function ($) {
    //topbar.js
    //common var
    var $topbar = $('#topbar');

    window.prouserid = 'prouserid'.getCookie();
    window.prousername = 'prousernameutf'.getCookie(),
    window.lngmsgcnt = 'lngmsgcnt'.getCookie();

    window.topbarGetInfo = $.getJSON('//fun.fanli.com/topheader/ajaxGetInfoForTopbar?jsoncallback=?', function (json) {
        /*
            {
                "info":"",
                "data": {
                   "has_dingdan":0,
                   "kefu":{"kf":1,"tel":1},
                   "userinfo":{
                        "mail_validated":"1",
                        "lv":"3",
                        'super_redenvelope': ''
                   },
                   "timestamp":1412904334
                 },
                 "status":""
            }
        */

        var data = json.data;

        if (data.kefu) {
            $topbar.data({
                'kfStatus': data.kefu.kf,
                'telStatus': data.kefu.tel
            });
        }

        if (data.crm_mvp) {
            $topbar.data({
                'hasCrmMvp': data.crm_mvp
            });
        }

        if (data.timestamp) {
            $topbar.data({
                'timestamp': data.timestamp
            });
        }

        if (data.userinfo) {
            $topbar.data({
                'bindEmail': data.userinfo.mail_validated,
                'lv': data.userinfo.lv || 0
            });
        }

    }).done(topbarWrite);

    window.utmtOps = $.getJSON("//fun.fanli.com/topheader/ajaxGetMvpStorys?jsoncallback=?", function (res) {
        var data = res.data;

        if (data.story_ids) {
            $topbar.data({
                'betatest': data.story_ids
            });
        }
    });

function topbarWrite() {

	var username = decodeURIComponent(decodeURIComponent(prousername));
		$quickinfo = $('#J_topbar_quick_info'),
		$chklogin = $('#J_topbar_chklogin'),
		$menucs = $('#J_topbar_cs_btn'),
		isShowMsg = $topbar.data("closemsg") != 1,
		lv = $topbar.data("lv");
	
	if(prouserid > 0){
		var newS = new StringBuilder();

		newS.append('<div class="topbar-nav J-topbar-nav">')
				.append('<div class="clearfix menu-hd menu-hd-name"><a class="l menu-name ellipsis" href="http://passport{1}/center/welcome" title={0}>{0}</a>'.format(username, Fanli.Utility.rootDomain));

		if( parseInt(lv) && lv > 0 ){
		    newS.append('<a href="http://passport{2}/center/vip" class="l menu-lv"><img src="//static2.51fanli.net/common/images/level/icon-small-lv{0}.alpha.png" alt="等级{1}" width="16" height="16"></a>'.format(lv, lv, Fanli.Utility.rootDomain));
		}

		newS.append('<i class="arrow"></i></div>')
				.append('<div class="menu-bd menu-user">')
					.append('<em class="arrow"></em>')
					.append('<dl>')
						.append('<dd><a href="http://passport{0}/center/orders">我的订单</a></dd>'.format(Fanli.Utility.rootDomain))
						.append('<dd><a href="http://passport{0}/center/deposit">我的返利</a></dd>'.format(Fanli.Utility.rootDomain))
						.append('<dd><a href="https://f{0}/life/mobiletopup/topup1">手机充值</a></dd>'.format(Fanli.Utility.rootDomain))
						.append('<dd><a href="http://passport{0}/center/safeuser/safecenter" rel="nofollow">账户设置</a></dd>'.format(Fanli.Utility.rootDomain))
						.append('<dd class="last"><a href="http://passport{0}/logout" rel="nofollow">退出</a></dd>'.format(Fanli.Utility.rootDomain))
					.append('</dl>')
				.append('</div>')
			.append('</div>')
		.append('<div id="J_topbar_msg" class="topbar-msg clearfix"><a href="http://passport{0}/center/message"><i>消息</i><p class="msg-p"><span class="msg-span"><em>0</em></span></p></a></div>'.format(Fanli.Utility.rootDomain));

		$chklogin.html(newS.toString());

		if (GeneralValidation.isIe6()) {
			var $username = $chklogin.find('.menuname');
			var csswidth = 80;
			if($username.width() > csswidth){
				$username.width(csswidth);
			}
		};

		if (!lngmsgcnt)
		{
			if (isShowMsg)
			{
			    $.getJSON('//passport{0}/client/user/getUserMessage?jsoncallback=?'.format(Fanli.Utility.rootDomain), function (data)
				{
					if (data.status == 1)
					{
						lngmsgcnt = data.data;
						'lngmsgcnt'.setCookie(lngmsgcnt, '0.001', Fanli.Utility.rootDomain, '/');
					}
					else
					{
						lngmsgcnt = 0;
					}
					chkmsg(lngmsgcnt);
				});
			}
			else
			{
				$('#J_topbar_msg').find('.msg-span').remove();
			}
		}
		else
		{
			chkmsg(lngmsgcnt);
		}

		var crmMvp = $topbar.data('hasCrmMvp') || '';
		if( crmMvp ) {
			var html = '<div class="topbar-shopvip"><a href="' + crmMvp + 'topbar" class="three">恭喜您获得8%的额外返利资格！</a><i></i></div>';
			$('#J_topbar_msg').append(html);
		}
		
	}
	else{
		var url = encodeURIComponent(document.URL);
		var nwsb = new StringBuilder();

		nwsb.append('<div class="topbar-nav J-topbar-nav">')
				.append('<div class="menu-hd"><a href="{0}/login?go_url={1}" rel="nofollow">马上登录</a><i class="arrow"></i></div>'.format(passportAppUrl, url))
				.append('<div class="menu-bd menu-login">')
					.append('<em class="arrow"></em>')
					.append('<dl>')
						.append('<dd><a href="{0}/login?go_url={1}" rel="nofollow">返利登录</a></dd>'.format(passportAppUrl, url))
						.append('<dd><a href="http://passport{0}/oauth/jumpToUnion/type/taobao/ab/1/cooklogin/1" rel="nofollow">淘宝登录</a></dd>'.format(Fanli.Utility.rootDomain))
						.append('<dd><a href="http://passport{0}/oauth/jumpToUnion/type/qq/ab/1/cooklogin/1" rel="nofollow">QQ登录</a></dd>'.format(Fanli.Utility.rootDomain))
						.append('<dd><a href="http://passport{0}/oauth/jumpToUnion/type/sina/ab/1/cooklogin/1" rel="nofollow">新浪登录</a></dd>'.format(Fanli.Utility.rootDomain))
						.append('<dd><a href="http://passport{0}/oauth/jumpToUnion/type/wechat/ab/1/cooklogin/1" rel="nofollow">微信登录</a></dd>'.format(Fanli.Utility.rootDomain))
					.append('</dl>')
				.append('</div>')
			.append('</div>')
			.append('<div class="topbar-reg"><a target="_blank" href="http://passport{1}/reg?action=yes&go_url={0}" rel="nofollow">免费注册</a></div>'.format(url, Fanli.Utility.rootDomain));

		$chklogin.html(nwsb.toString());
	}

	$quickinfo.show();
}

function chkmsg(lngmsgcnt) {
    var $topUserMsg = $('#J_topbar_msg').find('a'),
        $userMsg = $('.usermsg'),
        html = '',
        title = '',
        klass = '',
        len = lngmsgcnt.toString().length;

    if (lngmsgcnt == 0) {
        title = '\u60a8\u6ca1\u6709\u65b0\u7684\u7ad9\u5185\u4fe1\uff01'; //您没有新的站内信！
        $topUserMsg.attr('title', title).addClass('e0');
        //passport leftnav user message number update
        $userMsg.closest('.usermsg-box').hide();
    } else {
        if (len == 1) {
            html = '<em class="e2">' + lngmsgcnt + '</em>';
            klass = 'e2';
        } else if (len == 2) {
            html = '<em class="e3">' + lngmsgcnt + '</em>';
            klass = 'e3';
        } else {
            html = '<em class="e3">...</em>';
            klass = 'e3';
        }
        title = '\u60a8\u8fd8\u6709' + lngmsgcnt + '\u5c01\u65b0\u7684\u7ad9\u5185\u4fe1\u672a\u67e5\u770b\uff01'; //您还有 封新的站内信未查看！
        $topUserMsg.attr('title', title).find('span').prepend(html);
        setTimeout(function () {
            $topUserMsg.addClass(klass);
            $topUserMsg.find('span').animate({
                'margin-top': '0'
            }, function () {
                $topUserMsg.find('em').eq(1).remove();
            });
        }, 500);
        //passport leftnav user message number update
        $userMsg.text(lngmsgcnt).closest('.usermsg-box').show();
    }
}

})(jQuery);

$(function () {
    var $topbar = $('#topbar');
    //menu
    $topbar.on('mouseenter', '.J-topbar-nav', function () {
        var $this = $(this);
        $this.addClass('topbar-nav-hover');
        menuImgLazy();
    }).on('mouseleave', '.J-topbar-nav', function () {
        var $this = $(this);
        $this.removeClass('topbar-nav-hover');
    });

    //customer services and favorite
    $(document).on('click', '.btn-cs', function () {
        open53kf();
    });

    //message
    $('div.message').on('click', '.close', function () {
        $(this).parent().remove();
    });

    //topbar ad tracking
    if ($.fn.adloader && $('#J-fa-topbar').length > 0) {
        $('#J-fa-topbar').adloader();
    }
    else {
        $('#J-fa-topbar').remove();
    }

    function menuImgLazy() {
        var $menuImgLazy = $('.J-menu-img-lazy');

        $menuImgLazy.each(function () {
            var $this = $(this);

            if ($this.data('original') != $this.attr('src')) {
                $this.attr('src', $this.data('original'))
            }
        });
    }
});

/*STORY #8112::新人礼包对未参与抽奖的用户增加提示入口*/
$(function ()
{
    var ajaxUrl = "//passport{0}/Client/User/isNewbieGiftAvailable".format(Fanli.Utility.rootDomain);
    var logUrl = "//passport{0}/Client/User/ajaxOpenGift".format(Fanli.Utility.rootDomain);
	var overlaySelector = "J-guys-popover";
	var showAwardCookie = "51fanli_new_guys_8112";
	var giveupCookieName = "cngflp_8112";
	var openedCookieName = "cngflp_redb";
	var docHref = document.location.href;

	'prouserid'.getCookie() > 0 && init();
	
	function init()
	{
		$("body").append('<div id="{0}" class="popover popover-awards" style="display:none;"></div>'.format(overlaySelector));
		buildOverlay();
		bindLiveEvents();
	}

	function buildOverlay(reopen)
	{
		if (showAwardCookie.getCookie() == "8112" && giveupCookieName.getCookie() != "1")
		{
			$.ajax({
				url: reopen ? "{0}?status=1&location={1}".format(ajaxUrl,  encodeURIComponent(docHref)) : "{0}?location={1}".format(ajaxUrl, encodeURIComponent(docHref)),
				dataType: "JSONP",
				jsonp: "jsoncallback",
				success: function (JSON)
				{
				    if (JSON.status == "1" || JSON.status == "3" )
					{
						var $overlay = $("#{0}".format(overlaySelector));
						$overlay.append(JSON.data).find('#J_alipay_input').magnifier().placeholder();
						$overlay.overlay({
							fixed: false,
							closeOnClick: false,
							closeOnEsc: false,
							speed: 200,
							top: "12%",
							fixed: false,
							onClose: function ()
							{
								setTimeout(function ()
								{
									var $popGuide = $('#pop-guide');
									if ($popGuide.data('overlay') && !'home-guide'.getCookie())
									{
										$popGuide.data('overlay').load();
									}
								}, 250);

								openedCookieName.setCookie("0", 1, Fanli.Utility.rootDomain, "/");
							}
						}).data("overlay").load();

						setTimeout(function () { bindDynamicEvents(); }, 25);
				    }
				    else if (JSON.status == "4" || JSON.status == "5") {
				        var $overlay = $("#{0}".format(overlaySelector));
                        if(JSON.status == "5"){
                            $overlay.addClass('popover-mvpapp9184');
                            setTimeout(function(){
                                $('#newbie-app-qrcode').adloader();
                            },20)
                        }
				        $overlay.append(JSON.data);
				        $overlay.overlay({
				            fixed: false,
				            closeOnClick: false,
				            closeOnEsc: false,
				            speed: 200,
				            top: "12%",
				            fixed: false,
				            onClose: function () {
				                openedCookieName.setCookie("0", 1, Fanli.Utility.rootDomain, "/");
				            }
				        }).data("overlay").load();
				    }
                    else if (JSON.status == "8") {
				        var $overlay = $("#{0}".format(overlaySelector));
                        
                        $overlay.addClass('popover-nb10605');
                        
				        $overlay.append(JSON.data);
				        $overlay.overlay({
				            fixed: false,
				            closeOnClick: false,
				            closeOnEsc: false,
				            speed: 200,
				            top: "20%",
				            fixed: false,
				            onClose: function () {
				                openedCookieName.setCookie("0", 1, Fanli.Utility.rootDomain, "/");
				            }
				        });
                        
				        setTimeout(function () {
				            verc();
                            $overlay.data("overlay").load();
                            bindPop10605Event();
                        },25);
				    }
                    else if (JSON.status == "7") {
                        var $overlay = $("#{0}".format(overlaySelector));
						$overlay.addClass('popover-awards-9534').append(JSON.data).find('#J_alipay_input').magnifier().placeholder();
						$overlay.overlay({
							fixed: false,
							closeOnClick: false,
							closeOnEsc: false,
							speed: 200,
							top: "12%",
							fixed: false,
							onClose: function ()
							{
								setTimeout(function ()
								{
									var $popGuide = $('#pop-guide');
									if ($popGuide.data('overlay') && !'home-guide'.getCookie())
									{
										$popGuide.data('overlay').load();
									}
								}, 250);

								openedCookieName.setCookie("0", 1, Fanli.Utility.rootDomain, "/");
							}
						}).data("overlay").load();
						setTimeout(function () { bindDynamicEvents(true); }, 25);
					}
					else if (JSON.status == 2 && $.fn.sidebar) {
						$("body").append(JSON.data);
						$(function(){
                            var $btmpop = $('#J_newbie_btmpop');
                            var $btmpopCon = $btmpop.find('.J_expand_con');
                            var $btmpopOpen = $btmpop.find('.J_expand_newbie');
                            var $btmpopClose = $("#J_newbie_btmpop_close");
                            var $btmpopClick = $("#J_newbie_btmpop_click");
                            var isAnimate = false;
                            
							$btmpop.sidebar({
								min: 0,
								bottom:0,
								relative: false
							});
								
                            $btmpopOpen.click(function(){
                                if(!isAnimate){
                                    isAnimate = true;
                                    $btmpopCon.show();
                                    $btmpop.css({width:'703px'});
                                    $btmpopCon.animate({width:'596px'},500,function(){
                                        $btmpop.addClass('newbie-btmpop-expand');
                                        isAnimate = false;
                                    });
                                }
                            }) 
                                
							$btmpopClose.click(function (){
                                if(!isAnimate){
                                    isAnimate = true;
                                    $btmpopCon.animate({width:0},500,function(){
                                        $btmpop.removeClass('newbie-btmpop-expand');
                                        $btmpopCon.hide();
                                        isAnimate = false;
                                    });
                                }
							});
							$btmpopClick.click(function(){
								$btmpop.removeClass('newbie-btmpop-expand');
                                $btmpopCon.hide();
							});
						});
					}
				}
			});
		}
	}
    
    function bindPop10605Event()
    {
        var $form = $('#J_pop10605form');
        var $int = $form.find('.J_pop10605_nullv');
        var $submit = $form.find('.J_submit');
        
        var $result = $('#J_pop10605result');
        var $resultJfbAcc = $result.find('.J_jfb_count');
        
        $('#newbie-app-qrcode').adloader();
                
        $int.inputNullValidation({triggerFocusEvent: false});
        $submit.submitWithValidation({
            postUrl: "//passport{0}/Client/User/ajaxRegistNewbeiInfo2?jsoncallback=?".format(Fanli.Utility.rootDomain),
            postDataNameSelector: '.J_pop10605_tov',
            mustFillSelector: ".J_pop10605_nullv",
			isJsonpFormat: true,
			onSubmitSuccess: function ()
			{
                $form.hide();
                $resultJfbAcc.text(this.data);
                $result.show();
			}
		});
    }

	function bindLiveEvents()
	{
		var $doc = $(document);
		var xhr;
		// 打开集分宝
		$doc.on("click", "#J_envelope_open", function ()
		{
			if (xhr)
			{
				xhr.abort();
			}

			xhr = $.ajax({
				url: logUrl,
				dataType: "JSONP",
				jsonp: "jsoncallback",
				success: function (result)
				{
					if (result.status == 1)
					{
						$(".J_jfb_count").text(result.data);
						$("#J_awards_first_row").hide();
						$("#J_awards_second_row").show();
					}
				}
			});
			return false;
		});
	}

	function bindDynamicEvents(secondRowChangeW)
	{
		var $inputAlipay = $('#J_alipay_input');
		var $inputContact = $('#J_contact_input');
		var $inputAlipayTip = $('#J_alipay_input_tip');
		var $sbGet = $("#J_sb_get");
		var mvp = $sbGet.data('mvp')==1 ? true : false;

		$(".nullv").inputNullValidation();
		$sbGet.submitWithValidation({
		    postUrl: "//passport{0}/Client/User/ajaxRegistNewbeiInfo?jsoncallback=?".format(Fanli.Utility.rootDomain),
			isJsonpFormat: true,
			onSubmitSuccess: function ()
			{
                if(mvp){
                    $(".J_jfb_count").text(this.data);
					$("#J_awards_first_row").hide();
                    if(typeof secondRowChangeW!='undefined'&&secondRowChangeW){
                        $("#{0}".format(overlaySelector)).css({'width':550,'margin-top':50});
                        $(window).trigger('resize');
                    }
					$("#J_awards_second_row").show();
                }else{
                    $("#J_push_get_msg_row").remove();
                    $("#J_awards_second_row").hide();
                    $("#J_awards_fourth_row").show();
                }
			},
			onSubmitError: function ()
			{
			    verc();
			}
		});

		$inputAlipay.blur(function ()
		{
			var vAli = $.trim($inputAlipay.val());
			if (InputValidation.isEmail(vAli))
			{
				$inputContact.val('').attr({
					'placeholder': '请填写您的手机号',
					'data-type': 'cellphone'
				}).placeholder();
			} else
			{
				var val = $inputContact.data('val');
				if (val)
				{
					$inputContact.val(val);
				}
				$inputContact.attr({
					'placeholder': '请填写您的常用邮箱',
					'data-type': 'mail'
				}).placeholder();
			}
		});
        
        if( $inputAlipayTip.length>0 )
        {
            $inputAlipay.on('blur.hidetip',function ()
            {
                $inputAlipayTip.hide();
            });

            $inputAlipay.on('focus.showtip',function ()
            {
                $inputAlipayTip.show();
            });
        }
	}

    function verc() {
        setTimeout(function () {
            $("#codeimg").attr("src", verifyCodeImageUrl + (new Date()).getTime());
        }, 25);

        return false;
    }

    window.verc = verc;
});

(function () {

    "use strict";

    var $window = $(window);
    var contentUrl = "//passport{0}/magicbar/user/customService?jsoncallback=?".format(Fanli.Utility.rootDomain);
    var jsUrl = "//static2.51fanli.net/static/?f=common/js/module/magicbar/magicbarbase.js,common/js/module/magicbar/customservice.js";
    var v = parseInt(new Date().getTime() / 300000);
    var csInstance;
    var triggerOffsetOriginal;
    var postData = {};

    $(document).on("click", ".J-mbar-mod-cs-show", function (ev) {
        ev.preventDefault();
        var $this = $(this);
        triggerOffsetOriginal = $this.offset();
        postData.klass = $this.data("klass");
        if (csInstance) {
            csInstance.trigger = $this;
            resetModPosition();
            csInstance.view.show();
            return;
        } else {
            buildDom($this);
        }
    }).on('click', '.J-mbar-mod-cs-close', function ()
    {
    	if (csInstance)
    	{
    		csInstance.view.hide();
    	}
    });

    function buildDom($trigger)
    {
    	$.getCacheJSONP(contentUrl, postData)
         .done(function (res) {
             if (!res.status) {
                 return;
             }

             var $view = $(res.data).appendTo("body");

             setTimeout(function () {
                 $.ajax({ url: "{0}&v={1}".format(jsUrl, v), dataType: "script", cache: true })
                  .done(function () {
                     csInstance = new MagicBarCustomService();
                     csInstance.view = $view;
                     csInstance.trigger = $trigger;
                     resetModPosition();
                     csInstance.setup();
                     csInstance.view.show();
                 });
             }, 0);
         });
    }

    function resetModPosition() {
    	var viewWidth = 350;
    	var viewHeight = $('.J-mbar-msg-box-cs').height() || 300;
    	var $view = csInstance.view;
    	var $trigger = csInstance.trigger;
    	var triggerOffset = $trigger.offset().top ?$trigger.offset():triggerOffsetOriginal;
    	var triggerWidth = $trigger.outerWidth(true);
    	var triggerHeight = $trigger.outerHeight(true);

    	var winScrollTop = $(window).scrollTop();
    	var winScrollLeft = $(window).scrollLeft();

    	var targetLeft;
    	var targetTop;

    	var upDistance = triggerOffset.top  - winScrollTop;
    	var downDistance = winScrollTop + $(window).height() - triggerOffset.top - triggerHeight;

    	var leftDistance = triggerOffset.left - winScrollLeft ;
    	var rightDistance = winScrollLeft + $(window).width() - triggerOffset.left - triggerWidth;


    	targetTop = upDistance > downDistance ? triggerOffset.top - viewHeight : triggerOffset.top + triggerHeight;
    	targetLeft = leftDistance > rightDistance ? triggerOffset.left - viewWidth : triggerOffset.left ;

    	$view.css({
    	    "left": targetLeft + "px",
    		'top': targetTop + "px"
        });
    }

}());

utmtOps.done(function () {
    (function ($) {
        /*
            test case: 
            1. abTestCookieValue = ""  => no ops
            2. no topbar => no ops
            3. topbar[data-betatest] = "" => no ops
            4. abTestCookieValue is "1c-2b-3c"
               topbar[data-betatest] is "1-2"
    
              Fanli.ABTest.getMvpCookie("1") => c
              Fanli.ABTest.getMvpCookie("2") => b
              Fanli.ABTest.getMvpCookie("3") => c
    
              Fanli.ABTest.clearMvpCookies();
              abTestCookieValue is "1c-2b"
    
              Fanli.ABTest.getMvpCookie("1") => c
              Fanli.ABTest.getMvpCookie("2") => b
              Fanli.ABTest.getMvpCookie("3") => ""          
            5. topbar[data-betatest] is "deleteab" => abtest cookie will be deleted
        */

        Fanli.ABTest = (function () {
            var separator = "-";
            var $topbar = $("#topbar");
            var abTestCookieName = "__utmt";
            var abTestCookieValue = abTestCookieName.getCookie();
            var abTestCookieValueArr = abTestCookieValue ? abTestCookieValue.split(separator) : [];
            var abTestTopbarValue = $topbar.data("betatest");
            var hasABTestTopbarValue = $topbar.length > 0 && !!abTestTopbarValue;
            var abTestTopbarValueArr = hasABTestTopbarValue ? abTestTopbarValue.split(separator) : [];

            function _getMvpCookie(storyId) {
                var returnValue = "";
                var tryReg;
                if (!abTestCookieValue || !storyId) {
                    return returnValue;
                }

                tryReg = abTestCookieValue.match(new RegExp(storyId + "[a-zA-Z]"));

                if (tryReg) {
                    returnValue = tryReg[0];
                }

                return returnValue;
            }

            function _clearMvpCookies() {
                if (hasABTestTopbarValue && abTestTopbarValue == "deleteab") {
                    abTestCookieName.setCookie("0", -1, Fanli.Utility.rootDomain, "/");
                    return;
                }

                var temObj = {};
                var finalArr = [];
                if (abTestCookieValueArr.length == 0 || abTestTopbarValueArr.length == 0) {
                    return;
                }

                for (var i = 0, len = abTestCookieValueArr.length; i < len; ++i) {
                    var tem = abTestCookieValueArr[i];
                    var tryReg = tem.match(/^(\d*)([a-zA-Z])$/);

                    if (tryReg) {
                        temObj[tryReg[1]] = tem;
                    }
                }

                for (var j = 0, jlen = abTestTopbarValueArr.length; j < jlen; ++j) {
                    var temp = abTestTopbarValueArr[j];
                    var tryItem = temObj[temp];
                    if (tryItem) {
                        finalArr.push(tryItem);
                    }
                }

                abTestCookieName.setCookie(finalArr.join(separator), 365, Fanli.Utility.rootDomain, "/");
            }

            return {
                getMvpCookie: _getMvpCookie,
                clearMvpCookies: _clearMvpCookies
            }

        }());

    }(jQuery, FLNS.register("Fanli.ABTest")));

    // clear unused abtest cookie when page loading
    Fanli.ABTest.clearMvpCookies();
});

(function ()
{
	Fanli.Common.add("ServiceOnline", function ()
	{
		var $document = $(document);
		var triggerSelector = ".J_show_customservice";
		var overlaySelector = "#J_fanli_service_online_pop";
		var gotoTriggerSelector = ".J_goto_trigger";
		var gotoPanelSelector = ".J_goto_panel";
		var questionContSelect = ".J_fanli_service_online_content";
		var endingContSelect = ".J_fanli_service_online_ending";

		var ajaxUrl = "//passport.fanli.com/magicbar/user/customService?jsoncallback=?";

		function setup()
		{
			bindEvent();
		}

		function bindEvent()
		{
			$document.on("click", triggerSelector, function (ev)
			{
				ev.preventDefault();
				buildOverlay();
			})
			.on("click", gotoTriggerSelector, function ()
			{
				var $this = $(this);
				gotoPanel($this);
			})
			.on("click", ".J_kf_trigger", function ()
			{
				open53kf();
			})
			.on("click", ".J_goto_ending_trigger", function ()
			{
				showEnding();
			});
		}

		function gotoPanel($trigger)
		{
			$trigger.parents(gotoPanelSelector).fadeOut("fast", function ()
			{
				$(overlaySelector).find("{0}[data-number='{1}']".format(gotoPanelSelector, $trigger.attr("data-href"))).fadeIn("fast");
			});

			$(".J_kf_trigger").attr("id", "ubt-kf-{0}".format($trigger.data("href")));
		}

		function buildOverlay()
		{
			if ($(overlaySelector).length)
			{
				showOverlay();
			}
			else
			{
				$.getCacheJSONP(ajaxUrl, function (JSON)
				{
					if (JSON.status == 1)
					{
						$("body").append(JSON.data);
						Fanli.Utility.requirejs(['overlay', 'expose'], showOverlay);
						getKfStatus();
					}
				});
			}
		}

		function getKfStatus()
		{
			topbarGetInfo.done(function ()
			{
				var $topbar = $("#topbar");

				if ($topbar.data('kfStatus'))
				{
					$(overlaySelector).find(".J-kf-online").show();
				}
				else
				{
					$(overlaySelector).find(".J-kf-offline").show();
				}
			});
		}

		function showOverlay()
		{
			$(overlaySelector).data("overlay") ? $(overlaySelector).data("overlay").load() : bindOverlay();
		}

		function bindOverlay()
		{
			$(overlaySelector).overlay(
			{
				top: "13%",
				mask: {
					color: "#000",
					opacity: 0.5
				},
				fixed: false,
				onClose: function ()
				{
					$(overlaySelector).find(gotoPanelSelector).hide();
					$(overlaySelector).find("{0}[data-number='0']".format(gotoPanelSelector)).show();
					$(overlaySelector).find(questionContSelect).show();
					$(overlaySelector).find(endingContSelect).hide();
				}
			}).data('overlay').load();
		};

		function showEnding()
		{
			$(overlaySelector).find(questionContSelect).fadeOut("fast", function ()
			{
				$(overlaySelector).find(endingContSelect).fadeIn("fast");
			});

			setTimeout(function ()
			{
				$(overlaySelector).data("overlay").close();
			}, 3000);
		}

		setup();

	}).ServiceOnline();
})(FLNS.register("Fanli.Common"));