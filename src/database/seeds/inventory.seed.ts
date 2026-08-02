import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
import {
  AgentShelf,
  AgentShelfStatus,
  AgentInventory,
  AgentInventoryBatch,
  AgentStockMovement,
  AgentStockMovementType,
  AgentStockTransfer,
  AgentStockTransferStatus,
  AgentStockTransferItem,
  AgentStockReservation,
  AgentStockReservationStatus,
  AgentRestockRequest,
  AgentRestockRequestStatus,
  AgentRestockItem,
  AgentDamageStock,
  AgentReturnStock,
  AgentReturnStockStatus,
  AgentInventoryAdjustment,
  AgentInventoryAdjustmentType,
  AgentInventoryAudit,
  AgentInventoryAuditStatus,
  AgentDailySales,
  AgentLowStockAlert,
  AgentLowStockAlertStatus,
  AgentProductReceive,
  AgentProductReceiveStatus,
  AgentStoreExpense,
  AgentStoreExpenseStatus,
  AgentStoreExpenseCategory,
  AgentStoreExpenseCategoryStatus,
  AgentStoreClosing,
  AgentStoreClosingStatus,
} from '../../admin/inventory/entities';

/**
 * Agent store inventory seed. Keys shared across domains:
 *   agentinventory:1..3, agentrestock:1..2, agentexpensecat:1..2
 */
export async function seedInventory(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // ----------------------------------------------------------------- agent_shelves
  await seedRows(
    manager,
    AgentShelf,
    [
      {
        id: uid('agentshelf:1'),
        storeId: uid('agentstore:1'),
        name: 'Shelf A - Books',
        code: 'ST1-A',
        capacity: 300,
        status: AgentShelfStatus.ACTIVE,
      },
      {
        id: uid('agentshelf:2'),
        storeId: uid('agentstore:1'),
        name: 'Shelf B - Stationery',
        code: 'ST1-B',
        capacity: 150,
        status: AgentShelfStatus.ACTIVE,
      },
      {
        id: uid('agentshelf:3'),
        storeId: uid('agentstore:2'),
        name: 'Shelf A - Books',
        code: 'ST2-A',
        capacity: 250,
        status: AgentShelfStatus.ACTIVE,
      },
    ],
    'agent_shelves',
  );

  // -------------------------------------------------------------- agent_inventories
  await seedRows(
    manager,
    AgentInventory,
    [
      {
        id: uid('agentinventory:1'),
        storeId: uid('agentstore:1'),
        productId: uid('product:1'),
        availableStock: 20,
        reservedStock: 2,
        damagedStock: 0,
        returnedStock: 0,
        minimumStock: 5,
        maximumStock: 50,
        reorderLevel: 8,
        unitCost: 850,
        sellingPrice: 1100,
        lastStockUpdate: daysFromNow(-1),
      },
      {
        id: uid('agentinventory:2'),
        storeId: uid('agentstore:1'),
        productId: uid('product:2'),
        availableStock: 8,
        reservedStock: 1,
        damagedStock: 0,
        returnedStock: 0,
        minimumStock: 5,
        maximumStock: 30,
        reorderLevel: 6,
        unitCost: 1300,
        sellingPrice: 1650,
        lastStockUpdate: daysFromNow(-1),
      },
      {
        id: uid('agentinventory:3'),
        storeId: uid('agentstore:2'),
        productId: uid('product:4'),
        availableStock: 15,
        reservedStock: 0,
        damagedStock: 0,
        returnedStock: 0,
        minimumStock: 4,
        maximumStock: 25,
        reorderLevel: 5,
        unitCost: 1500,
        sellingPrice: 1999,
        lastStockUpdate: daysFromNow(-2),
      },
    ],
    'agent_inventories',
  );

  // --------------------------------------------------------- agent_inventory_batches
  await seedRows(
    manager,
    AgentInventoryBatch,
    [
      {
        id: uid('agentinventorybatch:1'),
        inventoryId: uid('agentinventory:1'),
        batchNumber: 'AGT-B-001',
        receivedDate: '2026-06-15',
        quantity: 25,
        remainingQuantity: 20,
      },
      {
        id: uid('agentinventorybatch:2'),
        inventoryId: uid('agentinventory:3'),
        batchNumber: 'AGT-B-003',
        receivedDate: '2026-07-05',
        quantity: 20,
        remainingQuantity: 15,
      },
    ],
    'agent_inventory_batches',
  );

  // ----------------------------------------------------------- agent_stock_movements
  await seedRows(
    manager,
    AgentStockMovement,
    [
      {
        id: uid('agentstockmove:1'),
        storeId: uid('agentstore:1'),
        productId: uid('product:1'),
        movementType: AgentStockMovementType.IN,
        quantity: 25,
        referenceType: 'restock',
        referenceId: uid('agentrestock:1'),
        remarks: 'Restock received',
        performedBy: uid('user:agent-1'),
        createdAt: daysFromNow(-5),
      },
      {
        id: uid('agentstockmove:2'),
        storeId: uid('agentstore:1'),
        productId: uid('product:1'),
        movementType: AgentStockMovementType.OUT,
        quantity: 5,
        referenceType: 'order',
        referenceId: uid('order:1'),
        remarks: 'Sold to customer',
        performedBy: uid('user:agent-1'),
        createdAt: daysFromNow(-2),
      },
      {
        id: uid('agentstockmove:3'),
        storeId: uid('agentstore:2'),
        productId: uid('product:4'),
        movementType: AgentStockMovementType.RESTOCK,
        quantity: 15,
        referenceType: 'restock',
        referenceId: uid('agentrestock:2'),
        performedBy: uid('user:agent-2'),
        createdAt: daysFromNow(-3),
      },
    ],
    'agent_stock_movements',
  );

  // ------------------------------------------------------------ agent_stock_transfers
  await seedRows(
    manager,
    AgentStockTransfer,
    [
      {
        id: uid('agentstocktransfer:1'),
        transferCode: 'AGT-ST-2026-001',
        fromStoreId: uid('agentstore:1'),
        toStoreId: uid('agentstore:2'),
        requestedBy: uid('user:agent-1'),
        approvedBy: uid('user:staff-1'),
        transferDate: daysFromNow(-2),
        status: AgentStockTransferStatus.APPROVED,
      },
      {
        id: uid('agentstocktransfer:2'),
        transferCode: 'AGT-ST-2026-002',
        fromStoreId: uid('agentstore:2'),
        toStoreId: uid('agentstore:1'),
        requestedBy: uid('user:agent-2'),
        transferDate: daysFromNow(-1),
        status: AgentStockTransferStatus.PENDING,
      },
    ],
    'agent_stock_transfers',
  );

  // ------------------------------------------------------ agent_stock_transfer_items
  await seedRows(
    manager,
    AgentStockTransferItem,
    [
      {
        id: uid('agentstocktransferitem:1'),
        transferId: uid('agentstocktransfer:1'),
        productId: uid('product:1'),
        quantity: 5,
        receivedQuantity: 5,
      },
      {
        id: uid('agentstocktransferitem:2'),
        transferId: uid('agentstocktransfer:2'),
        productId: uid('product:4'),
        quantity: 3,
        receivedQuantity: 0,
      },
    ],
    'agent_stock_transfer_items',
  );

  // --------------------------------------------------------- agent_stock_reservations
  await seedRows(
    manager,
    AgentStockReservation,
    [
      {
        id: uid('agentstockreserve:1'),
        inventoryId: uid('agentinventory:1'),
        orderId: uid('order:2'),
        productId: uid('product:1'),
        reservedQuantity: 2,
        expiresAt: daysFromNow(2),
        status: AgentStockReservationStatus.ACTIVE,
      },
    ],
    'agent_stock_reservations',
  );

  // ------------------------------------------------------------ agent_restock_requests
  await seedRows(
    manager,
    AgentRestockRequest,
    [
      {
        id: uid('agentrestock:1'),
        storeId: uid('agentstore:1'),
        productId: uid('product:2'),
        requestedQuantity: 15,
        approvedQuantity: 15,
        requestedBy: uid('user:agent-1'),
        approvedBy: uid('user:staff-1'),
        approvedAt: daysFromNow(-3),
        status: AgentRestockRequestStatus.APPROVED,
      },
      {
        id: uid('agentrestock:2'),
        storeId: uid('agentstore:2'),
        productId: uid('product:4'),
        requestedQuantity: 10,
        requestedBy: uid('user:agent-2'),
        status: AgentRestockRequestStatus.PENDING,
      },
    ],
    'agent_restock_requests',
  );

  // -------------------------------------------------------------- agent_restock_items
  await seedRows(
    manager,
    AgentRestockItem,
    [
      {
        id: uid('agentrestockitem:1'),
        restockRequestId: uid('agentrestock:1'),
        productId: uid('product:2'),
        quantity: 15,
        receivedQuantity: 15,
      },
    ],
    'agent_restock_items',
  );

  // ------------------------------------------------------------- agent_damage_stocks
  await seedRows(
    manager,
    AgentDamageStock,
    [
      {
        id: uid('agentdamage:1'),
        storeId: uid('agentstore:1'),
        productId: uid('product:2'),
        quantity: 1,
        damageReason: 'Cover torn in storage',
        reportedBy: uid('user:agent-1'),
      },
    ],
    'agent_damage_stocks',
  );

  // --------------------------------------------------------------- agent_return_stocks
  await seedRows(
    manager,
    AgentReturnStock,
    [
      {
        id: uid('agentreturn:1'),
        storeId: uid('agentstore:1'),
        productId: uid('product:2'),
        quantity: 1,
        returnSource: 'customer',
        reason: 'Damaged on delivery',
        status: AgentReturnStockStatus.APPROVED,
      },
    ],
    'agent_return_stocks',
  );

  // ------------------------------------------------------ agent_inventory_adjustments
  await seedRows(
    manager,
    AgentInventoryAdjustment,
    [
      {
        id: uid('agentadjust:1'),
        storeId: uid('agentstore:1'),
        productId: uid('product:2'),
        adjustmentType: AgentInventoryAdjustmentType.DECREASE,
        oldQuantity: 9,
        newQuantity: 8,
        reason: 'Damaged item removed',
        approvedBy: uid('user:staff-1'),
      },
    ],
    'agent_inventory_adjustments',
  );

  // ----------------------------------------------------------- agent_inventory_audits
  await seedRows(
    manager,
    AgentInventoryAudit,
    [
      {
        id: uid('agentaudit:1'),
        storeId: uid('agentstore:1'),
        auditDate: daysFromNow(-2),
        auditorId: uid('user:staff-1'),
        expectedStock: 30,
        physicalStock: 28,
        difference: -2,
        remarks: 'Two units damaged',
        status: AgentInventoryAuditStatus.COMPLETED,
      },
    ],
    'agent_inventory_audits',
  );

  // -------------------------------------------------------------- agent_daily_sales
  await seedRows(
    manager,
    AgentDailySales,
    [
      {
        id: uid('agentdaily:1'),
        storeId: uid('agentstore:1'),
        saleDate: daysFromNow(-1),
        totalOrders: 12,
        totalSales: 18000,
        totalDiscount: 300,
        totalTax: 900,
        totalProfit: 5400,
      },
      {
        id: uid('agentdaily:2'),
        storeId: uid('agentstore:2'),
        saleDate: daysFromNow(-1),
        totalOrders: 8,
        totalSales: 11000,
        totalDiscount: 150,
        totalTax: 550,
        totalProfit: 3300,
      },
    ],
    'agent_daily_sales',
  );

  // ------------------------------------------------------------ agent_low_stock_alerts
  await seedRows(
    manager,
    AgentLowStockAlert,
    [
      {
        id: uid('agentlowstock:1'),
        storeId: uid('agentstore:1'),
        productId: uid('product:2'),
        currentStock: 8,
        reorderLevel: 6,
        alertedAt: daysFromNow(-1),
        status: AgentLowStockAlertStatus.OPEN,
      },
    ],
    'agent_low_stock_alerts',
  );

  // ------------------------------------------------------------ agent_product_receives
  await seedRows(
    manager,
    AgentProductReceive,
    [
      {
        id: uid('agentreceive:1'),
        storeId: uid('agentstore:1'),
        productId: uid('product:1'),
        quantity: 25,
        receivedFrom: 'Central Warehouse',
        referenceType: 'restock',
        referenceId: uid('agentrestock:1'),
        receivedBy: uid('user:agent-1'),
        receivedAt: daysFromNow(-5),
        status: AgentProductReceiveStatus.RECEIVED,
      },
      {
        id: uid('agentreceive:2'),
        storeId: uid('agentstore:2'),
        productId: uid('product:4'),
        quantity: 10,
        receivedFrom: 'Central Warehouse',
        referenceType: 'restock',
        referenceId: uid('agentrestock:2'),
        receivedBy: uid('user:agent-2'),
        receivedAt: daysFromNow(0),
        status: AgentProductReceiveStatus.PENDING,
      },
    ],
    'agent_product_receives',
  );

  // -------------------------------------------------------- agent_store_expense_categories
  await seedRows(
    manager,
    AgentStoreExpenseCategory,
    [
      {
        id: uid('agentexpensecat:1'),
        name: 'Rent & Utilities',
        description: 'Store rent, electricity and water bills',
        status: AgentStoreExpenseCategoryStatus.ACTIVE,
      },
      {
        id: uid('agentexpensecat:2'),
        name: 'Staff Wages',
        description: 'Store employee salaries',
        status: AgentStoreExpenseCategoryStatus.ACTIVE,
      },
    ],
    'agent_store_expense_categories',
  );

  // -------------------------------------------------------------- agent_store_expenses
  await seedRows(
    manager,
    AgentStoreExpense,
    [
      {
        id: uid('agentexpense:1'),
        storeId: uid('agentstore:1'),
        categoryId: uid('agentexpensecat:1'),
        expenseDate: '2026-07-01',
        amount: 3000,
        note: 'Monthly rent',
        paidBy: uid('user:agent-1'),
        status: AgentStoreExpenseStatus.APPROVED,
      },
      {
        id: uid('agentexpense:2'),
        storeId: uid('agentstore:2'),
        categoryId: uid('agentexpensecat:2'),
        expenseDate: '2026-07-05',
        amount: 4000,
        note: 'Staff wages July',
        paidBy: uid('user:agent-2'),
        status: AgentStoreExpenseStatus.PENDING,
      },
    ],
    'agent_store_expenses',
  );

  // -------------------------------------------------------------- agent_store_closings
  await seedRows(
    manager,
    AgentStoreClosing,
    [
      {
        id: uid('agentclosing:1'),
        storeId: uid('agentstore:1'),
        closingDate: daysFromNow(-1, 21),
        openedBy: uid('user:agent-1'),
        closedBy: uid('user:agent-1'),
        openingAmount: 2000,
        closingAmount: 18000,
        cashSales: 6000,
        digitalSales: 12000,
        expenses: 3000,
        discrepancy: 0,
        remarks: 'All matched',
        status: AgentStoreClosingStatus.CLOSED,
      },
      {
        id: uid('agentclosing:2'),
        storeId: uid('agentstore:2'),
        closingDate: daysFromNow(0, 9),
        openedBy: uid('user:agent-2'),
        openingAmount: 1000,
        status: AgentStoreClosingStatus.OPEN,
      },
    ],
    'agent_store_closings',
  );

  void ctx;
}
