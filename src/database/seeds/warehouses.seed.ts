import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
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
} from '../../admin/warehouses/entities';

/**
 * Warehouses + supplier + central warehouse inventory seed.
 * Keys shared across domains: warehouse:1 | warehouse:2,
 * supplier:1 | supplier:2, warehousezone:1..3, warehouseshelf:1..3
 */
export async function seedWarehouses(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // --------------------------------------------------------------- warehouses
  await seedRows(
    manager,
    Warehouse,
    [
      {
        id: uid('warehouse:1'),
        warehouseCode: 'WH-001',
        name: 'Central Warehouse Mirpur',
        warehouseType: 'CENTRAL',
        managerId: uid('user:staff-1'),
        phone: '01900000001',
        email: 'wh1@boilagbe.test',
        countryId: uid('country:bd'),
        divisionId: uid('division:dhaka'),
        districtId: uid('district:dhaka'),
        upazilaId: uid('upazila:mirpur'),
        areaId: uid('area:mirpur'),
        address: 'Warehouse Road, Mirpur 10',
        latitude: 23.8069,
        longitude: 90.3687,
        status: 'ACTIVE',
      },
      {
        id: uid('warehouse:2'),
        warehouseCode: 'WH-002',
        name: 'Regional Warehouse Uttara',
        warehouseType: 'REGIONAL',
        managerId: uid('user:staff-1'),
        phone: '01900000002',
        email: 'wh2@boilagbe.test',
        countryId: uid('country:bd'),
        divisionId: uid('division:dhaka'),
        districtId: uid('district:dhaka'),
        upazilaId: uid('upazila:uttara'),
        areaId: uid('area:uttara'),
        address: 'Sector 7, Uttara',
        latitude: 23.8759,
        longitude: 90.3795,
        status: 'ACTIVE',
      },
      {
        id: uid('warehouse:3'),
        warehouseCode: 'WH-003',
        name: 'Chattogram Local Hub',
        warehouseType: 'LOCAL',
        managerId: uid('user:staff-1'),
        phone: '01900000003',
        email: 'wh3@boilagbe.test',
        countryId: uid('country:bd'),
        divisionId: uid('division:chattogram'),
        districtId: uid('district:chattogram'),
        upazilaId: uid('upazila:chattogram-city'),
        areaId: uid('area:ctg-city'),
        address: 'GEC Circle, Chattogram',
        latitude: 22.3569,
        longitude: 91.7832,
        status: 'ACTIVE',
      },
    ],
    'warehouses',
  );

  // ------------------------------------------------------------ warehouse_zones
  await seedRows(
    manager,
    WarehouseZone,
    [
      {
        id: uid('warehousezone:1'),
        warehouseId: uid('warehouse:1'),
        name: 'Zone A - Academic Books',
        status: 'ACTIVE',
      },
      {
        id: uid('warehousezone:2'),
        warehouseId: uid('warehouse:1'),
        name: 'Zone B - Stationery',
        status: 'ACTIVE',
      },
      {
        id: uid('warehousezone:3'),
        warehouseId: uid('warehouse:2'),
        name: 'Zone A - Regional Stock',
        status: 'ACTIVE',
      },
    ],
    'warehouse_zones',
  );

  // ----------------------------------------------------------- warehouse_shelves
  await seedRows(
    manager,
    WarehouseShelf,
    [
      {
        id: uid('warehouseshelf:1'),
        warehouseId: uid('warehouse:1'),
        zoneId: uid('warehousezone:1'),
        shelfCode: 'A-1-01',
        capacity: 500,
        status: 'ACTIVE',
      },
      {
        id: uid('warehouseshelf:2'),
        warehouseId: uid('warehouse:1'),
        zoneId: uid('warehousezone:2'),
        shelfCode: 'B-1-01',
        capacity: 300,
        status: 'ACTIVE',
      },
      {
        id: uid('warehouseshelf:3'),
        warehouseId: uid('warehouse:2'),
        zoneId: uid('warehousezone:3'),
        shelfCode: 'A-2-01',
        capacity: 400,
        status: 'ACTIVE',
      },
    ],
    'warehouse_shelves',
  );

  // ---------------------------------------------------------------- suppliers
  await seedRows(
    manager,
    Supplier,
    [
      {
        id: uid('supplier:1'),
        supplierCode: 'SUP-001',
        companyName: 'Academic Press Ltd',
        contactPerson: 'Md. Sharif',
        phone: '01600000001',
        email: 'sales@academicpress.com',
        tradeLicense: 'TL-101',
        taxNumber: 'VAT-101',
        country: 'Bangladesh',
        address: 'Kawran Bazar, Dhaka',
        bankName: 'DBBL',
        bankAccount: 'DBBL-101',
        mobileBanking: '01710000001',
        status: 'ACTIVE',
      },
      {
        id: uid('supplier:2'),
        supplierCode: 'SUP-002',
        companyName: 'Readers Paradise',
        contactPerson: 'Rina Akter',
        phone: '01600000002',
        email: 'hello@readersparadise.com',
        tradeLicense: 'TL-102',
        taxNumber: 'VAT-102',
        country: 'Bangladesh',
        address: 'Chawk Bazar, Chattogram',
        bankName: 'Islami Bank',
        bankAccount: 'IB-102',
        mobileBanking: '01710000002',
        status: 'ACTIVE',
      },
    ],
    'suppliers',
  );

  // ----------------------------------------------------------------- purchases
  await seedRows(
    manager,
    Purchase,
    [
      {
        id: uid('purchase:1'),
        purchaseCode: 'PUR-2026-001',
        supplierId: uid('supplier:1'),
        purchaseDate: '2026-06-15',
        totalAmount: 150000,
        paidAmount: 150000,
        dueAmount: 0,
        paymentStatus: 'PAID',
        purchaseStatus: 'RECEIVED',
        receivedAt: daysFromNow(-30),
        receivedBy: uid('user:staff-1'),
      },
      {
        id: uid('purchase:2'),
        purchaseCode: 'PUR-2026-002',
        supplierId: uid('supplier:2'),
        purchaseDate: '2026-07-10',
        totalAmount: 90000,
        paidAmount: 45000,
        dueAmount: 45000,
        paymentStatus: 'PARTIAL',
        purchaseStatus: 'ORDERED',
      },
    ],
    'purchases',
  );

  // ------------------------------------------------------------- purchase_items
  await seedRows(
    manager,
    PurchaseItem,
    [
      {
        id: uid('purchaseitem:1'),
        purchaseId: uid('purchase:1'),
        productId: uid('product:1'),
        quantity: 100,
        unitCost: 850,
        lineTotal: 85000,
        receivedQuantity: 100,
      },
      {
        id: uid('purchaseitem:2'),
        purchaseId: uid('purchase:1'),
        productId: uid('product:2'),
        quantity: 50,
        unitCost: 1300,
        lineTotal: 65000,
        receivedQuantity: 50,
      },
      {
        id: uid('purchaseitem:3'),
        purchaseId: uid('purchase:2'),
        productId: uid('product:4'),
        quantity: 60,
        unitCost: 1500,
        lineTotal: 90000,
        receivedQuantity: 0,
      },
    ],
    'purchase_items',
  );

  // --------------------------------------------------------------- inventories
  await seedRows(
    manager,
    Inventory,
    [
      {
        id: uid('inventory:1'),
        warehouseId: uid('warehouse:1'),
        productId: uid('product:1'),
        availableStock: 85,
        reservedStock: 10,
        damagedStock: 3,
        returnedStock: 2,
        minimumStock: 20,
        maximumStock: 200,
        reorderLevel: 30,
        unitCost: 850,
        sellingPrice: 1100,
        lastStockUpdate: daysFromNow(-1),
      },
      {
        id: uid('inventory:2'),
        warehouseId: uid('warehouse:1'),
        productId: uid('product:2'),
        availableStock: 40,
        reservedStock: 5,
        damagedStock: 1,
        returnedStock: 0,
        minimumStock: 10,
        maximumStock: 100,
        reorderLevel: 15,
        unitCost: 1300,
        sellingPrice: 1650,
        lastStockUpdate: daysFromNow(-1),
      },
      {
        id: uid('inventory:3'),
        warehouseId: uid('warehouse:2'),
        productId: uid('product:4'),
        availableStock: 55,
        reservedStock: 5,
        damagedStock: 0,
        returnedStock: 0,
        minimumStock: 15,
        maximumStock: 120,
        reorderLevel: 20,
        unitCost: 1500,
        sellingPrice: 1999,
        lastStockUpdate: daysFromNow(-2),
      },
      {
        id: uid('inventory:4'),
        warehouseId: uid('warehouse:3'),
        productId: uid('product:6'),
        availableStock: 12,
        reservedStock: 0,
        damagedStock: 0,
        returnedStock: 1,
        minimumStock: 10,
        maximumStock: 80,
        reorderLevel: 15,
        unitCost: 650,
        sellingPrice: 950,
        lastStockUpdate: daysFromNow(-1),
      },
    ],
    'inventories',
  );

  // ----------------------------------------------------------- inventory_batches
  await seedRows(
    manager,
    InventoryBatch,
    [
      {
        id: uid('inventorybatch:1'),
        inventoryId: uid('inventory:1'),
        batchNumber: 'B-2026-001',
        manufacturingDate: '2025-12-01',
        expiryDate: '2028-12-01',
        receivedDate: '2026-06-15',
        quantity: 100,
        remainingQuantity: 85,
      },
      {
        id: uid('inventorybatch:2'),
        inventoryId: uid('inventory:2'),
        batchNumber: 'B-2026-002',
        manufacturingDate: '2026-01-15',
        expiryDate: '2029-01-15',
        receivedDate: '2026-06-15',
        quantity: 50,
        remainingQuantity: 40,
      },
    ],
    'inventory_batches',
  );

  // ------------------------------------------------------------- stock_movements
  await seedRows(
    manager,
    StockMovement,
    [
      {
        id: uid('stockmove:1'),
        warehouseId: uid('warehouse:1'),
        productId: uid('product:1'),
        movementType: 'IN',
        quantity: 100,
        referenceType: 'purchase',
        referenceId: uid('purchase:1'),
        remarks: 'Initial purchase',
        performedBy: uid('user:staff-1'),
        createdAt: daysFromNow(-30),
      },
      {
        id: uid('stockmove:2'),
        warehouseId: uid('warehouse:1'),
        productId: uid('product:1'),
        movementType: 'OUT',
        quantity: 10,
        referenceType: 'order',
        referenceId: uid('order:1'),
        remarks: 'Order dispatch',
        performedBy: uid('user:staff-1'),
        createdAt: daysFromNow(-5),
      },
      {
        id: uid('stockmove:3'),
        warehouseId: uid('warehouse:2'),
        productId: uid('product:4'),
        movementType: 'RESTOCK',
        quantity: 60,
        referenceType: 'purchase',
        referenceId: uid('purchase:2'),
        performedBy: uid('user:staff-1'),
        createdAt: daysFromNow(-2),
      },
    ],
    'stock_movements',
  );

  // ------------------------------------------------------------- stock_transfers
  await seedRows(
    manager,
    StockTransfer,
    [
      {
        id: uid('stocktransfer:1'),
        transferCode: 'ST-2026-001',
        fromWarehouseId: uid('warehouse:1'),
        toWarehouseId: uid('warehouse:2'),
        requestedBy: uid('user:staff-1'),
        approvedBy: uid('user:staff-1'),
        transferDate: daysFromNow(-3),
        status: 'APPROVED',
      },
      {
        id: uid('stocktransfer:2'),
        transferCode: 'ST-2026-002',
        fromWarehouseId: uid('warehouse:2'),
        toWarehouseId: uid('warehouse:3'),
        requestedBy: uid('user:staff-1'),
        transferDate: daysFromNow(-1),
        status: 'PENDING',
      },
    ],
    'stock_transfers',
  );

  // --------------------------------------------------------- stock_transfer_items
  await seedRows(
    manager,
    StockTransferItem,
    [
      {
        id: uid('stocktransferitem:1'),
        transferId: uid('stocktransfer:1'),
        productId: uid('product:1'),
        quantity: 20,
        receivedQuantity: 20,
      },
      {
        id: uid('stocktransferitem:2'),
        transferId: uid('stocktransfer:2'),
        productId: uid('product:4'),
        quantity: 15,
        receivedQuantity: 0,
      },
    ],
    'stock_transfer_items',
  );

  // ---------------------------------------------------------- stock_reservations
  await seedRows(
    manager,
    StockReservation,
    [
      {
        id: uid('stockreservation:1'),
        inventoryId: uid('inventory:1'),
        orderId: uid('order:1'),
        productId: uid('product:1'),
        reservedQuantity: 10,
        expiresAt: daysFromNow(2),
        status: 'ACTIVE',
      },
      {
        id: uid('stockreservation:2'),
        inventoryId: uid('inventory:3'),
        orderId: uid('order:4'),
        productId: uid('product:4'),
        reservedQuantity: 5,
        expiresAt: daysFromNow(1),
        status: 'ACTIVE',
      },
    ],
    'stock_reservations',
  );

  // ------------------------------------------------------------ stock_adjustments
  await seedRows(
    manager,
    StockAdjustment,
    [
      {
        id: uid('stockadjust:1'),
        warehouseId: uid('warehouse:1'),
        productId: uid('product:1'),
        adjustmentType: 'DECREASE',
        oldQuantity: 90,
        newQuantity: 85,
        reason: 'Damaged stock found during audit',
        createdAt: daysFromNow(-4),
      },
      {
        id: uid('stockadjust:2'),
        warehouseId: uid('warehouse:2'),
        productId: uid('product:4'),
        adjustmentType: 'INCREASE',
        oldQuantity: 50,
        newQuantity: 55,
        reason: 'Received correction from supplier',
        createdAt: daysFromNow(-2),
      },
    ],
    'stock_adjustments',
  );

  // --------------------------------------------------------------- stock_damages
  await seedRows(
    manager,
    StockDamage,
    [
      {
        id: uid('stockdamage:1'),
        warehouseId: uid('warehouse:1'),
        productId: uid('product:1'),
        quantity: 3,
        damageReason: 'Water damage',
        reportedBy: uid('user:staff-1'),
        createdAt: daysFromNow(-4),
      },
    ],
    'stock_damages',
  );

  // ---------------------------------------------------------------- stock_returns
  await seedRows(
    manager,
    StockReturn,
    [
      {
        id: uid('stockreturn:1'),
        warehouseId: uid('warehouse:1'),
        productId: uid('product:2'),
        quantity: 2,
        returnSource: 'agent',
        reason: 'Damaged on delivery',
        status: 'APPROVED',
        createdAt: daysFromNow(-3),
      },
    ],
    'stock_returns',
  );

  // ------------------------------------------------------------- inventory_audits
  await seedRows(
    manager,
    InventoryAudit,
    [
      {
        id: uid('inventoryaudit:1'),
        warehouseId: uid('warehouse:1'),
        auditDate: daysFromNow(-4),
        auditorId: uid('user:staff-1'),
        expectedStock: 90,
        physicalStock: 85,
        difference: -5,
        remarks: '5 units damaged',
        status: 'COMPLETED',
      },
      {
        id: uid('inventoryaudit:2'),
        warehouseId: uid('warehouse:2'),
        auditDate: daysFromNow(0),
        auditorId: uid('user:staff-1'),
        expectedStock: 50,
        physicalStock: 50,
        difference: 0,
        status: 'PENDING',
      },
    ],
    'inventory_audits',
  );

  // ---------------------------------------------------------------- reorder_rules
  await seedRows(
    manager,
    ReorderRule,
    [
      {
        id: uid('reorderrule:1'),
        productId: uid('product:1'),
        reorderPoint: 30,
        reorderQuantity: 100,
        leadTimeDays: 5,
        isActive: true,
      },
      {
        id: uid('reorderrule:2'),
        productId: uid('product:4'),
        reorderPoint: 20,
        reorderQuantity: 60,
        leadTimeDays: 7,
        isActive: true,
      },
    ],
    'reorder_rules',
  );

  // ------------------------------------------------------------- restock_requests
  await seedRows(
    manager,
    RestockRequest,
    [
      {
        id: uid('restockrequest:1'),
        warehouseId: uid('warehouse:1'),
        productId: uid('product:1'),
        requestedQuantity: 100,
        approvedQuantity: 100,
        requestedBy: uid('user:staff-1'),
        approvedBy: uid('user:staff-1'),
        approvedAt: daysFromNow(-2),
        status: 'APPROVED',
      },
      {
        id: uid('restockrequest:2'),
        warehouseId: uid('warehouse:3'),
        productId: uid('product:6'),
        requestedQuantity: 40,
        requestedBy: uid('user:staff-1'),
        status: 'PENDING',
      },
    ],
    'restock_requests',
  );

  // ------------------------------------------------------------------ barcodes
  await seedRows(
    manager,
    Barcode,
    [
      {
        id: uid('barcode:1'),
        productId: uid('product:1'),
        barcode: '8901000000017',
        status: 'ACTIVE',
      },
      {
        id: uid('barcode:2'),
        productId: uid('product:4'),
        barcode: '8901000000048',
        status: 'ACTIVE',
      },
    ],
    'barcodes',
  );

  void ctx;
}
