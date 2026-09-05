const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Aliases for renamed assets
  if (reqPath.includes('brikken-co-2026.mp4')) {
    reqPath = '/showreel/psmcodes-2026.mp4';
  } else if (reqPath.includes('brikken-co-2026-preview-desktop.mp4')) {
    reqPath = '/showreel/psmcodes-preview-desktop.mp4';
  } else if (reqPath.includes('brikken-co-2026-preview-mobile.mp4')) {
    reqPath = '/showreel/psmcodes-preview-mobile.mp4';
  }

  // API Endpoints
  if (reqPath === '/api/contact' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      console.log('📬 [Contact Form Submission]:', body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, success: true, message: 'Message received by PSMcodes.' }));
    });
    return;
  }

  let filePath = path.join(__dirname, reqPath);

  // Smart fallbacks for Next.js and flattened paths
  if (!fs.existsSync(filePath)) {
    const filename = path.basename(reqPath);
    const candidates = [
      path.join(__dirname, 'js', filename),
      path.join(__dirname, '_next', 'static', 'chunks', filename),
      path.join(__dirname, '_next', 'static', 'chunks', 'app', filename),
      path.join(__dirname, 'images', filename),
      path.join(__dirname, 'media', filename),
      path.join(__dirname, 'fonts', filename),
      path.join(__dirname, 'draco', filename),
      path.join(__dirname, 'work', filename),
      path.join(__dirname, 'banner', filename),
      path.join(__dirname, 'footer', filename),
      path.join(__dirname, 'services', filename),
    ];
    for (const cand of candidates) {
      if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
        filePath = cand;
        break;
      }
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.warn(`❌ 404: ${req.method} ${req.url} -> ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }
    console.log(`✅ 200: ${req.method} ${reqPath}`);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const total = stats.size;

    // Handle Range Requests (for video streaming / seeking)
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

      if (start >= total) {
        res.writeHead(416, { 'Content-Range': `bytes */${total}` });
        res.end();
        return;
      }

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': total,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`PSMcodes local dev server running at: http://localhost:${PORT}`);
});
