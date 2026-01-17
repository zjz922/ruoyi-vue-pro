import AppLayout from "@/components/AppLayout";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Zap,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  DollarSign,
  Percent,
  Scale,
  LineChart as LineChartIcon,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
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
  LineChart,
  Line,
  ComposedChart,
  ReferenceLine,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { 
  useAnalysisRoi, 
  useAnalysisBreakEven, 
  useAnalysisProfitContribution,
  useAnalysisExport 
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============ 类型定义 ============

interface ROIOverview {
  overallROI: number;
  adROI: number;
  productROI: number;
  channelROI: number;
  targetROI: number;
}

interface ChannelROIItem {
  channel: string;
  investment: number;
  revenue: number;
  roi: number;
  trend: "up" | "down";
}

interface ROITrendItem {
  date: string;
  roi: number;
  target: number;
}

interface BreakEvenData {
  fixedCost: number;
  variableCostRate: number;
  sellingPrice: number;
  breakEvenPoint: number;
  currentSales: number;
  safetyMargin: number;
}

interface CVPChartItem {
  sales: number;
  totalCost: number;
  revenue: number;
}

interface ProductContributionItem {
  product: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

interface ProfitStructureItem {
  name: string;
  value: number;
  percent: number;
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

// ROI指标卡片
function ROICard({ 
  title, 
  value, 
  unit,
  target,
  icon: Icon, 
  variant = "default"
}: { 
  title: string;
  value: number;
  unit?: string;
  target?: number;
  icon: React.ElementType;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const isAboveTarget = target ? value >= target : true;
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
        {target && (
          <Badge className={cn(
            isAboveTarget ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
          )}>
            {isAboveTarget ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
            目标 {target}
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold">
        {value === 999 ? "∞" : value.toFixed(2)}
        {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
      </p>
    </div>
  );
}

// 渠道ROI行
function ChannelROIRow({ channel }: { channel: ChannelROIItem }) {
  const isGoodROI = channel.roi >= 3.0;
  return (
    <div className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-2 rounded-lg",
          isGoodROI ? "bg-success/10" : "bg-warning/10"
        )}>
          {channel.roi === 999 ? (
            <Zap className={cn("h-4 w-4", isGoodROI ? "text-success" : "text-warning")} />
          ) : (
            <Target className={cn("h-4 w-4", isGoodROI ? "text-success" : "text-warning")} />
          )}
        </div>
        <div>
          <span className="font-medium text-sm">{channel.channel}</span>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>投入 {formatCurrency(channel.investment)}</span>
            <span>·</span>
            <span>产出 {formatCurrency(channel.revenue)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={cn(
            "font-semibold text-lg",
            isGoodROI ? "text-success" : "text-warning"
          )}>
            {channel.roi === 999 ? "∞" : channel.roi.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">ROI</p>
        </div>
        <div className={cn(
          "flex items-center gap-1 text-sm",
          channel.trend === "up" ? "text-success" : "text-danger"
        )}>
          {channel.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        </div>
      </div>
    </div>
  );
}

// ============ Main Component ============
export default function Analysis() {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState("month");
  const [selectedChannel, setSelectedChannel] = useState("all");
  
  // 获取店铺信息
  const { currentShopId } = useShopSwitcher();
  
  // 获取经营分析数据
  const { 
    data: roiData, 
    isLoading: isLoadingRoi, 
    error: roiError,
    refetch: refetchRoi 
  } = useAnalysisRoi({ dateRange });
  
  const { 
    data: breakEvenData, 
    isLoading: isLoadingBreakEven 
  } = useAnalysisBreakEven();
  
  const { 
    data: contributionData, 
    isLoading: isLoadingContribution 
  } = useAnalysisProfitContribution();
  
  // 导出分析报告
  const exportMutation = useAnalysisExport();

  // 定义API响应类型
  type RoiDataType = {
    overview?: ROIOverview;
    channelROI?: ChannelROIItem[];
    roiTrend?: ROITrendItem[];
  };

  type BreakEvenDataType = {
    breakEven?: BreakEvenData;
    cvpChart?: CVPChartItem[];
  };

  type ContributionDataType = {
    productContribution?: ProductContributionItem[];
    profitStructure?: ProfitStructureItem[];
    summary?: {
      grossProfit: number;
      netProfit: number;
      netProfitRate: number;
      expenseRate: number;
    };
  };

  // 类型断言
  const typedRoiData = roiData as RoiDataType | undefined;
  const typedBreakEvenData = breakEvenData as BreakEvenDataType | undefined;
  const typedContributionData = contributionData as ContributionDataType | undefined;

  // 从API响应中提取数据
  const roiOverview = useMemo<ROIOverview>(() => {
    if (typedRoiData?.overview) {
      return typedRoiData.overview;
    }
    return {
      overallROI: 0,
      adROI: 0,
      productROI: 0,
      channelROI: 0,
      targetROI: 3.0,
    };
  }, [typedRoiData]);

  const channelROI = useMemo<ChannelROIItem[]>(() => {
    if (typedRoiData?.channelROI) {
      return typedRoiData.channelROI;
    }
    return [];
  }, [typedRoiData]);

  const roiTrend = useMemo<ROITrendItem[]>(() => {
    if (typedRoiData?.roiTrend) {
      return typedRoiData.roiTrend;
    }
    return [];
  }, [typedRoiData]);

  const breakEvenInfo = useMemo<BreakEvenData>(() => {
    if (typedBreakEvenData?.breakEven) {
      return typedBreakEvenData.breakEven;
    }
    return {
      fixedCost: 0,
      variableCostRate: 0,
      sellingPrice: 0,
      breakEvenPoint: 0,
      currentSales: 0,
      safetyMargin: 0,
    };
  }, [typedBreakEvenData]);

  const cvpChartData = useMemo<CVPChartItem[]>(() => {
    if (typedBreakEvenData?.cvpChart) {
      return typedBreakEvenData.cvpChart;
    }
    return [];
  }, [typedBreakEvenData]);

  const productContribution = useMemo<ProductContributionItem[]>(() => {
    if (typedContributionData?.productContribution) {
      return typedContributionData.productContribution;
    }
    return [];
  }, [typedContributionData]);

  const profitStructure = useMemo<ProfitStructureItem[]>(() => {
    if (typedContributionData?.profitStructure) {
      return typedContributionData.profitStructure;
    }
    return [];
  }, [typedContributionData]);

  const profitSummary = useMemo(() => {
    if (typedContributionData?.summary) {
      return typedContributionData.summary;
    }
    return {
      grossProfit: 0,
      netProfit: 0,
      netProfitRate: 0,
      expenseRate: 0,
    };
  }, [typedContributionData]);

  // 检查是否有数据
  const hasRoiData = roiOverview.overallROI > 0 || channelROI.length > 0;
  const hasBreakEvenData = breakEvenInfo.breakEvenPoint > 0;
  const hasContributionData = productContribution.length > 0 || profitStructure.length > 0;

  const isLoading = isLoadingRoi || isLoadingBreakEven || isLoadingContribution;
  
  // 处理导出分析
  const handleExport = useCallback(async () => {
    try {
      const result = await exportMutation.mutateAsync({
        shopId: currentShopId || "",
        reportType: "roi" as const,
        format: "excel" as const,
      });
      toast.success("分析报告导出成功");
      const exportResult = result as { downloadUrl?: string };
      if (exportResult.downloadUrl) {
        window.open(exportResult.downloadUrl, "_blank");
      }
    } catch (error) {
      toast.error("导出失败，请重试");
    }
  }, [exportMutation, currentShopId]);
  
  // 处理筛选应用
  const handleApplyFilter = useCallback(() => {
    setFilterDialogOpen(false);
    toast.success("筛选条件已应用");
    refetchRoi();
  }, [refetchRoi]);

  // 处理刷新
  const handleRefresh = useCallback(() => {
    refetchRoi();
    toast.success("数据已刷新");
  }, [refetchRoi]);
  
  return (
    <AppLayout>
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">经营分析</h1>
          <p className="text-sm text-muted-foreground mt-1">
            ROI分析 · 盈亏平衡 · 利润贡献
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
            onClick={() => setFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            筛选
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
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
            导出分析
          </Button>
        </div>
      </div>

      {/* 加载状态 */}
      {isLoading && <LoadingState />}

      {/* 错误状态 */}
      {roiError && !isLoading && (
        <EmptyState message="数据加载失败，请检查网络连接" icon={AlertCircle} />
      )}

      {/* 有数据时显示内容 */}
      {!isLoading && !roiError && (
        <>
          {/* ROI总览卡片 */}
          {hasRoiData ? (
            <div className="grid grid-cols-5 gap-4">
              <ROICard 
                title="综合ROI" 
                value={roiOverview.overallROI} 
                unit="%" 
                icon={Activity}
                variant="success"
              />
              <ROICard 
                title="广告ROI" 
                value={roiOverview.adROI} 
                target={roiOverview.targetROI}
                icon={Target}
                variant={roiOverview.adROI >= roiOverview.targetROI ? "success" : "warning"}
              />
              <ROICard 
                title="产品ROI" 
                value={roiOverview.productROI} 
                icon={BarChart3}
                variant="default"
              />
              <ROICard 
                title="渠道ROI" 
                value={roiOverview.channelROI} 
                icon={PieChartIcon}
                variant="default"
              />
              <ROICard 
                title="目标ROI" 
                value={roiOverview.targetROI} 
                icon={Scale}
                variant="default"
              />
            </div>
          ) : (
            <div className="data-card">
              <EmptyState message="暂无ROI数据" icon={Target} />
            </div>
          )}

          <Tabs defaultValue="roi" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="roi" className="gap-2">
                <Target className="h-4 w-4" />
                ROI分析
              </TabsTrigger>
              <TabsTrigger value="breakeven" className="gap-2">
                <Scale className="h-4 w-4" />
                盈亏平衡
              </TabsTrigger>
              <TabsTrigger value="contribution" className="gap-2">
                <PieChartIcon className="h-4 w-4" />
                利润贡献
              </TabsTrigger>
            </TabsList>

            {/* ROI分析 */}
            <TabsContent value="roi" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 渠道ROI明细 */}
                <div className="data-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">渠道ROI明细</h3>
                    <Badge variant="outline">按ROI排序</Badge>
                  </div>
                  {channelROI.length > 0 ? (
                    <div className="space-y-1">
                      {channelROI.map((channel, index) => (
                        <ChannelROIRow key={index} channel={channel} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="暂无渠道ROI数据" icon={Target} />
                  )}
                </div>

                {/* ROI趋势 */}
                <div className="data-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">ROI趋势</h3>
                    <Badge variant="outline">近7天</Badge>
                  </div>
                  {roiTrend.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={roiTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 250)" />
                          <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 250)" domain={[2, 4]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid oklch(0.9 0.01 250)',
                              borderRadius: '8px',
                            }}
                          />
                          <Legend />
                          <ReferenceLine y={3.0} stroke="oklch(0.7 0.15 70)" strokeDasharray="5 5" label="目标" />
                          <Area 
                            type="monotone" 
                            dataKey="roi" 
                            name="实际ROI"
                            fill="oklch(0.55 0.18 150 / 0.2)" 
                            stroke="oklch(0.55 0.18 150)"
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="target" 
                            name="目标ROI"
                            stroke="oklch(0.7 0.15 70)" 
                            strokeDasharray="5 5"
                            dot={false}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <EmptyState message="暂无ROI趋势数据" icon={LineChartIcon} />
                  )}
                </div>
              </div>
            </TabsContent>

            {/* 盈亏平衡 */}
            <TabsContent value="breakeven" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 盈亏平衡指标 */}
                <div className="data-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">盈亏平衡分析</h3>
                    <Badge variant="outline">本月</Badge>
                  </div>
                  {hasBreakEvenData ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">固定成本</p>
                          <p className="text-xl font-bold">{formatCurrency(breakEvenInfo.fixedCost)}</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">变动成本率</p>
                          <p className="text-xl font-bold">{(breakEvenInfo.variableCostRate * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                      <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">盈亏平衡点</p>
                            <p className="text-2xl font-bold text-warning">{formatCurrency(breakEvenInfo.breakEvenPoint)}</p>
                          </div>
                          <Scale className="h-8 w-8 text-warning/50" />
                        </div>
                      </div>
                      <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">当前销售额</p>
                            <p className="text-2xl font-bold text-success">{formatCurrency(breakEvenInfo.currentSales)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">安全边际率</p>
                            <p className="text-xl font-bold text-success">{breakEvenInfo.safetyMargin}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmptyState message="暂无盈亏平衡数据" icon={Scale} />
                  )}
                </div>

                {/* 本量利图 */}
                <div className="data-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">本量利分析图</h3>
                    <Badge variant="outline">CVP</Badge>
                  </div>
                  {cvpChartData.length > 0 ? (
                    <>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={cvpChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
                            <XAxis 
                              dataKey="sales" 
                              tick={{ fontSize: 12 }} 
                              stroke="oklch(0.5 0.02 250)"
                              tickFormatter={(v) => `${(v/10000).toFixed(0)}万`}
                            />
                            <YAxis 
                              tick={{ fontSize: 12 }} 
                              stroke="oklch(0.5 0.02 250)"
                              tickFormatter={(v) => `${(v/10000).toFixed(0)}万`}
                            />
                            <Tooltip 
                              formatter={(value: number) => formatCurrency(value)}
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid oklch(0.9 0.01 250)',
                                borderRadius: '8px',
                              }}
                            />
                            <Legend />
                            <ReferenceLine 
                              x={breakEvenInfo.breakEvenPoint} 
                              stroke="oklch(0.7 0.15 70)" 
                              strokeDasharray="5 5" 
                              label={{ value: "盈亏平衡点", position: "top" }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="revenue" 
                              name="销售收入"
                              stroke="oklch(0.55 0.18 150)" 
                              strokeWidth={2}
                              dot={false}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="totalCost" 
                              name="总成本"
                              stroke="oklch(0.55 0.2 25)" 
                              strokeWidth={2}
                              dot={false}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">边际贡献率</p>
                          <p className="text-lg font-bold text-primary">{((1 - breakEvenInfo.variableCostRate) * 100).toFixed(0)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">安全边际</p>
                          <p className="text-lg font-bold text-success">{formatCurrency(breakEvenInfo.currentSales - breakEvenInfo.breakEvenPoint)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">安全边际率</p>
                          <p className="text-lg font-bold text-success">{breakEvenInfo.safetyMargin}%</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <EmptyState message="暂无本量利分析数据" icon={Calculator} />
                  )}
                </div>
              </div>
            </TabsContent>

            {/* 利润贡献 */}
            <TabsContent value="contribution" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 产品利润贡献 */}
                <div className="data-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">产品利润贡献</h3>
                    <Badge variant="outline">本月</Badge>
                  </div>
                  {productContribution.length > 0 ? (
                    <div className="space-y-4">
                      {productContribution.map((product, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{product.product}</span>
                            <Badge className={cn(
                              product.margin >= 35 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                            )}>
                              毛利率 {product.margin}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">收入</p>
                              <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">成本</p>
                              <p className="font-semibold">{formatCurrency(product.cost)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">利润</p>
                              <p className="font-semibold text-success">{formatCurrency(product.profit)}</p>
                            </div>
                          </div>
                          {/* 进度条 */}
                          <div className="mt-3">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${Math.min((product.profit / (productContribution[0]?.profit || 1)) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="暂无产品利润贡献数据" icon={PieChartIcon} />
                  )}
                </div>

                {/* 利润结构瀑布图 */}
                <div className="data-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">利润结构分析</h3>
                    <Badge variant="outline">瀑布图</Badge>
                  </div>
                  {profitStructure.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        {profitStructure.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-24 text-sm text-right">{item.name}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div 
                                  className={cn(
                                    "h-8 rounded flex items-center justify-end px-2 text-sm font-medium text-white",
                                    item.value >= 0 ? "bg-success" : "bg-danger"
                                  )}
                                  style={{ 
                                    width: `${Math.abs(item.percent)}%`,
                                    marginLeft: item.value < 0 ? `${100 - Math.abs(item.percent)}%` : '0'
                                  }}
                                >
                                  {formatCurrency(Math.abs(item.value))}
                                </div>
                              </div>
                            </div>
                            <div className={cn(
                              "w-16 text-sm text-right font-medium",
                              item.value >= 0 ? "text-success" : "text-danger"
                            )}>
                              {item.percent >= 0 ? "+" : ""}{item.percent}%
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-border">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-muted/30 rounded-lg text-center">
                            <p className="text-sm text-muted-foreground">毛利润</p>
                            <p className="text-xl font-bold">{formatCurrency(profitSummary.grossProfit)}</p>
                          </div>
                          <div className="p-4 bg-success/10 rounded-lg text-center">
                            <p className="text-sm text-muted-foreground">净利润</p>
                            <p className="text-xl font-bold text-success">{formatCurrency(profitSummary.netProfit)}</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                          <p className="text-sm text-center">
                            <span className="text-muted-foreground">净利率</span>
                            <span className="font-bold text-primary ml-2">{profitSummary.netProfitRate}%</span>
                            <span className="text-muted-foreground ml-4">费用率</span>
                            <span className="font-bold text-warning ml-2">{profitSummary.expenseRate}%</span>
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <EmptyState message="暂无利润结构数据" icon={BarChart3} />
                  )}
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
            <DialogTitle>分析筛选</DialogTitle>
            <DialogDescription>
              设置经营分析的筛选条件
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="channel" className="text-right">渠道</Label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择渠道" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部渠道</SelectItem>
                  <SelectItem value="live">抖音直播</SelectItem>
                  <SelectItem value="video">短视频带货</SelectItem>
                  <SelectItem value="qianchuan">千川投放</SelectItem>
                  <SelectItem value="daren">达人合作</SelectItem>
                  <SelectItem value="organic">自然流量</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">分析维度</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="roi" defaultChecked className="rounded" />
                  <label htmlFor="roi" className="text-sm">ROI分析</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="breakeven" defaultChecked className="rounded" />
                  <label htmlFor="breakeven" className="text-sm">盈亏平衡分析</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="contribution" defaultChecked className="rounded" />
                  <label htmlFor="contribution" className="text-sm">利润贡献分析</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>取消</Button>
            <Button onClick={handleApplyFilter}>应用筛选</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AppLayout>
  );
}
