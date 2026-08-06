const fs = require('fs');
const errPath = 'd:\\ManagerMn\\src\\app\\error.tsx';
let err = fs.readFileSync(errPath, 'utf8');

err = err.replace('Da x?y ra l?i h? th?ng c?c b?. D?i ngu k? thu?t da du?c thng bo.', 'Loi: {error.message} - {error.stack}');
fs.writeFileSync(errPath, err);
