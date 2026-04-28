import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from '../dictionaries';
import type { Locale } from '../dictionaries';
import { SITE_URL } from '@/app/lib/site';
import { CONTACT_EMAILS } from '@/app/lib/contact';
import { BackToHome } from '../_components/BackToHome';
import { ContactEmailLink } from '../_components/ContactEmailLink';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) return {};

  const titles: Record<Locale, string> = {
    en: 'Contact | Signal',
    es: 'Contacto | Signal',
  };

  const descriptions: Record<Locale, string> = {
    en: 'Where to write us. Response times, who handles what, and our timezone (Buenos Aires).',
    es: 'A dónde escribirnos. Tiempos de respuesta, quién atiende qué, y la zona horaria (Buenos Aires).',
  };

  const url = `${SITE_URL}/${lang}/contact`;

  return {
    title: titles[lang],
    description: descriptions[lang],
    robots: 'index,follow',
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en/contact`,
        es: `${SITE_URL}/es/contact`,
        'x-default': `${SITE_URL}/es/contact`,
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const isEs = lang === 'es';

  const channels = [
    {
      key: 'support',
      email: CONTACT_EMAILS.support,
      title: isEs ? 'Soporte' : 'Support',
      blurb: isEs
        ? 'Algo no anda en Signal. Bug, error de scan, problema con tu cuenta.'
        : 'Something’s broken in Signal. Bug, scan error, account issue.',
      sla: isEs ? 'Respuesta en menos de 24h hábiles.' : 'Response within 24 business hours.',
    },
    {
      key: 'sales',
      email: CONTACT_EMAILS.sales,
      title: isEs ? 'Ventas y partners' : 'Sales & partners',
      blurb: isEs
        ? 'Volumen, plan custom para tu cohort de YC, partnership, integración.'
        : 'Volume, custom plan for your YC batch, partnership, integration.',
      sla: isEs ? 'Respuesta en 1-2 días hábiles.' : 'Response within 1-2 business days.',
    },
    {
      key: 'security',
      email: CONTACT_EMAILS.security,
      title: isEs ? 'Seguridad' : 'Security',
      blurb: isEs
        ? 'Reportar una vulnerabilidad, pedir un security review, DPA con tu CISO.'
        : 'Report a vulnerability, request a security review, DPA with your CISO.',
      sla: isEs ? 'Respuesta en 24h, 7 días a la semana.' : 'Response within 24h, 7 days a week.',
    },
    {
      key: 'privacy',
      email: CONTACT_EMAILS.privacy,
      title: isEs ? 'Privacidad y data' : 'Privacy & data',
      blurb: isEs
        ? 'Pedir export, borrado, GDPR/CCPA requests, DPA firmado.'
        : 'Request export, deletion, GDPR/CCPA requests, signed DPA.',
      sla: isEs ? 'Respuesta en 7 días.' : 'Response within 7 days.',
    },
    {
      key: 'hello',
      email: CONTACT_EMAILS.hello,
      title: isEs ? 'Cualquier otra cosa' : 'Everything else',
      blurb: isEs
        ? 'Prensa, feedback, te aburrías. Lo leo yo (Iván) y respondo seguro.'
        : 'Press, feedback, you’re bored. I (Iván) read it and reply for sure.',
      sla: isEs ? 'Respuesta en 2-3 días.' : 'Response within 2-3 days.',
    },
  ];

  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <BackToHome lang={lang} />

      <header className="mb-12">
        <div className="text-sm font-mono uppercase tracking-wider text-slate-500 mb-3">
          {isEs ? 'Contacto' : 'Contact'}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-slate-900 leading-[1.08] tracking-[-0.025em] mb-4">
          {isEs ? 'Escribinos. Te leemos.' : 'Write us. We read everything.'}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          {isEs
            ? 'Sin chatbots, sin tickets numerados, sin "tu llamada es importante". Mails directos a humanos en Buenos Aires.'
            : 'No chatbots, no ticket numbers, no "your call is important to us". Direct emails to humans in Buenos Aires.'}
        </p>
      </header>

      <div className="space-y-6 mb-16">
        {channels.map((c) => (
          <div
            key={c.key}
            className="border border-slate-200 rounded-xl p-6 bg-white"
          >
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
              <h2 className="font-display text-xl font-semibold text-slate-900 m-0">
                {c.title}
              </h2>
              <ContactEmailLink email={c.email} channel={c.key} />
            </div>
            <p className="text-slate-600 leading-relaxed mb-2 m-0">
              {c.blurb}
            </p>
            <p className="text-sm text-slate-500 m-0">{c.sla}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-8 text-sm text-slate-500 leading-relaxed">
        <p className="m-0 mb-2">
          <strong className="text-slate-700">
            {isEs ? 'Horario' : 'Hours'}
          </strong>{' '}
          —{' '}
          {isEs
            ? 'Lunes a viernes, 9:00 a 19:00 ART (UTC-3). Issues de seguridad, 24/7.'
            : 'Monday to Friday, 9am-7pm ART (UTC-3). Security issues, 24/7.'}
        </p>
        <p className="m-0">
          <strong className="text-slate-700">
            {isEs ? 'Dirección' : 'Address'}
          </strong>{' '}
          —{' '}
          {isEs
            ? 'Buenos Aires, Argentina. Sin oficina física que visitar (todavía).'
            : 'Buenos Aires, Argentina. No physical office to visit (yet).'}
        </p>
      </div>
    </main>
  );
}
