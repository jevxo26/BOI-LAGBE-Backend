import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from '../areas/entities';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';
import {
  Warehouse,
  WarehouseZone,
  WarehouseShelf,
  Supplier,
  Purchase,
  PurchaseItem,
  Inventory,
  InventoryBatch,
  StockMovement,
  StockTransfer,
  StockTransferItem,
  StockReservation,
  StockAdjustment,
  StockDamage,
  StockReturn,
  InventoryAudit,
  ReorderRule,
  RestockRequest,
  Barcode,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Warehouse,
      WarehouseZone,
      WarehouseShelf,
      Supplier,
      Purchase,
      PurchaseItem,
      Inventory,
      InventoryBatch,
      StockMovement,
      StockTransfer,
      StockTransferItem,
      StockReservation,
      StockAdjustment,
      StockDamage,
      StockReturn,
      InventoryAudit,
      ReorderRule,
      RestockRequest,
      Barcode,
      Area,
    ]),
  ],
  controllers: [WarehousesController],
  providers: [WarehousesService],
  exports: [WarehousesService],
})
export class WarehousesModule {}
