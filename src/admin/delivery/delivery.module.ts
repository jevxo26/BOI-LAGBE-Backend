import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import {
  OrderDelivery,
  OrderTracking,
  Order,
  OrderHistory,
} from '../orders/entities';

@Module({
  imports: [
    // Delivery manages the OrderDelivery/OrderTracking entities owned by the
    // orders module (plus Order/OrderHistory for advancing delivered runs).
    TypeOrmModule.forFeature([
      OrderDelivery,
      OrderTracking,
      Order,
      OrderHistory,
    ]),
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
