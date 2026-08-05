const fs = require('fs');

// Patch Sidebar.tsx
let sidebar = fs.readFileSync('d:\\ManagerMn\\src\\components\\layouts\\AppShell\\Sidebar.tsx', 'utf8');
sidebar = sidebar.replace("import { usePathname } from 'next/navigation';", "import { usePathname } from 'next/navigation';\nimport { useTranslation } from '../../../providers/I18nProvider';");
sidebar = sidebar.replace("export function Sidebar({ collapsed, onToggle }: SidebarProps) {", "export function Sidebar({ collapsed, onToggle }: SidebarProps) {\n  const { t } = useTranslation();");
sidebar = sidebar.replace("label: 'Overview'", "label: 'nav.overview'");
sidebar = sidebar.replace("label: 'Accounts'", "label: 'nav.accounts'");
sidebar = sidebar.replace("label: 'Transactions'", "label: 'nav.transactions'");
sidebar = sidebar.replace("label: 'Journals'", "label: 'nav.journals'");
sidebar = sidebar.replace("label: 'Budgets'", "label: 'nav.budgets'");
sidebar = sidebar.replace("label: 'Goals'", "label: 'nav.goals'");
sidebar = sidebar.replace("{item.label}", "{t(item.label)}");
fs.writeFileSync('d:\\ManagerMn\\src\\components\\layouts\\AppShell\\Sidebar.tsx', sidebar);

// Patch Topbar.tsx
let topbar = fs.readFileSync('d:\\ManagerMn\\src\\components\\layouts\\AppShell\\Topbar.tsx', 'utf8');
topbar = topbar.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { useTranslation } from '../../../providers/I18nProvider';");
topbar = topbar.replace("export function Topbar({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {", "export function Topbar({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {\n  const { t } = useTranslation();");
topbar = topbar.replace(">Command Center...<", ">{t('common.search')}<");
topbar = topbar.replace(">Operational<", ">{t('common.operational')}<");
fs.writeFileSync('d:\\ManagerMn\\src\\components\\layouts\\AppShell\\Topbar.tsx', topbar);

// Patch WorkspaceSwitcher.tsx
let workspaceSwitcher = fs.readFileSync('d:\\ManagerMn\\src\\components\\features\\workspace-switcher\\WorkspaceSwitcher.tsx', 'utf8');
workspaceSwitcher = workspaceSwitcher.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';\nimport { useTranslation } from '../../../providers/I18nProvider';");
workspaceSwitcher = workspaceSwitcher.replace("const workspaces = ['Farvics HQ'", "const { t } = useTranslation();\n  const workspaces = [t('common.farvics_hq')");
fs.writeFileSync('d:\\ManagerMn\\src\\components\\features\\workspace-switcher\\WorkspaceSwitcher.tsx', workspaceSwitcher);

// Patch CommandPalette.tsx
let commandPalette = fs.readFileSync('d:\\ManagerMn\\src\\components\\features\\command-palette\\CommandPalette.tsx', 'utf8');
commandPalette = commandPalette.replace("import { Typography } from '../../ui/typography/Typography';", "import { Typography } from '../../ui/typography/Typography';\nimport { useTranslation } from '../../../providers/I18nProvider';");
commandPalette = commandPalette.replace("export function CommandPalette({ onClose }: { onClose: () => void }) {", "export function CommandPalette({ onClose }: { onClose: () => void }) {\n  const { t } = useTranslation();");
commandPalette = commandPalette.replace('placeholder="Type a command or search..."', 'placeholder={t("common.search")}');
commandPalette = commandPalette.replace(">Smart Suggestions<", ">{t('cmd.smart_suggestions')}<");
commandPalette = commandPalette.replace(">Record Transaction<", ">{t('cmd.record_tx')}<");
commandPalette = commandPalette.replace(">Log a new expense or income<", ">{t('cmd.record_tx_desc')}<");
commandPalette = commandPalette.replace(">View Analytics<", ">{t('cmd.view_analytics')}<");
commandPalette = commandPalette.replace(">Check this month's cash flow<", ">{t('cmd.view_analytics_desc')}<");
commandPalette = commandPalette.replace(">Powered by Farvics AI<", ">{t('cmd.powered_by')}<");
fs.writeFileSync('d:\\ManagerMn\\src\\components\\features\\command-palette\\CommandPalette.tsx', commandPalette);
