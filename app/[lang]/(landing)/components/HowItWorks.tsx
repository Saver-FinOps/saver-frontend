import { Plug, Search, Trash2 } from 'lucide-react';
import { Container } from './ui';
import type { Dictionary } from '../../dictionaries';

export default function HowItWorks({ t }: { t: Dictionary['t'] }) {
  const steps = [
    {
      Icon: Plug,
      title: t.how_1_t,
      body: t.how_1_b,
      accent: '#3b82f6',
    },
    {
      Icon: Search,
      title: t.how_2_t,
      body: t.how_2_b,
      accent: '#10b981',
    },
    {
      Icon: Trash2,
      title: t.how_3_t,
      body: t.how_3_b,
      accent: '#f59e0b',
    },
  ];

  return (
    <section
      id="how"
      className="pt-[112px] pb-[96px] relative"
      style={{
        background:
          'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      }}
    >
      <Container>
        {/* Header */}
        <div className="text-center max-w-[760px] mx-auto mb-16">
          <div className="eyebrow mb-3.5">{t.how_eyebrow}</div>
          <h2 className="section-heading mb-[18px]">{t.how_h2}</h2>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
          {/* Connecting line behind the numbers (desktop only) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-[34px] left-[16%] right-[16%] h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, #e2e8f0 15%, #e2e8f0 85%, transparent 100%)',
            }}
          />

          {steps.map((step, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl border border-slate-200 p-7 flex flex-col"
            >
              {/* Number + icon row */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-[52px] h-[52px] rounded-full grid place-items-center font-display font-semibold text-xl tabular-nums tracking-tight relative z-10"
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    boxShadow: `0 6px 16px -6px ${step.accent}66`,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  className="w-9 h-9 rounded-lg grid place-items-center"
                  style={{
                    background: `linear-gradient(135deg, ${step.accent}22, ${step.accent}10)`,
                    color: step.accent,
                  }}
                >
                  <step.Icon size={18} />
                </div>
              </div>

              {/* Copy */}
              <div className="font-display text-xl font-semibold text-slate-900 mb-2 leading-[1.1] tracking-[-0.02em]">
                {step.title}
              </div>
              <div className="text-[15px] text-slate-600 leading-relaxed">
                {step.body}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
