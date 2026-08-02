import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';

/**
 * TypeORM CLI data source used by the migration scripts in package.json:
 *
 *   npm run migration:create   -- src/database/migrations/<Name>
 *   npm run migration:generate -- src/database/migrations/<Name>
 *   npm run migration:run
 *   npm run migration:revert
 *   npm run migration:show
 *
 * It loads `.env` via dotenv and discovers every `*.entity.ts` in `src/`,
 * mirroring the entity registration in `app.module.ts`. The app itself is
 * configured in `app.module.ts` with `synchronize: false` + `migrationsRun:
 * false`; apply migrations explicitly with `npm run migration:run`.
 */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  migrationsTableName: 'migrations',
  // Use `gen_random_uuid()` (core since PostgreSQL 13) instead of the
  // `uuid-ossp` extension, so generated migrations run on Neon without
  // requiring `CREATE EXTENSION "uuid-ossp"`.
  uuidExtension: 'pgcrypto',
  synchronize: false,
  logging: false,
});
