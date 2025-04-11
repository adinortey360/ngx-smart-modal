const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, 'dist/ngx-smart-modal/package.json');
const pkg = require(pkgPath);

// Update the typings property if needed:
pkg.typings = 'ngx-smart-modal.d.ts';

// If you also want to adjust the exports block:
pkg.exports = {
  "./styles": {
    "sass": "./styles/ngx-smart-modal.scss",
    "css": "./styles/ngx-smart-modal.css"
  },
  "./package.json": {
    "default": "./package.json"
  },
  ".": {
    "types": "./ngx-smart-modal.d.ts",
    "esm2022": "./esm2022/ngx-smart-modal.mjs",
    "esm": "./esm2022/ngx-smart-modal.mjs",
    "default": "./fesm2022/ngx-smart-modal.mjs"
  }
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log("✅ Patched dist/ngx-smart-modal/package.json");
