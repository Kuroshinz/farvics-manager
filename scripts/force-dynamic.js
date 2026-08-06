const fs = require('fs');

const files = [
  'd:\\ManagerMn\\src\\app\\(auth)\\login\\page.tsx',
  'd:\\ManagerMn\\src\\app\\(auth)\\forgot-password\\page.tsx',
  'd:\\ManagerMn\\src\\app\\(app)\\settings\\security\\page.tsx',
  'd:\\ManagerMn\\src\\app\\(app)\\layout.tsx',
  'd:\\ManagerMn\\src\\app\\layout.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('export const dynamic')) {
      content = "export const dynamic = 'force-dynamic';\n" + content;
      fs.writeFileSync(f, content);
    }
  }
});
