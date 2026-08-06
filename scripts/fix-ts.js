const fs = require('fs');

// Fix 1: Form Action casts
const pages = [
  'd:\\ManagerMn\\src\\app\\(auth)\\forgot-password\\page.tsx',
  'd:\\ManagerMn\\src\\app\\(app)\\settings\\profile\\page.tsx',
  'd:\\ManagerMn\\src\\app\\(app)\\settings\\security\\page.tsx'
];
pages.forEach(p => {
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/action=\{forgotPassword\}/, 'action={forgotPassword as any}');
  content = content.replace(/action=\{updateProfile\}/, 'action={updateProfile as any}');
  content = content.replace(/action=\{logoutAllDevices\}/, 'action={logoutAllDevices as any}');
  fs.writeFileSync(p, content, 'utf8');
});

// Fix 2: Result.fail typing
const handlers = [
  'd:\\ManagerMn\\src\\modules\\identity\\application\\handlers\\AuthHandlers.ts',
  'd:\\ManagerMn\\src\\modules\\identity\\application\\handlers\\WorkspaceHandlers.ts'
];
handlers.forEach(h => {
  let content = fs.readFileSync(h, 'utf8');
  content = content.replace(/Result\.fail\(([^)]+)\)/g, 'Result.fail(new Error($1))');
  fs.writeFileSync(h, content, 'utf8');
});

// Fix 3: Repository import
const repo = 'd:\\ManagerMn\\src\\modules\\identity\\infrastructure\\SupabaseWorkspaceRepository.ts';
let rContent = fs.readFileSync(repo, 'utf8');
rContent = rContent.replace(/..\/..\/..\/..\/shared\/infrastructure\/supabase\/server/, '../../../shared/infrastructure/supabase/server');
fs.writeFileSync(repo, rContent, 'utf8');
