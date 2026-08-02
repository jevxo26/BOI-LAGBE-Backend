import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
import {
  ShoppingCart,
  CartItem,
  Checkout,
  Order,
  OrderItem,
  OrderStatusHistory,
  OrderTimeline,
  OrderAddress,
  OrderCoupon,
  OrderDiscount,
  OrderTax,
  OrderPayment,
  OrderInvoice,
  OrderPackage,
  OrderShipment,
  OrderDelivery,
  OrderTracking,
  OrderReturn,
  OrderRefund,
  OrderCancel,
  OrderExchange,
  OrderRating,
  OrderNotification,
  OrderHistory,
  OrderAnalytics,
  OrderReport,
} from '../../admin/orders/entities';

/**
 * Orders + delivery seed. Keys shared across domains:
 *   cart:1..2, order:1..5
 */
export async function seedOrders(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // -------------------------------------------------------------- shopping_carts
  await seedRows(
    manager,
    ShoppingCart,
    [
      {
        id: uid('cart:1'),
        userId: uid('user:student-1'),
        status: 'ACTIVE',
        totalAmount: 2750,
        createdAt: daysFromNow(-4),
      },
      {
        id: uid('cart:2'),
        userId: uid('user:customer-1'),
        status: 'CHECKED_OUT',
        totalAmount: 2400,
        createdAt: daysFromNow(-6),
      },
      {
        id: uid('cart:3'),
        userId: uid('user:customer-2'),
        status: 'ABANDONED',
        totalAmount: 800,
        createdAt: daysFromNow(-10),
      },
    ],
    'shopping_carts',
  );

  // ------------------------------------------------------------------ cart_items
  await seedRows(
    manager,
    CartItem,
    [
      {
        id: uid('cartitem:1'),
        cartId: uid('cart:1'),
        productId: uid('product:1'),
        quantity: 2,
        unitPrice: 1100,
        lineTotal: 2200,
        createdAt: daysFromNow(-4),
      },
      {
        id: uid('cartitem:2'),
        cartId: uid('cart:1'),
        productId: uid('product:3'),
        quantity: 1,
        unitPrice: 550,
        lineTotal: 550,
        createdAt: daysFromNow(-4),
      },
      {
        id: uid('cartitem:3'),
        cartId: uid('cart:2'),
        productId: uid('product:4'),
        quantity: 1,
        unitPrice: 1999,
        lineTotal: 1999,
        createdAt: daysFromNow(-6),
      },
      {
        id: uid('cartitem:4'),
        cartId: uid('cart:3'),
        bookId: uid('book:4'),
        quantity: 1,
        unitPrice: 350,
        lineTotal: 350,
        createdAt: daysFromNow(-10),
      },
    ],
    'cart_items',
  );

  // ------------------------------------------------------------------- checkouts
  await seedRows(
    manager,
    Checkout,
    [
      {
        id: uid('checkout:1'),
        userId: uid('user:customer-1'),
        cartId: uid('cart:2'),
        status: 'COMPLETED',
        totalAmount: 2400,
        paymentMethod: 'MOBILE_BANKING',
        checkedOutAt: daysFromNow(-6),
      },
      {
        id: uid('checkout:2'),
        userId: uid('user:student-1'),
        cartId: uid('cart:1'),
        status: 'INITIATED',
        totalAmount: 2750,
        paymentMethod: 'COD',
      },
    ],
    'checkouts',
  );

  // ---------------------------------------------------------------------- orders
  await seedRows(
    manager,
    Order,
    [
      {
        id: uid('order:1'),
        orderCode: 'BL-ORD-1001',
        userId: uid('user:customer-1'),
        status: 'DELIVERED',
        agentId: uid('agent:1'),
        riderId: uid('rider:1'),
        subtotal: 2400,
        discount: 100,
        tax: 120,
        shippingCost: 60,
        totalAmount: 2480,
        notes: 'Deliver to home',
        createdBy: uid('user:customer-1'),
        createdAt: daysFromNow(-8),
      },
      {
        id: uid('order:2'),
        orderCode: 'BL-ORD-1002',
        userId: uid('user:student-1'),
        status: 'DELIVERED',
        agentId: uid('agent:1'),
        riderId: uid('rider:1'),
        subtotal: 2750,
        discount: 0,
        tax: 137.5,
        shippingCost: 60,
        totalAmount: 2947.5,
        createdBy: uid('user:student-1'),
        createdAt: daysFromNow(-6),
      },
      {
        id: uid('order:3'),
        orderCode: 'BL-ORD-1003',
        userId: uid('user:customer-2'),
        status: 'PROCESSING',
        agentId: uid('agent:2'),
        subtotal: 1850,
        discount: 50,
        tax: 92.5,
        shippingCost: 70,
        totalAmount: 1962.5,
        createdBy: uid('user:customer-2'),
        createdAt: daysFromNow(-3),
      },
      {
        id: uid('order:4'),
        orderCode: 'BL-ORD-1004',
        userId: uid('user:customer-1'),
        status: 'SHIPPED',
        riderId: uid('rider:1'),
        subtotal: 1999,
        discount: 0,
        tax: 99.95,
        shippingCost: 70,
        totalAmount: 2168.95,
        createdBy: uid('user:customer-1'),
        createdAt: daysFromNow(-1),
      },
      {
        id: uid('order:5'),
        orderCode: 'BL-ORD-1005',
        userId: uid('user:customer-2'),
        status: 'PENDING',
        riderId: uid('rider:2'),
        subtotal: 350,
        discount: 0,
        tax: 17.5,
        shippingCost: 60,
        totalAmount: 427.5,
        createdBy: uid('user:customer-2'),
        createdAt: daysFromNow(0),
      },
    ],
    'orders',
  );

  // ----------------------------------------------------------------- order_items
  await seedRows(
    manager,
    OrderItem,
    [
      {
        id: uid('orderitem:1'),
        orderId: uid('order:1'),
        productId: uid('product:4'),
        quantity: 1,
        unitPrice: 1999,
        lineTotal: 1999,
        createdAt: daysFromNow(-8),
      },
      {
        id: uid('orderitem:2'),
        orderId: uid('order:1'),
        bookId: uid('book:1'),
        quantity: 1,
        unitPrice: 850,
        lineTotal: 850,
        createdAt: daysFromNow(-8),
      },
      {
        id: uid('orderitem:3'),
        orderId: uid('order:2'),
        productId: uid('product:1'),
        quantity: 2,
        unitPrice: 1100,
        lineTotal: 2200,
        createdAt: daysFromNow(-6),
      },
      {
        id: uid('orderitem:4'),
        orderId: uid('order:2'),
        productId: uid('product:3'),
        quantity: 1,
        unitPrice: 550,
        lineTotal: 550,
        createdAt: daysFromNow(-6),
      },
      {
        id: uid('orderitem:5'),
        orderId: uid('order:3'),
        bookId: uid('book:2'),
        quantity: 2,
        unitPrice: 780,
        lineTotal: 1560,
        createdAt: daysFromNow(-3),
      },
      {
        id: uid('orderitem:6'),
        orderId: uid('order:4'),
        productId: uid('product:4'),
        quantity: 1,
        unitPrice: 1999,
        lineTotal: 1999,
        createdAt: daysFromNow(-1),
      },
      {
        id: uid('orderitem:7'),
        orderId: uid('order:5'),
        bookId: uid('book:4'),
        quantity: 1,
        unitPrice: 350,
        lineTotal: 350,
        createdAt: daysFromNow(0),
      },
    ],
    'order_items',
  );

  // ---------------------------------------------------------------- order_statuses
  await seedRows(
    manager,
    OrderStatusHistory,
    [
      {
        id: uid('orderstatus:1'),
        orderId: uid('order:1'),
        status: 'PENDING',
        changedBy: uid('user:customer-1'),
        changedAt: daysFromNow(-8),
      },
      {
        id: uid('orderstatus:2'),
        orderId: uid('order:1'),
        status: 'DELIVERED',
        changedBy: uid('user:staff-1'),
        remarks: 'Delivered successfully',
        changedAt: daysFromNow(-5),
      },
      {
        id: uid('orderstatus:3'),
        orderId: uid('order:4'),
        status: 'PENDING',
        changedBy: uid('user:customer-1'),
        changedAt: daysFromNow(-1),
      },
      {
        id: uid('orderstatus:4'),
        orderId: uid('order:4'),
        status: 'SHIPPED',
        changedBy: uid('user:staff-1'),
        changedAt: daysFromNow(0),
      },
    ],
    'order_statuses',
  );

  // --------------------------------------------------------------- order_timelines
  await seedRows(
    manager,
    OrderTimeline,
    [
      {
        id: uid('ordertimeline:1'),
        orderId: uid('order:1'),
        title: 'Order placed',
        description: 'Customer placed order BL-ORD-1001',
        performedBy: uid('user:customer-1'),
        createdAt: daysFromNow(-8),
      },
      {
        id: uid('ordertimeline:2'),
        orderId: uid('order:1'),
        title: 'Delivered',
        description: 'Package delivered to customer',
        performedBy: uid('rider:1'),
        createdAt: daysFromNow(-5),
      },
    ],
    'order_timelines',
  );

  // --------------------------------------------------------------- order_addresses
  await seedRows(
    manager,
    OrderAddress,
    [
      {
        id: uid('orderaddr:1'),
        orderId: uid('order:1'),
        type: 'SHIPPING',
        addressLine1: 'Flat 3B, Green Tower',
        addressLine2: 'Sector 7',
        city: 'Dhaka',
        state: 'Dhaka',
        postalCode: '1230',
        country: 'Bangladesh',
        phone: '01700000005',
      },
      {
        id: uid('orderaddr:2'),
        orderId: uid('order:2'),
        type: 'SHIPPING',
        addressLine1: 'House 12, Road 5',
        addressLine2: 'Dhanmondi',
        city: 'Dhaka',
        state: 'Dhaka',
        postalCode: '1205',
        country: 'Bangladesh',
        phone: '01700000002',
      },
      {
        id: uid('orderaddr:3'),
        orderId: uid('order:4'),
        type: 'BILLING',
        addressLine1: 'Flat 3B, Green Tower',
        city: 'Dhaka',
        postalCode: '1230',
        country: 'Bangladesh',
        phone: '01700000005',
      },
    ],
    'order_addresses',
  );

  // ----------------------------------------------------------------- order_coupons
  await seedRows(
    manager,
    OrderCoupon,
    [
      {
        id: uid('ordercoupon:1'),
        orderId: uid('order:1'),
        code: 'SAVE50',
        type: 'FIXED',
        value: 50,
      },
      {
        id: uid('ordercoupon:2'),
        orderId: uid('order:3'),
        code: 'SALE5',
        type: 'PERCENTAGE',
        value: 5,
      },
    ],
    'order_coupons',
  );

  // --------------------------------------------------------------- order_discounts
  await seedRows(
    manager,
    OrderDiscount,
    [
      {
        id: uid('orderdiscount:1'),
        orderId: uid('order:1'),
        title: 'Coupon SAVE50',
        type: 'COUPON',
        amount: 100,
      },
      {
        id: uid('orderdiscount:2'),
        orderId: uid('order:3'),
        title: 'Coupon SALE5',
        type: 'COUPON',
        amount: 50,
      },
    ],
    'order_discounts',
  );

  // ------------------------------------------------------------------ order_taxes
  await seedRows(
    manager,
    OrderTax,
    [
      {
        id: uid('ordertax:1'),
        orderId: uid('order:1'),
        title: 'VAT 5%',
        rate: 5,
        amount: 120,
      },
      {
        id: uid('ordertax:2'),
        orderId: uid('order:2'),
        title: 'VAT 5%',
        rate: 5,
        amount: 137.5,
      },
    ],
    'order_taxes',
  );

  // ---------------------------------------------------------------- order_payments
  await seedRows(
    manager,
    OrderPayment,
    [
      {
        id: uid('orderpay:1'),
        orderId: uid('order:1'),
        userId: uid('user:customer-1'),
        amount: 2480,
        method: 'MOBILE_BANKING',
        reference: 'BKASH-001',
        status: 'COMPLETED',
        paidAt: daysFromNow(-8),
      },
      {
        id: uid('orderpay:2'),
        orderId: uid('order:2'),
        userId: uid('user:student-1'),
        amount: 2947.5,
        method: 'COD',
        status: 'COMPLETED',
        paidAt: daysFromNow(-5),
      },
      {
        id: uid('orderpay:3'),
        orderId: uid('order:4'),
        userId: uid('user:customer-1'),
        amount: 2168.95,
        method: 'CARD',
        status: 'PENDING',
      },
    ],
    'order_payments',
  );

  // ---------------------------------------------------------------- order_invoices
  await seedRows(
    manager,
    OrderInvoice,
    [
      {
        id: uid('orderinvoice:1'),
        orderId: uid('order:1'),
        invoiceCode: 'INV-2026-001',
        amount: 2480,
        status: 'PAID',
        issuedAt: daysFromNow(-8),
        paidAt: daysFromNow(-7),
      },
      {
        id: uid('orderinvoice:2'),
        orderId: uid('order:2'),
        invoiceCode: 'INV-2026-002',
        amount: 2947.5,
        status: 'PAID',
        issuedAt: daysFromNow(-6),
        paidAt: daysFromNow(-5),
      },
      {
        id: uid('orderinvoice:3'),
        orderId: uid('order:4'),
        invoiceCode: 'INV-2026-003',
        amount: 2168.95,
        status: 'ISSUED',
        issuedAt: daysFromNow(-1),
      },
    ],
    'order_invoices',
  );

  // ---------------------------------------------------------------- order_packages
  await seedRows(
    manager,
    OrderPackage,
    [
      {
        id: uid('orderpkg:1'),
        orderId: uid('order:1'),
        packageCode: 'PKG-2026-001',
        weight: 1.5,
        status: 'DELIVERED',
      },
      {
        id: uid('orderpkg:2'),
        orderId: uid('order:4'),
        packageCode: 'PKG-2026-002',
        weight: 0.5,
        status: 'READY',
      },
    ],
    'order_packages',
  );

  // --------------------------------------------------------------- order_shipments
  await seedRows(
    manager,
    OrderShipment,
    [
      {
        id: uid('ordership:1'),
        orderId: uid('order:1'),
        packageId: uid('orderpkg:1'),
        carrier: 'BOI Express',
        trackingNumber: 'TRK-001',
        status: 'DELIVERED',
        shippedAt: daysFromNow(-6),
        deliveredAt: daysFromNow(-5),
      },
      {
        id: uid('ordership:2'),
        orderId: uid('order:4'),
        packageId: uid('orderpkg:2'),
        carrier: 'BOI Express',
        trackingNumber: 'TRK-002',
        status: 'IN_TRANSIT',
        shippedAt: daysFromNow(0),
      },
    ],
    'order_shipments',
  );

  // --------------------------------------------------------------- order_deliveries
  await seedRows(
    manager,
    OrderDelivery,
    [
      {
        id: uid('orderdelivery:1'),
        orderId: uid('order:1'),
        shipmentId: uid('ordership:1'),
        riderId: uid('rider:1'),
        status: 'DELIVERED',
        assignedAt: daysFromNow(-6),
        deliveredAt: daysFromNow(-5),
      },
      {
        id: uid('orderdelivery:2'),
        orderId: uid('order:4'),
        shipmentId: uid('ordership:2'),
        riderId: uid('rider:1'),
        status: 'IN_TRANSIT',
        assignedAt: daysFromNow(0),
      },
      {
        id: uid('orderdelivery:3'),
        orderId: uid('order:5'),
        riderId: uid('rider:2'),
        status: 'PENDING',
      },
    ],
    'order_deliveries',
  );

  // ---------------------------------------------------------------- order_trackings
  await seedRows(
    manager,
    OrderTracking,
    [
      {
        id: uid('ordertracking:1'),
        deliveryId: uid('orderdelivery:1'),
        status: 'PICKED',
        location: 'Central Warehouse',
        description: 'Package picked up',
        trackedAt: daysFromNow(-6),
      },
      {
        id: uid('ordertracking:2'),
        deliveryId: uid('orderdelivery:1'),
        status: 'DELIVERED',
        location: 'Dhanmondi',
        description: 'Delivered to customer',
        trackedAt: daysFromNow(-5),
      },
      {
        id: uid('ordertracking:3'),
        deliveryId: uid('orderdelivery:2'),
        status: 'IN_TRANSIT',
        location: 'Mirpur - Uttara road',
        description: 'In transit',
        trackedAt: daysFromNow(0),
      },
    ],
    'order_trackings',
  );

  // ----------------------------------------------------------------- order_returns
  await seedRows(
    manager,
    OrderReturn,
    [
      {
        id: uid('orderreturn:1'),
        returnCode: 'RET-2026-001',
        orderId: uid('order:3'),
        userId: uid('user:customer-2'),
        reason: 'Wrong edition received',
        status: 'REQUESTED',
        requestedAt: daysFromNow(-1),
      },
    ],
    'order_returns',
  );

  // ----------------------------------------------------------------- order_refunds
  await seedRows(
    manager,
    OrderRefund,
    [
      {
        id: uid('orderrefund:1'),
        refundCode: 'REF-2026-001',
        orderId: uid('order:3'),
        paymentId: uid('orderpay:3'),
        userId: uid('user:customer-2'),
        amount: 1962.5,
        method: 'MOBILE_BANKING',
        status: 'PENDING',
      },
    ],
    'order_refunds',
  );

  // ----------------------------------------------------------------- order_cancels
  await seedRows(
    manager,
    OrderCancel,
    [
      {
        id: uid('ordercancel:1'),
        orderId: uid('order:5'),
        userId: uid('user:customer-2'),
        reason: 'Customer wants to cancel',
        cancelledBy: uid('user:customer-2'),
        cancelledAt: daysFromNow(0),
      },
    ],
    'order_cancels',
  );

  // ----------------------------------------------------------------- order_exchanges
  await seedRows(
    manager,
    OrderExchange,
    [
      {
        id: uid('orderexchange:1'),
        exchangeCode: 'EXC-2026-001',
        orderId: uid('order:3'),
        userId: uid('user:customer-2'),
        reason: 'Wrong edition, want exchange',
        status: 'REQUESTED',
      },
    ],
    'order_exchanges',
  );

  // ----------------------------------------------------------------- order_ratings
  await seedRows(
    manager,
    OrderRating,
    [
      {
        id: uid('orderrating:1'),
        orderId: uid('order:1'),
        userId: uid('user:customer-1'),
        rating: 5,
        review: 'Fast delivery, great service',
        createdAt: daysFromNow(-4),
      },
      {
        id: uid('orderrating:2'),
        orderId: uid('order:2'),
        userId: uid('user:student-1'),
        rating: 4,
        review: 'Good quality books',
        createdAt: daysFromNow(-3),
      },
    ],
    'order_ratings',
  );

  // ------------------------------------------------------------ order_notifications
  await seedRows(
    manager,
    OrderNotification,
    [
      {
        id: uid('ordernotif:1'),
        orderId: uid('order:1'),
        userId: uid('user:customer-1'),
        title: 'Order delivered',
        message: 'Your order BL-ORD-1001 has been delivered.',
        sentAt: daysFromNow(-5),
      },
      {
        id: uid('ordernotif:2'),
        orderId: uid('order:4'),
        userId: uid('user:customer-1'),
        title: 'Order shipped',
        message: 'Your order BL-ORD-1004 is on the way.',
        sentAt: daysFromNow(0),
      },
    ],
    'order_notifications',
  );

  // ---------------------------------------------------------------- order_histories
  await seedRows(
    manager,
    OrderHistory,
    [
      {
        id: uid('orderhistory:1'),
        orderId: uid('order:1'),
        action: 'CREATED',
        description: 'Order created',
        performedBy: uid('user:customer-1'),
        createdAt: daysFromNow(-8),
      },
      {
        id: uid('orderhistory:2'),
        orderId: uid('order:1'),
        action: 'DELIVERED',
        description: 'Order delivered',
        performedBy: uid('rider:1'),
        createdAt: daysFromNow(-5),
      },
    ],
    'order_histories',
  );

  // --------------------------------------------------------------- order_analytics
  await seedRows(
    manager,
    OrderAnalytics,
    [
      {
        id: uid('orderanalytics:1'),
        period: '2026-06',
        metric: 'totalOrders',
        value: 45,
        generatedAt: daysFromNow(-30),
      },
      {
        id: uid('orderanalytics:2'),
        period: '2026-06',
        metric: 'totalRevenue',
        value: 125000,
        generatedAt: daysFromNow(-30),
      },
      {
        id: uid('orderanalytics:3'),
        period: '2026-07',
        metric: 'totalOrders',
        value: 12,
        generatedAt: daysFromNow(-5),
      },
    ],
    'order_analytics',
  );

  // ----------------------------------------------------------------- order_reports
  await seedRows(
    manager,
    OrderReport,
    [
      {
        id: uid('orderreport:1'),
        reportCode: 'OR-0001',
        title: 'Orders June 2026',
        reportType: 'ORDERS',
        periodStart: daysFromNow(-30),
        periodEnd: daysFromNow(-1),
        fileUrl: '/reports/orders/or-0001.pdf',
        generatedBy: uid('user:staff-1'),
        status: 'GENERATED',
      },
    ],
    'order_reports',
  );

  void ctx;
}
