import 'server-only';
import { Resend } from 'resend';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var: ${name}. Set it in .env.local (dev) or your hosting provider (prod).`,
    );
  }
  return value;
}

export const resend = new Resend(requireEnv('RESEND_API_KEY'));

export const EMAIL_FROM = requireEnv('EMAIL_FROM');
export const FOUNDER_NOTIFY_EMAIL = requireEnv('FOUNDER_NOTIFY_EMAIL');
export const RESEND_AUDIENCE_ID = requireEnv('RESEND_AUDIENCE_ID');
