import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
import {
  Rider,
  RiderDocument,
  RiderVehicle,
  RiderArea,
  RiderRoute,
  RiderAvailability,
  RiderShift,
  RiderAttendance,
  RiderAssignment,
  RiderDelivery,
  RiderTracking,
  RiderLocationHistory,
  RiderOTP,
  RiderProof,
  RiderDeliveryAttempt,
  RiderEarning,
  RiderSettlement,
  RiderWallet,
  RiderWalletTransaction,
  RiderPenalty,
  RiderBonus,
  RiderRating,
  RiderPerformance,
  RiderIncident,
  RiderNotification,
  RiderAnnouncement,
  RiderLeave,
  RiderHistory,
  RiderAnalytics,
  RiderReport,
} from '../../admin/riders/entities';

/**
 * Rider domain seed. Keys shared across domains:
 *   rider:1 | rider:2, riderwallet:1 | riderwallet:2
 */
export async function seedRiders(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // ------------------------------------------------------------------ riders
  await seedRows(
    manager,
    Rider,
    [
      {
        id: uid('rider:1'),
        userId: uid('user:rider-1'),
        riderCode: 'RDR-0001',
        fullName: 'Jasim Uddin',
        phone: '01700000010',
        email: 'rider1@boilagbe.test',
        nationalId: 'NID-RD-001',
        dateOfBirth: '1995-03-12',
        joiningDate: '2024-02-01',
        employmentType: 'FULL_TIME',
        salaryType: 'PER_DELIVERY',
        baseSalary: 5000,
        commissionRate: 10,
        status: 'ACTIVE',
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('rider:2'),
        userId: uid('user:rider-2'),
        riderCode: 'RDR-0002',
        fullName: 'Rafiq Islam',
        phone: '01700000011',
        email: 'rider2@boilagbe.test',
        nationalId: 'NID-RD-002',
        dateOfBirth: '1997-07-25',
        joiningDate: '2024-04-15',
        employmentType: 'FULL_TIME',
        salaryType: 'PER_DELIVERY',
        baseSalary: 4500,
        commissionRate: 10,
        status: 'ACTIVE',
        createdBy: uid('user:staff-1'),
      },
    ],
    'riders',
  );

  // ------------------------------------------------------------ rider_documents
  await seedRows(
    manager,
    RiderDocument,
    [
      {
        id: uid('riderdoc:1'),
        riderId: uid('rider:1'),
        documentType: 'NID',
        documentNumber: 'NID-RD-001',
        fileUrl: '/uploads/riders/nid-1.jpg',
        verificationStatus: 'APPROVED',
        verifiedBy: uid('user:staff-1'),
        verifiedAt: daysFromNow(-50),
      },
      {
        id: uid('riderdoc:2'),
        riderId: uid('rider:2'),
        documentType: 'DRIVING_LICENSE',
        documentNumber: 'DL-0002',
        fileUrl: '/uploads/riders/dl-2.jpg',
        verificationStatus: 'PENDING',
      },
    ],
    'rider_documents',
  );

  // -------------------------------------------------------------- rider_vehicles
  await seedRows(
    manager,
    RiderVehicle,
    [
      {
        id: uid('ridervehicle:1'),
        riderId: uid('rider:1'),
        vehicleType: 'BIKE',
        model: 'Honda Wave 150',
        registrationNumber: 'DHA-11-0001',
        status: 'ACTIVE',
      },
      {
        id: uid('ridervehicle:2'),
        riderId: uid('rider:2'),
        vehicleType: 'CYCLE',
        model: 'Giant Escape 3',
        status: 'ACTIVE',
      },
    ],
    'rider_vehicles',
  );

  // ----------------------------------------------------------------- rider_areas
  await seedRows(
    manager,
    RiderArea,
    [
      {
        id: uid('riderarea:1'),
        riderId: uid('rider:1'),
        areaId: uid('area:dhanmondi'),
        isPrimary: true,
        status: 'ACTIVE',
      },
      {
        id: uid('riderarea:2'),
        riderId: uid('rider:1'),
        areaId: uid('area:mirpur'),
        isPrimary: false,
        status: 'ACTIVE',
      },
      {
        id: uid('riderarea:3'),
        riderId: uid('rider:2'),
        areaId: uid('area:uttara'),
        isPrimary: true,
        status: 'ACTIVE',
      },
    ],
    'rider_areas',
  );

  // ----------------------------------------------------------------- rider_routes
  await seedRows(
    manager,
    RiderRoute,
    [
      {
        id: uid('riderroute:1'),
        riderId: uid('rider:1'),
        routeName: 'Dhanmondi - Mirpur',
        startAreaId: uid('area:dhanmondi'),
        endAreaId: uid('area:mirpur'),
        distanceKm: 6.5,
        status: 'ACTIVE',
      },
      {
        id: uid('riderroute:2'),
        riderId: uid('rider:2'),
        routeName: 'Uttara Loop',
        startAreaId: uid('area:uttara'),
        endAreaId: uid('area:uttara'),
        distanceKm: 5.0,
        status: 'ACTIVE',
      },
    ],
    'rider_routes',
  );

  // --------------------------------------------------------- rider_availabilities
  await seedRows(
    manager,
    RiderAvailability,
    [
      {
        id: uid('rideravail:1'),
        riderId: uid('rider:1'),
        date: daysFromNow(0),
        fromTime: '09:00:00',
        toTime: '21:00:00',
        status: 'AVAILABLE',
      },
      {
        id: uid('rideravail:2'),
        riderId: uid('rider:2'),
        date: daysFromNow(0),
        fromTime: '10:00:00',
        toTime: '20:00:00',
        status: 'BUSY',
      },
    ],
    'rider_availabilities',
  );

  // ----------------------------------------------------------------- rider_shifts
  await seedRows(
    manager,
    RiderShift,
    [
      {
        id: uid('ridershift:1'),
        riderId: uid('rider:1'),
        shiftDate: daysFromNow(-1),
        startTime: '09:00:00',
        endTime: '18:00:00',
        status: 'COMPLETED',
      },
      {
        id: uid('ridershift:2'),
        riderId: uid('rider:2'),
        shiftDate: daysFromNow(-1),
        startTime: '10:00:00',
        endTime: '19:00:00',
        status: 'COMPLETED',
      },
    ],
    'rider_shifts',
  );

  // ------------------------------------------------------------ rider_attendances
  await seedRows(
    manager,
    RiderAttendance,
    [
      {
        id: uid('rideratt:1'),
        riderId: uid('rider:1'),
        checkIn: daysFromNow(-1, 9),
        checkOut: daysFromNow(-1, 18),
        workingHours: 8.5,
        status: 'PRESENT',
      },
      {
        id: uid('rideratt:2'),
        riderId: uid('rider:2'),
        checkIn: daysFromNow(-1, 10),
        checkOut: daysFromNow(-1, 19),
        workingHours: 8,
        status: 'PRESENT',
      },
      {
        id: uid('rideratt:3'),
        riderId: uid('rider:1'),
        checkIn: daysFromNow(-2, 9),
        checkOut: daysFromNow(-2, 18),
        workingHours: 8.5,
        status: 'LATE',
      },
    ],
    'rider_attendances',
  );

  // ----------------------------------------------------------- rider_assignments
  await seedRows(
    manager,
    RiderAssignment,
    [
      {
        id: uid('riderassign:1'),
        riderId: uid('rider:1'),
        orderId: uid('order:2'),
        assignmentType: 'DELIVERY',
        assignedAt: daysFromNow(-4),
        status: 'COMPLETED',
      },
      {
        id: uid('riderassign:2'),
        riderId: uid('rider:1'),
        orderId: uid('order:4'),
        assignmentType: 'DELIVERY',
        assignedAt: daysFromNow(-1),
        status: 'ACCEPTED',
      },
      {
        id: uid('riderassign:3'),
        riderId: uid('rider:2'),
        orderId: uid('order:5'),
        assignmentType: 'DELIVERY',
        assignedAt: daysFromNow(-1),
        status: 'PENDING',
      },
    ],
    'rider_assignments',
  );

  // ------------------------------------------------------------- rider_deliveries
  await seedRows(
    manager,
    RiderDelivery,
    [
      {
        id: uid('riderdelivery:1'),
        riderId: uid('rider:1'),
        orderId: uid('order:2'),
        pickupAddress: 'Central Warehouse, Mirpur',
        deliveryAddress: 'House 12, Road 5, Dhanmondi',
        distanceKm: 5.2,
        status: 'DELIVERED',
        pickedAt: daysFromNow(-4),
        deliveredAt: daysFromNow(-3),
      },
      {
        id: uid('riderdelivery:2'),
        riderId: uid('rider:1'),
        orderId: uid('order:4'),
        pickupAddress: 'Central Warehouse, Mirpur',
        deliveryAddress: 'Flat 3B, Green Tower, Uttara',
        distanceKm: 8.1,
        status: 'IN_TRANSIT',
        pickedAt: daysFromNow(-1),
      },
      {
        id: uid('riderdelivery:3'),
        riderId: uid('rider:2'),
        orderId: uid('order:5'),
        pickupAddress: 'Regional Warehouse, Uttara',
        deliveryAddress: 'GEC Circle, Chattogram',
        distanceKm: 245,
        status: 'PENDING',
      },
    ],
    'rider_deliveries',
  );

  // ------------------------------------------------------------- rider_tracking
  await seedRows(
    manager,
    RiderTracking,
    [
      {
        id: uid('ridertrack:1'),
        riderId: uid('rider:1'),
        deliveryId: uid('riderdelivery:1'),
        latitude: 23.746,
        longitude: 90.374,
        location: 'Dhanmondi',
        status: 'DELIVERED',
        trackedAt: daysFromNow(-3),
      },
      {
        id: uid('ridertrack:2'),
        riderId: uid('rider:1'),
        deliveryId: uid('riderdelivery:2'),
        latitude: 23.81,
        longitude: 90.4,
        location: 'Mirpur - Uttara road',
        status: 'IN_TRANSIT',
        trackedAt: daysFromNow(0),
      },
    ],
    'rider_tracking',
  );

  // ------------------------------------------------------ rider_location_histories
  await seedRows(
    manager,
    RiderLocationHistory,
    [
      {
        id: uid('riderloc:1'),
        riderId: uid('rider:1'),
        latitude: 23.746,
        longitude: 90.374,
        location: 'Dhanmondi',
        recordedAt: daysFromNow(0),
      },
      {
        id: uid('riderloc:2'),
        riderId: uid('rider:2'),
        latitude: 23.875,
        longitude: 90.379,
        location: 'Uttara',
        recordedAt: daysFromNow(0),
      },
    ],
    'rider_location_histories',
  );

  // ----------------------------------------------------------------- rider_otps
  await seedRows(
    manager,
    RiderOTP,
    [
      {
        id: uid('riderotp:1'),
        riderId: uid('rider:1'),
        otp: '112233',
        purpose: 'DELIVERY',
        expiresAt: daysFromNow(1),
        status: 'PENDING',
      },
      {
        id: uid('riderotp:2'),
        riderId: uid('rider:1'),
        otp: '445566',
        purpose: 'DELIVERY',
        expiresAt: daysFromNow(-1),
        status: 'VERIFIED',
      },
    ],
    'rider_otps',
  );

  // ---------------------------------------------------------------- rider_proofs
  await seedRows(
    manager,
    RiderProof,
    [
      {
        id: uid('riderproof:1'),
        riderId: uid('rider:1'),
        deliveryId: uid('riderdelivery:1'),
        proofType: 'PHOTO',
        fileUrl: '/uploads/riders/proof-1.jpg',
        verified: true,
      },
      {
        id: uid('riderproof:2'),
        riderId: uid('rider:1'),
        deliveryId: uid('riderdelivery:2'),
        proofType: 'SIGNATURE',
        fileUrl: '/uploads/riders/sig-2.png',
        verified: false,
      },
    ],
    'rider_proofs',
  );

  // ------------------------------------------------------- rider_delivery_attempts
  await seedRows(
    manager,
    RiderDeliveryAttempt,
    [
      {
        id: uid('riderattempt:1'),
        riderId: uid('rider:1'),
        orderId: uid('order:2'),
        attemptedAt: daysFromNow(-4),
        result: 'SUCCESS',
        note: 'Delivered to customer',
      },
      {
        id: uid('riderattempt:2'),
        riderId: uid('rider:2'),
        orderId: uid('order:5'),
        attemptedAt: daysFromNow(-1),
        result: 'FAILED',
        note: 'Recipient not available',
      },
    ],
    'rider_delivery_attempts',
  );

  // --------------------------------------------------------------- rider_earnings
  await seedRows(
    manager,
    RiderEarning,
    [
      {
        id: uid('riderearning:1'),
        riderId: uid('rider:1'),
        orderId: uid('order:2'),
        earningType: 'DELIVERY_FEE',
        amount: 120,
        status: 'PAID',
        createdAt: daysFromNow(-3),
      },
      {
        id: uid('riderearning:2'),
        riderId: uid('rider:1'),
        orderId: uid('order:4'),
        earningType: 'DELIVERY_FEE',
        amount: 140,
        status: 'PENDING',
        createdAt: daysFromNow(-1),
      },
      {
        id: uid('riderearning:3'),
        riderId: uid('rider:2'),
        orderId: uid('order:5'),
        earningType: 'DELIVERY_FEE',
        amount: 160,
        status: 'PENDING',
        createdAt: daysFromNow(-1),
      },
    ],
    'rider_earnings',
  );

  // ------------------------------------------------------------ rider_settlements
  await seedRows(
    manager,
    RiderSettlement,
    [
      {
        id: uid('ridersettle:1'),
        riderId: uid('rider:1'),
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        grossAmount: 3200,
        deduction: 0,
        netAmount: 3200,
        approvedBy: uid('user:staff-1'),
        paymentStatus: 'PAID',
        paidAt: daysFromNow(-5),
      },
      {
        id: uid('ridersettle:2'),
        riderId: uid('rider:2'),
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        grossAmount: 2500,
        deduction: 100,
        netAmount: 2400,
        paymentStatus: 'PENDING',
      },
    ],
    'rider_settlements',
  );

  // --------------------------------------------------------------- rider_wallets
  await seedRows(
    manager,
    RiderWallet,
    [
      {
        id: uid('riderwallet:1'),
        riderId: uid('rider:1'),
        currentBalance: 2200,
        totalEarned: 9800,
        totalWithdraw: 7600,
        lastUpdated: daysFromNow(-1),
      },
      {
        id: uid('riderwallet:2'),
        riderId: uid('rider:2'),
        currentBalance: 900,
        totalEarned: 6400,
        totalWithdraw: 5500,
        lastUpdated: daysFromNow(-1),
      },
    ],
    'rider_wallets',
  );

  // --------------------------------------------------- rider_wallet_transactions
  await seedRows(
    manager,
    RiderWalletTransaction,
    [
      {
        id: uid('riderwalletx:1'),
        walletId: uid('riderwallet:1'),
        transactionType: 'CREDIT',
        amount: 3200,
        referenceType: 'settlement',
        referenceId: uid('ridersettle:1'),
        balanceBefore: 1000,
        balanceAfter: 4200,
        createdAt: daysFromNow(-5),
      },
      {
        id: uid('riderwalletx:2'),
        walletId: uid('riderwallet:1'),
        transactionType: 'WITHDRAWAL',
        amount: 2000,
        referenceType: 'withdraw',
        balanceBefore: 4200,
        balanceAfter: 2200,
        createdAt: daysFromNow(-2),
      },
    ],
    'rider_wallet_transactions',
  );

  // --------------------------------------------------------------- rider_penalties
  await seedRows(
    manager,
    RiderPenalty,
    [
      {
        id: uid('riderpenalty:1'),
        riderId: uid('rider:2'),
        title: 'Failed Delivery Attempt',
        amount: 100,
        reason: 'Attempt failed without rescheduling',
        approvedBy: uid('user:staff-1'),
        createdAt: daysFromNow(-2),
      },
    ],
    'rider_penalties',
  );

  // ----------------------------------------------------------------- rider_bonuses
  await seedRows(
    manager,
    RiderBonus,
    [
      {
        id: uid('riderbonus:1'),
        riderId: uid('rider:1'),
        title: '100 Deliveries Bonus',
        amount: 1000,
        reason: 'Completed 100 deliveries this month',
        approvedBy: uid('user:staff-1'),
        createdAt: daysFromNow(-3),
      },
    ],
    'rider_bonuses',
  );

  // ----------------------------------------------------------------- rider_ratings
  await seedRows(
    manager,
    RiderRating,
    [
      {
        id: uid('riderrating:1'),
        riderId: uid('rider:1'),
        orderId: uid('order:2'),
        userId: uid('user:customer-1'),
        rating: 5,
        comment: 'Fast and polite delivery',
        createdAt: daysFromNow(-3),
      },
      {
        id: uid('riderrating:2'),
        riderId: uid('rider:2'),
        orderId: uid('order:5'),
        userId: uid('user:customer-2'),
        rating: 3,
        comment: 'Delayed but acceptable',
        createdAt: daysFromNow(-1),
      },
    ],
    'rider_ratings',
  );

  // ------------------------------------------------------------ rider_performances
  await seedRows(
    manager,
    RiderPerformance,
    [
      {
        id: uid('riderperf:1'),
        riderId: uid('rider:1'),
        month: 6,
        year: 2026,
        totalDeliveries: 42,
        completedDeliveries: 40,
        failedDeliveries: 2,
        onTimeRate: 95,
        customerRating: 4.8,
        performanceScore: 92,
      },
      {
        id: uid('riderperf:2'),
        riderId: uid('rider:2'),
        month: 6,
        year: 2026,
        totalDeliveries: 30,
        completedDeliveries: 28,
        failedDeliveries: 2,
        onTimeRate: 88,
        customerRating: 4.3,
        performanceScore: 82,
      },
    ],
    'rider_performances',
  );

  // -------------------------------------------------------------- rider_incidents
  await seedRows(
    manager,
    RiderIncident,
    [
      {
        id: uid('riderincident:1'),
        riderId: uid('rider:2'),
        title: 'Accident on duty',
        severity: 'HIGH',
        description: 'Minor accident while delivering near GEC',
        status: 'OPEN',
      },
      {
        id: uid('riderincident:2'),
        riderId: uid('rider:1'),
        title: 'Late shift start',
        severity: 'LOW',
        description: 'Started shift 30 min late',
        status: 'RESOLVED',
      },
    ],
    'rider_incidents',
  );

  // ---------------------------------------------------------- rider_notifications
  await seedRows(
    manager,
    RiderNotification,
    [
      {
        id: uid('ridernotif:1'),
        riderId: uid('rider:1'),
        title: 'New delivery assigned',
        message: 'Order #BL-ORD-1004 assigned to you',
        sentAt: daysFromNow(-1),
        createdAt: daysFromNow(-1),
      },
      {
        id: uid('ridernotif:2'),
        riderId: uid('rider:2'),
        title: 'Wallet credited',
        message: 'BDT 2,500 credited from June settlement',
        sentAt: daysFromNow(-5),
        createdAt: daysFromNow(-5),
      },
    ],
    'rider_notifications',
  );

  // ----------------------------------------------------------- rider_announcements
  await seedRows(
    manager,
    RiderAnnouncement,
    [
      {
        id: uid('riderann:1'),
        riderId: uid('rider:1'),
        title: 'Safety reminder',
        message: 'Please follow traffic rules while delivering.',
        sentBy: uid('user:staff-1'),
        createdAt: daysFromNow(-4),
      },
    ],
    'rider_announcements',
  );

  // ----------------------------------------------------------------- rider_leaves
  await seedRows(
    manager,
    RiderLeave,
    [
      {
        id: uid('riderleave:1'),
        riderId: uid('rider:1'),
        leaveType: 'EARNED',
        startDate: '2026-08-15',
        endDate: '2026-08-16',
        reason: 'Personal work',
        approvalStatus: 'APPROVED',
        approvedBy: uid('user:staff-1'),
      },
      {
        id: uid('riderleave:2'),
        riderId: uid('rider:2'),
        leaveType: 'SICK',
        startDate: '2026-07-25',
        endDate: '2026-07-26',
        reason: 'Fever',
        approvalStatus: 'PENDING',
      },
    ],
    'rider_leaves',
  );

  // --------------------------------------------------------------- rider_histories
  await seedRows(
    manager,
    RiderHistory,
    [
      {
        id: uid('riderhistory:1'),
        riderId: uid('rider:1'),
        eventType: 'SHIFT_START',
        description: 'Shift started at 09:00',
        performedBy: uid('rider:1'),
        createdAt: daysFromNow(-1),
      },
      {
        id: uid('riderhistory:2'),
        riderId: uid('rider:2'),
        eventType: 'DELIVERY_COMPLETE',
        description: 'Completed delivery for order 5',
        performedBy: uid('rider:2'),
        createdAt: daysFromNow(-1),
      },
    ],
    'rider_histories',
  );

  // ------------------------------------------------------------- rider_analytics
  await seedRows(
    manager,
    RiderAnalytics,
    [
      {
        id: uid('rideranalytics:1'),
        riderId: uid('rider:1'),
        date: daysFromNow(-1),
        totalOrders: 5,
        completedOrders: 4,
        totalDistance: 42.5,
        totalEarnings: 560,
        createdAt: daysFromNow(-1),
      },
      {
        id: uid('rideranalytics:2'),
        riderId: uid('rider:2'),
        date: daysFromNow(-1),
        totalOrders: 3,
        completedOrders: 2,
        totalDistance: 25.0,
        totalEarnings: 320,
        createdAt: daysFromNow(-1),
      },
    ],
    'rider_analytics',
  );

  // ---------------------------------------------------------------- rider_reports
  await seedRows(
    manager,
    RiderReport,
    [
      {
        id: uid('riderreport:1'),
        riderId: uid('rider:1'),
        reportCode: 'RR-0001',
        title: 'June 2026 Performance Report',
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        fileUrl: '/reports/riders/rr-0001.pdf',
        generatedBy: uid('user:staff-1'),
      },
    ],
    'rider_reports',
  );

  void ctx;
}
