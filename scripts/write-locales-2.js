const fs = require('fs');
const viPath = 'd:\\ManagerMn\\locales\\vi.json';
const vi = JSON.parse(fs.readFileSync(viPath, 'utf8'));
vi['dashboard.reconciliation_id'] = "Đối soát #";
vi['dashboard.reconciliation_desc'] = "Hệ thống tự động khớp 45 bản ghi.";
fs.writeFileSync(viPath, JSON.stringify(vi, null, 2), { encoding: 'utf8' });

const enPath = 'd:\\ManagerMn\\locales\\en.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
en['dashboard.reconciliation_id'] = "Reconciliation #";
en['dashboard.reconciliation_desc'] = "System auto-matched 45 records.";
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), { encoding: 'utf8' });
