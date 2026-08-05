'use client';
import * as React from 'react';

const I18nContext = React.createContext<{ locale: string, t: (key: string) => string }>({
  locale: 'vi',
  t: (key) => key,
});

export function I18nProvider({ children, initialLocale = 'vi', dictionary }: { children: React.ReactNode, initialLocale?: string, dictionary: Record<string, string> }) {
  const [locale, setLocale] = React.useState(initialLocale);

  const t = React.useCallback((key: string) => {
    return dictionary[key] || key;
  }, [dictionary]);

  return (
    <I18nContext.Provider value={{ locale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return React.useContext(I18nContext);
}
