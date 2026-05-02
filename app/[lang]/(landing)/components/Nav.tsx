'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, Container, Logo } from './ui';
import type { Dictionary } from '../../dictionaries';
import { track } from '@/app/lib/analytics';

/* ------------------------------------------------------------------ */
/*  LangToggle                                                         */
/* ------------------------------------------------------------------ */

const LANG_LABELS: Record<'en' | 'es', string> = {
  en: 'English',
  es: 'Español',
};

function LangToggle({ lang }: { lang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hrefFor = (k: 'en' | 'es') => {
    const newPath = pathname.replace(`/${lang}`, `/${k}`);
    const qs = searchParams.toString();
    return qs ? `${newPath}?${qs}` : newPath;
  };

  return (
    <div className="inline-flex bg-slate-100 rounded-full p-[3px] text-xs font-semibold border border-slate-200">
      {(['en', 'es'] as const).map((k) => {
        const href = hrefFor(k);
        const isActive = lang === k;
        return (
          <a
            key={k}
            href={href}
            hrefLang={k}
            aria-label={LANG_LABELS[k]}
            onClick={(e) => {
              if (isActive) {
                e.preventDefault();
                return;
              }
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
              track('lang_switch', { from: lang, to: k });
              e.preventDefault();
              router.push(href);
            }}
            className={`no-underline px-2.5 py-1 rounded-full font-body font-semibold text-xs uppercase tracking-[0.05em] transition-all duration-200 ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-transparent text-slate-500'
            }`}
          >
            {k}
          </a>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NavInner                                                           */
/* ------------------------------------------------------------------ */

const navLinkCls =
  'text-sm font-medium text-slate-600 no-underline transition-colors duration-200';

function NavInner({
  lang,
  t,
}: {
  lang: string;
  t: Dictionary['t'];
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onJoinClick = () => {
    track('cta_click', { source: 'nav', cta: 'primary' });
    const form = document.getElementById('join');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const emailInput = form.querySelector<HTMLInputElement>(
        'input[type="email"]',
      );
      setTimeout(() => emailInput?.focus({ preventScroll: true }), 500);
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-250"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.78)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled
          ? 'blur(14px) saturate(180%)'
          : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(226,232,240,0.8)'
          : '1px solid transparent',
      }}
    >
      <Container className="h-[72px] flex items-center justify-between gap-3">
        <Logo />
        <div className="flex items-center gap-3 md:gap-7">
          <a
            href="#how"
            className={`${navLinkCls} hidden md:inline`}
            onClick={() => track('nav_link_click', { link: 'how' })}
          >
            {t.nav_how}
          </a>
          <a
            href="#why"
            className={`${navLinkCls} hidden md:inline`}
            onClick={() => track('nav_link_click', { link: 'why' })}
          >
            {t.nav_why}
          </a>
          <a
            href="#faq"
            className={`${navLinkCls} hidden md:inline`}
            onClick={() => track('nav_link_click', { link: 'faq' })}
          >
            {t.nav_faq}
          </a>
          <LangToggle lang={lang} />
          <Button size="sm" variant="primary" onClick={onJoinClick}>
            {t.nav_cta}
          </Button>
        </div>
      </Container>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Nav — public export                                                */
/* ------------------------------------------------------------------ */

export default function Nav({
  lang,
  t,
}: {
  lang: string;
  t: Dictionary['t'];
}) {
  return (
    <Suspense>
      <NavInner lang={lang} t={t} />
    </Suspense>
  );
}
