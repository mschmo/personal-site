function switchLights(direction) {
    var $headers = $('h1, h2, h3, h4, h5, h6');
    if (direction === 'on') {
        $('body').css('background', '#fff').css('color', '#444');
        $headers.not(".dont-toggle").css('color', '#181818');
        $('a').not('.active').css('color', '#2C3E50');
    } else if (direction === 'off') {
        $('body').css('background', '#252120').css('color', '#a5a5a5');
        $headers.not(".dont-toggle").css('color', '#e6e6e6');
        $('a').not('.active').css('color', '#4198ef');
        $('#toggle-light').css('color', '#e65559');
    }
}

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
        console.log(tab);
        tab_click(tab);
        $(body).fadeIn('slow');
    }

    $('#tab_blog').click(function() {
        change_tab($(this), '#tab_body_blog');
    });
    $('#tab_portfolio').click(function() {
        change_tab($(this), '#tab_body_portfolio');
    });
    $('#tab_contact').click(function() {
        change_tab($(this), '#tab_body_contact');
    });

    var url_hash = window.location.hash;
    if (location.pathname == '/' && url_hash != '#portfolio' && url_hash != '#contact') {
        change_tab($('#tab_blog'), '#tab_body_blog');
    } else if (url_hash == '#portfolio') {
        change_tab($('#tab_portfolio'), '#tab_body_portfolio');
    } else if (url_hash == '#contact') {
        change_tab($('#tab_contact'), '#tab_body_contact');
    }


    var schmo_lights = sessionStorage.getItem('schmoLights') || 'on';
    switchLights(schmo_lights);
    $('#toggle-light').on('click', function(e) {
        if (schmo_lights === 'on') {
            schmo_lights = 'off';
        } else if (schmo_lights === 'off') {
            schmo_lights = 'on';
        }
        sessionStorage.setItem('schmoLights', schmo_lights);
        switchLights(schmo_lights);
        return false;
    });

});
