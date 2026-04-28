// Pre-launch: all channels route to founder Gmail. When a real domain
// is verified in Resend, swap to per-channel addresses on that domain
// (e.g. hello@signal.dev) and update CONTACT_EMAILS below.
const FOUNDER_EMAIL = 'dujautivan@gmail.com';

export const CONTACT_EMAILS = {
  hello: FOUNDER_EMAIL,
  support: FOUNDER_EMAIL,
  sales: FOUNDER_EMAIL,
  privacy: FOUNDER_EMAIL,
  security: FOUNDER_EMAIL,
} as const;
