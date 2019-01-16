$(document).ready(function () {
    const sellLink = document.querySelectorAll('.sell');
    const homeLinks = document.querySelectorAll('.active');

    homeLinks.forEach(function (homeLink) {
        homeLink.classList.remove('active');
    });

    sellLink.forEach(function (link) {
        link.classList.add('active');
    });
});