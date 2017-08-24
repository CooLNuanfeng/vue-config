// require jquery
// will add cookie control later
$(function(){
	$('div.tooltip').find('.close').click(function(){
		$(this).parent().hide();
	});
});