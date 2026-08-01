import { SetMetadata } from '@nestjs/common';

// Metadata key consumed by AdminRoleGuard to read the allowed roles
export const ADMIN_ROLES_KEY = 'adminRoles';

// The only roles with access to the admin panel. Mirrors the string values
// stored in the `roles` column of the `users` table.
export enum AdminRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

// @AdminRoles('SUPER_ADMIN') — restrict a specific route to a subset of admin roles.
// Class-level metadata is overridden by method-level metadata.
export const AdminRoles = (...roles: AdminRole[]) =>
  SetMetadata(ADMIN_ROLES_KEY, roles);
