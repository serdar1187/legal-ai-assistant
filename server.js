const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

// App Runner reverse proxy arkasında çalışır:
app.set('trust proxy', 1);

// Statik dosyalar (repo kökü)
app.use(express.static(__dirname, { extensions: ['html'] }));

// Health check endpoint (App Runner'da path'i /health yapmanı öneririm)
app.get('/health', (req, res) => res.status(200).send('OK'));

// SPA fallback: dosya bulunamazsa index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on ${PORT}`);
});
