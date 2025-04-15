const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.raw({ 
  type: 'application/octet-stream',
  limit: '10mb'
}));

// Config
const MAX_DOWNLOAD_SIZE_MB = 100;
const DEFAULT_DOWNLOAD_SIZE_MB = 10;

// Endpoints
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.get('/download/:sizeMB?', (req, res) => {
  try {
    const sizeMB = Math.min(
      parseInt(req.params.sizeMB) || DEFAULT_DOWNLOAD_SIZE_MB,
      MAX_DOWNLOAD_SIZE_MB
    );

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Length': sizeMB * 1024 * 1024,
      'Cache-Control': 'no-store'
    });

    const buffer = crypto.randomBytes(sizeMB * 1024 * 1024);
    res.send(buffer);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/upload', (req, res) => {
  const start = process.hrtime();
  
  try {
    const sizeBytes = req.body.length;
    const [seconds, nanoseconds] = process.hrtime(start);
    const elapsed = seconds + nanoseconds / 1e9;
    const speed = (sizeBytes * 8) / (elapsed * 1000000);

    res.json({
      status: 'success',
      sizeMB: (sizeBytes / (1024 * 1024)).toFixed(2),
      timeSec: elapsed.toFixed(3),
      speedMbps: speed.toFixed(2)
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log(`- GET  /ping`);
  console.log(`- GET  /download/:sizeMB?`);
  console.log(`- POST /upload`);
});