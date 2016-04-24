const Swiper = require('swiper');
/* eslint no-unused-vars: ["error", { "args": "none" }]*/
var swiper = new Swiper('.swiper-container', {
    scrollbar: '.swiper-scrollbar',
    scrollbarHide: true,
    slidesPerView: 'auto',
    centeredSlides: false,
    spaceBetween: 30,
    grabCursor: true
});
console.log(swiper);