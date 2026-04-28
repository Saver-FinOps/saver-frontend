import { ShieldCheck, Zap, MousePointerClick } from 'lucide-react';
import { Card, Container } from './ui';
import type { Dictionary } from '../../dictionaries';

const icons = {
  'shield-check': ShieldCheck,
  zap: Zap,
  'mouse-pointer-click': MousePointerClick,
} as const;

export default function Features({ t }: { t: Dictionary['t'] }) {
  const feats = [
    {
      icon: 'shield-check' as const,
      title: t.feat_1_t,
      body: t.feat_1_b,
      accent: '#3b82f6',
    },
    {
      icon: 'zap' as const,
      title: t.feat_2_t,
      body: t.feat_2_b,
      accent: '#10b981',
    },
    {
      icon: 'mouse-pointer-click' as const,
      title: t.feat_3_t,
      body: t.feat_3_b,
      accent: '#f59e0b',
    },
  ];

  return (
    <section
      id="why"
      className="pt-[112px] pb-[96px] bg-white relative"
    >
      <Container>
        {/* Header */}
        <div className="text-center max-w-[760px] mx-auto mb-16">
          <div className="eyebrow mb-3.5">
            {t.feat_eyebrow}
          </div>
          <h2 className="section-heading mb-[18px]">
            {t.feat_h2_pre}{' '}
            <span className="grad-text">{t.feat_h2_post}</span>
          </h2>
          <p className="text-lg text-slate-600 leading-[1.55] m-0">
            {t.feat_sub}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6">
          {feats.map((f, i) => {
            const Icon = icons[f.icon];
            return (
              <Card key={i} className="p-8">
                <div
                  className="w-[52px] h-[52px] rounded-[14px] relative grid place-items-center mb-5"
                  style={{
                    background: `linear-gradient(135deg, ${f.accent}22, ${f.accent}10)`,
                    color: f.accent,
                    boxShadow: `0 6px 16px -6px ${f.accent}44`,
                  }}
                >
                  <Icon size={26} />
                </div>
                <div className="font-display text-[22px] font-semibold text-slate-900 mb-2.5 tracking-[-0.015em]">
                  {f.title}
                </div>
                <div className="text-[15px] text-slate-600 leading-relaxed">
                  {f.body}
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
