import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function BackToHome({ lang }: { lang: string }) {
  const isEs = lang === 'es';

  return (
    <Link
      href={`/${lang}`}
      className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors no-underline mb-8 group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      {isEs ? 'Volver al inicio' : 'Back to home'}
    </Link>
  );
}
