const fs = require('fs');

// Patch 1: Fix Auth Action
const authPath = 'd:\\ManagerMn\\src\\app\\actions\\auth.ts';
let authContent = fs.readFileSync(authPath, 'utf8');
authContent = authContent.replace('if (error) return { error: error.message };', 'if (error) { throw new Error(error.message); }');
fs.writeFileSync(authPath, authContent, 'utf8');

// Patch 2: Fix Workspace Domain
const wsPath = 'd:\\ManagerMn\\src\\modules\\identity\\domain\\Workspace.ts';
let wsContent = fs.readFileSync(wsPath, 'utf8');
wsContent = wsContent.replace(/import \{ AggregateRoot, Entity \} from '\.\.\/\.\.\/\.\.\/shared\/core\/DomainService';/, "export abstract class Entity<T> { constructor(public readonly id: T) {} }\nexport abstract class AggregateRoot<T> extends Entity<T> { public addDomainEvent(event: any) {} }");
fs.writeFileSync(wsPath, wsContent, 'utf8');
