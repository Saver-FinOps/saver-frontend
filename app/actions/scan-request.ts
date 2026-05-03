'use server';

import { headers } from 'next/headers';
import {
  resend,
  EMAIL_FROM,
  FOUNDER_NOTIFY_EMAIL,
  RESEND_AUDIENCE_ID,
} from '@/app/lib/email';
import {
  scanRequestUserEmail,
  scanRequestFounderAlert,
} from '@/app/lib/email-templates';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ScanRequestInput {
  email: string;
  company: string;
  role: string;
  spend: string;
  notes?: string;
  lang: 'en' | 'es';
  honeypot?: string;
}

export type ScanRequestResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; error: 'invalid' | 'server' };

export async function submitScanRequest(
  input: ScanRequestInput,
): Promise<ScanRequestResult> {
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { ok: true, duplicate: false };
  }

  const email = input.email.trim().toLowerCase();
  const company = input.company.trim();
  const role = input.role.trim();
  const spend = input.spend.trim();
  const notes = input.notes?.trim().slice(0, 1000);
  const lang: 'en' | 'es' = input.lang === 'es' ? 'es' : 'en';

  if (
    !EMAIL_RE.test(email) ||
    email.length > 254 ||
    company.length === 0 ||
    company.length > 120 ||
    role.length === 0 ||
    role.length > 80 ||
    spend.length === 0 ||
    spend.length > 80
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
        spend,
        intent: 'scan_request',
        source: 'scan_form',
        notes: notes ?? '',
      },
    });
    if (contactError) {
      const message = contactError.message.toLowerCase();
      duplicate =
        message.includes('already') || message.includes('duplicate');
      if (!duplicate) {
        console.error('[scan-request] audience.create failed', contactError);
        return { ok: false, error: 'server' };
      }
    }
  } catch (err) {
    console.error('[scan-request] audience.create threw', err);
    return { ok: false, error: 'server' };
  }

  if (duplicate) {
    return { ok: true, duplicate: true };
  }

  const userMail = scanRequestUserEmail({ lang, email, company, role, spend });
  const alert = scanRequestFounderAlert({
    lang,
    email,
    company,
    role,
    spend,
    notes,
    userAgent,
  });

  // Sandbox redirect: same pattern as waitlist — when EMAIL_FROM is the
  // Resend shared sandbox, redirect user-bound emails to the founder inbox
  // with a marker prefix so we can QA the template before domain verify.
  const isSandbox = EMAIL_FROM.includes('resend.dev');
  const userTo = isSandbox ? FOUNDER_NOTIFY_EMAIL : email;
  const userSubject = isSandbox
    ? `[SANDBOX → ${email}] ${userMail.subject}`
    : userMail.subject;

  try {
    const sends = await Promise.all([
      resend.emails.send({
        from: EMAIL_FROM,
        to: userTo,
        subject: userSubject,
        html: userMail.html,
        text: userMail.text,
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
      console.error('[scan-request] email send returned error', sendErrors);
      return { ok: false, error: 'server' };
    }
  } catch (err) {
    console.error('[scan-request] email send threw', err);
    return { ok: false, error: 'server' };
  }

  return { ok: true, duplicate: false };
}
