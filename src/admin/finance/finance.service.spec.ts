import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FinanceService } from './finance.service';
import { Account, AccountType, LedgerTransactionType } from './entities';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';

// Unit tests for the double-entry journal posting logic: balance validation,
// account existence checks, and the per-account normal-balance roll.
describe('FinanceService', () => {
  const mockRepo = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn((entity: unknown) => Promise.resolve(entity)),
    create: jest.fn((values: unknown) => values),
    findBy: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: '0' }),
    })),
  });

  const makeAccount = (
    id: string,
    accountType: AccountType,
    currentBalance = 0,
  ): Account =>
    ({
      id,
      accountCode: `ACC-${id}`,
      name: `Account ${id}`,
      accountType,
      currentBalance,
    }) as Account;

  const adminReq = {
    user: { id: 'admin-1', roles: ['ADMIN'] },
  } as AdminRequest;

  let service: FinanceService;
  let repos: Record<string, ReturnType<typeof mockRepo>>;
  let adminAuditServiceLog: jest.Mock;
  let queryRunnerManager: {
    save: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(() => {
    repos = {
      transactionRepository: mockRepo(),
      invoiceRepository: mockRepo(),
      expenseRepository: mockRepo(),
      incomeRepository: mockRepo(),
      journalEntryRepository: mockRepo(),
      ledgerRepository: mockRepo(),
      accountRepository: mockRepo(),
      taxRepository: mockRepo(),
      commissionRepository: mockRepo(),
      salaryRepository: mockRepo(),
      settlementRepository: mockRepo(),
      refundRepository: mockRepo(),
      reportRepository: mockRepo(),
      walletRepository: mockRepo(),
      settingRepository: mockRepo(),
      profitLossRepository: mockRepo(),
      balanceSheetRepository: mockRepo(),
    };

    queryRunnerManager = {
      save: jest.fn((entity: unknown) => Promise.resolve(entity)),
      // Mimics TypeORM: generated rows carry an id so entry.id is defined
      create: jest.fn((_entity: unknown, values: unknown) => ({
        ...(values as object),
        id: 'je-1',
      })),
    };
    const dataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn().mockResolvedValue(undefined),
        startTransaction: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        rollbackTransaction: jest.fn().mockResolvedValue(undefined),
        release: jest.fn().mockResolvedValue(undefined),
        manager: queryRunnerManager,
      }),
    } as unknown as DataSource;
    adminAuditServiceLog = jest.fn().mockResolvedValue(undefined);
    const adminAuditService = { log: adminAuditServiceLog };

    service = new FinanceService(
      repos.transactionRepository as never,
      repos.invoiceRepository as never,
      repos.expenseRepository as never,
      repos.incomeRepository as never,
      repos.journalEntryRepository as never,
      repos.ledgerRepository as never,
      repos.accountRepository as never,
      repos.taxRepository as never,
      repos.commissionRepository as never,
      repos.salaryRepository as never,
      repos.settlementRepository as never,
      repos.refundRepository as never,
      repos.reportRepository as never,
      repos.walletRepository as never,
      repos.settingRepository as never,
      repos.profitLossRepository as never,
      repos.balanceSheetRepository as never,
      dataSource,
      adminAuditService as never,
    );
  });

  const debit = (accountId: string, amount: number) => ({
    accountId,
    transactionType: LedgerTransactionType.DEBIT,
    amount,
  });
  const credit = (accountId: string, amount: number) => ({
    accountId,
    transactionType: LedgerTransactionType.CREDIT,
    amount,
  });

  describe('createJournalEntry', () => {
    it('rejects an entry with fewer than two lines', async () => {
      await expect(
        service.createJournalEntry(
          {
            entryDate: '2026-08-01',
            description: 'single line',
            lines: [debit('a1', 100)],
          },
          adminReq,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects an unbalanced entry (debits != credits)', async () => {
      await expect(
        service.createJournalEntry(
          {
            entryDate: '2026-08-01',
            description: 'unbalanced',
            lines: [debit('a1', 100), credit('a2', 50)],
          },
          adminReq,
        ),
      ).rejects.toThrow('must equal total credits');
    });

    it('rejects an entry referencing a non-existent account', async () => {
      repos.accountRepository.findBy.mockResolvedValue([
        makeAccount('a1', AccountType.ASSET),
      ]);

      await expect(
        service.createJournalEntry(
          {
            entryDate: '2026-08-01',
            description: 'bad account',
            lines: [debit('a1', 100), credit('a2', 100)],
          },
          adminReq,
        ),
      ).rejects.toThrow('do not exist');
    });

    it('posts a balanced entry and rolls account balances by normal balance', async () => {
      const asset = makeAccount('a1', AccountType.ASSET, 100);
      const revenue = makeAccount('a2', AccountType.REVENUE, 0);
      repos.accountRepository.findBy.mockResolvedValue([asset, revenue]);

      const result = await service.createJournalEntry(
        {
          entryDate: '2026-08-01',
          description: 'sale on credit',
          lines: [debit('a1', 100), credit('a2', 100)],
        },
        adminReq,
      );

      // ASSET: debit increases 100 -> 200. REVENUE: credit increases 100 -> 100.
      expect(result.entry).toBeDefined();
      expect(asset.currentBalance).toBe(200);
      expect(revenue.currentBalance).toBe(100);
      // The header + one ledger row per line + two account updates are saved.
      expect(queryRunnerManager.save).toHaveBeenCalled();
      // Journal postings are audit-logged for the admin trail
      expect(adminAuditServiceLog).toHaveBeenCalledWith(
        adminReq,
        'FINANCE',
        'JOURNAL_ENTRY_POSTED',
        'JournalEntry',
        expect.any(String),
        expect.stringContaining('JE-'),
        undefined,
        expect.any(Object),
      );
    });

    it('credits decrease ASSET balances', async () => {
      const asset = makeAccount('a1', AccountType.ASSET, 500);
      const expense = makeAccount('a2', AccountType.EXPENSE, 0);
      repos.accountRepository.findBy.mockResolvedValue([asset, expense]);

      await service.createJournalEntry(
        {
          entryDate: '2026-08-01',
          description: 'cash out',
          lines: [credit('a1', 200), debit('a2', 200)],
        },
        adminReq,
      );

      expect(asset.currentBalance).toBe(300);
      expect(expense.currentBalance).toBe(200);
    });
  });
});
