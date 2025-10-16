# strapi-cinema
[doc en construction]
## Présentation
Le projet Strapi Cinema a pour objectif de concevoir une API complète permettant de gérer et d’exposer des données cinématographiques (films, réalisateurs, acteurs) via un CMS headless : Strapi. L'API interagit avec l’API externe The Movie Database (TMDb) pour importer, enrichir et exposer ces données de manière sécurisée.

Accès au site déployé : Cineverse - [lien site]

## Fonctionnalités
- Installation et configuration d’un projet Strapi avec base locale sécurisée
- Modélisation des données : Films et Acteurs avec relations bidirectionnelles
- Import automatisé des données via l’API TMDb
- Endpoints REST sécurisés (authentification par token)
- Documentation complète des routes API
- Pipeline d’intégration continue avec tests et linting automatisés
- Interface front-end statique HTML/CSS responsive avec consommation API via JavaScript
- Artefacts UX : personas, user journeys, wireframes, maquettes haute fidélité

## Prérequis
- Node.js [version recommandée?20?]
- npm ou yarn
- Strapi (framework CMS headless) [version recommandée?]
- Clé API valide TMDb (stockée dans .env)
- Base de données locale SQLite
- Outils pour tests API (Postman, curl, Rest Client)

## Installation
### 1. Cloner le dépôt : 
`git clone https://github.com/2025-10-CDA-ECO-P6/CLAM-strapi-cinema.git`  
`cd CLAM-strapi-cinema`
### 2. Installer les dépendances backend (Strapi) : 
`npm install`
### 3. Configurer la clé TMDb dans le fichier `.env` : 
`TMDB_API_KEY=your_api_key_here`
### Lancer le serveur Strapi : 
`npm run develop`

Le panneau d’administration sera accessible sur :
`http://localhost:1337/admin`

## Utilisation
- Utiliser les endpoints REST documentés pour gérer films et acteurs.
- Importer ou mettre à jour les données TMDb via la commande/script prévu.
- Authentification requise via token JWT pour sécuriser l’accès API.
- Tester les endpoints avec Postman ou curl (exemples fournis dans la documentation).

## Architecture & technologies
- CMS Headless Strapi (Node.js)
- Base de données locale (SQLite)
- Intégration données externes de TMDb
- Frontend statique HTML/CSS + JavaScript vanilla ou framework léger
- GitHub Actions pour CI (lint, tests automatiques)
-  API REST

## Sécurité
- API protégée par JWT
- Gestion des rôles et permissions via Strapi
- Protection des endpoints sensibles (401 Unauthorized pour accès non authentifiés)

## Tests et intégration continue
- Pipeline GitHub Actions configuré : lint, build, tests à chaque push/PR
- Instructions pour lancer lint/tests localement dans la documentation du projet
- Utilisation de scripts npm pour automatiser les opérations courantes

## Frontend
- Page vitrine statique HTML/CSS responsive pour parcourir films, acteurs et réalisateurs
- Maquettes UX/UI validées (personas, user journeys, wireframes, maquettes haute fidélité)
- Consommation de l’API Strapi via fetch/JavaScript pour affichage dynamique

## Roadmap
Listez les évolutions prévues et les jalons importants

## Licence
Le projet est distribué sous la licence MIT.

## Contacts
**Maxime MAUSSION** - https://github.com/XamTV  
**Louis DALONIS** - https://github.com/ColJurten  
**Amandine KEMP** - https://github.com/amandinekemp  
**Charlène SCOMPARIN** - https://github.com/ChSPN  

