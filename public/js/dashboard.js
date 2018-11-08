$(document).ready(function () {
    $('.tooltipped').tooltip({ position: 'top' });
    const homeLink = document.querySelector('.active');
    const accountLink = document.querySelector('.account');

    homeLink.classList.remove('active');
    accountLink.classList.add('active');
});