import 'server-only';

const dictionaries = {
  en: () =>
    import('./dictionaries/en').then((m) => ({
      t: m.default,
      faq: m.faq,
    })),
  es: () =>
    import('./dictionaries/es').then((m) => ({
      t: m.default,
      faq: m.faq,
    })),
};

export type Locale = keyof typeof dictionaries;
export const locales: Locale[] = ['en', 'es'];
export const defaultLocale: Locale = 'en';

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
