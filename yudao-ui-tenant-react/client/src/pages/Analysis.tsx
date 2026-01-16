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
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAnalysisRoi, useAnalysisExport } from "@/hooks/useLedger";
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

// ROI总览
const roiOverview = {
  overallROI: 285.6,
  adROI: 3.2,
  productROI: 4.8,
  channelROI: 2.9,
  targetROI: 3.0,
};

// 各渠道ROI
const channelROI = [
  { channel: "抖音直播", investment: 125000, revenue: 456000, roi: 3.65, trend: "up" },
  { channel: "短视频带货", investment: 85000, revenue: 312000, roi: 3.67, trend: "up" },
  { channel: "千川投放", investment: 156000, revenue: 485000, roi: 3.11, trend: "down" },
  { channel: "达人合作", investment: 68000, revenue: 198000, roi: 2.91, trend: "down" },
  { channel: "自然流量", investment: 0, revenue: 285000, roi: 999, trend: "up" },
];

// ROI趋势
const roiTrend = [
  { date: "01-05", roi: 2.85, target: 3.0 },
  { date: "01-06", roi: 3.12, target: 3.0 },
  { date: "01-07", roi: 2.95, target: 3.0 },
  { date: "01-08", roi: 3.25, target: 3.0 },
  { date: "01-09", roi: 3.08, target: 3.0 },
  { date: "01-10", roi: 3.42, target: 3.0 },
  { date: "01-11", roi: 3.20, target: 3.0 },
];

// 盈亏平衡分析
const breakEvenData = {
  fixedCost: 125000, // 固定成本
  variableCostRate: 0.65, // 变动成本率
  sellingPrice: 100, // 平均售价
  breakEvenPoint: 357143, // 盈亏平衡点销售额
  currentSales: 485620, // 当前销售额
  safetyMargin: 26.5, // 安全边际率
};

// 本量利分析图表数据
const cvpChartData = [
  { sales: 0, totalCost: 125000, revenue: 0 },
  { sales: 100000, totalCost: 190000, revenue: 100000 },
  { sales: 200000, totalCost: 255000, revenue: 200000 },
  { sales: 300000, totalCost: 320000, revenue: 300000 },
  { sales: 357143, totalCost: 357143, revenue: 357143 },
  { sales: 400000, totalCost: 385000, revenue: 400000 },
  { sales: 500000, totalCost: 450000, revenue: 500000 },
  { sales: 600000, totalCost: 515000, revenue: 600000 },
];

// 产品利润贡献
const productContribution = [
  { product: "连衣裙系列", revenue: 185600, cost: 112500, profit: 73100, margin: 39.4 },
  { product: "T恤系列", revenue: 125800, cost: 82600, profit: 43200, margin: 34.3 },
  { product: "牛仔裤系列", revenue: 98500, cost: 62400, profit: 36100, margin: 36.6 },
  { product: "运动鞋系列", revenue: 75720, cost: 52800, profit: 22920, margin: 30.3 },
];

// 利润结构
const profitStructure = [
  { name: "毛利润", value: 285640, percent: 100 },
  { name: "销售费用", value: -85640, percent: -30 },
  { name: "管理费用", value: -42500, percent: -14.9 },
  { name: "推广费用", value: -68500, percent: -24 },
  { name: "净利润", value: 89000, percent: 31.1 },
];

// ============ Helper Functions ============
function formatCurrency(value: number): string {
  if (Math.abs(value) >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`;
  }
  return `¥${value.toLocaleString()}`;
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
function ChannelROIRow({ channel }: { channel: typeof channelROI[0] }) {
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
  const { data: analysisData, isLoading: isLoadingAnalysis, refetch: refetchAnalysis } = useAnalysisRoi();
  
  // 导出分析报告
  const exportMutation = useAnalysisExport();
  
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
    refetchAnalysis();
  }, [refetchAnalysis]);
  
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

      {/* ROI总览卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <ROICard 
          title="综合ROI" 
          value={roiOverview.overallROI}
          unit="%"
          icon={TrendingUp}
          variant="success"
        />
        <ROICard 
          title="广告ROI" 
          value={roiOverview.adROI}
          target={roiOverview.targetROI}
          icon={Target}
          variant="success"
        />
        <ROICard 
          title="产品ROI" 
          value={roiOverview.productROI}
          target={roiOverview.targetROI}
          icon={BarChart3}
          variant="success"
        />
        <ROICard 
          title="渠道ROI" 
          value={roiOverview.channelROI}
          target={roiOverview.targetROI}
          icon={Activity}
          variant="warning"
        />
        <ROICard 
          title="安全边际率" 
          value={breakEvenData.safetyMargin}
          unit="%"
          icon={Scale}
          variant="success"
        />
      </div>

      {/* ROI分析和盈亏平衡 Tabs */}
      <Tabs defaultValue="roi" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="roi" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            ROI分析
          </TabsTrigger>
          <TabsTrigger value="breakeven" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            盈亏平衡
          </TabsTrigger>
          <TabsTrigger value="contribution" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            利润贡献
          </TabsTrigger>
        </TabsList>

        {/* ROI分析 */}
        <TabsContent value="roi" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ROI趋势 */}
            <div className="data-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">ROI趋势</h3>
                <Badge variant="outline">近7天</Badge>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={roiTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 250)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 250)" domain={[2, 4]} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [value.toFixed(2), name === "roi" ? "实际ROI" : "目标ROI"]}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid oklch(0.9 0.01 250)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <ReferenceLine y={3} stroke="oklch(0.7 0.15 70)" strokeDasharray="5 5" label="目标" />
                    <Area 
                      type="monotone" 
                      dataKey="roi" 
                      name="实际ROI"
                      stroke="oklch(0.5 0.18 250)" 
                      fill="oklch(0.5 0.18 250 / 0.2)" 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 渠道ROI */}
            <div className="data-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">渠道ROI排行</h3>
                <Badge className="bg-success/10 text-success">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  3/5 达标
                </Badge>
              </div>
              <div className="divide-y divide-border/50">
                {channelROI.map((channel, index) => (
                  <ChannelROIRow key={index} channel={channel} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 盈亏平衡 */}
        <TabsContent value="breakeven" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 盈亏平衡指标 */}
            <div className="data-card">
              <h3 className="font-semibold mb-4">盈亏平衡分析</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">固定成本</p>
                  <p className="text-xl font-bold mt-1">{formatCurrency(breakEvenData.fixedCost)}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">变动成本率</p>
                  <p className="text-xl font-bold mt-1">{(breakEvenData.variableCostRate * 100).toFixed(0)}%</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">盈亏平衡点</p>
                  <p className="text-xl font-bold text-primary mt-1">{formatCurrency(breakEvenData.breakEvenPoint)}</p>
                </div>
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <p className="text-sm text-muted-foreground">当前销售额</p>
                  <p className="text-xl font-bold text-success mt-1">{formatCurrency(breakEvenData.currentSales)}</p>
                  <p className="text-xs text-success mt-1">
                    超出盈亏平衡点 {formatCurrency(breakEvenData.currentSales - breakEvenData.breakEvenPoint)}
                  </p>
                </div>
              </div>
            </div>

            {/* 本量利分析图 */}
            <div className="data-card lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">本量利分析图 (CVP)</h3>
                <Badge variant="outline">成本-销量-利润关系</Badge>
              </div>
              <div className="h-80">
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
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <ReferenceLine 
                      x={357143} 
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
                  <p className="text-lg font-bold text-primary">{((1 - breakEvenData.variableCostRate) * 100).toFixed(0)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">安全边际</p>
                  <p className="text-lg font-bold text-success">{formatCurrency(breakEvenData.currentSales - breakEvenData.breakEvenPoint)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">安全边际率</p>
                  <p className="text-lg font-bold text-success">{breakEvenData.safetyMargin}%</p>
                </div>
              </div>
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
                          style={{ width: `${(product.profit / 73100) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 利润结构瀑布图 */}
            <div className="data-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">利润结构分析</h3>
                <Badge variant="outline">瀑布图</Badge>
              </div>
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
                    <p className="text-xl font-bold">{formatCurrency(285640)}</p>
                  </div>
                  <div className="p-4 bg-success/10 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">净利润</p>
                    <p className="text-xl font-bold text-success">{formatCurrency(89000)}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-center">
                    <span className="text-muted-foreground">净利率</span>
                    <span className="font-bold text-primary ml-2">31.1%</span>
                    <span className="text-muted-foreground ml-4">费用率</span>
                    <span className="font-bold text-warning ml-2">68.9%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
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
