'use client';

import posthog from 'posthog-js';

/**
 * Custom event names — keep this enum the source of truth so we can grep
 * across the codebase to find every event we send. Add new events here.
 */
export type AnalyticsEvent =
  | 'hero_variant_view'
  | 'waitlist_focus'
  | 'waitlist_submit'
  | 'waitlist_success'
  | 'waitlist_duplicate'
  | 'waitlist_error'
  | 'sample_open'
  | 'sample_close'
  | 'cta_click'
  | 'nav_link_click'
  | 'lang_switch'
  | 'footer_link_click'
  | 'faq_item_open'
  | 'contact_email_click';

/**
 * Fire-and-forget event tracker. Safe to call before PostHog has loaded
 * (queues internally). Safe to call when env vars are missing (no-op).
 */
export function track(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean | null | undefined>,
): void {
  if (typeof window === 'undefined') return;
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}

/**
 * Tie the current anonymous user to a stable identifier (e.g. email)
 * after a successful waitlist submit, so pre-signup events get linked.
 */
export function identify(
  distinctId: string,
  traits?: Record<string, string | number | boolean | null | undefined>,
): void {
  if (typeof window === 'undefined') return;
  if (!posthog.__loaded) return;
  posthog.identify(distinctId, traits);
}
