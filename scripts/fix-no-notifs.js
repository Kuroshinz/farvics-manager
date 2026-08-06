const fs = require('fs');

const viPath = 'd:\\ManagerMn\\locales\\vi.json';
const vi = JSON.parse(fs.readFileSync(viPath, 'utf8'));
vi['nav.no_notifications'] = "Không có thông báo mới.";
fs.writeFileSync(viPath, JSON.stringify(vi, null, 2), { encoding: 'utf8' });

const enPath = 'd:\\ManagerMn\\locales\\en.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
en['nav.no_notifications'] = "No new notifications.";
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), { encoding: 'utf8' });

let content = fs.readFileSync('d:\\ManagerMn\\src\\components\\features\\notifications\\NotificationCenter.tsx', 'utf8');
content = content.replace("No new notifications.", "{t('nav.no_notifications')}");
fs.writeFileSync('d:\\ManagerMn\\src\\components\\features\\notifications\\NotificationCenter.tsx', content, 'utf8');
