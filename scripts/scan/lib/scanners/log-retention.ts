import { DescribeLogGroupsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { cloudwatchLogsClientFor, type AssumedCredentials } from '../aws';
import { estimateLogStorageMonthlyCost } from '../cost';
import type { Finding, ScanError } from '../types';

/** Skip log groups smaller than this — not worth flagging. */
const MIN_BYTES = 100 * 1024 * 1024; // 100 MB

interface ScanResult {
  findings: Finding[];
  errors: ScanError[];
}

/**
 * Find CloudWatch Log groups with no retention policy (= keeps logs forever).
 * Storage compounds month-over-month — these can quietly grow into the
 * single biggest cost driver in a small AWS account.
 */
export async function scanLogRetention(
  creds: AssumedCredentials,
  region: string,
): Promise<ScanResult> {
  const cw = cloudwatchLogsClientFor(creds, region);
  const findings: Finding[] = [];
  const errors: ScanError[] = [];

  try {
    let nextToken: string | undefined;
    do {
      const response = await cw.send(
        new DescribeLogGroupsCommand({
          limit: 50,
          nextToken,
        }),
      );

      for (const lg of response.logGroups ?? []) {
        if (!lg.logGroupName) continue;
        // retentionInDays === undefined means "Never expire"
        if (lg.retentionInDays !== undefined) continue;

        const stored = lg.storedBytes ?? 0;
        if (stored < MIN_BYTES) continue;

        const cost = estimateLogStorageMonthlyCost(stored);
        const sizeGb = Math.round((stored / 1024 ** 3) * 10) / 10;

        findings.push({
          id: lg.logGroupName,
          category: 'CloudWatch',
          type: 'log_retention_infinite',
          resource: {
            arn: lg.arn,
            name: lg.logGroupName,
            region,
            metadata: {
              storedBytes: stored,
              storedGb: sizeGb,
              retentionInDays: null,
              creationTime: lg.creationTime
                ? new Date(lg.creationTime).toISOString()
                : null,
            },
          },
          detail: `Never-expire retention · ${sizeGb} GB stored`,
          estimatedMonthlyCost: cost,
          effort: 'trivial',
          context: `${region} · ${sizeGb} GB · set retention = 30 days to cap growth`,
        });
      }

      nextToken = response.nextToken;
    } while (nextToken);
  } catch (err) {
    errors.push({
      region,
      scanner: 'log-retention',
      message: err instanceof Error ? err.message : String(err),
    });
  }

  return { findings, errors };
}
