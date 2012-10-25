jQuery(document).ready(function() {	
	// make the custom add reddot expand on click (and not on hover)
	$('.reddot-custom-add-menu').click(function() {
		$(this).toggleClass('reddot-custom-add-menu-display');
		return false;
	});
	
});