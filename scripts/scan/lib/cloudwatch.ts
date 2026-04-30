import {
  GetMetricStatisticsCommand,
  type CloudWatchClient,
} from '@aws-sdk/client-cloudwatch';

/**
 * Fetch a single metric over a time window. Returns the average / sum / etc.
 * across the window, or null if no data.
 */
export async function getMetricAverage(
  client: CloudWatchClient,
  args: {
    namespace: string;
    metricName: string;
    dimensions: { Name: string; Value: string }[];
    days: number;
    /** 'Average' for CPU, 'Sum' for traffic counters, etc. */
    statistic: 'Average' | 'Sum' | 'Maximum' | 'Minimum';
  },
): Promise<number | null> {
  const end = new Date();
  const start = new Date(end.getTime() - args.days * 86400_000);
  const periodSeconds = 3600; // 1-hour granularity

  const response = await client.send(
    new GetMetricStatisticsCommand({
      Namespace: args.namespace,
      MetricName: args.metricName,
      Dimensions: args.dimensions,
      StartTime: start,
      EndTime: end,
      Period: periodSeconds,
      Statistics: [args.statistic],
    }),
  );

  const points = response.Datapoints ?? [];
  if (points.length === 0) return null;

  if (args.statistic === 'Sum') {
    return points.reduce((acc, p) => acc + (p.Sum ?? 0), 0);
  }

  // Average / Max / Min: take the mean of the values across all points
  const values = points
    .map((p) =>
      args.statistic === 'Average'
        ? p.Average
        : args.statistic === 'Maximum'
          ? p.Maximum
          : p.Minimum,
    )
    .filter((v): v is number => typeof v === 'number');
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
