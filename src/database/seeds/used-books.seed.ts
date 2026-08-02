import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
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
} from '../../admin/used-books/entities';

/**
 * Used-book buyback lifecycle seed. Keys shared across domains:
 *   ubreq:1..3, ubitem:1..5
 */
export async function seedUsedBooks(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // ------------------------------------------------------- used_book_sell_requests
  await seedRows(
    manager,
    UsedBookSellRequest,
    [
      {
        id: uid('ubreq:1'),
        requestCode: 'UB-2026-0001',
        userId: uid('user:student-1'),
        status: 'ACCEPTED',
        notes: 'Selling 2nd hand HSC books',
        reviewedBy: uid('user:staff-1'),
        reviewedAt: daysFromNow(-6),
      },
      {
        id: uid('ubreq:2'),
        requestCode: 'UB-2026-0002',
        userId: uid('user:customer-1'),
        status: 'PENDING_REVIEW',
        notes: 'Novels in good condition',
      },
      {
        id: uid('ubreq:3'),
        requestCode: 'UB-2026-0003',
        userId: uid('user:customer-2'),
        status: 'COMPLETED',
        notes: 'Sold chemistry reference',
        reviewedBy: uid('user:staff-1'),
        reviewedAt: daysFromNow(-20),
      },
    ],
    'used_book_sell_requests',
  );

  // ---------------------------------------------------------------- used_book_items
  await seedRows(
    manager,
    UsedBookItem,
    [
      {
        id: uid('ubitem:1'),
        requestId: uid('ubreq:1'),
        title: 'Physics for Higher Secondary',
        author: 'Dr. A.K.M. Hafizur Rahman',
        isbn: '9789845060011',
        edition: '5th Edition',
        condition: 'GOOD',
        quantity: 1,
        expectedPrice: 450,
        imageUrl: '/uploads/used-books/ub-1.jpg',
        status: 'PUBLISHED',
      },
      {
        id: uid('ubitem:2'),
        requestId: uid('ubreq:1'),
        title: 'Higher Mathematics',
        author: 'Farida Yasmin',
        isbn: '9789845060028',
        edition: '4th Edition',
        condition: 'FAIR',
        quantity: 1,
        expectedPrice: 350,
        imageUrl: '/uploads/used-books/ub-2.jpg',
        status: 'APPROVED',
      },
      {
        id: uid('ubitem:3'),
        requestId: uid('ubreq:2'),
        title: 'Chander Pahar',
        author: 'Bibhutibhushan Bandyopadhyay',
        edition: 'Classic',
        condition: 'EXCELLENT',
        quantity: 1,
        expectedPrice: 200,
        imageUrl: '/uploads/used-books/ub-3.jpg',
        status: 'PENDING_EVALUATION',
      },
      {
        id: uid('ubitem:4'),
        requestId: uid('ubreq:3'),
        title: 'Organic Chemistry',
        author: 'S.M. Zahid Hasan',
        isbn: '9789845060035',
        edition: '3rd Edition',
        condition: 'GOOD',
        quantity: 1,
        expectedPrice: 700,
        imageUrl: '/uploads/used-books/ub-4.jpg',
        status: 'SOLD',
      },
      {
        id: uid('ubitem:5'),
        requestId: uid('ubreq:2'),
        title: 'Bengali Poetry Collection',
        condition: 'POOR',
        quantity: 1,
        expectedPrice: 100,
        status: 'REJECTED',
      },
    ],
    'used_book_items',
  );

  // ------------------------------------------------------------- used_book_images
  await seedRows(
    manager,
    UsedBookImage,
    [
      {
        id: uid('ubimg:1'),
        itemId: uid('ubitem:1'),
        imageUrl: '/uploads/used-books/ub-1a.jpg',
        sortOrder: 1,
      },
      {
        id: uid('ubimg:2'),
        itemId: uid('ubitem:1'),
        imageUrl: '/uploads/used-books/ub-1b.jpg',
        sortOrder: 2,
      },
      {
        id: uid('ubimg:3'),
        itemId: uid('ubitem:3'),
        imageUrl: '/uploads/used-books/ub-3a.jpg',
        sortOrder: 1,
      },
    ],
    'used_book_images',
  );

  // --------------------------------------------------------- used_book_evaluations
  await seedRows(
    manager,
    UsedBookEvaluation,
    [
      {
        id: uid('ubeval:1'),
        itemId: uid('ubitem:1'),
        evaluatedBy: uid('user:staff-1'),
        conditionGrade: 'GOOD',
        estimatedPrice: 400,
        remarks: 'Minor wear on cover',
        evaluatedAt: daysFromNow(-5),
      },
      {
        id: uid('ubeval:2'),
        itemId: uid('ubitem:4'),
        evaluatedBy: uid('user:staff-1'),
        conditionGrade: 'GOOD',
        estimatedPrice: 650,
        remarks: 'Clean copy',
        evaluatedAt: daysFromNow(-19),
      },
      {
        id: uid('ubeval:3'),
        itemId: uid('ubitem:3'),
        evaluatedBy: uid('user:staff-1'),
        conditionGrade: 'EXCELLENT',
        estimatedPrice: 180,
        remarks: 'Looks new',
        evaluatedAt: daysFromNow(-2),
      },
    ],
    'used_book_evaluations',
  );

  // ---------------------------------------------------------------- used_book_offers
  await seedRows(
    manager,
    UsedBookOffer,
    [
      {
        id: uid('uboffer:1'),
        itemId: uid('ubitem:1'),
        offerAmount: 400,
        status: 'ACCEPTED',
        offeredBy: uid('user:staff-1'),
        offeredAt: daysFromNow(-4),
        respondedAt: daysFromNow(-3),
      },
      {
        id: uid('uboffer:2'),
        itemId: uid('ubitem:2'),
        offerAmount: 300,
        status: 'PENDING',
        offeredBy: uid('user:staff-1'),
        offeredAt: daysFromNow(-2),
      },
      {
        id: uid('uboffer:3'),
        itemId: uid('ubitem:4'),
        offerAmount: 650,
        status: 'ACCEPTED',
        offeredBy: uid('user:staff-1'),
        offeredAt: daysFromNow(-18),
        respondedAt: daysFromNow(-17),
      },
    ],
    'used_book_offers',
  );

  // ------------------------------------------------------------- used_book_approvals
  await seedRows(
    manager,
    UsedBookApproval,
    [
      {
        id: uid('ubapproval:1'),
        itemId: uid('ubitem:1'),
        offerId: uid('uboffer:1'),
        requestedBy: uid('user:staff-1'),
        approvedBy: uid('user:staff-1'),
        status: 'APPROVED',
        remarks: 'Offer approved',
        approvedAt: daysFromNow(-3),
      },
      {
        id: uid('ubapproval:2'),
        itemId: uid('ubitem:2'),
        offerId: uid('uboffer:2'),
        requestedBy: uid('user:staff-1'),
        status: 'PENDING',
      },
    ],
    'used_book_approvals',
  );

  // ---------------------------------------------------------------- used_book_pickups
  await seedRows(
    manager,
    UsedBookPickup,
    [
      {
        id: uid('ubpickup:1'),
        requestId: uid('ubreq:1'),
        scheduledAt: daysFromNow(1, 10),
        address: 'House 12, Road 5, Dhanmondi',
        contactName: 'Rahim Uddin',
        contactPhone: '01700000002',
        remarks: 'Call before arrival',
        status: 'SCHEDULED',
        scheduledBy: uid('user:staff-1'),
      },
      {
        id: uid('ubpickup:2'),
        requestId: uid('ubreq:3'),
        scheduledAt: daysFromNow(-18, 10),
        address: 'Flat 3B, Green Tower, Uttara',
        contactName: 'Mahmudul Hasan',
        contactPhone: '01700000006',
        status: 'COMPLETED',
        scheduledBy: uid('user:staff-1'),
        pickedUpAt: daysFromNow(-17),
      },
    ],
    'used_book_pickups',
  );

  // ------------------------------------------------------------ used_book_inspections
  await seedRows(
    manager,
    UsedBookInspection,
    [
      {
        id: uid('ubinspect:1'),
        itemId: uid('ubitem:1'),
        inspectedBy: uid('user:staff-1'),
        inspectionDate: daysFromNow(-3),
        conditionGrade: 'GOOD',
        repairNeeded: false,
        decision: 'ACCEPT',
        remarks: 'Accepted for resale',
        inspectedAt: daysFromNow(-3),
      },
      {
        id: uid('ubinspect:2'),
        itemId: uid('ubitem:2'),
        inspectedBy: uid('user:staff-1'),
        inspectionDate: daysFromNow(-1),
        conditionGrade: 'FAIR',
        repairNeeded: true,
        decision: 'REPAIR',
        remarks: 'Cover needs minor repair',
        inspectedAt: daysFromNow(-1),
      },
    ],
    'used_book_inspections',
  );

  // ----------------------------------------------------------- used_book_inventories
  await seedRows(
    manager,
    UsedBookInventory,
    [
      {
        id: uid('ubinventory:1'),
        itemId: uid('ubitem:1'),
        warehouseId: uid('warehouse:1'),
        location: 'Zone A - Shelf 1',
        quantity: 1,
        status: 'IN_STOCK',
        receivedAt: daysFromNow(-2),
      },
      {
        id: uid('ubinventory:2'),
        itemId: uid('ubitem:4'),
        warehouseId: uid('warehouse:1'),
        location: 'Zone A - Shelf 2',
        quantity: 1,
        status: 'SOLD',
        receivedAt: daysFromNow(-16),
      },
    ],
    'used_book_inventories',
  );

  // -------------------------------------------------------------- used_book_pricings
  await seedRows(
    manager,
    UsedBookPricing,
    [
      {
        id: uid('ubpricing:1'),
        itemId: uid('ubitem:1'),
        basePrice: 400,
        sellingPrice: 550,
        discount: 0,
        setBy: uid('user:staff-1'),
        setAt: daysFromNow(-2),
      },
      {
        id: uid('ubpricing:2'),
        itemId: uid('ubitem:4'),
        basePrice: 650,
        sellingPrice: 850,
        discount: 0,
        setBy: uid('user:staff-1'),
        setAt: daysFromNow(-15),
      },
    ],
    'used_book_pricings',
  );

  // ---------------------------------------------------------------- used_book_resales
  await seedRows(
    manager,
    UsedBookResale,
    [
      {
        id: uid('ubresale:1'),
        itemId: uid('ubitem:1'),
        listingCode: 'LS-2026-001',
        status: 'LISTED',
        listedBy: uid('user:staff-1'),
        listedAt: daysFromNow(-2),
      },
      {
        id: uid('ubresale:2'),
        itemId: uid('ubitem:4'),
        listingCode: 'LS-2026-002',
        status: 'SOLD',
        listedBy: uid('user:staff-1'),
        listedAt: daysFromNow(-15),
        soldAt: daysFromNow(-5),
      },
    ],
    'used_book_resales',
  );

  // --------------------------------------------------------------- used_book_histories
  await seedRows(
    manager,
    UsedBookHistory,
    [
      {
        id: uid('ubhist:1'),
        requestId: uid('ubreq:1'),
        itemId: uid('ubitem:1'),
        action: 'REQUEST_CREATED',
        description: 'Sell request submitted',
        performedBy: uid('user:student-1'),
        createdAt: daysFromNow(-8),
      },
      {
        id: uid('ubhist:2'),
        requestId: uid('ubreq:1'),
        itemId: uid('ubitem:1'),
        action: 'PUBLISHED',
        description: 'Item published for resale',
        performedBy: uid('user:staff-1'),
        createdAt: daysFromNow(-2),
      },
    ],
    'used_book_histories',
  );

  // --------------------------------------------------------------- used_book_payments
  await seedRows(
    manager,
    UsedBookPayment,
    [
      {
        id: uid('ubpayment:1'),
        requestId: uid('ubreq:3'),
        sellerId: uid('user:customer-2'),
        amount: 650,
        method: 'MOBILE_BANKING',
        reference: 'BKASH-001',
        status: 'PAID',
        paidAt: daysFromNow(-14),
      },
      {
        id: uid('ubpayment:2'),
        requestId: uid('ubreq:1'),
        sellerId: uid('user:student-1'),
        amount: 400,
        method: 'WALLET',
        status: 'PENDING',
      },
    ],
    'used_book_payments',
  );

  // -------------------------------------------------------- used_book_condition_reports
  await seedRows(
    manager,
    UsedBookConditionReport,
    [
      {
        id: uid('ubcond:1'),
        itemId: uid('ubitem:1'),
        reportNumber: 'CR-001',
        overallGrade: 'GOOD',
        pagesCondition: 'All pages intact',
        coverCondition: 'Minor wear',
        annotations: 'Few pencil notes',
        remarks: 'Acceptable for resale',
      },
      {
        id: uid('ubcond:2'),
        itemId: uid('ubitem:3'),
        reportNumber: 'CR-002',
        overallGrade: 'EXCELLENT',
        pagesCondition: 'Clean',
        coverCondition: 'Like new',
        remarks: 'Premium condition',
      },
    ],
    'used_book_condition_reports',
  );

  // ----------------------------------------------------------------- used_book_repairs
  await seedRows(
    manager,
    UsedBookRepair,
    [
      {
        id: uid('ubrepair:1'),
        itemId: uid('ubitem:2'),
        repairType: 'COVER_REPAIR',
        cost: 50,
        description: 'Repair torn cover edge',
        status: 'IN_PROGRESS',
        performedBy: uid('user:staff-1'),
      },
    ],
    'used_book_repairs',
  );

  // ---------------------------------------------------------- used_book_reject_reasons
  await seedRows(
    manager,
    UsedBookRejectReason,
    [
      {
        id: uid('ubrejectreason:1'),
        code: 'DAMAGED',
        name: 'Damaged',
        description: 'Book is damaged beyond acceptable condition',
        status: 'ACTIVE',
      },
      {
        id: uid('ubrejectreason:2'),
        code: 'MISSING_PAGES',
        name: 'Missing Pages',
        description: 'Book has missing pages',
        status: 'ACTIVE',
      },
      {
        id: uid('ubrejectreason:3'),
        code: 'NOT_ELIGIBLE',
        name: 'Not Eligible',
        description: 'Book type not eligible for buyback',
        status: 'ACTIVE',
      },
    ],
    'used_book_reject_reasons',
  );

  // --------------------------------------------------------------- used_book_returns
  await seedRows(
    manager,
    UsedBookReturn,
    [
      {
        id: uid('ubreturn:1'),
        itemId: uid('ubitem:5'),
        requestId: uid('ubreq:2'),
        reason: 'Customer changed mind',
        status: 'COMPLETED',
        returnedAt: daysFromNow(-1),
      },
    ],
    'used_book_returns',
  );

  // ----------------------------------------------------------------- used_book_audits
  await seedRows(
    manager,
    UsedBookAudit,
    [
      {
        id: uid('ubaudit:1'),
        userId: uid('user:staff-1'),
        module: 'used-books',
        action: 'APPROVE_OFFER',
        referenceType: 'offer',
        referenceId: uid('uboffer:1'),
        newValue: { status: 'ACCEPTED' },
        ipAddress: '127.0.0.1',
        createdAt: daysFromNow(-3),
      },
    ],
    'used_book_audits',
  );

  // ------------------------------------------------------------ used_book_analytics
  await seedRows(
    manager,
    UsedBookAnalytics,
    [
      {
        id: uid('ubanalytics:1'),
        period: '2026-06',
        metric: 'totalRequests',
        value: 12,
        generatedAt: daysFromNow(-30),
        createdAt: daysFromNow(-30),
      },
      {
        id: uid('ubanalytics:2'),
        period: '2026-06',
        metric: 'totalValue',
        value: 6500,
        generatedAt: daysFromNow(-30),
        createdAt: daysFromNow(-30),
      },
      {
        id: uid('ubanalytics:3'),
        period: '2026-07',
        metric: 'totalRequests',
        value: 8,
        generatedAt: daysFromNow(-5),
        createdAt: daysFromNow(-5),
      },
    ],
    'used_book_analytics',
  );

  // ----------------------------------------------------------- used_book_settlements
  await seedRows(
    manager,
    UsedBookSettlement,
    [
      {
        id: uid('ubsettle:1'),
        requestId: uid('ubreq:3'),
        sellerId: uid('user:customer-2'),
        amount: 650,
        status: 'SETTLED',
        reference: 'SETTLE-001',
        settledAt: daysFromNow(-13),
      },
      {
        id: uid('ubsettle:2'),
        requestId: uid('ubreq:1'),
        sellerId: uid('user:student-1'),
        amount: 400,
        status: 'PROCESSING',
      },
    ],
    'used_book_settlements',
  );

  void ctx;
}
