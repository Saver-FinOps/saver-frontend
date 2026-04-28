'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import TweaksPanel from './TweaksPanel';
import { defaultTweakState } from './tweaks-config';
import type { TweakState } from './tweaks-config';

function readStateFromParams(
  params: URLSearchParams,
  lang: string,
): TweakState {
  return {
    lang,
    heroVariant:
      (params.get('hero') as TweakState['heroVariant']) ??
      defaultTweakState.heroVariant,
    headlineVariant:
      (params.get('headline') as TweakState['headlineVariant']) ??
      defaultTweakState.headlineVariant,
    formPosition:
      (params.get('form') as TweakState['formPosition']) ??
      defaultTweakState.formPosition,
    primaryColor:
      (params.get('color') as TweakState['primaryColor']) ??
      defaultTweakState.primaryColor,
    urgencyKey:
      (params.get('urgency') as TweakState['urgencyKey']) ??
      defaultTweakState.urgencyKey,
  };
}

function writeStateToParams(state: TweakState): URLSearchParams {
  const p = new URLSearchParams();
  p.set('tweaks', '1');
  if (state.heroVariant !== defaultTweakState.heroVariant)
    p.set('hero', state.heroVariant);
  if (state.headlineVariant !== defaultTweakState.headlineVariant)
    p.set('headline', state.headlineVariant);
  if (state.formPosition !== defaultTweakState.formPosition)
    p.set('form', state.formPosition);
  if (state.primaryColor !== defaultTweakState.primaryColor)
    p.set('color', state.primaryColor);
  if (state.urgencyKey !== defaultTweakState.urgencyKey)
    p.set('urgency', state.urgencyKey);
  return p;
}

export default function TweaksToolbar({ lang }: { lang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const enabled = searchParams.get('tweaks') === '1';
  const [open, setOpen] = useState(enabled);
  const [state, setState] = useState<TweakState>(() =>
    readStateFromParams(searchParams, lang),
  );

  // Track previous lang to detect panel-initiated language changes
  const prevLangRef = useRef(lang);

  // Sync URL when state changes (except lang — that triggers navigation)
  useEffect(() => {
    if (!enabled) return;

    // Language changed via the panel → navigate to the other locale
    if (state.lang !== prevLangRef.current) {
      prevLangRef.current = state.lang;
      const newPath = pathname.replace(`/${lang}`, `/${state.lang}`);
      const params = writeStateToParams(state);
      router.push(`${newPath}?${params.toString()}`);
      return;
    }

    // Other tweaks changed → update search params in place
    const params = writeStateToParams(state);
    const newUrl = `${pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [state, enabled, lang, pathname, router]);

  const handleSetState = useCallback(
    (fn: (prev: TweakState) => TweakState) => setState(fn),
    [],
  );

  if (!enabled) return null;

  return (
    <>
      {/* Floating toggle (bottom-right, visible when panel is closed) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            zIndex: 89,
            width: 44,
            height: 44,
            borderRadius: 999,
            border: '1px solid #e2e8f0',
            background: '#fff',
            boxShadow: '0 4px 12px rgb(16 24 40 / 0.12)',
            cursor: 'pointer',
            fontSize: 20,
            lineHeight: 1,
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Open tweaks panel"
        >
          &#9881;
        </button>
      )}

      <TweaksPanel
        state={state}
        setState={handleSetState}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
