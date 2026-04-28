'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const UI_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!posthog.__loaded || !pathname) return;
    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    posthog.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!KEY) return;
    if (posthog.__loaded) return;

    posthog.init(KEY, {
      api_host: '/ingest',
      ui_host: UI_HOST,
      capture_pageview: false,
      capture_pageleave: true,
      capture_exceptions: false,
      person_profiles: 'identified_only',
      autocapture: {
        dom_event_allowlist: ['click', 'submit'],
      },
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') {
          ph.debug(false);
        }
      },
    });
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  );
}
