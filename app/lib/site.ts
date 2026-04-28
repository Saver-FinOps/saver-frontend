if (
  !process.env.NEXT_PUBLIC_SITE_URL &&
  process.env.NODE_ENV === 'production'
) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL must be set in production — required for canonicals, sitemap, and Open Graph URLs.',
  );
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
