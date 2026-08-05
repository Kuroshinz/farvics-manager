import { AppShell } from '../../components/layouts/AppShell/AppShell';
import { I18nProvider } from '../../providers/I18nProvider';
import { getDictionary } from '../../shared/i18n/server';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Always default to Vietnamese per requirements
  const dict = getDictionary('vi');

  return (
    <I18nProvider dictionary={dict} initialLocale="vi">
      <AppShell>{children}</AppShell>
    </I18nProvider>
  );
}
