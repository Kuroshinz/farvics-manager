const fs = require('fs');

const files = [
  'd:\\ManagerMn\\src\\app\\(auth)\\login\\page.tsx',
  'd:\\ManagerMn\\src\\app\\(auth)\\forgot-password\\page.tsx',
  'd:\\ManagerMn\\src\\app\\(app)\\settings\\security\\page.tsx',
  'd:\\ManagerMn\\src\\app\\(app)\\settings\\profile\\page.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.startsWith("export const dynamic = 'force-dynamic';\n'use client';")) {
      content = content.replace("export const dynamic = 'force-dynamic';\n'use client';", "'use client';\nexport const dynamic = 'force-dynamic';");
      fs.writeFileSync(f, content);
    }
  }
});
