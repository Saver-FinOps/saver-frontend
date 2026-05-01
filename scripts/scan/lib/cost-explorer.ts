import {
  GetCostAndUsageCommand,
  type CostExplorerClient,
} from '@aws-sdk/client-cost-explorer';

export interface MonthlySpendOverview {
  /** ISO date (YYYY-MM-DD) of the start of the period scanned. */
  periodStart: string;
  /** ISO date (YYYY-MM-DD) of the end of the period scanned. */
  periodEnd: string;
  /** Total UnblendedCost over the period — what they actually paid. */
  total: number;
  /** Cost broken down by AWS service name. Keys are display names. */
  byService: Record<string, number>;
}

/**
 * Pull the customer's last-30-day spend, broken down by service.
 *
 * Cost Explorer charges $0.01 per call — we make exactly ONE call here
 * (group-by service), regardless of how many findings we have.
 *
 * Throws if Cost Explorer is not enabled in the account or the IAM role
 * lacks `ce:GetCostAndUsage`. Caller should catch and treat as optional.
 */
export async function getMonthlySpendOverview(
  client: CostExplorerClient,
): Promise<MonthlySpendOverview> {
  const end = new Date();
  const start = new Date(end.getTime() - 30 * 86400_000);

  // Cost Explorer needs YYYY-MM-DD strings; the End date is exclusive.
  const periodStart = start.toISOString().slice(0, 10);
  const periodEnd = end.toISOString().slice(0, 10);

  const response = await client.send(
    new GetCostAndUsageCommand({
      TimePeriod: { Start: periodStart, End: periodEnd },
      Granularity: 'MONTHLY',
      Metrics: ['UnblendedCost'],
      GroupBy: [{ Type: 'DIMENSION', Key: 'SERVICE' }],
    }),
  );

  const byService: Record<string, number> = {};
  let total = 0;

  for (const result of response.ResultsByTime ?? []) {
    for (const group of result.Groups ?? []) {
      const serviceName = group.Keys?.[0] ?? 'Unknown';
      const cost = parseFloat(group.Metrics?.UnblendedCost?.Amount ?? '0');
      if (cost <= 0) continue;
      byService[serviceName] = (byService[serviceName] ?? 0) + cost;
      total += cost;
    }
  }

  return {
    periodStart,
    periodEnd,
    total: Math.round(total * 100) / 100,
    byService,
  };
}
