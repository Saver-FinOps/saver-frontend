import { DescribeNatGatewaysCommand } from '@aws-sdk/client-ec2';
import {
  ec2ClientFor,
  cloudwatchClientFor,
  type AssumedCredentials,
} from '../aws';
import { getMetricAverage } from '../cloudwatch';
import { estimateNatGatewayMonthlyCost } from '../cost';
import type { Finding, ScanError } from '../types';

/** Sum of bytes processed (in + out) below this in 30 days = idle. */
const IDLE_BYTES_THRESHOLD = 100 * 1024 * 1024; // 100 MB

interface ScanResult {
  findings: Finding[];
  errors: ScanError[];
}

/**
 * Find NAT gateways with negligible traffic in the last 30 days.
 * NAT gateways cost ~$33/mo flat — having one idle is pure waste.
 */
export async function scanIdleNatGateways(
  creds: AssumedCredentials,
  region: string,
): Promise<ScanResult> {
  const ec2 = ec2ClientFor(creds, region);
  const cw = cloudwatchClientFor(creds, region);
  const findings: Finding[] = [];
  const errors: ScanError[] = [];

  try {
    let nextToken: string | undefined;
    do {
      const response = await ec2.send(
        new DescribeNatGatewaysCommand({
          Filter: [{ Name: 'state', Values: ['available'] }],
          NextToken: nextToken,
        }),
      );

      for (const nat of response.NatGateways ?? []) {
        if (!nat.NatGatewayId) continue;

        // Sum of bytes out + in over 30 days
        const [bytesOut, bytesIn] = await Promise.all([
          getMetricAverage(cw, {
            namespace: 'AWS/NATGateway',
            metricName: 'BytesOutToDestination',
            dimensions: [{ Name: 'NatGatewayId', Value: nat.NatGatewayId }],
            days: 30,
            statistic: 'Sum',
          }),
          getMetricAverage(cw, {
            namespace: 'AWS/NATGateway',
            metricName: 'BytesInFromDestination',
            dimensions: [{ Name: 'NatGatewayId', Value: nat.NatGatewayId }],
            days: 30,
            statistic: 'Sum',
          }),
        ]);

        const totalBytes = (bytesOut ?? 0) + (bytesIn ?? 0);
        if (totalBytes >= IDLE_BYTES_THRESHOLD) continue;

        const nameTag = nat.Tags?.find((t) => t.Key === 'Name')?.Value;
        const cost = estimateNatGatewayMonthlyCost();
        const trafficLabel =
          totalBytes === 0
            ? 'zero traffic'
            : `${Math.round(totalBytes / 1024 / 1024)} MB / 30 days`;

        findings.push({
          id: nat.NatGatewayId,
          category: 'VPC',
          type: 'nat_idle',
          resource: {
            name: nameTag ?? nat.NatGatewayId,
            region,
            metadata: {
              natGatewayId: nat.NatGatewayId,
              vpcId: nat.VpcId,
              subnetId: nat.SubnetId,
              bytesOut30d: bytesOut ?? 0,
              bytesIn30d: bytesIn ?? 0,
            },
          },
          detail: `NAT gateway with ${trafficLabel}`,
          estimatedMonthlyCost: cost,
          effort: 'low',
          context: `${region} · ${nat.NatGatewayId} · subnet ${nat.SubnetId ?? 'unknown'}`,
        });
      }

      nextToken = response.NextToken;
    } while (nextToken);
  } catch (err) {
    errors.push({
      region,
      scanner: 'nat-idle',
      message: err instanceof Error ? err.message : String(err),
    });
  }

  return { findings, errors };
}
