/**
 * jQuery social share button plugin v0.8
 * zhe.fu@fanli.com
 * 
 * HTML:
 * <div id="share" class="fshare fs-16">
		分享到：
		<a href="#" title="分享到QQ空间" class="fs-qzone">qzone</a>
		<a href="#" title="分享到新浪微博" class="fs-tsina">tsina</a>
		<a href="#" title="分享到QQ微博" class="fs-tqq">tqq</a>
		<a href="#" title="分享到人人" class="fs-renren">renren</a>
		<a href="#" title="分享到豆瓣" class="fs-douban">douban</a>
		<a href="#" title="分享到QQ好友" class="fs-qq">qq</a>
	</div>
	
	Javascript:
	$('#share').sharebutton();
**/

;(function($){
	$.fn.sharebutton = function(settings){
		settings = $.extend({
			url: document.location,	//分享的网址
			title: document.title,	//分享的标题(可选，默认为所在页面的title) //人人、qzone支持
			summary: '',			//分享摘要(可选) qq好友、qzone支持
			site: '',
			desc: '',				//分享的文字内容(可选)
			pic: '',				//分享图片的路径(可选)
			popup: true,
			width: 610,
			height: 500
		}, settings);
		
		return this.each(function(){
			var $this = $(this);
			var site = encodeURIComponent(settings.site);
			var width = settings.width;
			var height = settings.height;
			
			function tabOpen(obj, url){
				obj.attr({
					target: '_blank',
					href: url
				});
			}
			
			function winOpen(obj, url, w, h){
				if(settings.popup){
					var w = w || width;
					var h = h || height;
					window.open(url, site, 'width='+w+',height='+h+', top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
				}
				else{
					tabOpen(obj, url);
				}
			}
			
			function getProp(obj){
				return {
					url: encodeURIComponent(obj.data('url') || settings.url),
					title: encodeURIComponent(obj.data('title') || settings.title),
					summary: encodeURIComponent(obj.data('summary') || settings.summary),
					desc: encodeURIComponent(obj.data('desc') || settings.desc),
					pic: encodeURIComponent(obj.data('pic') || settings.pic)
				}
			}

			//qzone
			$this.on('click', '.fs-qzone', function(){
				var $this = $(this);
				var url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + getProp($this).url + '&title=' + getProp($this).title + '&summary=' + getProp($this).summary + '&desc=' + getProp($this).desc + '&pics=' + getProp($this).pic + '&site=' + site;
				winOpen($(this), url);
			});
			//tsina
			//新浪微博没有标题，故title=desc
			$this.on('click', '.fs-tsina', function(){
				var $this = $(this);
				var url = 'http://service.weibo.com/share/share.php?title=' + getProp($this).desc + '&url=' + getProp($this).url + '&source=' + site + '&pic=' + getProp($this).pic + '&appkey=1321169129';
				winOpen($(this), url);
			});
			//tqq
			//qq微博没有标题，故title=desc
			$this.on('click', '.fs-tqq', function(){
				var $this = $(this);
				var url = 'http://share.v.t.qq.com/index.php?c=share&a=index&title=' + getProp($this).desc + '&url=' + getProp($this).url + '&site=' + site + '&pic=' + getProp($this).pic;
				winOpen($(this), url);
			});
			//renren
			$this.on('click', '.fs-renren', function(){
				var $this = $(this);
				var url = 'http://widget.renren.com/dialog/share?resourceUrl=' + getProp($this).url + '&srcUrl=' + getProp($this).url + '&title=' + getProp($this).title + '&description=' + getProp($this).desc + '&pic=' + getProp($this).pic;
				winOpen($(this), url);
			});
			//douban
			$this.on('click', '.fs-douban', function(){
				var $this = $(this);
				var url = 'http://shuo.douban.com/!service/share?href=' + getProp($this).url + '&name=' + getProp($this).title + '&text=' + getProp($this).desc;
				winOpen($(this), url);
			});
            //QQ好友
			$this.on('click', '.fs-qq', function(){
				var $this = $(this);
				var url = 'http://connect.qq.com/widget/shareqq/index.html?url=' + getProp($this).url + '&title=' + getProp($this).title + '&desc=' + getProp($this).desc + '&pics=' + getProp($this).pic + '&summary=' + getProp($this).summary;
				winOpen($(this), url, 750, 620);
			});
			//QQ mail
			$this.on('click', '.fs-qqmail', function(){
				var $this = $(this);
				var url = 'http://mail.qq.com/cgi-bin/qm_share?url=' + getProp($this).url + '&title=' + getProp($this).title + '&desc=' + getProp($this).desc + '&summary=' + getProp($this).summary + '&pics=' + getProp($this).pic + '&to=qqmail';
				tabOpen($(this), url);
			});
			//Gamil
			$this.on('click', '.fs-gmail', function(){
				var $this = $(this);
				var url = 'https://mail.google.com/mail/?view=cm&su=' + getProp($this).title + '&body=' + getProp($this).desc + '%20' + getProp($this).url;
				tabOpen($(this), url);
			});
			//163mail
			$this.on('click', '.fs-163mail', function(){
				var $this = $(this);
				var url = 'http://mail.163.com/share/share2friend.htm#' + decodeURIComponent(getProp($this).desc) +  '^^' + decodeURIComponent(getProp($this).pic) + '^^' + decodeURIComponent(getProp($this).url);
				tabOpen($(this), url);
			});
		});
	};
})(jQuery);