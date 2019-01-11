$(document).ready(function () {
    var elems = document.querySelectorAll('.slider');
    var instances = M.Slider.init(elems, {'height' : 350, 'indicators' : true});
    $('.tooltipped').tooltip();
    $('.materialboxed').materialbox();
    $('.parallax').parallax();
});