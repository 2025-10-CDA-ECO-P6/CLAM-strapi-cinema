import Alpine from 'https://esm.sh/alpinejs@3.x.x';
import api from './api.js';

document.addEventListener('alpine:init', () => {
    Alpine.data('directorsPage', () => ({
        // State
        directors: [],
        allDirectors: [],
        loading: false,
        error: null,
        sortBy: 'name_asc',
        searchQuery: '',

        // Initialize
        async init() {
            await this.loadDirectors();
        },

        // Load directors from API
        async loadDirectors() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get('/directors', {
                    params: {
                        populate: '*',
                        pagination: {
                            pageSize: 100
                        }
                    }
                });

                this.allDirectors = response.data.data.map(director => ({
                    id: director.id,
                    documentId: director.documentId || '',
                    name: director.name || '',
                    biography: director.biography || '',
                    birthday: director.birthday || null,
                    place_of_birth: director.place_of_birth || '',
                    profile_path: director.profile_path || null,
                    movies: director.movies || []
                }));

                this.directors = [...this.allDirectors];
                this.sortDirectors();

            } catch (error) {
                this.error = error.message;
                console.error('Error loading directors:', error);
            } finally {
                this.loading = false;
            }
        },

        // Sort directors
        sortDirectors() {
            switch (this.sortBy) {
                case 'name_asc':
                    this.directors.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name_desc':
                    this.directors.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'popularity':
                    this.directors.sort((a, b) => (b.movies?.length || 0) - (a.movies?.length || 0));
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

        // Filter directors based on search query
        filterDirectors() {
            if (!this.searchQuery.trim()) {
                this.directors = [...this.allDirectors];
            } else {
                const query = this.searchQuery.toLowerCase();
                this.directors = this.allDirectors.filter(director =>
                    director.name.toLowerCase().includes(query) ||
                    (director.biography && director.biography.toLowerCase().includes(query)) ||
                    (director.place_of_birth && director.place_of_birth.toLowerCase().includes(query))
                );
            }
            this.sortDirectors();
        },
    }));
});

Alpine.start();
