import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import {
  ADMIN_ROLES_KEY,
  AdminRole,
} from '../decorators/admin-roles.decorator';

// Shape of the user attached to `request.user` by the global StrictJwtAuthGuard
export interface AdminRequestUser {
  id: string;
  email?: string;
  phone?: string;
  roles?: string[];
  sessionId?: string;
}

// Runs AFTER the global StrictJwtAuthGuard, so `request.user` is already
// populated with the verified JWT payload (including `roles`). This guard only
// enforces the ADMIN / SUPER_ADMIN role requirement — authentication is handled
// globally and admin routes must never use @Public().
@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AdminRequestUser }>();

    // Fail closed: an authenticated user must exist
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Access Denied. Authentication required.',
        error: 'Unauthorized',
      });
    }

    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ADMIN_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Fail closed: without @AdminOnly() / @AdminRoles() metadata, deny access
    if (!requiredRoles || requiredRoles.length === 0) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Access denied. ADMIN or SUPER_ADMIN role required.',
        error: 'Forbidden',
      });
    }

    // Treat a missing `roles` claim as "no role" so the guard fails closed
    const userRoles = user.roles ?? [];
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException({
        statusCode: 403,
        message: `Access denied. Required roles: ${requiredRoles.join(', ')}.`,
        error: 'Forbidden',
      });
    }

    return true;
  }
}
