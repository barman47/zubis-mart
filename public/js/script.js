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
        // const url = event.target.attributes[0].nodeValue;
        // $.ajax({
        //     method: 'GET',
        //     url
        // }).done(function (msg) {
        //     console.log(msg)
        //     // $('body').val(msg);
        // }).fail(function (jqXHR, textStatus) {

        // });
        // $('main').load(url, function() {
        //     $('#navbar').css('display', 'none');
        //     $('footer').css('visibility', 'hidden');
        //     $('.modal').modal('close');
        // });
        $('#signup-form-container').css('display', 'block');
        $('#main-section').css('display', 'none');
        $('#topButton').css('display', 'none');
        $('#navbar').css('display', 'none');
        $('footer').css('visibility', 'hidden');
        $('.modal').modal('close');
        $('.sidenav').sidenav('close');
    });
    $('#signupFormLogo').on('click', function (event) {
        $('#signup-form-container').css('display', 'none');
        $('#main-section').css('display', 'block');
        $('#topButton').css('display', 'block');
        $('#navbar').css('display', 'block');
        $('footer').css('visibility', 'visible');
        $('.modal').modal('close');
    });

    
});