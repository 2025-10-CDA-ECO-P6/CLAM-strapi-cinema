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
    Alpine.data('listsPage', () => ({
        lists: [],
        newList: {
            name: '',
            description: ''
        },

        init() {
            this.loadLists();
        },

        loadLists() {
            this.lists = JSON.parse(localStorage.getItem('userLists') || '[]');
        },

        createList() {
            if (!this.newList.name.trim()) {
                M.toast({html: 'Veuillez entrer un nom pour la liste', classes: 'rounded red'});
                return;
            }

            const list = {
                id: Date.now(),
                name: this.newList.name.trim(),
                description: this.newList.description.trim(),
                movies: [],
                createdAt: new Date().toISOString()
            };

            this.lists.push(list);
            localStorage.setItem('userLists', JSON.stringify(this.lists));

            // Réinitialiser le formulaire
            this.newList = { name: '', description: '' };

            M.toast({html: `Liste "${list.name}" créée avec succès !`, classes: 'rounded green'});
        },

        deleteList(listId) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette liste ?')) {
                const deletedList = this.lists.find(l => l.id === listId);
                this.lists = this.lists.filter(l => l.id !== listId);
                localStorage.setItem('userLists', JSON.stringify(this.lists));

                if (deletedList) {
                    M.toast({html: `Liste "${deletedList.name}" supprimée`, classes: 'rounded'});
                }
            }
        }
    }));
});
Alpine.start();