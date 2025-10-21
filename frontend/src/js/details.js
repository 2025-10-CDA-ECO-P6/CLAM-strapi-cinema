import Alpine from 'https://esm.sh/alpinejs@3.x.x';
import api from './api.js';

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const personId = urlParams.get('id');
const detailType = urlParams.get('type') || 'actor'; // 'actor' or 'director'

// Initialize Alpine.js data
document.addEventListener('alpine:init', () => {
    Alpine.data('detailsPage', () => ({
        person: {},
        movies: [],
        detailType: detailType,
        personName: '',
        isLoading: true,
        error: null,

        async init() {
            if (!personId) {
                this.error = 'Aucun ID spécifié';
                this.isLoading = false;
                return;
            }

            await this.loadPersonDetails();
            this.initSwiper();
        },

        async loadPersonDetails() {
            try {
                this.isLoading = true;

                // Determine the API endpoint based on type
                const endpoint = detailType === 'actor' ? 'actors' : 'directors';

                // Fetch person details with populated movies
                const response = await api.get(`/${endpoint}/${personId}?populate=*`);

                if (response.data && response.data.data) {
                    const personData = response.data.data;

                    this.person = {
                        id: personData.id,
                        name: personData.name || '',
                        biography: personData.biography || '',
                        birthday: personData.birthday || null,
                        place_of_birth: personData.place_of_birth || '',
                        profile_path: personData.profile_path || null,
                    };

                    this.personName = this.person.name;

                    // Extract movies from the relationship
                    if (personData.movies && Array.isArray(personData.movies)) {
                        this.movies = personData.movies.map(movie => ({
                            id: movie.id,
                            documentId: movie.documentId,
                            title: movie.title || '',
                            poster_path: movie.poster_path || null,
                            release_date: movie.release_date || null,
                        }));
                    }
                }

                this.isLoading = false;
            } catch (error) {
                console.error('Error loading person details:', error);
                this.error = 'Erreur lors du chargement des détails';
                this.isLoading = false;
            }
        },

        formatDate(dateString) {
            if (!dateString) return '';

            const date = new Date(dateString);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('fr-FR', options);
        },

        initSwiper() {
            // Wait for Alpine to render the data
            this.$nextTick(() => {
                setTimeout(() => {
                    new Swiper('.moviesSwiper', {
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

        goToMovie(movieId) {
            window.location.href = `/movie-details.html?id=${movieId}`;
        },
    }));
});
Alpine.start();