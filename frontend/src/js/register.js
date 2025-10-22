import Alpine from 'https://esm.sh/alpinejs@3.x.x';
import api from './api.js';

// Alpine.js component
document.addEventListener('alpine:init', () => {
    Alpine.data('registerPage', () => ({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        errorMessage: '',
        successMessage: '',
        isLoading: false,
        passwordValid: false,

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

        checkPasswordRequirements() {
            this.passwordValid = this.password.length >= 6;
        },

        async handleRegister() {
            // Validation basique
            if (!this.username.trim() || !this.email.trim() || !this.password || !this.confirmPassword) {
                this.showError('Veuillez remplir tous les champs.');
                return;
            }

            // Validation du nom d'utilisateur
            if (this.username.trim().length < 3) {
                this.showError('Le nom d\'utilisateur doit contenir au moins 3 caractères.');
                return;
            }

            // Validation de l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email.trim())) {
                this.showError('Veuillez entrer une adresse email valide.');
                return;
            }

            // Validation du mot de passe
            if (this.password.length < 6) {
                this.showError('Le mot de passe doit contenir au moins 6 caractères.');
                return;
            }

            // Vérifier que les mots de passe correspondent
            if (this.password !== this.confirmPassword) {
                this.showError('Les mots de passe ne correspondent pas.');
                return;
            }

            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            try {
                // Appel à l'API d'inscription
                const response = await api.post('/auth/local/register', {
                    username: this.username.trim(),
                    email: this.email.trim(),
                    password: this.password
                });

                // Sauvegarder le token JWT
                localStorage.setItem('jwt', response.data.jwt);

                // Sauvegarder les informations de l'utilisateur
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Afficher un message de succès
                this.showSuccess('Compte créé avec succès ! Redirection...');

                // Rediriger vers la page d'accueil après un court délai
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);

            } catch (error) {
                console.error('Erreur d\'inscription:', error);

                // Gérer les différents types d'erreurs
                let errorMsg = 'Une erreur est survenue. Veuillez réessayer.';

                if (error.response) {
                    // Le serveur a répondu avec un code d'erreur
                    if (error.response.status === 400) {
                        const errorData = error.response.data?.error;

                        if (errorData?.message?.includes('email')) {
                            errorMsg = 'Cette adresse email est déjà utilisée.';
                        } else if (errorData?.message?.includes('username')) {
                            errorMsg = 'Ce nom d\'utilisateur est déjà pris.';
                        } else {
                            errorMsg = errorData?.message || 'Données invalides. Veuillez vérifier vos informations.';
                        }
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