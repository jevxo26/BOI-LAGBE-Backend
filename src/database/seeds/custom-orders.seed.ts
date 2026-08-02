import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
import {
  CustomProduct,
  CustomProductTemplate,
  CustomWishlist,
  CustomReview,
  CustomOrder,
  CustomOrderItem,
  CustomSpecification,
  CustomDesign,
  CustomDesignFile,
  CustomQuotation,
  CustomApproval,
  CustomProduction,
  CustomProductionStage,
  CustomDeliverySchedule,
  CustomOrderHistory,
  GiftCategory,
  GiftProduct,
  GiftBundle,
  GiftBundleItem,
  GiftMessage,
  GiftWrapping,
  GiftOccasion,
  GiftRecipient,
  PrintService,
  PrintPricing,
  PrintJob,
  PrintFile,
  PrintDelivery,
  CustomAnalytics,
  CustomReport,
} from '../../admin/custom-orders/entities';

/**
 * Custom orders, gifts and print seed. Keys shared across domains:
 *   customproduct:1..3, customorder:1..2, giftcat:1, giftproduct:1..3,
 *   printservice:1
 */
export async function seedCustomOrders(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // -------------------------------------------------------------- custom_products
  await seedRows(
    manager,
    CustomProduct,
    [
      {
        id: uid('customproduct:1'),
        name: 'Custom Mug',
        slug: 'custom-mug',
        type: 'MUG',
        description: 'Personalized ceramic mug with custom design',
        basePrice: 350,
        status: 'ACTIVE',
      },
      {
        id: uid('customproduct:2'),
        name: 'Custom T-Shirt',
        slug: 'custom-t-shirt',
        type: 'T_SHIRT',
        description: 'Printed cotton t-shirt with custom design',
        basePrice: 500,
        status: 'ACTIVE',
      },
      {
        id: uid('customproduct:3'),
        name: 'Custom Notebook',
        slug: 'custom-notebook',
        type: 'NOTEBOOK',
        description: 'Hardcover notebook with custom cover',
        basePrice: 400,
        status: 'ACTIVE',
      },
    ],
    'custom_products',
  );

  // -------------------------------------------------------- custom_product_templates
  await seedRows(
    manager,
    CustomProductTemplate,
    [
      {
        id: uid('cptemplate:1'),
        productId: uid('customproduct:1'),
        templateCode: 'TMP-MUG-01',
        name: 'Mug Template 1',
        fileUrl: '/uploads/templates/mug-1.png',
        thumbnailUrl: '/uploads/templates/mug-1-thumb.png',
        status: 'ACTIVE',
      },
      {
        id: uid('cptemplate:2'),
        productId: uid('customproduct:2'),
        templateCode: 'TMP-TSH-01',
        name: 'T-Shirt Template 1',
        fileUrl: '/uploads/templates/tsh-1.png',
        thumbnailUrl: '/uploads/templates/tsh-1-thumb.png',
        status: 'ACTIVE',
      },
    ],
    'custom_product_templates',
  );

  // --------------------------------------------------------------- custom_wishlists
  await seedRows(
    manager,
    CustomWishlist,
    [
      {
        id: uid('cwishlist:1'),
        productId: uid('customproduct:1'),
        userId: uid('user:customer-1'),
        createdAt: daysFromNow(-3),
      },
    ],
    'custom_wishlists',
  );

  // ---------------------------------------------------------------- custom_reviews
  await seedRows(
    manager,
    CustomReview,
    [
      {
        id: uid('creview:1'),
        orderId: uid('customorder:1'),
        productId: uid('customproduct:1'),
        userId: uid('user:customer-1'),
        rating: 5,
        title: 'Great mug',
        body: 'Print quality is excellent.',
        status: 'APPROVED',
        moderatedBy: uid('user:staff-1'),
        moderatedAt: daysFromNow(-4),
      },
    ],
    'custom_reviews',
  );

  // ---------------------------------------------------------------- custom_orders
  await seedRows(
    manager,
    CustomOrder,
    [
      {
        id: uid('customorder:1'),
        orderCode: 'CO-2026-0001',
        userId: uid('user:customer-1'),
        status: 'QUOTATION_APPROVED',
        notes: 'Mug with university logo',
        totalAmount: 700,
        discount: 0,
        tax: 35,
        finalAmount: 735,
        createdBy: uid('user:customer-1'),
      },
      {
        id: uid('customorder:2'),
        orderCode: 'CO-2026-0002',
        userId: uid('user:customer-2'),
        status: 'PENDING_QUOTATION',
        notes: 'T-shirt batch for freshers event',
        totalAmount: 2500,
        discount: 0,
        tax: 125,
        finalAmount: 2625,
        createdBy: uid('user:customer-2'),
      },
    ],
    'custom_orders',
  );

  // ------------------------------------------------------------- custom_order_items
  await seedRows(
    manager,
    CustomOrderItem,
    [
      {
        id: uid('citem:1'),
        orderId: uid('customorder:1'),
        productId: uid('customproduct:1'),
        templateId: uid('cptemplate:1'),
        quantity: 2,
        unitPrice: 350,
        lineTotal: 700,
      },
      {
        id: uid('citem:2'),
        orderId: uid('customorder:2'),
        productId: uid('customproduct:2'),
        quantity: 5,
        unitPrice: 500,
        lineTotal: 2500,
      },
    ],
    'custom_order_items',
  );

  // ----------------------------------------------------------- custom_specifications
  await seedRows(
    manager,
    CustomSpecification,
    [
      {
        id: uid('cspec:1'),
        orderId: uid('customorder:1'),
        itemId: uid('citem:1'),
        specificationType: 'COLOR',
        description: 'Ceramic color',
        value: 'White',
        unit: '—',
      },
      {
        id: uid('cspec:2'),
        orderId: uid('customorder:2'),
        itemId: uid('citem:2'),
        specificationType: 'SIZE',
        description: 'T-shirt size',
        value: 'L',
        unit: 'size',
      },
    ],
    'custom_specifications',
  );

  // ----------------------------------------------------------------- custom_designs
  await seedRows(
    manager,
    CustomDesign,
    [
      {
        id: uid('cdesign:1'),
        orderId: uid('customorder:1'),
        itemId: uid('citem:1'),
        userId: uid('user:customer-1'),
        designName: 'University Logo Mug',
        designUrl: '/uploads/designs/mug-logo.png',
        status: 'APPROVED',
      },
    ],
    'custom_designs',
  );

  // ------------------------------------------------------------ custom_design_files
  await seedRows(
    manager,
    CustomDesignFile,
    [
      {
        id: uid('cdesignfile:1'),
        designId: uid('cdesign:1'),
        fileName: 'mug-logo.png',
        fileUrl: '/uploads/designs/mug-logo.png',
        fileType: 'image/png',
        fileSize: 250000,
        sortOrder: 1,
      },
    ],
    'custom_design_files',
  );

  // ------------------------------------------------------------- custom_quotations
  await seedRows(
    manager,
    CustomQuotation,
    [
      {
        id: uid('cquotation:1'),
        orderId: uid('customorder:1'),
        quotationCode: 'QTN-2026-0001',
        subtotal: 700,
        discount: 0,
        tax: 35,
        shippingCost: 0,
        totalAmount: 735,
        validUntil: daysFromNow(14),
        status: 'ACCEPTED',
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('cquotation:2'),
        orderId: uid('customorder:2'),
        quotationCode: 'QTN-2026-0002',
        subtotal: 2500,
        discount: 0,
        tax: 125,
        shippingCost: 100,
        totalAmount: 2725,
        validUntil: daysFromNow(14),
        status: 'DRAFT',
        createdBy: uid('user:staff-1'),
      },
    ],
    'custom_quotations',
  );

  // -------------------------------------------------------------- custom_approvals
  await seedRows(
    manager,
    CustomApproval,
    [
      {
        id: uid('capproval:1'),
        orderId: uid('customorder:1'),
        quotationId: uid('cquotation:1'),
        requestedBy: uid('user:staff-1'),
        approvedBy: uid('user:customer-1'),
        status: 'APPROVED',
        remarks: 'Approved quotation',
        approvedAt: daysFromNow(-5),
      },
      {
        id: uid('capproval:2'),
        orderId: uid('customorder:2'),
        requestedBy: uid('user:staff-1'),
        status: 'PENDING',
      },
    ],
    'custom_approvals',
  );

  // ------------------------------------------------------------- custom_productions
  await seedRows(
    manager,
    CustomProduction,
    [
      {
        id: uid('cproduction:1'),
        orderId: uid('customorder:1'),
        startedBy: uid('user:staff-1'),
        startDate: daysFromNow(-4),
        estimatedCompletionDate: daysFromNow(3),
        remarks: 'Print queue scheduled',
        status: 'IN_PROGRESS',
      },
    ],
    'custom_productions',
  );

  // -------------------------------------------------------- custom_production_stages
  await seedRows(
    manager,
    CustomProductionStage,
    [
      {
        id: uid('cstage:1'),
        productionId: uid('cproduction:1'),
        stageName: 'Design Approval',
        stageOrder: 1,
        startedAt: daysFromNow(-4),
        completedAt: daysFromNow(-3),
        status: 'COMPLETED',
      },
      {
        id: uid('cstage:2'),
        productionId: uid('cproduction:1'),
        stageName: 'Printing',
        stageOrder: 2,
        startedAt: daysFromNow(-3),
        status: 'IN_PROGRESS',
      },
    ],
    'custom_production_stages',
  );

  // ------------------------------------------------------ custom_delivery_schedules
  await seedRows(
    manager,
    CustomDeliverySchedule,
    [
      {
        id: uid('cdelivery:1'),
        orderId: uid('customorder:1'),
        scheduledDate: daysFromNow(4),
        deliveryAddress: 'House 12, Road 5, Dhanmondi',
        contactName: 'Farhana Islam',
        contactPhone: '01700000005',
        status: 'SCHEDULED',
        scheduledBy: uid('user:staff-1'),
      },
    ],
    'custom_delivery_schedules',
  );

  // ---------------------------------------------------------- custom_order_histories
  await seedRows(
    manager,
    CustomOrderHistory,
    [
      {
        id: uid('chistory:1'),
        orderId: uid('customorder:1'),
        action: 'ORDER_CREATED',
        description: 'Custom order submitted',
        performedBy: uid('user:customer-1'),
        createdAt: daysFromNow(-8),
      },
      {
        id: uid('chistory:2'),
        orderId: uid('customorder:1'),
        action: 'QUOTATION_ACCEPTED',
        description: 'Customer accepted quotation',
        performedBy: uid('user:customer-1'),
        createdAt: daysFromNow(-5),
      },
    ],
    'custom_order_histories',
  );

  // ------------------------------------------------------------------ gift_categories
  await seedRows(
    manager,
    GiftCategory,
    [
      {
        id: uid('giftcat:1'),
        name: 'Flowers',
        slug: 'flowers',
        description: 'Fresh flowers and bouquets',
        icon: 'flower',
        sortOrder: 1,
        status: 'ACTIVE',
      },
      {
        id: uid('giftcat:2'),
        name: 'Chocolates',
        slug: 'chocolates',
        description: 'Chocolate hampers',
        icon: 'choc',
        sortOrder: 2,
        status: 'ACTIVE',
      },
    ],
    'gift_categories',
  );

  // ------------------------------------------------------------------ gift_products
  await seedRows(
    manager,
    GiftProduct,
    [
      {
        id: uid('giftproduct:1'),
        categoryId: uid('giftcat:1'),
        name: 'Rose Bouquet',
        slug: 'rose-bouquet',
        description: '12 red roses bouquet',
        price: 1200,
        imageUrl: '/uploads/gifts/roses.jpg',
        status: 'ACTIVE',
      },
      {
        id: uid('giftproduct:2'),
        categoryId: uid('giftcat:2'),
        name: 'Chocolate Hamper',
        slug: 'chocolate-hamper',
        description: 'Assorted chocolates box',
        price: 900,
        imageUrl: '/uploads/gifts/choc.jpg',
        status: 'ACTIVE',
      },
      {
        id: uid('giftproduct:3'),
        categoryId: uid('giftcat:2'),
        name: 'Truffle Box',
        slug: 'truffle-box',
        description: 'Premium truffles selection',
        price: 1400,
        imageUrl: '/uploads/gifts/truffle.jpg',
        status: 'ACTIVE',
      },
    ],
    'gift_products',
  );

  // ------------------------------------------------------------------- gift_bundles
  await seedRows(
    manager,
    GiftBundle,
    [
      {
        id: uid('giftbundle:1'),
        name: 'Romance Combo',
        slug: 'romance-combo',
        description: 'Flowers + chocolates',
        price: 1900,
        status: 'ACTIVE',
      },
    ],
    'gift_bundles',
  );

  // --------------------------------------------------------------- gift_bundle_items
  await seedRows(
    manager,
    GiftBundleItem,
    [
      {
        id: uid('giftbundleitem:1'),
        bundleId: uid('giftbundle:1'),
        giftProductId: uid('giftproduct:1'),
        quantity: 1,
      },
      {
        id: uid('giftbundleitem:2'),
        bundleId: uid('giftbundle:1'),
        giftProductId: uid('giftproduct:2'),
        quantity: 1,
      },
    ],
    'gift_bundle_items',
  );

  // ------------------------------------------------------------------ gift_messages
  await seedRows(
    manager,
    GiftMessage,
    [
      {
        id: uid('giftmessage:1'),
        orderId: uid('customorder:1'),
        giftProductId: uid('giftproduct:1'),
        message: 'Happy Birthday! Wishing you a wonderful year ahead.',
        fromName: 'Ayesha',
        toName: 'Farhana',
        createdAt: daysFromNow(-2),
      },
    ],
    'gift_messages',
  );

  // ----------------------------------------------------------------- gift_wrappings
  await seedRows(
    manager,
    GiftWrapping,
    [
      {
        id: uid('giftwrapping:1'),
        name: 'Standard Gift Wrap',
        price: 50,
        imageUrl: '/uploads/gifts/wrap-standard.jpg',
        status: 'ACTIVE',
      },
      {
        id: uid('giftwrapping:2'),
        name: 'Premium Velvet Wrap',
        price: 150,
        imageUrl: '/uploads/gifts/wrap-premium.jpg',
        status: 'ACTIVE',
      },
    ],
    'gift_wrappings',
  );

  // ------------------------------------------------------------------ gift_occasions
  await seedRows(
    manager,
    GiftOccasion,
    [
      {
        id: uid('giftoccasion:1'),
        name: 'Birthday',
        slug: 'birthday',
        icon: 'cake',
        status: 'ACTIVE',
      },
      {
        id: uid('giftoccasion:2'),
        name: 'Anniversary',
        slug: 'anniversary',
        icon: 'ring',
        status: 'ACTIVE',
      },
      {
        id: uid('giftoccasion:3'),
        name: 'Graduation',
        slug: 'graduation',
        icon: 'cap',
        status: 'ACTIVE',
      },
    ],
    'gift_occasions',
  );

  // ----------------------------------------------------------------- gift_recipients
  await seedRows(
    manager,
    GiftRecipient,
    [
      {
        id: uid('giftrecipient:1'),
        orderId: uid('customorder:1'),
        name: 'Farhana Islam',
        phone: '01700000005',
        email: 'farhana@boilagbe.test',
        address: 'House 12, Road 5, Dhanmondi',
        note: 'Leave with reception',
      },
    ],
    'gift_recipients',
  );

  // ----------------------------------------------------------------- print_services
  await seedRows(
    manager,
    PrintService,
    [
      {
        id: uid('printservice:1'),
        serviceCode: 'PS-001',
        name: 'Black & White Printing',
        description: 'Single-side B/W printing',
        pricePerPage: 2,
        minOrder: 10,
        maxOrder: 500,
        turnaroundDays: 2,
        status: 'ACTIVE',
      },
      {
        id: uid('printservice:2'),
        serviceCode: 'PS-002',
        name: 'Color Printing',
        description: 'Full color printing',
        pricePerPage: 8,
        minOrder: 10,
        maxOrder: 500,
        turnaroundDays: 3,
        status: 'ACTIVE',
      },
    ],
    'print_services',
  );

  // ----------------------------------------------------------------- print_pricings
  await seedRows(
    manager,
    PrintPricing,
    [
      {
        id: uid('printpricing:1'),
        serviceId: uid('printservice:1'),
        pageRange: '1-100',
        pricePerPage: 2,
        pricePerCopy: 40,
        minQuantity: 1,
      },
      {
        id: uid('printpricing:2'),
        serviceId: uid('printservice:2'),
        pageRange: '1-100',
        pricePerPage: 8,
        pricePerCopy: 120,
        minQuantity: 1,
      },
    ],
    'print_pricings',
  );

  // -------------------------------------------------------------------- print_jobs
  await seedRows(
    manager,
    PrintJob,
    [
      {
        id: uid('printjob:1'),
        jobCode: 'PJ-2026-0001',
        serviceId: uid('printservice:1'),
        orderId: uid('customorder:1'),
        userId: uid('user:customer-1'),
        quantity: 50,
        totalAmount: 400,
        remarks: 'Print notes for exam prep',
        status: 'COMPLETED',
        startedBy: uid('user:staff-1'),
        startedAt: daysFromNow(-6),
        completedAt: daysFromNow(-4),
      },
      {
        id: uid('printjob:2'),
        jobCode: 'PJ-2026-0002',
        serviceId: uid('printservice:2'),
        userId: uid('user:customer-2'),
        quantity: 20,
        totalAmount: 320,
        remarks: 'Color brochures',
        status: 'PENDING',
      },
    ],
    'print_jobs',
  );

  // ------------------------------------------------------------------- print_files
  await seedRows(
    manager,
    PrintFile,
    [
      {
        id: uid('printfiles:1'),
        jobId: uid('printjob:1'),
        fileName: 'notes-print.pdf',
        fileUrl: '/uploads/print/notes-print.pdf',
        fileType: 'application/pdf',
        fileSize: 1200000,
      },
    ],
    'print_files',
  );

  // ---------------------------------------------------------------- print_deliveries
  await seedRows(
    manager,
    PrintDelivery,
    [
      {
        id: uid('printdelivery:1'),
        jobId: uid('printjob:1'),
        scheduledDate: daysFromNow(-3),
        address: 'House 12, Road 5, Dhanmondi',
        deliveredAt: daysFromNow(-3),
        status: 'DELIVERED',
      },
    ],
    'print_deliveries',
  );

  // --------------------------------------------------------------- custom_analytics
  await seedRows(
    manager,
    CustomAnalytics,
    [
      {
        id: uid('customanalytics:1'),
        period: '2026-06',
        metric: 'totalOrders',
        value: 15,
        generatedAt: daysFromNow(-30),
      },
      {
        id: uid('customanalytics:2'),
        period: '2026-06',
        metric: 'totalRevenue',
        value: 45000,
        generatedAt: daysFromNow(-30),
      },
      {
        id: uid('customanalytics:3'),
        period: '2026-07',
        metric: 'totalOrders',
        value: 9,
        generatedAt: daysFromNow(-5),
      },
    ],
    'custom_analytics',
  );

  // ----------------------------------------------------------------- custom_reports
  await seedRows(
    manager,
    CustomReport,
    [
      {
        id: uid('customreport:1'),
        reportCode: 'CR-0001',
        title: 'Custom Orders June 2026',
        reportType: 'ORDERS',
        periodStart: daysFromNow(-30),
        periodEnd: daysFromNow(-1),
        fileUrl: '/reports/custom/cr-0001.pdf',
        generatedBy: uid('user:staff-1'),
        status: 'GENERATED',
      },
    ],
    'custom_reports',
  );

  void ctx;
}
