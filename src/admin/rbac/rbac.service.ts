import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { User } from '../../auth/entities';
import { PaginatedQueryDto } from '../common/dto/paginated-query.dto';
import { QueryBuilder } from '../common/utils/query-builder';
import { cleanDto } from '../common/utils/dto.util';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateApprovalWorkflowDto } from './dto/create-approval-workflow.dto';
import { UpdateApprovalWorkflowDto } from './dto/update-approval-workflow.dto';
import { ListLogQueryDto } from './dto/list-log-query.dto';
import { ListApprovalWorkflowQueryDto } from './dto/list-approval-workflow-query.dto';
import {
  Role,
  RoleStatus,
  Permission,
  PermissionGroup,
  PermissionGroupStatus,
  SystemModule,
  SystemModuleStatus,
  RolePermission,
  UserRole,
  UserRoleStatus,
  ApprovalLevel,
  ApprovalLevelStatus,
  ApprovalWorkflow,
  ApprovalWorkflowStatus,
  AuditLog,
  ActivityLog,
} from './entities';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository: Repository<PermissionGroup>,
    @InjectRepository(SystemModule)
    private readonly systemModuleRepository: Repository<SystemModule>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(ApprovalLevel)
    private readonly approvalLevelRepository: Repository<ApprovalLevel>,
    @InjectRepository(ApprovalWorkflow)
    private readonly approvalWorkflowRepository: Repository<ApprovalWorkflow>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  // ---------- ROLES ----------

  async findAllRoles(query: PaginatedQueryDto) {
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      searchableFields: ['name', 'displayName'],
      sortableFields: ['name', 'priority', 'createdAt'],
    });
    const [items, total] = await this.roleRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createRole(dto: CreateRoleDto, req: AdminRequest) {
    const existing = await this.roleRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new BadRequestException('Role with this name already exists');
    }

    const role = this.roleRepository.create({
      ...cleanDto(dto),
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });
    const saved = await this.roleRepository.save(role);

    await this.logAction(
      req,
      'CREATE',
      'Role',
      saved.id,
      `Created role "${saved.name}"`,
      undefined,
      saved,
    );

    return { message: 'Role created successfully', role: saved };
  }

  async updateRole(id: string, dto: UpdateRoleDto, req: AdminRequest) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Governance: system roles cannot be renamed, deactivated, or demoted
    if (
      role.isSystemRole &&
      (dto.name ||
        dto.status === RoleStatus.INACTIVE ||
        dto.isSystemRole === false)
    ) {
      throw new BadRequestException(
        'System roles cannot be renamed, deactivated, or demoted',
      );
    }

    if (dto.name && dto.name !== role.name) {
      const existing = await this.roleRepository.findOne({
        where: { name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Role with this name already exists');
      }
    }

    // Snapshot BEFORE mutating so the audit log captures the real before/after
    const oldValue = { ...role };
    Object.assign(role, cleanDto(dto), { updatedBy: req.user.id });
    const saved = await this.roleRepository.save(role);

    await this.logAction(
      req,
      'UPDATE',
      'Role',
      saved.id,
      `Updated role "${saved.name}"`,
      oldValue,
      saved,
    );

    return { message: 'Role updated successfully', role: saved };
  }

  async removeRole(id: string, req: AdminRequest) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystemRole) {
      throw new BadRequestException('System roles cannot be deleted');
    }

    const assignments = await this.userRoleRepository.count({
      where: { roleId: id },
    });
    if (assignments > 0) {
      throw new BadRequestException(
        'Role is currently assigned to users and cannot be deleted',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(RolePermission, { roleId: id });
      await queryRunner.manager.delete(Role, id);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.logAction(
      req,
      'DELETE',
      'Role',
      id,
      `Deleted role "${role.name}"`,
      role,
      undefined,
    );

    return { message: 'Role deleted successfully' };
  }

  // ---------- PERMISSIONS ----------

  async findAllPermissions(query: PaginatedQueryDto) {
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      searchableFields: ['name', 'code'],
      sortableFields: ['name', 'createdAt'],
    });
    const [items, total] =
      await this.permissionRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createPermission(dto: CreatePermissionDto, req: AdminRequest) {
    const module = await this.systemModuleRepository.findOne({
      where: { id: dto.moduleId },
    });
    if (!module) {
      throw new BadRequestException('Invalid moduleId: module not found');
    }

    const existing = await this.permissionRepository.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new BadRequestException('Permission with this code already exists');
    }

    const permission = this.permissionRepository.create(cleanDto(dto));
    const saved = await this.permissionRepository.save(permission);

    await this.logAction(
      req,
      'CREATE',
      'Permission',
      saved.id,
      `Created permission "${saved.code}"`,
      undefined,
      saved,
    );

    return { message: 'Permission created successfully', permission: saved };
  }

  // ---------- ASSIGNMENTS ----------

  async assignPermissionsToRole(
    roleId: string,
    dto: AssignPermissionsDto,
    req: AdminRequest,
  ) {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissionIds = dto.permissions.map((p) => p.permissionId);
    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });
    if (permissions.length !== permissionIds.length) {
      throw new BadRequestException('One or more permission IDs are invalid');
    }

    const rows = dto.permissions.map((p) =>
      this.rolePermissionRepository.create({
        roleId,
        permissionId: p.permissionId,
        canCreate: p.canCreate ?? false,
        canRead: p.canRead ?? true,
        canUpdate: p.canUpdate ?? false,
        canDelete: p.canDelete ?? false,
        canApprove: p.canApprove ?? false,
        canExport: p.canExport ?? false,
      }),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(RolePermission, { roleId });
      await queryRunner.manager.save(rows);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.logAction(
      req,
      'ASSIGN',
      'RolePermission',
      roleId,
      `Assigned ${rows.length} permission(s) to role "${role.name}"`,
      undefined,
      { roleId, permissions: dto.permissions },
    );

    return {
      message: 'Permissions assigned successfully',
      assigned: rows.length,
    };
  }

  async assignRolesToUser(
    userId: string,
    dto: AssignRoleDto,
    req: AdminRequest,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = await this.roleRepository.find({
      where: { id: In(dto.roleIds) },
    });
    if (roles.length !== dto.roleIds.length) {
      throw new BadRequestException('One or more role IDs are invalid');
    }

    // Skip roles the user is already actively assigned to (idempotent)
    const existing = await this.userRoleRepository.find({
      where: { userId, roleId: In(dto.roleIds), status: UserRoleStatus.ACTIVE },
    });
    const existingRoleIds = new Set(existing.map((ur) => ur.roleId));

    const rows = dto.roleIds
      .filter((roleId) => !existingRoleIds.has(roleId))
      .map((roleId) =>
        this.userRoleRepository.create({
          userId,
          roleId,
          assignedBy: req.user.id,
          assignedAt: new Date(),
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
          status: UserRoleStatus.ACTIVE,
        }),
      );

    const saved =
      rows.length > 0 ? await this.userRoleRepository.save(rows) : [];

    await this.logAction(
      req,
      'ASSIGN',
      'UserRole',
      userId,
      `Assigned ${saved.length} role(s) to user`,
      undefined,
      { userId, roleIds: dto.roleIds },
    );

    return { message: 'Roles assigned successfully', assigned: saved.length };
  }

  // ---------- AUDIT & ACTIVITY LOGS ----------

  async findAuditLogs(query: ListLogQueryDto) {
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['module', 'action', 'referenceType'],
      sortableFields: ['createdAt'],
      where: query.module ? { module: query.module } : undefined,
    });
    const [items, total] = await this.auditLogRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findActivityLogs(query: ListLogQueryDto) {
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['module', 'activity'],
      sortableFields: ['createdAt'],
      where: query.module ? { module: query.module } : undefined,
    });
    const [items, total] =
      await this.activityLogRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- APPROVAL WORKFLOWS ----------

  async findApprovalWorkflows(query: ListApprovalWorkflowQueryDto) {
    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['module', 'referenceId'],
      sortableFields: ['createdAt', 'status'],
      where: query.status ? { status: query.status } : undefined,
    });
    const [items, total] =
      await this.approvalWorkflowRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async createApprovalWorkflow(
    dto: CreateApprovalWorkflowDto,
    req: AdminRequest,
  ) {
    const approvalLevel = await this.approvalLevelRepository.findOne({
      where: { id: dto.approvalLevelId },
    });
    if (!approvalLevel) {
      throw new BadRequestException(
        'Invalid approvalLevelId: approval level not found',
      );
    }

    const workflow = this.approvalWorkflowRepository.create({
      ...cleanDto(dto),
      requestedBy: req.user.id,
      status: ApprovalWorkflowStatus.PENDING,
    });
    const saved = await this.approvalWorkflowRepository.save(workflow);

    await this.logAction(
      req,
      'CREATE',
      'ApprovalWorkflow',
      saved.id,
      `Created approval workflow for ${saved.module}`,
      undefined,
      saved,
    );

    return {
      message: 'Approval workflow created successfully',
      workflow: saved,
    };
  }

  async updateApprovalWorkflow(
    id: string,
    dto: UpdateApprovalWorkflowDto,
    req: AdminRequest,
  ) {
    const workflow = await this.approvalWorkflowRepository.findOne({
      where: { id },
    });
    if (!workflow) {
      throw new NotFoundException('Approval workflow not found');
    }

    // Snapshot BEFORE mutating so the audit log captures the real before/after
    const oldValue = { ...workflow };
    Object.assign(workflow, cleanDto(dto));
    if (
      dto.status === ApprovalWorkflowStatus.APPROVED ||
      dto.status === ApprovalWorkflowStatus.REJECTED
    ) {
      workflow.approvedBy = req.user.id;
      workflow.approvedAt = new Date();
    }
    const saved = await this.approvalWorkflowRepository.save(workflow);

    await this.logAction(
      req,
      'UPDATE',
      'ApprovalWorkflow',
      saved.id,
      `Updated approval workflow status to ${saved.status}`,
      oldValue,
      saved,
    );

    return {
      message: 'Approval workflow updated successfully',
      workflow: saved,
    };
  }

  // ---------- REFERENCE DATA ----------

  async findModules() {
    return this.systemModuleRepository.find({
      where: { status: SystemModuleStatus.ACTIVE },
      relations: { permissionGroup: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findPermissionGroups() {
    return this.permissionGroupRepository.find({
      where: { status: PermissionGroupStatus.ACTIVE },
      order: { sortOrder: 'ASC' },
    });
  }

  async findApprovalLevels() {
    return this.approvalLevelRepository.find({
      where: { status: ApprovalLevelStatus.ACTIVE },
      order: { level: 'ASC' },
    });
  }

  // ---------- LOGGING ----------

  // Writes both an audit log (before/after values) and an activity log
  // (human readable description) for every admin mutation, atomically.
  private async logAction(
    req: AdminRequest,
    action: string,
    referenceType: string,
    referenceId: string,
    description: string,
    oldValue?: unknown,
    newValue?: unknown,
  ) {
    await this.adminAuditService.log(
      req,
      'RBAC',
      action,
      referenceType,
      referenceId,
      description,
      oldValue,
      newValue,
    );
  }
}
