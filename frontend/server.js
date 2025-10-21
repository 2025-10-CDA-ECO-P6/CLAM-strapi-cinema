const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Servir les fichiers statiques depuis le répertoire courant
app.use(express.static(path.join(__dirname, 'src')));

// Route par défaut pour servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`\n🎬 Serveur Cineverse démarré !`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`\nAppuyez sur Ctrl+C pour arrêter le serveur\n`);
});
