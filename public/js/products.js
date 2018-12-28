$(document).ready(function () {
    $('.tooltipped').tooltip();
    $('.materialboxed').materialbox();

    const homeLinks = document.querySelectorAll('.active');
    const storeLinks = document.querySelectorAll('.store');

    homeLinks.forEach(function (homeLink) {
        homeLink.classList.remove('active');
    });

    storeLinks.forEach(function (storeLink) {
        storeLink.classList.add('active');
    });
});