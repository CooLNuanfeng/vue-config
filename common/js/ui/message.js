// require jquery
// will add cookie control later
$(function(){
	$('div.message').find('.close').click(function(){
		$(this).parent().hide();
	});
});