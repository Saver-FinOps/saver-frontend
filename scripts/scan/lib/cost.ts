/**
 * Approximate monthly cost estimation from resource metadata.
 *
 * NOTE: All rates are us-east-1 published prices as of 2026.
 * They are intentionally simplified — we don't include IOPS pricing,
 * data transfer costs, or per-request charges. For Concierge MVP this
 * is "good enough." When we wire Cost Explorer for real per-resource
 * cost data, we replace these with the real numbers.
 */

const HOURS_PER_MONTH = 730;

const EBS_USD_PER_GB_MONTH: Record<string, number> = {
  gp2: 0.1,
  gp3: 0.08,
  io1: 0.125,
  io2: 0.125,
  st1: 0.045,
  sc1: 0.025,
  standard: 0.05,
};

export function estimateEbsMonthlyCost(args: {
  volumeType: string;
  sizeGb: number;
}): number {
  const rate = EBS_USD_PER_GB_MONTH[args.volumeType] ?? 0.1;
  return Math.round(rate * args.sizeGb * 100) / 100;
}

/**
 * Unassociated Elastic IP: $0.005/hour. Flat regardless of size.
 */
export function estimateUnusedEipMonthlyCost(): number {
  return Math.round(0.005 * HOURS_PER_MONTH * 100) / 100; // $3.65
}

/**
 * NAT Gateway: $0.045/hour fixed, plus $0.045 per GB processed.
 * For idle NATs (no traffic) we only count the fixed hourly rate.
 */
export function estimateNatGatewayMonthlyCost(): number {
  return Math.round(0.045 * HOURS_PER_MONTH * 100) / 100; // $32.85
}

/**
 * CloudWatch Logs storage: $0.50/GB stored per month (after first 5 GB free).
 * Doesn't include ingestion cost ($0.50/GB ingested).
 */
export function estimateLogStorageMonthlyCost(storedBytes: number): number {
  const gb = storedBytes / 1024 ** 3;
  const rate = 0.5;
  return Math.round(rate * gb * 100) / 100;
}

/**
 * RDS instance class hourly rates (on-demand, us-east-1).
 * Not exhaustive — just the most common classes.
 * Returns 0 for unknown classes (the scanner falls back to flagging without $).
 */
const RDS_USD_PER_HOUR: Record<string, number> = {
  // T3 (burstable)
  'db.t3.micro': 0.018,
  'db.t3.small': 0.036,
  'db.t3.medium': 0.073,
  'db.t3.large': 0.145,
  // T4g (graviton)
  'db.t4g.micro': 0.016,
  'db.t4g.small': 0.032,
  'db.t4g.medium': 0.065,
  'db.t4g.large': 0.129,
  // M5 (general)
  'db.m5.large': 0.192,
  'db.m5.xlarge': 0.384,
  'db.m5.2xlarge': 0.768,
  'db.m5.4xlarge': 1.536,
  // M6g
  'db.m6g.large': 0.173,
  'db.m6g.xlarge': 0.346,
  'db.m6g.2xlarge': 0.691,
  // R5 (memory)
  'db.r5.large': 0.252,
  'db.r5.xlarge': 0.504,
  'db.r5.2xlarge': 1.008,
  'db.r5.4xlarge': 2.016,
  // R6g
  'db.r6g.large': 0.226,
  'db.r6g.xlarge': 0.453,
  'db.r6g.2xlarge': 0.907,
};

export function estimateRdsMonthlyCost(instanceClass: string): number {
  const hourly = RDS_USD_PER_HOUR[instanceClass] ?? 0;
  return Math.round(hourly * HOURS_PER_MONTH * 100) / 100;
}

/**
 * For an oversized RDS instance, the *savings* if downsized one tier.
 * Returns 0 if we don't know the class or there's no smaller class.
 */
export function estimateRdsDownsizingSavings(
  instanceClass: string,
): { savings: number; suggestion: string | null } {
  const downsizeMap: Record<string, string> = {
    'db.t3.large': 'db.t3.medium',
    'db.t3.medium': 'db.t3.small',
    'db.t3.small': 'db.t3.micro',
    'db.t4g.large': 'db.t4g.medium',
    'db.t4g.medium': 'db.t4g.small',
    'db.t4g.small': 'db.t4g.micro',
    'db.m5.4xlarge': 'db.m5.2xlarge',
    'db.m5.2xlarge': 'db.m5.xlarge',
    'db.m5.xlarge': 'db.m5.large',
    'db.m6g.2xlarge': 'db.m6g.xlarge',
    'db.m6g.xlarge': 'db.m6g.large',
    'db.r5.4xlarge': 'db.r5.2xlarge',
    'db.r5.2xlarge': 'db.r5.xlarge',
    'db.r5.xlarge': 'db.r5.large',
    'db.r6g.2xlarge': 'db.r6g.xlarge',
    'db.r6g.xlarge': 'db.r6g.large',
  };

  const suggestion = downsizeMap[instanceClass] ?? null;
  if (!suggestion) return { savings: 0, suggestion: null };

  const current = estimateRdsMonthlyCost(instanceClass);
  const proposed = estimateRdsMonthlyCost(suggestion);
  return {
    savings: Math.round((current - proposed) * 100) / 100,
    suggestion,
  };
}
