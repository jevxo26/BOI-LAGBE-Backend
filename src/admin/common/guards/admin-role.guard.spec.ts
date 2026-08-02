import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRoleGuard } from './admin-role.guard';
import { AdminRole } from '../decorators/admin-roles.decorator';

// Unit tests for the ADMIN/SUPER_ADMIN role enforcement guard. The guard is
// the second layer (after the global StrictJwtAuthGuard) protecting every
// /admin route, so its fail-closed behaviour is security-critical.
describe('AdminRoleGuard', () => {
  let guard: AdminRoleGuard;
  let getAllAndOverride: jest.Mock;

  // The guard reads context.switchToHttp().getRequest() AND builds the
  // reflector argument array from context.getHandler()/getClass(), so the
  // mock must provide all three.
  const mockContext = (user?: unknown): unknown => ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  });

  beforeEach(() => {
    getAllAndOverride = jest.fn();
    const reflector = { getAllAndOverride } as unknown as Reflector;
    guard = new AdminRoleGuard(reflector);
  });

  it('denies when no authenticated user is attached to the request', () => {
    getAllAndOverride.mockReturnValue([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]);
    expect(() => guard.canActivate(mockContext(undefined) as never)).toThrow(
      UnauthorizedException,
    );
  });

  it('fails closed when no @AdminOnly()/@AdminRoles() metadata is present', () => {
    getAllAndOverride.mockReturnValue(undefined);
    expect(() =>
      guard.canActivate(
        mockContext({ id: 'user-1', roles: [AdminRole.ADMIN] }) as never,
      ),
    ).toThrow(ForbiddenException);
  });

  it('denies a user without any admin role', () => {
    getAllAndOverride.mockReturnValue([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]);
    expect(() =>
      guard.canActivate(
        mockContext({ id: 'user-1', roles: ['CUSTOMER'] }) as never,
      ),
    ).toThrow(ForbiddenException);
  });

  it('treats a missing roles claim as no role (fail closed)', () => {
    getAllAndOverride.mockReturnValue([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]);
    expect(() =>
      guard.canActivate(mockContext({ id: 'user-1' }) as never),
    ).toThrow(ForbiddenException);
  });

  it('allows a user holding the ADMIN role', () => {
    getAllAndOverride.mockReturnValue([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]);
    expect(
      guard.canActivate(
        mockContext({ id: 'user-1', roles: [AdminRole.ADMIN] }) as never,
      ),
    ).toBe(true);
  });

  it('allows a user holding the SUPER_ADMIN role', () => {
    getAllAndOverride.mockReturnValue([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]);
    expect(
      guard.canActivate(
        mockContext({ id: 'user-1', roles: [AdminRole.SUPER_ADMIN] }) as never,
      ),
    ).toBe(true);
  });

  it('enforces method-level role overrides (e.g. SUPER_ADMIN only)', () => {
    getAllAndOverride.mockReturnValue([AdminRole.SUPER_ADMIN]);
    expect(() =>
      guard.canActivate(
        mockContext({ id: 'user-1', roles: [AdminRole.ADMIN] }) as never,
      ),
    ).toThrow(ForbiddenException);
    expect(
      guard.canActivate(
        mockContext({ id: 'user-1', roles: [AdminRole.SUPER_ADMIN] }) as never,
      ),
    ).toBe(true);
  });
});
