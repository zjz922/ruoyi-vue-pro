import AppLayout from "@/components/AppLayout";
import { useState, useCallback, useMemo } from "react";
import {
  Calculator,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  BarChart3,
  PieChart,
  Layers,
  BookOpen,
  Scale,
  Wallet,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  ExternalLink,
  Package,
  Gift,
  MoreHorizontal,
  Search,
  X,
  Settings,
  RotateCcw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  useAccountingReport, 
  useAccountingExport,
  useAccountingIncomeStatement,
} from "@/hooks/useLedger";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// ============ 类型定义 ============

interface DualTrackData {
  accrual: {
    revenue: number;
    cost: number;
    grossProfit: number;
    operatingExpense: number;
    netProfit: number;
  };
  cash: {
    revenue: number;
    cost: number;
    grossProfit: number;
    operatingExpense: number;
    netProfit: number;
  };
}

interface MonthlyComparisonItem {
  month: string;
  accrual: number;
  cash: number;
}

interface IncomeStatementItem {
  item: string;
  current: number;
  previous: number;
  change: number;
  indent?: boolean;
  highlight?: boolean;
  bold?: boolean;
}

interface BalanceSheetItem {
  item: string;
  value: number;
  children?: { item: string; value: number }[];
}

interface BalanceSheet {
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
}

interface CashFlowItem {
  item: string;
  value: number;
  type: "in" | "out";
}

interface CashFlowCategory {
  category: string;
  items: CashFlowItem[];
  subtotal: number;
}

interface DailyReportData {
  date: string;
  orderStats: {
    totalOrders: number;
    paidOrders: number;
    conversionRate: number;
    avgOrderValue: number;
  };
  financialStats: {
    revenue: number;
    cost: number;
    grossProfit: number;
    grossProfitRate: number;
    expenses: number;
    netProfit: number;
    netProfitRate: number;
  };
  fundFlow: {
    inflow: number;
    outflow: number;
    netFlow: number;
  };
}

interface DailyTrendItem {
  date: string;
  revenue: number;
  profit: number;
  orders: number;
}

interface RevenueTypeItem {
  type: string;
  revenue: number;
  cost: number;
  grossProfit: number;
  rate: number;
  color: string;
}

interface RevenueDetailItem {
  id: string;
  orderNo: string;
  type: string;
  amount: number;
  cost: number;
  profit: number;
  time: string;
}

interface RefundAnalysisData {
  summary: {
    totalAmount: number;
    totalCount: number;
    refundRate: number;
    avgRefundAmount: number;
  };
  byReason: { reason: string; amount: number; count: number; rate: number }[];
  byShop: { shop: string; amount: number; count: number; rate: number }[];
  trend: { date: string; amount: number; count: number }[];
}

interface RefundOrderItem {
  id: string;
  orderNo: string;
  shop: string;
  category: string;
  reason: string;
  amount: number;
  status: string;
  time: string;
}

// ============ Helper Functions ============
function formatCurrency(value: number): string {
  if (Math.abs(value) >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`;
  }
  return `¥${value.toLocaleString()}`;
}

function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

// ============ 空状态组件 ============
function EmptyState({ message, icon: Icon = AlertCircle }: { message: string; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Icon className="h-12 w-12 mb-4 opacity-50" />
      <p className="text-sm">{message}</p>
      <p className="text-xs mt-2">请确认Java后端服务已启动</p>
    </div>
  );
}

// ============ 加载状态组件 ============
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">正在加载数据...</p>
    </div>
  );
}

// ============ Components ============

// 双轨制对比卡片
function DualTrackCard({ 
  title, 
  accrualValue, 
  cashValue,
  icon: Icon,
}: { 
  title: string;
  accrualValue: number;
  cashValue: number;
  icon: React.ElementType;
}) {
  const diff = accrualValue - cashValue;
  const diffPercent = cashValue !== 0 ? ((diff / cashValue) * 100).toFixed(1) : "0.0";
  
  return (
    <div className="data-card">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <Badge variant="outline" className="text-xs">
          差异 {diff >= 0 ? "+" : ""}{diffPercent}%
        </Badge>
      </div>
      <h3 className="text-sm text-muted-foreground mb-3">{title}</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">权责发生制</span>
          <span className="text-lg font-semibold">{formatCurrency(accrualValue)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">收付实现制</span>
          <span className="text-base text-muted-foreground">{formatCurrency(cashValue)}</span>
        </div>
      </div>
    </div>
  );
}

// 日报统计卡片
function DailyStatCard({
  title,
  value,
  subValue,
  icon: Icon,
  trend,
  color = "default",
}: {
  title: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
  trend?: number;
  color?: "default" | "success" | "warning" | "danger" | "primary";
}) {
  const colorClasses = {
    default: "bg-muted/50",
    success: "bg-success/5 border-success/20",
    warning: "bg-warning/5 border-warning/20",
    danger: "bg-danger/5 border-danger/20",
    primary: "bg-primary/5 border-primary/20",
  };

  return (
    <div className={cn("p-4 rounded-lg border", colorClasses[color])}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {trend !== undefined && (
          <Badge variant="outline" className={cn("text-xs", trend >= 0 ? "text-success" : "text-danger")}>
            {trend >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {Math.abs(trend)}%
          </Badge>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
    </div>
  );
}

// ============ Main Component ============
export default function Accounting() {
  const { currentShopId } = useShopSwitcher();
  const [dateGranularity, setDateGranularity] = useState<"day" | "month">("month");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [customMetricsDialogOpen, setCustomMetricsDialogOpen] = useState(false);
  const [drillDownDialogOpen, setDrillDownDialogOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<{ title: string; data: unknown } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // 筛选条件
  const [filters, setFilters] = useState({
    shops: [] as string[],
    categories: [] as string[],
    includeRefund: true,
  });

  // 从Java后端API获取数据
  const { 
    data: reportData, 
    isLoading: isLoadingReport, 
    error: reportError,
    refetch: refetchReport,
  } = useAccountingReport({
    reportType: "income",
    month: selectedDate.substring(0, 7),
  });

  const {
    data: incomeStatementData,
    isLoading: isLoadingIncomeStatement,
  } = useAccountingIncomeStatement(selectedDate.substring(0, 7));

  const exportMutation = useAccountingExport();

  // 定义API响应类型
  type ReportDataType = {
    dualTrack?: DualTrackData;
    monthlyComparison?: MonthlyComparisonItem[];
    balanceSheet?: BalanceSheet;
    cashFlowStatement?: CashFlowCategory[];
    dailyReport?: DailyReportData;
    dailyTrend?: DailyTrendItem[];
    revenueByType?: RevenueTypeItem[];
    revenueDetails?: RevenueDetailItem[];
    refundAnalysis?: RefundAnalysisData;
    refundOrders?: RefundOrderItem[];
  };

  // 类型断言
  const typedReportData = reportData as ReportDataType | undefined;

  // 从API响应中提取数据
  const dualTrackData = useMemo<DualTrackData>(() => {
    if (typedReportData?.dualTrack) {
      return typedReportData.dualTrack;
    }
    return {
      accrual: { revenue: 0, cost: 0, grossProfit: 0, operatingExpense: 0, netProfit: 0 },
      cash: { revenue: 0, cost: 0, grossProfit: 0, operatingExpense: 0, netProfit: 0 },
    };
  }, [typedReportData]);

  const monthlyComparison = useMemo<MonthlyComparisonItem[]>(() => {
    if (typedReportData?.monthlyComparison) {
      return typedReportData.monthlyComparison;
    }
    return [];
  }, [typedReportData]);

  const incomeStatement = useMemo<IncomeStatementItem[]>(() => {
    if (incomeStatementData && Array.isArray(incomeStatementData)) {
      return incomeStatementData as IncomeStatementItem[];
    }
    return [];
  }, [incomeStatementData]);

  const balanceSheet = useMemo<BalanceSheet>(() => {
    if (typedReportData?.balanceSheet) {
      return typedReportData.balanceSheet;
    }
    return { assets: [], liabilities: [], equity: [] };
  }, [typedReportData]);

  const cashFlowStatement = useMemo<CashFlowCategory[]>(() => {
    if (typedReportData?.cashFlowStatement) {
      return typedReportData.cashFlowStatement;
    }
    return [];
  }, [typedReportData]);

  const dailyReportData = useMemo<DailyReportData | null>(() => {
    if (typedReportData?.dailyReport) {
      return typedReportData.dailyReport;
    }
    return null;
  }, [typedReportData]);

  const dailyTrendData = useMemo<DailyTrendItem[]>(() => {
    if (typedReportData?.dailyTrend) {
      return typedReportData.dailyTrend;
    }
    return [];
  }, [typedReportData]);

  const revenueByType = useMemo<RevenueTypeItem[]>(() => {
    if (typedReportData?.revenueByType) {
      return typedReportData.revenueByType;
    }
    return [];
  }, [typedReportData]);

  const revenueDetailList = useMemo<RevenueDetailItem[]>(() => {
    if (typedReportData?.revenueDetails) {
      return typedReportData.revenueDetails;
    }
    return [];
  }, [typedReportData]);

  const refundAnalysisData = useMemo<RefundAnalysisData | null>(() => {
    if (typedReportData?.refundAnalysis) {
      return typedReportData.refundAnalysis;
    }
    return null;
  }, [typedReportData]);

  const refundOrderList = useMemo<RefundOrderItem[]>(() => {
    if (typedReportData?.refundOrders) {
      return typedReportData.refundOrders;
    }
    return [];
  }, [typedReportData]);

  // 处理日期变更
  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  // 处理报表类型切换
  const handleDateGranularityChange = useCallback((granularity: "day" | "month") => {
    setDateGranularity(granularity);
  }, []);

  // 处理导出
  const handleExport = useCallback(() => {
    if (!currentShopId) {
      toast.error("请先选择店铺");
      return;
    }
    exportMutation.mutate(
      {
        shopId: currentShopId,
        reportType: "income",
        month: selectedDate.substring(0, 7),
        format: "excel",
      },
      {
        onSuccess: (result) => {
          if (result && typeof result === 'object' && 'success' in result) {
            if (result.success) {
              toast.success("报表导出成功");
            } else {
              toast.error((result as { message?: string }).message || "导出失败");
            }
          }
        },
        onError: () => {
          toast.error("导出服务暂不可用");
        },
      }
    );
  }, [currentShopId, selectedDate, exportMutation]);

  // 处理刷新
  const handleRefresh = useCallback(() => {
    refetchReport();
    toast.success("数据已刷新");
  }, [refetchReport]);

  // 处理数据下钻
  const handleDrillDown = useCallback((title: string, data: unknown) => {
    setDrillDownData({ title, data });
    setDrillDownDialogOpen(true);
  }, []);

  // 检查是否有数据
  const hasData = useMemo(() => {
    return dualTrackData.accrual.revenue > 0 || dualTrackData.cash.revenue > 0;
  }, [dualTrackData]);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">财务核算</h1>
          <p className="text-sm text-muted-foreground mt-1">
            双轨制核算体系 · 利润表/资产负债表/现金流量表
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* 报表类型切换 */}
          <div className="flex items-center bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => handleDateGranularityChange("month")}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                dateGranularity === "month" ? "bg-white shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              月报
            </button>
            <button
              onClick={() => handleDateGranularityChange("day")}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                dateGranularity === "day" ? "bg-white shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              日报
            </button>
          </div>
          
          {/* 日期选择 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {dateGranularity === "day" ? selectedDate : selectedDate.substring(0, 7)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">选择日期</h4>
                </div>
                <div className="grid gap-2">
                  <Input
                    type={dateGranularity === "day" ? "date" : "month"}
                    value={dateGranularity === "day" ? selectedDate : selectedDate.substring(0, 7)}
                    onChange={(e) => handleDateChange(dateGranularity === "day" ? e.target.value : e.target.value + "-01")}
                    className="h-8"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* 筛选按钮 */}
          <Button variant="outline" size="sm" onClick={() => setFilterDialogOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            筛选
          </Button>
          
          {/* 导出报表按钮 */}
          <Button size="sm" onClick={handleExport} disabled={exportMutation.isPending}>
            {exportMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            导出报表
          </Button>
        </div>
      </div>

      {/* 加载状态 */}
      {isLoadingReport && <LoadingState />}

      {/* 错误状态 */}
      {reportError && !isLoadingReport && (
        <EmptyState message="数据加载失败，请检查网络连接" icon={AlertCircle} />
      )}

      {/* 无数据状态 */}
      {!isLoadingReport && !reportError && !hasData && (
        <EmptyState message="暂无财务数据" icon={FileText} />
      )}

      {/* 有数据时显示内容 */}
      {!isLoadingReport && !reportError && hasData && (
        <>
          {/* FIN-001 利润经营日报表 */}
          {dateGranularity === "day" && dailyReportData && (
            <div className="space-y-6">
              {/* 日报核心指标 */}
              <div className="data-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">利润经营日报</h2>
                      <p className="text-xs text-muted-foreground">{dailyReportData.date} 经营数据汇总</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCustomMetricsDialogOpen(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      自定义指标
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoadingReport}>
                      <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingReport && "animate-spin")} />
                      刷新
                    </Button>
                  </div>
                </div>

                {/* 订单成交情况 */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    订单成交情况
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    <DailyStatCard
                      title="订单总数"
                      value={dailyReportData.orderStats.totalOrders.toLocaleString()}
                      subValue="今日新增订单"
                      icon={Package}
                      trend={5.2}
                    />
                    <DailyStatCard
                      title="付款订单数"
                      value={dailyReportData.orderStats.paidOrders.toLocaleString()}
                      subValue="已完成支付"
                      icon={CheckCircle2}
                      trend={4.8}
                      color="success"
                    />
                    <DailyStatCard
                      title="成交转化率"
                      value={`${dailyReportData.orderStats.conversionRate}%`}
                      subValue="付款/下单比例"
                      icon={TrendingUp}
                      trend={1.2}
                      color="primary"
                    />
                    <DailyStatCard
                      title="客单价"
                      value={`¥${dailyReportData.orderStats.avgOrderValue}`}
                      subValue="平均订单金额"
                      icon={CreditCard}
                      trend={2.5}
                      color="warning"
                    />
                  </div>
                </div>

                {/* 收入/成本/利润 */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    收入/成本/利润
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">营业收入</span>
                        <Badge variant="outline" className="text-success border-success/30">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          +6.8%
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-success">{formatCurrency(dailyReportData.financialStats.revenue)}</p>
                      <button 
                        className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                        onClick={() => handleDrillDown("营业收入", { type: "revenue", date: dailyReportData.date })}
                      >
                        <Eye className="h-3 w-3" />
                        查看明细订单
                      </button>
                    </div>
                    <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">营业成本</span>
                        <Badge variant="outline" className="text-warning border-warning/30">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          +5.2%
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-warning">{formatCurrency(dailyReportData.financialStats.cost)}</p>
                      <button 
                        className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                        onClick={() => handleDrillDown("营业成本", { type: "cost", date: dailyReportData.date })}
                      >
                        <Eye className="h-3 w-3" />
                        查看费用清单
                      </button>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">净利润</span>
                        <Badge variant="outline" className="text-primary border-primary/30">
                          毛利率 {dailyReportData.financialStats.grossProfitRate}%
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(dailyReportData.financialStats.netProfit)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">净利率 {dailyReportData.financialStats.netProfitRate}%</p>
                    </div>
                  </div>
                </div>

                {/* 资金往来 */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    资金往来
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">资金流入</span>
                      <p className="text-xl font-bold text-success mt-1">{formatCurrency(dailyReportData.fundFlow.inflow)}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">资金流出</span>
                      <p className="text-xl font-bold text-danger mt-1">{formatCurrency(dailyReportData.fundFlow.outflow)}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">净流入</span>
                      <p className="text-xl font-bold text-primary mt-1">{formatCurrency(dailyReportData.fundFlow.netFlow)}</p>
                    </div>
                  </div>
                </div>

                {/* 近7天趋势 */}
                {dailyTrendData.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-4">近7天经营趋势</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 250)" />
                          <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 250)" tickFormatter={(v) => `${(v/10000).toFixed(1)}万`} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 250)" />
                          <Tooltip 
                            formatter={(value: number, name: string) => [
                              name === "orders" ? value : formatCurrency(value),
                              name === "revenue" ? "营收" : name === "profit" ? "利润" : "订单数"
                            ]}
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid oklch(0.9 0.01 250)',
                              borderRadius: '8px',
                            }}
                          />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="revenue" name="营收" stroke="oklch(0.55 0.18 150)" strokeWidth={2} dot={false} />
                          <Line yAxisId="left" type="monotone" dataKey="profit" name="利润" stroke="oklch(0.55 0.18 250)" strokeWidth={2} dot={false} />
                          <Line yAxisId="right" type="monotone" dataKey="orders" name="订单数" stroke="oklch(0.55 0.18 50)" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 月报视图 */}
          {dateGranularity === "month" && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="overview" className="gap-2">
                  <Scale className="h-4 w-4" />
                  双轨制对比
                </TabsTrigger>
                <TabsTrigger value="income" className="gap-2">
                  <FileText className="h-4 w-4" />
                  利润表
                </TabsTrigger>
                <TabsTrigger value="revenue" className="gap-2">
                  <PieChart className="h-4 w-4" />
                  收入成本分类
                </TabsTrigger>
                <TabsTrigger value="refund" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  售后退款
                </TabsTrigger>
              </TabsList>

              {/* 双轨制对比 */}
              <TabsContent value="overview" className="space-y-6">
                {/* 核心指标对比 */}
                <div className="grid grid-cols-5 gap-4">
                  <DualTrackCard
                    title="营业收入"
                    accrualValue={dualTrackData.accrual.revenue}
                    cashValue={dualTrackData.cash.revenue}
                    icon={TrendingUp}
                  />
                  <DualTrackCard
                    title="营业成本"
                    accrualValue={dualTrackData.accrual.cost}
                    cashValue={dualTrackData.cash.cost}
                    icon={TrendingDown}
                  />
                  <DualTrackCard
                    title="毛利润"
                    accrualValue={dualTrackData.accrual.grossProfit}
                    cashValue={dualTrackData.cash.grossProfit}
                    icon={Calculator}
                  />
                  <DualTrackCard
                    title="营业费用"
                    accrualValue={dualTrackData.accrual.operatingExpense}
                    cashValue={dualTrackData.cash.operatingExpense}
                    icon={Wallet}
                  />
                  <DualTrackCard
                    title="净利润"
                    accrualValue={dualTrackData.accrual.netProfit}
                    cashValue={dualTrackData.cash.netProfit}
                    icon={Scale}
                  />
                </div>

                {/* 月度对比趋势 */}
                {monthlyComparison.length > 0 && (
                  <div className="data-card">
                    <h3 className="font-semibold mb-4">月度净利润对比趋势</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyComparison}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 250)" />
                          <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 250)" tickFormatter={(v) => `${(v/10000).toFixed(0)}万`} />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid oklch(0.9 0.01 250)',
                              borderRadius: '8px',
                            }}
                          />
                          <Legend />
                          <Bar dataKey="accrual" name="权责发生制" fill="oklch(0.55 0.18 250)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="cash" name="收付实现制" fill="oklch(0.55 0.18 150)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* 利润表 */}
              <TabsContent value="income" className="space-y-6">
                <div className="data-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">利润表</h3>
                    <Badge variant="outline">{selectedDate.substring(0, 7)}</Badge>
                  </div>
                  {incomeStatement.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left text-sm font-medium py-3 px-4">项目</th>
                            <th className="text-right text-sm font-medium py-3 px-4">本期金额</th>
                            <th className="text-right text-sm font-medium py-3 px-4">上期金额</th>
                            <th className="text-right text-sm font-medium py-3 px-4">同比变化</th>
                          </tr>
                        </thead>
                        <tbody>
                          {incomeStatement.map((item, index) => (
                            <tr 
                              key={index} 
                              className={cn(
                                "border-t border-border/50",
                                item.highlight && "bg-primary/5",
                                item.bold && "font-semibold"
                              )}
                            >
                              <td className={cn("py-3 px-4 text-sm", item.indent && "pl-8")}>
                                {item.item}
                              </td>
                              <td className="py-3 px-4 text-sm text-right">{formatCurrency(item.current)}</td>
                              <td className="py-3 px-4 text-sm text-right text-muted-foreground">{formatCurrency(item.previous)}</td>
                              <td className={cn(
                                "py-3 px-4 text-sm text-right",
                                item.change >= 0 ? "text-success" : "text-danger"
                              )}>
                                {formatPercent(item.change)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState message="暂无利润表数据" icon={FileText} />
                  )}
                </div>
              </TabsContent>

              {/* 收入成本分类 */}
              <TabsContent value="revenue" className="space-y-6">
                <div className="data-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">收入成本分类匹配</h3>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      导出
                    </Button>
                  </div>
                  {revenueByType.length > 0 ? (
                    <div className="grid grid-cols-2 gap-6">
                      {/* 收入构成饼图 */}
                      <div>
                        <h4 className="text-sm font-medium mb-4">收入构成</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={revenueByType}
                                dataKey="revenue"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                              >
                                {revenueByType.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      {/* 分类明细表 */}
                      <div>
                        <h4 className="text-sm font-medium mb-4">分类明细</h4>
                        <div className="space-y-3">
                          {revenueByType.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm">{item.type}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{formatCurrency(item.revenue)}</p>
                                <p className="text-xs text-muted-foreground">毛利率 {item.rate}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmptyState message="暂无收入成本分类数据" icon={PieChart} />
                  )}
                </div>

                {/* 收入明细列表 */}
                {revenueDetailList.length > 0 && (
                  <div className="data-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">收入明细</h3>
                      <div className="flex items-center gap-2">
                        <Input placeholder="搜索订单号..." className="h-8 w-48" />
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          导出
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left text-sm font-medium py-3 px-4">收入编号</th>
                            <th className="text-left text-sm font-medium py-3 px-4">关联订单</th>
                            <th className="text-left text-sm font-medium py-3 px-4">收入类型</th>
                            <th className="text-right text-sm font-medium py-3 px-4">收入金额</th>
                            <th className="text-right text-sm font-medium py-3 px-4">匹配成本</th>
                            <th className="text-right text-sm font-medium py-3 px-4">毛利</th>
                            <th className="text-left text-sm font-medium py-3 px-4">时间</th>
                            <th className="text-center text-sm font-medium py-3 px-4">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {revenueDetailList.map((item, index) => (
                            <tr key={index} className="border-t border-border/50 hover:bg-muted/30">
                              <td className="py-3 px-4 text-sm">{item.id}</td>
                              <td className="py-3 px-4 text-sm text-primary cursor-pointer hover:underline">{item.orderNo}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline">{item.type}</Badge>
                              </td>
                              <td className="py-3 px-4 text-sm text-right font-medium">{formatCurrency(item.amount)}</td>
                              <td className="py-3 px-4 text-sm text-right text-muted-foreground">{formatCurrency(item.cost)}</td>
                              <td className={cn("py-3 px-4 text-sm text-right font-medium", item.profit >= 0 ? "text-success" : "text-danger")}>
                                {formatCurrency(item.profit)}
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">{item.time}</td>
                              <td className="py-3 px-4 text-center">
                                <Button variant="ghost" size="sm" className="h-7 px-2">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* 售后退款 */}
              <TabsContent value="refund" className="space-y-6">
                <div className="data-card">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-danger/10">
                        <RotateCcw className="h-5 w-5 text-danger" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">售后退款分析</h2>
                        <p className="text-xs text-muted-foreground">财务视角的售后退款聚合分析与追踪</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        近7天
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        筛选
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        导出
                      </Button>
                    </div>
                  </div>

                  {refundAnalysisData ? (
                    <>
                      {/* 退款汇总 */}
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-danger/5 rounded-lg border border-danger/20">
                          <span className="text-sm text-muted-foreground">退款总金额</span>
                          <p className="text-2xl font-bold text-danger mt-1">{formatCurrency(refundAnalysisData.summary.totalAmount)}</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <span className="text-sm text-muted-foreground">退款笔数</span>
                          <p className="text-2xl font-bold mt-1">{refundAnalysisData.summary.totalCount}笔</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <span className="text-sm text-muted-foreground">退款率</span>
                          <p className="text-2xl font-bold mt-1">{refundAnalysisData.summary.refundRate}%</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <span className="text-sm text-muted-foreground">平均退款金额</span>
                          <p className="text-2xl font-bold mt-1">¥{refundAnalysisData.summary.avgRefundAmount}</p>
                        </div>
                      </div>

                      {/* 多维度分析 */}
                      <div className="grid grid-cols-3 gap-6 mb-6">
                        {/* 按退款原因 */}
                        <div>
                          <h4 className="text-sm font-medium mb-4">按退款原因</h4>
                          <div className="space-y-3">
                            {refundAnalysisData.byReason.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-danger" />
                                  <span className="text-sm">{item.reason}</span>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">{formatCurrency(item.amount)}</p>
                                  <p className="text-xs text-muted-foreground">{item.count}笔 · {item.rate}%</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 按店铺 */}
                        <div>
                          <h4 className="text-sm font-medium mb-4">按店铺</h4>
                          <div className="space-y-3">
                            {refundAnalysisData.byShop.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                  <Building2 className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{item.shop}</span>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">{formatCurrency(item.amount)}</p>
                                  <p className="text-xs text-muted-foreground">{item.count}笔 · {item.rate}%</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 退款趋势 */}
                        <div>
                          <h4 className="text-sm font-medium mb-4">退款趋势</h4>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={refundAnalysisData.trend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/10000).toFixed(1)}万`} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Area type="monotone" dataKey="amount" stroke="oklch(0.55 0.18 25)" fill="oklch(0.55 0.18 25 / 0.2)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <EmptyState message="暂无退款分析数据" icon={RotateCcw} />
                  )}
                </div>

                {/* 退款订单明细 */}
                {refundOrderList.length > 0 && (
                  <div className="data-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">退款订单明细</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          支持下钻至原始订单
                        </Badge>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left text-sm font-medium py-3 px-4">退款单号</th>
                            <th className="text-left text-sm font-medium py-3 px-4">原始订单</th>
                            <th className="text-left text-sm font-medium py-3 px-4">店铺</th>
                            <th className="text-left text-sm font-medium py-3 px-4">品类</th>
                            <th className="text-left text-sm font-medium py-3 px-4">退款原因</th>
                            <th className="text-right text-sm font-medium py-3 px-4">退款金额</th>
                            <th className="text-center text-sm font-medium py-3 px-4">状态</th>
                            <th className="text-left text-sm font-medium py-3 px-4">时间</th>
                            <th className="text-center text-sm font-medium py-3 px-4">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {refundOrderList.map((item, index) => (
                            <tr key={index} className="border-t border-border/50 hover:bg-muted/30">
                              <td className="py-3 px-4 text-sm">{item.id}</td>
                              <td className="py-3 px-4 text-sm text-primary cursor-pointer hover:underline">{item.orderNo}</td>
                              <td className="py-3 px-4 text-sm">{item.shop}</td>
                              <td className="py-3 px-4 text-sm">{item.category}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className="text-danger border-danger/30">{item.reason}</Badge>
                              </td>
                              <td className="py-3 px-4 text-sm text-right font-medium text-danger">{formatCurrency(item.amount)}</td>
                              <td className="py-3 px-4 text-center">
                                <Badge 
                                  variant={item.status === "已退款" ? "default" : item.status === "处理中" ? "secondary" : "outline"}
                                  className="text-xs"
                                >
                                  {item.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">{item.time}</td>
                              <td className="py-3 px-4 text-center">
                                <Button variant="ghost" size="sm" className="h-7 px-2">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </>
      )}

      {/* 筛选对话框 */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>筛选条件</DialogTitle>
            <DialogDescription>设置报表筛选条件</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>店铺</Label>
              <div className="flex flex-wrap gap-2">
                {["旗舰店", "专营店A", "专营店B"].map((shop) => (
                  <label key={shop} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.shops.includes(shop)}
                      onCheckedChange={(checked) => {
                        setFilters((prev) => ({
                          ...prev,
                          shops: checked
                            ? [...prev.shops, shop]
                            : prev.shops.filter((s) => s !== shop),
                        }));
                      }}
                    />
                    <span className="text-sm">{shop}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>品类</Label>
              <div className="flex flex-wrap gap-2">
                {["服装", "鞋类", "配件", "其他"].map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => {
                        setFilters((prev) => ({
                          ...prev,
                          categories: checked
                            ? [...prev.categories, category]
                            : prev.categories.filter((c) => c !== category),
                        }));
                      }}
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="includeRefund"
                checked={filters.includeRefund}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({ ...prev, includeRefund: !!checked }));
                }}
              />
              <Label htmlFor="includeRefund">包含退款订单</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              setFilterDialogOpen(false);
              toast.success("筛选条件已应用");
            }}>
              应用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 自定义指标对话框 */}
      <Dialog open={customMetricsDialogOpen} onOpenChange={setCustomMetricsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>自定义指标</DialogTitle>
            <DialogDescription>选择要显示的指标</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">此功能需要Java后端支持，暂未实现</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setCustomMetricsDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 数据下钻对话框 */}
      <Dialog open={drillDownDialogOpen} onOpenChange={setDrillDownDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{drillDownData?.title} 明细</DialogTitle>
            <DialogDescription>查看详细数据</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">此功能需要Java后端支持，暂未实现</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setDrillDownDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
