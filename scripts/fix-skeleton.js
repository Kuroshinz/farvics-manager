const fs = require('fs');
const pagePath = 'd:\\ManagerMn\\src\\app\\(app)\\page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

const skeleton = `
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-white/5 w-64 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-white/5 rounded-3xl" />
        <div className="h-96 bg-white/5 rounded-3xl" />
      </div>
    </div>
  );
}
`;

content = content.replace('export default function DashboardPage() {', `${skeleton}\nexport default function DashboardPage() {`);
content = content.replace('<Suspense fallback={<div className="p-12 text-center animate-pulse text-content-muted">{translate(\'common.loading\')}</div>}>', '<Suspense fallback={<DashboardSkeleton />}>');

fs.writeFileSync(pagePath, content);
console.log('OK');
