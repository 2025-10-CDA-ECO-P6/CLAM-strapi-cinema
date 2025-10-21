import Alpine from 'https://esm.sh/alpinejs@3.x.x';
import api from './api.js';

document.addEventListener('alpine:init', () => {
    Alpine.data('actorsPage', () => ({
        // State
        actors: [],
        allActors: [],
        loading: false,
        error: null,
        sortBy: 'name_asc',
        searchQuery: '',

        // Initialize
        async init() {
            await this.loadActors();
        },

        // Load actors from API
        async loadActors() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get('/actors', {
                    params: {
                        populate: '*',
                        pagination: {
                            pageSize: 100
                        }
                    }
                });

                this.allActors = response.data.data.map(actor => ({
                    id: actor.id,
                    documentId: actor.documentId || '',
                    name: actor.name || '',
                    biography: actor.biography || '',
                    birthday: actor.birthday || null,
                    place_of_birth: actor.place_of_birth || '',
                    profile_path: actor.profile_path || null,
                    movies: actor.movies || []
                }));

                this.actors = [...this.allActors];
                this.sortActors();

            } catch (error) {
                this.error = error.message;
                console.error('Error loading actors:', error);
            } finally {
                this.loading = false;
            }
        },

        // Sort actors
        sortActors() {
            switch (this.sortBy) {
                case 'name_asc':
                    this.actors.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name_desc':
                    this.actors.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'popularity':
                    this.actors.sort((a, b) => (b.movies?.length || 0) - (a.movies?.length || 0));
                    break;
                default:
                    break;
            }
        },

        // Format date
        formatDate(dateString) {
            if (!dateString) return '';

            const date = new Date(dateString);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('fr-FR', options);
        },

        // Truncate biography
        truncateBio(bio) {
            if (!bio) return '';
            const maxLength = 150;
            if (bio.length <= maxLength) return bio;
            return bio.substring(0, maxLength) + '...';
        },

        // Filter actors based on search query
        filterActors() {
            if (!this.searchQuery.trim()) {
                this.actors = [...this.allActors];
            } else {
                const query = this.searchQuery.toLowerCase();
                this.actors = this.allActors.filter(actor =>
                    actor.name.toLowerCase().includes(query) ||
                    (actor.biography && actor.biography.toLowerCase().includes(query)) ||
                    (actor.place_of_birth && actor.place_of_birth.toLowerCase().includes(query))
                );
            }
            this.sortActors();
        },
    }));
});

Alpine.start();
