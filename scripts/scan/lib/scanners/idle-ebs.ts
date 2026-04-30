import { DescribeVolumesCommand } from '@aws-sdk/client-ec2';
import { ec2ClientFor, type AssumedCredentials } from '../aws';
import { estimateEbsMonthlyCost } from '../cost';
import type { Finding, ScanError } from '../types';

/** Days a volume must have been unattached to count as idle. */
const IDLE_DAYS_THRESHOLD = 30;

/** Minimum estimated $/mo to include a finding (filters out noise). */
const MIN_MONTHLY_COST = 1;

interface ScanResult {
  findings: Finding[];
  errors: ScanError[];
}

/**
 * Find EBS volumes that are:
 *   - state === 'available' (not attached to any instance)
 *   - older than 30 days (so we don't flag fresh experiments)
 *   - cost > $1/month (filters out noise from tiny volumes)
 */
export async function scanIdleEbs(
  creds: AssumedCredentials,
  region: string,
): Promise<ScanResult> {
  const ec2 = ec2ClientFor(creds, region);
  const findings: Finding[] = [];
  const errors: ScanError[] = [];

  const cutoffDate = new Date(Date.now() - IDLE_DAYS_THRESHOLD * 86400_000);

  try {
    let nextToken: string | undefined;
    do {
      const response = await ec2.send(
        new DescribeVolumesCommand({
          Filters: [{ Name: 'status', Values: ['available'] }],
          MaxResults: 500,
          NextToken: nextToken,
        }),
      );

      for (const vol of response.Volumes ?? []) {
        if (!vol.VolumeId || !vol.CreateTime) continue;
        if (vol.CreateTime > cutoffDate) continue;

        const sizeGb = vol.Size ?? 0;
        const volumeType = vol.VolumeType ?? 'gp2';
        const cost = estimateEbsMonthlyCost({ volumeType, sizeGb });
        if (cost < MIN_MONTHLY_COST) continue;

        const ageDays = Math.floor(
          (Date.now() - vol.CreateTime.getTime()) / 86400_000,
        );

        const nameTag = vol.Tags?.find((t) => t.Key === 'Name')?.Value;
        const displayName = nameTag ?? vol.VolumeId;

        findings.push({
          id: vol.VolumeId,
          category: 'EBS',
          type: 'idle_volume',
          resource: {
            name: displayName,
            region,
            metadata: {
              volumeId: vol.VolumeId,
              sizeGb,
              volumeType,
              createTime: vol.CreateTime.toISOString(),
              encrypted: vol.Encrypted ?? false,
              snapshotId: vol.SnapshotId,
            },
          },
          detail: `Unattached ${volumeType} volume, ${sizeGb} GB · ${ageDays} days idle`,
          estimatedMonthlyCost: cost,
          effort: 'trivial',
          context: `${region} · ${volumeType} · ${sizeGb} GB · created ${vol.CreateTime.toISOString().slice(0, 10)}`,
        });
      }

      nextToken = response.NextToken;
    } while (nextToken);
  } catch (err) {
    errors.push({
      region,
      scanner: 'idle-ebs',
      message: err instanceof Error ? err.message : String(err),
    });
  }

  return { findings, errors };
}
