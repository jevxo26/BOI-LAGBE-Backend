import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListUserQueryDto } from './dto/list-user-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

// All user oversight routes require authentication (global StrictJwtAuthGuard)
// AND the ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
@Controller('admin/users')
@AdminOnly()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: ListUserQueryDto) {
    return this.usersService.findAllUsers(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @Req() req: AdminRequest,
  ) {
    return this.usersService.updateUserStatus(id, dto, req);
  }
}
