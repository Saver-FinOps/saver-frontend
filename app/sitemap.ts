import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/app/lib/site';

const LOCALES = ['en', 'es'] as const;
const TRUST_PAGES = ['privacy', 'security', 'contact'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: locale === 'es' ? 1.0 : 0.8,
      alternates: {
        languages: {
          en: `${SITE_URL}/en`,
          es: `${SITE_URL}/es`,
          'x-default': `${SITE_URL}/es`,
        },
      },
    });
  }

  for (const page of TRUST_PAGES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/${page}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            en: `${SITE_URL}/en/${page}`,
            es: `${SITE_URL}/es/${page}`,
            'x-default': `${SITE_URL}/es/${page}`,
          },
        },
      });
    }
  }

  return entries;
}
