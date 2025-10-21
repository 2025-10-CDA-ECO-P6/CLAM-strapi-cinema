import Alpine from 'https://esm.sh/alpinejs@3.x.x';
import api from './api.js';

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Initialize Alpine.js data
document.addEventListener('alpine:init', () => {
    Alpine.data('movieDetailsPage', () => ({
        movie: {},
        actors: [],
        directors: [],
        isLoading: true,
        error: null,

        async init() {
            if (!movieId) {
                this.error = 'Aucun ID de film spécifié';
                this.isLoading = false;
                return;
            }

            await this.loadMovieDetails();
            this.initSwipers();
        },

        async loadMovieDetails() {
            try {
                this.isLoading = true;

                console.log('Loading movie with documentId:', movieId);

                // Fetch movie details with all relationships populated using documentId
                // In Strapi 5, use documentId directly in URL
                const response = await api.get(`/movies/${movieId}`, {
                    params: {
                        populate: ['actors', 'directors', 'genres']
                    }
                });

                console.log('API Response:', response.data);

                if (response.data && response.data.data) {
                    const movieData = response.data.data;

                    console.log('Movie data loaded:', movieData);

                    this.movie = {
                        id: movieData.id,
                        title: movieData.title || '',
                        overview: movieData.overview || '',
                        release_date: movieData.release_date || null,
                        vote_average: movieData.vote_average || 0,
                        vote_count: movieData.vote_count || 0,
                        poster_path: movieData.poster_path || null,
                        genres: movieData.genres || [],
                    };

                    // Extract actors
                    console.log('Raw actors data:', movieData.actors);
                    if (movieData.actors && Array.isArray(movieData.actors)) {
                        this.actors = movieData.actors.map(actor => ({
                            id: actor.id,
                            documentId: actor.documentId,
                            name: actor.name || '',
                            profile_path: actor.profile_path || null,
                        }));
                        console.log('Actors loaded:', this.actors.length, this.actors);
                    } else {
                        console.warn('No actors found or wrong format');
                    }

                    // Extract directors
                    console.log('Raw directors data:', movieData.directors);
                    if (movieData.directors && Array.isArray(movieData.directors)) {
                        this.directors = movieData.directors.map(director => ({
                            id: director.id,
                            documentId: director.documentId,
                            name: director.name || '',
                            profile_path: director.profile_path || null,
                        }));
                        console.log('Directors loaded:', this.directors.length, this.directors);
                    } else {
                        console.warn('No directors found or wrong format');
                    }
                }

                this.isLoading = false;
            } catch (error) {
                console.error('Error loading movie details:', error);
                this.error = 'Erreur lors du chargement des détails du film';
                this.isLoading = false;
            }
        },

        formatDate(dateString) {
            if (!dateString) return 'Date inconnue';

            const date = new Date(dateString);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('fr-FR', options);
        },

        initSwipers() {
            // Wait for Alpine to render the data
            this.$nextTick(() => {
                setTimeout(() => {
                    new Swiper('.actorsSwiper', {
                        slidesPerView: 2,
                        spaceBetween: 20,
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                        breakpoints: {
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                            1024: {
                                slidesPerView: 5,
                                spaceBetween: 24,
                            },
                        },
                    });
                    new Swiper('.directorsSwiper', {
                        slidesPerView: 2,
                        spaceBetween: 20,
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                        breakpoints: {
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                            1024: {
                                slidesPerView: 5,
                                spaceBetween: 24,
                            },
                        },
                    });
                }, 100);
            });
        },

        goToActor(actorId) {
            window.location.href = `/details.html?id=${actorId}&type=actor`;
        },

        goToDirector(directorId) {
            window.location.href = `/details.html?id=${directorId}&type=director`;
        },
    }));
});

Alpine.start();
