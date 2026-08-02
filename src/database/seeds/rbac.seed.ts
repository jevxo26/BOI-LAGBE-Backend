import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
import {
  Permission,
  UserRole,
  UserPermission,
  RolePermission,
  LoginPolicy,
  ApprovalLevel,
  ApprovalWorkflow,
  AuditLog,
  ActivityLog,
} from '../../admin/rbac/entities';

/**
 * RBAC seed: permissions for every system module, role/permission links,
 * login policies per role, approval levels + sample workflows, and audit/
 * activity log rows for admin-panel history.
 */
export async function seedRbac(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  const modules = ctx.moduleIds;

  // ------------------------------------------------------------ permissions
  const perms: Array<{
    id: string;
    moduleId: string;
    name: string;
    code: string;
  }> = [];
  const actions = [
    { code: 'view', name: 'View' },
    { code: 'create', name: 'Create' },
    { code: 'update', name: 'Update' },
    { code: 'delete', name: 'Delete' },
  ];
  for (const [code, modId] of Object.entries(modules)) {
    for (const a of actions) {
      perms.push({
        id: uid(`perm:${code}:${a.code}`),
        moduleId: modId,
        name: `${a.name} ${code.replace(/-/g, ' ')}`,
        code: `${code}.${a.code}`,
      });
    }
  }
  await seedRows(manager, Permission, perms, 'permissions');

  // ------------------------------------------------------------ user_roles
  // Mirror the user.roles arrays created in core.seed.ts.
  const roleLinks: Array<{
    id: string;
    userId: string;
    roleId: string;
    assignedBy?: string;
    assignedAt?: Date;
  }> = [
    {
      id: uid('userrole:staff-1:ADMIN'),
      userId: uid('user:staff-1'),
      roleId: ctx.roleIds['ADMIN'] ?? '',
      assignedAt: daysFromNow(-60),
    },
    {
      id: uid('userrole:student-1:STUDENT'),
      userId: uid('user:student-1'),
      roleId: ctx.roleIds['STUDENT'] ?? '',
      assignedAt: daysFromNow(-45),
    },
    {
      id: uid('userrole:student-2:STUDENT'),
      userId: uid('user:student-2'),
      roleId: ctx.roleIds['STUDENT'] ?? '',
      assignedAt: daysFromNow(-40),
    },
    {
      id: uid('userrole:student-3:STUDENT'),
      userId: uid('user:student-3'),
      roleId: ctx.roleIds['STUDENT'] ?? '',
      assignedAt: daysFromNow(-30),
    },
    {
      id: uid('userrole:customer-1:STUDENT'),
      userId: uid('user:customer-1'),
      roleId: ctx.roleIds['STUDENT'] ?? '',
      assignedAt: daysFromNow(-25),
    },
    {
      id: uid('userrole:customer-2:STUDENT'),
      userId: uid('user:customer-2'),
      roleId: ctx.roleIds['STUDENT'] ?? '',
      assignedAt: daysFromNow(-20),
    },
    {
      id: uid('userrole:customer-3:STUDENT'),
      userId: uid('user:customer-3'),
      roleId: ctx.roleIds['STUDENT'] ?? '',
      assignedAt: daysFromNow(-15),
    },
    {
      id: uid('userrole:agent-1:STUDENT'),
      userId: uid('user:agent-1'),
      roleId: ctx.roleIds['STUDENT'] ?? '',
      assignedAt: daysFromNow(-50),
    },
    {
      id: uid('userrole:agent-2:STUDENT'),
      userId: uid('user:agent-2'),
      roleId: ctx.roleIds['STUDENT'] ?? '',
      assignedAt: daysFromNow(-48),
    },
    {
      id: uid('userrole:rider-1:STUDENT'),
      userId: uid('user:rider-1'),
      roleId: ctx.roleIds['STUDENT'] ?? '',
      assignedAt: daysFromNow(-46),
    },
    {
      id: uid('userrole:rider-2:STUDENT'),
      userId: uid('user:rider-2'),
      roleId: ctx.roleIds['STUDENT'] ?? '',
      assignedAt: daysFromNow(-44),
    },
  ].filter((r) => r.roleId);
  await seedRows(manager, UserRole, roleLinks, 'user_roles');

  // ---------------------------------------------------------- role_permissions
  // SUPER_ADMIN gets every permission; ADMIN gets view+create+update for all modules.
  const rolePerms: Array<{ id: string; roleId: string; permissionId: string }> =
    [];
  if (ctx.roleIds['SUPER_ADMIN']) {
    for (const p of perms) {
      rolePerms.push({
        id: uid(`roleperm:SUPER_ADMIN:${p.id}`),
        roleId: ctx.roleIds['SUPER_ADMIN'],
        permissionId: p.id,
      });
    }
  }
  if (ctx.roleIds['ADMIN']) {
    for (const p of perms.filter((x) => !x.code.endsWith('.delete'))) {
      rolePerms.push({
        id: uid(`roleperm:ADMIN:${p.id}`),
        roleId: ctx.roleIds['ADMIN'],
        permissionId: p.id,
      });
    }
  }
  await seedRows(manager, RolePermission, rolePerms, 'role_permissions');

  // ---------------------------------------------------------- user_permissions
  await seedRows(
    manager,
    UserPermission,
    [
      {
        id: uid('userperm:staff-1:users:view'),
        userId: uid('user:staff-1'),
        permissionId: uid('perm:users:view'),
        grantedAt: daysFromNow(-60),
      },
      {
        id: uid('userperm:staff-1:orders:view'),
        userId: uid('user:staff-1'),
        permissionId: uid('perm:orders:view'),
        grantedAt: daysFromNow(-60),
      },
      {
        id: uid('userperm:staff-1:finance:view'),
        userId: uid('user:staff-1'),
        permissionId: uid('perm:finance:view'),
        grantedAt: daysFromNow(-60),
      },
    ],
    'user_permissions',
  );

  // -------------------------------------------------------------- login_policies
  await seedRows(
    manager,
    LoginPolicy,
    [
      {
        id: uid('loginpolicy:SUPER_ADMIN'),
        roleId: ctx.roleIds['SUPER_ADMIN'] ?? '',
        maxLoginAttempts: 5,
        lockDuration: 15,
        sessionTimeout: 60,
        allowMultipleSession: true,
        requireTwoFactor: false,
        passwordExpiryDays: 90,
      },
      {
        id: uid('loginpolicy:ADMIN'),
        roleId: ctx.roleIds['ADMIN'] ?? '',
        maxLoginAttempts: 5,
        lockDuration: 15,
        sessionTimeout: 60,
        allowMultipleSession: true,
        requireTwoFactor: false,
        passwordExpiryDays: 90,
      },
      {
        id: uid('loginpolicy:STUDENT'),
        roleId: ctx.roleIds['STUDENT'] ?? '',
        maxLoginAttempts: 5,
        lockDuration: 10,
        sessionTimeout: 120,
        allowMultipleSession: true,
        requireTwoFactor: false,
        passwordExpiryDays: 180,
      },
    ].filter((r) => r.roleId),
    'login_policies',
  );

  // ------------------------------------------------------------ approval_levels
  await seedRows(
    manager,
    ApprovalLevel,
    [
      {
        id: uid('approvallevel:1'),
        name: 'Line Manager',
        level: 1,
        description: 'First level approval for operational requests',
        status: 'ACTIVE',
      },
      {
        id: uid('approvallevel:2'),
        name: 'Department Head',
        level: 2,
        description: 'Second level approval for department-wide requests',
        status: 'ACTIVE',
      },
      {
        id: uid('approvallevel:3'),
        name: 'Director',
        level: 3,
        description: 'Final approval for high-value requests',
        status: 'ACTIVE',
      },
    ],
    'approval_levels',
  );

  // --------------------------------------------------------- approval_workflows
  await seedRows(
    manager,
    ApprovalWorkflow,
    [
      {
        id: uid('workflow:1'),
        module: 'used-books',
        referenceId: uid('ubreq:1'),
        approvalLevelId: uid('approvallevel:1'),
        requestedBy: uid('user:student-1'),
        status: 'APPROVED',
        approvedBy: uid('user:staff-1'),
        approvedAt: daysFromNow(-5),
        remarks: 'Condition acceptable',
      },
      {
        id: uid('workflow:2'),
        module: 'orders',
        referenceId: uid('order:4'),
        approvalLevelId: uid('approvallevel:1'),
        requestedBy: uid('user:customer-1'),
        status: 'PENDING',
      },
      {
        id: uid('workflow:3'),
        module: 'custom-orders',
        referenceId: uid('customorder:2'),
        approvalLevelId: uid('approvallevel:2'),
        requestedBy: uid('user:customer-2'),
        status: 'PENDING',
      },
    ],
    'approval_workflows',
  );

  // ---------------------------------------------------------------- audit_logs
  await seedRows(
    manager,
    AuditLog,
    [
      {
        id: uid('auditlog:1'),
        userId: uid('user:staff-1'),
        module: 'users',
        action: 'UPDATE',
        referenceType: 'user',
        referenceId: uid('user:student-1'),
        oldValue: { status: 'PENDING' },
        newValue: { status: 'ACTIVE' },
        ipAddress: '127.0.0.1',
        device: 'Windows',
        createdAt: daysFromNow(-6),
      },
      {
        id: uid('auditlog:2'),
        userId: uid('user:staff-1'),
        module: 'rbac',
        action: 'CREATE',
        referenceType: 'role',
        referenceId: uid('approvallevel:2'),
        newValue: { name: 'Department Head' },
        ipAddress: '127.0.0.1',
        createdAt: daysFromNow(-4),
      },
      {
        id: uid('auditlog:3'),
        userId: uid('user:staff-1'),
        module: 'finance',
        action: 'APPROVE',
        referenceType: 'expense',
        referenceId: uid('expense:1'),
        oldValue: { status: 'PENDING' },
        newValue: { status: 'APPROVED' },
        ipAddress: '127.0.0.1',
        createdAt: daysFromNow(-3),
      },
    ],
    'audit_logs',
  );

  // -------------------------------------------------------------- activity_logs
  await seedRows(
    manager,
    ActivityLog,
    [
      {
        id: uid('activitylog:1'),
        userId: uid('user:staff-1'),
        module: 'admin',
        activity: 'LOGIN',
        description: 'Admin logged in from admin panel',
        ipAddress: '127.0.0.1',
        device: 'Windows',
        browser: 'Chrome',
        createdAt: daysFromNow(-1),
      },
      {
        id: uid('activitylog:2'),
        userId: uid('user:staff-1'),
        module: 'users',
        activity: 'EXPORT',
        description: 'Exported user list to CSV',
        ipAddress: '127.0.0.1',
        createdAt: daysFromNow(-2),
      },
      {
        id: uid('activitylog:3'),
        userId: uid('user:student-1'),
        module: 'auth',
        activity: 'LOGIN',
        description: 'Student logged in via app',
        ipAddress: '127.0.0.1',
        device: 'Android',
        createdAt: daysFromNow(0),
      },
    ],
    'activity_logs',
  );
}
