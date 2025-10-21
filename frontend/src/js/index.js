import Alpine from 'https://esm.sh/alpinejs@3.x.x';
import api from './api.js';

document.addEventListener('alpine:init', () => {
    Alpine.data('movies', () => ({
        // État
        items: [],
        loading: false,
        error: null,

        // Initialisation
        async init() {
            await this.loadItems();
        },
        
        // Charger les items
        async loadItems() {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get('/movies', {
                    params: {
                        sort: ['createdAt:desc'],
                        pagination: {
                            pageSize: 5
                        },
                        populate: '*'
                    }
                });
                this.items = response.data.data;
                setTimeout(initSwiper, 200);
            } catch (error) {
                this.error = error.message;
                console.error('Erreur:', error);
            } finally {
                this.loading = false;
            }
        }
    }));
});
Alpine.start();