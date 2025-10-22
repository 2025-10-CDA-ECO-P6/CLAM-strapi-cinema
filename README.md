# CLAM-strapi-cinema
## :page_facing_up: Présentation
Le projet Strapi Cinema a pour objectif de concevoir une API complète permettant de gérer et d’exposer des données cinématographiques (films, réalisateurs, acteurs) via un CMS headless : Strapi. L'API interagit avec l’API externe The Movie Database (TMDb) pour importer, enrichir et exposer ces données de manière sécurisée.

Accès au site déployé : Cineverse - `http://localhost:3001`  
Le panneau d’administration est accessible sur : `http://localhost:1337/admin`  

## :sparkles: Fonctionnalités
- Installation et configuration d’un projet Strapi avec base de données externe
- Modélisation des données : Films, Acteurs et Réalisateurs avec relations multidirectionnelles
- Import automatisé des données via l’API TMDb
- Endpoints REST sécurisés (authentification par token)
- Documentation complète des routes API
- Pipeline d’intégration continue avec tests et linting automatisés
- Interface front-end statique HTML/CSS responsive avec consommation API via JavaScript
- Artefacts UX : personas, user journeys, wireframes, maquettes haute fidélité

## :clipboard:	Prérequis
- Node.js [version >=18.0.0 <=22.x.x]
- npm 
- Strapi (framework CMS headless) 
- Clé API valide TMDb (stockée dans `.env`)
- Base de données externe 
- Outils pour tests API (Postman, curl)

## :package:	Installation
### 1. Cloner le dépôt : 
`git clone https://github.com/2025-10-CDA-ECO-P6/CLAM-strapi-cinema.git`  
`cd CLAM-strapi-cinema`
### 2. Installer les dépendances backend (Strapi) : 
`cd /backend`
`npm install`
### 3. Configurer le variables de la base de donnée et la clé TMDb dans le fichier `.env` : 

`DATABASE_CLIENT=your_database_client`
`DATABASE_HOST=your_database_host` 
`DATABASE_PORT=your_database_port`  
`DATABASE_NAME=your_database_name` 
`DATABASE_USERNAME=your_database_username`  
`DATABASE_PASSWORD=your_database_password`  
`DATABASE_SSL=false`  
`DATABASE_FILENAME=.tmp/data.db` 
`TMDB_API_KEY=your_api_key_here`  

### 4. Lancer le serveur Strapi : 
`npm run develop`

## :computer:	 Utilisation
- Utiliser les endpoints REST documentés pour gérer films et acteurs.
- Importer ou mettre à jour les données TMDb via le script et le cronjob.
- Authentification requise via token JWT pour sécuriser l’accès API.
- Tester les endpoints avec Postman ou curl (exemples fournis dans la documentation).

## :building_construction:	Architecture & technologies
- CMS Headless Strapi (Node.js)
- Base de données externe (Postgres)
- Intégration données externes de TMDb
- Frontend statique HTML/CSS + JavaScript vanilla
- GitHub Actions pour CI (lint, tests automatiques)
- [![CI - Front & Back Cineverse(Strapi)](https://github.com/2025-10-CDA-ECO-P6/CLAM-strapi-cinema/actions/workflows/ci.yml/badge.svg)](https://github.com/2025-10-CDA-ECO-P6/CLAM-strapi-cinema/actions/workflows/ci.yml)

## :lock:	Sécurité
- API protégée par JWT
- Gestion des rôles et permissions via Strapi
- Protection des endpoints sensibles (401 ou 403 Unauthorized pour accès non authentifiés)

## :white_check_mark:	Tests et intégration continue
- Pipeline GitHub Actions configuré : lint et build à chaque push/PR
- Instructions pour lancer lint/build localement dans la documentation du projet
- Utilisation de scripts npm pour automatiser les opérations courantes

## :art:	Frontend
- Page vitrine statique HTML/CSS responsive pour parcourir films, acteurs et réalisateurs
- Maquettes UX/UI validées (personas, user journeys, wireframes, maquettes haute fidélité)
- Consommation de l’API Strapi via fetch/JavaScript pour affichage dynamique

## :scroll:	Licence
Le projet est distribué sous la licence MIT.  

## :email:	Contacts
**Maxime MAUSSION** - https://github.com/XamTV  
**Louis DALONIS** - https://github.com/ColJurten  
**Amandine KEMP** - https://github.com/amandinekemp  
**Charlène SCOMPARIN** - https://github.com/ChSPN  

