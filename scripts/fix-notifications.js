const fs = require('fs');

const viPath = 'd:\\ManagerMn\\locales\\vi.json';
const vi = JSON.parse(fs.readFileSync(viPath, 'utf8'));
vi['nav.notifications'] = "Thông báo";
fs.writeFileSync(viPath, JSON.stringify(vi, null, 2), { encoding: 'utf8' });

const enPath = 'd:\\ManagerMn\\locales\\en.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
en['nav.notifications'] = "Notifications";
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), { encoding: 'utf8' });
