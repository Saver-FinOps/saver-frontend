// Pre-launch: all channels route to the institutional Gmail. Once we move
// inbound mail to the verified signalfinops.com domain, swap to per-channel
// addresses (e.g. hello@signalfinops.com) and update CONTACT_EMAILS below.
const FOUNDER_EMAIL = 'signalfinops@gmail.com';

export const CONTACT_EMAILS = {
  hello: FOUNDER_EMAIL,
  support: FOUNDER_EMAIL,
  sales: FOUNDER_EMAIL,
  privacy: FOUNDER_EMAIL,
  security: FOUNDER_EMAIL,
} as const;
