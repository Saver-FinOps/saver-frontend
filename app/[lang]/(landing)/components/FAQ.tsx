'use client';

import { useState } from 'react';
import { Container } from './ui';
import type { Dictionary } from '../../dictionaries';
import { track } from '@/app/lib/analytics';

export default function FAQ({
  t,
  items,
}: {
  t: Dictionary['t'];
  items: Dictionary['faq'];
}) {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-28 bg-white">
      <Container className="max-w-[820px]">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="eyebrow mb-3.5">
            {t.faq_eyebrow}
          </div>
          <h2 className="font-display text-[clamp(32px,3.6vw,42px)] leading-[1.15] tracking-tight font-semibold text-slate-900 m-0">
            {t.faq_h2}
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-2.5">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`border border-slate-200 rounded-[14px] transition-colors duration-200 ${
                  isOpen
                    ? 'bg-slate-50 shadow-[0_4px_12px_-4px_rgb(16_24_40/0.08)]'
                    : 'bg-white shadow-none'
                }`}
              >
                <button
                  onClick={() => {
                    if (!isOpen) track('faq_item_open', { question: it.q, index: i });
                    setOpen(isOpen ? -1 : i);
                  }}
                  className="w-full text-left p-[22px_26px] bg-transparent border-none cursor-pointer flex items-center justify-between gap-4 font-body text-[17px] font-semibold text-slate-900"
                >
                  <span>{it.q}</span>
                  <span
                    className={`w-[30px] h-[30px] rounded-full bg-white border border-slate-200 grid place-items-center shrink-0 transition-transform duration-300 ease-out-expo text-slate-600 text-lg leading-none ${
                      isOpen ? 'rotate-45' : 'rotate-0'
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-[26px] pb-6 text-[15px] text-slate-600 leading-[1.65]">
                    {it.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
