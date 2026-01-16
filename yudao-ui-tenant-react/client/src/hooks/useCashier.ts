/**
 * 出纳管理模块数据获取Hook
 * 提供出纳工作台、渠道管理、平台对账、差异分析、资金日报、资金月报、店铺统计的数据获取和操作
 * 
 * 架构原则：
 * 1. 所有数据通过tRPC调用Node.js中间层
 * 2. Node.js中间层调用Java后端API获取数据
 * 3. 前端不直接操作数据库
 * 
 * @author Manus AI
 */
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ==================== 出纳工作台 ====================

/**
 * 获取工作台概览数据
 */
export function useDashboardOverview(shopId: number, date?: string) {
  return trpc.cashier.dashboardOverview.useQuery(
    { shopId, date },
    { enabled: shopId > 0 }
  );
}

/**
 * 获取资金流动趋势
 */
export function useDashboardTrend(shopId: number, days: number = 7) {
  return trpc.cashier.dashboardTrend.useQuery(
    { shopId, days },
    { enabled: shopId > 0 }
  );
}

/**
 * 获取待办任务列表
 */
export function useDashboardTasks(shopId: number) {
  return trpc.cashier.dashboardTasks.useQuery(
    { shopId },
    { enabled: shopId > 0 }
  );
}

/**
 * 刷新工作台数据
 */
export function useDashboardRefresh() {
  const utils = trpc.useUtils();
  return trpc.cashier.dashboardRefresh.useMutation({
    onSuccess: () => {
      toast.success("数据刷新成功");
      utils.cashier.dashboardOverview.invalidate();
      utils.cashier.dashboardTrend.invalidate();
      utils.cashier.dashboardTasks.invalidate();
    },
    onError: (error) => {
      toast.error(`刷新失败: ${error.message}`);
    },
  });
}

// ==================== 资金流水 ====================

/**
 * 获取资金流水列表
 */
export function useCashflowList(options: {
  shopId: string;
  type?: "all" | "income" | "expense";
  channel?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  return trpc.cashier.cashflowList.useQuery(options, {
    enabled: !!options.shopId,
  });
}

/**
 * 获取资金流水详情
 */
export function useCashflowDetail(id: number) {
  return trpc.cashier.cashflowDetail.useQuery(
    { id },
    { enabled: id > 0 }
  );
}

/**
 * 导出资金流水
 */
export function useCashflowExport() {
  return trpc.cashier.cashflowExport.useMutation({
    onSuccess: () => {
      toast.success("导出任务已提交");
    },
    onError: (error) => {
      toast.error(`导出失败: ${error.message}`);
    },
  });
}

// ==================== 渠道管理 ====================

/**
 * 获取支付渠道列表
 */
export function useChannelList(shopId: string | number, type?: string, status?: string) {
  return trpc.cashier.channelList.useQuery(
    { shopId, type, status },
    { enabled: !!shopId }
  );
}

/**
 * 获取渠道详情
 */
export function useChannelDetail(channelId: number) {
  return trpc.cashier.channelDetail.useQuery(
    { channelId },
    { enabled: channelId > 0 }
  );
}

/**
 * 新增渠道
 */
export function useChannelAdd() {
  const utils = trpc.useUtils();
  return trpc.cashier.channelAdd.useMutation({
    onSuccess: () => {
      toast.success("渠道添加成功");
      utils.cashier.channelList.invalidate();
    },
    onError: (error) => {
      toast.error(`添加失败: ${error.message}`);
    },
  });
}

/**
 * 同步渠道余额
 */
export function useChannelSyncBalance() {
  const utils = trpc.useUtils();
  return trpc.cashier.channelSyncBalance.useMutation({
    onSuccess: () => {
      toast.success("余额同步成功");
      utils.cashier.channelList.invalidate();
    },
    onError: (error) => {
      toast.error(`同步失败: ${error.message}`);
    },
  });
}

/**
 * 编辑渠道
 */
export function useChannelEdit() {
  const utils = trpc.useUtils();
  return trpc.cashier.channelEdit.useMutation({
    onSuccess: () => {
      toast.success("渠道更新成功");
      utils.cashier.channelList.invalidate();
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });
}

/**
 * 更新渠道配置
 */
export function useChannelUpdate() {
  const utils = trpc.useUtils();
  return trpc.cashier.channelUpdate.useMutation({
    onSuccess: () => {
      toast.success("渠道配置更新成功");
      utils.cashier.channelList.invalidate();
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });
}

/**
 * 启用/禁用渠道
 */
export function useChannelUpdateStatus() {
  const utils = trpc.useUtils();
  return trpc.cashier.channelUpdateStatus.useMutation({
    onSuccess: () => {
      toast.success("状态更新成功");
      utils.cashier.channelList.invalidate();
    },
    onError: (error) => {
      toast.error(`状态更新失败: ${error.message}`);
    },
  });
}

// ==================== 平台对账 ====================

/**
 * 获取对账任务列表
 */
export function useReconciliationList(options: {
  shopId: string | number;
  status?: string;
  platform?: string;
  startDate?: string;
  endDate?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  return trpc.cashier.reconciliationList.useQuery(options, {
    enabled: !!options.shopId,
  });
}

/**
 * 获取对账详情
 */
export function useReconciliationDetail(taskId: number) {
  return trpc.cashier.reconciliationDetail.useQuery(
    { taskId },
    { enabled: taskId > 0 }
  );
}

/**
 * 发起对账
 */
export function useReconciliationStart() {
  const utils = trpc.useUtils();
  return trpc.cashier.reconciliationStart.useMutation({
    onSuccess: () => {
      toast.success("对账任务已启动");
      utils.cashier.reconciliationList.invalidate();
    },
    onError: (error) => {
      toast.error(`对账失败: ${error.message}`);
    },
  });
}

/**
 * 创建对账任务
 */
export function useReconciliationCreate() {
  const utils = trpc.useUtils();
  return trpc.cashier.reconciliationCreate.useMutation({
    onSuccess: () => {
      toast.success("对账任务创建成功");
      utils.cashier.reconciliationList.invalidate();
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });
}

/**
 * 执行对账
 */
export function useReconciliationExecute() {
  const utils = trpc.useUtils();
  return trpc.cashier.reconciliationExecute.useMutation({
    onSuccess: () => {
      toast.success("对账执行成功");
      utils.cashier.reconciliationList.invalidate();
    },
    onError: (error) => {
      toast.error(`执行失败: ${error.message}`);
    },
  });
}

/**
 * 导出对账单
 */
export function useReconciliationExport() {
  return trpc.cashier.reconciliationExport.useMutation({
    onSuccess: () => {
      toast.success("导出任务已提交");
    },
    onError: (error) => {
      toast.error(`导出失败: ${error.message}`);
    },
  });
}

/**
 * 标记已核对
 */
export function useReconciliationMarkVerified() {
  const utils = trpc.useUtils();
  return trpc.cashier.reconciliationMarkVerified.useMutation({
    onSuccess: () => {
      toast.success("标记成功");
      utils.cashier.reconciliationList.invalidate();
    },
    onError: (error) => {
      toast.error(`标记失败: ${error.message}`);
    },
  });
}

/**
 * 查看差异详情
 */
export function useReconciliationDifferenceDetail(id: number) {
  return trpc.cashier.reconciliationDifferenceDetail.useQuery(
    { id },
    { enabled: id > 0 }
  );
}

// ==================== 差异分析 ====================

/**
 * 获取差异列表
 */
export function useDifferenceList(options: {
  shopId: string | number;
  status?: string;
  platform?: string;
  reason?: string;
  type?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  return trpc.cashier.differenceList.useQuery(options, {
    enabled: !!options.shopId,
  });
}

/**
 * 获取差异详情
 */
export function useDifferenceDetail(diffId: number) {
  return trpc.cashier.differenceDetail.useQuery(
    { diffId },
    { enabled: diffId > 0 }
  );
}

/**
 * 处理差异
 */
export function useDifferenceHandle() {
  const utils = trpc.useUtils();
  return trpc.cashier.differenceHandle.useMutation({
    onSuccess: () => {
      toast.success("差异处理成功");
      utils.cashier.differenceList.invalidate();
    },
    onError: (error) => {
      toast.error(`处理失败: ${error.message}`);
    },
  });
}

/**
 * 批量处理差异
 */
export function useDifferenceBatchHandle() {
  const utils = trpc.useUtils();
  return trpc.cashier.differenceBatchHandle.useMutation({
    onSuccess: () => {
      toast.success("批量处理成功");
      utils.cashier.differenceList.invalidate();
    },
    onError: (error) => {
      toast.error(`批量处理失败: ${error.message}`);
    },
  });
}

// ==================== 资金日报 ====================

/**
 * 获取资金日报列表
 */
export function useDailyReportList(options: {
  shopId: string | number;
  startDate?: string;
  endDate?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  return trpc.cashier.dailyReportList.useQuery(options, {
    enabled: !!options.shopId,
  });
}

/**
 * 获取单日资金报表
 */
export function useDailyReportDetail(shopId: string | number, date: string) {
  return trpc.cashier.dailyReportDetail.useQuery(
    { shopId, date },
    { enabled: !!shopId && !!date }
  );
}

/**
 * 生成日报
 */
export function useDailyReportGenerate() {
  const utils = trpc.useUtils();
  return trpc.cashier.dailyReportGenerate.useMutation({
    onSuccess: () => {
      toast.success("日报生成成功");
      utils.cashier.dailyReportList.invalidate();
    },
    onError: (error) => {
      toast.error(`生成失败: ${error.message}`);
    },
  });
}

/**
 * 导出资金日报
 */
export function useDailyReportExport() {
  return trpc.cashier.dailyReportExport.useMutation({
    onSuccess: () => {
      toast.success("导出任务已提交");
    },
    onError: (error) => {
      toast.error(`导出失败: ${error.message}`);
    },
  });
}

// ==================== 资金月报 ====================

/**
 * 获取资金月报列表
 */
export function useMonthlyReportList(options: {
  shopId: string | number;
  year?: number;
  pageNum?: number;
  pageSize?: number;
}) {
  return trpc.cashier.monthlyReportList.useQuery(options, {
    enabled: !!options.shopId,
  });
}

/**
 * 获取单月资金报表
 */
export function useMonthlyReportDetail(shopId: string | number, month: string) {
  return trpc.cashier.monthlyReportDetail.useQuery(
    { shopId, month },
    { enabled: !!shopId && !!month }
  );
}

/**
 * 生成月报
 */
export function useMonthlyReportGenerate() {
  const utils = trpc.useUtils();
  return trpc.cashier.monthlyReportGenerate.useMutation({
    onSuccess: () => {
      toast.success("月报生成成功");
      utils.cashier.monthlyReportList.invalidate();
    },
    onError: (error) => {
      toast.error(`生成失败: ${error.message}`);
    },
  });
}

/**
 * 导出资金月报
 */
export function useMonthlyReportExport() {
  return trpc.cashier.monthlyReportExport.useMutation({
    onSuccess: () => {
      toast.success("导出任务已提交");
    },
    onError: (error) => {
      toast.error(`导出失败: ${error.message}`);
    },
  });
}

// ==================== 店铺统计 ====================

/**
 * 获取店铺资金统计
 */
export function useShopReportList(options: {
  shopId: string | number;
  startDate?: string;
  endDate?: string;
}) {
  return trpc.cashier.shopReportList.useQuery(options, {
    enabled: !!options.shopId,
  });
}

/**
 * 获取店铺资金对比
 */
export function useShopReportCompare(options: {
  shopIds: string[];
  startDate: string;
  endDate: string;
}) {
  return trpc.cashier.shopReportCompare.useQuery(options, {
    enabled: options.shopIds.length > 0 && !!options.startDate && !!options.endDate,
  });
}

// ==================== 待处理预警 ====================

/**
 * 获取预警列表
 */
export function useAlertList(options: {
  shopId: string | number;
  status?: string;
  level?: string;
  type?: string;
  pageNum?: number;
  pageSize?: number;
}) {
  return trpc.cashier.alertList.useQuery(options, {
    enabled: !!options.shopId,
  });
}

/**
 * 获取预警详情
 */
export function useAlertDetail(alertId: number) {
  return trpc.cashier.alertDetail.useQuery(
    { alertId },
    { enabled: alertId > 0 }
  );
}

/**
 * 处理预警
 */
export function useAlertHandle() {
  const utils = trpc.useUtils();
  return trpc.cashier.alertHandle.useMutation({
    onSuccess: () => {
      toast.success("预警处理成功");
      utils.cashier.alertList.invalidate();
    },
    onError: (error) => {
      toast.error(`处理失败: ${error.message}`);
    },
  });
}

/**
 * 批量处理预警
 */
export function useAlertBatchHandle() {
  const utils = trpc.useUtils();
  return trpc.cashier.alertBatchHandle.useMutation({
    onSuccess: () => {
      toast.success("批量处理成功");
      utils.cashier.alertList.invalidate();
    },
    onError: (error) => {
      toast.error(`批量处理失败: ${error.message}`);
    },
  });
}

// ==================== 预警规则 ====================

/**
 * 获取预警规则列表
 */
export function useAlertRuleList(shopId: string | number) {
  return trpc.cashier.alertRuleList.useQuery(
    { shopId },
    { enabled: !!shopId }
  );
}

/**
 * 获取预警规则详情
 */
export function useAlertRuleDetail(ruleId: number) {
  return trpc.cashier.alertRuleDetail.useQuery(
    { ruleId },
    { enabled: ruleId > 0 }
  );
}

/**
 * 创建预警规则
 */
export function useAlertRuleCreate() {
  const utils = trpc.useUtils();
  return trpc.cashier.alertRuleCreate.useMutation({
    onSuccess: () => {
      toast.success("规则创建成功");
      utils.cashier.alertRuleList.invalidate();
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });
}

/**
 * 更新预警规则
 */
export function useAlertRuleUpdate() {
  const utils = trpc.useUtils();
  return trpc.cashier.alertRuleUpdate.useMutation({
    onSuccess: () => {
      toast.success("规则更新成功");
      utils.cashier.alertRuleList.invalidate();
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });
}

/**
 * 删除预警规则
 */
export function useAlertRuleDelete() {
  const utils = trpc.useUtils();
  return trpc.cashier.alertRuleDelete.useMutation({
    onSuccess: () => {
      toast.success("规则删除成功");
      utils.cashier.alertRuleList.invalidate();
    },
    onError: (error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });
}
