import type { Request } from 'express';
import type { AdminRequestUser } from '../guards/admin-role.guard';

// Authenticated request as populated by the global StrictJwtAuthGuard,
// shared by all admin controllers and services.
export type AdminRequest = Request & { user: AdminRequestUser };
