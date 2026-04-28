const en = {
  // Nav
  nav_how: 'How it works',
  nav_why: 'Why Signal',
  nav_faq: 'FAQ',
  nav_cta: 'Join waitlist',

  // Hero variant A (dashboard-first)
  heroA_badge: 'Early access · First 100 scans free',
  heroA_h1_line1: 'Stop paying for',
  heroA_h1_line2: 'the AWS services you',
  heroA_h1_highlight: 'forgot about.',
  heroA_h1_line3: '(We’ve all been there.)',
  heroA_sub:
    'Connect your AWS in 2 minutes. We list exactly what’s burning money — each item with a dollar figure and a one-click delete. No DevOps degree, no 300-page report.',

  // Hero variant B (counter-first)
  heroB_badge: 'Live · 47 startups just like yours',
  heroB_h1_pre: 'Startups burned this much',
  heroB_h1_post: 'on AWS they forgot about.',
  heroB_sub:
    '47 founders bled money into stuff they spun up “just to test” and never killed. This counter shows what they recovered the day they stopped paying for ghosts.',

  // Shared hero (tweaks panel labels)
  hero_a_variant: 'Headline: Stuff you forgot',
  hero_b_variant: 'Headline: Live waste counter',
  hero_a_variant_alt1: 'Your AWS bill is eating your runway.',
  hero_a_variant_alt2: 'The 30–40% of your AWS bill that’s waste.',

  // Form
  form_email: 'Work email',
  form_company: 'Company',
  form_role: 'Your role',
  form_role_placeholder: 'Select role',
  form_roles: [
    'Founder / CEO',
    'CTO / VP Engineering',
    'Engineer (full-stack / backend)',
    'DevOps / SRE',
    'Ops / Finance',
    'Other',
  ],
  form_submit: 'Scan my AWS for free',
  form_submit_loading: 'Saving your spot…',
  form_trust: ['No credit card', 'Read-only IAM', 'Revoke anytime'],
  form_success_title: 'You’re in.',
  form_success_body:
    'We sent a confirmation to {email}. When your spot opens you’ll get the scan link — usually 1-3 weeks. Check your inbox (and Promotions, just in case).',
  form_dup_title: 'You’re already on the list.',
  form_dup_body:
    'No need to sign up twice — we have {email} on file. We’ll email you the second your spot opens.',
  form_secondary: 'See what a scan looks like →',
  form_error_invalid: 'Email, company and role — make sure all three look right.',
  form_error_server: 'That didn’t go through on our end. Give it another shot in a moment.',

  // Logos strip
  proof_eyebrow: 'Built for founders like',

  // Features ("Why Signal")
  feat_eyebrow: 'Why Signal',
  feat_h2_pre: 'Another dashboard won’t fix your bill.',
  feat_h2_post: 'A list of what to delete will.',
  feat_sub:
    'We skip the 300-line cost breakdown. You get a short list of what’s burning money — each item with a dollar figure and a one-click delete.',
  feat_1_t: 'Built for founders, not FinOps teams',
  feat_1_b:
    'If you can read "you’re paying $84/mo for this unused volume," you can use Signal. No DevOps background, no acronym decoder.',
  feat_2_t: 'Scan in 2 minutes. Waste list on your screen.',
  feat_2_b:
    'Connect a read-only IAM role. We read Cost Explorer and CloudWatch. Your first waste list appears before your coffee’s done.',
  feat_3_t: 'Delete with one click. Safely.',
  feat_3_b:
    'Pick what goes — we handle the safe-delete order. Snapshots first, dependencies checked. You approve every action; nothing runs in the background.',

  // How it works
  how_eyebrow: 'How it works',
  how_h2: 'Three steps. About five minutes.',
  how_1_t: 'Connect your AWS account',
  how_1_b:
    'A 12-line CloudFormation template, one read-only IAM role, zero write permissions. Revoke it anytime from the AWS console.',
  how_2_t: 'See your waste, in dollars',
  how_2_b:
    'Idle EBS volumes, unused IPs, forgotten RDS, oversized instances. Each with a monthly price tag. No 300-page report.',
  how_3_t: 'Delete with one click',
  how_3_b:
    'You pick what goes. We handle the safe-delete order — snapshots first, dependencies checked. You approve every action.',

  // Waste catalog
  catalog_eyebrow: 'The usual suspects',
  catalog_h2: 'What founders forgot last month.',
  catalog_sub:
    'Real findings from beta accounts — anonymized, dollar-weighted, sorted by how often they show up.',
  catalog_col_waste: 'Forgotten thing',
  catalog_col_prevalence: 'Shows up in',
  catalog_col_median: 'Median $/mo back',
  catalog_rows: [
    { aws: 'CloudWatch', name: 'Never-expire log retention', prevalence: 86, median: 180 },
    { aws: 'EBS', name: 'Idle volumes from old tests', prevalence: 78, median: 340 },
    { aws: 'RDS', name: 'Over-provisioned instances', prevalence: 64, median: 620 },
    { aws: 'EC2', name: 'Unused Elastic IPs', prevalence: 53, median: 90 },
    { aws: 'VPC', name: 'Forgotten NAT gateways', prevalence: 41, median: 310 },
    { aws: 'EC2', name: 'Stopped instances with EBS', prevalence: 38, median: 220 },
  ],
  catalog_footnote: 'Sample of {n} beta accounts · Q1 2026',
  catalog_n: '47',

  // Testimonials
  quotes_eyebrow: 'From the beta',
  quotes_h2:
    'Founders who ran a scan and immediately regretted not doing it sooner.',

  // Final CTA
  fcta_h2_pre: 'Find the',
  fcta_h2_highlight: '30–40%',
  fcta_h2_post: 'you’re wasting. Before Monday.',
  fcta_sub:
    'First 100 waitlist accounts get a full scan free. Read-only IAM, 5 minutes to set up, dollar figures next to every finding. Whether or not you ever use Signal again, you’ll know exactly where your bill is leaking.',
  fcta_primary: 'Scan my AWS for free →',
  fcta_secondary: 'See a sample scan first',

  // FAQ
  faq_eyebrow: 'FAQ',
  faq_h2: 'The stuff you’re about to wonder.',

  // Footer
  foot_tagline: 'Stop paying for AWS you forgot about.',
  foot_nav: ['Privacy', 'Security', 'Contact'],
  foot_copy: '© 2026 Signal. Not affiliated with Amazon Web Services.',

  // Modal (sample scan)
  modal_title: 'What a scan finds',
  modal_subtitle: 'Real beta account · $8,400/mo AWS bill · anonymized',
  modal_close: 'Close',
  modal_totals: 'Waste found',
  modal_of_bill: 'Of total bill',
  modal_effort: 'Cleanup time',
  modal_get_mine: 'Scan mine free →',
  modal_cta_helper: 'First scan free · Read-only IAM · 5 min to connect',

  // Shared — per-month suffix (used by Hero dashboard + sample modal)
  per_month_suffix: '/mo',

  // Modal (sample scan) — summary card details
  modal_annualized_suffix: 'over a year',
  modal_of_bill_pct: '30',
  modal_of_bill_context: 'On $8,400/mo',
  modal_effort_value: '~2h',
  modal_effort_context: 'Review + 1 click per item',

  // Modal (sample scan) — findings table
  modal_col_aws: 'AWS',
  modal_col_resource: 'Resource',
  modal_col_finding: 'What we found',
  modal_col_effort: 'Effort',
  modal_col_savings: 'Recovers $/mo',
  modal_effort_labels: {
    trivial: 'Trivial',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },
  modal_findings: [
    {
      cat: 'RDS',
      res: 'analytics-db-staging',
      detail: 'Staging DB still running · 4% avg CPU',
      context: 'db.m5.2xlarge · 94d since last query',
      save: 920,
      effort: 'low',
    },
    {
      cat: 'EBS',
      res: '8 idle volumes',
      detail: 'From a test last quarter · none attached',
      context: 'us-east-1 · gp2 · 120d idle avg',
      save: 840,
      effort: 'trivial',
    },
    {
      cat: 'VPC',
      res: 'NAT gateway',
      detail: 'Zero traffic for 31 days · safe to kill',
      context: 'us-west-2 · leftover from a spike test',
      save: 480,
      effort: 'low',
    },
    {
      cat: 'Logs',
      res: '14 log groups',
      detail: 'Never-expire retention · one-click fix',
      context: 'CloudWatch · retention=∞',
      save: 273,
      effort: 'trivial',
    },
  ],

  // Hero — headline variant alt1 ("eating your runway")
  heroA_alt1_pre: 'Your AWS bill is quietly eating ',
  heroA_alt1_highlight: 'your runway.',

  // Hero — headline variant alt2 ("30–40% waste")
  heroA_alt2_pre: 'The ',
  heroA_alt2_highlight: '30–40%',
  heroA_alt2_post: ' of your AWS bill you’re wasting right now.',

  // Hero — inline form (big layout)
  hero_form_big_title: 'Get my free waste scan',
  hero_form_big_sub: '3 fields. No sales follow-up.',

  // Hero — dashboard mock
  hero_dash_potential: 'Potential savings',
  hero_dash_of_bill: 'of bill',
  hero_dash_item_ebs: 'Idle EBS volumes',
  hero_dash_item_rds: 'Over-provisioned RDS',
  hero_dash_item_nat: 'Forgotten NAT gateways',
  hero_dash_item_logs: 'CloudWatch log retention',
  hero_dash_logs_suffix: 'log groups',

  // Hero — live waste counter
  hero_counter_live: 'LIVE · 47 accounts',
  hero_counter_period: 'last 90 days',
  hero_counter_label: 'Waste found in real time',
  hero_counter_sub: 'forgotten by beta startups last quarter',

  // Hero — streaming log
  hero_stream_lines: [
    '[10:42:03] acct_a7f3 · found 3 idle EBS (−$124/mo)',
    '[10:42:04] acct_9c21 · NAT gateway in us-west-2 unused 31d (−$82/mo)',
    '[10:42:06] acct_f0e8 · RDS db.m5.4xl @ 4% CPU (−$410/mo)',
    '[10:42:08] acct_a7f3 · CloudWatch logs forever-retention (−$67/mo)',
    '[10:42:09] acct_3b0c · 12 EIPs unattached (−$43/mo)',
    '[10:42:12] acct_d71f · forgotten staging RDS, 62d idle (−$289/mo)',
  ],

  // SEO metadata
  meta_title: 'Signal — Stop paying for AWS you forgot about',
  meta_description:
    'Connect your AWS account, see exactly what you’re wasting money on, and delete it with one click. Built for founders, not FinOps teams. Free scan for the first 100 waitlist accounts.',

  // OpenGraph / Twitter
  og_title: 'Stop paying for AWS you forgot about',
  og_description:
    'Connect in 2 minutes. See your waste in dollars. Delete with one click. Built for founders.',
} as const;

export const faq = [
  {
    q: 'Is it safe to give you AWS access?',
    a: 'We start read-only — we can see your resources, we can’t touch them. You revoke the IAM role anytime from the AWS console. Deletes only happen when you explicitly click; nothing runs in the background. Full IAM policy is published on our security page.',
  },
  {
    q: 'What if I delete something I actually needed?',
    a: 'Snapshot first where it applies (EBS, RDS), 7-day soft-delete on the rest, full undo from your dashboard. We also check dependencies before each delete — if a volume is attached or an RDS has live connections, we flag it instead of running the action.',
  },
  {
    q: 'I’m on a small bill. Is it worth it?',
    a: 'Industry research (Flexera, CNCF FinOps) puts cloud waste at 30–40% of spend. On a $2k/month bill that’s ~$7k a year. The first scan is free — find out before you decide. If we don’t find at least $200/mo of waste, we tell you straight up.',
  },
  {
    q: 'How long until I see savings?',
    a: 'Scan finishes in under 5 minutes. The list of waste appears with dollar figures and a one-click delete next to each. Most beta founders cleared 60-80% of their flagged waste in a single sitting — under 30 minutes.',
  },
  {
    q: 'How much does it cost after the waitlist?',
    a: 'Standard plan is 15% of recovered savings, billed monthly. Waitlist members lock in 10% for year one. There’s no upfront cost — if we find nothing, you pay nothing. Annual cap so we don’t profit forever from a one-time fix.',
  },
  {
    q: 'Do you support Terraform / IaC?',
    a: 'Yes. If your infra is in Terraform, we generate a PR with the cleanup changes — you review and merge in your normal flow. CDK and Pulumi are on the roadmap; tell us on the waitlist form if either is a blocker.',
  },
  {
    q: 'What about GCP or Azure?',
    a: 'AWS first. GCP is next on the roadmap based on waitlist demand. Tell us on the form if you’re multi-cloud.',
  },
  {
    q: 'Why should I trust a new tool with my AWS?',
    a: 'Same reason you’d trust any read-only IAM grant — the access is scoped, auditable in CloudTrail, and revocable in 10 seconds. We use AssumeRole with temporary tokens (no long-lived credentials), publish our full IAM policy, and we’re auditing for SOC 2 Type II right now.',
  },
] as const;

export default en;
