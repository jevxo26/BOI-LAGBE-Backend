export { Dashboard, DashboardStatus } from './dashboard.entity';
export {
  DashboardWidget,
  DashboardWidgetStatus,
} from './dashboard-widget.entity';
export { KPI, KpiStatus } from './kpi.entity';
export { SalesAnalytics } from './sales-analytics.entity';
export { RevenueAnalytics } from './revenue-analytics.entity';
export { CustomerAnalytics } from './customer-analytics.entity';
export { AgentAnalytics } from './agent-analytics.entity';
// Alias to avoid clashing with the riders module's RiderAnalytics entity.
export { RiderAnalytics as ReportsRiderAnalytics } from './rider-analytics.entity';
export { InventoryAnalytics } from './inventory-analytics.entity';
export { ProductAnalytics } from './product-analytics.entity';
// Alias to avoid clashing with the used-books module's UsedBookAnalytics.
export { UsedBookAnalytics as ReportsUsedBookAnalytics } from './used-book-analytics.entity';
export { DigitalContentAnalytics } from './digital-content-analytics.entity';
export { CustomOrderAnalytics } from './custom-order-analytics.entity';
export { PaymentAnalytics } from './payment-analytics.entity';
export { AreaAnalytics } from './area-analytics.entity';
export { VendorAnalytics } from './vendor-analytics.entity';
export { MarketingAnalytics } from './marketing-analytics.entity';
export { NotificationAnalytics } from './notification-analytics.entity';
export { SearchAnalytics } from './search-analytics.entity';
// Alias to avoid clashing with the order lifecycle OrderAnalytics entity
// in src/admin/orders (the orders module exports an OrderAnalytics too).
export { OrderAnalytics as ReportsOrderAnalytics } from './order-analytics.entity';
export { DeliveryAnalytics } from './delivery-analytics.entity';
export { FinancialAnalytics } from './financial-analytics.entity';
export { UserActivityAnalytics } from './user-activity-analytics.entity';
export { ReportTemplate, ReportTemplateStatus } from './report-template.entity';
export {
  GeneratedReport,
  GeneratedReportStatus,
} from './generated-report.entity';
export {
  ScheduledReport,
  ScheduledReportStatus,
} from './scheduled-report.entity';
export {
  ExportHistory,
  ExportFormat,
  ExportStatus,
} from './export-history.entity';
export { Forecast, ForecastStatus } from './forecast.entity';
export { AuditReport, AuditReportStatus } from './audit-report.entity';
export { BusinessInsight, InsightSeverity } from './business-insight.entity';
