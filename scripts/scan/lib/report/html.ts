import type {
  Finding,
  FindingCategory,
  FindingEffort,
  ScanReport,
} from '../types';

export interface RenderArgs {
  report: ScanReport;
  customerName?: string;
  lang: 'en' | 'es';
}

const CATEGORY_COLORS: Record<FindingCategory, string> = {
  CloudWatch: '#7c3aed',
  EBS: '#3b82f6',
  RDS: '#0ea5e9',
  EC2: '#f59e0b',
  VPC: '#10b981',
  Logs: '#7c3aed',
  S3: '#dc2626',
};

const EFFORT_COLORS: Record<FindingEffort, { bg: string; fg: string }> = {
  trivial: { bg: '#dcfce7', fg: '#166534' },
  low: { bg: '#dbeafe', fg: '#1e40af' },
  medium: { bg: '#fef3c7', fg: '#92400e' },
  high: { bg: '#fee2e2', fg: '#991b1b' },
};

const T = {
  en: {
    eyebrow: 'SIGNAL · YOUR SCAN',
    headline: (name: string) => `${name} — this is what your AWS bill is leaking.`,
    headlineGeneric: 'This is what your AWS bill is leaking.',
    metaScan: 'Scanned',
    metaAccount: 'Account',
    metaRegions: 'Regions',
    bigStat: 'RECOVERABLE / MONTH',
    annualized: 'over a year',
    pctLabel: 'of your last-30-day bill',
    spendLabel: 'You spent',
    spendPeriod: 'over the last 30 days',
    breakdownTitle: 'By category',
    spendBreakdownTitle: 'Top 3 services in your bill',
    findingsTitle: 'What we found',
    colService: 'Service',
    colResource: 'Resource',
    colFinding: 'Finding',
    colEffort: 'Effort',
    colSavings: '$/mo',
    effortLabels: {
      trivial: 'Trivial',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    } as Record<FindingEffort, string>,
    nextStepsTitle: "What's next",
    nextSteps: [
      "Pick 2-3 findings to act on first — sort by $/mo or by trivial effort. Reply with your priorities and I'll send you the safe-delete order for each.",
      "This scan was free. If you want monthly scans + one-click cleanup once Signal launches, it's 10% of recovered savings (yearly cap, no surprise bills).",
      'Worried about anything specific? Reply, even just to vent. A human reads it.',
    ],
    ctaLabel: 'Reply with my priorities',
    errorsTitle: 'Heads up — partial scan',
    errorsBody:
      "Some scanners couldn't run in one or more regions. The findings below are still real, but the total may understate your actual waste.",
    emptyTitle: 'No waste found',
    emptyBody:
      "I ran all 5 scanners and found nothing above $1/mo. Your account is in unusually good shape — most are 3-5 findings deep.",
    signature: '— Iván · Signal · Buenos Aires',
  },
  es: {
    eyebrow: 'SIGNAL · TU ESCANEO',
    headline: (name: string) => `${name} — esto es lo que tu factura AWS está perdiendo.`,
    headlineGeneric: 'Esto es lo que tu factura AWS está perdiendo.',
    metaScan: 'Escaneado',
    metaAccount: 'Cuenta',
    metaRegions: 'Regiones',
    bigStat: 'RECUPERABLE / MES',
    annualized: 'al año',
    pctLabel: 'de tu factura últimos 30 días',
    spendLabel: 'Gastaste',
    spendPeriod: 'en los últimos 30 días',
    breakdownTitle: 'Por categoría',
    spendBreakdownTitle: 'Top 3 servicios en tu factura',
    findingsTitle: 'Qué encontramos',
    colService: 'Servicio',
    colResource: 'Recurso',
    colFinding: 'Hallazgo',
    colEffort: 'Esfuerzo',
    colSavings: '$/mes',
    effortLabels: {
      trivial: 'Trivial',
      low: 'Bajo',
      medium: 'Medio',
      high: 'Alto',
    } as Record<FindingEffort, string>,
    nextStepsTitle: 'Próximos pasos',
    nextSteps: [
      'Elegí 2-3 hallazgos para arrancar — ordenalos por $/mes o por esfuerzo trivial. Respondé con tus prioridades y te paso el orden seguro de borrado de cada uno.',
      'Este escaneo fue gratis. Si querés escaneos mensuales + limpieza de un click cuando Signal salga, son 10% de lo que ahorrás (con tope anual, sin sorpresas).',
      '¿Te preocupa algo en particular? Respondé, aunque sea para descargarte. Lo lee un humano.',
    ],
    ctaLabel: 'Responder con mis prioridades',
    errorsTitle: 'Aviso — escaneo parcial',
    errorsBody:
      'Algunos detectores no pudieron correr en una o más regiones. Los hallazgos abajo son reales, pero el total puede subestimar tu desperdicio real.',
    emptyTitle: 'Sin desperdicio detectado',
    emptyBody:
      'Corrí los 5 detectores y no encontré nada arriba de $1/mes. Tu cuenta está inusualmente bien — la mayoría tienen 3-5 hallazgos.',
    signature: '— Iván · Signal · Buenos Aires',
  },
} as const;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderFindingRow(
  finding: Finding,
  t: (typeof T)[keyof typeof T],
): string {
  const badgeColor = CATEGORY_COLORS[finding.category] ?? '#64748b';
  const effort = EFFORT_COLORS[finding.effort];
  const cost = finding.estimatedMonthlyCost.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return `
    <tr>
      <td style="padding:14px 12px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
        <span style="display:inline-block;padding:3px 8px;border-radius:5px;font-family:ui-monospace,monospace;font-size:11px;font-weight:700;color:${badgeColor};background:${badgeColor}1a;">${escapeHtml(finding.category)}</span>
      </td>
      <td style="padding:14px 8px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
        <div style="font-family:ui-monospace,monospace;font-size:13px;font-weight:600;color:#0f172a;word-wrap:break-word;overflow-wrap:break-word;">${escapeHtml(finding.resource.name)}</div>
        <div style="font-family:ui-monospace,monospace;font-size:11px;color:#94a3b8;margin-top:2px;">${escapeHtml(finding.resource.region)}</div>
      </td>
      <td style="padding:14px 8px;border-bottom:1px solid #f1f5f9;vertical-align:top;font-size:13px;color:#475569;line-height:1.5;">
        ${escapeHtml(finding.detail)}
      </td>
      <td style="padding:14px 8px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
        <span style="display:inline-block;padding:3px 8px;border-radius:999px;font-size:11px;font-weight:700;color:${effort.fg};background:${effort.bg};">${escapeHtml(t.effortLabels[finding.effort])}</span>
      </td>
      <td style="padding:14px 12px;border-bottom:1px solid #f1f5f9;vertical-align:top;text-align:right;font-size:17px;font-weight:700;color:#15803d;letter-spacing:-0.015em;font-variant-numeric:tabular-nums;">
        &minus;$${cost}
      </td>
    </tr>
  `;
}

function renderCategoryPill(
  category: FindingCategory,
  count: number,
): string {
  const color = CATEGORY_COLORS[category] ?? '#64748b';
  return `
    <td style="padding:0 8px 0 0;">
      <div style="display:inline-block;padding:6px 12px;border-radius:8px;background:${color}1a;border:1px solid ${color}33;">
        <span style="font-family:ui-monospace,monospace;font-size:11px;font-weight:700;color:${color};">${escapeHtml(category)}</span>
        <span style="font-size:13px;font-weight:700;color:#0f172a;margin-left:6px;">${count}</span>
      </div>
    </td>
  `;
}

function renderSpendOverviewBlock(
  spend: NonNullable<ScanReport['accountSpend']>,
  t: (typeof T)[keyof typeof T],
): string {
  const totalFmt = spend.total.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });

  // Top 3 services by spend
  const topServices = Object.entries(spend.byService)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const totalForPct = spend.total > 0 ? spend.total : 1;
  const rows = topServices
    .map(([name, cost]) => {
      const pct = Math.round((cost / totalForPct) * 100);
      const costFmt = cost.toLocaleString('en-US', { maximumFractionDigits: 0 });
      const barWidth = Math.max(pct, 2);
      return `
      <tr>
        <td style="padding:8px 12px 8px 0;font-size:13px;color:#0f172a;font-weight:500;width:50%;">${escapeHtml(name)}</td>
        <td style="padding:8px 0;width:50%;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="width:100%;padding-right:10px;">
              <div style="height:6px;background:#f1f5f9;border-radius:3px;">
                <div style="height:6px;background:#3b82f6;border-radius:3px;width:${barWidth}%;"></div>
              </div>
            </td>
            <td style="white-space:nowrap;font-size:12px;color:#475569;font-variant-numeric:tabular-nums;text-align:right;">$${costFmt} · ${pct}%</td>
          </tr></table>
        </td>
      </tr>`;
    })
    .join('');

  return `
      <!-- Spend overview -->
      <tr><td style="padding:24px 40px;background:#f8fafc;border-bottom:1px solid #f1f5f9;">
        <div style="font-size:13px;color:#475569;margin-bottom:14px;">
          <strong style="color:#0f172a;">${escapeHtml(t.spendLabel)} $${totalFmt}</strong> ${escapeHtml(t.spendPeriod)}.
        </div>
        <div style="font-family:ui-monospace,monospace;font-size:10px;letter-spacing:0.1em;font-weight:700;color:#94a3b8;margin-bottom:6px;">${t.spendBreakdownTitle.toUpperCase()}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${rows}
        </table>
      </td></tr>
      `;
}

export function renderReportHtml(args: RenderArgs): string {
  const { report } = args;
  const t = T[args.lang];
  const customerName = args.customerName?.trim();
  const headline = customerName
    ? t.headline(customerName)
    : t.headlineGeneric;

  const total = report.totalEstimatedMonthlySavings.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const annualized = (
    report.totalEstimatedMonthlySavings * 12
  ).toLocaleString('en-US', { maximumFractionDigits: 0 });

  const scanDate = new Date(report.scannedAt).toLocaleDateString(
    args.lang === 'es' ? 'es-AR' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' },
  );

  const isEmpty = report.findings.length === 0;

  const categoryPills = (
    Object.entries(report.findingsByCategory) as [FindingCategory, number][]
  )
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => renderCategoryPill(cat, count))
    .join('');

  const findingRows = report.findings
    .map((f) => renderFindingRow(f, t))
    .join('');

  return `<!DOCTYPE html>
<html lang="${args.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Signal scan report</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;padding:40px 0;">
  <tr><td align="center">
    <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#1e3a8a 100%);padding:36px 40px;color:#ffffff;">
        <div style="font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.12em;font-weight:700;color:#cbd5e1;margin-bottom:10px;">${t.eyebrow}</div>
        <div style="font-size:26px;font-weight:700;line-height:1.15;letter-spacing:-0.02em;color:#ffffff;margin-bottom:18px;">${escapeHtml(headline)}</div>
        <div style="font-family:ui-monospace,monospace;font-size:12px;color:#94a3b8;line-height:1.6;">
          ${t.metaScan}: ${escapeHtml(scanDate)}<br>
          ${t.metaAccount}: ${escapeHtml(report.accountId)}<br>
          ${t.metaRegions}: ${escapeHtml(report.regions.join(', '))}
        </div>
      </td></tr>

      ${
        isEmpty
          ? `
      <!-- Empty state -->
      <tr><td style="padding:40px;background:#ffffff;text-align:center;">
        <div style="font-size:18px;font-weight:600;color:#15803d;margin-bottom:10px;">${escapeHtml(t.emptyTitle)}</div>
        <div style="font-size:14px;color:#475569;line-height:1.6;max-width:480px;margin:0 auto;">${escapeHtml(t.emptyBody)}</div>
      </td></tr>
      `
          : `
      <!-- Big number + % of bill -->
      <tr><td style="padding:32px 40px;background:#ffffff;border-bottom:1px solid #f1f5f9;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="vertical-align:top;">
              <div style="font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.12em;font-weight:700;color:#64748b;margin-bottom:8px;">${t.bigStat}</div>
              <div style="font-size:44px;font-weight:800;color:#15803d;letter-spacing:-0.025em;line-height:1;font-variant-numeric:tabular-nums;">$${total}<span style="font-size:18px;color:#475569;font-weight:500;letter-spacing:0;"> /mo</span></div>
              <div style="font-size:13px;color:#64748b;margin-top:6px;font-variant-numeric:tabular-nums;">≈ $${annualized} ${t.annualized}</div>
            </td>
            ${
              report.accountSpend && report.accountSpend.total > 0
                ? `
            <td style="vertical-align:top;text-align:right;width:140px;padding-left:20px;">
              <div style="font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.12em;font-weight:700;color:#64748b;margin-bottom:8px;">%</div>
              <div style="font-size:44px;font-weight:800;color:#0f172a;letter-spacing:-0.025em;line-height:1;font-variant-numeric:tabular-nums;">${report.accountSpend.wastePctOfBill}<span style="font-size:24px;color:#475569;">%</span></div>
              <div style="font-size:13px;color:#64748b;margin-top:6px;line-height:1.4;">${escapeHtml(t.pctLabel)}</div>
            </td>
            `
                : ''
            }
          </tr>
        </table>

        <div style="margin-top:24px;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:0.1em;font-weight:700;color:#94a3b8;margin-bottom:10px;">${t.breakdownTitle.toUpperCase()}</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${categoryPills}</tr></table>
      </td></tr>

      ${
        report.accountSpend && report.accountSpend.total > 0
          ? renderSpendOverviewBlock(report.accountSpend, t)
          : ''
      }

      <!-- Findings table -->
      <tr><td style="padding:32px 40px 8px;background:#ffffff;">
        <div style="font-size:14px;font-weight:600;color:#0f172a;margin-bottom:12px;">${escapeHtml(t.findingsTitle)}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;border-collapse:separate;border-spacing:0;">
          <thead>
            <tr style="background:#f8fafc;">
              <th align="left" style="padding:11px 12px;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:0.08em;font-weight:700;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">${t.colService}</th>
              <th align="left" style="padding:11px 8px;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:0.08em;font-weight:700;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">${t.colResource}</th>
              <th align="left" style="padding:11px 8px;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:0.08em;font-weight:700;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">${t.colFinding}</th>
              <th align="left" style="padding:11px 8px;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:0.08em;font-weight:700;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">${t.colEffort}</th>
              <th align="right" style="padding:11px 12px;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:0.08em;font-weight:700;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">${t.colSavings}</th>
            </tr>
          </thead>
          <tbody>${findingRows}</tbody>
        </table>
      </td></tr>
      `
      }

      ${
        report.errors.length > 0
          ? `
      <!-- Errors / partial scan notice -->
      <tr><td style="padding:18px 40px;background:#fffbeb;border-top:1px solid #fde68a;border-bottom:1px solid #fde68a;">
        <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:4px;">⚠ ${escapeHtml(t.errorsTitle)}</div>
        <div style="font-size:13px;color:#78350f;line-height:1.5;">${escapeHtml(t.errorsBody)}</div>
      </td></tr>
      `
          : ''
      }

      <!-- Next steps -->
      <tr><td style="padding:32px 40px 24px;background:#ffffff;">
        <div style="font-size:14px;font-weight:600;color:#0f172a;margin-bottom:14px;">${escapeHtml(t.nextStepsTitle)}</div>
        <div style="font-size:14px;color:#334155;line-height:1.65;">
          ${t.nextSteps.map((step) => `<div style="margin-bottom:10px;">→ ${escapeHtml(step)}</div>`).join('')}
        </div>
      </td></tr>

      <!-- CTA button (table-based for email-client compatibility) -->
      <tr><td style="padding:0 40px 32px;background:#ffffff;text-align:left;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:#0f172a;border-radius:999px;">
            <a href="mailto:dujautivan@gmail.com?subject=${encodeURIComponent('Re: ' + (customerName ? customerName + ' — Signal scan' : 'Signal scan'))}&body=${encodeURIComponent('Hi Iván,\n\nMy priorities from the report:\n\n1. \n2. \n3. \n\nThanks,\n')}" style="display:inline-block;padding:12px 22px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:-0.01em;">${escapeHtml(t.ctaLabel)} →</a>
          </td>
        </tr></table>
      </td></tr>

      <!-- Footer / signature -->
      <tr><td style="padding:24px 40px 32px;background:#ffffff;border-top:1px solid #f1f5f9;">
        <div style="font-size:13px;color:#64748b;line-height:1.5;">${escapeHtml(t.signature)}</div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}
