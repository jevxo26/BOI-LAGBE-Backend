import { createHash } from 'crypto';
import type { EntityManager, EntityTarget, ObjectLiteral } from 'typeorm';

/**
 * Deterministic UUID v5-style ids derived from a stable key, so every seed row
 * gets the same id across reruns. Cross-domain FK references can then reuse
 * the exact same uid() key and always resolve to the same row — no id lookups
 * needed, and re-running the seed never duplicates rows.
 *
 * Example: uid('user:student-1')  ===  uid('user:student-1')
 */
export function uid(key: string): string {
  const hash = createHash('sha1').update(`boi-lagbe:${key}`).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50; // version 5
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.toString('hex');
  // SHA-1 yields 40 hex chars; a UUID needs 32 (16 bytes). Slicing to
  // 8-4-4-4-12 keeps the version/variant nibbles and produces valid v5 UUIDs.
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/** Date helper: now + n days (can be negative), at a fixed hour. */
export function daysFromNow(days: number, hour = 12): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

/** Date helper: first day of a month n months back. */
export function monthsAgo(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Current month (1-12) and year, used by monthly analytics seeds. */
export function monthYear(offset = 0): { month: number; year: number } {
  const d = new Date();
  d.setMonth(d.getMonth() - offset);
  return { month: d.getMonth() + 1, year: d.getFullYear() };
}

/** Strip undefined values so TypeORM insert never binds undefined columns. */
function clean(rows: ObjectLiteral[]): ObjectLiteral[] {
  return rows.map((r) =>
    Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)),
  );
}

/**
 * Idempotent bulk insert: `INSERT ... ON CONFLICT DO NOTHING`. Safe to re-run
 * any number of times — existing rows (matched on primary key, which is always
 * deterministic here) are skipped, new rows are added.
 *
 * Rows are typed as `ObjectLiteral` (not `DeepPartial<T>`) because seed rows
 * deliberately use string literals for enum columns (`status: 'ACTIVE'`) and
 * `Date`/ISO values that the entity's strict property types would reject.
 */
export async function seedRows<T extends ObjectLiteral>(
  manager: EntityManager,
  entity: EntityTarget<T>,
  rows: ObjectLiteral[],
  label: string,
): Promise<void> {
  if (rows.length === 0) return;
  const values = clean(rows);
  for (let i = 0; i < values.length; i += 100) {
    await manager
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(values.slice(i, i + 100) as never)
      .orIgnore()
      .execute();
  }
  console.log(`✔ ${label}: ${rows.length} row(s) seeded`);
}
