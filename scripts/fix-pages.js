const fs = require('fs');
const path = require('path');

const pagesDir = 'd:\\ManagerMn\\src\\app\\(app)';
const routes = ['accounts', 'transactions', 'journals', 'budgets', 'goals', 'categories', 'exchange-rates', 'reports', 'reconciliation'];

// 1. Add field translations to locales
const viPath = 'd:\\ManagerMn\\locales\\vi.json';
const vi = JSON.parse(fs.readFileSync(viPath, 'utf8'));
const fields = {
  "field.name": "Tên",
  "field.description": "Mô tả",
  "field.type": "Loại",
  "field.amount": "Số tiền",
  "field.balance": "Số dư",
  "field.currency": "Tiền tệ",
  "field.status": "Trạng thái",
  "field.created_at": "Ngày tạo",
  "field.updated_at": "Ngày cập nhật",
  "field.date": "Ngày",
  "field.total": "Tổng",
  "field.allocated": "Đã phân bổ",
  "field.spent": "Đã chi",
  "field.remaining": "Còn lại",
  "field.targetAmount": "Mục tiêu",
  "field.currentAmount": "Hiện tại",
  "field.budget": "Ngân sách",
  "field.statement_date": "Ngày sao kê",
  "field.generated": "Đã tạo",
  "field.last_updated": "Cập nhật lần cuối"
};
Object.assign(vi, fields);
fs.writeFileSync(viPath, JSON.stringify(vi, null, 2), 'utf8');

const enPath = 'd:\\ManagerMn\\locales\\en.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fieldsEn = {
  "field.name": "Name",
  "field.description": "Description",
  "field.type": "Type",
  "field.amount": "Amount",
  "field.balance": "Balance",
  "field.currency": "Currency",
  "field.status": "Status",
  "field.created_at": "Created At",
  "field.updated_at": "Updated At",
  "field.date": "Date",
  "field.total": "Total",
  "field.allocated": "Allocated",
  "field.spent": "Spent",
  "field.remaining": "Remaining",
  "field.targetAmount": "Target",
  "field.currentAmount": "Current",
  "field.budget": "Budget",
  "field.statement_date": "Statement Date",
  "field.generated": "Generated",
  "field.last_updated": "Last Updated"
};
Object.assign(en, fieldsEn);
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');


for (const route of routes) {
  const pagePath = path.join(pagesDir, route, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    
    // Remove the bad early return that skips DataTable empty state
    content = content.replace(/if \(!data \|\| data\.length === 0\) return <div className="p-8 text-center text-content-muted">\{translate\('common\.no_records'\)\}<\/div>;\n/, '');
    
    // Fix headers
    content = content.replace(/header: key, \/\/ Could translate headers dynamically here if we added dict entries/, 'header: translate(`field.${key}`) || key,');
    
    fs.writeFileSync(pagePath, content, 'utf8');
  }
}
