'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui';
import type { Dictionary } from '../../dictionaries';
import { track } from '@/app/lib/analytics';

export const OPEN_SAMPLE_EVENT = 'open-sample-modal';

export function openSampleModal() {
  window.dispatchEvent(new Event(OPEN_SAMPLE_EVENT));
}

const effortColor: Record<string, string> = {
  trivial: '#10b981',
  low: '#3b82f6',
  medium: '#f59e0b',
  high: '#ef4444',
};

export default function SampleModal({
  t,
}: {
  lang: string;
  t: Dictionary['t'];
}) {
  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => {
    track('sample_close');
    setOpen(false);
  }, []);

  // Listen for the custom open event
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_SAMPLE_EVENT, handler);
    return () => window.removeEventListener(OPEN_SAMPLE_EVENT, handler);
  }, []);

  // Escape key + body scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const findings = t.modal_findings;
  const total = findings.reduce((s, f) => s + f.save, 0);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 bg-[rgba(15,23,42,0.7)] backdrop-blur-sm grid place-items-center p-6 animate-[fadeInUp_.25s_ease]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[min(920px,100%)] max-h-[92vh] overflow-auto bg-white rounded-[20px] shadow-modal"
      >
        {/* Header */}
        <div className="p-[22px_28px] border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-2">
          <div>
            <div className="font-display text-[22px] font-semibold text-slate-900 tracking-tight">
              {t.modal_title}
            </div>
            <div className="text-[13px] text-slate-500 mt-0.5">
              {t.modal_subtitle}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t.modal_close}
            className="w-9 h-9 rounded-full border border-slate-200 bg-white cursor-pointer text-lg text-slate-600"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-7">
          {/* Summary cards */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 mb-7">
            {/* Total savings */}
            <div
              className="p-[22px] rounded-2xl border border-green-300"
              style={{
                background:
                  'linear-gradient(135deg, #ecfdf5, #d1fae5)',
              }}
            >
              <div className="text-[11px] text-green-700 font-bold uppercase tracking-[0.08em] mb-1.5">
                {t.modal_totals}
              </div>
              <div className="font-display text-[42px] font-semibold text-green-700 tracking-[-0.03em] leading-none">
                ${total.toLocaleString()}
                <span className="text-lg font-medium text-green-800">
                  {t.per_month_suffix}
                </span>
              </div>
              <div className="text-xs text-green-800 mt-1.5">
                ${(total * 12).toLocaleString()} {t.modal_annualized_suffix}
              </div>
            </div>

            {/* % of bill */}
            <div className="p-[22px] rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.08em] mb-1.5">
                {t.modal_of_bill}
              </div>
              <div className="font-display text-[42px] font-semibold text-slate-900 tracking-[-0.03em] leading-none">
                {t.modal_of_bill_pct}
                <span className="text-2xl text-slate-600">
                  %
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1.5">
                {t.modal_of_bill_context}
              </div>
            </div>

            {/* Effort */}
            <div className="p-[22px] rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.08em] mb-1.5">
                {t.modal_effort}
              </div>
              <div className="font-display text-[42px] font-semibold text-slate-900 tracking-[-0.03em] leading-none">
                {t.modal_effort_value}
              </div>
              <div className="text-xs text-slate-500 mt-1.5">
                {t.modal_effort_context}
              </div>
            </div>
          </div>

          {/* Findings table */}
          <div className="border border-slate-200 rounded-[14px] overflow-hidden">
            {/* Column headers */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-[70px_1.2fr_1.5fr_100px_1fr] gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-[0.08em]">
              <div>{t.modal_col_aws}</div>
              <div>{t.modal_col_resource}</div>
              <div>{t.modal_col_finding}</div>
              <div>{t.modal_col_effort}</div>
              <div className="text-right">{t.modal_col_savings}</div>
            </div>

            {/* Rows */}
            {findings.map((f, i) => (
              <div
                key={i}
                className={`px-5 py-4 grid grid-cols-[70px_1.2fr_1.5fr_100px_1fr] gap-3 items-center ${
                  i < findings.length - 1
                    ? 'border-b border-slate-100'
                    : ''
                }`}
              >
                <div>
                  <span className="bg-slate-100 px-2 py-[2px] rounded-md text-[11px] font-bold text-slate-600 font-mono">
                    {f.cat}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 font-mono">
                    {f.res}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {f.context}
                  </div>
                </div>
                <div className="text-[13px] text-slate-600">
                  {f.detail}
                </div>
                <div>
                  <span
                    className="text-[11px] font-bold px-2 py-[3px] rounded-full"
                    style={{
                      color: effortColor[f.effort],
                      background: `${effortColor[f.effort]}15`,
                    }}
                  >
                    {t.modal_effort_labels[f.effort]}
                  </span>
                </div>
                <div className="text-right font-display text-xl font-semibold text-green-700 tracking-tight">
                  &minus;${f.save}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-[13px] text-slate-500 leading-relaxed">
              {t.modal_cta_helper}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose}>
                {t.modal_close}
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  track('cta_click', {
                    source: 'sample_modal',
                    cta: 'modal_get_mine',
                  });
                  onClose();
                  document
                    .querySelector<HTMLInputElement>('input[type=email]')
                    ?.focus();
                }}
              >
                {t.modal_get_mine}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
