import AppLayout from "@/components/AppLayout";
import { useState, useCallback } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAccountingReport, useAccountingExport } from "@/hooks/useLedger";
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

// ============ Mock Data ============

// 双轨制对比数据
const dualTrackData = {
  accrual: {
    revenue: 2856420,
    cost: 1985680,
    grossProfit: 870740,
    operatingExpense: 442090,
    netProfit: 428650,
  },
  cash: {
    revenue: 2654800,
    cost: 1856420,
    grossProfit: 798380,
    operatingExpense: 398500,
    netProfit: 399880,
  }
};

// 月度对比趋势
const monthlyComparison = [
  { month: "7月", accrual: 385000, cash: 362000 },
  { month: "8月", accrual: 412000, cash: 398000 },
  { month: "9月", accrual: 398000, cash: 425000 },
  { month: "10月", accrual: 445000, cash: 412000 },
  { month: "11月", accrual: 428000, cash: 456000 },
  { month: "12月", accrual: 468000, cash: 445000 },
];

// 利润表数据
const incomeStatement = [
  { item: "营业收入", current: 2856420, previous: 2654800, change: 7.6 },
  { item: "营业成本", current: 1985680, previous: 1856420, change: 7.0, indent: true },
  { item: "毛利润", current: 870740, previous: 798380, change: 9.1, highlight: true },
  { item: "销售费用", current: 285640, previous: 265480, change: 7.6, indent: true },
  { item: "管理费用", current: 85690, previous: 79640, change: 7.6, indent: true },
  { item: "财务费用", current: 12560, previous: 11850, change: 6.0, indent: true },
  { item: "推广费用", current: 58200, previous: 52400, change: 11.1, indent: true },
  { item: "营业利润", current: 428650, previous: 389010, change: 10.2, highlight: true },
  { item: "营业外收入", current: 5200, previous: 4800, change: 8.3, indent: true },
  { item: "营业外支出", current: 2100, previous: 1950, change: 7.7, indent: true },
  { item: "净利润", current: 431750, previous: 391860, change: 10.2, highlight: true, bold: true },
];

// 资产负债表数据
const balanceSheet = {
  assets: [
    { item: "流动资产", value: 2856420, children: [
      { item: "货币资金", value: 1542000 },
      { item: "应收账款", value: 425680 },
      { item: "存货", value: 892350 },
      { item: "其他流动资产", value: -3610 },
    ]},
    { item: "非流动资产", value: 156800, children: [
      { item: "固定资产", value: 125600 },
      { item: "无形资产", value: 31200 },
    ]},
  ],
  liabilities: [
    { item: "流动负债", value: 685420, children: [
      { item: "应付账款", value: 425680 },
      { item: "预收款项", value: 185640 },
      { item: "应交税费", value: 74100 },
    ]},
    { item: "非流动负债", value: 0 },
  ],
  equity: [
    { item: "实收资本", value: 1000000 },
    { item: "盈余公积", value: 328800 },
    { item: "未分配利润", value: 999000 },
  ]
};

// 现金流量表数据
const cashFlowStatement = [
  { category: "经营活动", items: [
    { item: "销售商品收到的现金", value: 2654800, type: "in" },
    { item: "收到的税费返还", value: 12500, type: "in" },
    { item: "购买商品支付的现金", value: -1856420, type: "out" },
    { item: "支付给职工的现金", value: -285640, type: "out" },
    { item: "支付的各项税费", value: -125800, type: "out" },
  ], subtotal: 399440 },
  { category: "投资活动", items: [
    { item: "购建固定资产支付的现金", value: -35600, type: "out" },
    { item: "投资支付的现金", value: 0, type: "out" },
  ], subtotal: -35600 },
  { category: "筹资活动", items: [
    { item: "吸收投资收到的现金", value: 0, type: "in" },
    { item: "偿还债务支付的现金", value: -50000, type: "out" },
  ], subtotal: -50000 },
];

// FIN-001 利润经营日报表数据
const dailyReportData = {
  date: "2026-01-11",
  orderStats: {
    totalOrders: 1258,
    paidOrders: 1156,
    conversionRate: 91.9,
    avgOrderValue: 168.5,
  },
  financialStats: {
    revenue: 194706,
    cost: 135294,
    grossProfit: 59412,
    grossProfitRate: 30.5,
    expenses: 28560,
    netProfit: 30852,
    netProfitRate: 15.8,
  },
  fundFlow: {
    inflow: 182450,
    outflow: 145680,
    netFlow: 36770,
  }
};

// 日报趋势数据（近7天）
const dailyTrendData = [
  { date: "01-05", revenue: 168500, profit: 25800, orders: 1050 },
  { date: "01-06", revenue: 175200, profit: 27500, orders: 1120 },
  { date: "01-07", revenue: 182400, profit: 28900, orders: 1180 },
  { date: "01-08", revenue: 169800, profit: 26200, orders: 1080 },
  { date: "01-09", revenue: 188600, profit: 29800, orders: 1220 },
  { date: "01-10", revenue: 192300, profit: 30200, orders: 1245 },
  { date: "01-11", revenue: 194706, profit: 30852, orders: 1258 },
];

// FIN-002 收入成本分类匹配数据
const revenueByType = [
  { type: "商品收入", revenue: 2456800, cost: 1685420, grossProfit: 771380, rate: 31.4, color: "oklch(0.55 0.18 250)" },
  { type: "平台补贴", revenue: 285640, cost: 0, grossProfit: 285640, rate: 100, color: "oklch(0.55 0.18 150)" },
  { type: "运费收入", revenue: 85680, cost: 72560, grossProfit: 13120, rate: 15.3, color: "oklch(0.55 0.18 50)" },
  { type: "其他收入", revenue: 28300, cost: 227700, grossProfit: -199400, rate: -704.9, color: "oklch(0.55 0.18 300)" },
];

// 收入明细列表
const revenueDetailList = [
  { id: "REV-20260111-001", orderNo: "DD20260111001258", type: "商品收入", amount: 2580, cost: 1680, profit: 900, time: "2026-01-11 15:32:18" },
  { id: "REV-20260111-002", orderNo: "DD20260111001257", type: "商品收入", amount: 1890, cost: 1250, profit: 640, time: "2026-01-11 15:28:45" },
  { id: "REV-20260111-003", orderNo: "DD20260111001256", type: "平台补贴", amount: 150, cost: 0, profit: 150, time: "2026-01-11 15:25:12" },
  { id: "REV-20260111-004", orderNo: "DD20260111001255", type: "运费收入", amount: 12, cost: 8, profit: 4, time: "2026-01-11 15:22:36" },
  { id: "REV-20260111-005", orderNo: "DD20260111001254", type: "商品收入", amount: 3250, cost: 2180, profit: 1070, time: "2026-01-11 15:18:52" },
];

// FIN-003 售后退款分析数据
const refundAnalysisData = {
  summary: {
    totalAmount: 125680,
    totalCount: 286,
    refundRate: 4.8,
    avgRefundAmount: 439.4,
  },
  byReason: [
    { reason: "质量问题", amount: 45680, count: 98, rate: 36.3 },
    { reason: "发错/漏发", amount: 32560, count: 72, rate: 25.9 },
    { reason: "不想要了", amount: 28450, count: 68, rate: 22.6 },
    { reason: "物流问题", amount: 12560, count: 32, rate: 10.0 },
    { reason: "其他原因", amount: 6430, count: 16, rate: 5.1 },
  ],
  byShop: [
    { shop: "旗舰店", amount: 68540, count: 156, rate: 54.5 },
    { shop: "专营店A", amount: 32450, count: 78, rate: 27.3 },
    { shop: "专营店B", amount: 24690, count: 52, rate: 18.2 },
  ],
  trend: [
    { date: "01-05", amount: 15680, count: 38 },
    { date: "01-06", amount: 18920, count: 42 },
    { date: "01-07", amount: 16540, count: 36 },
    { date: "01-08", amount: 19850, count: 45 },
    { date: "01-09", amount: 17620, count: 40 },
    { date: "01-10", amount: 18450, count: 43 },
    { date: "01-11", amount: 18620, count: 42 },
  ],
};

// 退款订单明细
const refundOrderList = [
  { id: "RF-20260111-001", orderNo: "DD20260111000856", shop: "旗舰店", category: "服装", reason: "质量问题", amount: 258, status: "已退款", time: "2026-01-11 14:32:18" },
  { id: "RF-20260111-002", orderNo: "DD20260111000742", shop: "专营店A", category: "配件", reason: "发错/漏发", amount: 89, status: "处理中", time: "2026-01-11 13:28:45" },
  { id: "RF-20260111-003", orderNo: "DD20260111000635", shop: "旗舰店", category: "鞋类", reason: "不想要了", amount: 368, status: "已退款", time: "2026-01-11 12:25:12" },
  { id: "RF-20260111-004", orderNo: "DD20260111000528", shop: "专营店B", category: "服装", reason: "物流问题", amount: 156, status: "待审核", time: "2026-01-11 11:22:36" },
  { id: "RF-20260111-005", orderNo: "DD20260111000421", shop: "旗舰店", category: "配件", reason: "质量问题", amount: 425, status: "已退款", time: "2026-01-11 10:18:52" },
];

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
  const diffPercent = ((diff / cashValue) * 100).toFixed(1);
  
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
          <span className="text-lg font-medium text-muted-foreground">{formatCurrency(cashValue)}</span>
        </div>
      </div>
    </div>
  );
}

// 报表行组件
function StatementRow({ 
  item, 
  current, 
  previous, 
  change, 
  indent, 
  highlight, 
  bold,
  onDrillDown,
}: { 
  item: string;
  current: number;
  previous: number;
  change: number;
  indent?: boolean;
  highlight?: boolean;
  bold?: boolean;
  onDrillDown?: () => void;
}) {
  return (
    <div className={cn(
      "grid grid-cols-5 gap-4 py-3 px-4 border-b border-border/50 group hover:bg-muted/30 transition-colors",
      highlight && "bg-primary/5",
      bold && "font-semibold"
    )}>
      <div className={cn("text-sm flex items-center gap-2", indent && "pl-4")}>
        {item}
        {onDrillDown && (
          <button 
            onClick={onDrillDown}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-primary/10 rounded"
            title="下钻查看明细"
          >
            <ExternalLink className="h-3 w-3 text-primary" />
          </button>
        )}
      </div>
      <div className="text-sm text-right">{formatCurrency(current)}</div>
      <div className="text-sm text-right text-muted-foreground">{formatCurrency(previous)}</div>
      <div className={cn(
        "text-sm text-right flex items-center justify-end gap-1",
        change >= 0 ? "text-success" : "text-danger"
      )}>
        {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {formatPercent(change)}
      </div>
      <div className="text-sm text-right">
        {onDrillDown && (
          <Button variant="ghost" size="sm" onClick={onDrillDown} className="h-6 px-2 text-xs">
            <Eye className="h-3 w-3 mr-1" />
            明细
          </Button>
        )}
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
  color = "primary",
}: {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  trend?: number;
  color?: "primary" | "success" | "warning" | "danger";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  };

  return (
    <div className="data-card">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg", colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <Badge variant={trend >= 0 ? "default" : "destructive"} className="text-xs">
            {trend >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {Math.abs(trend).toFixed(1)}%
          </Badge>
        )}
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
    </div>
  );
}

// ============ Main Component ============
export default function Accounting() {
  const [reportType, setReportType] = useState<"income" | "balance" | "cashflow">("income");
  const [dateGranularity, setDateGranularity] = useState<"month" | "day">("month");
  const [showDrillDown, setShowDrillDown] = useState(false);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [revenueTypeFilter, setRevenueTypeFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [customMetricsDialogOpen, setCustomMetricsDialogOpen] = useState(false);
  
  // 获取店铺信息
  const { currentShopId } = useShopSwitcher();
  
  // 获取财务报表数据
  const { data: reportData, isLoading: isLoadingReport, refetch: refetchReport } = useAccountingReport({
    reportType,
    month: selectedDate.substring(0, 7),
  });
  
  // 导出报表
  const exportMutation = useAccountingExport();
  
  // 处理刷新
  const handleRefresh = useCallback(async () => {
    try {
      await refetchReport();
      toast.success("数据已刷新");
    } catch (error) {
      toast.error("刷新失败，请重试");
    }
  }, [refetchReport]);
  
  // 处理导出
  const handleExport = useCallback(async () => {
    try {
      const result = await exportMutation.mutateAsync({
        shopId: currentShopId || "",
        reportType,
        month: selectedDate.substring(0, 7),
        format: "excel",
      });
      toast.success("报表导出成功");
      console.log("导出结果:", result);
    } catch (error) {
      toast.error("导出失败，请重试");
    }
  }, [exportMutation, currentShopId, reportType, selectedDate]);
  
  // 处理日期切换
  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
    toast.info(`已切换到 ${date}`);
  }, []);
  
  // 处理日期粒度切换
  const handleDateGranularityChange = useCallback((type: "month" | "day") => {
    setDateGranularity(type);
    toast.info(`已切换到${type === "month" ? "月报" : "日报"}模式`);
  }, []);

  // 处理下钻
  const handleDrillDown = (item: string, data: any) => {
    setDrillDownData({ item, ...data });
    setShowDrillDown(true);
    toast.info(`正在查看${item}明细...`);
  };

  return (
    <AppLayout>
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">财务核算</h1>
          <p className="text-sm text-muted-foreground mt-1">
            双轨制核算对比 · 三大财务报表 · 数据穿透分析
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

      {/* FIN-001 利润经营日报表 */}
      {dateGranularity === "day" && (
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
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" name="营收" stroke="oklch(0.55 0.18 150)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line yAxisId="left" type="monotone" dataKey="profit" name="利润" stroke="oklch(0.55 0.18 250)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" name="订单数" stroke="oklch(0.55 0.18 50)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 月报视图 */}
      {dateGranularity === "month" && (
        <>
          {/* 双轨制核算对比 */}
          <div className="data-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">双轨制核算对比</h2>
                  <p className="text-xs text-muted-foreground">权责发生制 vs 收付实现制</p>
                </div>
              </div>
              <Badge variant="secondary">本月数据</Badge>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
                icon={CreditCard}
              />
              <DualTrackCard 
                title="毛利润" 
                accrualValue={dualTrackData.accrual.grossProfit}
                cashValue={dualTrackData.cash.grossProfit}
                icon={BarChart3}
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
                icon={Building2}
              />
            </div>

            {/* 趋势对比图 */}
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
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="accrual" name="权责发生制" fill="oklch(0.5 0.18 250)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cash" name="收付实现制" fill="oklch(0.55 0.18 150)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 三大报表 + 收入分类 + 售后退款 Tabs */}
          <Tabs defaultValue="income" className="space-y-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="income" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                利润表
              </TabsTrigger>
              <TabsTrigger value="revenue-type" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                收入分类
              </TabsTrigger>
              <TabsTrigger value="refund" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                售后退款
              </TabsTrigger>
              <TabsTrigger value="balance" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                资产负债表
              </TabsTrigger>
              <TabsTrigger value="cashflow" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                现金流量表
              </TabsTrigger>
            </TabsList>

            {/* 利润表 */}
            <TabsContent value="income" className="data-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">利润表</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">单位：人民币元</span>
                  <Badge variant="outline" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    支持数据穿透
                  </Badge>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-5 gap-4 py-3 px-4 bg-muted/50 text-sm font-medium">
                  <div>项目</div>
                  <div className="text-right">本期金额</div>
                  <div className="text-right">上期金额</div>
                  <div className="text-right">同比变化</div>
                  <div className="text-right">操作</div>
                </div>
                {incomeStatement.map((row, index) => (
                  <StatementRow 
                    key={index} 
                    {...row} 
                    onDrillDown={row.highlight ? () => handleDrillDown(row.item, { current: row.current, previous: row.previous }) : undefined}
                  />
                ))}
              </div>
            </TabsContent>

            {/* FIN-002 收入成本分类匹配分析 */}
            <TabsContent value="revenue-type" className="space-y-6">
              <div className="data-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <PieChart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">收入成本分类匹配分析</h2>
                      <p className="text-xs text-muted-foreground">按收入类型展示分摊后的分类毛利</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      className="text-sm border rounded-lg px-3 py-1.5 bg-white"
                      value={revenueTypeFilter}
                      onChange={(e) => setRevenueTypeFilter(e.target.value)}
                    >
                      <option value="all">全部类型</option>
                      <option value="商品收入">商品收入</option>
                      <option value="平台补贴">平台补贴</option>
                      <option value="运费收入">运费收入</option>
                      <option value="其他收入">其他收入</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      配置匹配规则
                    </Button>
                  </div>
                </div>

                {/* 分类汇总卡片 */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {revenueByType.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={() => setRevenueTypeFilter(item.type)}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium">{item.type}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">收入</span>
                          <span className="font-medium">{formatCurrency(item.revenue)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">成本</span>
                          <span className="font-medium">{formatCurrency(item.cost)}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t pt-2">
                          <span className="text-muted-foreground">毛利</span>
                          <span className={cn("font-bold", item.grossProfit >= 0 ? "text-success" : "text-danger")}>
                            {formatCurrency(item.grossProfit)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">毛利率</span>
                          <Badge variant={item.rate >= 0 ? "default" : "destructive"} className="text-xs">
                            {item.rate.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 收入构成饼图 */}
                <div className="grid grid-cols-2 gap-6">
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
                            label={({ type, percent }) => `${type} ${(percent * 100).toFixed(1)}%`}
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
                  <div>
                    <h4 className="text-sm font-medium mb-4">毛利贡献</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueByType} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
                          <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/10000).toFixed(0)}万`} />
                          <YAxis type="category" dataKey="type" tick={{ fontSize: 12 }} width={80} />
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <Bar dataKey="grossProfit" name="毛利">
                            {revenueByType.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.grossProfit >= 0 ? "oklch(0.55 0.18 150)" : "oklch(0.55 0.18 25)"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* 收入明细列表 */}
              <div className="data-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">收入明细列表</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="搜索订单号..." 
                        className="pl-9 pr-4 py-1.5 text-sm border rounded-lg w-48"
                      />
                    </div>
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
            </TabsContent>

            {/* FIN-003 售后退款专项跟踪 */}
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
              </div>

              {/* 退款订单明细 */}
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
                            <Badge variant="outline" className="text-xs">{item.reason}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium text-danger">-{formatCurrency(item.amount)}</td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant={item.status === "已退款" ? "default" : item.status === "处理中" ? "secondary" : "outline"}>
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{item.time}</td>
                          <td className="py-3 px-4 text-center">
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* 资产负债表 */}
            <TabsContent value="balance" className="data-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">资产负债表</h3>
                <span className="text-xs text-muted-foreground">截止日期：2026-01-11</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* 资产 */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="py-3 px-4 bg-primary/10 text-sm font-medium">
                    资产
                  </div>
                  {balanceSheet.assets.map((section, idx) => (
                    <div key={idx}>
                      <div className="grid grid-cols-2 py-3 px-4 border-b border-border/50 font-medium">
                        <div>{section.item}</div>
                        <div className="text-right">{formatCurrency(section.value)}</div>
                      </div>
                      {section.children?.map((child, cidx) => (
                        <div key={cidx} className="grid grid-cols-2 py-2 px-4 border-b border-border/30 text-sm">
                          <div className="pl-4 text-muted-foreground">{child.item}</div>
                          <div className="text-right">{formatCurrency(child.value)}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="grid grid-cols-2 py-3 px-4 bg-muted/30 font-semibold">
                    <div>资产总计</div>
                    <div className="text-right">{formatCurrency(3013220)}</div>
                  </div>
                </div>

                {/* 负债和所有者权益 */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="py-3 px-4 bg-warning/10 text-sm font-medium">
                    负债和所有者权益
                  </div>
                  {balanceSheet.liabilities.map((section, idx) => (
                    <div key={idx}>
                      <div className="grid grid-cols-2 py-3 px-4 border-b border-border/50 font-medium">
                        <div>{section.item}</div>
                        <div className="text-right">{formatCurrency(section.value)}</div>
                      </div>
                      {section.children?.map((child, cidx) => (
                        <div key={cidx} className="grid grid-cols-2 py-2 px-4 border-b border-border/30 text-sm">
                          <div className="pl-4 text-muted-foreground">{child.item}</div>
                          <div className="text-right">{formatCurrency(child.value)}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="py-3 px-4 border-b border-border/50 font-medium">
                    所有者权益
                  </div>
                  {balanceSheet.equity.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-2 py-2 px-4 border-b border-border/30 text-sm">
                      <div className="pl-4 text-muted-foreground">{item.item}</div>
                      <div className="text-right">{formatCurrency(item.value)}</div>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 py-3 px-4 bg-muted/30 font-semibold">
                    <div>负债和权益总计</div>
                    <div className="text-right">{formatCurrency(3013220)}</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 现金流量表 */}
            <TabsContent value="cashflow" className="data-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">现金流量表</h3>
                <span className="text-xs text-muted-foreground">本期累计金额</span>
              </div>
              <div className="border rounded-lg overflow-hidden">
                {cashFlowStatement.map((section, idx) => (
                  <div key={idx}>
                    <div className="py-3 px-4 bg-muted/50 font-medium flex items-center justify-between">
                      <span>{section.category}产生的现金流量</span>
                      <span className={cn(
                        "font-semibold",
                        section.subtotal >= 0 ? "text-success" : "text-danger"
                      )}>
                        {formatCurrency(section.subtotal)}
                      </span>
                    </div>
                    {section.items.map((item, iidx) => (
                      <div key={iidx} className="grid grid-cols-2 py-2 px-4 border-b border-border/30 text-sm">
                        <div className="pl-4 text-muted-foreground">{item.item}</div>
                        <div className={cn(
                          "text-right",
                          item.value >= 0 ? "text-success" : "text-danger"
                        )}>
                          {formatCurrency(item.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="grid grid-cols-2 py-3 px-4 bg-primary/10 font-semibold">
                  <div>现金及现金等价物净增加额</div>
                  <div className="text-right text-success">{formatCurrency(313840)}</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* 筛选对话框 */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>报表筛选</DialogTitle>
            <DialogDescription>
              设置报表数据的筛选条件
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shop" className="text-right">店铺</Label>
              <Input id="shop" defaultValue="全部店铺" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">品类</Label>
              <Input id="category" defaultValue="全部品类" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">报表类型</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="income" defaultChecked />
                  <label htmlFor="income" className="text-sm">利润表</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="balance" defaultChecked />
                  <label htmlFor="balance" className="text-sm">资产负债表</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cashflow" defaultChecked />
                  <label htmlFor="cashflow" className="text-sm">现金流量表</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>取消</Button>
            <Button onClick={() => {
              setFilterDialogOpen(false);
              toast.success("筛选条件已应用");
            }}>应用筛选</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 自定义指标对话框 */}
      <Dialog open={customMetricsDialogOpen} onOpenChange={setCustomMetricsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>自定义指标配置</DialogTitle>
            <DialogDescription>
              选择要在日报中展示的指标项
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">订单指标</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="m-orders" defaultChecked />
                  <label htmlFor="m-orders" className="text-sm">订单总数</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="m-paid" defaultChecked />
                  <label htmlFor="m-paid" className="text-sm">付款订单数</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="m-conversion" defaultChecked />
                  <label htmlFor="m-conversion" className="text-sm">成交转化率</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="m-aov" defaultChecked />
                  <label htmlFor="m-aov" className="text-sm">客单价</label>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">财务指标</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="m-revenue" defaultChecked />
                  <label htmlFor="m-revenue" className="text-sm">营业收入</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="m-cost" defaultChecked />
                  <label htmlFor="m-cost" className="text-sm">营业成本</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="m-gross" defaultChecked />
                  <label htmlFor="m-gross" className="text-sm">毛利润</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="m-net" defaultChecked />
                  <label htmlFor="m-net" className="text-sm">净利润</label>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">资金指标</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="m-inflow" defaultChecked />
                  <label htmlFor="m-inflow" className="text-sm">资金流入</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="m-outflow" defaultChecked />
                  <label htmlFor="m-outflow" className="text-sm">资金流出</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="m-netflow" defaultChecked />
                  <label htmlFor="m-netflow" className="text-sm">净现金流</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomMetricsDialogOpen(false)}>取消</Button>
            <Button onClick={() => {
              setCustomMetricsDialogOpen(false);
              toast.success("指标配置已保存");
            }}>保存配置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 数据穿透弹窗 */}
      {showDrillDown && drillDownData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[800px] max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">数据穿透 - {drillDownData.item}</h3>
                  <p className="text-xs text-muted-foreground">查看关联业务明细</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowDrillDown(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {/* 面包屑导航 */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span>利润表</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">{drillDownData.item}</span>
              </div>
              
              {/* 汇总信息 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">本期金额</span>
                  <p className="text-xl font-bold mt-1">{formatCurrency(drillDownData.current)}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">上期金额</span>
                  <p className="text-xl font-bold mt-1">{formatCurrency(drillDownData.previous)}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">同比变化</span>
                  <p className={cn("text-xl font-bold mt-1", drillDownData.current > drillDownData.previous ? "text-success" : "text-danger")}>
                    {formatPercent(((drillDownData.current - drillDownData.previous) / drillDownData.previous) * 100)}
                  </p>
                </div>
              </div>

              {/* 下钻路径提示 */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-4">
                <h4 className="text-sm font-medium mb-2">可继续下钻</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                    按店铺查看
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                    按品类查看
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                    按订单查看
                  </Badge>
                </div>
              </div>

              {/* 明细列表占位 */}
              <div className="border rounded-lg p-8 text-center text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>此处将展示{drillDownData.item}的关联订单明细</p>
                <p className="text-xs mt-2">支持继续下钻至具体订单详情</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t bg-muted/30">
              <Button variant="outline" onClick={() => setShowDrillDown(false)}>
                关闭
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                导出明细
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AppLayout>
  );
}
