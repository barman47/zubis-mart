$(document).ready(function () {
    $('.dropdown-trigger').dropdown({ hover: false });
    $('.sidenav').sidenav();
    $('.modal').modal();

    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById('top').style.display = 'block';
        } else {
            document.getElementById('top').style.display = 'none';	
        }
    };

    $('#top').on('click', function (event) {
        if (this.hash !== '') {
            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function () {
                window.location.hash = hash;
            });
        }
    });

    $('#signup-link').on('click', function (event) {
        event.preventDefault();
        const url = event.target.attributes[0].nodeValue;
        // $.ajax({
        //     method: 'GET',
        //     url
        // }).done(function (msg) {
        //     console.log(msg)
        //     // $('body').val(msg);
        // }).fail(function (jqXHR, textStatus) {

        // });
        $('main').load(url, function() {
            $('#navbar').css('display', 'none');
            $('footer').css('display', 'none');
            $('.modal').modal('close');
        });
    });
});