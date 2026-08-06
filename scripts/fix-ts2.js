const fs = require('fs');

const handlers = [
  'd:\\ManagerMn\\src\\modules\\identity\\application\\handlers\\AuthHandlers.ts',
  'd:\\ManagerMn\\src\\modules\\identity\\application\\handlers\\WorkspaceHandlers.ts'
];
handlers.forEach(h => {
  let content = fs.readFileSync(h, 'utf8');
  content = content.replace(/Result\.fail\(new Error\(([^)]+)\)\)/g, 'Result.fail({ code: "UNKNOWN_ERROR", message: String($1) })');
  fs.writeFileSync(h, content, 'utf8');
});
