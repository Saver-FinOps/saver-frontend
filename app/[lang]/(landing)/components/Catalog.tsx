import { Container } from './ui';
import type { Dictionary } from '../../dictionaries';

const AWS_BADGE_COLOR: Record<string, string> = {
  CloudWatch: '#7c3aed',
  EBS: '#3b82f6',
  RDS: '#0ea5e9',
  EC2: '#f59e0b',
  VPC: '#10b981',
};

export default function Catalog({ t }: { t: Dictionary['t'] }) {
  const rows = t.catalog_rows;
  const maxPrevalence = Math.max(...rows.map((r) => r.prevalence));

  return (
    <section className="pt-[112px] pb-[96px] bg-white relative">
      <Container>
        {/* Header */}
        <div className="text-center max-w-[760px] mx-auto mb-12">
          <div className="eyebrow mb-3.5">{t.catalog_eyebrow}</div>
          <h2 className="section-heading mb-[18px]">{t.catalog_h2}</h2>
          <p className="text-lg text-slate-600 leading-[1.55] m-0">
            {t.catalog_sub}
          </p>
        </div>

        {/* Table */}
        <div className="max-w-[920px] mx-auto rounded-2xl border border-slate-200 overflow-hidden bg-white">
          {/* Column headers — desktop only */}
          <div className="hidden md:grid grid-cols-[110px_1fr_1.2fr_140px] gap-4 px-6 py-3.5 bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
            <div>AWS</div>
            <div>{t.catalog_col_waste}</div>
            <div>{t.catalog_col_prevalence}</div>
            <div className="text-right">{t.catalog_col_median}</div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => {
            const badgeColor = AWS_BADGE_COLOR[row.aws] ?? '#64748b';
            const barWidth = (row.prevalence / maxPrevalence) * 100;
            const isLast = i === rows.length - 1;

            const badgeEl = (
              <span
                className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold font-mono"
                style={{ color: badgeColor, background: `${badgeColor}15` }}
              >
                {row.aws}
              </span>
            );

            const nameEl = (
              <div className="text-sm text-slate-900 font-medium leading-snug">
                {row.name}
              </div>
            );

            const barEl = (
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(90deg, ${badgeColor}aa, ${badgeColor})`,
                  }}
                />
              </div>
            );

            const percentEl = (
              <div className="text-sm font-semibold text-slate-700 tabular-nums w-10 text-right">
                {row.prevalence}%
              </div>
            );

            const savingsEl = (
              <div className="text-right font-display text-lg font-semibold text-green-700 tabular-nums tracking-tight whitespace-nowrap">
                &minus;${row.median}
                <span className="text-xs text-slate-500 font-medium font-body">
                  {t.per_month_suffix}
                </span>
              </div>
            );

            return (
              <div
                key={i}
                className={`px-5 md:px-6 py-4 ${
                  !isLast ? 'border-b border-slate-100' : ''
                }`}
              >
                {/* Mobile layout — 2-row card */}
                <div className="md:hidden flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {badgeEl}
                      {nameEl}
                    </div>
                    {savingsEl}
                  </div>
                  <div className="flex items-center gap-3">
                    {barEl}
                    {percentEl}
                  </div>
                </div>

                {/* Desktop layout — 4-col grid */}
                <div className="hidden md:grid grid-cols-[110px_1fr_1.2fr_140px] gap-4 items-center">
                  <div>{badgeEl}</div>
                  {nameEl}
                  <div className="flex items-center gap-3">
                    {barEl}
                    {percentEl}
                  </div>
                  {savingsEl}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="text-center text-xs text-slate-500 font-mono mt-5">
          {t.catalog_footnote.replace('{n}', t.catalog_n)}
        </div>
      </Container>
    </section>
  );
}
