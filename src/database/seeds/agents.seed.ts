import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
import {
  Agent,
  AgentArea,
  AgentInstitute,
  AgentStore,
  AgentEmployee,
  AgentPerformance,
  AgentSalary,
  AgentCommission,
  AgentSettlement,
  AgentWallet,
  AgentWalletTransaction,
  AgentDocument,
  AgentLeave,
  AgentAttendance,
  AgentTarget,
  AgentBonus,
  AgentPenalty,
  AgentAnnouncement,
} from '../../admin/agents/entities';

/**
 * Agent domain seed. Keys shared across domains:
 *   agent:1 | agent:2, agentstore:1 | agentstore:2,
 *   agentwallet:1 | agentwallet:2
 */
export async function seedAgents(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // ------------------------------------------------------------------- agents
  await seedRows(
    manager,
    Agent,
    [
      {
        id: uid('agent:1'),
        userId: uid('user:agent-1'),
        agentCode: 'AGT-0001',
        fullName: 'Karim Miah',
        phone: '01700000008',
        email: 'agent1@boilagbe.test',
        nationalId: 'NID-AG-001',
        dateOfBirth: '1990-04-15',
        joiningDate: '2024-01-10',
        employmentType: 'FULL_TIME',
        salaryType: 'MONTHLY',
        baseSalary: 15000,
        commissionRate: 5,
        warehouseId: uid('warehouse:1'),
        status: 'ACTIVE',
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('agent:2'),
        userId: uid('user:agent-2'),
        agentCode: 'AGT-0002',
        fullName: 'Shamim Chowdhury',
        phone: '01700000009',
        email: 'agent2@boilagbe.test',
        nationalId: 'NID-AG-002',
        dateOfBirth: '1988-09-22',
        joiningDate: '2024-03-01',
        employmentType: 'FULL_TIME',
        salaryType: 'MONTHLY',
        baseSalary: 16000,
        commissionRate: 6,
        warehouseId: uid('warehouse:2'),
        status: 'ACTIVE',
        createdBy: uid('user:staff-1'),
      },
    ],
    'agents',
  );

  // ---------------------------------------------------------------- agent_areas
  await seedRows(
    manager,
    AgentArea,
    [
      {
        id: uid('agentarea:1'),
        agentId: uid('agent:1'),
        areaId: uid('area:dhanmondi'),
        isPrimary: true,
        assignedBy: uid('user:staff-1'),
        assignedAt: daysFromNow(-60),
        status: 'ACTIVE',
      },
      {
        id: uid('agentarea:2'),
        agentId: uid('agent:1'),
        areaId: uid('area:mirpur'),
        isPrimary: false,
        assignedBy: uid('user:staff-1'),
        assignedAt: daysFromNow(-60),
        status: 'ACTIVE',
      },
      {
        id: uid('agentarea:3'),
        agentId: uid('agent:2'),
        areaId: uid('area:uttara'),
        isPrimary: true,
        assignedBy: uid('user:staff-1'),
        assignedAt: daysFromNow(-50),
        status: 'ACTIVE',
      },
      {
        id: uid('agentarea:4'),
        agentId: uid('agent:2'),
        areaId: uid('area:ctg-city'),
        isPrimary: false,
        assignedBy: uid('user:staff-1'),
        assignedAt: daysFromNow(-50),
        status: 'ACTIVE',
      },
    ],
    'agent_areas',
  );

  // ---------------------------------------------------------- agent_institutes
  await seedRows(
    manager,
    AgentInstitute,
    [
      {
        id: uid('agentinst:1'),
        agentId: uid('agent:1'),
        instituteId: uid('institute:du'),
        assignedBy: uid('user:staff-1'),
        assignedAt: daysFromNow(-40),
        status: 'ACTIVE',
      },
      {
        id: uid('agentinst:2'),
        agentId: uid('agent:2'),
        instituteId: uid('institute:buet'),
        assignedBy: uid('user:staff-1'),
        assignedAt: daysFromNow(-40),
        status: 'ACTIVE',
      },
    ],
    'agent_institutes',
  );

  // -------------------------------------------------------------- agent_stores
  await seedRows(
    manager,
    AgentStore,
    [
      {
        id: uid('agentstore:1'),
        agentId: uid('agent:1'),
        storeName: 'Karim Book House',
        storeCode: 'ST-0001',
        warehouseId: uid('warehouse:1'),
        areaId: uid('area:dhanmondi'),
        address: 'House 8, Road 5, Dhanmondi',
        phone: '01700000008',
        latitude: 23.746,
        longitude: 90.374,
        openingTime: '09:00:00',
        closingTime: '21:00:00',
        status: 'ACTIVE',
      },
      {
        id: uid('agentstore:2'),
        agentId: uid('agent:2'),
        storeName: 'Shamim Stationery',
        storeCode: 'ST-0002',
        warehouseId: uid('warehouse:2'),
        areaId: uid('area:uttara'),
        address: 'Sector 7, Uttara',
        phone: '01700000009',
        latitude: 23.875,
        longitude: 90.379,
        openingTime: '10:00:00',
        closingTime: '20:00:00',
        status: 'ACTIVE',
      },
    ],
    'agent_stores',
  );

  // ----------------------------------------------------------- agent_employees
  await seedRows(
    manager,
    AgentEmployee,
    [
      {
        id: uid('agentemp:1'),
        agentId: uid('agent:1'),
        name: 'Habibur Rahman',
        phone: '01800000001',
        designation: 'Sales Assistant',
        salary: 8000,
        joiningDate: '2024-05-01',
        status: 'ACTIVE',
      },
      {
        id: uid('agentemp:2'),
        agentId: uid('agent:2'),
        name: 'Sajeda Begum',
        phone: '01800000002',
        designation: 'Cashier',
        salary: 7500,
        joiningDate: '2024-06-01',
        status: 'ACTIVE',
      },
    ],
    'agent_employees',
  );

  // ---------------------------------------------------------- agent_performances
  const months = [
    { m: 5, y: 2026 },
    { m: 6, y: 2026 },
    { m: 7, y: 2026 },
  ];
  await seedRows(
    manager,
    AgentPerformance,
    months.flatMap(({ m, y }, i) => [
      {
        id: uid(`agentperf:1:${m}:${y}`),
        agentId: uid('agent:1'),
        month: m,
        year: y,
        totalOrders: 40 + i * 8,
        completedOrders: 36 + i * 7,
        cancelledOrders: 2,
        returnedOrders: 1,
        totalSales: 80000 + i * 15000,
        customerRating: 4.5,
        performanceScore: 85 + i * 3,
      },
      {
        id: uid(`agentperf:2:${m}:${y}`),
        agentId: uid('agent:2'),
        month: m,
        year: y,
        totalOrders: 30 + i * 5,
        completedOrders: 27 + i * 5,
        cancelledOrders: 1,
        returnedOrders: 1,
        totalSales: 60000 + i * 12000,
        customerRating: 4.2,
        performanceScore: 80 + i * 4,
      },
    ]),
    'agent_performances',
  );

  // --------------------------------------------------------------- agent_salaries
  await seedRows(
    manager,
    AgentSalary,
    [
      {
        id: uid('agentsalary:1:6:2026'),
        agentId: uid('agent:1'),
        month: 6,
        year: 2026,
        baseSalary: 15000,
        bonus: 1000,
        penalty: 0,
        commission: 4000,
        netSalary: 20000,
        paymentStatus: 'PAID',
        paidAt: daysFromNow(-5),
      },
      {
        id: uid('agentsalary:2:6:2026'),
        agentId: uid('agent:2'),
        month: 6,
        year: 2026,
        baseSalary: 16000,
        bonus: 500,
        penalty: 200,
        commission: 3000,
        netSalary: 19300,
        paymentStatus: 'PENDING',
      },
      {
        id: uid('agentsalary:1:7:2026'),
        agentId: uid('agent:1'),
        month: 7,
        year: 2026,
        baseSalary: 15000,
        bonus: 1500,
        penalty: 0,
        commission: 5500,
        netSalary: 22000,
        paymentStatus: 'PENDING',
      },
    ],
    'agent_salaries',
  );

  // ------------------------------------------------------------- agent_commissions
  await seedRows(
    manager,
    AgentCommission,
    [
      {
        id: uid('agentcomm:1'),
        agentId: uid('agent:1'),
        orderId: uid('order:1'),
        commissionRate: 5,
        salesAmount: 2400,
        commissionAmount: 120,
        status: 'PAID',
        createdAt: daysFromNow(-10),
      },
      {
        id: uid('agentcomm:2'),
        agentId: uid('agent:1'),
        orderId: uid('order:3'),
        commissionRate: 5,
        salesAmount: 1850,
        commissionAmount: 92.5,
        status: 'PENDING',
        createdAt: daysFromNow(-2),
      },
    ],
    'agent_commissions',
  );

  // ------------------------------------------------------------ agent_settlements
  await seedRows(
    manager,
    AgentSettlement,
    [
      {
        id: uid('agentsettle:1'),
        agentId: uid('agent:1'),
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        grossAmount: 20000,
        deduction: 500,
        netAmount: 19500,
        approvedBy: uid('user:staff-1'),
        paymentStatus: 'PAID',
        paidAt: daysFromNow(-5),
      },
      {
        id: uid('agentsettle:2'),
        agentId: uid('agent:2'),
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        grossAmount: 19300,
        deduction: 0,
        netAmount: 19300,
        paymentStatus: 'PENDING',
      },
    ],
    'agent_settlements',
  );

  // --------------------------------------------------------------- agent_wallets
  await seedRows(
    manager,
    AgentWallet,
    [
      {
        id: uid('agentwallet:1'),
        agentId: uid('agent:1'),
        currentBalance: 12500,
        totalEarned: 50000,
        totalWithdraw: 37500,
        lastUpdated: daysFromNow(-1),
      },
      {
        id: uid('agentwallet:2'),
        agentId: uid('agent:2'),
        currentBalance: 8000,
        totalEarned: 30000,
        totalWithdraw: 22000,
        lastUpdated: daysFromNow(-1),
      },
    ],
    'agent_wallets',
  );

  // ---------------------------------------------------- agent_wallet_transactions
  await seedRows(
    manager,
    AgentWalletTransaction,
    [
      {
        id: uid('agentwalletx:1'),
        walletId: uid('agentwallet:1'),
        transactionType: 'CREDIT',
        amount: 20000,
        referenceType: 'salary',
        referenceId: uid('agentsalary:1:6:2026'),
        balanceBefore: 2500,
        balanceAfter: 22500,
        createdAt: daysFromNow(-5),
      },
      {
        id: uid('agentwalletx:2'),
        walletId: uid('agentwallet:1'),
        transactionType: 'WITHDRAWAL',
        amount: 10000,
        referenceType: 'withdraw',
        balanceBefore: 22500,
        balanceAfter: 12500,
        createdAt: daysFromNow(-3),
      },
      {
        id: uid('agentwalletx:3'),
        walletId: uid('agentwallet:2'),
        transactionType: 'CREDIT',
        amount: 8000,
        referenceType: 'settlement',
        referenceId: uid('agentsettle:2'),
        balanceBefore: 0,
        balanceAfter: 8000,
        createdAt: daysFromNow(-4),
      },
    ],
    'agent_wallet_transactions',
  );

  // ------------------------------------------------------------- agent_documents
  await seedRows(
    manager,
    AgentDocument,
    [
      {
        id: uid('agentdoc:1'),
        agentId: uid('agent:1'),
        documentType: 'NID',
        documentNumber: 'NID-AG-001',
        fileUrl: '/uploads/agents/nid-1.jpg',
        verificationStatus: 'APPROVED',
        verifiedBy: uid('user:staff-1'),
        verifiedAt: daysFromNow(-55),
      },
      {
        id: uid('agentdoc:2'),
        agentId: uid('agent:2'),
        documentType: 'TRADE_LICENSE',
        documentNumber: 'TL-0002',
        fileUrl: '/uploads/agents/tl-2.pdf',
        verificationStatus: 'PENDING',
      },
    ],
    'agent_documents',
  );

  // ----------------------------------------------------------------- agent_leaves
  await seedRows(
    manager,
    AgentLeave,
    [
      {
        id: uid('agentleave:1'),
        agentId: uid('agent:1'),
        leaveType: 'EARNED',
        startDate: '2026-08-10',
        endDate: '2026-08-12',
        reason: 'Family event',
        approvalStatus: 'APPROVED',
        approvedBy: uid('user:staff-1'),
      },
      {
        id: uid('agentleave:2'),
        agentId: uid('agent:2'),
        leaveType: 'SICK',
        startDate: '2026-07-20',
        endDate: '2026-07-21',
        reason: 'Fever',
        approvalStatus: 'PENDING',
      },
    ],
    'agent_leaves',
  );

  // ----------------------------------------------------------- agent_attendances
  await seedRows(
    manager,
    AgentAttendance,
    [
      {
        id: uid('agentatt:1'),
        agentId: uid('agent:1'),
        checkIn: daysFromNow(-1, 9),
        checkOut: daysFromNow(-1, 20),
        workingHours: 8.5,
        status: 'PRESENT',
      },
      {
        id: uid('agentatt:2'),
        agentId: uid('agent:2'),
        checkIn: daysFromNow(-1, 10),
        checkOut: daysFromNow(-1, 19),
        workingHours: 8,
        status: 'PRESENT',
      },
      {
        id: uid('agentatt:3'),
        agentId: uid('agent:1'),
        checkIn: daysFromNow(-2, 9),
        checkOut: daysFromNow(-2, 20),
        workingHours: 8.5,
        status: 'LATE',
      },
    ],
    'agent_attendances',
  );

  // ---------------------------------------------------------------- agent_targets
  await seedRows(
    manager,
    AgentTarget,
    [
      {
        id: uid('agenttarget:1'),
        agentId: uid('agent:1'),
        month: 7,
        year: 2026,
        salesTarget: 100000,
        orderTarget: 50,
        collectionTarget: 95000,
        achievementPercentage: 92,
      },
      {
        id: uid('agenttarget:2'),
        agentId: uid('agent:2'),
        month: 7,
        year: 2026,
        salesTarget: 80000,
        orderTarget: 40,
        collectionTarget: 75000,
        achievementPercentage: 75,
      },
    ],
    'agent_targets',
  );

  // ----------------------------------------------------------------- agent_bonuses
  await seedRows(
    manager,
    AgentBonus,
    [
      {
        id: uid('agentbonus:1'),
        agentId: uid('agent:1'),
        title: 'Monthly Target Bonus',
        amount: 1500,
        reason: 'Achieved 92% of July target',
        approvedBy: uid('user:staff-1'),
        createdAt: daysFromNow(-3),
      },
    ],
    'agent_bonuses',
  );

  // --------------------------------------------------------------- agent_penalties
  await seedRows(
    manager,
    AgentPenalty,
    [
      {
        id: uid('agentpenalty:1'),
        agentId: uid('agent:2'),
        title: 'Late Delivery',
        amount: 200,
        reason: 'Order delivered 3 days late',
        approvedBy: uid('user:staff-1'),
        createdAt: daysFromNow(-6),
      },
    ],
    'agent_penalties',
  );

  // ---------------------------------------------------------- agent_announcements
  await seedRows(
    manager,
    AgentAnnouncement,
    [
      {
        id: uid('agentann:1'),
        agentId: uid('agent:1'),
        title: 'New Book Arrivals',
        message:
          'New academic books arrived at central warehouse. Update your store stock.',
        sentBy: uid('user:staff-1'),
        createdAt: daysFromNow(-4),
      },
    ],
    'agent_announcements',
  );

  void ctx;
}
