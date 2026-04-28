'use client';

import { track } from '@/app/lib/analytics';

export function ContactEmailLink({
  email,
  channel,
}: {
  email: string;
  channel: string;
}) {
  return (
    <a
      href={`mailto:${email}`}
      onClick={() => track('contact_email_click', { channel, email })}
      className="text-sm font-semibold text-blue-600 no-underline hover:underline"
    >
      {email}
    </a>
  );
}
