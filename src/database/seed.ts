import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import dataSource from './data-source';
import {
  Role,
  RoleStatus,
  PermissionGroup,
  PermissionGroupStatus,
  SystemModule,
  SystemModuleStatus,
  UserRole,
  UserRoleStatus,
} from '../admin/rbac/entities';
import {
  User,
  UserStatus,
  UserProfile,
  UserSecurity,
  UserPreference,
  UserNotificationSetting,
  UserActivity,
  ActivityType,
} from '../auth/entities';
import { buildSeedCtx } from './seeds/context';
import { seedCore } from './seeds/core.seed';
import { seedRbac } from './seeds/rbac.seed';
import { seedAreas } from './seeds/areas.seed';
import { seedWarehouses } from './seeds/warehouses.seed';
import { seedProducts } from './seeds/products.seed';
import { seedAgents } from './seeds/agents.seed';
import { seedRiders } from './seeds/riders.seed';
import { seedBooks } from './seeds/books.seed';
import { seedUsedBooks } from './seeds/used-books.seed';
import { seedDigitalContent } from './seeds/digital-content.seed';
import { seedCustomOrders } from './seeds/custom-orders.seed';
import { seedOrders } from './seeds/orders.seed';
import { seedInventory } from './seeds/inventory.seed';
import { seedFinance } from './seeds/finance.seed';
import { seedReports } from './seeds/reports.seed';
import { seedCrm } from './seeds/crm.seed';

/**
 * One-off DB seed (`npm run seed`) that makes the admin panel usable on a
 * fresh database:
 *
 *   1. Creates the system roles the AdminRoleGuard understands
 *      (SUPER_ADMIN, ADMIN, STUDENT) with isSystemRole: true.
 *   2. Creates the system modules + a permission group the RBAC module lists,
 *      so admins can create permissions against real module IDs.
 *   3. Optionally bootstraps the first SUPER_ADMIN from environment
 *      (BOOTSTRAP_ADMIN_EMAIL / BOOTSTRAP_ADMIN_PHONE / BOOTSTRAP_ADMIN_PASSWORD)
 *      to break the "only an admin can create an admin" chicken-and-egg.
 *
 * Idempotent and transactional: safe to run multiple times; existing rows are
 * left untouched and the whole seed either commits or rolls back as a unit.
 */
async function seed(): Promise<void> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  await dataSource.transaction(async (manager) => {
    // ---------- 1. System roles ----------
    const systemRoles = [
      { name: 'SUPER_ADMIN', priority: 100 },
      { name: 'ADMIN', priority: 50 },
      { name: 'STUDENT', priority: 0 },
    ];

    for (const r of systemRoles) {
      const exists = await manager.findOne(Role, { where: { name: r.name } });
      if (!exists) {
        await manager.save(
          manager.create(Role, {
            name: r.name,
            displayName: r.name.replace(/_/g, ' '),
            isSystemRole: true,
            status: RoleStatus.ACTIVE,
            priority: r.priority,
          }),
        );
        console.log(`✔ System role "${r.name}" created`);
      } else {
        console.log(`• System role "${r.name}" already exists`);
      }
    }

    // ---------- 2. System modules + permission group ----------
    let adminGroup = await manager.findOne(PermissionGroup, {
      where: { name: 'Admin Panel' },
    });
    if (!adminGroup) {
      adminGroup = await manager.save(
        manager.create(PermissionGroup, {
          name: 'Admin Panel',
          description: 'Core admin panel modules',
          status: PermissionGroupStatus.ACTIVE,
          sortOrder: 1,
        }),
      );
      console.log('✔ Permission group "Admin Panel" created');
    }

    // The 17 admin modules — codes match the /admin/* controller prefixes.
    const moduleCodes = [
      'users',
      'agents',
      'riders',
      'areas',
      'warehouses',
      'inventory',
      'products',
      'books',
      'used-books',
      'digital-content',
      'custom-orders',
      'orders',
      'delivery',
      'finance',
      'reports',
      'crm',
      'rbac',
    ];

    for (const code of moduleCodes) {
      const exists = await manager.findOne(SystemModule, {
        where: { code },
      });
      if (!exists) {
        await manager.save(
          manager.create(SystemModule, {
            permissionGroupId: adminGroup.id,
            name: code.toUpperCase().replace(/-/g, ' '),
            code,
            route: `/admin/${code}`,
            status: SystemModuleStatus.ACTIVE,
            sortOrder: 0,
          }),
        );
        console.log(`✔ System module "${code}" created`);
      }
    }

    // ---------- 3. Bootstrap SUPER_ADMIN ----------
    const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
    const phone = process.env.BOOTSTRAP_ADMIN_PHONE;
    const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

    if (!email || !phone || !password) {
      console.log(
        '• BOOTSTRAP_ADMIN_EMAIL / BOOTSTRAP_ADMIN_PHONE / BOOTSTRAP_ADMIN_PASSWORD ' +
          'not fully set — skipping bootstrap admin. ' +
          'Grant admin access later via POST /admin/rbac/users/:id/roles.',
      );
    } else {
      // Check BOTH unique keys (email and phone) so a phone collision with an
      // existing user can't blow up the unique constraint mid-seed.
      let admin = await manager.findOne(User, {
        where: [{ email }, { phone }],
      });

      if (admin) {
        console.log(`• Bootstrap admin ${email} / ${phone} already exists`);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        admin = manager.create(User, {
          userCode: `BL-ADMIN-${Math.floor(100000 + Math.random() * 900000)}`,
          firstName: 'Super',
          lastName: 'Admin',
          fullName: 'Super Admin',
          email,
          phone,
          password: hashedPassword,
          roles: ['SUPER_ADMIN'],
          status: UserStatus.ACTIVE,
          isActive: true,
          isVerified: true,
        });
        const savedAdmin = await manager.save(admin);

        await manager.save(
          manager.create(UserProfile, { userId: savedAdmin.id }),
        );
        await manager.save(
          manager.create(UserSecurity, { userId: savedAdmin.id }),
        );
        await manager.save(
          manager.create(UserPreference, { userId: savedAdmin.id }),
        );
        await manager.save(
          manager.create(UserNotificationSetting, { userId: savedAdmin.id }),
        );
        await manager.save(
          manager.create(UserActivity, {
            userId: savedAdmin.id,
            activity: ActivityType.REGISTER,
          }),
        );

        console.log(`✔ Bootstrap SUPER_ADMIN "${email}" created`);
      }

      // Mirror the RBAC dual-write (user_roles + user.roles) so the audit
      // trail is consistent. Runs for BOTH branches (backfills environments
      // where the admin pre-exists from an older seed) but is idempotent:
      // a matching UserRole row is only inserted when missing.
      const superAdminRole = await manager.findOne(Role, {
        where: { name: 'SUPER_ADMIN' },
      });
      // Guard: only link SUPER_ADMIN to an account that actually carries the
      // role. The OR-lookup (email | phone) could otherwise match an unrelated
      // user on a phone collision and falsely mark them as SUPER_ADMIN.
      if (superAdminRole && admin && admin.roles?.includes('SUPER_ADMIN')) {
        const existingRoleLink = await manager.findOne(UserRole, {
          where: {
            userId: admin.id,
            roleId: superAdminRole.id,
            status: UserRoleStatus.ACTIVE,
          },
        });
        if (!existingRoleLink) {
          await manager.save(
            manager.create(UserRole, {
              userId: admin.id,
              roleId: superAdminRole.id,
              assignedAt: new Date(),
              status: UserRoleStatus.ACTIVE,
            }),
          );
          console.log(
            `✔ Linked SUPER_ADMIN role to "${email}" (user_roles backfill)`,
          );
        }
      }
    }

    // ---------- 4. Domain seeders (full demo dataset) ----------
    // Order respects enforced FK constraints: users -> roles -> areas ->
    // warehouses -> products -> agents/riders -> catalog -> orders ->
    // agent-store inventory -> finance -> reports -> crm. Every seeder is
    // idempotent (INSERT ... ON CONFLICT DO NOTHING with deterministic ids).
    const ctx = await buildSeedCtx(manager);
    await seedCore(manager, ctx);
    await seedRbac(manager, ctx);
    await seedAreas(manager, ctx);
    await seedWarehouses(manager, ctx);
    await seedProducts(manager, ctx);
    await seedAgents(manager, ctx);
    await seedRiders(manager, ctx);
    await seedBooks(manager, ctx);
    await seedUsedBooks(manager, ctx);
    await seedDigitalContent(manager, ctx);
    await seedCustomOrders(manager, ctx);
    await seedOrders(manager, ctx);
    await seedInventory(manager, ctx);
    await seedFinance(manager, ctx);
    await seedReports(manager, ctx);
    await seedCrm(manager, ctx);
    console.log('✔ Domain data seeded');
  });

  await dataSource.destroy();
  console.log('✔ Seed complete');
}

seed().catch((err) => {
  console.error('✖ Seed failed:', err);
  process.exit(1);
});
