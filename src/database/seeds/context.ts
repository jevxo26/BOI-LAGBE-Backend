import { EntityManager } from 'typeorm';
import { Role } from '../../admin/rbac/entities';

/**
 * Shared, runtime-resolved ids that the domain seeders need but cannot derive
 * from `uid()` alone (the bootstrap role/module rows were created by the
 * original seed with database-generated ids).
 */
export interface SeedCtx {
  /** role name -> role id (resolved from the DB after bootstrap). */
  roleIds: Record<string, string>;
  /** module code -> module id (resolved from the DB after bootstrap). */
  moduleIds: Record<string, string>;
  /** PermissionGroup id for the "Admin Panel" group. */
  permissionGroupId: string;
  /** Bootstrap SUPER_ADMIN user id (set from env) when it exists. */
  adminUserId?: string;
}

/** Resolve the bootstrap roles/modules once, so every domain seed can link FKs. */
export async function buildSeedCtx(manager: EntityManager): Promise<SeedCtx> {
  const roles = await manager.find(Role);
  const roleIds: Record<string, string> = {};
  for (const r of roles) roleIds[r.name] = r.id;

  const modules = (await manager.query(
    'SELECT id, code FROM system_modules',
  )) as Array<{ id: string; code: string }>;
  const moduleIds: Record<string, string> = {};
  for (const m of modules) moduleIds[m.code] = m.id;

  const group = (await manager.query(
    `SELECT id FROM permission_groups WHERE name = 'Admin Panel' LIMIT 1`,
  )) as Array<{ id: string }>;

  const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
  let adminUserId: string | undefined;
  if (adminEmail) {
    const admin = (await manager.query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [adminEmail],
    )) as Array<{ id: string }>;
    adminUserId = admin[0]?.id;
  }

  return {
    roleIds,
    moduleIds,
    permissionGroupId: group[0]?.id ?? '',
    adminUserId,
  };
}
