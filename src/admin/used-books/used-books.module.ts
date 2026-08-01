import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsedBooksController } from './used-books.controller';
import { UsedBooksService } from './used-books.service';
import {
  UsedBookSellRequest,
  UsedBookItem,
  UsedBookImage,
  UsedBookEvaluation,
  UsedBookOffer,
  UsedBookApproval,
  UsedBookPickup,
  UsedBookInspection,
  UsedBookInventory,
  UsedBookPricing,
  UsedBookResale,
  UsedBookHistory,
  UsedBookPayment,
  UsedBookConditionReport,
  UsedBookRepair,
  UsedBookRejectReason,
  UsedBookReturn,
  UsedBookAudit,
  UsedBookAnalytics,
  UsedBookSettlement,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsedBookSellRequest,
      UsedBookItem,
      UsedBookImage,
      UsedBookEvaluation,
      UsedBookOffer,
      UsedBookApproval,
      UsedBookPickup,
      UsedBookInspection,
      UsedBookInventory,
      UsedBookPricing,
      UsedBookResale,
      UsedBookHistory,
      UsedBookPayment,
      UsedBookConditionReport,
      UsedBookRepair,
      UsedBookRejectReason,
      UsedBookReturn,
      UsedBookAudit,
      UsedBookAnalytics,
      UsedBookSettlement,
    ]),
  ],
  controllers: [UsedBooksController],
  providers: [UsedBooksService],
  exports: [UsedBooksService],
})
export class UsedBooksModule {}
