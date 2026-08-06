const fs = require('fs');

const authActionsPath = 'd:\\ManagerMn\\src\\app\\actions\\auth-enterprise.ts';
let authActions = fs.readFileSync(authActionsPath, 'utf8');
authActions = authActions.replace("  });\n  if (error) return createProblem('Profile Update Failed', error.message);\n}", "");
fs.writeFileSync(authActionsPath, authActions);

const switcherPath = 'd:\\ManagerMn\\src\\components\\features\\workspace-switcher\\WorkspaceSwitcher.tsx';
let switcher = fs.readFileSync(switcherPath, 'utf8');
switcher = switcher.replace("ws.id)); }}}", "ws.id)); }}");
fs.writeFileSync(switcherPath, switcher);
