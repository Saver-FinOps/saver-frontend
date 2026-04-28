'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Badge, Button, Container, Grain } from './ui';
import { defaultTweakState } from './tweaks-config';
import type { TweakState } from './tweaks-config';
import type { Dictionary } from '../../dictionaries';
import { openSampleModal } from './SampleModal';
import { track } from '@/app/lib/analytics';

const urgencyTexts: Record<string, Record<string, string>> = {
  en: {
    spots: '47 spots left · closing Friday',
    cohort: 'First 100 scans free · invites rolling',
    deadline: 'Waitlist closes in 6 days',
  },
  es: {
    spots: '47 lugares · cierra el viernes',
    cohort: 'Primeros 100 escaneos gratis · invitaciones abiertas',
    deadline: 'El waitlist cierra en 6 días',
  },
};

function FinalCTAInner({
  lang,
  t,
}: {
  lang: string;
  t: Dictionary['t'];
}) {
  const searchParams = useSearchParams();

  const urgencyKey =
    (searchParams.get('urgency') as TweakState['urgencyKey']) ??
    defaultTweakState.urgencyKey;
  const urgencyText =
    urgencyKey !== 'none'
      ? urgencyTexts[lang]?.[urgencyKey] ?? null
      : null;

  const onJoinClick = () => {
    track('cta_click', { source: 'final_cta', cta: 'primary' });
    const form = document.getElementById('join');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const emailInput = form.querySelector<HTMLInputElement>(
        'input[type="email"]',
      );
      setTimeout(() => emailInput?.focus({ preventScroll: true }), 500);
    }
  };

  const onSampleClick = () => {
    track('sample_open', { source: 'final_cta' });
    openSampleModal();
  };

  return (
    <section id="waitlist" className="py-24">
      <Container>
        <div
          className="rounded-[28px] px-14 py-20 relative overflow-hidden text-white"
          style={{
            background:
              'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e3a8a 100%)',
          }}
        >
          {/* Decorative glows */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: -140,
              right: -140,
              width: 480,
              height: 480,
              background:
                'radial-gradient(circle, var(--tw-primary-a, #3b82f6) 0%, transparent 70%)',
              opacity: 0.35,
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: -140,
              left: -140,
              width: 440,
              height: 440,
              background:
                'radial-gradient(circle, #10b981 0%, transparent 70%)',
              opacity: 0.25,
            }}
          />
          <Grain opacity={0.08} />

          {/* Content */}
          <div className="relative max-w-[680px]">
            {urgencyText && (
              <div className="mb-[22px]">
                <Badge variant="waste" pulse>
                  &#9673; {urgencyText}
                </Badge>
              </div>
            )}

            <h2 className="font-display text-[clamp(36px,4.4vw,54px)] leading-[1.05] tracking-[-0.028em] font-semibold mb-[18px] text-white">
              {t.fcta_h2_pre}{' '}
              <span className="grad-text-highlight">
                {t.fcta_h2_highlight}
              </span>{' '}
              {t.fcta_h2_post}
            </h2>

            <p className="text-lg text-slate-300 leading-relaxed mb-9">
              {t.fcta_sub}
            </p>

            <div className="flex gap-3 flex-wrap">
              <Button
                variant="primary"
                size="lg"
                onClick={onJoinClick}
              >
                {t.fcta_primary}
              </Button>
              <Button variant="white" size="lg" onClick={onSampleClick}>
                {t.fcta_secondary}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function FinalCTA(props: {
  lang: string;
  t: Dictionary['t'];
}) {
  return (
    <Suspense>
      <FinalCTAInner {...props} />
    </Suspense>
  );
}
