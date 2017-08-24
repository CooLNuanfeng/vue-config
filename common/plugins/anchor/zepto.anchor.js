(function ($) {

	var $window = $(window);

	//init
	scrollToAnchor();

	//anthor tracking(story#8855)
	function getQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		else{
			return null;
		}
	}

	function scrollToAnchor(){
		var url = window.location.href;
		var hasAnchor = url.indexOf('anchor=') > -1;
		var anchor = getQueryString('anchor');

		if(hasAnchor && $(anchor).length>0) {
			$window.on('load', function () {
				window.scrollTo(0, $(anchor).offset().top);
			});
		}
	}

})(Zepto);