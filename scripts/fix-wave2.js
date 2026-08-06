const fs = require('fs');
const authEntPath = 'd:\\ManagerMn\\src\\app\\actions\\auth-enterprise.ts';
let content = fs.readFileSync(authEntPath, 'utf8');
content = content.replace("return { type: 'about:blank', title: 'Profile Update Failed', status: 400, detail: error.message };", "throw new Error(error.message);");
fs.writeFileSync(authEntPath, content, 'utf8');
