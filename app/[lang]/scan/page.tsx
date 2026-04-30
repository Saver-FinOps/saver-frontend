import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getDictionary, hasLocale } from '../dictionaries';
import type { Locale } from '../dictionaries';
import { SITE_URL } from '@/app/lib/site';
import ScanForm from './ScanForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) return {};

  const titles: Record<Locale, string> = {
    en: 'Get my AWS waste in dollars | Signal',
    es: 'Pedir escaneo de mi AWS | Signal',
  };

  const descriptions: Record<Locale, string> = {
    en: 'Free read-only scan. Findings emailed in 24-48h. First 100 accounts get it at no cost.',
    es: 'Escaneo gratis solo lectura. Hallazgos por email en 24-48h. Primeras 100 cuentas sin costo.',
  };

  const url = `${SITE_URL}/${lang}/scan`;

  return {
    title: titles[lang],
    description: descriptions[lang],
    robots: 'index,follow',
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en/scan`,
        es: `${SITE_URL}/es/scan`,
        'x-default': `${SITE_URL}/es/scan`,
      },
    },
    openGraph: {
      type: 'website',
      url,
      title: titles[lang],
      description: descriptions[lang],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
    },
  };
}

export default async function ScanPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const { t } = await getDictionary(lang as Locale);

  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 15% 0%, rgba(59,130,246,0.10) 0%, rgba(255,255,255,0) 60%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(16,185,129,0.08) 0%, rgba(255,255,255,0) 55%), #ffffff',
      }}
    >
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors no-underline mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {t.scan_back_to_landing}
        </Link>

        <header className="mb-10">
          <div className="text-sm font-mono uppercase tracking-wider text-slate-500 mb-3">
            {t.scan_eyebrow}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-slate-900 leading-[1.05] tracking-[-0.028em] mb-5">
            {t.scan_h1}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-[640px]">
            {t.scan_sub}
          </p>
        </header>

        <ScanForm lang={lang} t={t} />
      </div>
    </main>
  );
}
