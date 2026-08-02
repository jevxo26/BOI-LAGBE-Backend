/* One-off helper: dumps the live DB schema to schema-dump.txt for seed planning.
 * NOT part of the seed runtime. Run: node src/database/seeds/schema-dump.cjs
 */
require('dotenv').config();
const { Client } = require('pg');

(async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();

  // 1) All tables + columns in one query
  const cols = await client.query(
    `SELECT c.table_name, c.column_name, c.data_type, c.is_nullable, c.column_default, c.udt_name
     FROM information_schema.columns c
     JOIN information_schema.tables t
       ON t.table_schema = c.table_schema AND t.table_name = c.table_name
     WHERE c.table_schema = 'public' AND t.table_type = 'BASE TABLE'
     ORDER BY c.table_name, c.ordinal_position`,
  );

  // 2) All FKs in one query
  const fks = await client.query(
    `SELECT tc.table_name, kcu.column_name, ccu.table_name AS ref_table, ccu.column_name AS ref_col
     FROM information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu
       ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
     JOIN information_schema.constraint_column_usage ccu
       ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
     WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'`,
  );

  // 3) All enums in one query
  const enums = await client.query(
    `SELECT t.typname, e.enumlabel
     FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid
     ORDER BY t.typname, e.enumsortorder`,
  );

  const byTable = new Map();
  for (const c of cols.rows) {
    if (!byTable.has(c.table_name)) byTable.set(c.table_name, { cols: [], fks: [], enums: new Map() });
    byTable.get(c.table_name).cols.push(c);
  }
  for (const f of fks.rows) {
    if (byTable.has(f.table_name)) byTable.get(f.table_name).fks.push(f);
  }
  for (const e of enums.rows) {
    if (byTable.has(e.typname)) continue; // enums map by column udt_name instead
  }

  const out = [];
  for (const [table, data] of [...byTable.entries()].sort()) {
    out.push(`\n### ${table}`);
    for (const c of data.cols) {
      const required = c.is_nullable === 'NO' && !c.column_default ? ' REQUIRED' : '';
      out.push(
        `  ${c.column_name} | ${c.data_type}${c.udt_name !== c.data_type ? `(${c.udt_name})` : ''}${required}${c.column_default ? ` def=${c.column_default}` : ''}`,
      );
    }
    if (data.fks.length) {
      out.push(
        `  -- FK: ${data.fks.map((f) => `${f.column_name} -> ${f.ref_table}.${f.ref_col}`).join(', ')}`,
      );
    }
  }

  // Enum values per column (map udt_name -> labels)
  const enumByType = new Map();
  for (const e of enums.rows) {
    if (!enumByType.has(e.typname)) enumByType.set(e.typname, []);
    enumByType.get(e.typname).push(e.enumlabel);
  }
  const enumCols = new Map(); // "table.column" -> typname
  for (const c of cols.rows) {
    if (c.data_type === 'USER-DEFINED') enumCols.set(`${c.table_name}.${c.column_name}`, c.udt_name);
  }
  const enumLines = [];
  for (const [key, typ] of enumCols) {
    enumLines.push(`  ${key} ENUM(${typ}): ${enumByType.get(typ)?.join(' | ') || '?'}`);
  }
  if (enumLines.length) {
    out.push('\n## ENUM COLUMNS');
    out.push(...enumLines.sort());
  }

  require('fs').writeFileSync('schema-dump.txt', out.join('\n'));
  console.log(`Wrote schema-dump.txt with ${byTable.size} tables`);
  await client.end();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
