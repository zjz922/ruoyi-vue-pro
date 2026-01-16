import AppLayout from "@/components/AppLayout";
import {
  Package,
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  Layers,
  Box,
  Archive,
  AlertCircle,
  Timer,
  History,
  Target,
  Lightbulb,
  ChevronRight,
  FileText,
  Bell,
  Percent,
  DollarSign,
  Activity
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
import { useInventoryOverview, useInventorySync, useInventoryExport, useInventoryCostingConfig } from "@/hooks/useLedger";
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

// 库存总览
const inventoryOverview = {
  totalValue: 892350,
  totalSKU: 1256,
  healthySKU: 985,
  warningSKU: 186,
  dangerSKU: 85,
  turnoverDays: 28.5,
  avgCost: 45.8,
  costChangeRate: 2.3,
  monthlyTurnover: 3.2,
};

// SKU级成本追踪数据
const skuCostTracking = [
  { 
    sku: "SKU-2851", 
    name: "夏季连衣裙-蓝色M", 
    purchaseCost: 35.00,
    freightCost: 2.50,
    storageCost: 1.20,
    totalCost: 38.70,
    sellingPrice: 89.00,
    grossMargin: 56.5,
    stock: 256,
    costTrend: "up",
    costChange: 3.2
  },
  { 
    sku: "SKU-1923", 
    name: "休闲T恤-白色L", 
    purchaseCost: 22.00,
    freightCost: 1.80,
    storageCost: 0.80,
    totalCost: 24.60,
    sellingPrice: 59.00,
    grossMargin: 58.3,
    stock: 189,
    costTrend: "down",
    costChange: -1.5
  },
  { 
    sku: "SKU-3042", 
    name: "牛仔裤-深蓝32", 
    purchaseCost: 48.00,
    freightCost: 3.20,
    storageCost: 1.50,
    totalCost: 52.70,
    sellingPrice: 129.00,
    grossMargin: 59.1,
    stock: 145,
    costTrend: "stable",
    costChange: 0.2
  },
  { 
    sku: "SKU-4521", 
    name: "运动鞋-黑色42", 
    purchaseCost: 120.00,
    freightCost: 8.00,
    storageCost: 3.50,
    totalCost: 131.50,
    sellingPrice: 299.00,
    grossMargin: 56.0,
    stock: 98,
    costTrend: "up",
    costChange: 5.8
  },
  { 
    sku: "SKU-2156", 
    name: "针织衫-灰色XL", 
    purchaseCost: 32.00,
    freightCost: 2.00,
    storageCost: 1.00,
    totalCost: 35.00,
    sellingPrice: 79.00,
    grossMargin: 55.7,
    stock: 167,
    costTrend: "down",
    costChange: -2.1
  },
];

// 成本波动预警数据
const costAlerts = [
  { 
    id: 1,
    type: "采购成本上涨",
    sku: "SKU-4521",
    name: "运动鞋-黑色42",
    oldCost: 113.50,
    newCost: 120.00,
    changeRate: 5.7,
    impact: "高",
    suggestion: "建议与供应商协商价格或寻找替代供应商"
  },
  { 
    id: 2,
    type: "物流成本上涨",
    sku: "SKU-2851",
    name: "夏季连衣裙-蓝色M",
    oldCost: 2.00,
    newCost: 2.50,
    changeRate: 25.0,
    impact: "中",
    suggestion: "建议优化包装尺寸或更换物流渠道"
  },
  { 
    id: 3,
    type: "仓储成本上涨",
    sku: "SKU-3042",
    name: "牛仔裤-深蓝32",
    oldCost: 1.20,
    newCost: 1.50,
    changeRate: 25.0,
    impact: "低",
    suggestion: "建议加快周转或调整仓储策略"
  },
];

// 库存周转优化建议
const turnoverSuggestions = [
  {
    id: 1,
    category: "滞销商品处理",
    title: "85个SKU库龄超过90天",
    description: "建议通过促销活动或清仓处理加速周转",
    potentialValue: 67450,
    priority: "高",
    action: "立即处理"
  },
  {
    id: 2,
    category: "补货建议",
    title: "12个热销SKU库存不足",
    description: "根据销售趋势预测，建议提前补货避免断货",
    potentialValue: 125000,
    priority: "高",
    action: "立即补货"
  },
  {
    id: 3,
    category: "成本优化",
    title: "采购成本优化空间",
    description: "通过批量采购可降低15个SKU的采购成本约8%",
    potentialValue: 28500,
    priority: "中",
    action: "查看详情"
  },
  {
    id: 4,
    category: "仓储优化",
    title: "仓储空间利用率偏低",
    description: "当前仓储利用率68%，优化后可节省仓储成本",
    potentialValue: 12000,
    priority: "低",
    action: "查看方案"
  },
];

// 成本构成分析
const costComposition = {
  purchase: { value: 756000, percent: 84.7 },
  freight: { value: 68500, percent: 7.7 },
  storage: { value: 42850, percent: 4.8 },
  other: { value: 25000, percent: 2.8 },
};

// 库龄分布
const ageDistribution = [
  { range: "0-30天", count: 658, value: 425600, percent: 47.7, status: "healthy" },
  { range: "31-60天", count: 327, value: 256800, percent: 28.8, status: "healthy" },
  { range: "61-90天", count: 186, value: 142500, percent: 16.0, status: "warning" },
  { range: "90天以上", count: 85, value: 67450, percent: 7.5, status: "danger" },
];

// 成本计价方式对比
const costingMethods = [
  { method: "加权平均法", unitCost: 45.8, totalCost: 892350, grossMargin: 28.5, isActive: true },
  { method: "先进先出法", unitCost: 42.3, totalCost: 856420, grossMargin: 31.2, isActive: false },
  { method: "移动平均法", unitCost: 44.6, totalCost: 878560, grossMargin: 29.4, isActive: false },
];

// 库存周转趋势
const turnoverTrend = [
  { month: "7月", days: 32.5, target: 30 },
  { month: "8月", days: 30.2, target: 30 },
  { month: "9月", days: 28.8, target: 30 },
  { month: "10月", days: 27.5, target: 30 },
  { month: "11月", days: 29.2, target: 30 },
  { month: "12月", days: 28.5, target: 30 },
];

// ============ Helper Functions ============
function formatCurrency(value: number): string {
  if (Math.abs(value) >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`;
  }
  return `¥${value.toLocaleString()}`;
}

// ============ Main Component ============
export default function Inventory() {
  const [activeTab, setActiveTab] = useState("overview");
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedCostingMethod, setSelectedCostingMethod] = useState("weighted_average");
  
  // 获取店铺信息
  const { currentShopId } = useShopSwitcher();
  
  // 获取库存概览数据
  const { data: inventoryData, isLoading: isLoadingInventory, refetch: refetchInventory } = useInventoryOverview();
  
  // 同步库存
  const syncStockMutation = useInventorySync();
  
  // 导出报表
  const exportMutation = useInventoryExport();
  
  // 更新计价方式
  const updateCostingMethodMutation = useInventoryCostingConfig();
  
  // 处理同步库存
  const handleSyncStock = useCallback(async () => {
    try {
      await syncStockMutation.mutateAsync({
        shopId: currentShopId || "",
      });
      toast.success("库存数据已同步");
    } catch (error) {
      toast.error("同步失败，请重试");
    }
  }, [syncStockMutation, currentShopId]);
  
  // 处理导出报表
  const handleExport = useCallback(async () => {
    try {
      const result = await exportMutation.mutateAsync({
        shopId: currentShopId || "",
        reportType: "overview" as const,
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
  
  // 处理更新计价方式
  const handleUpdateCostingMethod = useCallback(async () => {
    try {
      await updateCostingMethodMutation.mutateAsync({
        shopId: currentShopId || "",
        costingMethod: selectedCostingMethod as "weighted_average" | "fifo" | "moving_average",
        effectiveDate: new Date().toISOString().split('T')[0],
      });
      toast.success("计价方式已更新");
      setSettingsDialogOpen(false);
    } catch (error) {
      toast.error("更新失败，请重试");
    }
  }, [updateCostingMethodMutation, currentShopId, selectedCostingMethod]);

  return (
    <AppLayout>
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">库存成本中心</h1>
          <p className="text-sm text-muted-foreground mt-1">
            SKU级成本追踪 · 成本波动预警 · 周转优化建议
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSettingsDialogOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            计价设置
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSyncStock}
            disabled={syncStockMutation.isPending}
          >
            {syncStockMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            同步库存
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[700px]">
          <TabsTrigger value="overview">库存总览</TabsTrigger>
          <TabsTrigger value="sku-cost">SKU成本追踪</TabsTrigger>
          <TabsTrigger value="alerts">成本波动预警</TabsTrigger>
          <TabsTrigger value="optimization">周转优化建议</TabsTrigger>
          <TabsTrigger value="costing">成本计价对比</TabsTrigger>
        </TabsList>

        {/* 库存总览 Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* 库存指标卡片 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  库存总值
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{formatCurrency(inventoryOverview.totalValue)}</div>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span>较上月 <span className="text-success">+5.2%</span></span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  SKU总数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventoryOverview.totalSKU} <span className="text-sm font-normal text-muted-foreground">个</span></div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-success">健康 {inventoryOverview.healthySKU}</span>
                  <span className="text-warning">预警 {inventoryOverview.warningSKU}</span>
                  <span className="text-danger">滞销 {inventoryOverview.dangerSKU}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Timer className="w-4 h-4 text-green-500" />
                  平均周转天数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{inventoryOverview.turnoverDays} <span className="text-sm font-normal text-muted-foreground">天</span></div>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <TrendingDown className="w-3 h-3 text-success" />
                  <span>较上月 <span className="text-success">-2.3天</span></span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-orange-500" />
                  平均成本
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥{inventoryOverview.avgCost}</div>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-warning" />
                  <span>较上月 <span className="text-warning">+{inventoryOverview.costChangeRate}%</span></span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 成本构成 + 库龄分布 */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* 成本构成分析 */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">成本构成分析</CardTitle>
                <CardDescription>库存成本各项占比</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">采购成本</span>
                    <span className="font-bold">{formatCurrency(costComposition.purchase.value)}</span>
                  </div>
                  <Progress value={costComposition.purchase.percent} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{costComposition.purchase.percent}%</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">物流成本</span>
                    <span className="font-bold">{formatCurrency(costComposition.freight.value)}</span>
                  </div>
                  <Progress value={costComposition.freight.percent * 10} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{costComposition.freight.percent}%</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">仓储成本</span>
                    <span className="font-bold">{formatCurrency(costComposition.storage.value)}</span>
                  </div>
                  <Progress value={costComposition.storage.percent * 10} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{costComposition.storage.percent}%</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">其他成本</span>
                    <span className="font-bold">{formatCurrency(costComposition.other.value)}</span>
                  </div>
                  <Progress value={costComposition.other.percent * 10} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{costComposition.other.percent}%</p>
                </div>
              </CardContent>
            </Card>

            {/* 库龄分布 */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">库龄分布</CardTitle>
                <CardDescription>按入库时间分析库存健康度</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ageDistribution.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={cn(
                            item.status === 'healthy' ? 'bg-success/10 text-success' :
                            item.status === 'warning' ? 'bg-warning/10 text-warning' :
                            'bg-danger/10 text-danger'
                          )}>
                            {item.status === 'healthy' ? '健康' : item.status === 'warning' ? '预警' : '滞销'}
                          </Badge>
                          <span className="text-sm font-medium">{item.range}</span>
                        </div>
                        <span className="font-bold">{formatCurrency(item.value)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={item.percent} 
                          className={cn(
                            "h-2 flex-1",
                            item.status === 'danger' && "[&>div]:bg-danger",
                            item.status === 'warning' && "[&>div]:bg-warning"
                          )} 
                        />
                        <span className="text-xs text-muted-foreground w-16 text-right">{item.count} SKU</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SKU成本追踪 Tab */}
        <TabsContent value="sku-cost" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>SKU级成本追踪</CardTitle>
                  <CardDescription>每个SKU的完整成本构成和毛利分析</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="搜索SKU..." className="w-64" />
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
                    <TableHead>SKU编码</TableHead>
                    <TableHead>商品名称</TableHead>
                    <TableHead className="text-right">采购成本</TableHead>
                    <TableHead className="text-right">物流成本</TableHead>
                    <TableHead className="text-right">仓储成本</TableHead>
                    <TableHead className="text-right">总成本</TableHead>
                    <TableHead className="text-right">售价</TableHead>
                    <TableHead className="text-right">毛利率</TableHead>
                    <TableHead className="text-right">库存</TableHead>
                    <TableHead className="text-right">成本趋势</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skuCostTracking.map((item) => (
                    <TableRow key={item.sku} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">¥{item.purchaseCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">¥{item.freightCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">¥{item.storageCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold">¥{item.totalCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">¥{item.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge className={cn(
                          item.grossMargin >= 55 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        )}>
                          {item.grossMargin}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{item.stock}</TableCell>
                      <TableCell className="text-right">
                        <div className={cn(
                          "flex items-center justify-end gap-1",
                          item.costTrend === 'up' ? 'text-danger' : 
                          item.costTrend === 'down' ? 'text-success' : 'text-muted-foreground'
                        )}>
                          {item.costTrend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
                           item.costTrend === 'down' ? <TrendingDown className="w-4 h-4" /> : 
                           <Activity className="w-4 h-4" />}
                          {item.costChange > 0 ? '+' : ''}{item.costChange}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 成本波动预警 Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-sm border-l-4 border-l-danger">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">高影响预警</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-danger">1</div>
                <p className="text-xs text-muted-foreground mt-1">需要立即处理</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-l-warning">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">中影响预警</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">1</div>
                <p className="text-xs text-muted-foreground mt-1">建议尽快处理</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">低影响预警</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">1</div>
                <p className="text-xs text-muted-foreground mt-1">可择机处理</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>成本波动预警列表</CardTitle>
              <CardDescription>成本变动超过阈值的SKU预警</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costAlerts.map((alert) => (
                  <div key={alert.id} className={cn(
                    "p-4 rounded-lg border",
                    alert.impact === '高' ? 'border-danger/50 bg-danger/5' :
                    alert.impact === '中' ? 'border-warning/50 bg-warning/5' :
                    'border-blue-500/50 bg-blue-500/5'
                  )}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          alert.impact === '高' ? 'bg-danger/10' :
                          alert.impact === '中' ? 'bg-warning/10' : 'bg-blue-500/10'
                        )}>
                          <AlertTriangle className={cn(
                            "w-5 h-5",
                            alert.impact === '高' ? 'text-danger' :
                            alert.impact === '中' ? 'text-warning' : 'text-blue-500'
                          )} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{alert.type}</span>
                            <Badge variant="outline" className={cn(
                              alert.impact === '高' ? 'border-danger text-danger' :
                              alert.impact === '中' ? 'border-warning text-warning' : 'border-blue-500 text-blue-500'
                            )}>
                              {alert.impact}影响
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{alert.sku} - {alert.name}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span>原成本: ¥{alert.oldCost.toFixed(2)}</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="font-bold text-danger">现成本: ¥{alert.newCost.toFixed(2)}</span>
                            <Badge className="bg-danger/10 text-danger">+{alert.changeRate}%</Badge>
                          </div>
                          <div className="flex items-start gap-2 mt-3 p-2 bg-muted/50 rounded">
                            <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground">{alert.suggestion}</p>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">处理</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 周转优化建议 Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">潜在优化价值</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">¥232,950</div>
                <p className="text-xs text-muted-foreground mt-1">通过优化建议可释放的资金</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">待处理建议</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4 <span className="text-sm font-normal text-muted-foreground">条</span></div>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-danger">高优先 2</span>
                  <span className="text-warning">中优先 1</span>
                  <span className="text-muted-foreground">低优先 1</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>库存周转优化建议</CardTitle>
              <CardDescription>基于数据分析的智能优化建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {turnoverSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className={cn(
                    "p-4 rounded-lg border",
                    suggestion.priority === '高' ? 'border-danger/50 bg-danger/5' :
                    suggestion.priority === '中' ? 'border-warning/50 bg-warning/5' :
                    'border-border bg-muted/30'
                  )}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          suggestion.priority === '高' ? 'bg-danger/10' :
                          suggestion.priority === '中' ? 'bg-warning/10' : 'bg-muted'
                        )}>
                          <Lightbulb className={cn(
                            "w-5 h-5",
                            suggestion.priority === '高' ? 'text-danger' :
                            suggestion.priority === '中' ? 'text-warning' : 'text-muted-foreground'
                          )} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{suggestion.category}</Badge>
                            <Badge className={cn(
                              suggestion.priority === '高' ? 'bg-danger/10 text-danger' :
                              suggestion.priority === '中' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                            )}>
                              {suggestion.priority}优先级
                            </Badge>
                          </div>
                          <p className="font-medium mt-2">{suggestion.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-muted-foreground">潜在价值:</span>
                            <span className="font-bold text-primary">{formatCurrency(suggestion.potentialValue)}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant={suggestion.priority === '高' ? 'default' : 'outline'}>
                        {suggestion.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 成本计价对比 Tab */}
        <TabsContent value="costing" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>成本计价方式对比</CardTitle>
              <CardDescription>不同计价方法对成本和毛利的影响分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {costingMethods.map((method, index) => (
                  <div key={index} className={cn(
                    "p-4 rounded-lg border-2",
                    method.isActive ? "border-primary bg-primary/5" : "border-border"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">{method.method}</span>
                      {method.isActive && (
                        <Badge className="bg-primary/10 text-primary">当前使用</Badge>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">单位成本</span>
                        <span className="font-bold">¥{method.unitCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">库存总成本</span>
                        <span className="font-bold">{formatCurrency(method.totalCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">预计毛利率</span>
                        <span className={cn(
                          "font-bold",
                          method.grossMargin >= 30 ? "text-success" : "text-warning"
                        )}>{method.grossMargin}%</span>
                      </div>
                    </div>
                    {!method.isActive && (
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        切换到此方法
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 库存周转趋势 */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>库存周转天数趋势</CardTitle>
              <CardDescription>近6个月库存周转天数变化（目标：30天）</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {turnoverTrend.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-12 text-sm text-muted-foreground">{item.month}</span>
                    <div className="flex-1 relative">
                      <Progress 
                        value={(item.days / 40) * 100} 
                        className={cn(
                          "h-6",
                          item.days <= item.target ? "[&>div]:bg-success" : "[&>div]:bg-warning"
                        )}
                      />
                      <div className="absolute left-[75%] top-0 bottom-0 w-0.5 bg-danger/50" title="目标线" />
                    </div>
                    <span className={cn(
                      "w-16 text-right font-bold",
                      item.days <= item.target ? "text-success" : "text-warning"
                    )}>{item.days}天</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-success rounded" />
                  <span>达标</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-warning rounded" />
                  <span>超标</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-0.5 h-3 bg-danger/50" />
                  <span>目标线(30天)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 计价设置对话框 */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>成本计价设置</DialogTitle>
            <DialogDescription>
              选择库存成本的计价方式
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costingMethod" className="text-right">计价方式</Label>
              <Select value={selectedCostingMethod} onValueChange={setSelectedCostingMethod}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择计价方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weighted_average">加权平均法</SelectItem>
                  <SelectItem value="fifo">先进先出法</SelectItem>
                  <SelectItem value="moving_average">移动平均法</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
              <p className="font-medium mb-2">计价方式说明：</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>加权平均法</strong>：根据全部库存的加权平均成本计算</li>
                <li>• <strong>先进先出法</strong>：假设先购入的商品先售出</li>
                <li>• <strong>移动平均法</strong>：每次购入后重新计算平均成本</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>取消</Button>
            <Button onClick={handleUpdateCostingMethod} disabled={updateCostingMethodMutation.isPending}>
              {updateCostingMethodMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              保存设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AppLayout>
  );
}
