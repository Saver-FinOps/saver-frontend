import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  FileCode,
  Eye,
  ShieldOff,
  Trash2,
  HardDrive,
  KeyRound,
  BadgeCheck,
  Bug,
  Mail,
} from 'lucide-react';
import { hasLocale } from '../dictionaries';
import type { Locale } from '../dictionaries';
import { SITE_URL } from '@/app/lib/site';
import { CONTACT_EMAILS } from '@/app/lib/contact';
import { BackToHome } from '../_components/BackToHome';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) return {};

  const titles: Record<Locale, string> = {
    en: 'Security | Signal',
    es: 'Seguridad | Signal',
  };

  const descriptions: Record<Locale, string> = {
    en: 'Read-only IAM. The exact permissions we ask for, what we read, what we never touch, and how to revoke us in one click.',
    es: 'IAM solo lectura. Los permisos exactos que pedimos, qué leemos, qué nunca tocamos, y cómo revocarnos de un click.',
  };

  const url = `${SITE_URL}/${lang}/security`;

  return {
    title: titles[lang],
    description: descriptions[lang],
    robots: 'index,follow',
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en/security`,
        es: `${SITE_URL}/es/security`,
        'x-default': `${SITE_URL}/es/security`,
      },
    },
    openGraph: {
      type: 'website',
      url,
      title: titles[lang],
      description: descriptions[lang],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
    },
  };
}

const IAM_POLICY = `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "ce:Get*",
      "cloudwatch:Get*",
      "cloudwatch:List*",
      "ec2:Describe*",
      "rds:Describe*",
      "elasticloadbalancing:Describe*",
      "logs:Describe*",
      "s3:ListAllMyBuckets",
      "s3:GetBucketLocation"
    ],
    "Resource": "*"
  }]
}`;

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const isEs = lang === 'es';

  const whatWeDo = [
    isEs
      ? 'Leemos metadata de recursos: nombre, tipo, tamaño, fecha de creación, métricas de uso.'
      : 'We read resource metadata: name, type, size, creation date, usage metrics.',
    isEs
      ? 'Leemos Cost Explorer para correlacionar cada recurso con su precio mensual.'
      : 'We read Cost Explorer to map each resource to its monthly cost.',
    isEs
      ? 'Detectamos patrones de desperdicio (idle, oversized, sin tráfico, retención eterna).'
      : 'We detect waste patterns (idle, oversized, no traffic, infinite retention).',
  ];

  const whatWeDont = [
    isEs
      ? 'Contenido de tus buckets S3. Listamos nombres y regiones; nunca abrimos un objeto.'
      : 'Contents of your S3 buckets. We list names and regions; we never open an object.',
    isEs
      ? 'Data de tus bases (RDS / DynamoDB). Solo metadata: tamaño, instancia, métricas.'
      : 'Database data (RDS / DynamoDB). Only metadata: size, instance class, metrics.',
    isEs
      ? 'Permisos IAM. No podemos crear roles, usuarios, ni tocar policies.'
      : 'IAM permissions. We can’t create roles, users, or modify policies.',
    isEs
      ? 'Background jobs. Cada borrado pasa por un click tuyo.'
      : 'Background jobs. Every delete goes through your click.',
  ];

  const dataOnServers = [
    {
      kind: 'store',
      title: isEs ? 'Sí guardamos' : 'We store',
      items: [
        isEs ? 'AWS account ID' : 'AWS account ID',
        isEs ? 'ARN del rol IAM' : 'IAM role ARN',
        isEs
          ? 'Hallazgos del último escaneo (ID, tipo, costo estimado)'
          : 'Last-scan findings (ID, type, estimated cost)',
      ],
    },
    {
      kind: 'dont',
      title: isEs ? 'No guardamos' : 'We don’t store',
      items: [
        isEs
          ? 'Credenciales (usamos AssumeRole con tokens temporales)'
          : 'Credentials (we use AssumeRole with temporary tokens)',
        isEs ? 'Contenido de tus recursos' : 'Contents of your resources',
        isEs ? 'Métricas históricas crudas' : 'Raw historical metrics',
      ],
    },
    {
      kind: 'crypto',
      title: isEs ? 'Encripción' : 'Encryption',
      items: [
        isEs ? 'En reposo: AES-256' : 'At rest: AES-256',
        isEs ? 'En tránsito: TLS 1.2+' : 'In transit: TLS 1.2+',
        isEs
          ? 'Borrado en 30 días si cancelás'
          : 'Deleted within 30 days on cancellation',
      ],
    },
  ];

  const compliance = [
    {
      Icon: BadgeCheck,
      title: 'SOC 2 Type II',
      status: isEs ? 'En auditoría' : 'In audit',
      detail: isEs
        ? 'Reporte esperado para Q3 2026.'
        : 'Report expected Q3 2026.',
      tone: 'progress' as const,
    },
    {
      Icon: BadgeCheck,
      title: 'GDPR',
      status: isEs ? 'Compliant' : 'Compliant',
      detail: isEs
        ? 'Data processor. Firmamos DPA si lo pedís.'
        : 'Data processor. We sign a DPA on request.',
      tone: 'ok' as const,
    },
    {
      Icon: BadgeCheck,
      title: 'Ley 25.326 (AR)',
      status: isEs ? 'Registrado' : 'Registered',
      detail: isEs
        ? 'Responsable de tratamiento ante la AAIP.'
        : 'Registered data controller with AAIP.',
      tone: 'ok' as const,
    },
  ];

  const revokeSteps = isEs
    ? [
        'AWS Console → IAM → Roles',
        'Buscás el rol de Signal',
        'Click en Delete (10 segundos)',
        'Borrás tu cuenta Signal desde la app o por mail',
      ]
    : [
        'AWS Console → IAM → Roles',
        'Find the Signal role',
        'Click Delete (10 seconds)',
        'Delete your Signal account in-app or by email',
      ];

  return (
    <main className="min-h-screen px-6 py-16 max-w-4xl mx-auto">
      <BackToHome lang={lang} />

      {/* Header */}
      <header className="mb-10">
        <div className="text-sm font-mono uppercase tracking-wider text-slate-500 mb-3">
          {isEs ? 'Seguridad' : 'Security'}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-slate-900 leading-[1.08] tracking-[-0.025em] mb-4">
          {isEs ? 'Solo lectura. Y nada más.' : 'Read-only. And nothing else.'}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          {isEs
            ? 'Conectás Signal con un rol IAM solo lectura. Vemos lo que pagás. No tocamos nada hasta que vos clickeás. Lo revocás cuando quieras desde tu consola AWS.'
            : 'You connect Signal with a read-only IAM role. We see what you pay for. We touch nothing until you click. You revoke us anytime from your AWS console.'}
        </p>
      </header>

      {/* TL;DR card */}
      <section
        className="rounded-2xl border border-slate-200 p-7 mb-12 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(59,130,246,0.04) 0%, rgba(16,185,129,0.04) 100%)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold">
            TL;DR
          </span>
        </div>
        <ul className="space-y-2.5 text-[15px] text-slate-700 leading-relaxed">
          <li className="flex gap-3">
            <span className="text-slate-400 select-none">→</span>
            <span>
              {isEs
                ? 'Pedimos permisos solo lectura. La policy IAM completa está abajo, sin asteriscos.'
                : 'We ask for read-only permissions. The full IAM policy is below, no asterisks.'}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400 select-none">→</span>
            <span>
              {isEs
                ? 'No leemos contenido — ni de S3, ni de bases, ni de logs. Solo metadata + costos.'
                : 'We don’t read content — not S3, not databases, not logs. Just metadata + costs.'}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400 select-none">→</span>
            <span>
              {isEs
                ? 'Nos revocás en 10 segundos desde la consola AWS. Sin trámites.'
                : 'You revoke us in 10 seconds from the AWS console. No paperwork.'}
            </span>
          </li>
        </ul>
      </section>

      {/* IAM Policy — the credibility artifact */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-3">
          <FileCode className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            {isEs ? 'La policy completa' : 'The full policy'}
          </span>
        </div>
        <h2 className="font-display text-2xl font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em] mb-2">
          {isEs
            ? 'Esto es exactamente lo que pedimos.'
            : 'This is exactly what we ask for.'}
        </h2>
        <p className="text-slate-600 mb-5 leading-relaxed max-w-2xl">
          {isEs
            ? 'Sin comodines de escritura, sin acceso a contenido de S3, sin IAM, sin billing más allá de Cost Explorer.'
            : 'No write wildcards, no S3 content access, no IAM, no billing beyond Cost Explorer.'}
        </p>
        <div
          className="rounded-2xl overflow-hidden border border-slate-800"
          style={{
            background:
              'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          }}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            </div>
            <span className="text-xs font-mono text-slate-400">
              signal-readonly.policy.json
            </span>
          </div>
          <pre className="text-sm text-slate-100 p-5 overflow-x-auto leading-relaxed m-0 font-mono">
{IAM_POLICY}
          </pre>
        </div>
        <p className="text-sm text-slate-500 mt-4 leading-relaxed">
          {isEs
            ? 'Si te cierra, agregás el rol con un template CloudFormation de 12 líneas. No hace falta más.'
            : 'If that looks right, you add the role with a 12-line CloudFormation template. Nothing else needed.'}
        </p>
      </section>

      {/* What we do / What we don't — two columns */}
      <section className="grid md:grid-cols-2 gap-5 mb-14">
        {/* What we do */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Eye className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="font-display text-xl font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em] m-0">
              {isEs ? 'Qué hacemos' : 'What we do'}
            </h2>
          </div>
          <ul className="space-y-4">
            {whatWeDo.map((item, i) => (
              <li
                key={i}
                className="text-sm text-slate-700 leading-relaxed flex gap-3"
              >
                <span className="text-slate-400 mt-0.5 select-none">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What we DON'T — Von Restorff */}
        <div
          className="rounded-2xl border border-emerald-200 p-6 relative"
          style={{
            background:
              'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <ShieldOff className="w-4 h-4 text-emerald-700" />
            </div>
            <h2 className="font-display text-xl font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em] m-0">
              {isEs ? 'Qué NO hacemos' : 'What we DON’T do'}
            </h2>
          </div>
          <ul className="space-y-4">
            {whatWeDont.map((item, i) => (
              <li
                key={i}
                className="text-sm text-slate-700 leading-relaxed flex gap-3"
              >
                <span className="text-emerald-600 font-bold mt-0.5 select-none">
                  ✕
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How we delete — sequential card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 mb-14">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-amber-700" />
          </div>
          <h2 className="font-display text-xl font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em] m-0">
            {isEs ? 'Cómo borramos (cuando lo aprobás)' : 'How we delete (when you approve)'}
          </h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-0">
          {isEs
            ? 'Si hacés upgrade del rol read-only a uno con delete, cada acción corre una a una con tu OK explícito. Snapshot primero cuando aplica (EBS, RDS), dependencias chequeadas (una EBS adjunta no se borra). Si tu infra es IaC, generamos un PR de Terraform.'
            : 'If you upgrade from the read-only role to one with delete permissions, each action runs one at a time with your explicit OK. Snapshot first where applicable (EBS, RDS), dependencies checked (an attached EBS won’t be deleted). If your infra is IaC, we generate a Terraform PR.'}
        </p>
      </section>

      {/* Data on servers — 3 column grid */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-3">
          <HardDrive className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            {isEs ? 'En nuestros servidores' : 'On our servers'}
          </span>
        </div>
        <h2 className="font-display text-2xl font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em] mb-6">
          {isEs ? 'Tus datos en Signal' : 'Your data on Signal'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {dataOnServers.map((col) => {
            const accent =
              col.kind === 'store'
                ? 'border-slate-200 bg-white'
                : col.kind === 'dont'
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-blue-200 bg-blue-50/40';
            const titleColor =
              col.kind === 'dont'
                ? 'text-emerald-900'
                : col.kind === 'crypto'
                  ? 'text-blue-900'
                  : 'text-slate-900';
            return (
              <div
                key={col.kind}
                className={`rounded-xl border p-5 ${accent}`}
              >
                <div
                  className={`text-xs font-mono uppercase tracking-wider font-semibold mb-3 ${titleColor}`}
                >
                  {col.title}
                </div>
                <ul className="space-y-2.5">
                  {col.items.map((it, i) => (
                    <li
                      key={i}
                      className="text-sm text-slate-700 leading-relaxed"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* How to revoke — numbered steps card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 mb-14">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <KeyRound className="w-4 h-4 text-slate-700" />
          </div>
          <h2 className="font-display text-xl font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em] m-0">
            {isEs ? 'Cómo revocarnos' : 'How to revoke us'}
          </h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-5">
          {isEs
            ? 'Cuatro pasos. Tarda menos de un minuto.'
            : 'Four steps. Takes under a minute.'}
        </p>
        <ol className="space-y-3">
          {revokeSteps.map((step, i) => (
            <li key={i} className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-sm font-display font-semibold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <span className="text-sm text-slate-700 leading-relaxed pt-0.5">
                {step}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-sm text-slate-500 mt-5 leading-relaxed border-t border-slate-100 pt-4">
          {isEs ? (
            <>
              ¿Querés que lo borremos de nuestro lado también? Mandanos un mail
              a{' '}
              <a
                href={`mailto:${CONTACT_EMAILS.privacy}`}
                className="text-blue-600 no-underline hover:underline"
              >
                {CONTACT_EMAILS.privacy}
              </a>
              .
            </>
          ) : (
            <>
              Want us to delete it on our side too? Email{' '}
              <a
                href={`mailto:${CONTACT_EMAILS.privacy}`}
                className="text-blue-600 no-underline hover:underline"
              >
                {CONTACT_EMAILS.privacy}
              </a>
              .
            </>
          )}
        </p>
      </section>

      {/* Compliance — 3 status cards */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-3">
          <BadgeCheck className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            {isEs ? 'Compliance' : 'Compliance'}
          </span>
        </div>
        <h2 className="font-display text-2xl font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em] mb-6">
          {isEs ? 'Estado actual' : 'Current status'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {compliance.map((item) => {
            const statusBadge =
              item.tone === 'ok'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800';
            return (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <item.Icon className="w-5 h-5 text-slate-700" />
                  <span
                    className={`text-[11px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${statusBadge}`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="font-display font-semibold text-slate-900 text-base tracking-tight mb-1.5">
                  {item.title}
                </div>
                <div className="text-sm text-slate-600 leading-relaxed">
                  {item.detail}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA — bug bounty / security@ */}
      <section
        className="rounded-2xl border border-slate-900 p-7 text-white"
        style={{
          background:
            'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Bug className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold leading-[1.1] tracking-[-0.02em] mb-2 m-0">
              {isEs
                ? '¿Encontraste algo?'
                : 'Found something?'}
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              {isEs
                ? 'Reportes de seguridad respondidos en 24h. Disclosure responsable agradecido — un T-shirt de Signal va para el primero que reporte algo serio.'
                : 'Security reports answered within 24h. Responsible disclosure appreciated — a Signal T-shirt goes to the first person who reports something serious.'}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={`mailto:${CONTACT_EMAILS.security}`}
                className="inline-flex items-center gap-2 font-mono text-base font-semibold text-white no-underline border-b border-white/30 hover:border-white pb-0.5"
              >
                <Mail className="w-4 h-4" />
                {CONTACT_EMAILS.security}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
