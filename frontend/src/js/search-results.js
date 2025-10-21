import Alpine from 'https://esm.sh/alpinejs@3.x.x';
import api from './api.js';

Alpine.data('searchResultsPage', () => ({
    searchQuery: '',
    movies: [],
    actors: [],
    directors: [],
    isLoading: false,

    async init() {
        // Get search query from URL
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');

        if (query) {
            this.searchQuery = query;
            await this.performSearch();
        }
    },

    async performSearch() {
        if (!this.searchQuery.trim()) {
            return;
        }

        // Update URL with search query
        const url = new URL(window.location);
        url.searchParams.set('q', this.searchQuery);
        window.history.pushState({}, '', url);

        this.isLoading = true;
        this.movies = [];
        this.actors = [];
        this.directors = [];

        try {
            // Search in parallel
            await Promise.all([
                this.searchMovies(),
                this.searchActors(),
                this.searchDirectors()
            ]);
        } catch (error) {
            console.error('Error performing search:', error);
        } finally {
            this.isLoading = false;
        }
    },

    async searchMovies() {
        try {
            // Load all movies and filter client-side for better compatibility
            const response = await api.get('/movies', {
                params: {
                    populate: ['genres', 'actors', 'directors'],
                    pagination: {
                        pageSize: 1000  // Increase to load all movies
                    }
                }
            });

            console.log('Movies search response:', response.data);

            if (response.data && response.data.data) {
                const query = this.searchQuery.toLowerCase();

                // Filter movies client-side
                const allMovies = response.data.data;
                const filteredMovies = allMovies.filter(movie => {
                    const titleMatch = movie.title && movie.title.toLowerCase().includes(query);
                    const overviewMatch = movie.overview && movie.overview.toLowerCase().includes(query);
                    return titleMatch || overviewMatch;
                });

                this.movies = filteredMovies.map(movie => ({
                    documentId: movie.documentId,
                    id: movie.id,
                    title: movie.title || 'Sans titre',
                    release_date: movie.release_date || '',
                    poster_path: movie.poster_path || null
                }));

                console.log('All movies loaded:', allMovies.length);
                console.log('Movies found after filtering:', this.movies.length, this.movies);
            }
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    },

    async searchActors() {
        try {
            // Load all actors and filter client-side for better compatibility
            const response = await api.get('/actors', {
                params: {
                    pagination: {
                        pageSize: 1000  // Increase to load all actors
                    }
                }
            });

            console.log('Actors search response:', response.data);

            if (response.data && response.data.data) {
                const query = this.searchQuery.toLowerCase();

                // Filter actors client-side
                const allActors = response.data.data;
                const filteredActors = allActors.filter(actor => {
                    const nameMatch = actor.name && actor.name.toLowerCase().includes(query);
                    const bioMatch = actor.biography && actor.biography.toLowerCase().includes(query);
                    return nameMatch || bioMatch;
                });

                this.actors = filteredActors.map(actor => ({
                    documentId: actor.documentId,
                    id: actor.id,
                    name: actor.name || '',
                    profile_path: actor.profile_path || null
                }));

                console.log('All actors loaded:', allActors.length);
                console.log('Actors found after filtering:', this.actors.length, this.actors);
            }
        } catch (error) {
            console.error('Error searching actors:', error);
        }
    },

    async searchDirectors() {
        try {
            // Load all directors and filter client-side for better compatibility
            const response = await api.get('/directors', {
                params: {
                    pagination: {
                        pageSize: 1000  // Increase to load all directors
                    }
                }
            });

            console.log('Directors search response:', response.data);

            if (response.data && response.data.data) {
                const query = this.searchQuery.toLowerCase();

                // Filter directors client-side
                const allDirectors = response.data.data;
                const filteredDirectors = allDirectors.filter(director => {
                    const nameMatch = director.name && director.name.toLowerCase().includes(query);
                    const bioMatch = director.biography && director.biography.toLowerCase().includes(query);
                    return nameMatch || bioMatch;
                });

                this.directors = filteredDirectors.map(director => ({
                    documentId: director.documentId,
                    id: director.id,
                    name: director.name || '',
                    profile_path: director.profile_path || null
                }));

                console.log('All directors loaded:', allDirectors.length);
                console.log('Directors found after filtering:', this.directors.length, this.directors);
            }
        } catch (error) {
            console.error('Error searching directors:', error);
        }
    },

    hasResults() {
        return this.movies.length > 0 || this.actors.length > 0 || this.directors.length > 0;
    },

    getTotalResults() {
        return this.movies.length + this.actors.length + this.directors.length;
    }
}));

Alpine.start();
