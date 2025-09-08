const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 8080;

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// App Runner / ALB arkasında:
app.set('trust proxy', 1);

// Güvenlik başlıkları (CSP kapalı; inline script kullanıyorsan)
app.use(helmet({ contentSecurityPolicy: false }));

// Sıkıştırma
app.use(compression());

// JSON payload sınırı (gerekliyse)
app.use(express.json({ limit: '1mb' }));

// Health check (no-cache, text/plain)
app.get('/health', (req, res) => {
  res.set('Cache-Control', 'no-store')
     .type('text/plain')
     .send('OK');
});

// /public altındaki asset’ler (uzun cache; hash’li adlarda immutable)
app.use(
  '/public',
  express.static(PUBLIC_DIR, {
    setHeaders(res, filePath) {
      if (/\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);

// Kök dizindeki statikler (index.html vb.) — no cache
app.use(
  express.static(ROOT_DIR, {
    extensions: ['html'],
    maxAge: 0,
  })
);

// Chat sayfası (kendi HTML’in /public/chat.html ise)
app.get('/chat', (req, res, next) => {
  res.sendFile('chat.html', { root: PUBLIC_DIR }, (err) => (err ? next(err) : null));
});

// Ana sayfa (istersen bırak, istersen kaldır)
app.get('/', (req, res) => {
  res.type('html').send(`
    <h1>🏛️ Hukuki AI Asistan</h1>
    <p>Backend çalışıyor!</p>
    <a href="/chat">Chat Sayfasına Git</a>
  `);
});

// SPA fallback: sadece HTML isteyen isteklerde index.html dön
app.get('*', (req, res, next) => {
  if (req.accepts('html')) {
    return res.sendFile(path.join(ROOT_DIR, 'index.html'));
  }
  return next(); // JSON/asset istekleri için 404'a düşsün
});

// 404 (HTML dışı istekler için)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Hata yakalayıcı
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Dinle + graceful shutdown
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on ${PORT}`);
});
process.on('SIGTERM', () => server.close(() => process.exit(0)));
