'use client';

import { useEffect, useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { Button, Input, Select } from '../(landing)/components/ui';
import type { Dictionary } from '../dictionaries';
import { submitScanRequest } from '@/app/actions/scan-request';
import { track, identify } from '@/app/lib/analytics';

type T = Dictionary['t'];

export default function ScanForm({ lang, t }: { lang: string; t: T }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [spend, setSpend] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formState, setFormState] = useState<
    'idle' | 'loading' | 'success' | 'duplicate'
  >('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    track('scan_request_view', { lang });
  }, [lang]);

  const submit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    track('scan_request_submit', { lang, spend });

    if (!email.includes('@') || !company || !role || !spend) {
      setErrorMsg(t.form_error_invalid);
      track('scan_request_error', { reason: 'client_validation' });
      return;
    }

    setFormState('loading');
    try {
      const result = await submitScanRequest({
        email,
        company,
        role,
        spend,
        notes: notes || undefined,
        lang: lang === 'es' ? 'es' : 'en',
        honeypot,
      });

      if (result.ok) {
        identify(email, { company, role, lang, spend, intent: 'scan_request' });
        if (result.duplicate) {
          track('scan_request_duplicate', { lang, spend });
          setFormState('duplicate');
        } else {
          track('scan_request_success', { lang, role, spend });
          setFormState('success');
        }
        return;
      }

      track('scan_request_error', { reason: result.error });
      setFormState('idle');
      setErrorMsg(
        result.error === 'invalid' ? t.form_error_invalid : t.form_error_server,
      );
    } catch {
      track('scan_request_error', { reason: 'exception' });
      setFormState('idle');
      setErrorMsg(t.form_error_server);
    }
  };

  if (formState === 'success' || formState === 'duplicate') {
    const isDup = formState === 'duplicate';
    const title = isDup ? t.scan_dup_title : t.scan_success_title;
    const body = (isDup ? t.scan_dup_body : t.scan_success_body).replace(
      '{email}',
      email,
    );
    return (
      <div
        className={`p-8 rounded-2xl border ${
          isDup ? 'border-blue-400' : 'border-emerald-500'
        }`}
        style={{
          background: isDup
            ? 'linear-gradient(135deg,#eff6ff 0%,#ffffff 100%)'
            : 'linear-gradient(135deg,#ecfdf5 0%,#ffffff 100%)',
          boxShadow: isDup
            ? '0 10px 24px -6px rgb(59 130 246 / 0.20)'
            : '0 10px 24px -6px rgb(16 185 129 / 0.25)',
        }}
      >
        <div
          className={`font-display text-2xl font-semibold mb-3 leading-[1.1] tracking-[-0.02em] ${
            isDup ? 'text-blue-700' : 'text-green-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Check className="w-6 h-6" /> {title}
          </span>
        </div>
        <div
          className={`text-[15px] leading-relaxed ${
            isDup ? 'text-blue-900' : 'text-emerald-800'
          }`}
        >
          {body}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 bg-white p-7 rounded-[20px] border border-slate-200"
      style={{ boxShadow: '0 20px 50px -12px rgb(16 24 40 / 0.10)' }}
    >
      <Input
        label={t.scan_form_email}
        type="email"
        value={email}
        onChange={setEmail}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input label={t.scan_form_company} value={company} onChange={setCompany} />
        <Select
          label={t.scan_form_role}
          value={role}
          onChange={setRole}
          options={t.form_roles}
          placeholder={t.scan_form_role_placeholder}
        />
      </div>

      <Select
        label={t.scan_form_spend}
        value={spend}
        onChange={setSpend}
        options={t.scan_form_spend_options}
        placeholder={t.scan_form_spend_placeholder}
      />

      <div>
        <label className="block text-xs font-semibold text-fg-secondary mb-[5px]">
          {t.scan_form_notes}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t.scan_form_notes_placeholder}
          rows={3}
          maxLength={1000}
          className="w-full px-3.5 py-2.5 text-sm font-body rounded-[10px] border border-slate-200 bg-white text-fg outline-none transition-colors duration-150 box-border focus:border-blue-500 resize-none"
        />
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {errorMsg && (
        <div
          role="alert"
          className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2"
        >
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        variant="primary"
        fullWidth
        disabled={formState === 'loading'}
      >
        {formState === 'loading' ? t.scan_form_submit_loading : t.scan_form_submit}
      </Button>

      <div className="flex gap-4 flex-wrap text-[13px] text-slate-500 mt-1">
        {t.scan_form_trust.map((badge) => (
          <span key={badge} className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            {badge}
          </span>
        ))}
      </div>
    </form>
  );
}
