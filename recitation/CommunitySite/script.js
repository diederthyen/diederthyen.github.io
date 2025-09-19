const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navBurger = document.querySelector('.nav-burger');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('nav-menu_visible');
    navBurger.classList.toggle('nav-burger_active');
});