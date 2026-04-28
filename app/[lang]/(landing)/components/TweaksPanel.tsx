'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { TweakState } from './tweaks-config';
import { TWEAKS } from './tweaks-config';

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function TweakGroup({
  label,
  subtitle,
  children,
}: {
  label: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#0f172a',
          marginBottom: 6,
          letterSpacing: '-0.005em',
        }}
      >
        {label}
        {subtitle && (
          <span
            style={{
              fontWeight: 400,
              color: '#94a3b8',
              marginLeft: 6,
              fontSize: 11,
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Segmented({
  value,
  options,
  onChange,
  vertical,
}: {
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
  vertical?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        gap: vertical ? 4 : 2,
        background: vertical ? 'transparent' : '#f1f5f9',
        padding: vertical ? 0 : 3,
        borderRadius: vertical ? 0 : 10,
      }}
    >
      {options.map(([k, label]) => {
        const active = value === k;
        const style: CSSProperties = vertical
          ? {
              padding: '8px 10px',
              border: `1px solid ${active ? '#3b82f6' : '#e2e8f0'}`,
              borderRadius: 8,
              background: active ? 'rgba(59,130,246,0.08)' : '#fff',
              color: active ? '#1d4ed8' : '#475569',
              textAlign: 'left',
            }
          : {
              flex: 1,
              padding: '7px 10px',
              border: 'none',
              borderRadius: 8,
              background: active ? '#fff' : 'transparent',
              color: active ? '#0f172a' : '#64748b',
              textAlign: 'center',
              boxShadow: active
                ? '0 1px 2px rgb(16 24 40 / 0.1)'
                : 'none',
            };

        return (
          <button
            key={k}
            onClick={() => onChange(k)}
            style={{
              ...style,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all .2s ease',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TweaksPanel                                                        */
/* ------------------------------------------------------------------ */

export default function TweaksPanel({
  state,
  setState,
  open,
  onClose,
}: {
  state: TweakState;
  setState: (fn: (prev: TweakState) => TweakState) => void;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  const set = <K extends keyof TweakState>(k: K, v: TweakState[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  return (
    <div
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 90,
        width: 320,
        maxHeight: '80vh',
        overflow: 'auto',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        boxShadow: '0 20px 50px -12px rgb(16 24 40 / 0.25)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: '"Cal Sans", Inter, sans-serif',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          Tweaks
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            border: '1px solid #e2e8f0',
            background: '#fff',
            cursor: 'pointer',
            color: '#475569',
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          &times;
        </button>
      </div>

      {/* Controls */}
      <div
        style={{
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <TweakGroup label="Language">
          <Segmented
            value={state.lang}
            options={[
              ['en', 'EN'],
              ['es', 'ES'],
            ]}
            onChange={(v) => set('lang', v)}
          />
        </TweakGroup>

        <TweakGroup label="Hero variant">
          <Segmented
            value={state.heroVariant}
            options={[
              ['dashboard', 'Dashboard'],
              ['counter', 'Live counter'],
            ]}
            onChange={(v) => set('heroVariant', v as TweakState['heroVariant'])}
          />
        </TweakGroup>

        <TweakGroup
          label="Headline A/B"
          subtitle="(dashboard variant only)"
        >
          <Segmented
            vertical
            value={state.headlineVariant}
            options={[
              ['leaking', '"Your AWS bill is leaking 23%"'],
              ['alt1', '"Stop burning money on AWS"'],
              ['alt2', '"The 23% you\'re not using"'],
            ]}
            onChange={(v) =>
              set('headlineVariant', v as TweakState['headlineVariant'])
            }
          />
        </TweakGroup>

        <TweakGroup label="Form position">
          <Segmented
            value={state.formPosition}
            options={[
              ['above', 'Above fold'],
              ['below', 'Below fold'],
            ]}
            onChange={(v) =>
              set('formPosition', v as TweakState['formPosition'])
            }
          />
        </TweakGroup>

        <TweakGroup label="Primary color">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(
              Object.entries(TWEAKS.colors) as [
                keyof typeof TWEAKS.colors,
                (typeof TWEAKS.colors)[keyof typeof TWEAKS.colors],
              ][]
            ).map(([k, v]) => (
              <button
                key={k}
                onClick={() => set('primaryColor', k)}
                title={k}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: `linear-gradient(135deg, ${v.a}, ${v.b})`,
                  border:
                    state.primaryColor === k
                      ? '2px solid #0f172a'
                      : '2px solid transparent',
                  boxShadow:
                    state.primaryColor === k
                      ? `0 0 0 3px ${v.a}55`
                      : 'none',
                  transition: 'all .2s ease',
                }}
              />
            ))}
          </div>
        </TweakGroup>

        <TweakGroup label="Urgency copy">
          <Segmented
            vertical
            value={state.urgencyKey}
            options={[
              ['none', '(none \u2014 calmer)'],
              ['spots', '"47 spots left \u00b7 closes Friday"'],
              ['cohort', '"Q2 cohort \u00b7 invites rolling"'],
              ['deadline', '"Applications close in 6 days"'],
            ]}
            onChange={(v) =>
              set('urgencyKey', v as TweakState['urgencyKey'])
            }
          />
        </TweakGroup>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '10px 16px 14px',
          borderTop: '1px solid #f1f5f9',
          fontSize: 11,
          color: '#94a3b8',
        }}
      >
        Changes persist via URL. PostHog events tagged with variant.
      </div>
    </div>
  );
}
