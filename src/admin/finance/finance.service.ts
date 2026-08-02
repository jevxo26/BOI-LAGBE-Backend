import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { QueryBuilder } from '../common/utils/query-builder';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { ListDashboardQueryDto } from './dto/list-dashboard-query.dto';
import { ListTransactionQueryDto } from './dto/list-transaction-query.dto';
import { ListInvoiceQueryDto } from './dto/list-invoice-query.dto';
import { ListExpenseQueryDto } from './dto/list-expense-query.dto';
import { ListIncomeQueryDto } from './dto/list-income-query.dto';
import { ListJournalEntryQueryDto } from './dto/list-journal-entry-query.dto';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { ListLedgerQueryDto } from './dto/list-ledger-query.dto';
import { ListProfitLossQueryDto } from './dto/list-profit-loss-query.dto';
import { ListBalanceSheetQueryDto } from './dto/list-balance-sheet-query.dto';
import { ListFinancialReportQueryDto } from './dto/list-financial-report-query.dto';
import { ListSettlementQueryDto } from './dto/list-settlement-query.dto';
import { ListSalaryQueryDto } from './dto/list-salary-query.dto';
import { ListCommissionQueryDto } from './dto/list-commission-query.dto';
import { ListCustomerRefundQueryDto } from './dto/list-customer-refund-query.dto';
import { ListTaxQueryDto } from './dto/list-tax-query.dto';
import { ListAccountQueryDto } from './dto/list-account-query.dto';
import { ListWalletQueryDto } from './dto/list-wallet-query.dto';
import { CreateSystemSettingDto } from './dto/create-system-setting.dto';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';
import {
  PaymentTransaction,
  Invoice,
  InvoiceStatus,
  Expense,
  Income,
  JournalEntry,
  JournalEntryStatus,
  Ledger,
  LedgerTransactionType,
  Account,
  AccountType,
  Tax,
  Commission,
  Salary,
  FinancialSettlement,
  SettlementPaymentStatus,
  CustomerRefund,
  FinancialReport,
  Wallet,
  WalletStatus,
  SystemSetting,
  ProfitLoss,
  BalanceSheet,
} from './entities';

// Internal finance oversight. NO payment gateway integration — the records
// here are the platform's accounting view of money movement.
@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly transactionRepository: Repository<PaymentTransaction>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    @InjectRepository(JournalEntry)
    private readonly journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(Ledger)
    private readonly ledgerRepository: Repository<Ledger>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Tax)
    private readonly taxRepository: Repository<Tax>,
    @InjectRepository(Commission)
    private readonly commissionRepository: Repository<Commission>,
    @InjectRepository(Salary)
    private readonly salaryRepository: Repository<Salary>,
    @InjectRepository(FinancialSettlement)
    private readonly settlementRepository: Repository<FinancialSettlement>,
    @InjectRepository(CustomerRefund)
    private readonly refundRepository: Repository<CustomerRefund>,
    @InjectRepository(FinancialReport)
    private readonly reportRepository: Repository<FinancialReport>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(SystemSetting)
    private readonly settingRepository: Repository<SystemSetting>,
    @InjectRepository(ProfitLoss)
    private readonly profitLossRepository: Repository<ProfitLoss>,
    @InjectRepository(BalanceSheet)
    private readonly balanceSheetRepository: Repository<BalanceSheet>,
    private readonly dataSource: DataSource,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  // ---------- DASHBOARD ----------

  // Aggregate finance snapshot for the admin dashboard within a date range.
  async getDashboard(query: ListDashboardQueryDto) {
    const [
      totalIncome,
      totalExpense,
      invoiceStats,
      walletStats,
      settlementStats,
    ] = await Promise.all([
      this.sumField(this.incomeRepository, 'amount', query),
      this.sumField(this.expenseRepository, 'amount', query),
      this.invoiceSummary(query),
      this.walletSummary(),
      this.settlementSummary(),
    ]);

    const recentTransactions = await this.transactionRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      summary: {
        totalIncome,
        totalExpense,
        netIncome: totalIncome - totalExpense,
      },
      invoices: invoiceStats,
      wallets: walletStats,
      settlements: settlementStats,
      recentTransactions,
    };
  }

  // ---------- TRANSACTIONS ----------

  async findAllTransactions(query: ListTransactionQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.direction) where.direction = query.direction;
    if (query.userId) where.userId = query.userId;
    if (query.gatewayId) where.gatewayId = query.gatewayId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['transactionCode'],
      sortableFields: ['transactionCode', 'amount', 'status', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] =
      await this.transactionRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- INVOICES ----------

  async findAllInvoices(query: ListInvoiceQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.orderId) where.orderId = query.orderId;
    if (query.userId) where.userId = query.userId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['invoiceCode'],
      sortableFields: ['invoiceCode', 'totalAmount', 'status', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.invoiceRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- EXPENSES / INCOMES ----------

  async findAllExpenses(query: ListExpenseQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.status) where.status = query.status;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['expenseCode'],
      sortableFields: ['expenseCode', 'amount', 'status', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.expenseRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAllIncomes(query: ListIncomeQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.status) where.status = query.status;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['incomeCode'],
      sortableFields: ['incomeCode', 'amount', 'status', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.incomeRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- JOURNAL ENTRIES + LEDGERS ----------

  async findAllJournalEntries(query: ListJournalEntryQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.entryType) where.entryType = query.entryType;
    if (query.status) where.status = query.status;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['entryCode'],
      sortableFields: ['entryCode', 'debitTotal', 'creditTotal', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] =
      await this.journalEntryRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // Posts a balanced double-entry journal: creates the entry header plus one
  // ledger row per account line and rolls each account's current balance.
  async createJournalEntry(dto: CreateJournalEntryDto, req: AdminRequest) {
    if (!dto.lines || dto.lines.length < 2) {
      throw new BadRequestException(
        'A journal entry requires at least two account lines',
      );
    }

    const debitTotal = dto.lines
      .filter((line) => line.transactionType === LedgerTransactionType.DEBIT)
      .reduce((sum, line) => sum + line.amount, 0);
    const creditTotal = dto.lines
      .filter((line) => line.transactionType === LedgerTransactionType.CREDIT)
      .reduce((sum, line) => sum + line.amount, 0);

    if (Math.abs(debitTotal - creditTotal) > 0.001) {
      throw new BadRequestException(
        'Journal entry is unbalanced: total debits must equal total credits',
      );
    }

    const accountIds = [...new Set(dto.lines.map((line) => line.accountId))];
    const accounts = await this.accountRepository.findBy({
      id: In(accountIds),
    });
    if (accounts.length !== accountIds.length) {
      throw new BadRequestException('One or more accounts do not exist');
    }
    const accountMap = new Map(
      accounts.map((account) => [account.id, account]),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let entry: JournalEntry | null = null;
    try {
      entry = await queryRunner.manager.save(
        queryRunner.manager.create(JournalEntry, {
          entryCode: this.nextCode('JE'),
          entryDate: dto.entryDate,
          description: dto.description,
          entryType: dto.entryType,
          debitTotal,
          creditTotal,
          status: JournalEntryStatus.POSTED,
          postedBy: req.user.id,
          postedAt: new Date(),
        }),
      );

      // Apply lines sequentially so each balanceAfter reflects the running total.
      for (const line of dto.lines) {
        const account = accountMap.get(line.accountId)!;
        const balanceAfter = this.applyToBalance(
          account,
          line.transactionType,
          line.amount,
        );

        await queryRunner.manager.save(
          queryRunner.manager.create(Ledger, {
            journalEntryId: entry.id,
            accountId: account.id,
            transactionType: line.transactionType,
            amount: line.amount,
            balanceAfter,
            description: line.description ?? dto.description,
          }),
        );

        account.currentBalance = balanceAfter;
        await queryRunner.manager.save(account);
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
      'FINANCE',
      'JOURNAL_ENTRY_POSTED',
      'JournalEntry',
      entry.id,
      `Posted journal entry ${entry.entryCode} (${debitTotal} debit / ${creditTotal} credit)`,
      undefined,
      entry,
    );
    return { message: 'Journal entry posted successfully', entry };
  }

  async findAllLedgers(query: ListLedgerQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.accountId) where.accountId = query.accountId;
    if (query.journalEntryId) where.journalEntryId = query.journalEntryId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['description'],
      sortableFields: ['amount', 'transactionType', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.ledgerRepository.findAndCount({
      ...options,
      relations: { account: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- ACCOUNTS / TAX ----------

  async findAllAccounts(query: ListAccountQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.accountType) where.accountType = query.accountType;
    if (query.status) where.status = query.status;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      searchableFields: ['name', 'accountCode'],
      sortableFields: ['accountCode', 'name', 'currentBalance', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.accountRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAllTaxes(query: ListTaxQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.taxType) where.taxType = query.taxType;
    if (query.status) where.status = query.status;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      searchableFields: ['name', 'taxCode'],
      sortableFields: ['name', 'rate', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.taxRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- COMMISSION / SALARY / SETTLEMENT / REFUND ----------

  async findAllCommissions(query: ListCommissionQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.commissionType) where.commissionType = query.commissionType;
    if (query.status) where.status = query.status;
    if (query.agentId) where.agentId = query.agentId;
    if (query.riderId) where.riderId = query.riderId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['commissionCode'],
      sortableFields: [
        'commissionCode',
        'commissionAmount',
        'status',
        'createdAt',
      ],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] =
      await this.commissionRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAllSalaries(query: ListSalaryQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.employeeType) where.employeeType = query.employeeType;
    if (query.employeeId) where.employeeId = query.employeeId;
    if (query.month) where.month = query.month;
    if (query.year) where.year = query.year;
    if (query.paymentStatus) where.paymentStatus = query.paymentStatus;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      searchableFields: ['employeeId'],
      sortableFields: ['month', 'year', 'netSalary', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.salaryRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAllSettlements(query: ListSettlementQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.entityType) where.entityType = query.entityType;
    if (query.entityId) where.entityId = query.entityId;
    if (query.paymentStatus) where.paymentStatus = query.paymentStatus;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['settlementCode'],
      sortableFields: [
        'settlementCode',
        'netAmount',
        'paymentStatus',
        'createdAt',
      ],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] =
      await this.settlementRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAllCustomerRefunds(query: ListCustomerRefundQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.orderId) where.orderId = query.orderId;
    if (query.userId) where.userId = query.userId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['refundCode'],
      sortableFields: ['refundCode', 'amount', 'status', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.refundRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- PROFIT/LOSS + BALANCE SHEET + REPORTS ----------

  async findAllProfitLoss(query: ListProfitLossQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.periodType) where.periodType = query.periodType;
    if (query.period) where.period = query.period;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'generatedAt',
      sortableFields: ['period', 'periodType', 'netProfit', 'generatedAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] =
      await this.profitLossRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAllBalanceSheets(query: ListBalanceSheetQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.periodType) where.periodType = query.periodType;
    if (query.period) where.period = query.period;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'generatedAt',
      sortableFields: ['period', 'periodType', 'generatedAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] =
      await this.balanceSheetRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findAllReports(query: ListFinancialReportQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.reportType) where.reportType = query.reportType;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'generatedAt',
      searchableFields: ['title', 'reportCode'],
      sortableFields: ['title', 'reportCode', 'generatedAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.reportRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- WALLETS ----------

  async findAllWallets(query: ListWalletQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.walletType) where.walletType = query.walletType;
    if (query.userId) where.userId = query.userId;
    if (query.status) where.status = query.status;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      searchableFields: ['walletCode'],
      sortableFields: ['walletCode', 'currentBalance', 'createdAt'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.walletRepository.findAndCount(options);
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  // ---------- SYSTEM SETTINGS ----------

  async createSystemSetting(dto: CreateSystemSettingDto, req: AdminRequest) {
    const existing = await this.settingRepository.findOne({
      where: { settingKey: dto.settingKey },
    });
    if (existing) {
      throw new ConflictException('System setting key already exists');
    }

    const setting = await this.settingRepository.save(
      this.settingRepository.create({
        settingKey: dto.settingKey,
        settingValue: dto.settingValue,
        group: dto.group,
        description: dto.description,
        isSecret: dto.isSecret ?? false,
        updatedBy: req.user.id,
      }),
    );

    await this.adminAuditService.log(
      req,
      'FINANCE',
      'SYSTEM_SETTING_CREATED',
      'SystemSetting',
      setting.id,
      `Created system setting ${setting.settingKey}`,
      undefined,
      setting,
    );
    return { message: 'System setting created successfully', setting };
  }

  async updateSystemSetting(
    id: string,
    dto: UpdateSystemSettingDto,
    req: AdminRequest,
  ) {
    const setting = await this.settingRepository.findOne({ where: { id } });
    if (!setting) {
      throw new NotFoundException('System setting not found');
    }

    const oldValue = { ...setting };
    if (dto.settingValue !== undefined) setting.settingValue = dto.settingValue;
    if (dto.group !== undefined) setting.group = dto.group;
    if (dto.description !== undefined) setting.description = dto.description;
    if (dto.isSecret !== undefined) setting.isSecret = dto.isSecret;
    setting.updatedBy = req.user.id;
    const saved = await this.settingRepository.save(setting);

    await this.adminAuditService.log(
      req,
      'FINANCE',
      'SYSTEM_SETTING_UPDATED',
      'SystemSetting',
      id,
      `Updated system setting ${setting.settingKey}`,
      oldValue,
      saved,
    );
    return { message: 'System setting updated successfully', setting: saved };
  }

  // ---------- PRIVATE HELPERS ----------

  // Account balance effect of a debit/credit on a normal-balance account:
  //   ASSET/EXPENSE  — debit increases, credit decreases
  //   LIABILITY/EQUITY/REVENUE — credit increases, debit decreases
  private applyToBalance(
    account: Account,
    transactionType: LedgerTransactionType,
    amount: number,
  ): number {
    const isDebit = transactionType === LedgerTransactionType.DEBIT;
    const debitsIncrease =
      account.accountType === AccountType.ASSET ||
      account.accountType === AccountType.EXPENSE;

    const delta =
      (isDebit && debitsIncrease) || (!isDebit && !debitsIncrease)
        ? amount
        : -amount;
    return Number((account.currentBalance + delta).toFixed(4));
  }

  private async invoiceSummary(query: ListDashboardQueryDto) {
    const [totalAmount, paidAmount, issuedCount, overdueCount] =
      await Promise.all([
        this.sumField(this.invoiceRepository, 'totalAmount', query),
        this.sumField(this.invoiceRepository, 'paidAmount', query),
        this.invoiceRepository.count({
          where: { status: InvoiceStatus.ISSUED },
        }),
        this.invoiceRepository.count({
          where: { status: InvoiceStatus.OVERDUE },
        }),
      ]);
    return {
      totalAmount,
      paidAmount,
      outstanding: totalAmount - paidAmount,
      issuedCount,
      overdueCount,
    };
  }

  private async walletSummary() {
    const [totalBalance, activeWallets] = await Promise.all([
      this.sumField(this.walletRepository, 'currentBalance'),
      this.walletRepository.count({ where: { status: WalletStatus.ACTIVE } }),
    ]);
    return { totalBalance, activeWallets };
  }

  private async settlementSummary() {
    const [pendingCount, pendingAmount] = await Promise.all([
      this.settlementRepository.count({
        where: { paymentStatus: SettlementPaymentStatus.PENDING },
      }),
      this.settlementRepository
        .createQueryBuilder('s')
        .select('COALESCE(SUM(s.netAmount), 0)', 'total')
        .where('s.paymentStatus = :status', {
          status: SettlementPaymentStatus.PENDING,
        })
        .getRawOne<{ total: string | number }>(),
    ]);
    return {
      pendingCount,
      pendingAmount: Number(pendingAmount?.total ?? 0),
    };
  }

  // Generic SUM over a nullable date range for dashboard aggregates.
  private async sumField(
    repository: Repository<object>,
    field: string,
    query?: ListDashboardQueryDto,
  ): Promise<number> {
    const qb = repository
      .createQueryBuilder('e')
      .select(`COALESCE(SUM(e.${field}), 0)`, 'total');
    if (query?.fromDate) {
      qb.andWhere('e.createdAt >= :fromDate', {
        fromDate: new Date(query.fromDate),
      });
    }
    if (query?.toDate) {
      qb.andWhere('e.createdAt <= :toDate', {
        toDate: new Date(query.toDate),
      });
    }
    const row = await qb.getRawOne<{ total: string | number }>();
    return Number(row?.total ?? 0);
  }

  private nextCode(prefix: string): string {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
  }
}
