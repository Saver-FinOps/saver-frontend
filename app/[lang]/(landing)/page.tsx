import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '../dictionaries';
import type { Locale } from '../dictionaries';
import Nav from './components/Nav';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Catalog from './components/Catalog';
import Features from './components/Features';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import { SITE_URL } from '@/app/lib/site';
import { CONTACT_EMAILS } from '@/app/lib/contact';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) return {};

  const { t } = await getDictionary(lang);
  const ogLocale = lang === 'es' ? 'es_ES' : 'en_US';
  const url = `${SITE_URL}/${lang}`;

  return {
    title: t.meta_title,
    description: t.meta_description,
    robots: 'index,follow',
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en`,
        es: `${SITE_URL}/es`,
        'x-default': `${SITE_URL}/es`,
      },
    },
    openGraph: {
      type: 'website',
      url,
      title: t.og_title,
      description: t.og_description,
      locale: ogLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t.og_title,
      description: t.og_description,
    },
  };
}

function buildSchemas(
  lang: Locale,
  faq: ReadonlyArray<{ q: string; a: string }>,
) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Signal',
    url: SITE_URL,
    description:
      lang === 'es'
        ? 'Signal ayuda a founders a encontrar y borrar recursos AWS olvidados en minutos. Para startups, no para equipos de FinOps.'
        : 'Signal helps founders find and delete forgotten AWS resources in minutes. Built for startups, not FinOps teams.',
    sameAs: [
      'https://twitter.com/signal_aws',
      'https://linkedin.com/company/signal-aws',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_EMAILS.hello,
      contactType: 'customer service',
    },
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Signal',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    description:
      lang === 'es'
        ? 'Conectá tu cuenta AWS con un rol solo lectura, mirá en qué estás desperdiciando plata, y borralo con un click. Hecho para founders.'
        : 'Connect your AWS account with a read-only role, see exactly what you’re wasting money on, and delete it with one click. Built for founders.',
  };

  return [faqSchema, orgSchema, softwareSchema];
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const { t, faq } = await getDictionary(lang);
  const schemas = buildSchemas(lang, faq);

  return (
    <div className="flex flex-col flex-1" style={{ background: 'var(--bg-page)' }}>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Nav lang={lang} t={t} />
      <Hero lang={lang} t={t} />
      <HowItWorks t={t} />
      <Catalog t={t} />
      <Features t={t} />
      <FAQ t={t} items={faq} />
      <FinalCTA lang={lang} t={t} />
      <Footer lang={lang} t={t} />
    </div>
  );
}
