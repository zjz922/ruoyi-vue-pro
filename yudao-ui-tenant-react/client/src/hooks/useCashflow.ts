/**
 * 资金流水数据Hook
 * 通过tRPC调用后端API进行资金流水CRUD操作
 * @author Manus AI
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";

/**
 * 资金流水筛选参数
 */
interface CashflowFilters {
  shopId?: string;
  startDate?: string;
  endDate?: string;
  channel?: string;
  type?: string;
  status?: string;
  keyword?: string;
}

/**
 * 资金流水创建参数
 */
interface CashflowCreateInput {
  shopId: string;
  transactionDate: string;
  transactionTime: string;
  channel: string;
  type: string;
  income?: number;
  expense?: number;
  orderNo?: string;
  remark?: string;
  tags?: string[];
}

/**
 * 资金流水更新参数
 */
interface CashflowUpdateInput {
  id: string;
  transactionDate?: string;
  transactionTime?: string;
  channel?: string;
  type?: string;
  income?: number;
  expense?: number;
  remark?: string;
  tags?: string[];
}

/**
 * 资金流水数据Hook
 * @param initialFilters 初始筛选条件
 */
export function useCashflow(initialFilters?: CashflowFilters) {
  const [filters, setFilters] = useState<CashflowFilters>(initialFilters || {});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const utils = trpc.useUtils();

  // 获取流水列表
  const listQuery = trpc.cashflow.list.useQuery(
    {
      ...filters,
      page,
      pageSize,
    },
    {
      staleTime: 2 * 60 * 1000, // 2分钟缓存
    }
  );

  // 获取流水统计
  const statsQuery = trpc.cashflow.getStats.useQuery(
    {
      shopId: filters.shopId,
      startDate: filters.startDate || getDefaultStartDate(),
      endDate: filters.endDate || getDefaultEndDate(),
    },
    {
      staleTime: 2 * 60 * 1000,
    }
  );

  // 创建流水
  const createMutation = trpc.cashflow.create.useMutation({
    onSuccess: () => {
      toast.success("流水创建成功");
      utils.cashflow.list.invalidate();
      utils.cashflow.getStats.invalidate();
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });

  // 更新流水
  const updateMutation = trpc.cashflow.update.useMutation({
    onSuccess: () => {
      toast.success("流水更新成功");
      utils.cashflow.list.invalidate();
      utils.cashflow.getStats.invalidate();
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });

  // 删除流水
  const deleteMutation = trpc.cashflow.delete.useMutation({
    onSuccess: () => {
      toast.success("流水删除成功");
      utils.cashflow.list.invalidate();
      utils.cashflow.getStats.invalidate();
    },
    onError: (error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });

  // 确认流水
  const confirmMutation = trpc.cashflow.confirm.useMutation({
    onSuccess: () => {
      toast.success("流水已确认");
      utils.cashflow.list.invalidate();
      utils.cashflow.getStats.invalidate();
    },
    onError: (error) => {
      toast.error(`确认失败: ${error.message}`);
    },
  });

  // 批量确认流水
  const batchConfirmMutation = trpc.cashflow.batchConfirm.useMutation({
    onSuccess: (data) => {
      toast.success(`已确认 ${data.confirmed} 条流水`);
      utils.cashflow.list.invalidate();
      utils.cashflow.getStats.invalidate();
    },
    onError: (error) => {
      toast.error(`批量确认失败: ${error.message}`);
    },
  });

  // 更新筛选条件
  const updateFilters = useCallback((newFilters: Partial<CashflowFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // 重置页码
  }, []);

  // 重置筛选条件
  const resetFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  // 创建流水
  const create = useCallback(
    async (input: CashflowCreateInput) => {
      return createMutation.mutateAsync(input);
    },
    [createMutation]
  );

  // 更新流水
  const update = useCallback(
    async (input: CashflowUpdateInput) => {
      return updateMutation.mutateAsync(input);
    },
    [updateMutation]
  );

  // 删除流水
  const remove = useCallback(
    async (id: string) => {
      return deleteMutation.mutateAsync({ id });
    },
    [deleteMutation]
  );

  // 确认流水
  const confirm = useCallback(
    async (id: string) => {
      return confirmMutation.mutateAsync({ id });
    },
    [confirmMutation]
  );

  // 批量确认流水
  const batchConfirm = useCallback(
    async (ids: string[]) => {
      return batchConfirmMutation.mutateAsync({ ids });
    },
    [batchConfirmMutation]
  );

  // 刷新数据
  const refetch = useCallback(() => {
    listQuery.refetch();
    statsQuery.refetch();
  }, [listQuery, statsQuery]);

  // 计算分页信息
  const pagination = useMemo(() => {
    const data = listQuery.data;
    if (!data) {
      return {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    return {
      page: data.page,
      pageSize: data.pageSize,
      total: data.total,
      totalPages: data.totalPages,
      hasNextPage: data.page < data.totalPages,
      hasPrevPage: data.page > 1,
    };
  }, [listQuery.data]);

  return {
    // 数据
    items: listQuery.data?.items || [],
    stats: statsQuery.data,
    pagination,

    // 筛选
    filters,
    updateFilters,
    resetFilters,

    // 分页
    page,
    pageSize,
    setPage,
    setPageSize,

    // 操作
    create,
    update,
    remove,
    confirm,
    batchConfirm,
    refetch,

    // 加载状态
    isLoading: listQuery.isLoading || statsQuery.isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isConfirming: confirmMutation.isPending || batchConfirmMutation.isPending,

    // 错误状态
    error: listQuery.error || statsQuery.error,
  };
}

/**
 * 获取默认开始日期（30天前）
 */
function getDefaultStartDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split("T")[0];
}

/**
 * 获取默认结束日期（今天）
 */
function getDefaultEndDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * 渠道选项
 */
export const CHANNEL_OPTIONS = [
  { value: "doudian", label: "抖店支付" },
  { value: "alipay", label: "支付宝" },
  { value: "wechat", label: "微信支付" },
  { value: "bank", label: "银行转账" },
  { value: "qianchuan", label: "千川账户" },
  { value: "other", label: "其他" },
];

/**
 * 流水类型选项
 */
export const TYPE_OPTIONS = [
  { value: "order_income", label: "订单收入" },
  { value: "refund_out", label: "退款支出" },
  { value: "platform_fee", label: "平台扣款" },
  { value: "promotion_fee", label: "推广费用" },
  { value: "withdrawal", label: "提现" },
  { value: "deposit", label: "充值" },
  { value: "transfer_in", label: "转入" },
  { value: "transfer_out", label: "转出" },
  { value: "settlement", label: "平台结算" },
  { value: "other", label: "其他" },
];

/**
 * 状态选项
 */
export const STATUS_OPTIONS = [
  { value: "pending", label: "待确认" },
  { value: "confirmed", label: "已确认" },
  { value: "cancelled", label: "已取消" },
];

/**
 * 格式化金额
 */
export function formatAmount(value: number): string {
  if (Math.abs(value) >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`;
  }
  return `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}`;
}
