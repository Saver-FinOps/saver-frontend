/**
 * Preview the HTML report without running an actual scan.
 * Useful for designing the template offline.
 *
 * Usage:
 *   npx tsx scripts/scan/preview-report.ts [--lang es|en] [--customer-name "Acme"] [--out preview.html]
 */

import { writeFileSync } from 'node:fs';
import { renderReportHtml } from './lib/report/html';
import type { ScanReport } from './lib/types';

const SAMPLE: ScanReport = {
  scannedAt: new Date().toISOString(),
  accountId: '123456789012',
  regions: ['us-east-1', 'us-west-2'],
  totalEstimatedMonthlySavings: 2513,
  findingsByCategory: {
    EBS: 2,
    RDS: 1,
    VPC: 1,
    CloudWatch: 1,
    EC2: 3,
  } as ScanReport['findingsByCategory'],
  findings: [
    {
      id: 'analytics-db-staging',
      category: 'RDS',
      type: 'oversized',
      resource: {
        name: 'analytics-db-staging',
        region: 'us-east-1',
        metadata: {},
      },
      detail: 'db.m5.2xlarge averaging 4% CPU over 7 days · could downsize to db.m5.xlarge',
      estimatedMonthlyCost: 920,
      effort: 'medium',
      context: 'us-east-1 · db.m5.2xlarge · postgres · 4% CPU',
    },
    {
      id: 'vol-0a1b2c3d4e5f6',
      category: 'EBS',
      type: 'idle_volume',
      resource: {
        name: 'vol-0a1b2c3d4e5f6',
        region: 'us-east-1',
        metadata: {},
      },
      detail: 'Unattached gp2 volume, 100 GB · 120 days idle',
      estimatedMonthlyCost: 540,
      effort: 'trivial',
      context: 'us-east-1 · gp2 · 100 GB · created 2025-12-30',
    },
    {
      id: 'nat-0123456789abcdef',
      category: 'VPC',
      type: 'nat_idle',
      resource: {
        name: 'nat-0123456789abcdef',
        region: 'us-west-2',
        metadata: {},
      },
      detail: 'NAT gateway with zero traffic in 30 days',
      estimatedMonthlyCost: 480,
      effort: 'low',
      context: 'us-west-2 · subnet-leftover-spike-test',
    },
    {
      id: 'vol-7g8h9i0j1k2',
      category: 'EBS',
      type: 'idle_volume',
      resource: {
        name: 'vol-7g8h9i0j1k2',
        region: 'us-east-1',
        metadata: {},
      },
      detail: 'Unattached gp2 volume, 50 GB · 94 days idle',
      estimatedMonthlyCost: 300,
      effort: 'trivial',
      context: 'us-east-1 · gp2 · 50 GB · created 2026-01-25',
    },
    {
      id: '/aws/lambda/api-handler',
      category: 'CloudWatch',
      type: 'log_retention_infinite',
      resource: {
        name: '/aws/lambda/api-handler',
        region: 'us-east-1',
        metadata: {},
      },
      detail: 'Never-expire retention · 4.2 GB stored',
      estimatedMonthlyCost: 173,
      effort: 'trivial',
      context: 'us-east-1 · 4.2 GB · set retention = 30 days to cap growth',
    },
    {
      id: 'eipalloc-0a1b2c3d4',
      category: 'EC2',
      type: 'unused_eip',
      resource: {
        name: '52.34.123.45',
        region: 'us-east-1',
        metadata: {},
      },
      detail: 'Unassociated Elastic IP — 52.34.123.45',
      estimatedMonthlyCost: 100,
      effort: 'trivial',
      context: 'us-east-1 · IP 52.34.123.45 · not attached to any instance/NIC',
    },
  ],
  errors: [],
};

interface PreviewArgs {
  lang: 'en' | 'es';
  customerName: string | null;
  out: string;
}

function parseArgs(argv: string[]): PreviewArgs {
  const args: Partial<PreviewArgs> = {};
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const value = argv[i + 1];
    switch (flag) {
      case '--lang':
        args.lang = value === 'en' ? 'en' : 'es';
        i++;
        break;
      case '--customer-name':
        args.customerName = value;
        i++;
        break;
      case '--out':
        args.out = value;
        i++;
        break;
    }
  }
  return {
    lang: args.lang ?? 'es',
    customerName: args.customerName ?? 'Acme Inc',
    out: args.out ?? 'preview.html',
  };
}

const args = parseArgs(process.argv.slice(2));
const html = renderReportHtml({
  report: SAMPLE,
  customerName: args.customerName ?? undefined,
  lang: args.lang,
});
writeFileSync(args.out, html);
console.log(`✓ Preview written to ${args.out}`);
console.log(`  Open with:  open ${args.out}`);
