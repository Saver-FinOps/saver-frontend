const es = {
  // Nav
  nav_how: 'Cómo funciona',
  nav_why: 'Por qué Signal',
  nav_faq: 'FAQ',
  nav_cta: 'Unirme al waitlist',

  // Hero variant A (dashboard-first)
  heroA_badge: 'Acceso anticipado · Primeros 100 escaneos gratis',
  heroA_h1_line1: 'Dejá de pagar por',
  heroA_h1_line2: 'los servicios de AWS que',
  heroA_h1_highlight: 'olvidaste.',
  heroA_h1_line3: '(Nos pasó a todos.)',
  heroA_sub:
    'Conectá tu AWS en 2 minutos. Te listamos exactamente qué está quemando plata — cada ítem con su precio y un botón para borrarlo. Sin DevOps, sin reporte de 300 páginas.',

  // Hero variant B (counter-first)
  heroB_badge: 'En vivo · 47 startups como la tuya',
  heroB_h1_pre: 'Las startups quemaron esto',
  heroB_h1_post: 'en AWS que se olvidaron.',
  heroB_sub:
    '47 founders sangraron plata en cosas que levantaron “solo para probar” y nunca mataron. Este contador muestra lo que recuperaron el día que dejaron de pagar por fantasmas.',

  // Shared hero (tweaks panel labels)
  hero_a_variant: 'Headline: Lo que olvidaste',
  hero_b_variant: 'Headline: Contador en vivo',
  hero_a_variant_alt1: 'Tu factura de AWS se come tu runway.',
  hero_a_variant_alt2: 'El 30–40% de tu factura AWS que es desperdicio.',

  // Form
  form_email: 'Email de trabajo',
  form_company: 'Empresa',
  form_role: 'Tu rol',
  form_role_placeholder: 'Elegí tu rol',
  form_roles: [
    'Founder / CEO',
    'CTO / VP Engineering',
    'Dev (full-stack / backend)',
    'DevOps / SRE',
    'Ops / Finanzas',
    'Otro',
  ],
  form_submit: 'Unirme al waitlist',
  form_submit_loading: 'Guardando tu lugar…',
  form_trust: [
    'Sin tarjeta',
    'IAM solo lectura',
    'Revocás cuando quieras',
  ],
  form_or_scan: '¿Querés un escaneo ya? →',
  form_success_title: 'Estás dentro.',
  form_success_body:
    'Te mandamos confirmación a {email}. Cuando se libere tu cupo te llega el link al escaneo — normalmente 1 a 3 semanas. Revisá tu inbox (y Promociones por las dudas).',
  form_dup_title: 'Ya estás en la lista.',
  form_dup_body:
    'No hace falta registrarte de nuevo — tenemos {email} guardado. Te escribimos apenas se libere tu cupo.',
  form_secondary: 'Ver cómo es un escaneo →',
  form_error_invalid: 'Email, empresa y rol — fijate que los tres estén bien.',
  form_error_server: 'No pasó del lado nuestro. Probá de nuevo en un momento.',

  // Scan request page (Concierge MVP — Iván corre los scans manualmente)
  scan_eyebrow: 'Escaneo gratis',
  scan_h1: 'Quiero ver mi desperdicio AWS en dólares.',
  scan_sub:
    'IAM solo lectura. Resultados por email en 24-48h. Gratis para las primeras 100 cuentas. Sin tarjeta, sin llamadas de venta.',
  scan_form_email: 'Email de trabajo',
  scan_form_company: 'Empresa',
  scan_form_role: 'Tu rol',
  scan_form_role_placeholder: 'Elegí tu rol',
  scan_form_spend: 'Gasto mensual en AWS',
  scan_form_spend_placeholder: 'Elegí un rango',
  scan_form_spend_options: [
    'Menos de $1k / mes',
    '$1k–5k / mes',
    '$5k–15k / mes',
    '$15k–50k / mes',
    'Más de $50k / mes',
  ],
  scan_form_notes: '¿Algo más? (opcional)',
  scan_form_notes_placeholder:
    'Stack, regiones, qué te preocupa más de tu factura — lo que nos ayude a priorizar.',
  scan_form_submit: 'Pedir mi escaneo →',
  scan_form_submit_loading: 'Enviando…',
  scan_form_trust: ['Solo lectura IAM', 'Setup en 5 min', 'Hallazgos en castellano'],
  scan_success_title: 'Recibido. Escaneo en cola.',
  scan_success_body:
    'Te mandamos confirmación a {email}. En 24-48h te llega un email con el template CloudFormation de 12 líneas para darnos acceso solo lectura. Cuando respondas con el ARN del rol, corremos el escaneo y te mandamos los hallazgos.',
  scan_dup_title: 'Ya pediste un escaneo.',
  scan_dup_body:
    'Tenemos {email} en la lista. Revisá tu inbox (y Promociones) por nuestro email de setup. Si no llegó, escribinos y lo reenviamos.',
  scan_back_to_landing: 'Volver al inicio',

  // Logos strip
  proof_eyebrow: 'Hecho para founders como',

  // Features ("Por qué Signal")
  feat_eyebrow: 'Por qué Signal',
  feat_h2_pre: 'Otro dashboard no te va a arreglar la factura.',
  feat_h2_post: 'Una lista de qué borrar, sí.',
  feat_sub:
    'Nos salteamos el desglose de 300 líneas. Te damos una lista corta de qué está quemando plata — cada ítem con su número en dólares y un botón para borrarlo.',
  feat_1_t: 'Para founders, no para equipos de FinOps',
  feat_1_b:
    'Si podés leer "estás pagando $84/mes por este volumen que no usás", ya sabés usar Signal. Sin background en DevOps, sin diccionario de acrónimos.',
  feat_2_t: 'Escaneo en 2 minutos. Lista en pantalla.',
  feat_2_b:
    'Conectás un rol IAM solo lectura. Leemos Cost Explorer y CloudWatch. Tu primera lista aparece antes que termines el café.',
  feat_3_t: 'Borrás con un click. Sin romper nada.',
  feat_3_b:
    'Elegís qué se va — nosotros manejamos el orden seguro de borrado. Primero los snapshots, dependencias revisadas. Vos aprobás cada acción; nada pasa en background.',

  // How it works
  how_eyebrow: 'Cómo funciona',
  how_h2: 'Tres pasos. Unos cinco minutos.',
  how_1_t: 'Conectá tu cuenta AWS',
  how_1_b:
    'Un template de CloudFormation de 12 líneas, un rol IAM solo lectura, cero permisos de escritura. Lo revocás cuando quieras desde la consola de AWS.',
  how_2_t: 'Mirá tu desperdicio, en dólares',
  how_2_b:
    'Volúmenes EBS ociosos, IPs sin usar, RDS olvidadas, instancias sobredimensionadas. Cada uno con su precio mensual. Sin reporte de 300 páginas.',
  how_3_t: 'Borrá con un click',
  how_3_b:
    'Elegís qué se va. Nosotros manejamos el orden seguro de borrado — primero los snapshots, dependencias revisadas. Aprobás cada acción.',

  // Waste catalog
  catalog_eyebrow: 'Los sospechosos de siempre',
  catalog_h2: 'Lo que los founders olvidaron el mes pasado.',
  catalog_sub:
    'Hallazgos reales de cuentas beta — anonimizados, ponderados por dólares, ordenados por frecuencia.',
  catalog_col_waste: 'Qué se olvidaron',
  catalog_col_prevalence: 'Aparece en',
  catalog_col_median: 'Mediana $/mes recuperados',
  catalog_rows: [
    { aws: 'CloudWatch', name: 'Retención de logs eterna', prevalence: 86, median: 180 },
    { aws: 'EBS', name: 'Volúmenes ociosos de tests viejos', prevalence: 78, median: 340 },
    { aws: 'RDS', name: 'Instancias sobredimensionadas', prevalence: 64, median: 620 },
    { aws: 'EC2', name: 'Elastic IPs sin usar', prevalence: 53, median: 90 },
    { aws: 'VPC', name: 'NAT gateways olvidados', prevalence: 41, median: 310 },
    { aws: 'EC2', name: 'Instancias detenidas con EBS', prevalence: 38, median: 220 },
  ],
  catalog_footnote: 'Muestra de {n} cuentas beta · Q1 2026',
  catalog_n: '47',

  // Testimonials
  quotes_eyebrow: 'Desde la beta',
  quotes_h2:
    'Founders que corrieron un escaneo y se arrepintieron de no hacerlo antes.',

  // Final CTA
  fcta_h2_pre: 'Encontrá el',
  fcta_h2_highlight: '30–40%',
  fcta_h2_post: 'que estás desperdiciando. Antes del lunes.',
  fcta_sub:
    'Las primeras 100 cuentas del waitlist tienen escaneo completo gratis. IAM solo lectura, 5 minutos para conectar, número en dólares al lado de cada hallazgo. Uses Signal después o no, vas a saber exactamente dónde se te escapa la factura.',
  fcta_primary: 'Escanear mi AWS gratis →',
  fcta_secondary: 'Ver un escaneo de muestra',

  // FAQ
  faq_eyebrow: 'FAQ',
  faq_h2: 'Lo que estás por preguntarte.',

  // Footer
  foot_tagline: 'Dejá de pagar por AWS que te olvidaste.',
  foot_nav: ['Privacidad', 'Seguridad', 'Contacto'],
  foot_copy: '© 2026 Signal. Sin afiliación con Amazon Web Services.',

  // Modal (sample scan)
  modal_title: 'Lo que encuentra un escaneo',
  modal_subtitle: 'Cuenta beta real · factura de $8.400/mes · anonimizada',
  modal_close: 'Cerrar',
  modal_totals: 'Desperdicio encontrado',
  modal_of_bill: 'De la factura total',
  modal_effort: 'Tiempo de limpieza',
  modal_get_mine: 'Escanear el mío gratis →',
  modal_cta_helper: 'Primer escaneo gratis · IAM solo lectura · 5 min para conectar',

  // Shared — per-month suffix (used by Hero dashboard + sample modal)
  per_month_suffix: '/mes',

  // Modal (sample scan) — summary card details
  modal_annualized_suffix: 'al año',
  modal_of_bill_pct: '30',
  modal_of_bill_context: 'Sobre $8.400/mes',
  modal_effort_value: '~2h',
  modal_effort_context: 'Revisar + 1 click por ítem',

  // Modal (sample scan) — findings table
  modal_col_aws: 'AWS',
  modal_col_resource: 'Recurso',
  modal_col_finding: 'Lo que encontramos',
  modal_col_effort: 'Esfuerzo',
  modal_col_savings: 'Recupera $/mes',
  modal_effort_labels: {
    trivial: 'Trivial',
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
  },
  modal_findings: [
    {
      cat: 'RDS',
      res: 'analytics-db-staging',
      detail: 'Base de staging prendida · 4% CPU promedio',
      context: 'db.m5.2xlarge · 94d desde la última query',
      save: 920,
      effort: 'low',
    },
    {
      cat: 'EBS',
      res: '8 volúmenes ociosos',
      detail: 'De un test del trimestre pasado · ninguno asociado',
      context: 'us-east-1 · gp2 · 120d ociosos promedio',
      save: 840,
      effort: 'trivial',
    },
    {
      cat: 'VPC',
      res: 'NAT gateway',
      detail: 'Cero tráfico hace 31 días · se puede matar',
      context: 'us-west-2 · sobró de un test de carga',
      save: 480,
      effort: 'low',
    },
    {
      cat: 'Logs',
      res: '14 grupos de logs',
      detail: 'Retención sin caducidad · se arregla de un click',
      context: 'CloudWatch · retención=∞',
      save: 273,
      effort: 'trivial',
    },
  ],

  // Hero — headline variant alt1 ("se come tu runway")
  heroA_alt1_pre: 'Tu factura de AWS se está comiendo ',
  heroA_alt1_highlight: 'tu runway.',

  // Hero — headline variant alt2 ("30–40% desperdicio")
  heroA_alt2_pre: 'El ',
  heroA_alt2_highlight: '30–40%',
  heroA_alt2_post: ' de tu factura AWS que estás desperdiciando ahora.',

  // Hero — inline form (big layout)
  hero_form_big_title: 'Escanear gratis',
  hero_form_big_sub: '3 campos. Sin follow-up de ventas.',

  // Hero — dashboard mock
  hero_dash_potential: 'Ahorro potencial',
  hero_dash_of_bill: 'de la factura',
  hero_dash_item_ebs: 'Volúmenes EBS ociosos',
  hero_dash_item_rds: 'RDS sobredimensionada',
  hero_dash_item_nat: 'NAT gateways olvidados',
  hero_dash_item_logs: 'Retención de logs CloudWatch',
  hero_dash_logs_suffix: 'grupos de logs',

  // Hero — live waste counter
  hero_counter_live: 'EN VIVO · 47 cuentas',
  hero_counter_period: 'últimos 90 días',
  hero_counter_label: 'Desperdicio encontrado en tiempo real',
  hero_counter_sub: 'olvidado por startups beta el último trimestre',

  // Hero — streaming log
  hero_stream_lines: [
    '[10:42:03] acct_a7f3 · 3 EBS ociosos (−$124/mes)',
    '[10:42:04] acct_9c21 · NAT gateway en us-west-2 sin uso 31d (−$82/mes)',
    '[10:42:06] acct_f0e8 · RDS db.m5.4xl @ 4% CPU (−$410/mes)',
    '[10:42:08] acct_a7f3 · retención eterna CloudWatch (−$67/mes)',
    '[10:42:09] acct_3b0c · 12 EIPs sin asociar (−$43/mes)',
    '[10:42:12] acct_d71f · RDS de staging olvidada, 62d ociosa (−$289/mes)',
  ],

  // SEO metadata
  meta_title: 'Signal — Dejá de pagar por AWS que te olvidaste',
  meta_description:
    'Conectá tu cuenta AWS, mirá exactamente en qué estás desperdiciando plata, y borralo con un click. Para founders, no para equipos de FinOps. Escaneo gratis para las primeras 100 cuentas del waitlist.',

  // OpenGraph / Twitter
  og_title: 'Dejá de pagar por AWS que te olvidaste',
  og_description:
    'Conectá en 2 minutos. Mirá tu desperdicio en dólares. Borrá con un click. Para founders.',
} as const;

export const faq = [
  {
    q: '¿Es seguro darles acceso a mi AWS?',
    a: 'Arrancamos solo lectura — vemos tus recursos, no podemos tocarlos. Revocás el rol IAM cuando quieras desde la consola de AWS. Los borrados pasan solo cuando clickeás vos; nada corre en background. La policy IAM completa está publicada en nuestra página de seguridad.',
  },
  {
    q: '¿Y si borro algo que después necesitaba?',
    a: 'Snapshot primero cuando aplica (EBS, RDS), soft-delete de 7 días en el resto, undo total desde tu dashboard. Además chequeamos dependencias antes de cada borrado — si un volumen está adjunto o una RDS tiene conexiones activas, te lo marcamos en vez de ejecutar.',
  },
  {
    q: 'Tengo una factura chica. ¿Vale la pena?',
    a: 'La data de la industria (Flexera, CNCF FinOps) dice que el 30–40% del gasto cloud es desperdicio. En una factura de $2k/mes son ~$7k al año. El primer escaneo es gratis — averigualo antes de decidir. Si no encontramos al menos $200/mes de desperdicio, te lo decimos directo.',
  },
  {
    q: '¿Cuánto tardo en ver ahorros?',
    a: 'El escaneo termina en menos de 5 minutos. La lista aparece con los montos en dólares y un botón para borrar al lado de cada ítem. La mayoría de founders beta limpiaron el 60-80% del desperdicio en una sola sentada — menos de 30 minutos.',
  },
  {
    q: '¿Cuánto cuesta después del waitlist?',
    a: 'Plan estándar: 15% de lo que ahorrás, facturado mensual. Los del waitlist se aseguran 10% el primer año. Sin costo upfront — si no encontramos nada, no pagás nada. Tope anual para no facturarte de por vida un fix de una sola vez.',
  },
  {
    q: '¿Soportan Terraform / IaC?',
    a: 'Sí. Si tu infra está en Terraform, generamos un PR con los cambios de limpieza — vos revisás y mergeás en tu flow normal. CDK y Pulumi están en el roadmap; contanos en el form si alguno es bloqueante.',
  },
  {
    q: '¿Y GCP o Azure?',
    a: 'Primero AWS. GCP es lo próximo en el roadmap según demanda del waitlist. Si sos multi-cloud, contanos en el form.',
  },
  {
    q: '¿Por qué confiar en una herramienta nueva con mi AWS?',
    a: 'La misma razón por la que confiás en cualquier rol IAM solo lectura — el acceso está acotado, es auditable en CloudTrail, y lo revocás en 10 segundos. Usamos AssumeRole con tokens temporales (sin credenciales de larga vida), publicamos la policy IAM completa, y estamos en auditoría SOC 2 Type II ahora mismo.',
  },
] as const;

export default es;
