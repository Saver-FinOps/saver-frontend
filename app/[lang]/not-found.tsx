'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const COPY = {
  en: {
    title: '404',
    heading: 'This page is gone.',
    body: "Like an EBS volume from a test you ran in 2023 — except this one isn't costing you $84 a month.",
    home: 'Back to home',
    contact: 'Tell us what broke',
  },
  es: {
    title: '404',
    heading: 'Esta página se fue.',
    body: 'Como un volumen EBS de un test que corriste en 2023 — solo que esta no te está cobrando $84 al mes.',
    home: 'Volver al inicio',
    contact: 'Contanos qué se rompió',
  },
} as const;

export default function NotFound() {
  const pathname = usePathname();
  const lang: 'en' | 'es' = pathname?.startsWith('/es') ? 'es' : 'en';
  const t = COPY[lang];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="text-8xl font-display font-bold mb-4 leading-none tracking-tight"
        style={{
          background: 'linear-gradient(45deg, #3b82f6, #10b981)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {t.title}
      </div>
      <h1 className="text-3xl font-display font-semibold text-slate-900 leading-[1.1] tracking-[-0.025em] mb-3">
        {t.heading}
      </h1>
      <p className="text-base text-slate-600 max-w-md mb-8 leading-relaxed">
        {t.body}
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href={`/${lang}`}
          className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold no-underline"
        >
          {t.home}
        </Link>
        <Link
          href={`/${lang}/contact`}
          className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-900 text-sm font-semibold no-underline border border-slate-200"
        >
          {t.contact}
        </Link>
      </div>
    </main>
  );
}
