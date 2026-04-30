# Signal scan script (Concierge MVP — Fase 2a)

Runs a read-only AWS scan against a customer account using AssumeRole.

## What it detects (so far)

| Category | Detector | Heuristic |
|---|---|---|
| EBS | Idle volumes | `state=available` + age > 30d + estimated cost > $1/mo |

More scanners coming in Fase 2b (RDS oversized, NAT idle, log retention, EIPs).

## Prerequisites

1. **Ambient AWS creds for Signal account `754371202058`.** Either:
   - `~/.aws/credentials` with a `[default]` profile, or
   - `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` env vars
2. **Customer has deployed `infra/cfn/signal-readonly-role.yaml`** in their account.
3. **You have the customer's:** Role ARN + External ID (they replied to your scan-setup email).

## Run a scan

```bash
npm run scan -- \
  --role-arn arn:aws:iam::CUSTOMER_ACCOUNT:role/SignalReadOnlyRole \
  --external-id CUSTOMERS_UUID_FROM_YOUR_NOTES \
  --regions us-east-1,us-west-2 \
  --output reports/customer-2026-04-29.json
```

If `--output` is omitted, the JSON report is dumped to stdout.

If `--regions` is omitted, defaults to `us-east-1,us-west-2`.

## Test against your own account first

You can dogfood the whole flow against your own AWS account `754371202058`:

1. Generate an External ID for yourself: `uuidgen`
2. Deploy `infra/cfn/signal-readonly-role.yaml` to your own account with your account ID + that External ID
3. Copy the resulting Role ARN
4. Run:
   ```bash
   npm run scan -- \
     --role-arn arn:aws:iam::754371202058:role/SignalReadOnlyRole \
     --external-id YOUR_GENERATED_UUID \
     --regions us-east-1
   ```
5. The script lists your idle EBS volumes (if any).

## Output format

See `lib/types.ts` for the full `ScanReport` schema. High-level shape:

```jsonc
{
  "scannedAt": "2026-04-29T20:14:00.000Z",
  "accountId": "754371202058",
  "regions": ["us-east-1"],
  "totalEstimatedMonthlySavings": 432.50,
  "findingsByCategory": { "EBS": 3 },
  "findings": [
    {
      "id": "vol-0123",
      "category": "EBS",
      "type": "idle_volume",
      "resource": { "name": "vol-0123", "region": "us-east-1", "metadata": { ... } },
      "detail": "Unattached gp2 volume, 100 GB · 94 days idle",
      "estimatedMonthlyCost": 10.00,
      "effort": "trivial",
      "context": "us-east-1 · gp2 · 100 GB · created 2026-01-25"
    }
  ],
  "errors": []
}
```

Sorted by `estimatedMonthlyCost` desc — biggest savings first.

## Costs incurred

- `DescribeVolumes`: free
- `STS:AssumeRole`: free
- `STS:GetCallerIdentity`: free

This Fase 2a scan is **completely free** to run — no Cost Explorer calls (those are $0.01 each).
