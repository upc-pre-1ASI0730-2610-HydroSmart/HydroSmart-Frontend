// Simple static server that serves the `dist` folder under the
// path `/HydroSmart-Frontend/` so you can test the production build
// locally with the same base path used on GitHub Pages.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const BASE = '/HydroSmart-Frontend';
const DIST = path.join(__dirname, 'dist');

function send404(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Not found');
}

function mimeType(file) {
  const ext = path.extname(file).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json; charset=utf-8',
    '.ico': 'image/x-icon'
  }[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  // Only serve on the expected base path
  if (!req.url.startsWith(BASE)) {
    // redirect to base including trailing slash
    res.statusCode = 302;
    res.setHeader('Location', BASE + '/');
    res.end();
    return;
  }

  // map /HydroSmart-Frontend/ -> dist/index.html
  let rel = req.url.slice(BASE.length) || '/';
  if (rel === '/' || rel === '') rel = '/index.html';

  // prevent path traversal
  const filePath = path.join(DIST, path.normalize(rel).replace(/^\/+/, ''));
  if (!filePath.startsWith(DIST)) return send404(res);

  fs.stat(filePath, (err, stat) => {
    if (err) return send404(res);
    if (stat.isDirectory()) return send404(res);
    const stream = fs.createReadStream(filePath);
    res.setHeader('Content-Type', mimeType(filePath));
    res.statusCode = 200;
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Local server for production build running:`);
  console.log(`  http://localhost:${PORT}${BASE}/`);
});

