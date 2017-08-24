(function($){
	var $feedback = $('#J-qq-feedback');
	if($feedback.length > 0){
		var $feedbackBox = $feedback.find('.qq-feedback-box');
		$feedback.on({
			'mouseover': function(){
				$feedbackBox.show();
			},
			'mouseout': function(){
				$feedbackBox.hide();
			}
		});
	}
})(jQuery);