const fs = require('fs');

const authEntPath = 'd:\\ManagerMn\\src\\app\\actions\\auth-enterprise.ts';
let content = fs.readFileSync(authEntPath, 'utf8');
content = content.replace("return { success: true };", "redirect('/');").replace("return { success: true };", "redirect('/');").replace("return { success: true };", "redirect('/');");
fs.writeFileSync(authEntPath, content, 'utf8');

const fpPath = 'd:\\ManagerMn\\src\\app\\(auth)\\forgot-password\\page.tsx';
let fp = fs.readFileSync(fpPath, 'utf8');
fp = fp.replace("'../../../actions/auth-enterprise'", "'../../actions/auth-enterprise'");
fp = fp.replace("'../../../../components/ui/glass-panel/GlassPanel'", "'../../../components/ui/glass-panel/GlassPanel'");
fp = fp.replace("'../../../../components/ui/typography/Typography'", "'../../../components/ui/typography/Typography'");
fs.writeFileSync(fpPath, fp, 'utf8');
