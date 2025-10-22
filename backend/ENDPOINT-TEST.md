# Endpoint examples for Testing access and permissions 

## Public Access

```bash
curl http://localhost:1337/api/movies
```

- Reponse 200 avec contenu authorisé

```bash
curl http://localhost:1337/api/favorites
```

- Réponse 403 avec message d'erreur "ForbiddenError" -> Accés non authorisé

## Athentificated Access

### Crée un User

```bash
curl -X 'POST' \
  'http://localhost:1337/api/auth/local/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "foobar",
  "email": "foo.bar@strapi.io",
  "password": "Test1234"
}'
```

### Fecth du Token JWT avec

1. Authentification

```bash
curl -X 'POST' \
  'http://localhost:1337/api/auth/local' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "identifier": "foobar",
  "password": "Test1234"
}'
```

2. Extraction du Jeton JWT dans la réponse

```bash
{"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxMDQwMjYxLCJleHAiOjE3NjM2MzIyNjF9.ohim5fyI-MVIj2BHOrowSDrj7klPF8GaGD83SuOYE0Y","user":{ ...
```

### Utilisation Du Jeton dan le header d'une requete

```bash
curl -X 'GET' \
  'http://localhost:1337/api/favorites' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxMDQwMjYxLCJleHAiOjE3NjM2MzIyNjF9.ohim5fyI-MVIj2BHOrowSDrj7klPF8GaGD83SuOYE0Y'
```

- Réponse 200 avec accés au contenu authorisé

```bash
curl -X 'GET' \
  'http://localhost:1337/api/users' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxMDQwMjYxLCJleHAiOjE3NjM2MzIyNjF9.ohim5fyI-MVIj2BHOrowSDrj7klPF8GaGD83SuOYE0Y'
```

- Réponse 403 avec message d'erreur "ForbiddenError" -> Accés non authorisé


## Frontend Admin Access

```bash
curl -X 'GET' \
  'http://localhost:1337/api/favorites' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxMDQwMjYxLCJleHAiOjE3NjM2MzIyNjF9.ohim5fyI-MVIj2BHOrowSDrj7klPF8GaGD83SuOYE0Y'
```

- Réponse 200 avec accés au contenu authorisé

```bash
curl -X 'GET' \
  'http://localhost:1337/api/users' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxMDQwMjYxLCJleHAiOjE3NjM2MzIyNjF9.ohim5fyI-MVIj2BHOrowSDrj7klPF8GaGD83SuOYE0Y'
```

- Réponse 200 avec accés au contenu authorisé