const fs = require('fs');
const path = require('path');

const srcAssets = path.resolve(__dirname, '../src/assets');
const distAssets = path.resolve(__dirname, '../dist/assets');
const distDir = path.resolve(__dirname, '../dist');

// Copy assets
if (fs.existsSync(srcAssets)) {
    fs.cpSync(srcAssets, distAssets, { recursive: true });
    console.log('✓ Copied src/assets to dist/assets');
}

// Create .nojekyll for GitHub Pages
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('✓ Created dist/.nojekyll');

// Create _redirects for Netlify / Cloudflare Pages SPA fallback
const redirects = `/* /index.html 200\n`;
fs.writeFileSync(path.join(distDir, '_redirects'), redirects);
console.log('✓ Created dist/_redirects');
