import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow, monthYear } from './helpers';
import type { SeedCtx } from './context';
import {
  Dashboard,
  DashboardStatus,
  DashboardWidget,
  DashboardWidgetStatus,
  KPI,
  KpiStatus,
  SalesAnalytics,
  RevenueAnalytics,
  CustomerAnalytics,
  AgentAnalytics,
  ReportsRiderAnalytics,
  InventoryAnalytics,
  ProductAnalytics,
  ReportsUsedBookAnalytics,
  DigitalContentAnalytics,
  CustomOrderAnalytics,
  PaymentAnalytics,
  AreaAnalytics,
  VendorAnalytics,
  MarketingAnalytics,
  NotificationAnalytics,
  SearchAnalytics,
  ReportsOrderAnalytics,
  DeliveryAnalytics,
  FinancialAnalytics,
  UserActivityAnalytics,
  ReportTemplate,
  ReportTemplateStatus,
  GeneratedReport,
  GeneratedReportStatus,
  ScheduledReport,
  ScheduledReportStatus,
  ExportHistory,
  ExportFormat,
  ExportStatus,
  Forecast,
  ForecastStatus,
  AuditReport,
  AuditReportStatus,
  BusinessInsight,
  InsightSeverity,
} from '../../admin/reports/entities';

/**
 * Reports / BI seed. Keys shared across domains:
 *   dashboard:1, kpi:1..4, reporttemplate:1..2, export:1, forecast:1
 */
export async function seedReports(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  const { month, year } = monthYear(0);
  const period = `${year}-${String(month).padStart(2, '0')}`;
  const lastPeriod = `${year}-${String(month - 1).padStart(2, '0')}`;

  // ---------------------------------------------------------------- dashboards
  await seedRows(
    manager,
    Dashboard,
    [
      {
        id: uid('dashboard:1'),
        dashboardCode: 'DASH-001',
        name: 'Executive Overview',
        description: 'High-level KPIs for the executive team',
        layout: { columns: 2, widgets: ['kpi-1', 'kpi-2', 'kpi-3', 'kpi-4'] },
        sortOrder: 1,
        isDefault: true,
        isSystem: true,
        status: DashboardStatus.ACTIVE,
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('dashboard:2'),
        dashboardCode: 'DASH-002',
        name: 'Operations Dashboard',
        description: 'Daily operational metrics for ops team',
        layout: { columns: 1 },
        sortOrder: 2,
        isDefault: false,
        isSystem: false,
        status: DashboardStatus.ACTIVE,
        createdBy: uid('user:staff-1'),
      },
    ],
    'dashboards',
  );

  // ---------------------------------------------------------- dashboard_widgets
  await seedRows(
    manager,
    DashboardWidget,
    [
      {
        id: uid('dashwidget:1'),
        dashboardId: uid('dashboard:1'),
        widgetType: 'KPI_CARD',
        title: 'Total Orders',
        metricKey: 'totalOrders',
        config: { format: 'number' },
        sortOrder: 1,
        status: DashboardWidgetStatus.ACTIVE,
      },
      {
        id: uid('dashwidget:2'),
        dashboardId: uid('dashboard:1'),
        widgetType: 'KPI_CARD',
        title: 'Total Revenue',
        metricKey: 'totalRevenue',
        config: { format: 'currency' },
        sortOrder: 2,
        status: DashboardWidgetStatus.ACTIVE,
      },
      {
        id: uid('dashwidget:3'),
        dashboardId: uid('dashboard:1'),
        widgetType: 'CHART',
        title: 'Sales Trend',
        metricKey: 'salesTrend',
        config: { type: 'line' },
        sortOrder: 3,
        status: DashboardWidgetStatus.ACTIVE,
      },
      {
        id: uid('dashwidget:4'),
        dashboardId: uid('dashboard:1'),
        widgetType: 'TABLE',
        title: 'Top Products',
        metricKey: 'topProducts',
        config: { limit: 5 },
        sortOrder: 4,
        status: DashboardWidgetStatus.ACTIVE,
      },
    ],
    'dashboard_widgets',
  );

  // ----------------------------------------------------------------------- kpis
  await seedRows(
    manager,
    KPI,
    [
      {
        id: uid('kpi:1'),
        kpiCode: 'KPI-ORDERS',
        name: 'Total Orders',
        category: 'sales',
        value: 45,
        target: 50,
        unit: 'orders',
        period: lastPeriod,
        periodType: 'MONTHLY',
        generatedAt: daysFromNow(-30),
        status: KpiStatus.ACTIVE,
      },
      {
        id: uid('kpi:2'),
        kpiCode: 'KPI-REVENUE',
        name: 'Gross Revenue',
        category: 'finance',
        value: 125000,
        target: 150000,
        unit: 'BDT',
        period: lastPeriod,
        periodType: 'MONTHLY',
        generatedAt: daysFromNow(-30),
        status: KpiStatus.ACTIVE,
      },
      {
        id: uid('kpi:3'),
        kpiCode: 'KPI-NPS',
        name: 'Net Profit',
        category: 'finance',
        value: 15000,
        target: 20000,
        unit: 'BDT',
        period: lastPeriod,
        periodType: 'MONTHLY',
        generatedAt: daysFromNow(-30),
        status: KpiStatus.ACTIVE,
      },
      {
        id: uid('kpi:4'),
        kpiCode: 'KPI-ONTIME',
        name: 'On-time Delivery Rate',
        category: 'delivery',
        value: 92,
        target: 95,
        unit: '%',
        period: lastPeriod,
        periodType: 'MONTHLY',
        generatedAt: daysFromNow(-30),
        status: KpiStatus.ACTIVE,
      },
    ],
    'kpis',
  );

  // -------------------------------------------------------------- sales_analytics
  await seedRows(
    manager,
    SalesAnalytics,
    [
      {
        id: uid('salesanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalOrders: 45,
        totalSales: 125000,
        avgOrderValue: 2777.78,
        totalDiscount: 5000,
        returnedAmount: 2500,
        cancelledAmount: 1500,
        netSales: 116000,
        generatedAt: daysFromNow(-30),
      },
      {
        id: uid('salesanalytics:2'),
        period,
        periodType: 'MONTHLY',
        totalOrders: 12,
        totalSales: 32000,
        avgOrderValue: 2666.67,
        totalDiscount: 800,
        returnedAmount: 0,
        cancelledAmount: 0,
        netSales: 31200,
        generatedAt: daysFromNow(-2),
      },
    ],
    'sales_analytics',
  );

  // ----------------------------------------------------------- revenue_analytics
  await seedRows(
    manager,
    RevenueAnalytics,
    [
      {
        id: uid('revenueanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        grossRevenue: 125000,
        netRevenue: 116000,
        costOfGoods: 85000,
        grossProfit: 40000,
        operatingExpense: 25000,
        netProfit: 15000,
        refundAmount: 2500,
        generatedAt: daysFromNow(-30),
      },
    ],
    'revenue_analytics',
  );

  // ---------------------------------------------------------- customer_analytics
  await seedRows(
    manager,
    CustomerAnalytics,
    [
      {
        id: uid('customeranalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalCustomers: 120,
        newCustomers: 18,
        activeCustomers: 90,
        churnedCustomers: 5,
        repeatPurchaseRate: 45,
        avgOrderPerCustomer: 2.1,
        generatedAt: daysFromNow(-30),
      },
    ],
    'customer_analytics',
  );

  // ------------------------------------------------------------- agent_analytics
  await seedRows(
    manager,
    AgentAnalytics,
    [
      {
        id: uid('agentanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalAgents: 2,
        activeAgents: 2,
        totalOrders: 70,
        totalSales: 140000,
        avgOrderValue: 2000,
        totalCommission: 7000,
        generatedAt: daysFromNow(-30),
      },
    ],
    'agent_analytics',
  );

  // ---------------------------------------------------- bi_rider_analytics (reports)
  await seedRows(
    manager,
    ReportsRiderAnalytics,
    [
      {
        id: uid('rideranalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalRiders: 2,
        activeRiders: 2,
        totalDeliveries: 40,
        onTimeRate: 92,
        avgDeliveryTime: 18,
        failedDeliveries: 2,
        generatedAt: daysFromNow(-30),
      },
    ],
    'bi_rider_analytics',
  );

  // ---------------------------------------------------------- inventory_analytics
  await seedRows(
    manager,
    InventoryAnalytics,
    [
      {
        id: uid('inventoryanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalProducts: 6,
        lowStockCount: 2,
        outOfStockCount: 1,
        stockValue: 250000,
        stockMovementCount: 18,
        damagedStockCount: 3,
        generatedAt: daysFromNow(-30),
      },
    ],
    'inventory_analytics',
  );

  // ------------------------------------------------------------ product_analytics
  await seedRows(
    manager,
    ProductAnalytics,
    [
      {
        id: uid('productanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        productId: uid('product:1'),
        totalViews: 1200,
        totalSales: 45,
        totalRevenue: 49500,
        avgRating: 4.6,
        wishlistCount: 20,
        generatedAt: daysFromNow(-30),
      },
      {
        id: uid('productanalytics:2'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        productId: uid('product:4'),
        totalViews: 800,
        totalSales: 30,
        totalRevenue: 59970,
        avgRating: 4.4,
        wishlistCount: 15,
        generatedAt: daysFromNow(-30),
      },
    ],
    'product_analytics',
  );

  // ------------------------------------------------- bi_used_book_analytics (reports)
  await seedRows(
    manager,
    ReportsUsedBookAnalytics,
    [
      {
        id: uid('ubanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalRequests: 12,
        approvedItems: 8,
        evaluatedItems: 9,
        resoldItems: 5,
        totalValue: 6500,
        avgBuybackPrice: 541.67,
        generatedAt: daysFromNow(-30),
      },
    ],
    'bi_used_book_analytics',
  );

  // --------------------------------------------------- digital_content_analytics
  await seedRows(
    manager,
    DigitalContentAnalytics,
    [
      {
        id: uid('dcontentanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalContent: 3,
        totalDownloads: 45,
        totalPurchases: 20,
        totalRevenue: 30000,
        activeSubscriptions: 2,
        totalExamAttempts: 10,
        generatedAt: daysFromNow(-30),
      },
    ],
    'digital_content_analytics',
  );

  // ------------------------------------------------------ custom_order_analytics
  await seedRows(
    manager,
    CustomOrderAnalytics,
    [
      {
        id: uid('customorderanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalOrders: 15,
        approvedOrders: 10,
        inProduction: 3,
        deliveredOrders: 7,
        totalRevenue: 45000,
        avgOrderValue: 3000,
        generatedAt: daysFromNow(-30),
      },
    ],
    'custom_order_analytics',
  );

  // ------------------------------------------------------------ payment_analytics
  await seedRows(
    manager,
    PaymentAnalytics,
    [
      {
        id: uid('paymentanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalTransactions: 60,
        totalAmount: 200000,
        completedAmount: 185000,
        failedAmount: 8000,
        refundedAmount: 7000,
        avgTransaction: 3333.33,
        generatedAt: daysFromNow(-30),
      },
    ],
    'payment_analytics',
  );

  // --------------------------------------------------------------- area_analytics
  await seedRows(
    manager,
    AreaAnalytics,
    [
      {
        id: uid('areaanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalAreas: 4,
        activeAreas: 4,
        totalOrders: 45,
        totalSales: 125000,
        topAreaCode: 'DHA-A1',
        generatedAt: daysFromNow(-30),
      },
    ],
    'area_analytics',
  );

  // ------------------------------------------------------------- vendor_analytics
  await seedRows(
    manager,
    VendorAnalytics,
    [
      {
        id: uid('vendoranalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalVendors: 2,
        activeVendors: 2,
        totalPurchases: 6,
        totalPurchaseAmount: 240000,
        totalPaidAmount: 150000,
        outstandingAmount: 90000,
        generatedAt: daysFromNow(-30),
      },
    ],
    'vendor_analytics',
  );

  // ---------------------------------------------------------- marketing_analytics
  await seedRows(
    manager,
    MarketingAnalytics,
    [
      {
        id: uid('marketinganalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        campaigns: 3,
        impressions: 50000,
        clicks: 2500,
        conversions: 120,
        conversionRate: 4.8,
        totalSpend: 20000,
        roi: 3.5,
        generatedAt: daysFromNow(-30),
      },
    ],
    'marketing_analytics',
  );

  // ------------------------------------------------------- notification_analytics
  await seedRows(
    manager,
    NotificationAnalytics,
    [
      {
        id: uid('notificationanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalSent: 500,
        deliveredCount: 480,
        openedCount: 300,
        clickCount: 150,
        optOutCount: 10,
        openRate: 62.5,
        generatedAt: daysFromNow(-30),
      },
    ],
    'notification_analytics',
  );

  // ------------------------------------------------------------ search_analytics
  await seedRows(
    manager,
    SearchAnalytics,
    [
      {
        id: uid('searchanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalSearches: 2500,
        uniqueSearches: 900,
        noResultSearches: 150,
        topSearchTerm: 'physics',
        generatedAt: daysFromNow(-30),
      },
    ],
    'search_analytics',
  );

  // -------------------------------------------- bi_order_analytics (reports)
  await seedRows(
    manager,
    ReportsOrderAnalytics,
    [
      {
        id: uid('orderanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalOrders: 45,
        confirmedOrders: 40,
        shippedOrders: 35,
        deliveredOrders: 32,
        cancelledOrders: 3,
        returnedOrders: 2,
        refundedOrders: 1,
        avgOrderValue: 2777.78,
        generatedAt: daysFromNow(-30),
      },
    ],
    'bi_order_analytics',
  );

  // ---------------------------------------------------------- delivery_analytics
  await seedRows(
    manager,
    DeliveryAnalytics,
    [
      {
        id: uid('deliveryanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalDeliveries: 40,
        onTimeDeliveries: 37,
        lateDeliveries: 2,
        failedDeliveries: 1,
        avgDeliveryHours: 18,
        onTimeRate: 92,
        generatedAt: daysFromNow(-30),
      },
    ],
    'delivery_analytics',
  );

  // --------------------------------------------------------- financial_analytics
  await seedRows(
    manager,
    FinancialAnalytics,
    [
      {
        id: uid('financialanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalIncome: 125000,
        totalExpense: 57000,
        netProfit: 68000,
        totalReceivable: 1892.5,
        totalPayable: 45000,
        cashBalance: 250420,
        generatedAt: daysFromNow(-30),
      },
    ],
    'financial_analytics',
  );

  // ------------------------------------------------------ user_activity_analytics
  await seedRows(
    manager,
    UserActivityAnalytics,
    [
      {
        id: uid('useractivityanalytics:1'),
        period: lastPeriod,
        periodType: 'MONTHLY',
        totalActiveUsers: 90,
        totalSessions: 1200,
        totalRegistrations: 18,
        avgSessionDuration: 15,
        retentionRate: 45,
        generatedAt: daysFromNow(-30),
      },
    ],
    'user_activity_analytics',
  );

  // ------------------------------------------------------------ report_templates
  await seedRows(
    manager,
    ReportTemplate,
    [
      {
        id: uid('reporttemplate:1'),
        templateCode: 'TPL-SALES-MONTHLY',
        name: 'Monthly Sales Report',
        reportType: 'CUSTOM',
        description: 'Monthly sales and revenue summary',
        config: { filters: ['period'] },
        isSystem: true,
        status: ReportTemplateStatus.ACTIVE,
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('reporttemplate:2'),
        templateCode: 'TPL-PNL-MONTHLY',
        name: 'Monthly Profit & Loss',
        reportType: 'PROFIT_LOSS',
        description: 'Monthly P&L statement',
        config: { filters: ['period'] },
        isSystem: true,
        status: ReportTemplateStatus.ACTIVE,
        createdBy: uid('user:staff-1'),
      },
    ],
    'report_templates',
  );

  // ----------------------------------------------------------- generated_reports
  await seedRows(
    manager,
    GeneratedReport,
    [
      {
        id: uid('generatedreport:1'),
        reportCode: 'GR-2026-0001',
        templateId: uid('reporttemplate:1'),
        reportType: 'CUSTOM',
        title: 'Monthly Sales Report - June 2026',
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        params: { period: '2026-06' },
        data: { totalSales: 125000, totalOrders: 45 },
        fileUrl: '/reports/sales/gr-2026-0001.pdf',
        status: GeneratedReportStatus.COMPLETED,
        generatedBy: uid('user:staff-1'),
        completedAt: daysFromNow(-2),
      },
      {
        id: uid('generatedreport:2'),
        reportCode: 'GR-2026-0002',
        reportType: 'PROFIT_LOSS',
        title: 'P&L Report - June 2026',
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        params: { period: '2026-06' },
        status: GeneratedReportStatus.PENDING,
        generatedBy: uid('user:staff-1'),
      },
    ],
    'generated_reports',
  );

  // ------------------------------------------------------------ scheduled_reports
  await seedRows(
    manager,
    ScheduledReport,
    [
      {
        id: uid('scheduledreport:1'),
        templateId: uid('reporttemplate:1'),
        scheduleName: 'Weekly Sales Digest',
        cronExpression: '0 9 * * 1',
        recipients: ['admin@boilagbe.test'],
        params: { periodType: 'WEEKLY' },
        nextRunAt: daysFromNow(6),
        status: ScheduledReportStatus.ACTIVE,
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('scheduledreport:2'),
        templateId: uid('reporttemplate:2'),
        scheduleName: 'Monthly P&L',
        cronExpression: '0 9 1 * *',
        recipients: ['admin@boilagbe.test'],
        params: { periodType: 'MONTHLY' },
        nextRunAt: daysFromNow(25),
        status: ScheduledReportStatus.ACTIVE,
        createdBy: uid('user:staff-1'),
      },
    ],
    'scheduled_reports',
  );

  // -------------------------------------------------------------- export_history
  await seedRows(
    manager,
    ExportHistory,
    [
      {
        id: uid('export:1'),
        exportCode: 'EXP-2026-0001',
        reportType: 'CUSTOM',
        format: ExportFormat.CSV,
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        filters: { status: 'ALL' },
        fileUrl: '/exports/users-2026-06.csv',
        rowCount: 120,
        status: ExportStatus.COMPLETED,
        requestedBy: uid('user:staff-1'),
        completedAt: daysFromNow(-3),
      },
      {
        id: uid('export:2'),
        exportCode: 'EXP-2026-0002',
        reportType: 'CUSTOM',
        format: ExportFormat.PDF,
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        filters: { type: 'ORDERS' },
        status: ExportStatus.QUEUED,
        requestedBy: uid('user:staff-1'),
      },
    ],
    'export_history',
  );

  // ------------------------------------------------------------------ forecasts
  await seedRows(
    manager,
    Forecast,
    [
      {
        id: uid('forecast:1'),
        forecastCode: 'FC-2026-0001',
        metric: 'sales',
        period: '2026-08',
        forecastValue: 140000,
        actualValue: null,
        confidence: 85,
        model: 'moving-average',
        status: ForecastStatus.ACTIVE,
        generatedAt: daysFromNow(-1),
      },
      {
        id: uid('forecast:2'),
        forecastCode: 'FC-2026-0002',
        metric: 'orders',
        period: '2026-08',
        forecastValue: 55,
        actualValue: null,
        confidence: 82,
        model: 'linear-trend',
        status: ForecastStatus.ACTIVE,
        generatedAt: daysFromNow(-1),
      },
    ],
    'forecasts',
  );

  // ---------------------------------------------------------------- audit_reports
  await seedRows(
    manager,
    AuditReport,
    [
      {
        id: uid('auditreport:1'),
        reportCode: 'AR-2026-0001',
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        totalAuditLogs: 25,
        totalActivityLogs: 40,
        summary: { actions: { CREATE: 10, UPDATE: 12, DELETE: 3 } },
        status: AuditReportStatus.GENERATED,
        generatedBy: uid('user:staff-1'),
        generatedAt: daysFromNow(-2),
      },
    ],
    'audit_reports',
  );

  // ------------------------------------------------------------ business_insights
  await seedRows(
    manager,
    BusinessInsight,
    [
      {
        id: uid('insight:1'),
        insightCode: 'BI-2026-0001',
        category: 'sales',
        title: 'Sales trending up',
        description: 'Monthly sales grew 12% month-over-month.',
        severity: InsightSeverity.POSITIVE,
        metric: 'sales',
        value: 12,
        context: { comparison: 'last month' },
        generatedAt: daysFromNow(-1),
      },
      {
        id: uid('insight:2'),
        insightCode: 'BI-2026-0002',
        category: 'inventory',
        title: 'Low stock alert',
        description: 'Product PRD-0002 is below reorder level.',
        severity: InsightSeverity.WARNING,
        metric: 'lowStockCount',
        value: 2,
        context: { product: 'PRD-0002' },
        generatedAt: daysFromNow(-1),
      },
    ],
    'business_insights',
  );

  void ctx;
}
