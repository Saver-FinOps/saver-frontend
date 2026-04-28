import posthog from 'posthog-js';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: '/ingest',
  ui_host: 'https://us.posthog.com',
  defaults: '2026-01-30',
  capture_exceptions: true,
  capture_pageview: false, // tracked manually via PostHogPageView
  capture_pageleave: true,
  person_profiles: 'identified_only',
  autocapture: {
    dom_event_allowlist: ['click', 'submit'],
  },
  debug: process.env.NODE_ENV === 'development',
});
