import Alpine from 'https://esm.sh/alpinejs@3.x.x';
import api from './api.js';

// Vérifier si l'utilisateur est connecté
const token = localStorage.getItem('jwt');
const userString = localStorage.getItem('user');

if (!token || !userString) {
    // Rediriger vers la page de connexion si non connecté
    window.location.href = 'login.html';
}

// Alpine.js component
document.addEventListener('alpine:init', () => {
    Alpine.data('accountPage', () => ({
        user: {},
        stats: {
            favoritesCount: 0,
            listsCount: 0,
            totalMovies: 0
        },

        init() {
            this.loadUserInfo();
            this.loadStatistics();
        },

        loadUserInfo() {
            try {
                this.user = JSON.parse(userString);
            } catch (error) {
                console.error('Erreur lors du chargement des informations:', error);
            }
        },

        loadStatistics() {
            // Nombre de favoris
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            this.stats.favoritesCount = favorites.length;

            // Nombre de listes
            const lists = JSON.parse(localStorage.getItem('userLists') || '[]');
            this.stats.listsCount = lists.length;

            // Nombre total de films dans toutes les listes
            let totalMovies = 0;
            lists.forEach(list => {
                totalMovies += list.movies?.length || 0;
            });
            // Ajouter les favoris au total
            totalMovies += favorites.length;
            this.stats.totalMovies = totalMovies;
        },

        formatDate(dateString) {
            if (!dateString) return 'Date inconnue';
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        logout() {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                localStorage.removeItem('jwt');
                localStorage.removeItem('user');

                M.toast({html: 'Déconnexion réussie', classes: 'rounded green'});

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        }
    }));
});
Alpine.start();