import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacModule } from './rbac/rbac.module';
import { UsersModule } from './users/users.module';
import { AgentsModule } from './agents/agents.module';
import { RidersModule } from './riders/riders.module';
import { AreasModule } from './areas/areas.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { InventoryModule } from './inventory/inventory.module';
import { ProductsModule } from './products/products.module';
import { BooksModule } from './books/books.module';
import { UsedBooksModule } from './used-books/used-books.module';
import { DigitalContentModule } from './digital-content/digital-content.module';
import { CustomOrdersModule } from './custom-orders/custom-orders.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveryModule } from './delivery/delivery.module';
import { FinanceModule } from './finance/finance.module';
import { ReportsModule } from './reports/reports.module';
import { CrmModule } from './crm/crm.module';
import { AdminRoleGuard } from './common/guards/admin-role.guard';
import { AdminAuditService } from './common/services/admin-audit.service';
import { AuditLog, ActivityLog } from './rbac/entities';

// Global so every admin feature module (RBAC, users, orders, ...) can use
// @AdminOnly() / @UseGuards(AdminRoleGuard) without importing AdminModule.
@Global()
@Module({
  imports: [
    // Repository registration for the shared audit service (used by every
    // feature module's mutation endpoints).
    TypeOrmModule.forFeature([AuditLog, ActivityLog]),
    RbacModule,
    UsersModule,
    AgentsModule,
    RidersModule,
    AreasModule,
    WarehousesModule,
    InventoryModule,
    ProductsModule,
    BooksModule,
    UsedBooksModule,
    DigitalContentModule,
    CustomOrdersModule,
    OrdersModule,
    DeliveryModule,
    FinanceModule,
    ReportsModule,
    CrmModule,
  ],
  providers: [AdminRoleGuard, AdminAuditService],
  exports: [AdminRoleGuard, AdminAuditService, RbacModule],
})
export class AdminModule {}
