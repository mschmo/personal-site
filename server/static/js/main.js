
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

    function change_tab(tab, body) {
        tab_click(tab);
        $(body).fadeIn('slow');
    }

    $('#tab_thoughts').click(function() {
        change_tab($(this), '#tab_body_thoughts');
    });
    $('#tab_portfolio').click(function() {
        change_tab($(this), '#tab_body_portfolio');
    });
    $('#tab_contact').click(function() {
        change_tab($(this), '#tab_body_contact');
    });

    var url_hash = window.location.hash;
    if (location.pathname == '/' && url_hash != '#portfolio' && url_hash != '#contact') {
        change_tab($('#tab_thoughts'), '#tab_body_thoughts');
    } else if (url_hash == '#portfolio') {
        change_tab($('#tab_portfolio'), '#tab_body_portfolio');
    } else if (url_hash == '#contact') {
        change_tab($('#tab_contact'), '#tab_body_contact');
    }

});