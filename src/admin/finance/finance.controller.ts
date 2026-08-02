import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
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

// All finance routes require authentication (global StrictJwtAuthGuard) AND
// the ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
// Static routes must be declared before any parameterized :id route.
@ApiTags('Admin - Finance')
@ApiBearerAuth()
@Controller('admin/finance')
@AdminOnly()
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('dashboard')
  async getDashboard(@Query() query: ListDashboardQueryDto) {
    return this.financeService.getDashboard(query);
  }

  @Get('transactions')
  async findAllTransactions(@Query() query: ListTransactionQueryDto) {
    return this.financeService.findAllTransactions(query);
  }

  @Get('invoices')
  async findAllInvoices(@Query() query: ListInvoiceQueryDto) {
    return this.financeService.findAllInvoices(query);
  }

  @Get('expenses')
  async findAllExpenses(@Query() query: ListExpenseQueryDto) {
    return this.financeService.findAllExpenses(query);
  }

  @Get('incomes')
  async findAllIncomes(@Query() query: ListIncomeQueryDto) {
    return this.financeService.findAllIncomes(query);
  }

  @Get('journal-entries')
  async findAllJournalEntries(@Query() query: ListJournalEntryQueryDto) {
    return this.financeService.findAllJournalEntries(query);
  }

  @Post('journal-entries')
  async createJournalEntry(
    @Body() dto: CreateJournalEntryDto,
    @Req() req: AdminRequest,
  ) {
    return this.financeService.createJournalEntry(dto, req);
  }

  @Get('ledgers')
  async findAllLedgers(@Query() query: ListLedgerQueryDto) {
    return this.financeService.findAllLedgers(query);
  }

  @Get('accounts')
  async findAllAccounts(@Query() query: ListAccountQueryDto) {
    return this.financeService.findAllAccounts(query);
  }

  @Get('taxes')
  async findAllTaxes(@Query() query: ListTaxQueryDto) {
    return this.financeService.findAllTaxes(query);
  }

  @Get('commissions')
  async findAllCommissions(@Query() query: ListCommissionQueryDto) {
    return this.financeService.findAllCommissions(query);
  }

  @Get('salaries')
  async findAllSalaries(@Query() query: ListSalaryQueryDto) {
    return this.financeService.findAllSalaries(query);
  }

  @Get('settlements')
  async findAllSettlements(@Query() query: ListSettlementQueryDto) {
    return this.financeService.findAllSettlements(query);
  }

  @Get('customer-refunds')
  async findAllCustomerRefunds(@Query() query: ListCustomerRefundQueryDto) {
    return this.financeService.findAllCustomerRefunds(query);
  }

  @Get('profit-loss')
  async findAllProfitLoss(@Query() query: ListProfitLossQueryDto) {
    return this.financeService.findAllProfitLoss(query);
  }

  @Get('balance-sheet')
  async findAllBalanceSheets(@Query() query: ListBalanceSheetQueryDto) {
    return this.financeService.findAllBalanceSheets(query);
  }

  @Get('reports')
  async findAllReports(@Query() query: ListFinancialReportQueryDto) {
    return this.financeService.findAllReports(query);
  }

  @Get('wallets')
  async findAllWallets(@Query() query: ListWalletQueryDto) {
    return this.financeService.findAllWallets(query);
  }

  @Post('system-settings')
  async createSystemSetting(
    @Body() dto: CreateSystemSettingDto,
    @Req() req: AdminRequest,
  ) {
    return this.financeService.createSystemSetting(dto, req);
  }

  @Patch('system-settings/:id')
  async updateSystemSetting(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSystemSettingDto,
    @Req() req: AdminRequest,
  ) {
    return this.financeService.updateSystemSetting(id, dto, req);
  }
}
