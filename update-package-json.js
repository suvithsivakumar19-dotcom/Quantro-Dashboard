const fs = require('fs');
const p = JSON.parse(fs.readFileSync('package.json', 'utf8'));

p.scripts = Object.assign({}, p.scripts, {
  backend: 'node server/index.js',
  client: 'vite',
  dev: 'concurrently "npm run backend" "npm run client"',
  'dev:backend': 'nodemon server/index.js'
});

p.dependencies = Object.assign({}, p.dependencies, {
  express: '^4.18.2',
  cors: '^2.8.5',
  'better-sqlite3': '^8.0.1'
});

p.devDependencies = Object.assign({}, p.devDependencies, {
  concurrently: '^8.2.2',
  nodemon: '^3.0.1'
});

fs.writeFileSync('package.json', JSON.stringify(p, null, 2));
console.log('package.json updated');
