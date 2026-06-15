const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  throw new Error(`Missing web export at ${indexPath}`);
}

let html = fs.readFileSync(indexPath, 'utf8');

const tags = [
  '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-title" content="Fractional Bill Pay">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
  '<meta name="application-name" content="Fractional Bill Pay">',
  '<meta name="format-detection" content="telephone=no">',
  '<link rel="manifest" href="/manifest.json">',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
  '<link rel="icon" type="image/png" href="/favicon.png">',
].join('\n');

html = html.replace(/<meta name="viewport"[^>]*>\s*/i, '');
html = html.replace(/<link rel="manifest"[^>]*>\s*/gi, '');
html = html.replace(/<link rel="apple-touch-icon"[^>]*>\s*/gi, '');
html = html.replace(/<link rel="icon" type="image\/png"[^>]*>\s*/gi, '');
html = html.replace('</head>', `${tags}\n</head>`);

fs.writeFileSync(indexPath, html);
console.log('Added iPhone web app metadata to dist/index.html');
