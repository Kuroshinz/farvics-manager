const fs = require('fs');

const viPath = 'd:\\ManagerMn\\locales\\vi.json';
const vi = JSON.parse(fs.readFileSync(viPath, 'utf8'));

vi['nav.overview'] = "T?ng quan";
vi['nav.reports'] = "Báo cáo tài chính";
vi['dashboard.revenue'] = "Doanh thu";
vi['dashboard.expenses'] = "Chi phí";
vi['dashboard.profit'] = "L?i nhu?n ròng";
vi['common.search'] = "Tìm ki?m...";
vi['common.no_records'] = "Chua có d? li?u";
vi['common.no_records_desc'] = "Không tìm th?y d? li?u nào phù h?p v?i tiêu chí hi?n t?i c?a b?n. Vui lòng th? l?i sau ho?c di?u ch?nh b? l?c.";
vi['error.404'] = "Không tìm th?y trang";
vi['error.404_desc'] = "Trang b?n dang tìm ki?m không t?n t?i ho?c dã b? di chuy?n.";
vi['error.500'] = "L?i h? th?ng";
vi['error.500_desc'] = "Ðã x?y ra l?i h? th?ng c?c b?. Ð?i ngu k? thu?t dã du?c thông báo.";
vi['actions.go_home'] = "Quay l?i trang ch?";
vi['dashboard.empty_ledger'] = "S? cái tr?ng";

fs.writeFileSync(viPath, JSON.stringify(vi, null, 2), 'utf8');

const enPath = 'd:\\ManagerMn\\locales\\en.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
en['common.no_records_desc'] = "No records were found matching your criteria.";
en['error.404'] = "Page Not Found";
en['error.404_desc'] = "The page you are looking for does not exist or has been moved.";
en['error.500'] = "System Error";
en['error.500_desc'] = "A critical system error occurred. Engineering has been notified.";
en['actions.go_home'] = "Return Home";
en['dashboard.empty_ledger'] = "Empty Ledger";
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
