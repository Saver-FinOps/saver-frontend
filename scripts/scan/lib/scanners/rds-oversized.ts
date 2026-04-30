import { DescribeDBInstancesCommand } from '@aws-sdk/client-rds';
import {
  rdsClientFor,
  cloudwatchClientFor,
  type AssumedCredentials,
} from '../aws';
import { getMetricAverage } from '../cloudwatch';
import {
  estimateRdsMonthlyCost,
  estimateRdsDownsizingSavings,
} from '../cost';
import type { Finding, ScanError } from '../types';

/** Avg CPU below this percent over 7 days = oversized. */
const LOW_CPU_THRESHOLD_PCT = 10;

interface ScanResult {
  findings: Finding[];
  errors: ScanError[];
}

/**
 * Find RDS instances with very low average CPU utilization over 7 days.
 * Suggests they could run on a smaller (cheaper) instance class.
 */
export async function scanOversizedRds(
  creds: AssumedCredentials,
  region: string,
): Promise<ScanResult> {
  const rds = rdsClientFor(creds, region);
  const cw = cloudwatchClientFor(creds, region);
  const findings: Finding[] = [];
  const errors: ScanError[] = [];

  try {
    let marker: string | undefined;
    do {
      const response = await rds.send(
        new DescribeDBInstancesCommand({ Marker: marker, MaxRecords: 100 }),
      );

      for (const db of response.DBInstances ?? []) {
        if (
          !db.DBInstanceIdentifier ||
          !db.DBInstanceClass ||
          db.DBInstanceStatus !== 'available'
        ) {
          continue;
        }

        const avgCpu = await getMetricAverage(cw, {
          namespace: 'AWS/RDS',
          metricName: 'CPUUtilization',
          dimensions: [
            { Name: 'DBInstanceIdentifier', Value: db.DBInstanceIdentifier },
          ],
          days: 7,
          statistic: 'Average',
        });

        if (avgCpu === null || avgCpu >= LOW_CPU_THRESHOLD_PCT) continue;

        const { savings, suggestion } = estimateRdsDownsizingSavings(
          db.DBInstanceClass,
        );
        const currentCost = estimateRdsMonthlyCost(db.DBInstanceClass);

        // If we can't suggest a smaller class, fall back to flagging at
        // half the current cost as a rough "you could save half" estimate.
        const estimated =
          savings > 0 ? savings : Math.round(currentCost * 0.5 * 100) / 100;
        if (estimated < 1) continue;

        const cpuRounded = Math.round(avgCpu * 10) / 10;
        const detailParts = [
          `${db.DBInstanceClass} averaging ${cpuRounded}% CPU over 7 days`,
        ];
        if (suggestion) detailParts.push(`could downsize to ${suggestion}`);

        findings.push({
          id: db.DBInstanceIdentifier,
          category: 'RDS',
          type: 'oversized',
          resource: {
            arn: db.DBInstanceArn,
            name: db.DBInstanceIdentifier,
            region,
            metadata: {
              dbInstanceClass: db.DBInstanceClass,
              engine: db.Engine,
              avgCpu7d: cpuRounded,
              suggestedClass: suggestion,
              currentMonthlyCost: currentCost,
            },
          },
          detail: detailParts.join(' · '),
          estimatedMonthlyCost: estimated,
          effort: 'medium',
          context: `${region} · ${db.DBInstanceClass} · ${db.Engine ?? 'engine'} · ${cpuRounded}% CPU`,
        });
      }

      marker = response.Marker;
    } while (marker);
  } catch (err) {
    errors.push({
      region,
      scanner: 'rds-oversized',
      message: err instanceof Error ? err.message : String(err),
    });
  }

  return { findings, errors };
}
