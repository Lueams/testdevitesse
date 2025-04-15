const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Variables de configuration
const MAX_DOWNLOAD_SIZE_MB = 100; // Taille max en Mo
const DEFAULT_DOWNLOAD_SIZE_MB = 10;

// Route ping (test de latence)
app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

// Route de téléchargement améliorée
app.get('/download/:sizeMB?', (req, res) => {
    try {
        const sizeMB = parseInt(req.params.sizeMB) || DEFAULT_DOWNLOAD_SIZE_MB;
        
        // Validation de la taille
        if (sizeMB > MAX_DOWNLOAD_SIZE_MB) {
            return res.status(400).json({ 
                error: `La taille demandée dépasse la limite de ${MAX_DOWNLOAD_SIZE_MB} Mo` 
            });
        }

        // En-têtes pour éviter la mise en cache
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Length': sizeMB * 1024 * 1024,
            'Cache-Control': 'no-store, no-cache',
            'Pragma': 'no-cache'
        });

        // Génération de données aléatoires (meilleure compression que des zéros)
        const crypto = require('crypto');
        const stream = crypto.randomBytes(sizeMB * 1024 * 1024);
        res.status(200).send(stream);

    } catch (error) {
        console.error('Erreur download:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route d'upload optimisée
app.post('/upload', (req, res) => {
    const startTime = process.hrtime();
    
    try {
        if (!req.body || !req.body.length) {
            return res.status(400).json({ error: 'Aucune donnée reçue' });
        }

        const dataSize = req.body.length;
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const elapsedTime = seconds + nanoseconds / 1e9;
        const speedMbps = (dataSize * 8) / (elapsedTime * 1000000);

        res.status(200).json({
            status: 'success',
            sizeBytes: dataSize,
            sizeMB: (dataSize / (1024 * 1024)).toFixed(2),
            timeSec: elapsedTime.toFixed(3),
            speedMbps: speedMbps.toFixed(2)
        });

    } catch (error) {
        console.error('Erreur upload:', error);
        res.status(500).json({ 
            error: 'Erreur de traitement',
            details: error.message 
        });
    }
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint non trouvé' });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Endpoints disponibles:`);
    console.log(`- GET /ping (test de latence)`);
    console.log(`- GET /download/:sizeMB? (test download, défaut: 10Mo)`);
    console.log(`- POST /upload (test upload, body raw)`);
});