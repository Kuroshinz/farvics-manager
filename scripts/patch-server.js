const fs = require('fs');

// Patch Dashboard Page
let dashboard = fs.readFileSync('d:\\ManagerMn\\src\\app\\(app)\\page.tsx', 'utf8');
dashboard = dashboard.replace("import { Wallet", "import { translate } from '../../shared/i18n/server';\nimport { Wallet");
dashboard = dashboard.replace('title="Command Center"', 'title={translate("dashboard.title")}');
dashboard = dashboard.replace('description="Enterprise liquidity flows and AI-driven projections in real-time."', 'description={translate("dashboard.desc")}');
dashboard = dashboard.replace("label: 'Farvics HQ'", "label: translate('common.farvics_hq')");
dashboard = dashboard.replace("label: 'Dashboards'", "label: translate('common.dashboards')");
dashboard = dashboard.replace(">Generate Report<", ">{translate('actions.generate_report')}<");

dashboard = dashboard.replace('title="Total Revenue"', 'title={translate("dashboard.revenue")}');
dashboard = dashboard.replace('title="Monthly Expenses"', 'title={translate("dashboard.expenses")}');
dashboard = dashboard.replace('title="Net Profit"', 'title={translate("dashboard.profit")}');
dashboard = dashboard.replace('title="Cash Runway"', 'title={translate("dashboard.runway")}');
dashboard = dashboard.replace('amount="18 Months"', 'amount="18 Months"'); // Assuming numbers don't need translations yet, or format
dashboard = dashboard.replace('trend="Stable"', 'trend={translate("dashboard.stable")}');

fs.writeFileSync('d:\\ManagerMn\\src\\app\\(app)\\page.tsx', dashboard);

// Patch Widgets.tsx (Client Components)
let widgets = fs.readFileSync('d:\\ManagerMn\\src\\components\\features\\dashboard\\Widgets.tsx', 'utf8');
widgets = widgets.replace("import { cn } from '../../../lib/utils';", "import { cn } from '../../../lib/utils';\nimport { useTranslation } from '../../../providers/I18nProvider';");
widgets = widgets.replace("export function AIInsightCard() {", "export function AIInsightCard() {\n  const { t } = useTranslation();");
widgets = widgets.replace(">Farvics Intelligence<", ">{t('dashboard.ai_insight_title')}<");
widgets = widgets.replace("Operational runway has extended by 14 days based on current MRR trajectory. Consider allocating surplus to Q3 marketing initiatives.", "{t('dashboard.ai_insight_desc')}");
widgets = widgets.replace(">Execute Allocation<", ">{t('dashboard.execute_allocation')}<");

widgets = widgets.replace("export function RecentTransactions() {", "export function RecentTransactions() {\n  const { t } = useTranslation();");
widgets = widgets.replace(">Recent Ledger<", ">{t('dashboard.recent_ledger')}<");
widgets = widgets.replace(">View All<", ">{t('dashboard.view_all')}<");

widgets = widgets.replace("export function ActivityTimeline() {", "export function ActivityTimeline() {\n  const { t } = useTranslation();");
widgets = widgets.replace(">Action Timeline<", ">{t('dashboard.action_timeline')}<");
fs.writeFileSync('d:\\ManagerMn\\src\\components\\features\\dashboard\\Widgets.tsx', widgets);

// Patch DynamicChart.tsx
let chart = fs.readFileSync('d:\\ManagerMn\\src\\components\\features\\dashboard\\DynamicChart.tsx', 'utf8');
chart = chart.replace("import { Typography } from '../../ui/typography/Typography';", "import { Typography } from '../../ui/typography/Typography';\nimport { useTranslation } from '../../../providers/I18nProvider';");
chart = chart.replace("export default function DynamicChartWidget() {", "export default function DynamicChartWidget() {\n  const { t } = useTranslation();");
chart = chart.replace(">Cash Flow Velocity<", ">{t('dashboard.cash_flow_velocity')}<");
fs.writeFileSync('d:\\ManagerMn\\src\\components\\features\\dashboard\\DynamicChart.tsx', chart);
