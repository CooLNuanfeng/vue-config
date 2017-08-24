// need inclue base.js

(function($){
	FLNS.register('KE.Plugin');

	var $doc = $(document);
	var $win = $(window);

	KE.Plugin.add('pubVote',function(){
		var heightWin = $win.height();
		var $popVote = $('#J-ke-pop-vote');
		var $ul = $('#J-vote-ul');
		var topPopVote = (heightWin - $popVote.height()) / heightWin * 50 + '%';

		var errorMap = {
			'emptyTitle':'请填写投票主题',
			'optionLength':'投票选项至少为2项且不能为空'
		}

		var li = '<li><input type="text"class="vote-input vote-input-option J-vote-option" name="voption"/><a href="javascript:void(0);" class="del-option simsun J-del-option">&times;</a></li>';

		bindEvents();


		function bindEvents()
		{
			KindEditor.plugin('vote', function(K) {
				var $doc = $(document);
				var self = this, name = 'vote';
				var $pop = $('#J-ke-pop-vote');
				self.clickToolbar(name, function() {
					showPopup();
				});

			});

			$doc.on('click','.J-del-option',function(){
				var $this = $(this);
				$this.parent().remove();
			})
			.on('click','#J-ke-vote-add-option',function(){
				addOption();
			})
			.on('click','#J-ke-vote-submit',function(){
				submitHandler();
			})
			.on('click','#J-ke-vote-cancel',function(){
				$('#J-pop-pub-ariticle').removeData('vote');
				hidePopup();
			});
		}

		function showPopup()
		{
			$popVote.css({
				'top':topPopVote
			}).show().data('popup',1);
		}

		function hidePopup()
		{
			$popVote.hide();
		}

		function addOption()
		{
		    if ($("li", $ul).length < 8) {
		        $ul.append(li);
		    } else {
		        alert("最多只能有8个投票选项！");
		    }
		}

		function submitHandler(){
			if(validation()){
				insertParm();
				hidePopup();
			}
		}

		function insertParm()
		{
			$('#J-pop-pub-ariticle').data('vote',1);
		}

		function validation(){
			var $options = $('.J-vote-option');
			var checkedOptionLength = 0;
			var minOptionLength = 2;

			// if($('#J-vote-title').val() == ''){
			// 	alert(errorMap.emptyTitle);
			// 	return false;
			// }

			$options.each(function(){
				var $this = $(this);
				if($this.val() != ''){
					checkedOptionLength ++
				}
			});

			if(checkedOptionLength < minOptionLength){
				alert(errorMap.optionLength);
				return false;
			}

			return true;
		}

	}).pubVote();

})(jQuery);
