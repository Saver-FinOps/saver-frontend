/**
 * Resend audience-properties setup — one-time, idempotent.
 *
 * Resend exige que cada property usada en `contacts.create({ properties: ... })`
 * esté registrada antes a nivel workspace. Este script crea las que faltan
 * y deja las existentes como están.
 *
 * Usage:
 *   npm run email:setup-properties
 *
 * Requires RESEND_API_KEY en .env.local (la cargamos via tsx --env-file).
 */

import { Resend } from 'resend';
import type { CreateContactPropertyOptions } from 'resend';

// Union of properties used in app/actions/{waitlist,scan-request}.ts
const PROPERTIES: CreateContactPropertyOptions[] = [
  { key: 'company', type: 'string' },
  { key: 'role', type: 'string' },
  { key: 'lang', type: 'string' },
  { key: 'source', type: 'string' },
  { key: 'spend', type: 'string', fallbackValue: '' },
  { key: 'intent', type: 'string', fallbackValue: '' },
  { key: 'notes', type: 'string', fallbackValue: '' },
];

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('✗ RESEND_API_KEY no está seteado. Cargá .env.local y reintenta.');
    process.exit(1);
  }

  const resend = new Resend(apiKey);

  const { data: list, error: listError } = await resend.contactProperties.list();
  if (listError) {
    console.error('✗ list properties failed:', listError);
    process.exit(1);
  }

  const existingKeys = new Set((list?.data ?? []).map((p) => p.key));
  console.log(`Existentes (${existingKeys.size}): ${[...existingKeys].join(', ') || '(ninguna)'}`);
  console.log('');

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const prop of PROPERTIES) {
    if (existingKeys.has(prop.key)) {
      console.log(`✓ ${prop.key} ya existe`);
      skipped++;
      continue;
    }
    const { data, error } = await resend.contactProperties.create(prop);
    if (error) {
      console.error(`✗ ${prop.key} falló:`, error);
      failed++;
      continue;
    }
    console.log(`+ ${prop.key} creada (id=${data?.id})`);
    created++;
  }

  console.log('');
  console.log(`Resumen: ${created} creadas, ${skipped} ya existían, ${failed} fallaron`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
