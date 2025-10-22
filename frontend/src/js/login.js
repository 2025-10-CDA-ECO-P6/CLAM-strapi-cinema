import Alpine from 'https://esm.sh/alpinejs@3.x.x';
import api from './api.js';

// Alpine.js component
document.addEventListener('alpine:init', () => {
    Alpine.data('loginPage', () => ({
        identifier: '',
        password: '',
        errorMessage: '',
        successMessage: '',
        isLoading: false,

        init() {
            // Vérifier si l'utilisateur est déjà connecté
            const token = localStorage.getItem('jwt');
            if (token) {
                this.successMessage = 'Vous êtes déjà connecté. Redirection...';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        },

        async handleLogin() {
            // Validation basique
            if (!this.identifier.trim() || !this.password) {
                this.showError('Veuillez remplir tous les champs.');
                return;
            }

            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            try {
                // Appel à l'API de connexion
                const response = await api.post('/auth/local', {
                    identifier: this.identifier.trim(),
                    password: this.password
                });

                // Sauvegarder le token JWT
                localStorage.setItem('jwt', response.data.jwt);

                // Sauvegarder les informations de l'utilisateur
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Afficher un message de succès
                this.showSuccess('Connexion réussie ! Redirection...');

                // Rediriger vers la page d'accueil après un court délai
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);

            } catch (error) {
                console.error('Erreur de connexion:', error);

                // Gérer les différents types d'erreurs
                let errorMsg = 'Une erreur est survenue. Veuillez réessayer.';

                if (error.response) {
                    // Le serveur a répondu avec un code d'erreur
                    if (error.response.status === 400) {
                        errorMsg = 'Email/nom d\'utilisateur ou mot de passe incorrect.';
                    } else if (error.response.status === 429) {
                        errorMsg = 'Trop de tentatives. Veuillez réessayer dans quelques minutes.';
                    } else if (error.response.data?.error?.message) {
                        errorMsg = error.response.data.error.message;
                    }
                } else if (error.request) {
                    // La requête a été envoyée mais pas de réponse
                    errorMsg = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
                }

                this.showError(errorMsg);
                this.isLoading = false;
            }
        },

        showError(message) {
            this.errorMessage = message;
            this.successMessage = '';

            // Masquer le message après 5 secondes
            setTimeout(() => {
                this.errorMessage = '';
            }, 5000);
        },

        showSuccess(message) {
            this.successMessage = message;
            this.errorMessage = '';
        }
    }));
});
Alpine.start();