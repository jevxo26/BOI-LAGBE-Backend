import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentStore } from '../agents/entities';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import {
  AgentShelf,
  AgentInventory,
  AgentInventoryBatch,
  AgentStockMovement,
  AgentStockTransfer,
  AgentStockTransferItem,
  AgentStockReservation,
  AgentRestockRequest,
  AgentRestockItem,
  AgentDamageStock,
  AgentReturnStock,
  AgentInventoryAdjustment,
  AgentInventoryAudit,
  AgentDailySales,
  AgentLowStockAlert,
  AgentProductReceive,
  AgentStoreExpense,
  AgentStoreExpenseCategory,
  AgentStoreClosing,
} from './entities';
import {
  Inventory,
  StockMovement,
  StockTransfer,
  StockTransferItem,
  RestockRequest,
  InventoryAudit,
  StockAdjustment,
  Warehouse,
} from '../warehouses/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AgentShelf,
      AgentInventory,
      AgentInventoryBatch,
      AgentStockMovement,
      AgentStockTransfer,
      AgentStockTransferItem,
      AgentStockReservation,
      AgentRestockRequest,
      AgentRestockItem,
      AgentDamageStock,
      AgentReturnStock,
      AgentInventoryAdjustment,
      AgentInventoryAudit,
      AgentDailySales,
      AgentLowStockAlert,
      AgentProductReceive,
      AgentStoreExpense,
      AgentStoreExpenseCategory,
      AgentStoreClosing,
      AgentStore,
      Inventory,
      StockMovement,
      StockTransfer,
      StockTransferItem,
      RestockRequest,
      InventoryAudit,
      StockAdjustment,
      Warehouse,
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
