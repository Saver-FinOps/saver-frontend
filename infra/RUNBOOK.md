# Concierge runbook — qué hacer cuando llega un scan request

Este doc es solo para vos (Iván). Cada vez que recibís un email
`[Signal] 🔥 SCAN REQUEST: ...` en `signalfinops@gmail.com`, seguí estos pasos.

---

## Paso 0 — Lo que tiene que estar listo (one-time setup)

✅ **Done — Signal AWS account ID:** `754371202058`

Ya está hardcodeado en los email templates de `infra/email-templates/`. No hace falta pegarlo en cada email — el único valor variable por lead es el `ExternalId`.

Si en el futuro Signal usa otra cuenta AWS:
- Buscar y reemplazar `754371202058` en los archivos de `infra/email-templates/` y en este runbook
- O migrar a un archivo de config (ej. `infra/config.json`) y referenciarlo desde un script generador de emails

---

## Paso 1 — Lead requests scan

Te llega un mail tipo:

```
[Signal] 🔥 SCAN REQUEST: ivan@acme.com · $1k–5k / month
```

Con datos del lead (email, company, role, spend range, notes).

---

## Paso 2 — Generar External ID único para este lead

Abrí terminal y corré:

```bash
uuidgen
# 4F8A12C3-7B2E-4D5F-9C8A-1234567890AB
```

O si querés algo más amistoso visualmente:

```bash
openssl rand -hex 16
# a3f5b7c9d1e3f5a7b9c1d3e5f7a9b1c3
```

Cualquiera funciona. **Anotá este External ID asociado al email del lead** (en una nota, en la propiedad de Resend Audience, o en un Google Sheet — donde sea que vayas a llevar el tracking de leads).

---

## Paso 3 — Mandar email al lead

1. Abrí `infra/email-templates/scan-setup-en.md` (o `-es.md` según el `lang` del lead que viene en el alert)
2. Reemplazá los placeholders restantes:
   - `{{LEAD_EMAIL}}` → email del lead
   - `{{LEAD_FIRST_NAME_OR_COMPANY}}` → empresa o nombre (si tenés)
   - `{{EXTERNAL_ID}}` → el UUID que generaste en paso 2
   - (`{{SIGNAL_ACCOUNT_ID}}` ya está hardcoded a `754371202058`)
3. Adjuntá `infra/cfn/signal-readonly-role.yaml`
4. Mandá desde Gmail a `lead.email`

**Tiempo estimado:** 5 minutos por lead.

---

## Paso 4 — Esperar respuesta

El lead te va a responder con el **Role ARN**, algo así:

```
arn:aws:iam::123456789012:role/SignalReadOnlyRole
```

Si después de 3-5 días no responde, mandá un follow-up corto: "Hey, ¿pudiste deployar el template? Cualquier duda te ayudo."

---

## Paso 5 — Correr el scan

**(Pendiente — Fase 2 del MVP.)**

Cuando esté el script de scan listo:

```bash
node scripts/scan/run.ts \
  --role-arn "arn:aws:iam::CLIENT_ACCOUNT:role/SignalReadOnlyRole" \
  --external-id "4F8A12C3-..." \
  --output report.json
```

El script va a:
1. AssumeRole a la cuenta del cliente con el External ID
2. Escanear EC2 / EBS / RDS / CloudWatch / Cost Explorer
3. Detectar patrones de waste
4. Output JSON con findings ordenados por $/mes ahorrado

---

## Paso 6 — Mandar reporte al lead

**(Pendiente — Fase 3 del MVP.)**

Cuando el template HTML esté listo:

1. Tomar el JSON de findings
2. Renderizar con el template (`scripts/scan/render-report.ts`)
3. Pegar el HTML en Gmail
4. Mandar al lead con subject "Tu escaneo Signal · {{N}} hallazgos · {{TOTAL}}/mes"

---

## Paso 7 — Cleanup

Después de mandar el reporte:

- [ ] Marcar el lead en Resend como "scan_completed" (custom property)
- [ ] Si el cliente quiere borrar el rol: recordales el comando `aws cloudformation delete-stack --stack-name signal-readonly-role`
- [ ] Apuntar el resultado en un Google Sheet de tracking (lead → external_id → scan_date → total_savings → outcome)

Esto te va a dar la data de "conversion to paying customer" cuando llegue el momento de monetizar.

---

## Tracking sugerido (Google Sheet)

| Date | Lead email | Company | Spend range | External ID | Status | Total savings found | Notes |
|---|---|---|---|---|---|---|---|
| 2026-04-28 | ivan@acme.com | Acme Inc | $1k-5k | 4F8A12C3-... | pending_arn | — | — |

5 columnas que importan al principio. Después escalás a CRM real (Notion, Airtable, HubSpot) cuando tengas >20 leads activos.
