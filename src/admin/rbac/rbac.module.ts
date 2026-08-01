import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';
import {
  Role,
  Permission,
  PermissionGroup,
  SystemModule,
  RolePermission,
  UserRole,
  UserPermission,
  ApprovalLevel,
  ApprovalWorkflow,
  AuditLog,
  ActivityLog,
  LoginPolicy,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Permission,
      PermissionGroup,
      SystemModule,
      RolePermission,
      UserRole,
      UserPermission,
      ApprovalLevel,
      ApprovalWorkflow,
      AuditLog,
      ActivityLog,
      LoginPolicy,
    ]),
    AuthModule,
  ],
  controllers: [RbacController],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
