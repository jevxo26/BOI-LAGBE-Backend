import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminRoles, AdminRole } from './admin-roles.decorator';
import { AdminRoleGuard } from '../guards/admin-role.guard';

// One-liner for admin-only routes: applies the role guard and requires the
// ADMIN or SUPER_ADMIN role on top of the global authentication guard.
// NEVER combine with @Public() — admin routes must stay authenticated.
//
// Usage:
//   @Controller('admin/users')
//   @AdminOnly()
//   export class UsersController {}
//
// To restrict a single endpoint further:
//   @AdminRoles(AdminRole.SUPER_ADMIN)
//   @Delete(':id')
//   deleteUser() {}
export const AdminOnly = () =>
  applyDecorators(
    AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN),
    UseGuards(AdminRoleGuard),
  );
