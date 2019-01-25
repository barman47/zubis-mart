$(document).ready(function () {
    const homeLinks = document.querySelectorAll('.active');

    homeLinks.forEach(function (homeLink) {
        homeLink.classList.remove('active');
    });
});