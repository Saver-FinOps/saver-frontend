import { DescribeAddressesCommand } from '@aws-sdk/client-ec2';
import { ec2ClientFor, type AssumedCredentials } from '../aws';
import { estimateUnusedEipMonthlyCost } from '../cost';
import type { Finding, ScanError } from '../types';

interface ScanResult {
  findings: Finding[];
  errors: ScanError[];
}

/**
 * Find Elastic IPs that are not associated to any instance or NIC.
 * AWS charges $0.005/hour ($3.65/mo) for unassociated EIPs.
 */
export async function scanUnusedEips(
  creds: AssumedCredentials,
  region: string,
): Promise<ScanResult> {
  const ec2 = ec2ClientFor(creds, region);
  const findings: Finding[] = [];
  const errors: ScanError[] = [];

  try {
    const response = await ec2.send(new DescribeAddressesCommand({}));

    for (const addr of response.Addresses ?? []) {
      // Associated EIPs have an AssociationId or InstanceId.
      if (addr.AssociationId || addr.InstanceId) continue;
      if (!addr.PublicIp) continue;

      const cost = estimateUnusedEipMonthlyCost();
      const allocationId = addr.AllocationId ?? addr.PublicIp;
      const nameTag = addr.Tags?.find((t) => t.Key === 'Name')?.Value;

      findings.push({
        id: allocationId,
        category: 'EC2',
        type: 'unused_eip',
        resource: {
          name: nameTag ?? addr.PublicIp,
          region,
          metadata: {
            publicIp: addr.PublicIp,
            allocationId: addr.AllocationId,
            domain: addr.Domain,
          },
        },
        detail: `Unassociated Elastic IP — ${addr.PublicIp}`,
        estimatedMonthlyCost: cost,
        effort: 'trivial',
        context: `${region} · IP ${addr.PublicIp} · not attached to any instance/NIC`,
      });
    }
  } catch (err) {
    errors.push({
      region,
      scanner: 'unused-eips',
      message: err instanceof Error ? err.message : String(err),
    });
  }

  return { findings, errors };
}
