import AppLayout from "@/components/AppLayout";
import {
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Settings,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Target,
  Percent,
  CreditCard,
  Truck,
  Megaphone,
  Users,
  Building,
  Package,
  Eye,
  Bell,
  Lightbulb,
  ChevronRight,
  Activity,
  Layers,
  FileText,
  AlertCircle,
  Zap,
  Store,
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { baseData, expenseCenterData } from "@/data/reconciliationConfig";
import { useExpenseOverview, useExpenseExport, useExpenseCreate, useExpenseBudget } from "@/hooks/useLedger";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// ============ 基于勾稽配置的费用数据 ============

// 费用总览 - 勾稽订单统计数据
const totalExpenseAmount = baseData.expenses.promotion + baseData.expenses.express + 
                          baseData.expenses.commission + baseData.expenses.service + 
                          baseData.expenses.other + baseData.expenses.insurance + baseData.expenses.payout;

const expenseOverview = {
  totalExpense: Math.round(totalExpenseAmount),  // 勾稽：费用总额
  budgetTotal: 320000,
  budgetUsed: parseFloat((totalExpenseAmount / 320000 * 100).toFixed(1)),
  monthOverMonth: -5.2,
  topCategory: "推广费用",
  topCategoryPercent: (baseData.expenses.promotion / totalExpenseAmount * 100).toFixed(1),
  abnormalCount: 3,
  pendingApproval: 8,
};

// 费用分类 - 勾稽订单统计数据
const expenseCategories = [
  { 
    category: "推广费用", 
    amount: Math.round(baseData.expenses.promotion),  // 勾稽：推广费
    budget: 200000, 
    percent: (baseData.expenses.promotion / totalExpenseAmount * 100).toFixed(1), 
    icon: Megaphone, 
    color: "#3b82f6" 
  },
  { 
    category: "物流费用", 
    amount: Math.round(baseData.expenses.express),  // 勾稽：快递费
    budget: 50000, 
    percent: (baseData.expenses.express / totalExpenseAmount * 100).toFixed(1), 
    icon: Truck, 
    color: "#22c55e" 
  },
  { 
    category: "达人佣金", 
    amount: Math.round(baseData.expenses.commission),  // 勾稽：达人佣金
    budget: 50000, 
    percent: (baseData.expenses.commission / totalExpenseAmount * 100).toFixed(1), 
    icon: Users, 
    color: "#f59e0b" 
  },
  { 
    category: "平台服务费", 
    amount: Math.round(baseData.expenses.service),  // 勾稽：服务费
    budget: 15000, 
    percent: (baseData.expenses.service / totalExpenseAmount * 100).toFixed(1), 
    icon: CreditCard, 
    color: "#ef4444" 
  },
  { 
    category: "保险费", 
    amount: Math.round(baseData.expenses.insurance),  // 勾稽：保险费
    budget: 3000, 
    percent: (baseData.expenses.insurance / totalExpenseAmount * 100).toFixed(1), 
    icon: Package, 
    color: "#8b5cf6" 
  },
  { 
    category: "其他费用", 
    amount: Math.round(baseData.expenses.other + baseData.expenses.payout),  // 勾稽：其他+赔付
    budget: 2000, 
    percent: ((baseData.expenses.other + baseData.expenses.payout) / totalExpenseAmount * 100).toFixed(1), 
    icon: Building, 
    color: "#6b7280" 
  },
];

// 多维度费用分摊 - 按店铺
const expenseByShop = [
  { shop: "旗舰店", allocated: 125800, percent: 44.0, orders: 3256, perOrder: 38.6, profit: 156200 },
  { shop: "专营店A", allocated: 72300, percent: 25.3, orders: 1856, perOrder: 39.0, profit: 89500 },
  { shop: "专营店B", allocated: 52420, percent: 18.4, orders: 1425, perOrder: 36.8, profit: 67800 },
  { shop: "工厂店", allocated: 35120, percent: 12.3, orders: 1185, perOrder: 29.6, profit: 52300 },
];

// 多维度费用分摊 - 按商品类目
const expenseByCategory = [
  { category: "女装", allocated: 98500, percent: 34.5, sales: 356000, expenseRate: 27.7 },
  { category: "男装", allocated: 72300, percent: 25.3, sales: 285000, expenseRate: 25.4 },
  { category: "童装", allocated: 58420, percent: 20.4, sales: 198000, expenseRate: 29.5 },
  { category: "配饰", allocated: 35680, percent: 12.5, sales: 156000, expenseRate: 22.9 },
  { category: "鞋类", allocated: 20740, percent: 7.3, sales: 125000, expenseRate: 16.6 },
];

// 多维度费用分摊 - 按渠道
const expenseByChannel = [
  { channel: "抖音直播", allocated: 112500, percent: 39.4, roi: 3.2, trend: "up" },
  { channel: "抖音商城", allocated: 68200, percent: 23.9, roi: 4.5, trend: "up" },
  { channel: "达人带货", allocated: 52800, percent: 18.5, roi: 2.8, trend: "down" },
  { channel: "短视频引流", allocated: 32140, percent: 11.2, roi: 3.8, trend: "stable" },
  { channel: "搜索推广", allocated: 20000, percent: 7.0, roi: 4.2, trend: "up" },
];

// 预算预警
const budgetAlerts = [
  { 
    id: 1,
    category: "推广费用",
    budget: 100000,
    used: 92850,
    usedPercent: 92.9,
    remaining: 7150,
    daysRemaining: 20,
    dailyAvg: 4642,
    predictedOverrun: 85690,
    level: "danger",
    suggestion: "当前日均消耗4,642元，预计月底将超支8.5万元，建议立即控制投放预算"
  },
  { 
    id: 2,
    category: "物流费用",
    budget: 75000,
    used: 68420,
    usedPercent: 91.2,
    remaining: 6580,
    daysRemaining: 20,
    dailyAvg: 3421,
    predictedOverrun: 61840,
    level: "warning",
    suggestion: "物流费用接近预算上限，建议优化物流渠道或与快递公司协商降价"
  },
  { 
    id: 3,
    category: "平台扣点",
    budget: 55000,
    used: 52680,
    usedPercent: 95.8,
    remaining: 2320,
    daysRemaining: 20,
    dailyAvg: 2634,
    predictedOverrun: 50360,
    level: "danger",
    suggestion: "平台扣点已接近预算，与销售额直接相关，建议关注销售节奏"
  },
];

// 费用异常检测
const expenseAnomalies = [
  {
    id: 1,
    date: "2026-01-10",
    type: "单笔异常",
    category: "推广费用",
    desc: "巨量千川投放-女装专场",
    amount: 25800,
    avgAmount: 8500,
    deviation: 203.5,
    status: "pending",
    reason: "双十二大促期间加大投放"
  },
  {
    id: 2,
    date: "2026-01-08",
    type: "频次异常",
    category: "物流费用",
    desc: "极兔快递-紧急补发",
    amount: 5680,
    avgAmount: 2100,
    deviation: 170.5,
    status: "confirmed",
    reason: "售后补发订单集中处理"
  },
  {
    id: 3,
    date: "2026-01-06",
    type: "趋势异常",
    category: "达人佣金",
    desc: "达人合作-李XX",
    amount: 35000,
    avgAmount: 15000,
    deviation: 133.3,
    status: "pending",
    reason: "新签约头部达人首次合作"
  },
];

// 费用明细
const expenseDetails = [
  { id: "EXP001", date: "2026-01-11", category: "推广费用", desc: "巨量千川投放-女装", amount: 15800, shop: "旗舰店", channel: "抖音直播", status: "approved" },
  { id: "EXP002", date: "2026-01-11", category: "物流费用", desc: "极兔快递-1月上旬结算", amount: 12580, shop: "全部", channel: "-", status: "approved" },
  { id: "EXP003", date: "2026-01-10", category: "平台扣点", desc: "技术服务费扣除", amount: 8650, shop: "全部", channel: "-", status: "approved" },
  { id: "EXP004", date: "2026-01-10", category: "推广费用", desc: "达人合作-李XX", amount: 25000, shop: "旗舰店", channel: "达人带货", status: "pending" },
  { id: "EXP005", date: "2026-01-09", category: "仓储费用", desc: "仓库租金-1月", amount: 8500, shop: "全部", channel: "-", status: "approved" },
  { id: "EXP006", date: "2026-01-09", category: "人工成本", desc: "客服工资-1月", amount: 18500, shop: "全部", channel: "-", status: "approved" },
  { id: "EXP007", date: "2026-01-08", category: "推广费用", desc: "短视频制作费", amount: 6800, shop: "旗舰店", channel: "短视频引流", status: "approved" },
];

// 预算执行趋势
const budgetTrend = [
  { month: "7月", budget: 300000, actual: 285000, rate: 95.0 },
  { month: "8月", budget: 310000, actual: 298500, rate: 96.3 },
  { month: "9月", budget: 305000, actual: 312000, rate: 102.3 },
  { month: "10月", budget: 315000, actual: 295600, rate: 93.8 },
  { month: "11月", budget: 320000, actual: 301200, rate: 94.1 },
  { month: "12月", budget: 320000, actual: 285640, rate: 89.3 },
];

// ============ Helper Functions ============
function formatCurrency(value: number): string {
  if (Math.abs(value) >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`;
  }
  return `¥${value.toLocaleString()}`;
}

// ============ Main Component ============
export default function Expense() {
  const [activeTab, setActiveTab] = useState("overview");
  const [allocationDimension, setAllocationDimension] = useState<"shop" | "category" | "channel">("shop");
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState("month");
  
  // 新费用录入表单状态
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
  });
  
  // 预算设置表单状态
  const [budgetConfig, setBudgetConfig] = useState({
    category: "",
    monthlyBudget: "",
    warningThreshold: "80",
  });
  
  // 获取店铺信息
  const { currentShopId } = useShopSwitcher();
  
  // 获取费用概览数据
  const { data: expenseData, isLoading: isLoadingExpense, refetch: refetchExpense } = useExpenseOverview();
  
  // 导出报表
  const exportMutation = useExpenseExport();
  
  // 创建费用
  const createExpenseMutation = useExpenseCreate();
  
  // 预算配置
  const budgetConfigMutation = useExpenseBudget();
  
  // 处理导出报表
  const handleExport = useCallback(async () => {
    try {
      const result = await exportMutation.mutateAsync({
        shopId: currentShopId || "",
        month: new Date().toISOString().slice(0, 7),
        format: "excel" as const,
      });
      toast.success("报表导出成功");
      const exportResult = result as { downloadUrl?: string };
      if (exportResult.downloadUrl) {
        window.open(exportResult.downloadUrl, "_blank");
      }
    } catch (error) {
      toast.error("导出失败，请重试");
    }
  }, [exportMutation, currentShopId]);
  
  // 处理录入费用
  const handleCreateExpense = useCallback(async () => {
    if (!newExpense.category || !newExpense.amount) {
      toast.error("请填写必要信息");
      return;
    }
    try {
      await createExpenseMutation.mutateAsync({
        shopId: currentShopId || "",
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        desc: newExpense.description,
        date: newExpense.date,
      });
      toast.success("费用录入成功");
      setExpenseDialogOpen(false);
      setNewExpense({ category: "", amount: "", description: "", date: new Date().toISOString().split('T')[0] });
      refetchExpense();
    } catch (error) {
      toast.error("录入失败，请重试");
    }
  }, [createExpenseMutation, currentShopId, newExpense, refetchExpense]);
  
  // 处理预算设置
  const handleSaveBudget = useCallback(async () => {
    if (!budgetConfig.category || !budgetConfig.monthlyBudget) {
      toast.error("请填写必要信息");
      return;
    }
    try {
      await budgetConfigMutation.mutateAsync({
        shopId: currentShopId || "",
        month: new Date().toISOString().slice(0, 7),
        budgets: [{
          category: budgetConfig.category,
          amount: parseFloat(budgetConfig.monthlyBudget),
        }],
      });
      toast.success("预算设置已保存");
      setBudgetDialogOpen(false);
    } catch (error) {
      toast.error("保存失败，请重试");
    }
  }, [budgetConfigMutation, currentShopId, budgetConfig]);

  return (
    <AppLayout>
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">费用中心</h1>
          <p className="text-sm text-muted-foreground mt-1">
            多维度费用分摊 · 预算预警 · 异常检测
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[100px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季</SelectItem>
              <SelectItem value="year">本年</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setBudgetDialogOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            预算设置
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            {exportMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            导出报表
          </Button>
          <Button 
            size="sm"
            onClick={() => setExpenseDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            录入费用
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[700px]">
          <TabsTrigger value="overview">费用总览</TabsTrigger>
          <TabsTrigger value="allocation">多维度分摊</TabsTrigger>
          <TabsTrigger value="budget">预算预警</TabsTrigger>
          <TabsTrigger value="anomaly">异常检测</TabsTrigger>
          <TabsTrigger value="details">费用明细</TabsTrigger>
        </TabsList>

        {/* 费用总览 Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* 费用指标卡片 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-primary" />
                  本月总费用
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{formatCurrency(expenseOverview.totalExpense)}</div>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <TrendingDown className="w-3 h-3 text-success" />
                  <span>较上月 <span className="text-success">{expenseOverview.monthOverMonth}%</span></span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  预算使用率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expenseOverview.budgetUsed}%</div>
                <Progress value={expenseOverview.budgetUsed} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">预算 {formatCurrency(expenseOverview.budgetTotal)}</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-danger">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-danger" />
                  异常费用
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-danger">{expenseOverview.abnormalCount} <span className="text-sm font-normal text-muted-foreground">笔</span></div>
                <p className="text-xs text-muted-foreground mt-2">需要确认处理</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-warning">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-warning" />
                  待审批
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{expenseOverview.pendingApproval} <span className="text-sm font-normal text-muted-foreground">笔</span></div>
                <p className="text-xs text-muted-foreground mt-2">等待审批通过</p>
              </CardContent>
            </Card>
          </div>

          {/* 费用分类构成 */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">费用分类构成</CardTitle>
                <CardDescription>各类费用占比及预算执行情况</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {expenseCategories.map((cat, index) => {
                  const Icon = cat.icon;
                  const usagePercent = (cat.amount / cat.budget) * 100;
                  const isOverBudget = usagePercent > 90;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded" style={{ backgroundColor: `${cat.color}20` }}>
                            <Icon className="w-4 h-4" style={{ color: cat.color }} />
                          </div>
                          <span className="text-sm font-medium">{cat.category}</span>
                        </div>
                        <span className="font-bold">{formatCurrency(cat.amount)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={Math.min(usagePercent, 100)} 
                          className={cn(
                            "h-2 flex-1",
                            isOverBudget && "[&>div]:bg-danger"
                          )} 
                        />
                        <span className={cn(
                          "text-xs w-12 text-right",
                          isOverBudget ? "text-danger" : "text-muted-foreground"
                        )}>{usagePercent.toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* 预算执行趋势 */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">预算执行趋势</CardTitle>
                <CardDescription>近6个月预算执行率</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetTrend.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.month}</span>
                        <span className={cn(
                          "font-medium",
                          item.rate > 100 ? "text-danger" : item.rate > 95 ? "text-warning" : "text-success"
                        )}>{item.rate}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={Math.min(item.rate, 100)} 
                          className={cn(
                            "h-2 flex-1",
                            item.rate > 100 && "[&>div]:bg-danger",
                            item.rate > 95 && item.rate <= 100 && "[&>div]:bg-warning"
                          )} 
                        />
                        <span className="text-xs text-muted-foreground w-20 text-right">
                          {formatCurrency(item.actual)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 多维度分摊 Tab */}
        <TabsContent value="allocation" className="space-y-6">
          {/* 维度切换 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">分摊维度：</span>
            <Button 
              variant={allocationDimension === "shop" ? "default" : "outline"} 
              size="sm"
              onClick={() => setAllocationDimension("shop")}
            >
              <Store className="w-4 h-4 mr-2" />
              按店铺
            </Button>
            <Button 
              variant={allocationDimension === "category" ? "default" : "outline"} 
              size="sm"
              onClick={() => setAllocationDimension("category")}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              按类目
            </Button>
            <Button 
              variant={allocationDimension === "channel" ? "default" : "outline"} 
              size="sm"
              onClick={() => setAllocationDimension("channel")}
            >
              <Layers className="w-4 h-4 mr-2" />
              按渠道
            </Button>
          </div>

          {/* 按店铺分摊 */}
          {allocationDimension === "shop" && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>按店铺费用分摊</CardTitle>
                <CardDescription>各店铺费用分摊及单均费用分析</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>店铺名称</TableHead>
                      <TableHead className="text-right">分摊费用</TableHead>
                      <TableHead className="text-right">占比</TableHead>
                      <TableHead className="text-right">订单数</TableHead>
                      <TableHead className="text-right">单均费用</TableHead>
                      <TableHead className="text-right">店铺利润</TableHead>
                      <TableHead className="text-right">费利比</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseByShop.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.shop}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.allocated)}</TableCell>
                        <TableCell className="text-right">{item.percent}%</TableCell>
                        <TableCell className="text-right">{item.orders.toLocaleString()}</TableCell>
                        <TableCell className="text-right">¥{item.perOrder.toFixed(1)}</TableCell>
                        <TableCell className="text-right text-success">{formatCurrency(item.profit)}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={cn(
                            (item.allocated / item.profit) < 0.8 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                          )}>
                            {((item.allocated / item.profit) * 100).toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* 按类目分摊 */}
          {allocationDimension === "category" && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>按商品类目费用分摊</CardTitle>
                <CardDescription>各类目费用分摊及费销比分析</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>商品类目</TableHead>
                      <TableHead className="text-right">分摊费用</TableHead>
                      <TableHead className="text-right">占比</TableHead>
                      <TableHead className="text-right">销售额</TableHead>
                      <TableHead className="text-right">费销比</TableHead>
                      <TableHead className="text-right">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseByCategory.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.allocated)}</TableCell>
                        <TableCell className="text-right">{item.percent}%</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.sales)}</TableCell>
                        <TableCell className="text-right">{item.expenseRate}%</TableCell>
                        <TableCell className="text-right">
                          <Badge className={cn(
                            item.expenseRate < 25 ? "bg-success/10 text-success" : 
                            item.expenseRate < 30 ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                          )}>
                            {item.expenseRate < 25 ? "健康" : item.expenseRate < 30 ? "关注" : "预警"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* 按渠道分摊 */}
          {allocationDimension === "channel" && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>按推广渠道费用分摊</CardTitle>
                <CardDescription>各渠道费用投入及ROI分析</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>推广渠道</TableHead>
                      <TableHead className="text-right">分摊费用</TableHead>
                      <TableHead className="text-right">占比</TableHead>
                      <TableHead className="text-right">ROI</TableHead>
                      <TableHead className="text-right">趋势</TableHead>
                      <TableHead className="text-right">建议</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseByChannel.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.channel}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.allocated)}</TableCell>
                        <TableCell className="text-right">{item.percent}%</TableCell>
                        <TableCell className="text-right">
                          <Badge className={cn(
                            item.roi >= 4 ? "bg-success/10 text-success" : 
                            item.roi >= 3 ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                          )}>
                            {item.roi}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className={cn(
                            "flex items-center justify-end gap-1",
                            item.trend === "up" ? "text-success" : 
                            item.trend === "down" ? "text-danger" : "text-muted-foreground"
                          )}>
                            {item.trend === "up" ? <TrendingUp className="w-4 h-4" /> : 
                             item.trend === "down" ? <TrendingDown className="w-4 h-4" /> : 
                             <Activity className="w-4 h-4" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Lightbulb className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 预算预警 Tab */}
        <TabsContent value="budget" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-sm border-l-4 border-l-danger">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">高风险预警</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-danger">2</div>
                <p className="text-xs text-muted-foreground mt-1">预计超支类目</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-l-warning">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">中风险预警</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">1</div>
                <p className="text-xs text-muted-foreground mt-1">接近预算上限</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-l-success">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">预算健康</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">3</div>
                <p className="text-xs text-muted-foreground mt-1">执行正常类目</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>预算预警详情</CardTitle>
              <CardDescription>基于当前消耗速度预测的预算执行风险</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetAlerts.map((alert) => (
                  <div key={alert.id} className={cn(
                    "p-4 rounded-lg border",
                    alert.level === 'danger' ? 'border-danger/50 bg-danger/5' : 'border-warning/50 bg-warning/5'
                  )}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          alert.level === 'danger' ? 'bg-danger/10' : 'bg-warning/10'
                        )}>
                          <AlertTriangle className={cn(
                            "w-5 h-5",
                            alert.level === 'danger' ? 'text-danger' : 'text-warning'
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{alert.category}</span>
                            <Badge variant="outline" className={cn(
                              alert.level === 'danger' ? 'border-danger text-danger' : 'border-warning text-warning'
                            )}>
                              {alert.level === 'danger' ? '高风险' : '中风险'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">已使用</p>
                              <p className="font-bold">{formatCurrency(alert.used)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">预算总额</p>
                              <p className="font-bold">{formatCurrency(alert.budget)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">日均消耗</p>
                              <p className="font-bold">¥{alert.dailyAvg.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">预计超支</p>
                              <p className="font-bold text-danger">{formatCurrency(alert.predictedOverrun)}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Progress value={alert.usedPercent} className={cn(
                              "h-2",
                              alert.level === 'danger' && "[&>div]:bg-danger"
                            )} />
                          </div>
                          <div className="flex items-start gap-2 mt-3 p-2 bg-muted/50 rounded">
                            <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground">{alert.suggestion}</p>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">调整预算</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 异常检测 Tab */}
        <TabsContent value="anomaly" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">待确认异常</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-danger">2</div>
                <p className="text-xs text-muted-foreground mt-1">需要人工确认</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">已确认异常</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">1</div>
                <p className="text-xs text-muted-foreground mt-1">已标记原因</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">异常金额</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">¥66,480</div>
                <p className="text-xs text-muted-foreground mt-1">本月异常费用总额</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>费用异常检测</CardTitle>
              <CardDescription>基于历史数据的异常费用自动识别</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>异常类型</TableHead>
                    <TableHead>费用类别</TableHead>
                    <TableHead>费用描述</TableHead>
                    <TableHead className="text-right">异常金额</TableHead>
                    <TableHead className="text-right">历史均值</TableHead>
                    <TableHead className="text-right">偏离度</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseAnomalies.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type}</Badge>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{item.desc}</TableCell>
                      <TableCell className="text-right font-bold text-danger">¥{item.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-muted-foreground">¥{item.avgAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-danger/10 text-danger">+{item.deviation}%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          item.status === 'confirmed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        )}>
                          {item.status === 'confirmed' ? '已确认' : '待确认'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {item.status === 'pending' && (
                            <Button variant="ghost" size="sm">
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 费用明细 Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>费用明细</CardTitle>
                  <CardDescription>所有费用记录的详细列表</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="搜索费用..." className="w-64" />
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    筛选
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    导出
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>费用编号</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>费用类别</TableHead>
                    <TableHead>费用描述</TableHead>
                    <TableHead>店铺</TableHead>
                    <TableHead>渠道</TableHead>
                    <TableHead className="text-right">金额</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseDetails.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{item.desc}</TableCell>
                      <TableCell>{item.shop}</TableCell>
                      <TableCell>{item.channel}</TableCell>
                      <TableCell className="text-right font-bold">¥{item.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          item.status === 'approved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        )}>
                          {item.status === 'approved' ? '已审批' : '待审批'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 费用录入对话框 */}
      <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>录入费用</DialogTitle>
            <DialogDescription>
              添加新的费用记录
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expenseCategory" className="text-right">费用类别</Label>
              <Select 
                value={newExpense.category} 
                onValueChange={(value) => setNewExpense({...newExpense, category: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择费用类别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotion">推广费用</SelectItem>
                  <SelectItem value="logistics">物流费用</SelectItem>
                  <SelectItem value="commission">达人佣金</SelectItem>
                  <SelectItem value="platform">平台服务费</SelectItem>
                  <SelectItem value="storage">仓储费用</SelectItem>
                  <SelectItem value="labor">人工成本</SelectItem>
                  <SelectItem value="other">其他费用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expenseAmount" className="text-right">金额</Label>
              <Input
                id="expenseAmount"
                type="number"
                placeholder="输入金额"
                className="col-span-3"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expenseDate" className="text-right">日期</Label>
              <Input
                id="expenseDate"
                type="date"
                className="col-span-3"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expenseDesc" className="text-right">描述</Label>
              <Input
                id="expenseDesc"
                placeholder="费用描述"
                className="col-span-3"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpenseDialogOpen(false)}>取消</Button>
            <Button onClick={handleCreateExpense} disabled={createExpenseMutation.isPending}>
              {createExpenseMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              提交
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 预算设置对话框 */}
      <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>预算设置</DialogTitle>
            <DialogDescription>
              设置各类别的月度预算和预警阈值
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budgetCategory" className="text-right">费用类别</Label>
              <Select 
                value={budgetConfig.category} 
                onValueChange={(value) => setBudgetConfig({...budgetConfig, category: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择费用类别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotion">推广费用</SelectItem>
                  <SelectItem value="logistics">物流费用</SelectItem>
                  <SelectItem value="commission">达人佣金</SelectItem>
                  <SelectItem value="platform">平台服务费</SelectItem>
                  <SelectItem value="storage">仓储费用</SelectItem>
                  <SelectItem value="labor">人工成本</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="monthlyBudget" className="text-right">月度预算</Label>
              <Input
                id="monthlyBudget"
                type="number"
                placeholder="输入预算金额"
                className="col-span-3"
                value={budgetConfig.monthlyBudget}
                onChange={(e) => setBudgetConfig({...budgetConfig, monthlyBudget: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="warningThreshold" className="text-right">预警阈值</Label>
              <Select 
                value={budgetConfig.warningThreshold} 
                onValueChange={(value) => setBudgetConfig({...budgetConfig, warningThreshold: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="70">70%</SelectItem>
                  <SelectItem value="80">80%</SelectItem>
                  <SelectItem value="90">90%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBudgetDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveBudget} disabled={budgetConfigMutation.isPending}>
              {budgetConfigMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              保存设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AppLayout>
  );
}
