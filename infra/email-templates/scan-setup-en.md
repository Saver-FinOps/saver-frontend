# Scan setup email — EN

**Subject:** Signal scan · IAM setup (5 min)

**To:** `{{LEAD_EMAIL}}`

**Reply-To:** `signalfinops@gmail.com`

---

Hey {{LEAD_FIRST_NAME_OR_COMPANY}},

Iván from Signal. Got your scan request — here's the setup so I can run it on your AWS account.

## Two values you'll need

| | |
|---|---|
| **Signal AWS account ID** | `754371202058` |
| **Your External ID** (unique to your request) | `{{EXTERNAL_ID}}` |

## Deploy this template (3 min)

Attached: `signal-readonly-role.yaml` (CloudFormation template). Or grab it from <https://github.com/Saver-FinOps/saver-frontend/blob/main/infra/cfn/signal-readonly-role.yaml>.

**Quickest path — AWS Console:**

1. AWS Console → CloudFormation → Create stack → With new resources (standard)
2. Upload the YAML file
3. Stack name: `signal-readonly-role`
4. Parameters:
   - `SignalAccountId`: `754371202058`
   - `ExternalId`: `{{EXTERNAL_ID}}`
5. Check "I acknowledge that AWS CloudFormation might create IAM resources with custom names"
6. Submit. Wait ~30 seconds.
7. Stack → Outputs tab → copy the `RoleArn` value

**Reply to this email with the ARN** and I'll run the scan in the next 24-48h.

## What this does

Read-only IAM role. We can see resource metadata + Cost Explorer. We **cannot** write, delete, or read S3 contents / database data / secrets. Full policy: <https://signalfinops.com/en/security>.

You can delete the stack any time to revoke us in 10 seconds.

## Questions

Reply to this email — a human reads it.

— Iván
Signal · Buenos Aires
