export type WaitlistLocale = 'en' | 'es';

export const WAITLIST_CONFIRMATION_VARS = ['first_name', 'signal_url'] as const;
export type WaitlistConfirmationVar = (typeof WAITLIST_CONFIRMATION_VARS)[number];

export interface WaitlistConfirmationTemplate {
  readonly subjects: readonly [string, string, string];
  readonly fromName: string;
  readonly fromTitle: string;
  readonly body: {
    readonly greeting: string;
    readonly opening: string;
    readonly whatNext: {
      readonly title: string;
      readonly bullets: readonly string[];
    };
    readonly whyBuilding: {
      readonly title: string;
      readonly story: string;
    };
    readonly connection: string;
    readonly closing: string;
    readonly signature: string;
    readonly ps: string;
  };
}

const en: WaitlistConfirmationTemplate = {
  subjects: [
    "You're on the list → Signal launches in the next few weeks",
    'Thanks for joining → Your free AWS scan is coming',
    'Welcome to Signal → Stop paying for AWS you forgot about',
  ],
  fromName: 'Ivan',
  fromTitle: 'Signal founder',
  body: {
    greeting: 'Hey {{first_name}},',
    opening:
      "You're officially on the Signal waitlist. Thanks for trusting me with this.",
    whatNext: {
      title: 'What happens next:',
      bullets: [
        "I'll email you the moment Signal is ready — in the next few weeks.",
        "You'll get first access to the free AWS waste scanner (first 100 waitlist accounts).",
        'No spam, no weekly "updates" — just the launch notification.',
      ],
    },
    whyBuilding: {
      title: "Why I'm building this:",
      story: [
        'Last month I got my AWS bill: $347. For a side project making $0.',
        'Turns out I was paying for 8 EBS volumes I created during testing, 3 Elastic IP addresses from old experiments, and 1 RDS database I spun up months ago and completely forgot about.',
        'It took me 6 hours across two weekends to find everything, understand what was safe to delete, and figure out how to do it without breaking anything.',
        'I saved $280/month immediately.',
      ].join('\n\n'),
    },
    connection:
      "**You probably have the same problem.** Industry research (Flexera, CNCF FinOps) puts cloud waste at 30–40% of spend. Signal will find it in 2 minutes instead of 6 hours.",
    closing:
      "I'll keep you posted on progress. In the meantime, feel free to reply with any AWS horror stories — I'm collecting them for motivation.",
    signature: 'Building in the open,\nIvan',
    ps: 'P.S. If you know other founders dealing with surprise AWS bills, feel free to forward this. The waitlist is at {{signal_url}}',
  },
};

const es: WaitlistConfirmationTemplate = {
  subjects: [
    'Ya estás en la lista → Signal se lanza en las próximas semanas',
    'Gracias por sumarte → Tu escaneo gratis de AWS viene en camino',
    'Bienvenido a Signal → Dejá de pagar por AWS que te olvidaste',
  ],
  fromName: 'Ivan',
  fromTitle: 'fundador de Signal',
  body: {
    greeting: 'Hola {{first_name}},',
    opening:
      'Ya estás oficialmente en la lista de espera de Signal. Gracias por confiar en mí con esto.',
    whatNext: {
      title: 'Qué pasa ahora:',
      bullets: [
        'Te voy a mandar un email el momento que Signal esté listo — en las próximas semanas.',
        'Vas a tener acceso prioritario al scanner gratuito de desperdicio de AWS (primeras 100 cuentas del waitlist).',
        'Sin spam, sin "updates" semanales — solo la notificación de lanzamiento.',
      ],
    },
    whyBuilding: {
      title: 'Por qué estoy construyendo esto:',
      story: [
        'El mes pasado me llegó la factura de AWS: $347. Para un side project que no generaba un peso.',
        'Resulta que estaba pagando por 8 volúmenes EBS que había creado durante testing, 3 direcciones IP elásticas de experimentos viejos, y 1 base de datos RDS que había levantado hace meses y me olvidé completamente.',
        'Me llevó 6 horas a lo largo de dos fines de semana encontrar todo, entender qué era seguro borrar, y descifrar cómo hacerlo sin romper nada.',
        'Ahorré $280/mes inmediatamente.',
      ].join('\n\n'),
    },
    connection:
      '**Vos probablemente tenés el mismo problema.** Los estudios de la industria (Flexera, CNCF FinOps) dicen que el 30–40% del gasto cloud es desperdicio. Signal lo va a encontrar en 2 minutos, no en 6 horas.',
    closing:
      'Te voy a mantener al tanto del progreso. Mientras tanto, sentite libre de responder con cualquier historia de terror de AWS — las estoy coleccionando para motivación.',
    signature: 'Construyendo en público,\nIvan',
    ps: 'P.D. Si conocés otros founders lidiando con facturas sorpresa de AWS, mandales este email. La lista de espera está en {{signal_url}}',
  },
};

export const waitlistConfirmationEmails: Record<
  WaitlistLocale,
  WaitlistConfirmationTemplate
> = { en, es };
