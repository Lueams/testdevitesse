const http = require('http');
const crypto = require('crypto');

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/download')) {
        const sizeMB = parseInt(req.url.split('/')[2]) || 10;
        const sizeBytes = sizeMB * 1024 * 1024;

        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Length': sizeBytes
        });

        crypto.randomBytes(sizeBytes, (err, buf) => {
            if (err) {
                console.error(err);
                res.end('Error');
            } else {
                res.end(buf);
            }
        });
    } else {
        res.writeHead(404);
        res.end('Endpoint non trouvé. Utilisez /download/<taille_en_MB>');
    }
});

server.listen(3000, () => {
    console.log('Serveur léger démarré sur http://localhost:3000');
});