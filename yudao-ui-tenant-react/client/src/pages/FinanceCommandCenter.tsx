import { useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Calculator,
  Wallet,
  Package,
  TrendingUp,
  Receipt,
  Scale,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Building2,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  ShoppingCart,
  Percent,
  CreditCard,
  TrendingDown,
  Eye,
  MoreHorizontal,
  HelpCircle,
  Gauge,
  ArrowLeftRight,
  FileCheck,
  GitCompare,
  FileText,
  CalendarDays,
  Store,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { toast } from "sonner";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { zhCN } from "date-fns/locale";

import { useDashboardOverview } from "@/hooks/useLedger";
import { useShopSwitcher, ShopSwitcher } from "@/components/ShopSwitcher";

// ============ 类型定义 ============
type DateRangeType = "today" | "week" | "month" | "custom";

interface FilterOptions {
  showRevenue: boolean;
  showProfit: boolean;
  showOrders: boolean;
  showExpense: boolean;
}

interface DashboardKPI {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  grossProfit: number;
  profitChange: number;
  grossMargin: number;
  marginChange: number;
}

interface TrendData {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
}

interface ExpenseData {
  category: string;
  amount: number;
  percent: number;
}

interface AlertData {
  type: "danger" | "warning" | "success";
  title: string;
  desc: string;
  time: string;
}

interface TransactionData {
  type: "income" | "expense";
  desc: string;
  amount: number;
  time: string;
}

interface DashboardData {
  kpi: DashboardKPI;
  trends: TrendData[];
  expenseBreakdown: ExpenseData[];
  alerts: AlertData[];
  recentTransactions: TransactionData[];
}

// ============ 导航配置 ============
const navItems = [
  // 总账管理
  { icon: LayoutDashboard, label: "经营概览", id: "dashboard", path: "/", group: "ledger", groupLabel: "总账管理" },
  { icon: Calculator, label: "财务核算", id: "accounting", path: "/accounting", group: "ledger" },
  { icon: Wallet, label: "资金管理", id: "funds", path: "/funds", group: "ledger" },
  { icon: Package, label: "库存成本", id: "inventory", path: "/inventory", group: "ledger" },
  { icon: TrendingUp, label: "经营分析", id: "analysis", path: "/analysis", group: "ledger" },
  { icon: Receipt, label: "费用中心", id: "expense", path: "/expense", group: "ledger" },
  { icon: Scale, label: "税务管理", id: "tax", path: "/tax", group: "ledger" },
  
  // 订单管理
  { icon: ShoppingCart, label: "订单管理", id: "orders", path: "/orders", group: "orders", groupLabel: "订单管理" },
  { icon: BarChart3, label: "订单统计", id: "order-stats", path: "/order-statistics", group: "orders" },
  { icon: CalendarDays, label: "最近30天", id: "recent-30", path: "/order-thirty-days", group: "orders" },
  
  // 出纳管理
  { icon: Gauge, label: "出纳工作台", id: "cashier-dashboard", path: "/cashier/dashboard", group: "cashier", groupLabel: "出纳管理" },
  { icon: ArrowLeftRight, label: "资金流水", id: "cashier-cashflow", path: "/cashier/cashflow", group: "cashier" },
  { icon: FileCheck, label: "平台对账", id: "cashier-reconciliation", path: "/cashier/reconciliation", group: "cashier" },
  { icon: GitCompare, label: "差异分析", id: "cashier-diff", path: "/cashier/diff-analysis", group: "cashier" },
  { icon: FileText, label: "报表中心", id: "cashier-reports", path: "/cashier/reports", group: "cashier" },
  { icon: Store, label: "渠道管理", id: "cashier-channels", path: "/cashier/channels", group: "cashier" },
  
  // 预警中心
  { icon: AlertTriangle, label: "待处理预警", id: "cashier-alerts", path: "/cashier/alerts", group: "cashier-alert", groupLabel: "预警中心" },
  { icon: ShieldAlert, label: "预警规则", id: "cashier-rules", path: "/cashier/alert-rules", group: "cashier-alert" },
  
  // 系统设置
  { icon: Settings, label: "系统设置", id: "settings", path: "/settings", group: "system" },
  { icon: HelpCircle, label: "帮助中心", id: "help", path: "/help", group: "system" },
];

const groupOrder = ["ledger", "orders", "cashier", "cashier-alert", "system"];

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

function getDateRangeLabel(dateRange: DateRangeType): string {
  switch (dateRange) {
    case "today": return "今日";
    case "week": return "本周";
    case "month": return "本月";
    case "custom": return "自定义";
    default: return "今日";
  }
}

function getDateRange(dateRange: DateRangeType, customStart?: Date, customEnd?: Date): { startDate: string; endDate: string } {
  const today = new Date();
  switch (dateRange) {
    case "today":
      return { startDate: format(today, "yyyy-MM-dd"), endDate: format(today, "yyyy-MM-dd") };
    case "week":
      return { 
        startDate: format(startOfWeek(today, { locale: zhCN }), "yyyy-MM-dd"), 
        endDate: format(endOfWeek(today, { locale: zhCN }), "yyyy-MM-dd") 
      };
    case "month":
      return { 
        startDate: format(startOfMonth(today), "yyyy-MM-dd"), 
        endDate: format(endOfMonth(today), "yyyy-MM-dd") 
      };
    case "custom":
      return { 
        startDate: customStart ? format(customStart, "yyyy-MM-dd") : format(today, "yyyy-MM-dd"), 
        endDate: customEnd ? format(customEnd, "yyyy-MM-dd") : format(today, "yyyy-MM-dd") 
      };
    default:
      return { startDate: format(today, "yyyy-MM-dd"), endDate: format(today, "yyyy-MM-dd") };
  }
}

// ============ Components ============

// KPI Card Component
function KPICard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  format: formatType = "currency",
  glowColor,
  isLoading = false,
}: {
  title: string;
  value: number;
  change: number;
  trend: "up" | "down";
  icon: React.ElementType;
  format?: "currency" | "percent" | "number";
  glowColor?: string;
  isLoading?: boolean;
}) {
  const formattedValue =
    formatType === "currency"
      ? formatCurrency(value)
      : formatType === "percent"
      ? `${value.toFixed(1)}%`
      : value.toLocaleString();

  const isPositive = trend === "up";
  const changeIsGood = title.includes("成本") || title.includes("税") ? !isPositive : isPositive;

  if (isLoading) {
    return (
      <div className="data-card relative overflow-hidden group p-3">
        <div className="flex items-center justify-center h-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "data-card relative overflow-hidden group p-3",
        glowColor && changeIsGood && "glow-success",
        glowColor && !changeIsGood && "glow-danger"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0",
            changeIsGood ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="w-2.5 h-2.5" />
          ) : (
            <ArrowDownRight className="w-2.5 h-2.5" />
          )}
          {formatPercent(change)}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-1 truncate">{title}</div>
      <div className="text-lg font-bold text-foreground truncate">{formattedValue}</div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

// Alert Item Component
function AlertItem({
  type,
  title,
  desc,
  time,
}: {
  type: "danger" | "warning" | "success";
  title: string;
  desc: string;
  time: string;
}) {
  const icons = {
    danger: AlertTriangle,
    warning: Clock,
    success: CheckCircle2,
  };
  const Icon = icons[type];

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
      <div
        className={cn(
          "p-1.5 rounded-full shrink-0",
          type === "danger" && "bg-danger/15 text-danger",
          type === "warning" && "bg-warning/15 text-warning",
          type === "success" && "bg-success/15 text-success"
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm truncate">{title}</span>
          <span className="text-xs text-muted-foreground shrink-0">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{desc}</p>
      </div>
    </div>
  );
}

// Transaction Item Component
function TransactionItem({
  type,
  desc,
  amount,
  time,
}: {
  type: "income" | "expense";
  desc: string;
  amount: number;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            type === "income" ? "bg-success/15" : "bg-danger/15"
          )}
        >
          {type === "income" ? (
            <ArrowDownRight className="w-4 h-4 text-success" />
          ) : (
            <ArrowUpRight className="w-4 h-4 text-danger" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium truncate max-w-[180px]">{desc}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <span
        className={cn(
          "font-semibold",
          type === "income" ? "text-success" : "text-danger"
        )}
      >
        {type === "income" ? "+" : ""}{formatCurrency(amount)}
      </span>
    </div>
  );
}

// Custom Tooltip for Charts
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// 筛选弹窗组件
function FilterDialog({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
    toast.success("筛选条件已应用");
  };

  const handleReset = () => {
    const defaultFilters = { showRevenue: true, showProfit: true, showOrders: true, showExpense: true };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    toast.info("筛选条件已重置");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>数据筛选</DialogTitle>
          <DialogDescription>
            选择要显示的数据指标
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showRevenue"
              checked={localFilters.showRevenue}
              onCheckedChange={(checked) => setLocalFilters({ ...localFilters, showRevenue: !!checked })}
            />
            <Label htmlFor="showRevenue">显示营收数据</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showProfit"
              checked={localFilters.showProfit}
              onCheckedChange={(checked) => setLocalFilters({ ...localFilters, showProfit: !!checked })}
            />
            <Label htmlFor="showProfit">显示利润数据</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showOrders"
              checked={localFilters.showOrders}
              onCheckedChange={(checked) => setLocalFilters({ ...localFilters, showOrders: !!checked })}
            />
            <Label htmlFor="showOrders">显示订单数据</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showExpense"
              checked={localFilters.showExpense}
              onCheckedChange={(checked) => setLocalFilters({ ...localFilters, showExpense: !!checked })}
            />
            <Label htmlFor="showExpense">显示费用数据</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>重置</Button>
          <Button onClick={handleApply}>应用</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============ Main Component ============
export default function FinanceCommandCenter() {
  const [location] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // 日期范围状态
  const [dateRange, setDateRange] = useState<DateRangeType>("today");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  
  // 筛选状态
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    showRevenue: true,
    showProfit: true,
    showOrders: true,
    showExpense: true,
  });
  
  // 获取店铺信息
  const { currentShopId, currentShopName } = useShopSwitcher();
  
  // 获取日期范围
  const { startDate, endDate } = getDateRange(
    dateRange,
    customStartDate ? new Date(customStartDate) : undefined,
    customEndDate ? new Date(customEndDate) : undefined
  );
  
  // 获取经营概览数据
  const { data: dashboardData, isLoading, refetch } = useDashboardOverview({
    startDate,
    endDate,
  });
  
  // 处理刷新
  const handleRefresh = useCallback(async () => {
    await refetch();
    toast.success("数据已刷新");
  }, [refetch]);
  
  // 处理导出
  const handleExport = useCallback(async () => {
    toast.info("导出功能待Java后端实现");
  }, []);
  
  // 处理日期范围变更
  const handleDateRangeChange = useCallback((range: DateRangeType) => {
    setDateRange(range);
    toast.info(`已切换到${getDateRangeLabel(range)}数据`);
  }, []);
  
  // 从API数据中提取KPI
  const apiData = dashboardData as DashboardData | undefined;
  const kpiData: DashboardKPI = apiData?.kpi || {
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    grossProfit: 0,
    profitChange: 0,
    grossMargin: 0,
    marginChange: 0,
  };
  
  // 趋势数据
  const trendsData: TrendData[] = apiData?.trends || [];
  
  // 费用分布数据
  const expenseData: ExpenseData[] = apiData?.expenseBreakdown || [];
  
  // 预警数据
  const alertsData: AlertData[] = apiData?.alerts || [];
  
  // 最近交易
  const transactionsData: TransactionData[] = apiData?.recentTransactions || [];
  
  // 图表颜色
  const COLORS = ["oklch(0.65 0.2 250)", "oklch(0.65 0.2 150)", "oklch(0.65 0.2 50)", "oklch(0.65 0.2 350)", "oklch(0.65 0.2 200)"];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-16" : "w-56"
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-base text-sidebar-foreground whitespace-nowrap">
                闪电帐 PRO
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
          {(() => {
            const groupedNavItems = navItems.reduce((acc, item) => {
              const group = item.group || "main";
              if (!acc[group]) {
                acc[group] = { items: [], label: (item as any).groupLabel };
              }
              acc[group].items.push(item);
              return acc;
            }, {} as Record<string, { items: typeof navItems; label?: string }>);

            return groupOrder.map((groupKey) => {
              const group = groupedNavItems[groupKey];
              if (!group) return null;

              return (
                <div key={groupKey} className="space-y-0.5">
                  {group.label && !sidebarCollapsed && (
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group.label}
                    </div>
                  )}
                  {group.label && sidebarCollapsed && (
                    <div className="h-px bg-sidebar-border mx-2 my-2" />
                  )}

                  {group.items.map((item) => {
                    const isActive = location === item.path || 
                      (item.path === "/" && location === "/") ||
                      (item.path !== "/" && location.startsWith(item.path) && item.path.length > 1);
                    return (
                      <Link
                        key={item.id}
                        href={item.path}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all group relative",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium truncate">{item.label}</span>
                        )}
                        {sidebarCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            });
          })()}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <ChevronRight
              className={cn(
                "w-5 h-5 transition-transform",
                sidebarCollapsed ? "" : "rotate-180"
              )}
            />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-56"
        )}
      >
        {/* Top Header */}
        <header className="h-14 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Global Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索订单、报表..."
                className="w-64 pl-9 bg-secondary/50 border-transparent focus:bg-background focus:border-primary/30 h-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground h-9 w-9"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground h-9 w-9">
              <Bell className="w-4 h-4" />
              {alertsData.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-background" />
              )}
            </Button>

            {/* Shop Selector - 使用真实的店铺切换组件 */}
            <ShopSwitcher showFullName={true} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gradient-primary">实时经营总览</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  数据更新时间: {format(new Date(), "yyyy-MM-dd HH:mm:ss")} · 刷新频率: ≤10分钟
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* 日期选择下拉菜单 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {getDateRangeLabel(dateRange)}
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>选择日期范围</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDateRangeChange("today")}>
                      今日
                      {dateRange === "today" && <CheckCircle2 className="w-4 h-4 ml-auto text-success" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDateRangeChange("week")}>
                      本周
                      {dateRange === "week" && <CheckCircle2 className="w-4 h-4 ml-auto text-success" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDateRangeChange("month")}>
                      本月
                      {dateRange === "month" && <CheckCircle2 className="w-4 h-4 ml-auto text-success" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex items-center gap-2 px-2 py-1.5 cursor-pointer">
                            自定义日期
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="end">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">自定义日期范围</h4>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="startDate">开始日期</Label>
                                <Input
                                  id="startDate"
                                  type="date"
                                  value={customStartDate}
                                  onChange={(e) => setCustomStartDate(e.target.value)}
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="endDate">结束日期</Label>
                                <Input
                                  id="endDate"
                                  type="date"
                                  value={customEndDate}
                                  onChange={(e) => setCustomEndDate(e.target.value)}
                                  className="col-span-2 h-8"
                                />
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => {
                                if (customStartDate && customEndDate) {
                                  handleDateRangeChange("custom");
                                } else {
                                  toast.error("请选择开始和结束日期");
                                }
                              }}
                            >
                              应用
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* 筛选按钮 */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1.5"
                  onClick={() => setFilterDialogOpen(true)}
                >
                  <Filter className="w-4 h-4" />
                  筛选
                </Button>
                
                {/* 导出日报按钮 */}
                <Button 
                  size="sm" 
                  className="gap-1.5"
                  onClick={handleExport}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  导出日报
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            {filters.showRevenue && (
              <div className="grid grid-cols-2 gap-3">
                <KPICard
                  title="总营收"
                  value={kpiData.totalRevenue}
                  change={kpiData.revenueChange}
                  trend={kpiData.revenueChange >= 0 ? "up" : "down"}
                  icon={DollarSign}
                  glowColor="success"
                  isLoading={isLoading}
                />
                <KPICard
                  title="总毛利"
                  value={kpiData.grossProfit}
                  change={kpiData.profitChange}
                  trend={kpiData.profitChange >= 0 ? "up" : "down"}
                  icon={TrendingUp}
                  isLoading={isLoading}
                />
              </div>
            )}
            
            {filters.showProfit && (
              <div className="grid grid-cols-2 gap-3">
                <KPICard
                  title="订单数"
                  value={kpiData.totalOrders}
                  change={kpiData.ordersChange}
                  trend={kpiData.ordersChange >= 0 ? "up" : "down"}
                  icon={ShoppingCart}
                  format="number"
                  isLoading={isLoading}
                />
                <KPICard
                  title="毛利率"
                  value={kpiData.grossMargin}
                  change={kpiData.marginChange}
                  trend={kpiData.marginChange >= 0 ? "up" : "down"}
                  icon={Percent}
                  format="percent"
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 趋势图 */}
              {filters.showRevenue && trendsData.length > 0 && (
                <div className="data-card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">营收趋势</h3>
                    <Badge variant="secondary" className="text-xs">
                      {getDateRangeLabel(dateRange)}
                    </Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={trendsData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.65 0.2 250)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="oklch(0.65 0.2 250)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                      <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `${(v/10000).toFixed(0)}万`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" name="营收" stroke="oklch(0.65 0.2 250)" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* 费用分布饼图 */}
              {filters.showExpense && expenseData.length > 0 && (
                <div className="data-card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">费用分布</h3>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      查看详情
                    </Button>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="amount"
                        nameKey="category"
                      >
                        {expenseData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Alerts and Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 预警信息 */}
              <div className="data-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">实时预警</h3>
                  <Badge variant="destructive" className="text-xs">
                    {alertsData.filter((a: any) => a.type === "danger" || a.type === "warning").length} 待处理
                  </Badge>
                </div>
                <div className="space-y-3">
                  {alertsData.length > 0 ? (
                    alertsData.slice(0, 4).map((alert: any, index: number) => (
                      <AlertItem
                        key={index}
                        type={alert.type as "danger" | "warning" | "success"}
                        title={alert.title}
                        desc={alert.desc}
                        time={alert.time}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      暂无预警信息
                    </div>
                  )}
                </div>
              </div>

              {/* 最近交易 */}
              <div className="data-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">最近交易</h3>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    查看全部
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
                <div className="space-y-0">
                  {transactionsData.length > 0 ? (
                    transactionsData.slice(0, 5).map((tx: any, index: number) => (
                      <TransactionItem
                        key={index}
                        type={tx.type as "income" | "expense"}
                        desc={tx.desc}
                        amount={tx.amount}
                        time={tx.time}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      暂无交易记录
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 筛选弹窗 */}
      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
