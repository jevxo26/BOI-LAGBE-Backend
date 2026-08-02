import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListDeliveryQueryDto } from './dto/list-delivery-query.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { AddDeliveryTrackingDto } from './dto/add-delivery-tracking.dto';

// All delivery routes require authentication (global StrictJwtAuthGuard) AND
// the ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
@ApiTags('Admin - Delivery')
@ApiBearerAuth()
@Controller('admin/delivery')
@AdminOnly()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  async findAll(@Query() query: ListDeliveryQueryDto) {
    return this.deliveryService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deliveryService.findById(id);
  }

  @Get(':id/tracking')
  async findTracking(@Param('id', ParseUUIDPipe) id: string) {
    return this.deliveryService.findTracking(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDeliveryStatusDto,
    @Req() req: AdminRequest,
  ) {
    return this.deliveryService.updateStatus(id, dto, req);
  }

  @Post(':id/tracking')
  async addTracking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddDeliveryTrackingDto,
    @Req() req: AdminRequest,
  ) {
    return this.deliveryService.addTracking(id, dto, req);
  }
}
