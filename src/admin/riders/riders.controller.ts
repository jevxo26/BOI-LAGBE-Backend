import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { RidersService } from './riders.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListRiderQueryDto } from './dto/list-rider-query.dto';
import { UpdateRiderStatusDto } from './dto/update-rider-status.dto';
import { AssignRiderAreasDto } from './dto/assign-rider-areas.dto';

// All rider routes require authentication (global StrictJwtAuthGuard) AND the
// ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
@Controller('admin/riders')
@AdminOnly()
export class RidersController {
  constructor(private readonly ridersService: RidersService) {}

  @Get()
  async findAll(@Query() query: ListRiderQueryDto) {
    return this.ridersService.findAllRiders(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ridersService.findRiderById(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRiderStatusDto,
    @Req() req: AdminRequest,
  ) {
    return this.ridersService.updateRiderStatus(id, dto, req);
  }

  @Post(':id/areas')
  async assignAreas(
    @Param('id') id: string,
    @Body() dto: AssignRiderAreasDto,
    @Req() req: AdminRequest,
  ) {
    return this.ridersService.assignRiderAreas(id, dto, req);
  }
}
