$(document).ready(function () {
    const adminForm = document.getElementById('adminLoginForm');
    const adminUsername = document.getElementById('adminUsername');
    const adminPassword = document.getElementById('adminPassword');

    const inputs = [adminUsername, adminPassword];

    const closeErrorMessage = document.querySelector('.close-password-error-message');


    adminForm.addEventListener('submit', submitLoginForm);
    try {
        closeErrorMessage.addEventListener('click', (event) => {
            event.target.parentElement.remove();
        });
    } catch (err) {

    }

    function isEmpty (element)  {
        if (element.value === '' || element.value.trim() === '') {
            return true;
        } else {
            return false;
        }
    };

    function submitLoginForm (event) {
        let isOkay;
        for (var i = 0; i < inputs.length; i++) {
            if (isEmpty(inputs[i])) {
                event.preventDefault();
                inputs[i].classList.add('invalid');
                inputs[i].focus();
                isOkay = false;
                break;
            } else {
                isOkay = true;
            }
        }

        if (isOkay === true) {
            document.querySelector('#adminLoginLoader').style.visibility = 'visible';
        }
    };
});