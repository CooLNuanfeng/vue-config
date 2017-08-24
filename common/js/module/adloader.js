/**
 * jQuery ad loader plugin v1.3
 *
 * ad load usage #1:
 * <div id="spotlight" data-name="index_olduser" data-type="list" data-width="300" data-height="100"></div>
 * $('div.fanli-ad').adloader();
 *
 * ad load usage #2:
 * <div id="spotlight"></div>
 * $('#spotlight').adloader({
 *	 name: 'index_olduser',
 *	 type: 'random',
 *	 width: 300,
 *	 height: 100,
 *	 onLoad: function(){}
 * });
 *
 * ad track usage:
 * <div id="spotlight">...</div>
 * $('#spotlight').adtracker();
 *
**/

; (function ($) {
	function rebuildMarkCode(adid) {
		var markCodeCookie = "markcode";
		var markCodeValue = "markcode".getCookie();
		var execArr = /^([^\.]+)\.([^\.]+)\.([^\.]+)\.([^\.]+)$/ig.exec(markCodeValue)

		if(!markCodeValue || !execArr) {
			markCodeCookie.setCookie("0.0.{0}.1".format(adid), 0, Fanli.Utility.rootDomain, "/");
		}else {
			markCodeCookie.setCookie("{0}.{1}.{2}.{3}".format(execArr[1],
				execArr[2],
				adid,
				($.isNumeric(execArr[4]) ? (parseInt(execArr[4]) + 1 ) : 1),
				0),
			0, Fanli.Utility.rootDomain, "/");
		}
	}

	$.fanliAdTrack = {
		//ad view tracking
		viewEvent: function(id){
			if(typeof id != 'undefined'){
				UBT.track("event", "view", "id", id);
			}
		},
		//ad click tracking
		clickEvent: function(id){
			if(typeof id != 'undefined'){
				UBT.track("event", "click", "id", id);
				rebuildMarkCode(id);
			}
		}
	};

	$.fn.adtracker = function(settings){
		settings = $.extend({
			clickQuery: '.fa-link',
			viewQuery: '.fa-img'
		}, settings);

		return this.each(function(){
			var $this = $(this);

			$this.on('click', settings.viewQuery, function () {
				var $this = $(this);
				var id = $this.closest(settings.clickQuery).data('id') || $this.data('id');
				$.fanliAdTrack.clickEvent(id);

			});

			$this.find(settings.viewQuery).each(function () {
				var $this = $(this);
				var id = $this.closest(settings.clickQuery).data('id') || $this.data('id');
				$.fanliAdTrack.viewEvent(id);
			});

		});
	};

	$.fn.adloader = function(settings){
		settings = $.extend({
			name: null,
			type: null,
			href: true,
			div: false,
			width: null,
			height: null,
			onReady: null,
			onLoad: null,
			onError: null
		}, settings);

		return this.each(function(){
			var $this = $(this);
			var prefix = '//event.fanli.com/proxy.php?key=';
			var adName = settings.name || $this.data('name');
			var adType = settings.type || $this.data('type');
			var adWidth = settings.width || $this.data('width');
			var adHeight = settings.height || $this.data('height');
			var adHref = settings.href;
			var adDiv = settings.div;
			var adUrl = prefix + adName + '&stamp=' + parseInt(new Date().getTime()/300000);

			//ad template render
			function renderList(json){
				var html = [];
				var len = json.length;

				for (i = 0; i < len; i++) {
					var it = json[i];
					var href = it.link;
					var chkHref = adHref && (it.link != '');

					if(it.file != ''){
						if(chkHref){
							html.push('<a href="', href, '" data-id="', it.id, '" class="fa-link J_spm_fa_link" target="_blank" rel="nofollow">');
						}
						else if(adDiv){
							html.push('<div class="fa-link" data-id="', it.id, '">');
						}
						html.push('<img src="', it.file, '"');
						if(adWidth && adHeight){
							html.push(' width="',adWidth, '" height="',adHeight, '"');
						}
						html.push(' alt="', it.name, '" class="fa-img" />');
					}
					else{
						if(chkHref){
							html.push('<a href="', href, '" data-id="', it.id, '" class="fa-text J_spm_fa_link" target="_blank" rel="nofollow">');
						}
						else if(adDiv){
							html.push('<div class="fa-link" data-id="', it.id, '">');
						}
						html.push(it.name);
					}

					if(chkHref){
						html.push('</a>');
					}
					else if(adDiv){
						html.push('</div>');
					}

					$.fanliAdTrack.viewEvent(it.id);

				}
				html = html.join('');
				$this.append(html);
			}

			function renderRandom(json){
				var html = [];
				var len = json.length;
				var i = Math.ceil(Math.random() * len);
				var it = json[i - 1];
				var chkHref = adHref && (it.link != '');
				var href = it.link;

				if(chkHref){
					html.push('<a href="', href, '" data-id="', it.id, '" class="fa-link J_spm_fa_link" target="_blank" rel="nofollow">');
				}
				else if(adDiv){
					html.push('<div class="fa-link" data-id="', it.id, '">');
				}
				html.push('<img src="', it.file, '"');
				if(adWidth && adHeight){
					html.push(' width="',adWidth, '" height="',adHeight, '"');
				}
				html.push(' alt="', it.name ,'" class="fa-img" />');
				if(chkHref){
					html.push('</a>')
				}
				else if(adDiv){
					html.push('</div>');
				}

				$.fanliAdTrack.viewEvent(it.id);

				html = html.join('');
				$this.append(html);
			}

			function build(){
				var json = [];
				
				try{
					eval('json = ' + adName + 'Json;');

					if(json.length > 0){
						if(adType == 'random'){
							renderRandom(json);
						}
						else{
							renderList(json);
						}
						
						//callback
						if(settings.onReady != null){
							settings.onReady();
						}
						
						if(settings.onLoad != null){
							$this.find('img:last').load(function(){
								settings.onLoad();
							});
						}
					}
					else{
						$this.hide();
						if(settings.onError != null){
							settings.onError();
						}
					}
				}
				catch(e){
					if(window.console){
						console.warn('Hosts error(event.fanli.com)??');
					}
				}
			}

			//get ad
			if(window.head){
				head.js(adUrl, function(){
					build();
				});
			}
			else{
				$.ajax({
					url: adUrl,
					dataType: 'script',
					cache: true,
					success: function(){
						build();
					}
				});
			}
		});
	};
	
	//default adtracker
	function bindTrackEvents() {
		$('.J-adtracker, .J_adtracker').adtracker();
		$('.J_spm_fa_link').on("click", function () {
			var id = $(this).data("id");
			if (id) {
				UBT.track("event", "click", "id", id);
				rebuildMarkCode(id);
			}
		});
	}

	if (typeof wagv != "undefined" && wagv.pageJsLoadedCallbackArr) {
		wagv.pageJsLoadedCallbackArr.push(function () {
			bindTrackEvents();
		});
	} else {
		//default adtracker
		$(window).on('load', function () {
			bindTrackEvents();
		});
	}
})((typeof(jQuery) != 'undefined') ? jQuery : window.Zepto);