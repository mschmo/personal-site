
$(document).ready(function() {

    $('#send-message').submit(function(e) {
        e.preventDefault();
        $.post('/send_message/', $(this).serialize()).done(function(data) {
            $('#holla-at-me').hide();
            $('#thanks-for-the-holla').fadeIn('slow');
        });
    });

    $('#send-again').click(function(e) {
        e.preventDefault();
        $('#thanks-for-the-holla').hide();
        $('#holla-at-me').fadeIn('slow');
    });

    function tab_click(tab) {
        if (tab.hasClass('active'))
            return false;
        $("a[id^='tab_']").removeClass('active');
        tab.addClass('active');
        $("div[id^='tab_body_']").hide();
    }

    $('#tab_blog').click(function() {
        tab_click($(this));
        $('#tab_body_blog').fadeIn('slow');
    });
    $('#tab_portfolio').click(function() {
        tab_click($(this));
        $('#tab_body_portfolio').fadeIn('slow');
    });
    $('#tab_contact').click(function() {
        tab_click($(this));
        $('#tab_body_contact').fadeIn('slow');
    });

});