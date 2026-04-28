import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Sparkles,
  Database,
  ShieldOff,
  Server,
  Eye,
  Pencil,
  Trash2,
  Download,
  Scale,
  Bell,
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
    en: 'Privacy Policy | Signal',
    es: 'Política de Privacidad | Signal',
  };

  const descriptions: Record<Locale, string> = {
    en: 'What Signal collects, what we don’t, where it lives, and how to delete it. Plain language, no tracking pixels.',
    es: 'Qué guarda Signal, qué no, dónde vive, y cómo borrarlo. En castellano, sin pixels de tracking.',
  };

  const url = `${SITE_URL}/${lang}/privacy`;

  return {
    title: titles[lang],
    description: descriptions[lang],
    robots: 'index,follow',
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en/privacy`,
        es: `${SITE_URL}/es/privacy`,
        'x-default': `${SITE_URL}/es/privacy`,
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

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const isEs = lang === 'es';

  const collect = [
    {
      title: isEs ? 'Email + empresa + rol' : 'Email + company + role',
      body: isEs
        ? 'Lo que ponés en el form de waitlist. Sirve para invitarte cuando se libere tu cupo.'
        : 'What you put in the waitlist form. Used to invite you when your spot opens up.',
    },
    {
      title: isEs ? 'Metadata de tu cuenta AWS' : 'AWS account metadata',
      body: isEs
        ? 'IDs de recursos, tipo, tamaño, fechas, métricas. Cero contenido de buckets, bases o logs.'
        : 'Resource IDs, type, size, dates, metrics. Zero content of buckets, databases or logs.',
    },
    {
      title: isEs ? 'Eventos de uso del producto' : 'Product usage events',
      body: isEs
        ? 'Qué páginas visitás, qué acciones ejecutás (sin contenido). Self-hosted, sin Google Analytics.'
        : 'Which pages you visit, which actions you run (no content). Self-hosted, no Google Analytics.',
    },
    {
      title: isEs ? 'Logs técnicos' : 'Technical logs',
      body: isEs
        ? 'IP, user-agent, errores. Retenidos 30 días para debugging.'
        : 'IP, user agent, errors. Retained 30 days for debugging.',
    },
  ];

  const dontCollect = [
    isEs
      ? 'Credenciales AWS. Usamos AssumeRole con tokens temporales que vencen.'
      : 'AWS credentials. We use AssumeRole with temporary tokens that expire.',
    isEs
      ? 'Contenido de tus buckets, bases, logs, secrets ni objetos S3.'
      : 'Contents of your buckets, databases, logs, secrets, or S3 objects.',
    isEs
      ? 'Cookies de tracking. Solo session cookie para mantenerte logueado.'
      : 'Tracking cookies. Only the session cookie to keep you logged in.',
  ];

  const subprocessors = [
    {
      name: 'AWS',
      role: isEs ? 'Hosting' : 'Hosting',
      detail: isEs ? 'Servidores en us-east-1' : 'Servers in us-east-1',
      color: 'from-orange-400 to-orange-500',
    },
    {
      name: 'Resend',
      role: isEs ? 'Email' : 'Email',
      detail: isEs
        ? 'Envío transaccional (welcome, alertas)'
        : 'Transactional sends (welcome, alerts)',
      color: 'from-purple-400 to-purple-500',
    },
    {
      name: 'PostHog',
      role: isEs ? 'Analytics' : 'Analytics',
      detail: isEs
        ? 'Eventos de uso del producto (sin Google Analytics)'
        : 'Product usage events (no Google Analytics)',
      color: 'from-emerald-400 to-emerald-500',
    },
    {
      name: 'Stripe',
      role: isEs ? 'Cobros' : 'Billing',
      detail: isEs
        ? 'Cuando salgamos del waitlist'
        : 'After we leave the waitlist',
      color: 'from-indigo-400 to-indigo-500',
    },
  ];

  const rights = [
    {
      Icon: Eye,
      title: isEs ? 'Ver' : 'Access',
      body: isEs
        ? 'Export de todo lo que tenemos sobre vos. 7 días.'
        : 'Export of everything we have on you. 7 days.',
      cta: isEs ? 'Pedir export' : 'Request export',
      mailtoSubject: isEs ? 'Pedido de export de datos' : 'Data export request',
    },
    {
      Icon: Pencil,
      title: isEs ? 'Corregir' : 'Correct',
      body: isEs
        ? 'Cambiá lo que esté mal en tus datos.'
        : 'Fix anything that’s wrong in your data.',
      cta: isEs ? 'Pedir corrección' : 'Request correction',
      mailtoSubject: isEs ? 'Corrección de datos' : 'Data correction',
    },
    {
      Icon: Trash2,
      title: isEs ? 'Borrar' : 'Delete',
      body: isEs
        ? 'Borramos todo en 30 días. Antes si lo pedís.'
        : 'We delete everything within 30 days. Sooner on request.',
      cta: isEs ? 'Pedir borrado' : 'Request deletion',
      mailtoSubject: isEs ? 'Pedido de borrado' : 'Deletion request',
    },
    {
      Icon: Download,
      title: isEs ? 'Exportar' : 'Export',
      body: isEs
        ? 'JSON portable con todos tus hallazgos.'
        : 'Portable JSON of all your findings.',
      cta: isEs ? 'Pedir JSON' : 'Request JSON',
      mailtoSubject: isEs ? 'Export JSON' : 'JSON export',
    },
  ];

  return (
    <main className="min-h-screen px-6 py-16 max-w-4xl mx-auto">
      <BackToHome lang={lang} />

      {/* Header */}
      <header className="mb-10">
        <div className="text-sm font-mono uppercase tracking-wider text-slate-500 mb-3">
          {isEs ? 'Privacidad' : 'Privacy'}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-slate-900 leading-[1.08] tracking-[-0.025em] mb-4">
          {isEs ? 'Lo que guardamos. Y nada más.' : 'What we keep. And nothing more.'}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          {isEs
            ? 'Sin pixels de tracking, sin sharing con terceros para ads, sin dark patterns. Esto es exactamente qué pasa con tus datos cuando usás Signal.'
            : 'No tracking pixels, no third-party ad sharing, no dark patterns. This is exactly what happens to your data when you use Signal.'}
        </p>
        <p className="text-sm text-slate-500 mt-4">
          {isEs ? 'Última actualización: 28 de abril de 2026' : 'Last updated: April 28, 2026'}
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
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold">
            TL;DR
          </span>
        </div>
        <ul className="space-y-2.5 text-[15px] text-slate-700 leading-relaxed">
          <li className="flex gap-3">
            <span className="text-slate-400 select-none">→</span>
            <span>
              {isEs
                ? 'Solo guardamos lo que necesitamos para hacer funcionar Signal. Cero contenido de tu AWS.'
                : 'We only keep what we need to run Signal. Zero contents of your AWS.'}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400 select-none">→</span>
            <span>
              {isEs
                ? 'No vendemos tus datos. No corremos ads. No tenemos partners que leakeen tu email.'
                : 'We don’t sell your data. We don’t run ads. No partners leaking your email.'}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400 select-none">→</span>
            <span>
              {isEs
                ? 'Borrás todo cuando quieras: un mail a privacy@ y en 30 días no queda nada.'
                : 'Delete everything anytime: one email to privacy@ and within 30 days nothing’s left.'}
            </span>
          </li>
        </ul>
      </section>

      {/* Collect / Don't collect — two columns */}
      <section className="grid md:grid-cols-2 gap-5 mb-14">
        {/* What we collect */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Database className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="font-display text-xl font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em] m-0">
              {isEs ? 'Qué guardamos' : 'What we collect'}
            </h2>
          </div>
          <ul className="space-y-4">
            {collect.map((item) => (
              <li key={item.title}>
                <div className="text-sm font-semibold text-slate-900 mb-1">
                  {item.title}
                </div>
                <div className="text-sm text-slate-600 leading-relaxed">
                  {item.body}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* What we DON'T collect — Von Restorff: visually distinct + green */}
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
              {isEs ? 'Qué NO guardamos' : 'What we DON’T collect'}
            </h2>
          </div>
          <ul className="space-y-4">
            {dontCollect.map((item, i) => (
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

      {/* Sub-processors — grid of 3 cards */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-5">
          <Server className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            {isEs ? 'Quién más lo ve' : 'Who else sees it'}
          </span>
        </div>
        <h2 className="font-display text-2xl font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em] mb-2">
          {isEs ? 'Cuatro sub-procesadores. Eso es todo.' : 'Four sub-processors. That’s it.'}
        </h2>
        <p className="text-slate-600 mb-6 leading-relaxed max-w-2xl">
          {isEs
            ? 'Las únicas terceras partes que tocan tus datos. Cada una con un trabajo concreto.'
            : 'The only third parties that touch your data. Each with one specific job.'}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subprocessors.map((sp) => (
            <div
              key={sp.name}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-linear-to-br ${sp.color} mb-4 flex items-center justify-center text-white font-display font-bold text-lg`}
              >
                {sp.name.charAt(0)}
              </div>
              <div className="font-display font-semibold text-slate-900 text-base tracking-tight mb-0.5">
                {sp.name}
              </div>
              <div className="text-xs uppercase font-mono tracking-wider text-slate-500 mb-2">
                {sp.role}
              </div>
              <div className="text-sm text-slate-600 leading-relaxed">
                {sp.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your rights — 2x2 actionable grid */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em] mb-2">
          {isEs ? 'Tus derechos' : 'Your rights'}
        </h2>
        <p className="text-slate-600 mb-6 leading-relaxed max-w-2xl">
          {isEs
            ? 'Cualquiera de estos tarda menos de un mail. Click en el link y mandamos confirmación cuando esté hecho.'
            : 'Each of these takes less than one email. Click the link and we’ll confirm when it’s done.'}
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {rights.map((right) => {
            const mailto = `mailto:${CONTACT_EMAILS.privacy}?subject=${encodeURIComponent(right.mailtoSubject)}`;
            return (
              <div
                key={right.title}
                className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <right.Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-display font-semibold text-slate-900 text-base tracking-tight mb-1">
                      {right.title}
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed">
                      {right.body}
                    </div>
                  </div>
                </div>
                <a
                  href={mailto}
                  className="text-sm font-semibold text-blue-600 no-underline hover:underline mt-auto self-start"
                >
                  {right.cta} →
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* The legal stuff — collapsed, smaller, less weight */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-5">
          <Scale className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            {isEs ? 'Detalles legales' : 'Legal details'}
          </span>
        </div>

        <div className="space-y-6 text-[15px] text-slate-700 leading-relaxed">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900 tracking-tight mb-1.5">
              {isEs ? 'Marco legal' : 'Legal basis'}
            </h3>
            <p className="m-0">
              {isEs
                ? 'Procesamos datos bajo tu consentimiento (al aceptar los términos) y el contrato (necesario para entregar el producto). Cumplimos GDPR, CCPA y la Ley 25.326 de Argentina. Si necesitás un DPA firmado, escribinos.'
                : 'We process data under your consent (when you accept terms at signup) and contract (necessary to deliver the product). We comply with GDPR, CCPA, and Argentina Law 25.326. If you need a signed DPA, email us.'}
            </p>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-slate-900 tracking-tight mb-1.5 flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-slate-400" />
              {isEs ? 'Cuando algo cambia' : 'When something changes'}
            </h3>
            <p className="m-0">
              {isEs
                ? 'Si cambiamos algo material, te avisamos por email 30 días antes de que entre en vigencia.'
                : 'If we change anything material, we email you 30 days before it takes effect.'}
            </p>
          </div>
        </div>
      </section>

      {/* Final contact CTA — Peak-End: closing strong + actionable */}
      <section
        className="rounded-2xl border border-slate-900 bg-slate-900 p-7 text-white"
        style={{
          background:
            'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold leading-[1.1] tracking-[-0.02em] mb-2 m-0">
              {isEs
                ? '¿Algo no te cierra?'
                : 'Something not sitting right?'}
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              {isEs
                ? 'Preguntas, requests de borrado, DPAs, lo que sea. Lo lee un humano.'
                : 'Questions, deletion requests, DPAs, anything. A human reads it.'}
            </p>
            <a
              href={`mailto:${CONTACT_EMAILS.privacy}`}
              className="inline-block font-mono text-base font-semibold text-white no-underline border-b border-white/30 hover:border-white pb-0.5"
            >
              {CONTACT_EMAILS.privacy}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
