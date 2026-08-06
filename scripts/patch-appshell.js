const fs = require('fs');
const p = 'd:\\ManagerMn\\src\\components\\layouts\\AppShell\\AppShell.tsx';
let txt = fs.readFileSync(p, 'utf8');

txt = txt.replace(/<Sidebar \/>/g, '<Sidebar collapsed={false} onToggle={() => {}} />');
txt = txt.replace(/<Topbar \/>/g, '<Topbar onOpenCommandPalette={() => {}} />');
fs.writeFileSync(p, txt);
