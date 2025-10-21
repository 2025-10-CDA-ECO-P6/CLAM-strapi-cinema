import Alpine from 'https://esm.sh/alpinejs@3.x.x';
import api from './api.js';

Alpine.data('moviesPage', () => ({
    movies: [],
    allMovies: [],
    genres: [],
    isLoading: true,
    sortBy: 'popularity',
    selectedGenre: '',
    searchQuery: '',

    async init() {
        // Check for search parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
            this.searchQuery = searchParam;
        }

        await this.loadGenres();
        await this.loadMovies();
    },

    async loadGenres() {
        try {
            const response = await api.get('/genres', {
                params: {
                    pagination: {
                        pageSize: 100
                    }
                }
            });

            if (response.data && response.data.data) {
                this.genres = response.data.data.map(genre => ({
                    id: genre.id,
                    documentId: genre.documentId,
                    name: genre.name
                }));
            }
        } catch (error) {
            console.error('Error loading genres:', error);
        }
    },

    async loadMovies() {
        try {
            this.isLoading = true;
            const response = await api.get('/movies', {
                params: {
                    populate: ['genres', 'actors', 'directors'],
                    pagination: {
                        pageSize: 1000  // Increase to load all movies
                    }
                }
            });

            if (response.data && response.data.data) {
                this.allMovies = response.data.data.map(movie => ({
                    documentId: movie.documentId,
                    id: movie.id,
                    title: movie.title || 'Sans titre',
                    overview: movie.overview || 'Pas de synopsis disponible',
                    release_date: movie.release_date || '',
                    poster_path: movie.poster_path || null,
                    vote_average: movie.vote_average || 0,
                    runtime: movie.runtime || 0,
                    genres: movie.genres || [],
                    actors: movie.actors || [],
                    directors: movie.directors || []
                }));
                this.movies = [...this.allMovies];
                this.sortMovies();
            }

            this.isLoading = false;
        } catch (error) {
            console.error('Error loading movies:', error);
            this.isLoading = false;
        }
    },

    sortMovies() {
        switch(this.sortBy) {
            case 'popularity':
                this.movies.sort((a, b) => b.vote_average - a.vote_average);
                break;
            case 'release_date':
                this.movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
                break;
            case 'title':
                this.movies.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'rating':
                this.movies.sort((a, b) => b.vote_average - a.vote_average);
                break;
        }
    },

    filterMovies() {
        let filtered = [...this.allMovies];

        // Filter by search query
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(movie =>
                movie.title.toLowerCase().includes(query) ||
                (movie.overview && movie.overview.toLowerCase().includes(query)) ||
                movie.genres.some(g => g.name.toLowerCase().includes(query)) ||
                movie.actors.some(a => a.name.toLowerCase().includes(query)) ||
                movie.directors.some(d => d.name.toLowerCase().includes(query))
            );
        }

        // Filter by genre
        if (this.selectedGenre) {
            filtered = filtered.filter(movie =>
                movie.genres.some(genre =>
                    genre.name.toLowerCase() === this.selectedGenre.toLowerCase()
                )
            );
        }

        this.movies = filtered;
        this.sortMovies();
    },

    filterByGenre() {
        this.filterMovies();
    },

    searchMovies() {
        this.filterMovies();
    },

    formatDate(dateString) {
        if (!dateString) return 'Date inconnue';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },

    formatRuntime(minutes) {
        if (!minutes) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}min`;
    },

    getGenreNames(genres) {
        if (!genres || genres.length === 0) return '';
        return genres.map(g => g.name).join(', ');
    },

    getDirectorNames(directors) {
        if (!directors || directors.length === 0) return 'Réalisateur inconnu';
        return directors.map(d => d.name).join(', ');
    },

    getActorNames(actors) {
        if (!actors || actors.length === 0) return 'Acteurs inconnus';
        return actors.slice(0, 3).map(a => a.name).join(', ') + (actors.length > 3 ? ' ...' : '');
    }
}));

Alpine.start();
