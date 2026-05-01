/**
 * Onboard a new scan-request lead.
 *
 * Usage:
 *   npm run lead:onboard -- --email lead@acme.com --company "Acme Inc" [--lang es|en] [--out path] [--force]
 *
 * What it does:
 *   1. Generates a unique External ID (UUID v4)
 *   2. Renders the scan-setup email template (EN or ES) with placeholders filled in
 *   3. Writes the rendered email to data/leads/{date}-{slug}.md
 *   4. Appends an entry to data/leads/index.csv (your local tracking sheet)
 *   5. Prints a summary + next steps
 *
 * Re-running for the same email shows the existing External ID instead of
 * generating a new one (use --force to override).
 *
 * The data/leads/ directory is gitignored — never commit lead data.
 */

import { randomUUID } from 'node:crypto';
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  appendFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

const REPO_ROOT = process.cwd();
const TEMPLATES_DIR = join(REPO_ROOT, 'infra/email-templates');
const LEADS_DIR = join(REPO_ROOT, 'data/leads');
const INDEX_CSV = join(LEADS_DIR, 'index.csv');

interface CliArgs {
  email: string;
  company: string;
  lang: 'en' | 'es';
  out: string | null;
  force: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: Partial<CliArgs> = { force: false };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const value = argv[i + 1];
    switch (flag) {
      case '--email':
        args.email = value;
        i++;
        break;
      case '--company':
        args.company = value;
        i++;
        break;
      case '--lang':
        args.lang = value === 'en' ? 'en' : 'es';
        i++;
        break;
      case '--out':
        args.out = value;
        i++;
        break;
      case '--force':
        args.force = true;
        break;
    }
  }
  if (!args.email || !args.company) {
    console.error(
      'Usage: npm run lead:onboard -- --email <addr> --company <name> [--lang es|en] [--out path] [--force]',
    );
    process.exit(1);
  }
  return {
    email: args.email.trim().toLowerCase(),
    company: args.company.trim(),
    lang: args.lang ?? 'es',
    out: args.out ?? null,
    force: args.force ?? false,
  };
}

function slugify(email: string): string {
  return email
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

interface ExistingLead {
  email: string;
  company: string;
  externalId: string;
  lang: string;
  createdAt: string;
}

function findExisting(email: string): ExistingLead | null {
  if (!existsSync(INDEX_CSV)) return null;
  const csv = readFileSync(INDEX_CSV, 'utf8');
  const lines = csv.split('\n').slice(1); // skip header
  for (const line of lines) {
    if (!line.trim()) continue;
    const [csvEmail, company, externalId, lang, createdAt] = line.split(',');
    if (csvEmail === email) {
      return { email: csvEmail, company, externalId, lang, createdAt };
    }
  }
  return null;
}

function appendIndexCsv(entry: {
  email: string;
  company: string;
  externalId: string;
  lang: 'en' | 'es';
}) {
  if (!existsSync(LEADS_DIR)) mkdirSync(LEADS_DIR, { recursive: true });
  const isNew = !existsSync(INDEX_CSV);
  if (isNew) {
    writeFileSync(INDEX_CSV, 'email,company,external_id,lang,created_at\n');
  }
  // Quote company in case it has commas
  const safeCompany = entry.company.includes(',')
    ? `"${entry.company.replace(/"/g, '""')}"`
    : entry.company;
  appendFileSync(
    INDEX_CSV,
    `${entry.email},${safeCompany},${entry.externalId},${entry.lang},${new Date().toISOString()}\n`,
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  // Duplicate check
  const existing = findExisting(args.email);
  if (existing && !args.force) {
    console.log('⚠ This email is already in your leads index.\n');
    console.log(`   Email:       ${existing.email}`);
    console.log(`   Company:     ${existing.company}`);
    console.log(`   External ID: ${existing.externalId}`);
    console.log(`   Lang:        ${existing.lang}`);
    console.log(`   Created:     ${existing.createdAt}`);
    console.log('\nUse --force to onboard again with a NEW External ID.');
    console.log(
      'Note: re-onboarding invalidates the previous CFN trust policy if the lead deployed it.',
    );
    process.exit(0);
  }

  const externalId = randomUUID().toUpperCase();
  const templatePath = join(TEMPLATES_DIR, `scan-setup-${args.lang}.md`);
  if (!existsSync(templatePath)) {
    console.error(`✗ Template not found: ${templatePath}`);
    process.exit(1);
  }
  const template = readFileSync(templatePath, 'utf8');

  const rendered = template
    .replaceAll('{{LEAD_EMAIL}}', args.email)
    .replaceAll('{{LEAD_FIRST_NAME_OR_COMPANY}}', args.company)
    .replaceAll('{{EXTERNAL_ID}}', externalId);

  const slug = slugify(args.email);
  const datePrefix = new Date().toISOString().slice(0, 10);
  const outPath =
    args.out ?? join(LEADS_DIR, `${datePrefix}-${slug}.md`);

  const outDir = dirname(outPath);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, rendered);

  appendIndexCsv({
    email: args.email,
    company: args.company,
    externalId,
    lang: args.lang,
  });

  console.log('✓ Lead onboarded.\n');
  console.log(`   Email:       ${args.email}`);
  console.log(`   Company:     ${args.company}`);
  console.log(`   External ID: ${externalId}`);
  console.log(`   Lang:        ${args.lang}`);
  console.log(`   Email body:  ${outPath}`);
  console.log(`   Tracking:    ${INDEX_CSV}\n`);
  console.log('Next steps:');
  console.log(`   1. open ${outPath}`);
  console.log('   2. Copy the body, paste into Gmail compose');
  console.log('   3. Attach: infra/cfn/signal-readonly-role.yaml');
  console.log(`   4. Send to: ${args.email}`);
  console.log('\nWhen they reply with the Role ARN:');
  console.log('   npm run scan -- \\');
  console.log('     --role-arn arn:aws:iam::THEIR_ACCOUNT:role/SignalReadOnlyRole \\');
  console.log(`     --external-id ${externalId} \\`);
  console.log('     --regions us-east-1,us-west-2 \\');
  console.log(`     --html reports/${slug}.html \\`);
  console.log(`     --lang ${args.lang} \\`);
  console.log(`     --customer-name "${args.company}"`);
}

main();
