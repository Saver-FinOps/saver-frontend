import 'server-only';

type Lang = 'en' | 'es';

interface WelcomeArgs {
  lang: Lang;
  email: string;
  company: string;
  role: string;
}

interface FounderAlertArgs {
  email: string;
  company: string;
  role: string;
  lang: Lang;
  userAgent?: string;
}

const wrap = (inner: string) => `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;padding:40px;">
            ${inner}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export function welcomeEmail({ lang, email, company, role }: WelcomeArgs) {
  const isEs = lang === 'es';

  const subject = isEs
    ? `Estás dentro · Signal`
    : `You're in · Signal`;

  const heading = isEs ? 'Estás dentro.' : "You're in.";

  const body = isEs
    ? `<p style="font-size:16px;line-height:1.55;margin:0 0 16px;color:#334155;">Soy Iván, hice Signal. Gracias por sumarte — te confirmo lo que dejaste:</p>
       <ul style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 24px;padding-left:20px;">
         <li><strong>${email}</strong></li>
         <li>${company} · ${role}</li>
       </ul>
       <p style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 16px;"><strong>Qué pasa ahora:</strong> abrimos cupos por cohort. Cuando te toque te llega un mail con un link y un sample report basado en tu rango de gasto AWS. Esperá entre 1 y 3 semanas, depende del orden de la lista.</p>
       <p style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 16px;"><strong>Lo que ganás por estar en el waitlist:</strong> el primer escaneo gratis (sin límite) y el primer año a 10% en vez del 15% estándar. Es un trato bastante mejor que pagar Cost Explorer por noches enteras.</p>
       <p style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 16px;"><strong>Mientras tanto:</strong> si querés, abrí Cost Explorer y filtrá por <em>UnusedAmount &gt; $0</em>. Vas a ver al menos 2-3 cosas que estás pagando sin querer. Es la versión sin Signal del juego.</p>
       <p style="font-size:15px;line-height:1.6;color:#334155;margin:0;">¿Dudas? Respondé este mail. Lo leo yo, no un sistema.</p>
       <p style="font-size:15px;line-height:1.55;color:#334155;margin:24px 0 0;">— Iván<br/><span style="color:#94a3b8;font-size:13px;">Signal · Buenos Aires</span></p>`
    : `<p style="font-size:16px;line-height:1.55;margin:0 0 16px;color:#334155;">I'm Iván, I built Signal. Thanks for joining — here's what you signed up with:</p>
       <ul style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 24px;padding-left:20px;">
         <li><strong>${email}</strong></li>
         <li>${company} · ${role}</li>
       </ul>
       <p style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 16px;"><strong>What happens next:</strong> we open spots in cohorts. When yours opens you'll get an email with a link and a sample report based on your AWS spend range. Expect 1-3 weeks depending on your place in line.</p>
       <p style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 16px;"><strong>What you get for waiting:</strong> first scan free (no limit) and year one at 10% instead of the standard 15%. Beats paying Cost Explorer overtime.</p>
       <p style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 16px;"><strong>While you wait:</strong> open Cost Explorer and filter for <em>UnusedAmount &gt; $0</em>. You'll find at least 2-3 things you didn't know you were paying for. Call it the Signal-free version of the game.</p>
       <p style="font-size:15px;line-height:1.6;color:#334155;margin:0;">Questions? Reply to this email. A human reads it (me).</p>
       <p style="font-size:15px;line-height:1.55;color:#334155;margin:24px 0 0;">— Iván<br/><span style="color:#94a3b8;font-size:13px;">Signal · Buenos Aires</span></p>`;

  const html = wrap(`
    <tr>
      <td>
        <div style="font-size:28px;font-weight:800;background:linear-gradient(45deg,#3b82f6,#10b981);-webkit-background-clip:text;background-clip:text;color:transparent;margin:0 0 8px;">Signal</div>
        <h1 style="font-size:24px;font-weight:700;color:#0f172a;margin:0 0 24px;">${heading}</h1>
        ${body}
      </td>
    </tr>
  `);

  const text = isEs
    ? `${heading}\n\nSoy Iván, hice Signal. Gracias por sumarte — te confirmo lo que dejaste:\n\n- ${email}\n- ${company} · ${role}\n\nQué pasa ahora: abrimos cupos por cohort. Cuando te toque te llega un mail con un link y un sample report. Esperá entre 1 y 3 semanas.\n\nLo que ganás por estar en el waitlist: primer escaneo gratis y primer año a 10% (en vez del 15%).\n\nMientras tanto, abrí Cost Explorer y filtrá por UnusedAmount > $0. Vas a ver al menos 2-3 cosas que estás pagando sin querer.\n\n¿Dudas? Respondé este mail. Lo leo yo.\n\n— Iván\nSignal · Buenos Aires`
    : `${heading}\n\nI'm Iván, I built Signal. Thanks for joining — here's what you signed up with:\n\n- ${email}\n- ${company} · ${role}\n\nWhat happens next: we open spots in cohorts. When yours opens you'll get an email with a link and a sample report. Expect 1-3 weeks.\n\nWhat you get for waiting: first scan free and year one at 10% (instead of 15%).\n\nWhile you wait, open Cost Explorer and filter for UnusedAmount > $0. You'll find at least 2-3 things you didn't know you were paying for.\n\nQuestions? Reply to this email. A human reads it (me).\n\n— Iván\nSignal · Buenos Aires`;

  return { subject, html, text };
}

export function founderAlertEmail({
  email,
  company,
  role,
  lang,
  userAgent,
}: FounderAlertArgs) {
  const subject = `[Signal] New waitlist signup: ${email}`;

  const html = wrap(`
    <tr>
      <td>
        <h1 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 16px;">New waitlist signup</h1>
        <table cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.6;color:#334155;">
          <tr><td style="padding:4px 16px 4px 0;color:#64748b;">Email</td><td><strong>${email}</strong></td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#64748b;">Company</td><td>${company}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#64748b;">Role</td><td>${role}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#64748b;">Lang</td><td>${lang}</td></tr>
          ${userAgent ? `<tr><td style="padding:4px 16px 4px 0;color:#64748b;vertical-align:top;">UA</td><td style="font-family:ui-monospace,monospace;font-size:12px;">${userAgent}</td></tr>` : ''}
        </table>
      </td>
    </tr>
  `);

  const text = `New waitlist signup\n\nEmail: ${email}\nCompany: ${company}\nRole: ${role}\nLang: ${lang}${userAgent ? `\nUA: ${userAgent}` : ''}`;

  return { subject, html, text };
}
