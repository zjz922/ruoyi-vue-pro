import AppLayout from "@/components/AppLayout";
import {
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertCircle,
  FileText,
  Calculator,
  Percent,
  Scale,
  Bell,
  XCircle,
  Eye,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useTaxOverview, useTaxReport, useTaxAlertConfig } from "@/hooks/useLedger";
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

// ============ Mock Data ============

// 税务总览
const taxOverview = {
  comprehensiveTaxRate: 6.8,
  targetTaxRate: 7.0,
  totalTaxAmount: 185620,
  monthOverMonth: 0.3,
  riskLevel: "low",
  pendingDeclarations: 2,
};

// 税种构成
const taxComposition = [
  { name: "增值税", amount: 125800, rate: 4.2, percent: 67.8, color: "oklch(0.5 0.18 250)" },
  { name: "企业所得税", amount: 42500, rate: 1.8, percent: 22.9, color: "oklch(0.55 0.18 150)" },
  { name: "附加税", amount: 12580, rate: 0.5, percent: 6.8, color: "oklch(0.7 0.15 70)" },
  { name: "印花税", amount: 4740, rate: 0.3, percent: 2.5, color: "oklch(0.55 0.2 25)" },
];

// 税负率趋势
const taxRateTrend = [
  { month: "7月", rate: 6.2, target: 7.0 },
  { month: "8月", rate: 6.5, target: 7.0 },
  { month: "9月", rate: 7.2, target: 7.0 },
  { month: "10月", rate: 6.8, target: 7.0 },
  { month: "11月", rate: 6.5, target: 7.0 },
  { month: "12月", rate: 6.8, target: 7.0 },
];

// 风险预警
const riskAlerts = [
  { 
    id: "RISK001", 
    type: "warning", 
    title: "增值税税负率偏低", 
    desc: "当前增值税税负率4.2%，低于行业平均5.5%，可能引起税务关注", 
    time: "2小时前",
    status: "pending"
  },
  { 
    id: "RISK002", 
    type: "info", 
    title: "进项发票即将到期", 
    desc: "有3张进项发票将于15天内到期，请及时认证抵扣", 
    time: "5小时前",
    status: "pending"
  },
  { 
    id: "RISK003", 
    type: "success", 
    title: "季度申报已完成", 
    desc: "2025年Q4企业所得税预缴申报已成功提交", 
    time: "1天前",
    status: "resolved"
  },
  { 
    id: "RISK004", 
    type: "danger", 
    title: "发票异常预警", 
    desc: "检测到供应商XX公司发票存在风险，建议核实", 
    time: "2天前",
    status: "pending"
  },
];

// 申报日历
const declarationCalendar = [
  { tax: "增值税", period: "2026年1月", deadline: "2026-02-15", status: "pending", amount: 42500 },
  { tax: "企业所得税(预缴)", period: "2026年Q1", deadline: "2026-04-15", status: "upcoming", amount: null },
  { tax: "附加税", period: "2026年1月", deadline: "2026-02-15", status: "pending", amount: 4250 },
  { tax: "印花税", period: "2026年1月", deadline: "2026-02-28", status: "upcoming", amount: null },
];

// 发票统计
const invoiceStats = {
  outputTotal: 2856000,
  outputCount: 1256,
  inputTotal: 2125000,
  inputCount: 856,
  deductible: 1985000,
  unverified: 140000,
};

// 饼图数据
const pieChartData = taxComposition.map(tax => ({
  name: tax.name,
  value: tax.amount,
  fill: tax.color,
}));

// ============ Helper Functions ============
function formatCurrency(value: number): string {
  if (Math.abs(value) >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`;
  }
  return `¥${value.toLocaleString()}`;
}

// ============ Components ============

// 税务指标卡片
function TaxCard({ 
  title, 
  value, 
  unit,
  icon: Icon, 
  trend,
  trendValue,
  variant = "default",
  subtitle,
}: { 
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "danger";
  subtitle?: string;
}) {
  const variantStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  };

  return (
    <div className="data-card">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg", variantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && trendValue && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend === "down" ? "text-success" : "text-warning"
          )}>
            {trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold">
        {value}
        {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
      </p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

// 风险预警卡片
function RiskAlertCard({ alert }: { alert: typeof riskAlerts[0] }) {
  const typeStyles = {
    warning: { bg: "bg-warning/10", border: "border-warning/30", icon: AlertTriangle, iconColor: "text-warning" },
    info: { bg: "bg-primary/10", border: "border-primary/30", icon: AlertCircle, iconColor: "text-primary" },
    success: { bg: "bg-success/10", border: "border-success/30", icon: CheckCircle2, iconColor: "text-success" },
    danger: { bg: "bg-danger/10", border: "border-danger/30", icon: XCircle, iconColor: "text-danger" },
  };
  const style = typeStyles[alert.type as keyof typeof typeStyles];
  const Icon = style.icon;

  return (
    <div className={cn("p-4 rounded-lg border", style.bg, style.border)}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg", style.bg)}>
          <Icon className={cn("h-5 w-5", style.iconColor)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">{alert.title}</span>
            <span className="text-xs text-muted-foreground">{alert.time}</span>
          </div>
          <p className="text-sm text-muted-foreground">{alert.desc}</p>
          {alert.status === "pending" && (
            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" variant="outline">
                <Eye className="h-3 w-3 mr-1" />
                查看详情
              </Button>
              <Button size="sm" variant="ghost">
                忽略
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 申报状态徽章
function DeclarationStatusBadge({ status }: { status: string }) {
  const styles = {
    completed: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    upcoming: "bg-muted text-muted-foreground",
    overdue: "bg-danger/10 text-danger",
  };
  const labels = {
    completed: "已申报",
    pending: "待申报",
    upcoming: "未到期",
    overdue: "已逾期",
  };
  return (
    <Badge className={cn(styles[status as keyof typeof styles], "hover:opacity-80")}>
      {labels[status as keyof typeof labels]}
    </Badge>
  );
}

// ============ Main Component ============
export default function Tax() {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState("month");
  
  // 预警设置表单状态
  const [alertConfig, setAlertConfig] = useState({
    taxType: "vat",
    minRate: "4.0",
    maxRate: "8.0",
    enableAlert: true,
  });
  
  // 获取店铺信息
  const { currentShopId } = useShopSwitcher();
  
  // 获取税务概览数据
  const { data: taxData, isLoading: isLoadingTax, refetch: refetchTax } = useTaxOverview();
  
  // 导出税务报表
  const exportMutation = useTaxReport();
  
  // 预警配置
  const alertConfigMutation = useTaxAlertConfig();
  
  // 处理导出税务报表
  const handleExport = useCallback(async () => {
    try {
      const result = await exportMutation.mutateAsync({
        shopId: currentShopId || "",
        reportType: "monthly" as const,
        period: new Date().toISOString().slice(0, 7),
        format: "excel" as const,
      });
      toast.success("税务报表导出成功");
      const exportResult = result as { downloadUrl?: string };
      if (exportResult.downloadUrl) {
        window.open(exportResult.downloadUrl, "_blank");
      }
    } catch (error) {
      toast.error("导出失败，请重试");
    }
  }, [exportMutation, currentShopId]);
  
  // 处理保存预警设置
  const handleSaveAlertConfig = useCallback(async () => {
    try {
      await alertConfigMutation.mutateAsync({
        shopId: currentShopId || "",
        rules: [{
          type: alertConfig.taxType,
          enabled: alertConfig.enableAlert,
          threshold: parseFloat(alertConfig.minRate),
        }],
      });
      toast.success("预警设置已保存");
      setAlertDialogOpen(false);
    } catch (error) {
      toast.error("保存失败，请重试");
    }
  }, [alertConfigMutation, currentShopId, alertConfig]);
  
  return (
    <AppLayout>
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">税务管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            综合税负率 · 风险预警 · 申报管理
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[100px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季</SelectItem>
              <SelectItem value="year">本年</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAlertDialogOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            预警设置
          </Button>
          <Button 
            size="sm"
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            {exportMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            税务报表
          </Button>
        </div>
      </div>

      {/* 税务总览卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <TaxCard 
          title="综合税负率" 
          value={`${taxOverview.comprehensiveTaxRate}%`}
          icon={Percent}
          trend="up"
          trendValue="+0.3%"
          variant="success"
          subtitle={`目标 ≤ ${taxOverview.targetTaxRate}%`}
        />
        <TaxCard 
          title="本月应纳税额" 
          value={formatCurrency(taxOverview.totalTaxAmount)}
          icon={Calculator}
          variant="default"
        />
        <TaxCard 
          title="风险等级" 
          value="低风险"
          icon={Shield}
          variant="success"
        />
        <TaxCard 
          title="待申报事项" 
          value={taxOverview.pendingDeclarations}
          unit="项"
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* 税务分析 Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            税负分析
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            风险预警
            <Badge className="ml-1 bg-danger/10 text-danger text-xs px-1.5">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="declaration" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            申报管理
          </TabsTrigger>
          <TabsTrigger value="invoice" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            发票统计
          </TabsTrigger>
        </TabsList>

        {/* 税负分析 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 税种构成饼图 */}
            <div className="data-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">税种构成</h3>
                <Badge variant="outline">本月</Badge>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 税种明细 */}
            <div className="data-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">税种明细</h3>
                <Badge className="bg-success/10 text-success">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  税负正常
                </Badge>
              </div>
              <div className="space-y-4">
                {taxComposition.map((tax, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: tax.color }}
                        />
                        <span className="font-medium">{tax.name}</span>
                      </div>
                      <Badge variant="outline">{tax.percent}%</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">应纳税额</p>
                        <p className="font-semibold">{formatCurrency(tax.amount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">税负率</p>
                        <p className="font-semibold">{tax.rate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 税负率趋势 */}
          <div className="data-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">综合税负率趋势</h3>
              <Badge variant="outline">近6个月</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={taxRateTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 250)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 250)" domain={[5, 8]} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value}%`, name === "rate" ? "实际税负率" : "目标税负率"]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid oklch(0.9 0.01 250)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <ReferenceLine y={7} stroke="oklch(0.7 0.15 70)" strokeDasharray="5 5" label="目标" />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    name="实际税负率"
                    stroke="oklch(0.5 0.18 250)" 
                    fill="oklch(0.5 0.18 250 / 0.2)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* 风险预警 */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="data-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">风险预警列表</h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-danger/10 text-danger">高风险 1</Badge>
                <Badge className="bg-warning/10 text-warning">中风险 1</Badge>
                <Badge className="bg-primary/10 text-primary">提醒 1</Badge>
              </div>
            </div>
            <div className="space-y-4">
              {riskAlerts.map((alert) => (
                <RiskAlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 申报管理 */}
        <TabsContent value="declaration" className="data-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">申报日历</h3>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              查看完整日历
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-4 py-3 px-4 bg-muted/50 text-sm font-medium">
              <div>税种</div>
              <div>所属期</div>
              <div>申报截止</div>
              <div className="text-right">预计税额</div>
              <div className="text-center">状态</div>
            </div>
            {declarationCalendar.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 py-3 px-4 border-b border-border/50 text-sm items-center">
                <div className="font-medium">{item.tax}</div>
                <div className="text-muted-foreground">{item.period}</div>
                <div>{item.deadline}</div>
                <div className="text-right">
                  {item.amount ? formatCurrency(item.amount) : "-"}
                </div>
                <div className="text-center">
                  <DeclarationStatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
            <div className="p-4 bg-warning/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">待申报</p>
              <p className="text-xl font-bold text-warning">2项</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">本月预计税额</p>
              <p className="text-xl font-bold">{formatCurrency(46750)}</p>
            </div>
            <div className="p-4 bg-success/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">已完成</p>
              <p className="text-xl font-bold text-success">12项</p>
            </div>
          </div>
        </TabsContent>

        {/* 发票统计 */}
        <TabsContent value="invoice" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 销项发票 */}
            <div className="data-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">销项发票</h3>
                <Badge variant="outline">本月</Badge>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">开票总额</span>
                    <span className="text-2xl font-bold">{formatCurrency(invoiceStats.outputTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">开票数量</span>
                    <span className="font-medium">{invoiceStats.outputCount} 张</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">增值税专票</p>
                    <p className="font-semibold">{formatCurrency(1856000)}</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">增值税普票</p>
                    <p className="font-semibold">{formatCurrency(1000000)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 进项发票 */}
            <div className="data-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">进项发票</h3>
                <Badge variant="outline">本月</Badge>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-success/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">收票总额</span>
                    <span className="text-2xl font-bold">{formatCurrency(invoiceStats.inputTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">收票数量</span>
                    <span className="font-medium">{invoiceStats.inputCount} 张</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">已认证抵扣</p>
                    <p className="font-semibold text-success">{formatCurrency(invoiceStats.deductible)}</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">待认证</p>
                    <p className="font-semibold text-warning">{formatCurrency(invoiceStats.unverified)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 进销项对比 */}
          <div className="data-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">进销项对比</h3>
              <Badge className="bg-success/10 text-success">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                进销匹配正常
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">销项税额</p>
                <p className="text-xl font-bold">{formatCurrency(371280)}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">进项税额</p>
                <p className="text-xl font-bold">{formatCurrency(245480)}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">应纳增值税</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(125800)}</p>
              </div>
              <div className="p-4 bg-success/10 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">进销比</p>
                <p className="text-xl font-bold text-success">66.1%</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* 预警设置对话框 */}
      <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>税务预警设置</DialogTitle>
            <DialogDescription>
              设置税负率预警阈值，当税负率超出范围时自动预警
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taxType" className="text-right">税种</Label>
              <Select 
                value={alertConfig.taxType} 
                onValueChange={(value) => setAlertConfig({...alertConfig, taxType: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择税种" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vat">增值税</SelectItem>
                  <SelectItem value="corporate">企业所得税</SelectItem>
                  <SelectItem value="additional">附加税</SelectItem>
                  <SelectItem value="stamp">印花税</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minRate" className="text-right">最低税负率</Label>
              <Input
                id="minRate"
                type="number"
                step="0.1"
                placeholder="输入最低税负率"
                className="col-span-3"
                value={alertConfig.minRate}
                onChange={(e) => setAlertConfig({...alertConfig, minRate: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxRate" className="text-right">最高税负率</Label>
              <Input
                id="maxRate"
                type="number"
                step="0.1"
                placeholder="输入最高税负率"
                className="col-span-3"
                value={alertConfig.maxRate}
                onChange={(e) => setAlertConfig({...alertConfig, maxRate: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">启用预警</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableAlert"
                  checked={alertConfig.enableAlert}
                  onChange={(e) => setAlertConfig({...alertConfig, enableAlert: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="enableAlert" className="text-sm">开启税负率异常预警</label>
              </div>
            </div>
            <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
              <p>当税负率低于最低阈值或高于最高阈值时，系统将自动发送预警通知。</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAlertDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveAlertConfig} disabled={alertConfigMutation.isPending}>
              {alertConfigMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              保存设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AppLayout>
  );
}
