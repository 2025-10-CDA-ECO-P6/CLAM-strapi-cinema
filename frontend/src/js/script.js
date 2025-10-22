// ===================================
// GLOBAL SEARCH FUNCTIONALITY
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Get all search inputs in headers
    const searchInputs = document.querySelectorAll('.search-all input');

    searchInputs.forEach(input => {
        // Handle Enter key press
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    window.location.href = `/search-results.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    });
});

// ===================================
// AUTHENTICATION BUTTON HANDLER
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const btnConnexion = document.querySelector('.btn-connexion');
    const appHeader = document.querySelector('.app-header');
    const headerActions = document.querySelector('.header-actions');

    if (btnConnexion) {
        // Vérifier si l'utilisateur est connecté
        const token = localStorage.getItem('jwt');
        const user = localStorage.getItem('user');

        if (token && user) {
            // Utilisateur connecté
            const userData = JSON.parse(user);

            // Remplacer le bouton par un menu utilisateur
            btnConnexion.style.display = 'none';

            // Créer le menu dropdown
            if (!document.querySelector('.user-menu')) {
                const userMenu = document.createElement('div');
                userMenu.className = 'user-menu';
                userMenu.innerHTML = `
                    <button class="btn-user-menu waves-effect waves-light">
                        <span class="material-icons" style="font-size: 20px; margin-right: 4px;">account_circle</span>
                        ${userData.username}
                        <span class="material-icons" style="font-size: 18px; margin-left: 4px;">arrow_drop_down</span>
                    </button>
                    <div class="user-dropdown">
                        <a href="compte.html" class="dropdown-item">
                            <span class="material-icons">person</span>
                            Mon compte
                        </a>
                        <a href="favoris.html" class="dropdown-item">
                            <span class="material-icons">favorite</span>
                            Mes favoris
                        </a>
                        <a href="listes.html" class="dropdown-item">
                            <span class="material-icons">list</span>
                            Mes listes
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item" onclick="event.preventDefault(); logout();">
                            <span class="material-icons">exit_to_app</span>
                            Déconnexion
                        </a>
                    </div>
                `;

                headerActions.appendChild(userMenu);

                // Ajouter les styles
                const style = document.createElement('style');
                style.textContent = `
                    .user-menu {
                        position: relative;
                    }

                    .btn-user-menu {
                        background-color: var(--primary-color);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        font-size: 14px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all var(--transition-fast);
                        box-shadow: var(--shadow-1);
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    }

                    .btn-user-menu:hover {
                        background-color: var(--primary-dark);
                        box-shadow: var(--shadow-2);
                    }

                    .user-dropdown {
                        position: absolute;
                        top: 120%;
                        right: 0;
                        background-color: var(--background-elevation-1);
                        border-radius: 4px;
                        box-shadow: var(--shadow-3);
                        min-width: 200px;
                        opacity: 0;
                        visibility: hidden;
                        transform: translateY(-10px);
                        transition: all var(--transition-fast);
                        z-index: 1000;
                    }

                    .user-menu:hover .user-dropdown,
                    .user-dropdown:hover {
                        opacity: 1;
                        visibility: visible;
                        transform: translateY(0);
                    }

                    .dropdown-item {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 12px 16px;
                        color: var(--text-primary);
                        text-decoration: none;
                        font-size: 14px;
                        transition: background-color var(--transition-fast);
                    }

                    .dropdown-item:hover {
                        background-color: var(--background-elevation-2);
                    }

                    .dropdown-item .material-icons {
                        font-size: 20px;
                        color: var(--text-secondary);
                    }

                    .dropdown-divider {
                        height: 1px;
                        background-color: var(--background-elevation-2);
                        margin: 8px 0;
                    }

                    .welcome-banner {
                        background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
                        padding: 16px 0;
                        box-shadow: var(--shadow-1);
                    }

                    .welcome-banner-content {
                        max-width: 1400px;
                        margin: 0 auto;
                        padding: 0 32px;
                    }

                    .welcome-text {
                        font-family: 'Montserrat', 'Roboto', sans-serif;
                        font-size: 20px;
                        font-weight: 600;
                        color: var(--text-primary);
                        letter-spacing: 0.5px;
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                    }
                `;
                document.head.appendChild(style);

                // Fonction de déconnexion globale
                window.logout = function() {
                    localStorage.removeItem('jwt');
                    localStorage.removeItem('user');
                    window.location.href = 'index.html';
                };
            }

            // Ajouter le message de bienvenue sous le header
            if (appHeader && !document.querySelector('.welcome-banner')) {
                const welcomeBanner = document.createElement('div');
                welcomeBanner.className = 'welcome-banner';
                welcomeBanner.innerHTML = `
                    <div class="welcome-banner-content">
                        <span class="welcome-text">Bonjour, ${userData.username} !</span>
                    </div>
                `;

                // Insérer après le header
                appHeader.insertAdjacentElement('afterend', welcomeBanner);
            }
        } else {
            // Utilisateur non connecté - rediriger vers la page de connexion
            btnConnexion.textContent = 'Connexion';
            btnConnexion.onclick = function() {
                window.location.href = 'login.html';
            };
        }
    }
});

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

