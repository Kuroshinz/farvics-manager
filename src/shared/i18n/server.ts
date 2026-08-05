import en from '../../../locales/en.json';
import vi from '../../../locales/vi.json';

const dictionaries: Record<string, any> = { en, vi };
const DEFAULT_LOCALE = 'vi';

export function getDictionary(locale: string = DEFAULT_LOCALE) {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}

export function translate(key: string, locale: string = DEFAULT_LOCALE) {
  const dict = getDictionary(locale);
  return dict[key] || key;
}
