// Publish only files needed to run the game; keep source documents in GitHub.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const destination = path.join(root, 'dist');
fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(destination);
for (const relative of ['index.html', '.nojekyll', 'css', 'data', 'js', 'images', 'assets/fonts']) {
  const target = path.join(destination, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(path.join(root, relative), target, { recursive: true });
}
if (fs.existsSync(path.join(destination, 'CNAME'))) throw new Error('Original domain must not be published');
console.log('GitHub Pages files ready in dist/');
