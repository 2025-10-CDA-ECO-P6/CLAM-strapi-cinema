# Cineverse - Frontend

Interface utilisateur pour l'application Cineverse, un système de gestion et découverte de films utilisant les données TMDb.

## 📋 Table des matières

- [Technologies](#technologies)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Démarrage](#démarrage)
- [Architecture](#architecture)
- [Pages disponibles](#pages-disponibles)
- [Authentification](#authentification)
- [Fonctionnalités](#fonctionnalités)
- [Design System](#design-system)
- [API Client](#api-client)
- [Contribution](#contribution)

## 🛠 Technologies

- **HTML5** - Structure des pages
- **CSS3** - Styles avec variables CSS et Material Design
- **JavaScript (Vanilla)** - Logique applicative
- **Alpine.js** (via CDN) - Framework JS réactif léger
- **Materialize CSS** - Framework CSS Material Design
- **Axios** (via CDN) - Client HTTP pour les appels API
- **Swiper.js** - Carrousels et sliders
- **Express.js** - Serveur de fichiers statiques
- **Node.js** - Environnement d'exécution

## 📁 Structure du projet

```
frontend/
├── src/
│   ├── css/
│   │   ├── styles.css        # Styles principaux de l'application
│   │   ├── auth.css          # Styles pages authentification
│   │   └── account.css       # Styles pages compte/favoris/listes
│   ├── js/
│   │   ├── script.js         # Script global (header, auth)
│   │   ├── index.js          # Page d'accueil (Alpine.js)
│   │   ├── api.js            # Client Axios avec intercepteur JWT
│   │   ├── authentication.js # Fonctions login/register/logout
│   │   ├── login.js          # Logique page connexion
│   │   ├── register.js       # Logique page inscription
│   │   ├── compte.js         # Logique page compte
│   │   ├── favoris.js        # Gestion favoris
│   │   └── listes.js         # Gestion listes personnalisées
│   ├── index.html            # Page d'accueil
│   ├── movies.html           # Liste des films
│   ├── movie-details.html    # Détails d'un film
│   ├── actors.html           # Liste des acteurs
│   ├── directors.html        # Liste des réalisateurs
│   ├── details.html          # Détails acteur/réalisateur
│   ├── search-results.html   # Résultats de recherche
│   ├── login.html            # Page connexion
│   ├── register.html         # Page inscription
│   ├── compte.html           # Page compte utilisateur
│   ├── favoris.html          # Page favoris
│   └── listes.html           # Page listes personnalisées
├── server.js                 # Serveur Express
├── package.json
└── README.md

```

## 🚀 Installation

### Prérequis

- Node.js (>= 18.0.0, <= 22.x.x)
- npm (>= 6.0.0)
- Backend Strapi en cours d'exécution sur `http://localhost:1337`

### Installation des dépendances

```bash
cd frontend
npm install
```

## ▶️ Démarrage

### Mode développement

```bash
npm start
# ou
npm run dev
```

Le frontend sera accessible sur **http://localhost:3001**

### Configuration

L'URL de l'API backend est configurée dans `src/js/api.js` :

```javascript
const apiClient = axios.create({
  baseURL: 'http://localhost:1337/api',
  timeout: 10000
});
```

Pour changer l'URL du backend, modifiez la propriété `baseURL`.

## 🏗 Architecture

### Architecture sans build

Le frontend utilise une architecture **sans étape de build** :
- Fichiers HTML/CSS/JS servis directement
- Bibliothèques chargées via CDN
- Server Express simple pour servir les fichiers statiques

### Patterns utilisés

#### 1. Alpine.js pour la réactivité
```javascript
// Composants Alpine.js dans index.js
document.addEventListener('alpine:init', () => {
    Alpine.data('moviesCarousel', () => ({
        movies: [],
        loading: true,
        async init() {
            await this.fetchMovies();
        }
    }));
});
```

#### 2. Client API centralisé avec intercepteurs JWT
```javascript
// api.js - Interception automatique pour JWT
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

#### 3. Modules JavaScript
Les scripts sont chargés comme modules ES6 :
```html
<script type="module" src="js/script.js"></script>
```

## 📄 Pages disponibles

### Pages publiques

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` ou `/index.html` | Carrousel de films populaires |
| Films | `/movies.html` | Liste complète des films avec filtres |
| Détails film | `/movie-details.html?id={id}` | Détails complets d'un film |
| Acteurs | `/actors.html` | Liste des acteurs avec filtres |
| Réalisateurs | `/directors.html` | Liste des réalisateurs |
| Détails personne | `/details.html?type={actor/director}&id={id}` | Biographie et filmographie |
| Recherche | `/search-results.html?query={query}` | Résultats de recherche universelle |

### Pages authentification

| Page | URL | Description |
|------|-----|-------------|
| Connexion | `/login.html` | Formulaire de connexion |
| Inscription | `/register.html` | Formulaire d'inscription |

### Pages privées (authentification requise)

| Page | URL | Description |
|------|-----|-------------|
| Compte | `/compte.html` | Profil utilisateur et statistiques |
| Favoris | `/favoris.html` | Films mis en favoris |
| Listes | `/listes.html` | Listes personnalisées de films |

## 🔐 Authentification

### Système JWT

L'application utilise JWT (JSON Web Tokens) pour l'authentification :

1. **Login** : L'utilisateur se connecte via `/login.html`
2. **Stockage** : Le JWT est stocké dans `localStorage`
3. **Interception** : Axios ajoute automatiquement le token dans les headers
4. **Vérification** : Le backend Strapi vérifie le token sur chaque requête

### Exemple d'utilisation

```javascript
// login.js
import { login } from './authentication.js';

const { jwt, user } = await login(identifier, password);
localStorage.setItem('jwt', jwt);
localStorage.setItem('user', JSON.stringify(user));
```

### Protection des pages

Les pages privées vérifient la présence du JWT :

```javascript
const token = localStorage.getItem('jwt');
if (!token) {
    window.location.href = 'login.html';
}
```

## ✨ Fonctionnalités

### Recherche universelle
- Recherche dans films, acteurs et réalisateurs
- Affichage des résultats par catégorie
- Accessible depuis toutes les pages via le header

### Carrousels Swiper
- **Page d'accueil** : Carrousel plein écran des films populaires
- **Détails acteur/réalisateur** : Filmographie en carrousel
- **Détails film** : Acteurs et réalisateurs en carrousel

### Filtres et tri
- Tri par popularité, date, note
- Filtrage par genre (films)
- Filtrage par genre de film (acteurs)

### Gestion des favoris
- Ajout/suppression de films en favoris
- Vue dédiée des favoris
- Synchronisation avec le backend

### Listes personnalisées
- Création de listes de films
- Ajout/suppression de films dans les listes
- Gestion (édition, suppression) des listes

### Profil utilisateur
- Affichage des informations de compte
- Statistiques (nombre de favoris, listes)
- Déconnexion
- Zone dangereuse (suppression de compte)

## 🎨 Design System

### Palette de couleurs

Le design utilise un thème **rouge sombre** cohérent :

```css
:root {
    /* Couleurs principales */
    --primary-color: #8B0000;      /* Rouge sombre */
    --primary-dark: #6B0000;       /* Rouge très sombre */
    --primary-light: #A00000;      /* Rouge moyen */
    --accent-color: #DC143C;       /* Crimson (rouge vif) */
    --accent-light: #B22222;       /* Firebrick */

    /* Arrière-plans */
    --background-dark: #121212;
    --background-elevation-1: #1E1E1E;
    --background-elevation-2: #2C2C2C;
    --background-footer: #5C0000;

    /* Textes */
    --text-primary: #FFFFFF;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --text-disabled: rgba(255, 255, 255, 0.5);
}
```

### Composants

#### Boutons
- **Primaire** : Fond rouge sombre, texte blanc
- **Secondaire** : Fond transparent, bordure rouge fine
- **Danger** : Fond rouge accent

#### Cards
- Fond `--background-elevation-1`
- Border-radius : 8px
- Ombres Material Design
- Effet hover : élévation + scale

#### Formulaires
- Inputs : Fond `--background-elevation-2`
- Focus : Bordure rouge sombre
- Labels : Texte secondaire

### Responsive
- **Desktop** : > 968px - Layout complet
- **Tablet** : 640px - 968px - Layout adapté
- **Mobile** : < 640px - Layout vertical

## 🔌 API Client

### Configuration Axios

Le client API est configuré dans `src/js/api.js` :

```javascript
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.0/+esm';

const apiClient = axios.create({
  baseURL: 'http://localhost:1337/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour JWT
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
```

### Endpoints utilisés

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/movies` | GET | Liste des films |
| `/movies/:id` | GET | Détails d'un film |
| `/actors` | GET | Liste des acteurs |
| `/actors/:id` | GET | Détails d'un acteur |
| `/directors` | GET | Liste des réalisateurs |
| `/directors/:id` | GET | Détails d'un réalisateur |
| `/genres` | GET | Liste des genres |
| `/auth/local` | POST | Connexion |
| `/auth/local/register` | POST | Inscription |
| `/users/me` | GET | Informations utilisateur |
| `/favorites` | GET/POST/DELETE | Gestion favoris |

### Pagination

Paramètres de pagination Strapi :
```javascript
const params = {
    'pagination[page]': 1,
    'pagination[pageSize]': 25,
    'populate': '*'
};
```

## 🤝 Contribution

### Standards de code

#### HTML
- Indentation : 2 espaces
- Attributs : guillemets doubles
- Classes : kebab-case

#### CSS
- Indentation : 4 espaces
- Propriétés : kebab-case
- Commentaires : sections avec séparateurs

#### JavaScript
- Indentation : 2 espaces
- Convention : camelCase
- Imports ES6 modules
- Async/await préféré aux Promises

### Ajout d'une nouvelle page

1. Créer le fichier HTML dans `src/`
2. Créer le fichier JS associé dans `src/js/`
3. Créer les styles spécifiques si nécessaire dans `src/css/`
4. Importer les dépendances nécessaires (Alpine.js, Axios, etc.)
5. Ajouter les liens de navigation dans le header

### Modification des styles

Les styles sont organisés par section :
- `styles.css` : Styles globaux et pages publiques
- `auth.css` : Pages login/register
- `account.css` : Pages compte/favoris/listes

Toujours utiliser les variables CSS définies dans `:root` pour maintenir la cohérence.

## 📦 Dépendances CDN

Les bibliothèques suivantes sont chargées via CDN :

- **Alpine.js** v3.x : Framework réactif
- **Axios** v1.6.0 : Client HTTP
- **Swiper** v11.x : Carrousels
- **Materialize CSS** v1.0.0 : Framework Material Design
- **Material Icons** : Icônes Google

## 🔧 Configuration serveur

Le serveur Express (`server.js`) est configuré pour :
- Servir les fichiers statiques depuis `/src`
- Port par défaut : 3001
- Logs des requêtes en console

```javascript
const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.static('src'));

app.listen(PORT, () => {
    console.log(`Frontend running on http://localhost:${PORT}`);
});
```

## 📝 Notes importantes

### Pas de build step
Cette application n'utilise pas de bundler (Webpack, Vite, etc.). Les fichiers sont servis directement, ce qui simplifie le développement mais nécessite une connexion internet pour les CDN.

### Compatibilité navigateurs
- Chrome/Edge : ✅ Moderne
- Firefox : ✅ Moderne
- Safari : ✅ 14+
- IE11 : ❌ Non supporté

### Performance
- Lazy loading des images
- Pagination côté serveur
- Cache des appels API (localStorage)
- Carrousels optimisés avec Swiper

## 🐛 Débogage

### Problèmes courants

**Le frontend ne se connecte pas au backend**
- Vérifier que Strapi tourne sur `http://localhost:1337`
- Vérifier l'URL dans `src/js/api.js`
- Vérifier les CORS dans le backend

**Les images ne s'affichent pas**
- Vérifier que TMDb a bien importé les données
- Vérifier les URLs des posters dans la base de données

**Erreur d'authentification**
- Vérifier le JWT dans localStorage
- Vérifier les permissions dans Strapi (Users & Permissions)

**Alpine.js ne se charge pas**
- Vérifier la connexion internet (CDN)
- Vérifier la console pour les erreurs JS

## 📄 Licence

ISC

## 👥 Auteurs

Projet Cineverse - Equipe CLAM - Formation CDA 2025
