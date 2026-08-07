const fs = require('fs');
const path = require('path');
['src/app/actions/journals.ts', 'src/app/actions/reconciliation.ts'].forEach(file => {
  const p = path.join(__dirname, '..', file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/\\nexport/g, '\nexport');
    fs.writeFileSync(p, content);
  }
});
