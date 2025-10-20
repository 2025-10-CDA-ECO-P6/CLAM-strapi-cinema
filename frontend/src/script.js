// ===================================
// SWIPER CAROUSEL INITIALIZATION
// ===================================
function initSwiper() {
    // Vérifier si Swiper existe sur la page
    if (typeof Swiper !== 'undefined' && document.querySelector('.mySwiper')) {
        const swiper = new Swiper('.mySwiper', {
            // Effet de transition (options: 'slide', 'fade', 'cube', 'coverflow', 'flip')
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },

            // Vitesse de transition en ms
            speed: 800,

            // Autoplay
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },

            // Loop infini
            loop: true,

            // Navigation (flèches)
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            // Pagination (points)
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: false,
            },

            // Effet au clavier
            keyboard: {
                enabled: true,
                onlyInViewport: false,
            },
        });

        return swiper;
    }
    return null;
}

