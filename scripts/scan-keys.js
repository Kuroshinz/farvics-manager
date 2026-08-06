const fs = require('fs');
const path = require('path');

const viPath = 'd:\\ManagerMn\\locales\\vi.json';
const vi = JSON.parse(fs.readFileSync(viPath, 'utf8'));
const knownKeys = new Set(Object.keys(vi));

const missingKeys = new Set();
const foundKeys = new Set();

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Match t('key') or translate('key') or t("key") or translate("key")
      const regex = /(?:t|translate)\(['"]([a-z0-9_.]+)['"]\)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const key = match[1];
        foundKeys.add(key);
        if (!knownKeys.has(key)) {
          missingKeys.add(key);
        }
      }
    }
  }
}

scanDir('d:\\ManagerMn\\src');

console.log("Missing keys:");
Array.from(missingKeys).forEach(k => console.log(k));
