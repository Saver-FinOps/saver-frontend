/**
 * Finding categories — keep in sync with the landing page's catalog.
 */
export type FindingCategory =
  | 'EBS'
  | 'EC2'
  | 'RDS'
  | 'CloudWatch'
  | 'VPC'
  | 'Logs'
  | 'S3';

/**
 * Effort to clean up a finding. Drives the badge color in the report.
 */
export type FindingEffort = 'trivial' | 'low' | 'medium' | 'high';

/**
 * Single waste finding — one row in the eventual report.
 */
export interface Finding {
  id: string;
  category: FindingCategory;
  type: string;
  resource: {
    arn?: string;
    name: string;
    region: string;
    metadata: Record<string, unknown>;
  };
  detail: string;
  estimatedMonthlyCost: number;
  effort: FindingEffort;
  context: string;
}

/**
 * Full scan report — what the script outputs as JSON.
 * Fase 3 (HTML template) takes this as input.
 */
export interface ScanReport {
  scannedAt: string;
  accountId: string;
  regions: string[];
  totalEstimatedMonthlySavings: number;
  findingsByCategory: Record<FindingCategory, number>;
  findings: Finding[];
  errors: ScanError[];
  /**
   * Optional — populated when Cost Explorer is enabled and the IAM role
   * has `ce:GetCostAndUsage`. When absent, the report falls back to the
   * estimate-only view (no "% of bill" callout).
   */
  accountSpend?: AccountSpend;
}

export interface AccountSpend {
  /** ISO date YYYY-MM-DD */
  periodStart: string;
  /** ISO date YYYY-MM-DD */
  periodEnd: string;
  /** Total UnblendedCost over the period (~30 days). */
  total: number;
  /** Per-service breakdown, sorted by cost desc by convention. */
  byService: Record<string, number>;
  /** Computed: estimated savings as % of total. 0 if total is 0. */
  wastePctOfBill: number;
}

export interface ScanError {
  region: string;
  scanner: string;
  message: string;
}
