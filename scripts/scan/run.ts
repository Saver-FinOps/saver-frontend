/**
 * Signal scan runner — Concierge MVP (Fase 2a).
 *
 * Usage:
 *   npx tsx scripts/scan/run.ts \
 *     --role-arn arn:aws:iam::CUSTOMER:role/SignalReadOnlyRole \
 *     --external-id <uuid> \
 *     [--regions us-east-1,us-west-2] \
 *     [--output report.json]
 *
 * Requires ambient AWS credentials (env / ~/.aws/credentials) for the
 * Signal account that the customer's role trusts.
 */

import { writeFileSync } from 'node:fs';
import { assumeCustomerRole, costExplorerClientFor } from './lib/aws';
import { scanIdleEbs } from './lib/scanners/idle-ebs';
import { scanUnusedEips } from './lib/scanners/unused-eips';
import { scanLogRetention } from './lib/scanners/log-retention';
import { scanIdleNatGateways } from './lib/scanners/nat-idle';
import { scanOversizedRds } from './lib/scanners/rds-oversized';
import { getMonthlySpendOverview } from './lib/cost-explorer';
import { renderReportHtml } from './lib/report/html';
import type {
  AccountSpend,
  Finding,
  ScanError,
  ScanReport,
  FindingCategory,
} from './lib/types';

const DEFAULT_REGIONS = ['us-east-1', 'us-west-2'];

interface CliArgs {
  roleArn: string;
  externalId: string;
  regions: string[];
  output: string | null;
  html: string | null;
  lang: 'en' | 'es';
  customerName: string | null;
}

function parseArgs(argv: string[]): CliArgs {
  const args: Partial<CliArgs> = {};
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const value = argv[i + 1];
    switch (flag) {
      case '--role-arn':
        args.roleArn = value;
        i++;
        break;
      case '--external-id':
        args.externalId = value;
        i++;
        break;
      case '--regions':
        args.regions = value.split(',').map((r) => r.trim()).filter(Boolean);
        i++;
        break;
      case '--output':
        args.output = value;
        i++;
        break;
      case '--html':
        args.html = value;
        i++;
        break;
      case '--lang':
        args.lang = value === 'en' ? 'en' : 'es';
        i++;
        break;
      case '--customer-name':
        args.customerName = value;
        i++;
        break;
    }
  }
  if (!args.roleArn || !args.externalId) {
    console.error(
      'Usage: tsx scripts/scan/run.ts --role-arn <arn> --external-id <id> [--regions r1,r2] [--output file.json] [--html file.html] [--lang es|en] [--customer-name "Acme Inc"]',
    );
    process.exit(1);
  }
  return {
    roleArn: args.roleArn,
    externalId: args.externalId,
    regions: args.regions ?? DEFAULT_REGIONS,
    output: args.output ?? null,
    html: args.html ?? null,
    lang: args.lang ?? 'es',
    customerName: args.customerName ?? null,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  console.log('🔑 Assuming customer role…');
  const creds = await assumeCustomerRole({
    roleArn: args.roleArn,
    externalId: args.externalId,
  });
  console.log(`   ✓ Account: ${creds.accountId}`);
  console.log(`   ✓ Session expires: ${creds.expiration.toISOString()}`);

  const allFindings: Finding[] = [];
  const allErrors: ScanError[] = [];

  // Cost Explorer overview — 1 call ($0.01) gives us context for the report.
  // This is OPTIONAL: failures don't trigger the partial-scan banner because
  // findings are still complete without spend data. We just lose the
  // "% of bill" callout.
  console.log('\n💵 Fetching spend overview…');
  let accountSpend: AccountSpend | undefined;
  try {
    const ce = costExplorerClientFor(creds);
    const spend = await getMonthlySpendOverview(ce);
    accountSpend = { ...spend, wastePctOfBill: 0 };
    console.log(
      `   ✓ Last 30 days: $${spend.total.toLocaleString('en-US')} across ${Object.keys(spend.byService).length} services`,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`   ✗ Cost Explorer unavailable: ${message.split('\n')[0]}`);
    // Intentionally NOT pushed to allErrors — keep this off the customer report.
  }

  for (const region of args.regions) {
    console.log(`\n🔎 Scanning ${region}…`);

    const scanners: Array<{
      label: string;
      run: () => Promise<{ findings: Finding[]; errors: ScanError[] }>;
    }> = [
      { label: 'EBS idle volumes', run: () => scanIdleEbs(creds, region) },
      { label: 'Unused EIPs', run: () => scanUnusedEips(creds, region) },
      {
        label: 'CloudWatch log retention',
        run: () => scanLogRetention(creds, region),
      },
      { label: 'NAT gateway idle', run: () => scanIdleNatGateways(creds, region) },
      { label: 'RDS oversized', run: () => scanOversizedRds(creds, region) },
    ];

    for (const scanner of scanners) {
      const result = await scanner.run();
      allFindings.push(...result.findings);
      allErrors.push(...result.errors);
      console.log(
        `   ✓ ${scanner.label} · ${result.findings.length} finding${
          result.findings.length === 1 ? '' : 's'
        }`,
      );
      for (const err of result.errors) {
        console.log(`   ✗ ${err.scanner}: ${err.message}`);
      }
    }
  }

  // Sort by cost descending — biggest savings first
  allFindings.sort((a, b) => b.estimatedMonthlyCost - a.estimatedMonthlyCost);

  // Aggregate by category
  const findingsByCategory = allFindings.reduce(
    (acc, f) => {
      acc[f.category] = (acc[f.category] ?? 0) + 1;
      return acc;
    },
    {} as Record<FindingCategory, number>,
  );

  const totalEstimatedMonthlySavings =
    Math.round(
      allFindings.reduce((sum, f) => sum + f.estimatedMonthlyCost, 0) * 100,
    ) / 100;

  if (accountSpend && accountSpend.total > 0) {
    accountSpend.wastePctOfBill = Math.round(
      (totalEstimatedMonthlySavings / accountSpend.total) * 100,
    );
  }

  const report: ScanReport = {
    scannedAt: new Date().toISOString(),
    accountId: creds.accountId,
    regions: args.regions,
    totalEstimatedMonthlySavings,
    findingsByCategory,
    findings: allFindings,
    errors: allErrors,
    accountSpend,
  };

  console.log('\n📊 Summary');
  console.log(`   Account:  ${report.accountId}`);
  console.log(`   Regions:  ${report.regions.join(', ')}`);
  console.log(`   Findings: ${report.findings.length}`);
  console.log(
    `   Est. savings: $${report.totalEstimatedMonthlySavings}/mo  (~$${Math.round(report.totalEstimatedMonthlySavings * 12)}/yr)`,
  );
  if (report.accountSpend && report.accountSpend.total > 0) {
    console.log(
      `   Bill (30d):   $${report.accountSpend.total.toLocaleString('en-US')}  →  waste = ${report.accountSpend.wastePctOfBill}% of bill`,
    );
  }
  if (report.errors.length) {
    console.log(`   ⚠ Errors: ${report.errors.length}`);
  }

  if (args.output) {
    writeFileSync(args.output, JSON.stringify(report, null, 2));
    console.log(`\n✓ JSON report:  ${args.output}`);
  }

  if (args.html) {
    const html = renderReportHtml({
      report,
      customerName: args.customerName ?? undefined,
      lang: args.lang,
    });
    writeFileSync(args.html, html);
    console.log(`✓ HTML report:  ${args.html}`);
    console.log(`   Open with:    open ${args.html}`);
  }

  if (!args.output && !args.html) {
    console.log('\n--- JSON report ---');
    console.log(JSON.stringify(report, null, 2));
  }
}

main().catch((err) => {
  console.error('\n❌ Scan failed:', err);
  process.exit(1);
});
