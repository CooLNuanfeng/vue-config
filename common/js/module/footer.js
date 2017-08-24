(function($){
	$(function(){
		//back to top		
		if((typeof _fanliBacktop !== 'undefined') ? _fanliBacktop : true){
			if($.fn.sidebar){
				$('#backtop').sidebar({
					min: 60,
					relative: true,
					relativeWidth: 980,
					backToTop: true,
					backContainer: '#btn-backtop'
				});
			}
		}

		//footer fa
		var $footerFa = $('#J-footer-fa');
		if('footerfa'.getCookie() != 1 && $footerFa.length > 0 && $footerFa.css('visibility') != 'hidden' && $.fn.sidebar && $.fn.adloader){
			var footerFaClose = true;

			$footerFa.css({'background': $footerFa.find('img').attr('alt')});

			if($.fn.sidebar){
				$footerFa.sidebar({
					min: 0,
					relative: true,
					relativeWidth: -990
				});
			}

			if(footerFaClose){
				$footerFa.append('<a href="javascript:void(0);" class="close">&times;</a>').on('click', '.close', function(){
					$footerFa.remove();
					'footerfa'.setCookie('1', '0.083', Fanli.Utility.rootDomain, '/');
				});
			}
		}
		else{
			$footerFa.remove();
		}

        //showWebNav
        function showWebNav(){
            var $trigger = $('.J_ft_showwebnav');
            var $panel = $('.J_ft_webnav');

			if($panel.find('a').length > 0){
				$trigger.click(function()
				{
					if( $trigger.hasClass('expand') ){
						$panel.hide();
						$trigger.removeClass('expand').find('.J_arr').html('&and;');
					}else{
						$panel.show();
						$trigger.addClass('expand').find('.J_arr').html('&or;');
					}
				});
			}
			else{
				$trigger.remove();
			}
        }
        showWebNav();
	});

	FLNS.register("Fanli.Public.Footer");

	Fanli.Public.Footer.add("InviteEnter", function ()
	{
		var $window = $(window);
		var $enterWrap = $("#J_fl_footer_invite_enter");
		var cookieName = "FL_FOOTER_INVITE_ENTER";
		var isIE6 = !!window.ActiveXObject && !window.XMLHttpRequest;

		if ($enterWrap.length)
		{
			setup();
		}

		function setup()
		{
			bindLiveEvent();
			buildIe6Fix();
		}

		function bindLiveEvent()
		{
			if (cookieName.getCookie() != "1")
			{
				$enterWrap.fadeIn("fast");
			}

			$enterWrap.on("click", ".J_close_btn", function ()
			{
				$enterWrap.fadeOut("fast");
				cookieName.setCookie("1", 1, Fanli.Utility.rootDomain, "/");
			});
		}

		function buildIe6Fix()
		{
			if (isIE6)
			{
				$enterWrap.css({ 'position': 'absolute', 'top': $window.scrollTop() + $window.height() - $enterWrap.height() });

				$window.on('scroll.INVITE', function ()
				{
					$enterWrap.css({ 'position': 'absolute', 'top': $window.scrollTop() + $window.height() - $enterWrap.height() });
				});
			}
		}

	}).InviteEnter();
})(jQuery);