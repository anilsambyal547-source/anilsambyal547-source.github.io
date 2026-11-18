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

// Remove _redirects if it exists (causes Cloudflare error 100324 infinite loop)
const redirectsPath = path.join(distDir, '_redirects');
if (fs.existsSync(redirectsPath)) {
    fs.unlinkSync(redirectsPath);
    console.log('✓ Removed dist/_redirects');
}
