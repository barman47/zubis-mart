$(document).ready(function () {
    const homeLinks = document.querySelectorAll('.active');
    const serviceLinks = document.querySelectorAll('.services');
    
    homeLinks.forEach(function (homeLink) {
        homeLink.classList.remove('active');
    });

    serviceLinks.forEach(function (serviceLink) {
        serviceLink.classList.add('active');
    });
});