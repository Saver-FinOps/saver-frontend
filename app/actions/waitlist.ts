'use server';

import { headers } from 'next/headers';
import {
  resend,
  EMAIL_FROM,
  FOUNDER_NOTIFY_EMAIL,
  RESEND_AUDIENCE_ID,
} from '@/app/lib/email';
import {
  welcomeEmail,
  founderAlertEmail,
} from '@/app/lib/email-templates';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface WaitlistInput {
  email: string;
  company: string;
  role: string;
  lang: 'en' | 'es';
  honeypot?: string;
}

export type WaitlistResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; error: 'invalid' | 'rate_limited' | 'server' };

export async function joinWaitlist(
  input: WaitlistInput,
): Promise<WaitlistResult> {
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { ok: true, duplicate: false };
  }

  const email = input.email.trim().toLowerCase();
  const company = input.company.trim();
  const role = input.role.trim();
  const lang: 'en' | 'es' = input.lang === 'es' ? 'es' : 'en';

  if (
    !EMAIL_RE.test(email) ||
    email.length > 254 ||
    company.length === 0 ||
    company.length > 120 ||
    role.length === 0 ||
    role.length > 80
  ) {
    return { ok: false, error: 'invalid' };
  }

  const hdrs = await headers();
  const userAgent = hdrs.get('user-agent') ?? undefined;

  let duplicate = false;
  try {
    const { error: contactError } = await resend.contacts.create({
      email,
      audienceId: RESEND_AUDIENCE_ID,
      unsubscribed: false,
      firstName: company,
      properties: {
        company,
        role,
        lang,
        source: 'waitlist_form',
      },
    });
    if (contactError) {
      const message = contactError.message.toLowerCase();
      duplicate =
        message.includes('already') || message.includes('duplicate');
      if (!duplicate) {
        console.error('[waitlist] audience.create failed', contactError);
        return { ok: false, error: 'server' };
      }
    }
  } catch (err) {
    console.error('[waitlist] audience.create threw', err);
    return { ok: false, error: 'server' };
  }

  // Don't re-send welcome to existing contacts — just acknowledge.
  if (duplicate) {
    return { ok: true, duplicate: true };
  }

  const welcome = welcomeEmail({ lang, email, company, role });
  const alert = founderAlertEmail({ email, company, role, lang, userAgent });

  // Resend sandbox (onboarding@resend.dev) only delivers to the account
  // owner's email. Redirect the user-bound welcome there with a marker so
  // we can still QA the template end-to-end before a domain is verified.
  const isSandbox = EMAIL_FROM.includes('resend.dev');
  const welcomeTo = isSandbox ? FOUNDER_NOTIFY_EMAIL : email;
  const welcomeSubject = isSandbox
    ? `[SANDBOX → ${email}] ${welcome.subject}`
    : welcome.subject;

  try {
    const sends = await Promise.all([
      resend.emails.send({
        from: EMAIL_FROM,
        to: welcomeTo,
        subject: welcomeSubject,
        html: welcome.html,
        text: welcome.text,
      }),
      resend.emails.send({
        from: EMAIL_FROM,
        to: FOUNDER_NOTIFY_EMAIL,
        replyTo: email,
        subject: alert.subject,
        html: alert.html,
        text: alert.text,
      }),
    ]);
    const sendErrors = sends.map((s) => s.error).filter(Boolean);
    if (sendErrors.length > 0) {
      console.error('[waitlist] email send returned error', sendErrors);
      return { ok: false, error: 'server' };
    }
  } catch (err) {
    console.error('[waitlist] email send threw', err);
    return { ok: false, error: 'server' };
  }

  return { ok: true, duplicate: false };
}
