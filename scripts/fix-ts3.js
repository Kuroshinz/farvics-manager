const fs = require('fs');

const handlers = [
  'd:\\ManagerMn\\src\\modules\\identity\\application\\handlers\\AuthHandlers.ts',
  'd:\\ManagerMn\\src\\modules\\identity\\application\\handlers\\WorkspaceHandlers.ts'
];
handlers.forEach(h => {
  let content = fs.readFileSync(h, 'utf8');
  content = content.replace(/code: "UNKNOWN_ERROR"/g, 'code: "INTERNAL_ERROR" as any');
  fs.writeFileSync(h, content, 'utf8');
});
