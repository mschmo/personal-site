
$(document).ready(function() {

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