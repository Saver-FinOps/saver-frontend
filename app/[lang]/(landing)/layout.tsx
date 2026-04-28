import { Suspense } from 'react';
import { getDictionary, hasLocale } from '../dictionaries';
import type { Locale } from '../dictionaries';
import SampleModal from './components/SampleModal';
import TweaksToolbar from './components/TweaksToolbar';

const TWEAKS_ENABLED =
  process.env.NODE_ENV !== 'production' ||
  process.env.NEXT_PUBLIC_TWEAKS_ENABLED === '1';

export default async function LandingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) return children;

  const { t } = await getDictionary(lang as Locale);

  return (
    <>
      {children}
      <SampleModal lang={lang} t={t} />
      {TWEAKS_ENABLED && (
        <Suspense>
          <TweaksToolbar lang={lang} />
        </Suspense>
      )}
    </>
  );
}
