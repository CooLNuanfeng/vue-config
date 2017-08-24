///<reference path="../../../libs/jquery/jquery-1.7.2.js" />
///<reference path="../../js/fanli/trace/ubt.js" />
///<reference path="../../js/base.js" />

//baidu
var _hmt = _hmt || [];

function Ftrack(base){
	for(var i = 1, length = arguments.length; i < length; i++){
		_hmt.push(['_trackEvent', base + '_' + arguments[i], 'click', '']);
	}
	return false;
}

/*
function Btrack(base){
	for(var i = 1, length = arguments.length; i < length; i++){
		_hmt.push(['_trackPageview', base + '_' + arguments[i]]);
	}
	return false;
}
*/

(function() {
	var fanliId = '545c20cb01a15219bfeb0d1f103f99c1';
	var budouId = '8b40dd24ee21b28e2c2b108b4f804cb6';
	var _bdId = document.domain.indexOf('budou.com') > -1 ? budouId : fanliId;

	if(typeof(_baidu) != 'undefined'){
		_bdId = _baidu;
	}
	
	var hm = document.createElement("script");
	hm.src = '//hm.baidu.com/hm.js?' + _bdId;
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
})();