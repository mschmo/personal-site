/*
*  Matthew Schmoyer
*  Aug 17 2013
*
*/

$(document).ready(function() {
	console.log('Locked and Loaded');

	$('#tab_blog').on('click', function() {
		if ($(this).hasClass('active'))
			return false;
		$("a[id^='tab_']").removeClass('active');
		$(this).addClass('active');
		$("div[id^='tab_body_']").hide();
		$('#tab_body_blog').fadeIn('slow');
	});
	$('#tab_portfolio').on('click', function() {
		if ($(this).hasClass('active'))
			return false;
		$("a[id^='tab_']").removeClass('active');
		$(this).addClass('active');
		$("div[id^='tab_body_']").hide();
		$('#tab_body_portfolio').fadeIn('slow');
	});
	$('#tab_contact').on('click', function() {
		if ($(this).hasClass('active'))
			return false;
		$("a[id^='tab_']").removeClass('active');
		$(this).addClass('active');
		$("div[id^='tab_body_']").hide();
		$('#tab_body_contact').fadeIn('slow');
	});

});