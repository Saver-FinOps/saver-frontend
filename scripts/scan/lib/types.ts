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
}

export interface ScanError {
  region: string;
  scanner: string;
  message: string;
}
