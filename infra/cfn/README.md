# Signal · Read-only IAM role setup

This 1-page guide is what we send to leads who request a scan. It walks them through deploying `signal-readonly-role.yaml` in their AWS account.

You can copy/paste this whole file into Gmail (after personalizing the values) or link to it as a public Gist.

---

## What this does

You give Signal a **read-only** view of your AWS account so we can scan for cost waste. Specifically:

- We read **metadata** of EC2, EBS, RDS, NAT gateways, log groups, load balancers (size, age, usage metrics).
- We read **Cost Explorer** to correlate each resource with its monthly cost.
- We **cannot** write, delete, or modify anything. We **cannot** read S3 contents, database data, or secrets.

Full IAM policy is published at [signal/security](https://saver-frontend.vercel.app/es/security#permisos).

You can revoke us in 10 seconds by deleting the CloudFormation stack.

---

## Two values you need (we sent these in the email)

| Variable | What it is |
|---|---|
| `SignalAccountId` | Signal's AWS account ID (12 digits). Hardcoded — same for all leads. |
| `ExternalId` | A random unique ID we generated for **your** request. Different per lead. Prevents confused-deputy attack. |

---

## Deploy in 3 minutes

### Option A — AWS Console (easiest)

1. Open AWS Console → **CloudFormation** → **Create stack** → **With new resources (standard)**.
2. Choose **Upload a template file** → upload `signal-readonly-role.yaml` (attached to our email or copy from below).
3. **Stack name:** `signal-readonly-role`.
4. **Parameters:**
   - `SignalAccountId`: paste the value from our email
   - `ExternalId`: paste the value from our email
5. **Capabilities:** check the box that says "I acknowledge that AWS CloudFormation might create IAM resources with custom names" → Submit.
6. Wait ~30 seconds. Stack status goes to `CREATE_COMPLETE`.
7. Click on the stack → **Outputs** tab → copy the value of `RoleArn` (looks like `arn:aws:iam::123456789012:role/SignalReadOnlyRole`).
8. **Reply to our email with that ARN.** That's it — we'll run the scan and email back the findings within 24-48h.

### Option B — AWS CLI (1 command)

```bash
aws cloudformation deploy \
  --template-file signal-readonly-role.yaml \
  --stack-name signal-readonly-role \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    SignalAccountId=YOUR_VALUE_FROM_EMAIL \
    ExternalId=YOUR_VALUE_FROM_EMAIL
```

Then get the role ARN:

```bash
aws cloudformation describe-stacks \
  --stack-name signal-readonly-role \
  --query 'Stacks[0].Outputs[?OutputKey==`RoleArn`].OutputValue' \
  --output text
```

Reply with that ARN.

---

## Revoking access

When you're done (or any time):

**Console:** CloudFormation → select the `signal-readonly-role` stack → **Delete**. Confirms in 30 seconds. Done.

**CLI:**

```bash
aws cloudformation delete-stack --stack-name signal-readonly-role
```

After deletion the role no longer exists — Signal cannot assume anything.

---

## Questions

Reply to the email or write to <security@signal>.
