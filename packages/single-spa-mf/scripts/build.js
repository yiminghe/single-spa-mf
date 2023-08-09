const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function r(...p) {
  return path.join(__dirname, ...p);
}

execSync('rm -rf ' + r('../pkg'), { stdio: 'inherit' });

fs.mkdirSync(r('../pkg'));

const pkg = require('../package.json');

delete pkg.exports;
delete pkg.devDependencies;
delete pkg.scripts;

pkg.main = 'dist-node/index.js';
pkg.module = 'dist-web/index.js';
pkg.types = 'dist-types/index.d.ts';

fs.writeFileSync(r('../pkg/package.json'), JSON.stringify(pkg, null, 2));

fs.copyFileSync(r('webpack.js'), r('../pkg', 'webpack.js'));

fs.copyFileSync(r('webpack.d.ts'), r('../pkg', 'webpack.d.ts'));

execSync('tsc --declaration --emitDeclarationOnly --outDir dist', {
  stdio: 'inherit',
});

execSync('swc ./src -d pkg/dist-web --config-file ./config/web-swc.json', {
  stdio: 'inherit',
});

execSync('swc ./src -d pkg/dist-node --config-file ./config/node-swc.json', {
  stdio: 'inherit',
});

execSync('api-extractor run --local --diagnostics', { stdio: 'inherit' });

const md = fs.readFileSync(r('../etc/single-spa-mf.api.md'), 'utf-8');

let readme = fs.readFileSync(r('../README.md'), 'utf-8');

const start = readme.indexOf('## API Report File for "single-spa-mf"');
const end = readme.indexOf('## demo');

readme = readme.slice(0, start) + md + readme.slice(end);

fs.writeFileSync(r('../README.md'), readme);
fs.writeFileSync(r('../../../README.md'), readme);

fs.copyFileSync(r('../README.md'), r('../pkg', 'README.md'));
