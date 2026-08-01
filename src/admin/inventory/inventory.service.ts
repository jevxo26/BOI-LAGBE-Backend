import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Raw, Repository } from 'typeorm';
import { QueryBuilder } from '../common/utils/query-builder';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListInventoryQueryDto } from './dto/list-inventory-query.dto';
import { ListStockMovementQueryDto } from './dto/list-stock-movement-query.dto';
import { ApproveRestockRequestDto } from './dto/approve-restock-request.dto';
import { ApproveStockTransferDto } from './dto/approve-stock-transfer.dto';
import { CreateInventoryAuditDto } from './dto/create-inventory-audit.dto';
import {
  Inventory,
  InventoryAudit,
  InventoryAuditStatus,
  RestockRequest,
  RestockRequestStatus,
  StockMovement,
  StockMovementType,
  StockTransfer,
  StockTransferStatus,
} from '../warehouses/entities';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(RestockRequest)
    private readonly restockRequestRepository: Repository<RestockRequest>,
    @InjectRepository(StockTransfer)
    private readonly stockTransferRepository: Repository<StockTransfer>,
    @InjectRepository(InventoryAudit)
    private readonly inventoryAuditRepository: Repository<InventoryAudit>,
    private readonly dataSource: DataSource,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  async findAllInventory(query: ListInventoryQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.productId) where.productId = query.productId;
    if (query.lowStock === true) {
      where.availableStock = Raw(
        (alias) => `${alias}."availableStock" <= ${alias}."reorderLevel"`,
      );
    }

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'updatedAt',
      searchableFields: ['productId'],
      sortableFields: [
        'availableStock',
        'unitCost',
        'sellingPrice',
        'updatedAt',
      ],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.inventoryRepository.findAndCount({
      ...options,
      relations: { warehouse: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findStockMovements(query: ListStockMovementQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.productId) where.productId = query.productId;
    if (query.movementType) where.movementType = query.movementType;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['remarks', 'referenceId'],
      sortableFields: ['createdAt', 'quantity'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.stockMovementRepository.findAndCount({
      ...options,
      relations: { warehouse: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async approveRestockRequest(
    id: string,
    dto: ApproveRestockRequestDto,
    req: AdminRequest,
  ) {
    const request = await this.restockRequestRepository.findOne({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('Restock request not found');
    }
    if (request.status !== RestockRequestStatus.PENDING) {
      throw new BadRequestException('Restock request is not pending approval');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (dto.approve) {
        const approvedQuantity =
          dto.approvedQuantity ?? request.requestedQuantity;
        request.status = RestockRequestStatus.APPROVED;
        request.approvedQuantity = approvedQuantity;
        request.approvedBy = req.user.id;
        request.approvedAt = new Date();
        if (dto.remarks !== undefined) request.remarks = dto.remarks;
        await queryRunner.manager.save(request);

        // Increase on-hand stock for the warehouse/product (create the row if
        // this product has never been stocked in the warehouse before).
        let inventory = await queryRunner.manager.findOne(Inventory, {
          where: {
            warehouseId: request.warehouseId,
            productId: request.productId,
          },
        });
        if (!inventory) {
          inventory = queryRunner.manager.create(Inventory, {
            warehouseId: request.warehouseId,
            productId: request.productId,
            availableStock: 0,
          });
        }
        inventory.availableStock += approvedQuantity;
        inventory.lastStockUpdate = new Date();
        await queryRunner.manager.save(inventory);

        await queryRunner.manager.save(
          queryRunner.manager.create(StockMovement, {
            warehouseId: request.warehouseId,
            productId: request.productId,
            movementType: StockMovementType.RESTOCK,
            quantity: approvedQuantity,
            referenceType: 'RESTOCK_REQUEST',
            referenceId: request.id,
            remarks: dto.remarks,
            performedBy: req.user.id,
          }),
        );
      } else {
        request.status = RestockRequestStatus.REJECTED;
        if (dto.remarks !== undefined) request.remarks = dto.remarks;
        await queryRunner.manager.save(request);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.adminAuditService.log(
      req,
      'INVENTORY',
      'APPROVE',
      'RestockRequest',
      id,
      `${
        dto.approve ? 'Approved' : 'Rejected'
      } restock request for ${request.productId} (${
        dto.approve
          ? `${request.approvedQuantity ?? request.requestedQuantity} units`
          : 'no stock added'
      })`,
      undefined,
      request,
    );

    return {
      message: dto.approve
        ? 'Restock request approved'
        : 'Restock request rejected',
      request,
    };
  }

  async approveStockTransfer(
    id: string,
    dto: ApproveStockTransferDto,
    req: AdminRequest,
  ) {
    const transfer = await this.stockTransferRepository.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!transfer) {
      throw new NotFoundException('Stock transfer not found');
    }
    if (transfer.status !== StockTransferStatus.PENDING) {
      throw new BadRequestException('Stock transfer is not pending approval');
    }
    if (!transfer.items?.length) {
      throw new BadRequestException('Stock transfer has no items');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (dto.approve) {
        transfer.status = StockTransferStatus.APPROVED;
        transfer.approvedBy = req.user.id;
        transfer.transferDate = new Date();
        await queryRunner.manager.save(transfer);

        for (const item of transfer.items) {
          // Source warehouse: deduct stock (never allow negative balance)
          const fromInventory = await queryRunner.manager.findOne(Inventory, {
            where: {
              warehouseId: transfer.fromWarehouseId,
              productId: item.productId,
            },
          });
          // Never move stock that is already committed to orders (reserved)
          if (
            !fromInventory ||
            fromInventory.availableStock - fromInventory.reservedStock <
              item.quantity
          ) {
            throw new BadRequestException(
              `Insufficient stock for product ${item.productId} in source warehouse`,
            );
          }
          fromInventory.availableStock -= item.quantity;
          fromInventory.lastStockUpdate = new Date();
          await queryRunner.manager.save(fromInventory);

          // Destination warehouse: add stock (create the row if missing)
          let toInventory = await queryRunner.manager.findOne(Inventory, {
            where: {
              warehouseId: transfer.toWarehouseId,
              productId: item.productId,
            },
          });
          if (!toInventory) {
            toInventory = queryRunner.manager.create(Inventory, {
              warehouseId: transfer.toWarehouseId,
              productId: item.productId,
              availableStock: 0,
            });
          }
          toInventory.availableStock += item.quantity;
          toInventory.lastStockUpdate = new Date();
          await queryRunner.manager.save(toInventory);

          await queryRunner.manager.save(
            queryRunner.manager.create(StockMovement, {
              warehouseId: transfer.fromWarehouseId,
              productId: item.productId,
              movementType: StockMovementType.TRANSFER_OUT,
              quantity: item.quantity,
              referenceType: 'STOCK_TRANSFER',
              referenceId: transfer.id,
              performedBy: req.user.id,
            }),
          );
          await queryRunner.manager.save(
            queryRunner.manager.create(StockMovement, {
              warehouseId: transfer.toWarehouseId,
              productId: item.productId,
              movementType: StockMovementType.TRANSFER_IN,
              quantity: item.quantity,
              referenceType: 'STOCK_TRANSFER',
              referenceId: transfer.id,
              performedBy: req.user.id,
            }),
          );
        }
      } else {
        transfer.status = StockTransferStatus.REJECTED;
        await queryRunner.manager.save(transfer);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.adminAuditService.log(
      req,
      'INVENTORY',
      'APPROVE',
      'StockTransfer',
      id,
      `${dto.approve ? 'Approved' : 'Rejected'} stock transfer ${
        transfer.transferCode
      }${dto.remarks ? ` (${dto.remarks})` : ''}`,
      undefined,
      transfer,
    );

    return {
      message: dto.approve
        ? 'Stock transfer approved'
        : 'Stock transfer rejected',
      transfer,
    };
  }

  async createInventoryAudit(dto: CreateInventoryAuditDto, req: AdminRequest) {
    const difference = dto.physicalStock - dto.expectedStock;

    const audit = this.inventoryAuditRepository.create({
      warehouseId: dto.warehouseId,
      auditDate: dto.auditDate ? new Date(dto.auditDate) : new Date(),
      auditorId: req.user.id,
      expectedStock: dto.expectedStock,
      physicalStock: dto.physicalStock,
      difference,
      remarks: dto.remarks,
      status: InventoryAuditStatus.COMPLETED,
    });
    await this.inventoryAuditRepository.save(audit);

    await this.adminAuditService.log(
      req,
      'INVENTORY',
      'AUDIT',
      'InventoryAudit',
      audit.id,
      `Recorded inventory audit with ${difference >= 0 ? '+' : ''}${difference} units discrepancy`,
      undefined,
      audit,
    );

    return {
      message: 'Inventory audit recorded successfully',
      audit,
      difference,
    };
  }
}
