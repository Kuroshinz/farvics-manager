const fs = require('fs');

let notif = fs.readFileSync('d:\\ManagerMn\\src\\components\\features\\notifications\\NotificationCenter.tsx', 'utf8');
notif = notif.replace("import { Typography } from '../../ui/typography/Typography';", "import { Typography } from '../../ui/typography/Typography';\nimport { useTranslation } from '../../../providers/I18nProvider';");
notif = notif.replace("export function NotificationCenter() {\n  const { isOpen, toggle, close } = useDisclosure();", "export function NotificationCenter() {\n  const { isOpen, toggle, close } = useDisclosure();\n  const { t } = useTranslation();");
notif = notif.replace(">Notifications<", ">{t('nav.notifications') || 'Thông báo'}<");
notif = notif.replace(">No new notifications.<", ">{t('common.no_records')}<");
fs.writeFileSync('d:\\ManagerMn\\src\\components\\features\\notifications\\NotificationCenter.tsx', notif);
