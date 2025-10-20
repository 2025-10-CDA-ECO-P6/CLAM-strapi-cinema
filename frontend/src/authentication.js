// S'inscrire
async function register(username, email, password) {
    const response = await axios.post('http://localhost:1337/api/auth/local/register', {
        username: username,
        email: email,
        password: password
    });
    
    // Sauvegarder le token JWT
    localStorage.setItem('jwt', response.data.jwt);
    return response.data;
}

// Se connecter
async function login(identifier, password) {
    const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: identifier, // email ou username
        password: password
    });
    
    localStorage.setItem('jwt', response.data.jwt);
    return response.data;
}

// Récupérer l'utilisateur connecté
async function getMe() {
    const token = localStorage.getItem('jwt');
    const response = await axios.get('http://localhost:1337/api/users/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

// Se déconnecter
function logout() {
    localStorage.removeItem('jwt');
}