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
  Loader2,
  RefreshCw,
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
import { useState, useCallback, useMemo } from "react";
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

// ============ 类型定义 ============

interface TaxOverviewData {
  comprehensiveTaxRate: number;
  targetTaxRate: number;
  totalTaxAmount: number;
  monthOverMonth: number;
  riskLevel: "low" | "medium" | "high";
  pendingDeclarations: number;
}

interface TaxCompositionItem {
  name: string;
  amount: number;
  rate: number;
  percent: number;
  color: string;
}

interface TaxRateTrendItem {
  month: string;
  rate: number;
  target: number;
}

interface RiskAlert {
  id: string;
  type: "warning" | "info" | "success" | "danger";
  title: string;
  desc: string;
  time: string;
  status: "pending" | "resolved";
}

interface DeclarationItem {
  tax: string;
  period: string;
  deadline: string;
  status: "completed" | "pending" | "upcoming" | "overdue";
  amount: number | null;
}

interface InvoiceStats {
  outputTotal: number;
  outputCount: number;
  inputTotal: number;
  inputCount: number;
  deductible: number;
  unverified: number;
}

// ============ Helper Functions ============
function formatCurrency(value: number): string {
  if (Math.abs(value) >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`;
  }
  return `¥${value.toLocaleString()}`;
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
function RiskAlertCard({ alert }: { alert: RiskAlert }) {
  const typeStyles = {
    warning: { bg: "bg-warning/10", border: "border-warning/30", icon: AlertTriangle, iconColor: "text-warning" },
    info: { bg: "bg-primary/10", border: "border-primary/30", icon: AlertCircle, iconColor: "text-primary" },
    success: { bg: "bg-success/10", border: "border-success/30", icon: CheckCircle2, iconColor: "text-success" },
    danger: { bg: "bg-danger/10", border: "border-danger/30", icon: XCircle, iconColor: "text-danger" },
  };
  const style = typeStyles[alert.type];
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
  const { 
    data: taxData, 
    isLoading: isLoadingTax, 
    error: taxError,
    refetch: refetchTax 
  } = useTaxOverview();
  
  // 导出税务报表
  const exportMutation = useTaxReport();
  
  // 预警配置
  const alertConfigMutation = useTaxAlertConfig();

  // 定义API响应类型
  type TaxDataType = {
    overview?: TaxOverviewData;
    composition?: TaxCompositionItem[];
    rateTrend?: TaxRateTrendItem[];
    riskAlerts?: RiskAlert[];
    declarations?: DeclarationItem[];
    invoiceStats?: InvoiceStats;
  };

  // 类型断言
  const typedTaxData = taxData as TaxDataType | undefined;

  // 从API响应中提取数据
  const taxOverview = useMemo<TaxOverviewData>(() => {
    if (typedTaxData?.overview) {
      return typedTaxData.overview;
    }
    return {
      comprehensiveTaxRate: 0,
      targetTaxRate: 7.0,
      totalTaxAmount: 0,
      monthOverMonth: 0,
      riskLevel: "low" as const,
      pendingDeclarations: 0,
    };
  }, [typedTaxData]);

  const taxComposition = useMemo<TaxCompositionItem[]>(() => {
    if (typedTaxData?.composition) {
      return typedTaxData.composition;
    }
    return [];
  }, [typedTaxData]);

  const taxRateTrend = useMemo<TaxRateTrendItem[]>(() => {
    if (typedTaxData?.rateTrend) {
      return typedTaxData.rateTrend;
    }
    return [];
  }, [typedTaxData]);

  const riskAlerts = useMemo<RiskAlert[]>(() => {
    if (typedTaxData?.riskAlerts) {
      return typedTaxData.riskAlerts;
    }
    return [];
  }, [typedTaxData]);

  const declarationCalendar = useMemo<DeclarationItem[]>(() => {
    if (typedTaxData?.declarations) {
      return typedTaxData.declarations;
    }
    return [];
  }, [typedTaxData]);

  const invoiceStats = useMemo<InvoiceStats>(() => {
    if (typedTaxData?.invoiceStats) {
      return typedTaxData.invoiceStats;
    }
    return {
      outputTotal: 0,
      outputCount: 0,
      inputTotal: 0,
      inputCount: 0,
      deductible: 0,
      unverified: 0,
    };
  }, [typedTaxData]);

  // 饼图数据
  const pieChartData = useMemo(() => {
    return taxComposition.map(tax => ({
      name: tax.name,
      value: tax.amount,
      fill: tax.color,
    }));
  }, [taxComposition]);

  // 检查是否有数据
  const hasOverviewData = taxOverview.totalTaxAmount > 0;
  const hasCompositionData = taxComposition.length > 0;
  const hasRateTrendData = taxRateTrend.length > 0;
  const hasAlertsData = riskAlerts.length > 0;
  const hasDeclarationData = declarationCalendar.length > 0;
  const hasInvoiceData = invoiceStats.outputTotal > 0 || invoiceStats.inputTotal > 0;
  
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

  // 处理刷新
  const handleRefresh = useCallback(() => {
    refetchTax();
    toast.success("数据已刷新");
  }, [refetchTax]);
  
  return (
    <AppLayout>
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">税务管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            税负监控 · 风险预警 · 申报管理
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAlertDialogOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            预警设置
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoadingTax}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingTax && "animate-spin")} />
            刷新
          </Button>
          <Button 
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
        </div>
      </div>

      {/* 加载状态 */}
      {isLoadingTax && <LoadingState />}

      {/* 错误状态 */}
      {taxError && !isLoadingTax && (
        <EmptyState message="数据加载失败，请检查网络连接" icon={AlertCircle} />
      )}

      {/* 有数据时显示内容 */}
      {!isLoadingTax && !taxError && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <PieChartIcon className="h-4 w-4" />
              税务总览
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Bell className="h-4 w-4" />
              风险预警
            </TabsTrigger>
            <TabsTrigger value="declaration" className="gap-2">
              <Calendar className="h-4 w-4" />
              申报管理
            </TabsTrigger>
            <TabsTrigger value="invoice" className="gap-2">
              <FileText className="h-4 w-4" />
              发票统计
            </TabsTrigger>
          </TabsList>

          {/* 税务总览 */}
          <TabsContent value="overview" className="space-y-6">
            {hasOverviewData ? (
              <>
                {/* 核心指标 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <TaxCard
                    title="综合税负率"
                    value={taxOverview.comprehensiveTaxRate}
                    unit="%"
                    icon={Percent}
                    trend={taxOverview.monthOverMonth >= 0 ? "up" : "down"}
                    trendValue={`${Math.abs(taxOverview.monthOverMonth)}%`}
                    variant={taxOverview.comprehensiveTaxRate <= taxOverview.targetTaxRate ? "success" : "warning"}
                    subtitle={`目标: ${taxOverview.targetTaxRate}%`}
                  />
                  <TaxCard
                    title="本月应纳税额"
                    value={formatCurrency(taxOverview.totalTaxAmount)}
                    icon={Calculator}
                    variant="default"
                  />
                  <TaxCard
                    title="风险等级"
                    value={taxOverview.riskLevel === "low" ? "低风险" : taxOverview.riskLevel === "medium" ? "中风险" : "高风险"}
                    icon={Shield}
                    variant={taxOverview.riskLevel === "low" ? "success" : taxOverview.riskLevel === "medium" ? "warning" : "danger"}
                  />
                  <TaxCard
                    title="待申报事项"
                    value={taxOverview.pendingDeclarations}
                    unit="项"
                    icon={Clock}
                    variant={taxOverview.pendingDeclarations > 0 ? "warning" : "success"}
                  />
                </div>

                {/* 税种构成 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="data-card">
                    <h3 className="font-semibold mb-4">税种构成</h3>
                    {hasCompositionData ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
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
                    ) : (
                      <EmptyState message="暂无税种构成数据" icon={PieChartIcon} />
                    )}
                  </div>

                  <div className="data-card">
                    <h3 className="font-semibold mb-4">各税种明细</h3>
                    {hasCompositionData ? (
                      <div className="space-y-3">
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
                    ) : (
                      <EmptyState message="暂无税种明细数据" icon={Receipt} />
                    )}
                  </div>
                </div>

                {/* 税负率趋势 */}
                <div className="data-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">综合税负率趋势</h3>
                    <Badge variant="outline">近6个月</Badge>
                  </div>
                  {hasRateTrendData ? (
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
                  ) : (
                    <EmptyState message="暂无税负率趋势数据" icon={TrendingUp} />
                  )}
                </div>
              </>
            ) : (
              <div className="data-card">
                <EmptyState message="暂无税务数据" icon={Receipt} />
              </div>
            )}
          </TabsContent>

          {/* 风险预警 */}
          <TabsContent value="alerts" className="space-y-4">
            <div className="data-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">风险预警列表</h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-danger/10 text-danger">
                    高风险 {riskAlerts.filter(a => a.type === 'danger').length}
                  </Badge>
                  <Badge className="bg-warning/10 text-warning">
                    中风险 {riskAlerts.filter(a => a.type === 'warning').length}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary">
                    提醒 {riskAlerts.filter(a => a.type === 'info').length}
                  </Badge>
                </div>
              </div>
              {hasAlertsData ? (
                <div className="space-y-4">
                  {riskAlerts.map((alert) => (
                    <RiskAlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              ) : (
                <EmptyState message="暂无风险预警" icon={Bell} />
              )}
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

            {hasDeclarationData ? (
              <>
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
                    <p className="text-xl font-bold text-warning">
                      {declarationCalendar.filter(d => d.status === 'pending').length}项
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">本月预计税额</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(declarationCalendar.reduce((sum, d) => sum + (d.amount || 0), 0))}
                    </p>
                  </div>
                  <div className="p-4 bg-success/10 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">已完成</p>
                    <p className="text-xl font-bold text-success">
                      {declarationCalendar.filter(d => d.status === 'completed').length}项
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <EmptyState message="暂无申报数据" icon={Calendar} />
            )}
          </TabsContent>

          {/* 发票统计 */}
          <TabsContent value="invoice" className="space-y-6">
            {hasInvoiceData ? (
              <>
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
                      <p className="text-xl font-bold">{formatCurrency(invoiceStats.outputTotal * 0.13)}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">进项税额</p>
                      <p className="text-xl font-bold">{formatCurrency(invoiceStats.inputTotal * 0.13)}</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">应纳增值税</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency((invoiceStats.outputTotal - invoiceStats.inputTotal) * 0.13)}
                      </p>
                    </div>
                    <div className="p-4 bg-success/10 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">进销比</p>
                      <p className="text-xl font-bold text-success">
                        {invoiceStats.outputTotal > 0 
                          ? ((invoiceStats.inputTotal / invoiceStats.outputTotal) * 100).toFixed(1) 
                          : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="data-card">
                <EmptyState message="暂无发票数据" icon={FileText} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
      
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
                value={alertConfig.minRate}
                onChange={(e) => setAlertConfig({...alertConfig, minRate: e.target.value})}
                className="col-span-3"
                placeholder="例如: 4.0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxRate" className="text-right">最高税负率</Label>
              <Input
                id="maxRate"
                value={alertConfig.maxRate}
                onChange={(e) => setAlertConfig({...alertConfig, maxRate: e.target.value})}
                className="col-span-3"
                placeholder="例如: 8.0"
              />
            </div>
            <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
              <p>当税负率低于最低值或高于最高值时，系统将自动发出预警通知。</p>
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
