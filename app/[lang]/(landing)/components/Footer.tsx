'use client';

import { Container, Logo } from './ui';
import type { Dictionary } from '../../dictionaries';
import { track } from '@/app/lib/analytics';

const FOOTER_LINK_KEYS = ['privacy', 'security', 'contact'] as const;

export default function Footer({
  lang,
  t,
}: {
  lang: string;
  t: Dictionary['t'];
}) {
  const hrefs = [
    `/${lang}/privacy`,
    `/${lang}/security`,
    `/${lang}/contact`,
  ];

  return (
    <footer className="pt-14 pb-10 border-t border-slate-200 bg-white">
      <Container>
        <div className="grid grid-cols-[1.3fr_1fr] gap-8 items-start mb-8">
          <div>
            <Logo />
            <div className="text-sm text-slate-500 mt-3 max-w-[340px] leading-normal">
              {t.foot_tagline}
            </div>
          </div>
          <div className="flex gap-7 justify-end flex-wrap">
            {t.foot_nav.map((label, i) => {
              const href = hrefs[i] ?? '#';
              const linkKey = FOOTER_LINK_KEYS[i] ?? `link_${i}`;
              return (
                <a
                  key={i}
                  href={href}
                  onClick={() =>
                    track('footer_link_click', { link: linkKey })
                  }
                  className="text-slate-600 no-underline text-sm font-medium"
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-400">
            {t.foot_copy}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            built in Buenos Aires &middot; v0.4.2-beta
          </div>
        </div>
      </Container>
    </footer>
  );
}
