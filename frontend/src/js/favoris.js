import Alpine from 'https://esm.sh/alpinejs@3.x.x';
import api from './api.js';

// Vérifier si l'utilisateur est connecté
const token = localStorage.getItem('jwt');
const user = localStorage.getItem('user');

if (!token || !user) {
    // Rediriger vers la page de connexion si non connecté
    window.location.href = 'login.html';
}

// Alpine.js component
document.addEventListener('alpine:init', () => {
    Alpine.data('favoritesPage', () => ({
        favorites: [],
        isLoading: true,

        async init() {
            await this.loadFavorites();
        },

        async loadFavorites() {
            this.isLoading = true;

            try {
                // Pour l'instant, on simule des favoris stockés en localStorage
                // Plus tard, vous pourrez utiliser l'API favorites de Strapi
                const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');

                if (favoriteIds.length === 0) {
                    this.isLoading = false;
                    this.favorites = [];
                    return;
                }

                // Récupérer les détails des films favoris
                const moviePromises = favoriteIds.map(movieId =>
                    api.get(`/movies/${movieId}?populate=*`)
                );

                const responses = await Promise.all(moviePromises);
                this.favorites = responses.map(response => response.data.data);

                this.isLoading = false;

            } catch (error) {
                console.error('Erreur lors du chargement des favoris:', error);
                this.isLoading = false;
                this.favorites = [];
            }
        },

        removeFavorite(movieId) {
            const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
            const updatedFavorites = favoriteIds.filter(id => id !== movieId);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

            // Mettre à jour la liste localement
            this.favorites = this.favorites.filter(movie => movie.id !== movieId);

            // Afficher un message
            M.toast({html: 'Film retiré des favoris', classes: 'rounded'});
        }
    }));
});
Alpine.start();