/**
 * 总账管理模块数据获取Hook
 * 包含：经营概览、财务核算、资金管理、库存成本、经营分析、费用中心、税务管理
 * 
 * 架构原则：
 * 1. 所有数据通过tRPC调用Node.js中间层
 * 2. Node.js中间层调用Java后端API获取数据
 * 3. 前端不直接操作数据库
 */

import { trpc } from "@/lib/trpc";
import { useShopSwitcher } from "@/components/ShopSwitcher";

// ============ 经营概览 Hook ============

/**
 * 获取经营概览数据
 */
export function useDashboardOverview(options?: {
  startDate?: string;
  endDate?: string;
}) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.dashboardOverview.useQuery(
    {
      shopId,
      dateRange: options?.startDate && options?.endDate 
        ? { start: options.startDate, end: options.endDate }
        : undefined,
    },
    {
      enabled: !!currentShopId,
      refetchInterval: 60000, // 每分钟刷新
    }
  );
}

/**
 * 获取KPI数据
 */
export function useDashboardKpi(options?: {
  startDate?: string;
  endDate?: string;
}) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.dashboardKpi.useQuery(
    {
      shopId,
      dateRange: options?.startDate && options?.endDate 
        ? { start: options.startDate, end: options.endDate }
        : undefined,
    },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 获取趋势数据
 */
export function useDashboardTrends(days?: number) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.dashboardTrends.useQuery(
    { shopId, days },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 获取费用分布
 */
export function useDashboardExpenseBreakdown(month?: string) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.dashboardExpenseBreakdown.useQuery(
    { shopId, month },
    {
      enabled: !!currentShopId,
    }
  );
}

// ============ 财务核算 Hook ============

/**
 * 获取财务报表数据
 */
export function useAccountingReport(options?: {
  reportType?: "income" | "balance" | "cashflow";
  month?: string;
}) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.accountingReport.useQuery(
    {
      shopId,
      reportType: options?.reportType,
      month: options?.month,
    },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 获取利润表
 */
export function useAccountingIncomeStatement(month?: string) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.accountingIncomeStatement.useQuery(
    { shopId, month },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 导出财务报表
 */
export function useAccountingExport() {
  return trpc.ledger.accountingExport.useMutation();
}

// ============ 资金管理 Hook ============

/**
 * 获取资金总览
 */
export function useFundsOverview() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.fundsOverview.useQuery(
    { shopId },
    {
      enabled: !!currentShopId,
      refetchInterval: 30000, // 每30秒刷新
    }
  );
}

/**
 * 获取账户列表
 */
export function useFundsAccounts() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.fundsAccounts.useQuery(
    { shopId },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 账户间转账
 */
export function useFundsTransfer() {
  const utils = trpc.useUtils();
  
  return trpc.ledger.fundsTransfer.useMutation({
    onSuccess: () => {
      utils.ledger.fundsOverview.invalidate();
      utils.ledger.fundsAccounts.invalidate();
    },
  });
}

/**
 * 提现申请
 */
export function useFundsWithdraw() {
  const utils = trpc.useUtils();
  
  return trpc.ledger.fundsWithdraw.useMutation({
    onSuccess: () => {
      utils.ledger.fundsOverview.invalidate();
      utils.ledger.fundsAccounts.invalidate();
    },
  });
}

/**
 * 获取资金流水
 */
export function useFundsTransactions(options?: {
  accountId?: number;
  type?: "income" | "expense" | "transfer";
  startDate?: string;
  endDate?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.fundsTransactions.useQuery(
    {
      shopId,
      accountId: options?.accountId,
      type: options?.type,
      startDate: options?.startDate,
      endDate: options?.endDate,
      pageNum: options?.pageNum,
      pageSize: options?.pageSize,
    },
    {
      enabled: !!currentShopId,
    }
  );
}

// ============ 库存成本 Hook ============

/**
 * 获取库存成本概览
 */
export function useInventoryOverview() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.inventoryOverview.useQuery(
    { shopId },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 获取SKU成本追踪
 */
export function useInventorySkuCost(options?: {
  keyword?: string;
  costTrend?: "up" | "down" | "stable";
  pageNum?: number;
  pageSize?: number;
}) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.inventorySkuCost.useQuery(
    {
      shopId,
      keyword: options?.keyword,
      costTrend: options?.costTrend,
      pageNum: options?.pageNum,
      pageSize: options?.pageSize,
    },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 设置成本计价方式
 */
export function useInventoryCostingConfig() {
  const utils = trpc.useUtils();
  
  return trpc.ledger.inventoryCostingConfig.useMutation({
    onSuccess: () => {
      utils.ledger.inventoryOverview.invalidate();
    },
  });
}

/**
 * 同步库存数据
 */
export function useInventorySync() {
  const utils = trpc.useUtils();
  
  return trpc.ledger.inventorySync.useMutation({
    onSuccess: () => {
      utils.ledger.inventoryOverview.invalidate();
      utils.ledger.inventorySkuCost.invalidate();
    },
  });
}

/**
 * 获取周转优化建议
 */
export function useInventoryOptimization() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.inventoryOptimization.useQuery(
    { shopId },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 导出库存报表
 */
export function useInventoryExport() {
  return trpc.ledger.inventoryExport.useMutation();
}

// ============ 经营分析 Hook ============

/**
 * 获取ROI分析数据
 */
export function useAnalysisRoi(options?: {
  dateRange?: string;
  startDate?: string;
  endDate?: string;
}) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.analysisRoi.useQuery(
    {
      shopId,
      dateRange: options?.dateRange,
      startDate: options?.startDate,
      endDate: options?.endDate,
    },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 获取盈亏平衡分析
 */
export function useAnalysisBreakEven(month?: string) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.analysisBreakEven.useQuery(
    { shopId, month },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 获取利润贡献分析
 */
export function useAnalysisProfitContribution(dimension?: "product" | "channel" | "category") {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.analysisProfitContribution.useQuery(
    { shopId, dimension },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 导出经营分析报告
 */
export function useAnalysisExport() {
  return trpc.ledger.analysisExport.useMutation();
}

// ============ 费用中心 Hook ============

/**
 * 获取费用概览
 */
export function useExpenseOverview(month?: string) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.expenseOverview.useQuery(
    { shopId, month },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 获取多维度费用分摊
 */
export function useExpenseAllocation(options: {
  dimension: "shop" | "category" | "channel";
  month?: string;
}) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.expenseAllocation.useQuery(
    {
      shopId,
      dimension: options.dimension,
      month: options.month,
    },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 设置费用预算
 */
export function useExpenseBudget() {
  const utils = trpc.useUtils();
  
  return trpc.ledger.expenseBudget.useMutation({
    onSuccess: () => {
      utils.ledger.expenseOverview.invalidate();
    },
  });
}

/**
 * 录入费用
 */
export function useExpenseCreate() {
  const utils = trpc.useUtils();
  
  return trpc.ledger.expenseCreate.useMutation({
    onSuccess: () => {
      utils.ledger.expenseOverview.invalidate();
      utils.ledger.expenseDetails.invalidate();
    },
  });
}

/**
 * 获取异常费用列表
 */
export function useExpenseAnomalies(status?: "pending" | "confirmed" | "ignored") {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.expenseAnomalies.useQuery(
    { shopId, status },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 确认异常费用
 */
export function useExpenseConfirmAnomaly() {
  const utils = trpc.useUtils();
  
  return trpc.ledger.expenseConfirmAnomaly.useMutation({
    onSuccess: () => {
      utils.ledger.expenseAnomalies.invalidate();
    },
  });
}

/**
 * 审批费用
 */
export function useExpenseApprove() {
  const utils = trpc.useUtils();
  
  return trpc.ledger.expenseApprove.useMutation({
    onSuccess: () => {
      utils.ledger.expenseDetails.invalidate();
    },
  });
}

/**
 * 获取费用明细
 */
export function useExpenseDetails(options?: {
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.expenseDetails.useQuery(
    {
      shopId,
      category: options?.category,
      status: options?.status,
      startDate: options?.startDate,
      endDate: options?.endDate,
      pageNum: options?.pageNum,
      pageSize: options?.pageSize,
    },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 导出费用报表
 */
export function useExpenseExport() {
  return trpc.ledger.expenseExport.useMutation();
}

// ============ 税务管理 Hook ============

/**
 * 获取税务概览
 */
export function useTaxOverview(month?: string) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.taxOverview.useQuery(
    { shopId, month },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 获取风险预警列表
 */
export function useTaxRisks(status?: "pending" | "resolved" | "ignored") {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.taxRisks.useQuery(
    { shopId, status },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 获取申报日历
 */
export function useTaxDeclarations(year?: number) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.taxDeclarations.useQuery(
    { shopId, year },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 设置税务预警规则
 */
export function useTaxAlertConfig() {
  const utils = trpc.useUtils();
  
  return trpc.ledger.taxAlertConfig.useMutation({
    onSuccess: () => {
      utils.ledger.taxRisks.invalidate();
    },
  });
}

/**
 * 忽略风险预警
 */
export function useTaxIgnoreRisk() {
  const utils = trpc.useUtils();
  
  return trpc.ledger.taxIgnoreRisk.useMutation({
    onSuccess: () => {
      utils.ledger.taxRisks.invalidate();
    },
  });
}

/**
 * 获取发票统计
 */
export function useTaxInvoiceStats(month?: string) {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId || "";
  
  return trpc.ledger.taxInvoiceStats.useQuery(
    { shopId, month },
    {
      enabled: !!currentShopId,
    }
  );
}

/**
 * 生成税务报表
 */
export function useTaxReport() {
  return trpc.ledger.taxReport.useMutation();
}
