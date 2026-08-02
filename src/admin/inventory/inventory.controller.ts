import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListInventoryQueryDto } from './dto/list-inventory-query.dto';
import { ListStockMovementQueryDto } from './dto/list-stock-movement-query.dto';
import { ApproveRestockRequestDto } from './dto/approve-restock-request.dto';
import { ApproveStockTransferDto } from './dto/approve-stock-transfer.dto';
import { CreateInventoryAuditDto } from './dto/create-inventory-audit.dto';

// All inventory oversight routes require authentication (global
// StrictJwtAuthGuard) AND the ADMIN or SUPER_ADMIN role (@AdminOnly).
// Never add @Public() here.
@ApiTags('Admin - Inventory')
@ApiBearerAuth()
@Controller('admin/inventory')
@AdminOnly()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async findAll(@Query() query: ListInventoryQueryDto) {
    return this.inventoryService.findAllInventory(query);
  }

  @Get('stock-movements')
  async findStockMovements(@Query() query: ListStockMovementQueryDto) {
    return this.inventoryService.findStockMovements(query);
  }

  @Post('restock-requests/:id/approve')
  async approveRestockRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApproveRestockRequestDto,
    @Req() req: AdminRequest,
  ) {
    return this.inventoryService.approveRestockRequest(id, dto, req);
  }

  @Post('transfers/:id/approve')
  async approveStockTransfer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApproveStockTransferDto,
    @Req() req: AdminRequest,
  ) {
    return this.inventoryService.approveStockTransfer(id, dto, req);
  }

  @Post('audits')
  async createAudit(
    @Body() dto: CreateInventoryAuditDto,
    @Req() req: AdminRequest,
  ) {
    return this.inventoryService.createInventoryAudit(dto, req);
  }
}
