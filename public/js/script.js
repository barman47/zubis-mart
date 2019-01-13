$(document).ready(function () {
    $('.dropdown-trigger').dropdown({ hover: false });
    $('.modal').modal();
    $('.sidenav').sidenav();
    $('.scrollspy').scrollSpy();

    $('.successClose').click(function () {
        $('#successText').remove();
    });

    $('.failureClose').click(function () {
        $('#failureText').remove();
    });

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
        $('#signup-form-container').css('display', 'block');
        $('#main-section').css('display', 'none');
        $('#sell-main').css('display', 'none');
        $('#topButton').css('display', 'none');
        $('#navbar').css('display', 'none');
        $('.breadcrumb-container').css('display', 'none');
        $('.breadcrumb-container').css('display', 'none');
        $('section').css('display', 'none');
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

    var elems = document.querySelectorAll('.slider');
    var instances = M.Slider.init(elems, {'height' : 350, 'indicators' : true});
    $('.tooltipped').tooltip();
    $('.parallax').parallax();

    const signupForm = document.signupForm;
    const loginForm = document.loginForm;

    const inputs = [
        signupForm.firstName,
        signupForm.lastName,
        signupForm.email,
        signupForm.phone,
        signupForm.password,
    ];

    const loginEmail = loginForm.loginEmail;
    const loginPassword = loginForm.loginPassword;

    const emailRegExp = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    const phoneRegExp = /^\d{11}$/;
    const passwordRegExp = /^[\w@-]{8,20}$/;

    const signupLoader = document.querySelector('#signupLoader');
    const loginLoader = document.querySelector('#loginLoader');

    function isEmpty(element) {
        if (element.value === '' || element.value.trim() === '') {
            return true;
        } else  {
            return false;
        }
    }

    function submitLoginForm (event) {
        event.preventDefault();
        if (isEmpty(loginEmail)) {
            loginEmail.classList.add('invalid');
            loginEmail.focus();
        } else if (isEmpty(loginPassword)) {
            loginPassword.classList.add('invalid');
            loginPassword.focus();
        } else {
            loginLoader.style.visibility = 'visible';
            $('#loginForm :input').prop('disabled', true);
            $.ajax({
                method: 'POST',
                url: '/users/login',
                dataType: 'json',
                data: {
                    loginEmail: loginEmail.value,
                    loginPassword: loginPassword.value
                }
            }).done(function (msg, status, jqXHR) {
                loginLoader.style.visibility = 'hidden';
                const id = msg.id;
                const url = `/users/${id}`;
                window.location.href = url;
            }).fail(function (jqXHR, textStatus) {
                if (jqXHR.status === 404) {
                    M.toast({
                        html: jqXHR.responseJSON.msg,
                        displayLength: 15000,
                        classes: 'password-error-message'
                    });
                    loginLoader.style.visibility = 'hidden';
                    $("#loginForm :input").prop("disabled", false);
                    loginEmail.focus();
                } else {
                    M.toast({ html: 'Login Failed!' });
                    loginLoader.style.visibility = 'hidden';
                    $("#loginForm :input").prop("disabled", false);
                    loginEmail.focus();
                }
            });
        }
    }

    function submitSignupForm (event) {
        let isFormOkay = null;
        event.preventDefault();        
        for (var i = 0; i < inputs.length; i++) {
            if (isEmpty(inputs[i])) {
                inputs[i].classList.add('invalid');
                inputs[i].focus();
                isFormOkay = false;
                break;
            } else {
                isFormOkay = true;
            }
        }

        if (isFormOkay === true) {
            signupLoader.style.visibility = 'visible';
            $('#signupForm :input').prop('disabled', true);
            $.ajax({
                method: 'POST',
                url: '/users/register',
                dataType: 'json',
                data: {
                    firstName: signupForm.firstName.value,
                    lastName: signupForm.lastName.value,
                    email: signupForm.email.value,
                    phone: signupForm.phone.value,
                    password: signupForm.password.value
                },
                statusCode: {
                    406: function (msg, status, jqXHR) {
                        console.log(status);
                    },
                    501: function (msg, status, jqXHR) {
                        console.log(status);
                    }
                }
            }).done(function (msg, status, jqXHR) {
                signupLoader.style.visibility = 'hidden';
                console.log(status);
                M.toast({ 
                    html: 'Registration Successful. You can now log in.',
                    displayLength: 6000
                });
                $('#signupForm :input').prop('disabled', false);
                signupForm.reset();
                $('#main-section').css('display', 'block');
                $('#topButton').css('display', 'block');
                $('#navbar').css('display', 'block');
                $('footer').css('visibility', 'visible');
                $('#signup-form-container').css('display', 'none');
                setTimeout(function () {
                    $('.modal').modal('open');
                }, 3000);
            }).fail(function (jqXHR, textStatus) {
                signupLoader.style.visibility = 'hidden';
                M.toast({ html: 'Registration not Successful! Try again.' });
                $('#emailErrorMessage').html(jqXHR.responseJSON.msg);
                $('#signupForm :input').prop('disabled', false);
                signupForm.email.focus();
            });
        }
    }

    function checkInputs () {
        signupForm.firstName.addEventListener('focusout', function (event) {
            if (isEmpty(event.target)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                M.toast({ html: 'Invalid First Name!' });
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);

        signupForm.lastName.addEventListener('focusout', function (event) {
            if (isEmpty(event.target)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                M.toast({ html: 'Invalid First Name!' });
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
        signupForm.email.addEventListener('keyup', function (event) {
            if (!emailRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
        signupForm.email.addEventListener('focusout', function (event) {
            if (!emailRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                M.toast({ html: 'Invalid Email Address!' });
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        signupForm.password.addEventListener('keyup', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
        signupForm.password.addEventListener('focusout', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                M.toast({ html: 'Invalid password!' });
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);

        signupForm.phone.addEventListener('keyup', function (event) {
            if (!phoneRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);

        signupForm.phone.addEventListener('focusout', function (event) {
            if (!phoneRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                M.toast({ html: 'Invalid Password!' });
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    }

    loginEmail.addEventListener('keyup', function (event) {
        if (!emailRegExp.test(event.target.value)) {
            event.target.classList.add('invalid');
            event.target.classList.remove('valid');
        } else {
            event.target.classList.add('valid');
            event.target.classList.remove('invalid');            
        }
    }, false);
    signupForm.addEventListener('submit', submitSignupForm, false);
    loginForm.addEventListener('submit', submitLoginForm, false);
    checkInputs();
});