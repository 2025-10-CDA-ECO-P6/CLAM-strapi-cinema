# Pages d'Authentification - Cineverse

Ce document décrit les pages d'authentification créées pour Cineverse.

## Pages créées

### 1. Page de Connexion (`login.html`)
- **URL**: `/login.html`
- **Fonctionnalités**:
  - Formulaire de connexion avec email/nom d'utilisateur et mot de passe
  - Validation des champs en temps réel
  - Messages d'erreur et de succès personnalisés
  - Redirection automatique vers la page d'accueil après connexion
  - Lien vers la page d'inscription
  - Détection automatique si l'utilisateur est déjà connecté

### 2. Page d'Inscription (`register.html`)
- **URL**: `/register.html`
- **Fonctionnalités**:
  - Formulaire d'inscription avec nom d'utilisateur, email et mot de passe
  - Validation du mot de passe (minimum 6 caractères)
  - Confirmation du mot de passe
  - Vérification en temps réel des critères du mot de passe
  - Messages d'erreur détaillés (email déjà utilisé, etc.)
  - Redirection automatique après inscription réussie
  - Lien vers la page de connexion

## Fichiers JavaScript

### `login.js`
- Gère le formulaire de connexion
- Appelle l'API Strapi `/api/auth/local`
- Stocke le JWT et les données utilisateur dans localStorage
- Gère les erreurs d'authentification

### `register.js`
- Gère le formulaire d'inscription
- Appelle l'API Strapi `/api/auth/local/register`
- Validation complète des champs
- Vérification de la correspondance des mots de passe

### Modifications dans `script.js`
- Ajout d'un gestionnaire pour le bouton "Connexion" dans le header
- Détection de l'état de connexion de l'utilisateur
- Affichage du nom d'utilisateur si connecté
- Option de déconnexion via une boîte de confirmation

## Utilisation de l'API

Les pages utilisent les endpoints Strapi suivants :

### Connexion
```javascript
POST http://localhost:1337/api/auth/local
Body: {
  identifier: "email ou username",
  password: "motdepasse"
}
Response: {
  jwt: "token",
  user: { id, username, email, ... }
}
```

### Inscription
```javascript
POST http://localhost:1337/api/auth/local/register
Body: {
  username: "username",
  email: "email@example.com",
  password: "motdepasse"
}
Response: {
  jwt: "token",
  user: { id, username, email, ... }
}
```

## Stockage des données

Les informations suivantes sont stockées dans le localStorage :
- `jwt`: Token d'authentification JWT
- `user`: Objet JSON contenant les informations de l'utilisateur

## Sécurité

- Les mots de passe doivent contenir au moins 6 caractères
- Les tokens JWT sont automatiquement attachés aux requêtes via l'interceptor Axios
- Les erreurs d'API sont gérées avec des messages utilisateur appropriés
- Validation côté client avant envoi à l'API

## Style

Les pages utilisent :
- Le même header et footer que les autres pages
- Les variables CSS définies dans `styles.css`
- Material Design avec Materialize CSS
- Animations fluides pour les messages d'erreur/succès
- Design responsive

## Intégration

Pour intégrer ces pages dans d'autres pages du site :

1. Le bouton "Connexion" dans le header redirige automatiquement vers `/login.html`
2. Si l'utilisateur est connecté, le bouton affiche son nom d'utilisateur
3. Cliquer sur le nom d'utilisateur propose de se déconnecter

## Prochaines améliorations possibles

- Page de profil utilisateur
- Récupération de mot de passe oublié
- Modification des informations du compte
- Menu dropdown pour les utilisateurs connectés
- Intégration avec les favoris et autres fonctionnalités personnalisées
