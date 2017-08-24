/*
story#20945 此功能全部下线

js:
Sidebar.Feedback.init({
	'postUrl': 'http://taobao.fanli.com/faq/ajaxFeadback?source=3&jsoncallback=?'
});
*/

(function($){
	FLNS.register('Fanli.SidebarFeedback');
	var defaults = {
			'offset': 260,
			'target': true,
			'postUrl': 'http://taobao.fanli.com/faq/ajaxFeadback?jsoncallback=?'
		};

	Fanli.SidebarFeedback.add('init', function(options){
		var isShow = $('#topbar').data('closelightfeedback') != 1;
		var settings = $.extend(defaults, options);
		var target = settings.target;

		if(isShow){
			sendAjax();
		}

		function sendAjax(){
			$.getCacheJSONP('http://passport{0}/light/user/lightFeedBack?jsoncallback=?'.format(Fanli.Utility.rootDomain), function(data){
				if(data.status == '1'){
					$('body').append(data.data);

					bindSidebar();

					if(!!target){
						if(InputValidation.isUrl(target)){
							$('#J-btn-side-feedback').attr({
								'href': target,
								'target': '_blank'
							});
						}
						else{
							bindEvent();
						}
					}
				}
			});
		}

		function bindSidebar(){
			var $backtop = $('#backtop');
			
			if($.fn.sidebar){
				$('#J-side-feedback').css({
					'margin-left': $backtop.css('margin-left'),
					'bottom': settings.offset + 'px'
				}).sidebar({
					min: 60,
					ieOffset: settings.offset,
					relative: true,
					relativeWidth: 980
				});
			}
		}

		function bindEvent(){
			var $btn = $('#J-btn-side-feedback');
			var $dialog = $('#faq-feedback-dialog');
			var $intmsg = $dialog.find('.faq-msg');
			var $intcontact = $dialog.find('.faq-contact');
			var $errmsg = $dialog.find('.faq-msg-err');
			var $errcontact = $dialog.find('.faq-contact-err');

			$btn.on('click', function(){
				$('.J-side-dialog').not('#faq-feedback-dialog').hide();

				if(!$dialog.is(':visible')){
					$dialog.show();
				}
				else{
					$dialog.hide();
				}
			});

			if($.fn.placeholder){
				$dialog.find('[placeholder]').placeholder({
					type: 'value'
				});
			}

			$dialog.on('click', '.faq-submit', function(e){
				e.preventDefault();
				$errmsg.html('');
				$errcontact.html('');

				var $msg = $intmsg;
				var $contact = $intcontact;
				var msg = $.trim($msg.val());
				var contact = $.trim($contact.val());
				var phMsg = $intmsg.attr('placeholder');
				var phContact = $intcontact.attr('placeholder');
				var postData;

				if (msg == '' || msg == phMsg) {
					$errmsg.html('<i class="err"></i>请输入您的意见和建议！');
					$msg.focus();
					return;
				}
				else if (contact == '' || contact == phContact) {
					$errcontact.html('<i class="err"></i>请留下您的联系方式，方便我们与您联系。');
					$contact.focus();
					return;
				}

				postData = {
					'msg': msg,
					'contact': contact
				};

				$.getJSON(settings.postUrl, postData, function(data){
					if (data.status == 1) {
						$msg.val('');
						$contact.val('');
						alert(data.info);
					}
					else {
						$errcontact.html(data.info);
					}
				});
			});

			$dialog.on('click', '.faq-close', function(){
				$dialog.hide();
			});
		}
	});
})(jQuery);