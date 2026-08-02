import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
import {
  Company,
  CompanyStatus,
  CompanyBranch,
  CompanyBranchStatus,
  BankAccount,
  BankAccountType,
  BankAccountStatus,
  PaymentGateway,
  PaymentGatewayStatus,
  PaymentTransaction,
  PaymentTransactionStatus,
  PaymentDirection,
  PaymentMethod,
  PaymentMethodType,
  PaymentMethodStatus,
  Wallet,
  WalletType,
  WalletStatus,
  WalletTransaction,
  WalletTransactionType,
  Invoice,
  InvoiceStatus,
  ExpenseCategory,
  ExpenseCategoryStatus,
  Expense,
  ExpenseStatus,
  IncomeCategory,
  IncomeCategoryStatus,
  Income,
  IncomeStatus,
  CashFlow,
  CashFlowType,
  JournalEntry,
  JournalEntryType,
  JournalEntryStatus,
  Ledger,
  LedgerTransactionType,
  Account,
  AccountType,
  AccountStatus,
  Tax,
  TaxType,
  TaxStatus,
  Commission,
  CommissionType,
  CommissionStatus,
  Salary,
  EmployeeType,
  SalaryPaymentStatus,
  Payroll,
  PayrollStatus,
  SupplierPayment,
  SupplierPaymentStatus,
  CustomerRefund,
  CustomerRefundStatus,
  FinancialSettlement,
  SettlementEntityType,
  SettlementPaymentStatus,
  ProfitLoss,
  ProfitLossPeriodType,
  BalanceSheet,
  FinancialReport,
  FinancialReportType,
  SystemSetting,
  SystemSettingGroup,
  AdminActivity,
} from '../../admin/finance/entities';

/**
 * Finance seed. Keys shared across domains:
 *   account:1..4, journal:1, ledger:1..2, wallet:customer-1,
 *   wallet:platform-1, expense:1, income:1
 */
export async function seedFinance(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // ---------------------------------------------------------------- companies
  await seedRows(
    manager,
    Company,
    [
      {
        id: uid('company:1'),
        companyCode: 'BL-001',
        name: 'BOI LAGBE Limited',
        legalName: 'BOI LAGBE Ltd.',
        registrationNumber: 'C-123456',
        taxNumber: 'VAT-7654321',
        email: 'finance@boilagbe.com',
        phone: '+8801700000000',
        website: 'https://boilagbe.com',
        address: 'Dhanmondi, Dhaka 1205',
        country: 'Bangladesh',
        currency: 'BDT',
        timezone: 'Asia/Dhaka',
        logoUrl: '/uploads/company/logo.png',
        status: CompanyStatus.ACTIVE,
      },
    ],
    'companies',
  );

  // ----------------------------------------------------------- company_branches
  await seedRows(
    manager,
    CompanyBranch,
    [
      {
        id: uid('branch:1'),
        companyId: uid('company:1'),
        branchCode: 'BR-DHK-01',
        name: 'Dhaka Head Office',
        address: 'Dhanmondi, Dhaka',
        phone: '+8801700000001',
        email: 'dhaka@boilagbe.com',
        managerName: 'Ayesha Rahman',
        status: CompanyBranchStatus.ACTIVE,
      },
      {
        id: uid('branch:2'),
        companyId: uid('company:1'),
        branchCode: 'BR-CTG-01',
        name: 'Chattogram Office',
        address: 'GEC Circle, Chattogram',
        phone: '+8801700000002',
        email: 'ctg@boilagbe.com',
        managerName: 'Shamim Chowdhury',
        status: CompanyBranchStatus.ACTIVE,
      },
    ],
    'company_branches',
  );

  // -------------------------------------------------------------- bank_accounts
  await seedRows(
    manager,
    BankAccount,
    [
      {
        id: uid('bankaccount:1'),
        accountCode: 'BA-001',
        bankName: 'Dutch-Bangla Bank',
        accountName: 'BOI LAGBE Limited',
        accountNumber: 'DBBL-1001-2345',
        branchName: 'Dhanmondi',
        routingNumber: '123456789',
        swiftCode: 'DBBLBDDH',
        accountType: BankAccountType.CURRENT,
        currency: 'BDT',
        isDefault: true,
        status: BankAccountStatus.ACTIVE,
      },
      {
        id: uid('bankaccount:2'),
        accountCode: 'BA-002',
        bankName: 'Islami Bank Bangladesh',
        accountName: 'BOI LAGBE Limited',
        accountNumber: 'IBBL-2002-6789',
        branchName: 'Uttara',
        accountType: BankAccountType.SAVINGS,
        currency: 'BDT',
        isDefault: false,
        status: BankAccountStatus.ACTIVE,
      },
    ],
    'bank_accounts',
  );

  // ----------------------------------------------------------- payment_gateways
  // Config-only rows (no live credentials) per the finance module scope.
  await seedRows(
    manager,
    PaymentGateway,
    [
      {
        id: uid('gateway:1'),
        gatewayCode: 'PG-BKASH',
        name: 'bKash Merchant',
        provider: 'bKash',
        description: 'bKash merchant payment gateway (config only)',
        config: { env: 'sandbox' },
        isDefault: true,
        status: PaymentGatewayStatus.ACTIVE,
      },
      {
        id: uid('gateway:2'),
        gatewayCode: 'PG-NAGAD',
        name: 'Nagad Merchant',
        provider: 'Nagad',
        description: 'Nagad merchant payment gateway (config only)',
        config: { env: 'sandbox' },
        isDefault: false,
        status: PaymentGatewayStatus.ACTIVE,
      },
    ],
    'payment_gateways',
  );

  // ------------------------------------------------------------- payment_methods
  await seedRows(
    manager,
    PaymentMethod,
    [
      {
        id: uid('paymethod:1'),
        methodCode: 'PM-CASH',
        name: 'Cash on Delivery',
        methodType: PaymentMethodType.CASH,
        description: 'Pay cash at delivery',
        status: PaymentMethodStatus.ACTIVE,
      },
      {
        id: uid('paymethod:2'),
        methodCode: 'PM-BKASH',
        name: 'bKash',
        methodType: PaymentMethodType.MOBILE_BANKING,
        description: 'Mobile banking via bKash',
        status: PaymentMethodStatus.ACTIVE,
      },
      {
        id: uid('paymethod:3'),
        methodCode: 'PM-CARD',
        name: 'Debit/Credit Card',
        methodType: PaymentMethodType.CARD,
        description: 'Card payments',
        status: PaymentMethodStatus.ACTIVE,
      },
      {
        id: uid('paymethod:4'),
        methodCode: 'PM-COD',
        name: 'Cash / COD',
        methodType: PaymentMethodType.COD,
        description: 'Cash on delivery',
        status: PaymentMethodStatus.ACTIVE,
      },
    ],
    'payment_methods',
  );

  // --------------------------------------------------------- payment_transactions
  await seedRows(
    manager,
    PaymentTransaction,
    [
      {
        id: uid('paytxn:1'),
        transactionCode: 'TXN-2026-0001',
        gatewayId: uid('gateway:1'),
        userId: uid('user:customer-1'),
        orderId: uid('order:1'),
        amount: 2480,
        currency: 'BDT',
        direction: PaymentDirection.INFLOW,
        status: PaymentTransactionStatus.COMPLETED,
        referenceType: 'order',
        referenceId: uid('order:1'),
        remarks: 'Order payment via bKash',
        processedAt: daysFromNow(-8),
      },
      {
        id: uid('paytxn:2'),
        transactionCode: 'TXN-2026-0002',
        gatewayId: uid('gateway:1'),
        userId: uid('user:student-1'),
        orderId: uid('order:2'),
        amount: 2947.5,
        currency: 'BDT',
        direction: PaymentDirection.INFLOW,
        status: PaymentTransactionStatus.COMPLETED,
        referenceType: 'order',
        referenceId: uid('order:2'),
        remarks: 'Order payment COD',
        processedAt: daysFromNow(-5),
      },
      {
        id: uid('paytxn:3'),
        transactionCode: 'TXN-2026-0003',
        userId: uid('user:customer-1'),
        orderId: uid('order:4'),
        amount: 2168.95,
        currency: 'BDT',
        direction: PaymentDirection.INFLOW,
        status: PaymentTransactionStatus.PENDING,
        referenceType: 'order',
        referenceId: uid('order:4'),
        remarks: 'Card payment awaiting confirmation',
      },
    ],
    'payment_transactions',
  );

  // -------------------------------------------------------------------- wallets
  await seedRows(
    manager,
    Wallet,
    [
      {
        id: uid('wallet:customer-1'),
        walletCode: 'WAL-CUS-0001',
        userId: uid('user:customer-1'),
        walletType: WalletType.CUSTOMER,
        currentBalance: 3500,
        totalCredited: 6000,
        totalDebited: 2500,
        lastTransactionAt: daysFromNow(-2),
        status: WalletStatus.ACTIVE,
      },
      {
        id: uid('wallet:student-1'),
        walletCode: 'WAL-STU-0001',
        userId: uid('user:student-1'),
        walletType: WalletType.CUSTOMER,
        currentBalance: 1200,
        totalCredited: 3000,
        totalDebited: 1800,
        lastTransactionAt: daysFromNow(-3),
        status: WalletStatus.ACTIVE,
      },
      {
        id: uid('wallet:platform-1'),
        walletCode: 'WAL-PLT-0001',
        walletType: WalletType.PLATFORM,
        currentBalance: 250000,
        totalCredited: 900000,
        totalDebited: 650000,
        lastTransactionAt: daysFromNow(-1),
        status: WalletStatus.ACTIVE,
      },
    ],
    'wallets',
  );

  // --------------------------------------------------------- wallet_transactions
  await seedRows(
    manager,
    WalletTransaction,
    [
      {
        id: uid('wallettxn:1'),
        walletId: uid('wallet:customer-1'),
        transactionType: WalletTransactionType.CREDIT,
        amount: 2480,
        balanceBefore: 1020,
        balanceAfter: 3500,
        referenceType: 'order',
        referenceId: uid('order:1'),
        remarks: 'Order payment credited',
        createdAt: daysFromNow(-8),
      },
      {
        id: uid('wallettxn:2'),
        walletId: uid('wallet:customer-1'),
        transactionType: WalletTransactionType.DEBIT,
        amount: 2500,
        balanceBefore: 6000,
        balanceAfter: 3500,
        referenceType: 'withdraw',
        remarks: 'Cash withdrawal to bank',
        createdAt: daysFromNow(-2),
      },
      {
        id: uid('wallettxn:3'),
        walletId: uid('wallet:student-1'),
        transactionType: WalletTransactionType.CREDIT,
        amount: 1200,
        balanceBefore: 0,
        balanceAfter: 1200,
        referenceType: 'used-book',
        referenceId: uid('ubreq:1'),
        remarks: 'Used book sale settlement',
        createdAt: daysFromNow(-4),
      },
    ],
    'wallet_transactions',
  );

  // ------------------------------------------------------------------- invoices
  await seedRows(
    manager,
    Invoice,
    [
      {
        id: uid('invoice:1'),
        invoiceCode: 'INV-FIN-2026-001',
        orderId: uid('order:1'),
        userId: uid('user:customer-1'),
        customerName: 'Farhana Islam',
        invoiceDate: daysFromNow(-8),
        dueDate: daysFromNow(2),
        subtotal: 2400,
        discount: 100,
        tax: 120,
        totalAmount: 2420,
        paidAmount: 2420,
        dueAmount: 0,
        status: InvoiceStatus.PAID,
        remarks: 'Paid via bKash',
      },
      {
        id: uid('invoice:2'),
        invoiceCode: 'INV-FIN-2026-002',
        orderId: uid('order:3'),
        userId: uid('user:customer-2'),
        customerName: 'Mahmudul Hasan',
        invoiceDate: daysFromNow(-3),
        dueDate: daysFromNow(7),
        subtotal: 1850,
        discount: 50,
        tax: 92.5,
        totalAmount: 1892.5,
        paidAmount: 0,
        dueAmount: 1892.5,
        status: InvoiceStatus.ISSUED,
      },
    ],
    'invoices',
  );

  // ----------------------------------------------------------- expense_categories
  await seedRows(
    manager,
    ExpenseCategory,
    [
      {
        id: uid('expcat:1'),
        code: 'EXP-OPERATIONS',
        name: 'Operations',
        description: 'Warehouse and logistics expenses',
        icon: 'box',
        isSystem: true,
        status: ExpenseCategoryStatus.ACTIVE,
      },
      {
        id: uid('expcat:2'),
        code: 'EXP-SALARY',
        name: 'Salaries & Wages',
        description: 'Staff and agent payroll expenses',
        icon: 'users',
        isSystem: true,
        status: ExpenseCategoryStatus.ACTIVE,
      },
      {
        id: uid('expcat:3'),
        code: 'EXP-MARKETING',
        name: 'Marketing',
        description: 'Advertising and promotional spend',
        icon: 'megaphone',
        isSystem: true,
        status: ExpenseCategoryStatus.ACTIVE,
      },
    ],
    'expense_categories',
  );

  // -------------------------------------------------------------------- expenses
  await seedRows(
    manager,
    Expense,
    [
      {
        id: uid('expense:1'),
        expenseCode: 'EXP-2026-0001',
        categoryId: uid('expcat:1'),
        description: 'Warehouse rent for June 2026',
        amount: 45000,
        expenseDate: '2026-06-05',
        paymentMethodId: uid('paymethod:2'),
        paidBy: uid('user:staff-1'),
        status: ExpenseStatus.APPROVED,
      },
      {
        id: uid('expense:2'),
        expenseCode: 'EXP-2026-0002',
        categoryId: uid('expcat:3'),
        description: 'Facebook ad campaign - summer books',
        amount: 12000,
        expenseDate: '2026-07-01',
        paymentMethodId: uid('paymethod:2'),
        paidBy: uid('user:staff-1'),
        status: ExpenseStatus.PENDING,
      },
    ],
    'expenses',
  );

  // ------------------------------------------------------------- income_categories
  await seedRows(
    manager,
    IncomeCategory,
    [
      {
        id: uid('inccat:1'),
        code: 'INC-SALES',
        name: 'Product Sales',
        description: 'Book and product sales revenue',
        icon: 'cart',
        isSystem: true,
        status: IncomeCategoryStatus.ACTIVE,
      },
      {
        id: uid('inccat:2'),
        code: 'INC-SERVICE',
        name: 'Print & Custom Services',
        description: 'Print jobs and custom orders',
        icon: 'print',
        isSystem: true,
        status: IncomeCategoryStatus.ACTIVE,
      },
    ],
    'income_categories',
  );

  // --------------------------------------------------------------------- incomes
  await seedRows(
    manager,
    Income,
    [
      {
        id: uid('income:1'),
        incomeCode: 'INC-2026-0001',
        categoryId: uid('inccat:1'),
        description: 'Order BL-ORD-1001 sales',
        amount: 2420,
        incomeDate: '2026-07-25',
        paymentMethodId: uid('paymethod:2'),
        receivedBy: uid('user:staff-1'),
        referenceType: 'order',
        referenceId: uid('order:1'),
        status: IncomeStatus.RECORDED,
      },
      {
        id: uid('income:2'),
        incomeCode: 'INC-2026-0002',
        categoryId: uid('inccat:2'),
        description: 'Print job PJ-2026-0001',
        amount: 400,
        incomeDate: '2026-07-27',
        receivedBy: uid('user:staff-1'),
        referenceType: 'print-job',
        referenceId: uid('printjob:1'),
        status: IncomeStatus.RECORDED,
      },
    ],
    'incomes',
  );

  // ------------------------------------------------------------------- cash_flows
  await seedRows(
    manager,
    CashFlow,
    [
      {
        id: uid('cashflow:1'),
        entryDate: '2026-07-25',
        flowType: CashFlowType.INFLOW,
        amount: 2420,
        category: 'sales',
        description: 'Order BL-ORD-1001',
        referenceType: 'order',
        referenceId: uid('order:1'),
        balanceAfter: 250420,
      },
      {
        id: uid('cashflow:2'),
        entryDate: '2026-07-28',
        flowType: CashFlowType.OUTFLOW,
        amount: 45000,
        category: 'expense',
        description: 'Warehouse rent June',
        referenceType: 'expense',
        referenceId: uid('expense:1'),
        balanceAfter: 205420,
      },
    ],
    'cash_flows',
  );

  // ------------------------------------------------------------- journal_entries
  await seedRows(
    manager,
    JournalEntry,
    [
      {
        id: uid('journal:1'),
        entryCode: 'JE-2026-0001',
        entryDate: '2026-07-25',
        description: 'Record order BL-ORD-1001 revenue',
        entryType: JournalEntryType.AUTO,
        debitTotal: 2480,
        creditTotal: 2480,
        status: JournalEntryStatus.POSTED,
        postedBy: uid('user:staff-1'),
        postedAt: daysFromNow(-6),
      },
      {
        id: uid('journal:2'),
        entryCode: 'JE-2026-0002',
        entryDate: '2026-07-28',
        description: 'Record warehouse rent expense',
        entryType: JournalEntryType.MANUAL,
        debitTotal: 45000,
        creditTotal: 45000,
        status: JournalEntryStatus.DRAFT,
        postedBy: uid('user:staff-1'),
      },
    ],
    'journal_entries',
  );

  // -------------------------------------------------------------------- accounts
  await seedRows(
    manager,
    Account,
    [
      {
        id: uid('account:1'),
        accountCode: 'ACC-CASH',
        name: 'Cash & Bank',
        accountType: AccountType.ASSET,
        currency: 'BDT',
        openingBalance: 100000,
        currentBalance: 250420,
        isSystem: true,
        description: 'Main operating cash account',
        status: AccountStatus.ACTIVE,
      },
      {
        id: uid('account:2'),
        accountCode: 'ACC-RECV',
        name: 'Accounts Receivable',
        accountType: AccountType.ASSET,
        currency: 'BDT',
        openingBalance: 0,
        currentBalance: 1892.5,
        isSystem: true,
        description: 'Outstanding customer payments',
        status: AccountStatus.ACTIVE,
      },
      {
        id: uid('account:3'),
        accountCode: 'ACC-SALES',
        name: 'Sales Revenue',
        accountType: AccountType.REVENUE,
        currency: 'BDT',
        openingBalance: 0,
        currentBalance: 900000,
        isSystem: true,
        description: 'Product and service revenue',
        status: AccountStatus.ACTIVE,
      },
      {
        id: uid('account:4'),
        accountCode: 'ACC-EXP',
        name: 'Operating Expenses',
        accountType: AccountType.EXPENSE,
        currency: 'BDT',
        openingBalance: 0,
        currentBalance: 57000,
        isSystem: true,
        description: 'Operating cost accounts',
        status: AccountStatus.ACTIVE,
      },
    ],
    'accounts',
  );

  // --------------------------------------------------------------------- ledgers
  await seedRows(
    manager,
    Ledger,
    [
      {
        id: uid('ledger:1'),
        journalEntryId: uid('journal:1'),
        accountId: uid('account:1'),
        transactionType: LedgerTransactionType.DEBIT,
        amount: 2480,
        balanceAfter: 2480,
        description: 'Cash received for order',
        createdAt: daysFromNow(-6),
      },
      {
        id: uid('ledger:2'),
        journalEntryId: uid('journal:1'),
        accountId: uid('account:3'),
        transactionType: LedgerTransactionType.CREDIT,
        amount: 2480,
        balanceAfter: 2480,
        description: 'Revenue recognised',
        createdAt: daysFromNow(-6),
      },
    ],
    'ledgers',
  );

  // ----------------------------------------------------------------------- taxes
  await seedRows(
    manager,
    Tax,
    [
      {
        id: uid('tax:1'),
        taxCode: 'VAT-5',
        name: 'VAT 5%',
        rate: 5,
        taxType: TaxType.VAT,
        isDefault: true,
        description: 'Standard value added tax',
        status: TaxStatus.ACTIVE,
      },
      {
        id: uid('tax:2'),
        taxCode: 'WHT-10',
        name: 'Withholding Tax 10%',
        rate: 10,
        taxType: TaxType.WITHHOLDING,
        isDefault: false,
        description: 'Supplier withholding tax',
        status: TaxStatus.ACTIVE,
      },
    ],
    'taxes',
  );

  // ---------------------------------------------------------------- commissions
  await seedRows(
    manager,
    Commission,
    [
      {
        id: uid('commission:1'),
        commissionCode: 'COM-2026-0001',
        agentId: uid('agent:1'),
        orderId: uid('order:1'),
        commissionType: CommissionType.ORDER,
        commissionRate: 5,
        salesAmount: 2480,
        commissionAmount: 124,
        status: CommissionStatus.PAID,
        approvedBy: uid('user:staff-1'),
        paidAt: daysFromNow(-5),
        remarks: 'Agent order commission',
      },
      {
        id: uid('commission:2'),
        commissionCode: 'COM-2026-0002',
        riderId: uid('rider:1'),
        orderId: uid('order:1'),
        commissionType: CommissionType.DELIVERY,
        commissionRate: 10,
        salesAmount: 60,
        commissionAmount: 6,
        status: CommissionStatus.APPROVED,
        approvedBy: uid('user:staff-1'),
        remarks: 'Rider delivery fee',
      },
    ],
    'commissions',
  );

  // -------------------------------------------------------------------- salaries
  await seedRows(
    manager,
    Salary,
    [
      {
        id: uid('salary:1'),
        employeeType: EmployeeType.AGENT,
        employeeId: uid('agent:1'),
        month: 6,
        year: 2026,
        baseSalary: 15000,
        bonus: 1000,
        penalty: 0,
        commission: 4000,
        allowance: 500,
        deduction: 0,
        netSalary: 20500,
        paymentStatus: SalaryPaymentStatus.PAID,
        paidAt: daysFromNow(-5),
      },
      {
        id: uid('salary:2'),
        employeeType: EmployeeType.RIDER,
        employeeId: uid('rider:1'),
        month: 6,
        year: 2026,
        baseSalary: 5000,
        bonus: 0,
        penalty: 0,
        commission: 3000,
        allowance: 0,
        deduction: 0,
        netSalary: 8000,
        paymentStatus: SalaryPaymentStatus.PROCESSED,
      },
    ],
    'salaries',
  );

  // -------------------------------------------------------------------- payrolls
  await seedRows(
    manager,
    Payroll,
    [
      {
        id: uid('payroll:1'),
        payrollCode: 'PR-2026-06',
        month: 6,
        year: 2026,
        totalEmployees: 2,
        totalSalary: 20000,
        totalBonus: 1000,
        totalPenalty: 200,
        totalDeduction: 200,
        netPayable: 28600,
        status: PayrollStatus.PROCESSED,
        processedBy: uid('user:staff-1'),
        processedAt: daysFromNow(-6),
      },
      {
        id: uid('payroll:2'),
        payrollCode: 'PR-2026-07',
        month: 7,
        year: 2026,
        totalEmployees: 2,
        totalSalary: 20000,
        totalBonus: 1500,
        totalPenalty: 0,
        totalDeduction: 0,
        netPayable: 21500,
        status: PayrollStatus.DRAFT,
      },
    ],
    'payrolls',
  );

  // ------------------------------------------------------------- supplier_payments
  await seedRows(
    manager,
    SupplierPayment,
    [
      {
        id: uid('supplierpay:1'),
        paymentCode: 'SP-2026-0001',
        supplierId: uid('supplier:1'),
        purchaseId: uid('purchase:1'),
        amount: 150000,
        paymentDate: '2026-06-20',
        paymentMethodId: uid('paymethod:2'),
        status: SupplierPaymentStatus.PAID,
        paidBy: uid('user:staff-1'),
        remarks: 'Full payment for PUR-2026-001',
      },
      {
        id: uid('supplierpay:2'),
        paymentCode: 'SP-2026-0002',
        supplierId: uid('supplier:2'),
        purchaseId: uid('purchase:2'),
        amount: 45000,
        paymentDate: '2026-07-15',
        status: SupplierPaymentStatus.PARTIAL,
        paidBy: uid('user:staff-1'),
        remarks: 'Partial payment',
      },
    ],
    'supplier_payments',
  );

  // -------------------------------------------------------------- customer_refunds
  await seedRows(
    manager,
    CustomerRefund,
    [
      {
        id: uid('customerrefund:1'),
        refundCode: 'REF-FIN-2026-001',
        orderId: uid('order:3'),
        userId: uid('user:customer-2'),
        amount: 1892.5,
        reason: 'Returned books, refund requested',
        method: 'MOBILE_BANKING',
        status: CustomerRefundStatus.PENDING,
      },
    ],
    'customer_refunds',
  );

  // -------------------------------------------------------- financial_settlements
  await seedRows(
    manager,
    FinancialSettlement,
    [
      {
        id: uid('finsettle:1'),
        settlementCode: 'FS-2026-0001',
        entityType: SettlementEntityType.AGENT,
        entityId: uid('agent:1'),
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        grossAmount: 20000,
        deduction: 500,
        netAmount: 19500,
        paymentStatus: SettlementPaymentStatus.PAID,
        approvedBy: uid('user:staff-1'),
        paidAt: daysFromNow(-5),
      },
      {
        id: uid('finsettle:2'),
        settlementCode: 'FS-2026-0002',
        entityType: SettlementEntityType.RIDER,
        entityId: uid('rider:1'),
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        grossAmount: 8000,
        deduction: 0,
        netAmount: 8000,
        paymentStatus: SettlementPaymentStatus.PENDING,
      },
    ],
    'financial_settlements',
  );

  // ------------------------------------------------------------------ profit_loss
  await seedRows(
    manager,
    ProfitLoss,
    [
      {
        id: uid('profitloss:1'),
        period: '2026-06',
        periodType: ProfitLossPeriodType.MONTHLY,
        totalRevenue: 125000,
        costOfGoods: 85000,
        grossProfit: 40000,
        operatingExpense: 25000,
        netProfit: 15000,
        generatedAt: daysFromNow(-2),
      },
    ],
    'profit_loss',
  );

  // --------------------------------------------------------------- balance_sheets
  await seedRows(
    manager,
    BalanceSheet,
    [
      {
        id: uid('balancesheet:1'),
        period: '2026-06',
        periodType: 'MONTHLY' as const,
        totalAssets: 250420,
        totalLiabilities: 1892.5,
        totalEquity: 248527.5,
        generatedAt: daysFromNow(-2),
      },
    ],
    'balance_sheets',
  );

  // ------------------------------------------------------------ financial_reports
  await seedRows(
    manager,
    FinancialReport,
    [
      {
        id: uid('finreport:1'),
        reportCode: 'FR-2026-0001',
        reportType: FinancialReportType.PROFIT_LOSS,
        title: 'Profit & Loss - June 2026',
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        reportData: { totalRevenue: 125000, netProfit: 15000 },
        generatedBy: uid('user:staff-1'),
        generatedAt: daysFromNow(-2),
      },
    ],
    'financial_reports',
  );

  // -------------------------------------------------------------- system_settings
  await seedRows(
    manager,
    SystemSetting,
    [
      {
        id: uid('syssetting:1'),
        settingKey: 'currency.default',
        settingValue: 'BDT',
        group: SystemSettingGroup.CURRENCY,
        description: 'Default platform currency',
        isSecret: false,
        updatedBy: uid('user:staff-1'),
      },
      {
        id: uid('syssetting:2'),
        settingKey: 'tax.vat.rate',
        settingValue: '5',
        group: SystemSettingGroup.TAX,
        description: 'Default VAT rate percentage',
        isSecret: false,
        updatedBy: uid('user:staff-1'),
      },
      {
        id: uid('syssetting:3'),
        settingKey: 'commission.agent.rate',
        settingValue: '5',
        group: SystemSettingGroup.COMMISSION,
        description: 'Default agent commission rate',
        isSecret: false,
        updatedBy: uid('user:staff-1'),
      },
    ],
    'system_settings',
  );

  // ------------------------------------------------------------- admin_activities
  await seedRows(
    manager,
    AdminActivity,
    [
      {
        id: uid('adminactivity:1'),
        adminId: uid('user:staff-1'),
        module: 'finance',
        action: 'EXPORT',
        description: 'Exported June financial report',
        referenceType: 'financial-report',
        referenceId: uid('finreport:1'),
        ipAddress: '127.0.0.1',
        device: 'Windows',
        browser: 'Chrome',
      },
      {
        id: uid('adminactivity:2'),
        adminId: uid('user:staff-1'),
        module: 'finance',
        action: 'APPROVE',
        description: 'Approved agent settlement FS-2026-0001',
        referenceType: 'settlement',
        referenceId: uid('finsettle:1'),
        ipAddress: '127.0.0.1',
        device: 'Windows',
        browser: 'Chrome',
      },
    ],
    'admin_activities',
  );

  void ctx;
}
