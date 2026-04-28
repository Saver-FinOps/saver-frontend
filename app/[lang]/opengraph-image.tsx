import { ImageResponse } from 'next/og';
import { hasLocale } from './dictionaries';
import type { Locale } from './dictionaries';

export const alt = 'Signal - AWS Cost Optimization';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const titles: Record<Locale, string> = {
  en: 'Signal — AWS Cost Optimization',
  es: 'Signal — Optimización de Costos AWS',
};

const subtitles: Record<Locale, string> = {
  en: 'Find wasted resources in 15 minutes',
  es: 'Encontrá recursos desperdiciados en 15 minutos',
};

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = hasLocale(lang) ? lang : 'en';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #1e293b 2px, transparent 0)',
          backgroundSize: '50px 50px',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            marginBottom: 20,
            background: 'linear-gradient(45deg, #3b82f6, #10b981)',
            backgroundClip: 'text',
            color: 'transparent',
            lineHeight: 1,
          }}
        >
          Signal
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            textAlign: 'center',
            maxWidth: 960,
            lineHeight: 1.2,
            padding: '0 40px',
          }}
        >
          {titles[locale]}
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 24,
            opacity: 0.75,
            textAlign: 'center',
            maxWidth: 900,
            padding: '0 40px',
          }}
        >
          {subtitles[locale]}
        </div>
      </div>
    ),
    size,
  );
}
