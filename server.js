const express = require('express');
const app = express();
const PORT = 3000;

// Test de DOWNLOAD : Renvoie un fichier de 10 Mo
app.get('/download', (req, res) => {
    const fileSizeInMB = 10;
    const dummyData = Buffer.alloc(fileSizeInMB * 1024 * 1024); // Crée un fichier de 10 Mo rempli de 0
    res.send(dummyData);
});

// Test d'UPLOAD : Reçoit des données et répond "OK"
app.post('/upload', (req, res) => {
    req.on('data', () => {}); // Ignore les données reçues (mais mesure le temps)
    res.send("OK");
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});