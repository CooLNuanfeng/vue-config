//homepage waterfall ad
(function(){
	var $waterfall = $('#waterfall');
	var delayTimer = 4000;

	function waterfall(){
		var $links = $waterfall.find('a');
		var $imgs = $waterfall.find('img');
		var pattern = /^#[0-9a-fA-F]{6}$/;
		
		if($links.length > 1){
			var $large = $links.eq(0);
			var $small = $links.eq(1);
			var id = $large.data('id');
			var bgColor = $large.find('img').attr('alt');
			var cookie = 'ad_waterfall_' + id;

			$large.find('img').load(function(){
				$links.hide();

				if(pattern.test(bgColor)){
					$large.find('img').removeAttr('alt');
					$waterfall.css('background', bgColor);
				}

				$waterfall.show();
				if(!cookie.getCookie()){
					$large.slideDown(500, function(){
						setTimeout(function(){
							$large.animate({
								'height': '80px'
							}, 500, function(){
								$small.show();
								$waterfall.height('80');
								$large.hide();
							});
						}, delayTimer);
					});
					cookie.setCookie('1', '1', Fanli.Utility.rootDomain, '/');
				}
				else{
					$small.slideDown();
				}
			});
		}
		else if($links.length > 0){
			var bgColor = $waterfall.find('img').attr('alt');

			$waterfall.find('img').load(function(){
				if(pattern.test(bgColor)){
					$waterfall.find('img').removeAttr('alt');
					$waterfall.css('background', bgColor);
				}
				$waterfall.slideDown();
			});
		}
	}	

	$waterfall.adloader({
		onReady: function(){
			waterfall();
		}
	});
})();