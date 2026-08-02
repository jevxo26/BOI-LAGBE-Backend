import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { PaginatedQueryDto } from '../common/dto/paginated-query.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateApprovalWorkflowDto } from './dto/create-approval-workflow.dto';
import { UpdateApprovalWorkflowDto } from './dto/update-approval-workflow.dto';
import { ListLogQueryDto } from './dto/list-log-query.dto';
import { ListApprovalWorkflowQueryDto } from './dto/list-approval-workflow-query.dto';

// All RBAC routes require authentication (global StrictJwtAuthGuard) AND the
// ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
@ApiTags('Admin - RBAC')
@ApiBearerAuth()
@Controller('admin/rbac')
@AdminOnly()
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  // ---------- ROLES ----------

  @Get('roles')
  async findAllRoles(@Query() query: PaginatedQueryDto) {
    return this.rbacService.findAllRoles(query);
  }

  @Post('roles')
  async createRole(@Body() dto: CreateRoleDto, @Req() req: AdminRequest) {
    return this.rbacService.createRole(dto, req);
  }

  @Patch('roles/:id')
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
    @Req() req: AdminRequest,
  ) {
    return this.rbacService.updateRole(id, dto, req);
  }

  @Delete('roles/:id')
  async removeRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AdminRequest,
  ) {
    return this.rbacService.removeRole(id, req);
  }

  // ---------- PERMISSIONS ----------

  @Get('permissions')
  async findAllPermissions(@Query() query: PaginatedQueryDto) {
    return this.rbacService.findAllPermissions(query);
  }

  @Post('permissions')
  async createPermission(
    @Body() dto: CreatePermissionDto,
    @Req() req: AdminRequest,
  ) {
    return this.rbacService.createPermission(dto, req);
  }

  // ---------- ASSIGNMENTS ----------

  @Post('roles/:id/permissions')
  async assignPermissionsToRole(
    @Param('id', ParseUUIDPipe) roleId: string,
    @Body() dto: AssignPermissionsDto,
    @Req() req: AdminRequest,
  ) {
    return this.rbacService.assignPermissionsToRole(roleId, dto, req);
  }

  @Post('users/:id/roles')
  async assignRolesToUser(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() dto: AssignRoleDto,
    @Req() req: AdminRequest,
  ) {
    return this.rbacService.assignRolesToUser(userId, dto, req);
  }

  // ---------- AUDIT & ACTIVITY LOGS ----------

  @Get('audit-logs')
  async findAuditLogs(@Query() query: ListLogQueryDto) {
    return this.rbacService.findAuditLogs(query);
  }

  @Get('activity-logs')
  async findActivityLogs(@Query() query: ListLogQueryDto) {
    return this.rbacService.findActivityLogs(query);
  }

  // ---------- APPROVAL WORKFLOWS ----------

  @Get('approval-workflows')
  async findApprovalWorkflows(@Query() query: ListApprovalWorkflowQueryDto) {
    return this.rbacService.findApprovalWorkflows(query);
  }

  @Post('approval-workflows')
  async createApprovalWorkflow(
    @Body() dto: CreateApprovalWorkflowDto,
    @Req() req: AdminRequest,
  ) {
    return this.rbacService.createApprovalWorkflow(dto, req);
  }

  @Patch('approval-workflows/:id')
  async updateApprovalWorkflow(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApprovalWorkflowDto,
    @Req() req: AdminRequest,
  ) {
    return this.rbacService.updateApprovalWorkflow(id, dto, req);
  }

  // ---------- REFERENCE DATA ----------

  @Get('modules')
  async findModules() {
    return this.rbacService.findModules();
  }

  @Get('permission-groups')
  async findPermissionGroups() {
    return this.rbacService.findPermissionGroups();
  }

  @Get('approval-levels')
  async findApprovalLevels() {
    return this.rbacService.findApprovalLevels();
  }
}
