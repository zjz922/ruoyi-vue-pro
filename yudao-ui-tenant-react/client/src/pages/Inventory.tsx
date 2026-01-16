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
  Activity,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { 
  useInventoryOverview, 
  useInventorySkuCost,
  useInventorySync, 
  useInventoryExport, 
  useInventoryCostingConfig,
  useInventoryOptimization,
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

interface InventoryOverviewData {
  totalValue: number;
  totalSKU: number;
  healthySKU: number;
  warningSKU: number;
  dangerSKU: number;
  turnoverDays: number;
  avgCost: number;
  costChangeRate: number;
  monthlyTurnover: number;
}

interface SKUCostItem {
  sku: string;
  name: string;
  purchaseCost: number;
  freightCost: number;
  storageCost: number;
  totalCost: number;
  sellingPrice: number;
  grossMargin: number;
  stock: number;
  costTrend: "up" | "down" | "stable";
  costChange: number;
}

interface CostAlert {
  id: number;
  type: string;
  sku: string;
  name: string;
  oldCost: number;
  newCost: number;
  changeRate: number;
  impact: "高" | "中" | "低";
  suggestion: string;
}

interface TurnoverSuggestion {
  id: number;
  category: string;
  title: string;
  description: string;
  potentialValue: number;
  priority: "高" | "中" | "低";
  action: string;
}

interface CostComposition {
  purchase: { value: number; percent: number };
  freight: { value: number; percent: number };
  storage: { value: number; percent: number };
  other: { value: number; percent: number };
}

interface AgeDistributionItem {
  range: string;
  count: number;
  value: number;
  percent: number;
  status: "healthy" | "warning" | "danger";
}

interface CostingMethod {
  method: string;
  unitCost: number;
  totalCost: number;
  grossMargin: number;
  isActive: boolean;
}

interface TurnoverTrendItem {
  month: string;
  days: number;
  target: number;
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

// ============ Main Component ============
export default function Inventory() {
  const [activeTab, setActiveTab] = useState("overview");
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedCostingMethod, setSelectedCostingMethod] = useState("weighted_average");
  
  // 获取店铺信息
  const { currentShopId } = useShopSwitcher();
  
  // 获取库存概览数据
  const { 
    data: inventoryData, 
    isLoading: isLoadingInventory, 
    error: inventoryError,
    refetch: refetchInventory 
  } = useInventoryOverview();
  
  // 获取SKU成本数据
  const { 
    data: skuCostData, 
    isLoading: isLoadingSkuCost 
  } = useInventorySkuCost();
  
  // 获取优化建议
  const { 
    data: optimizationData, 
    isLoading: isLoadingOptimization 
  } = useInventoryOptimization();
  
  // 同步库存
  const syncStockMutation = useInventorySync();
  
  // 导出报表
  const exportMutation = useInventoryExport();
  
  // 更新计价方式
  const updateCostingMethodMutation = useInventoryCostingConfig();

  // 定义API响应类型
  type InventoryDataType = {
    overview?: InventoryOverviewData;
    costComposition?: CostComposition;
    ageDistribution?: AgeDistributionItem[];
    costingMethods?: CostingMethod[];
    turnoverTrend?: TurnoverTrendItem[];
    costAlerts?: CostAlert[];
  };

  type SkuCostDataType = {
    list?: SKUCostItem[];
    pagination?: { total: number; pageNum: number; pageSize: number };
  };

  type OptimizationDataType = {
    suggestions?: TurnoverSuggestion[];
    totalPotentialValue?: number;
  };

  // 类型断言
  const typedInventoryData = inventoryData as InventoryDataType | undefined;
  const typedSkuCostData = skuCostData as SkuCostDataType | undefined;
  const typedOptimizationData = optimizationData as OptimizationDataType | undefined;

  // 从API响应中提取数据
  const inventoryOverview = useMemo<InventoryOverviewData>(() => {
    if (typedInventoryData?.overview) {
      return typedInventoryData.overview;
    }
    return {
      totalValue: 0,
      totalSKU: 0,
      healthySKU: 0,
      warningSKU: 0,
      dangerSKU: 0,
      turnoverDays: 0,
      avgCost: 0,
      costChangeRate: 0,
      monthlyTurnover: 0,
    };
  }, [typedInventoryData]);

  const costComposition = useMemo<CostComposition>(() => {
    if (typedInventoryData?.costComposition) {
      return typedInventoryData.costComposition;
    }
    return {
      purchase: { value: 0, percent: 0 },
      freight: { value: 0, percent: 0 },
      storage: { value: 0, percent: 0 },
      other: { value: 0, percent: 0 },
    };
  }, [typedInventoryData]);

  const ageDistribution = useMemo<AgeDistributionItem[]>(() => {
    if (typedInventoryData?.ageDistribution) {
      return typedInventoryData.ageDistribution;
    }
    return [];
  }, [typedInventoryData]);

  const costingMethods = useMemo<CostingMethod[]>(() => {
    if (typedInventoryData?.costingMethods) {
      return typedInventoryData.costingMethods;
    }
    return [];
  }, [typedInventoryData]);

  const turnoverTrend = useMemo<TurnoverTrendItem[]>(() => {
    if (typedInventoryData?.turnoverTrend) {
      return typedInventoryData.turnoverTrend;
    }
    return [];
  }, [typedInventoryData]);

  const costAlerts = useMemo<CostAlert[]>(() => {
    if (typedInventoryData?.costAlerts) {
      return typedInventoryData.costAlerts;
    }
    return [];
  }, [typedInventoryData]);

  const skuCostTracking = useMemo<SKUCostItem[]>(() => {
    if (typedSkuCostData?.list) {
      return typedSkuCostData.list;
    }
    return [];
  }, [typedSkuCostData]);

  const turnoverSuggestions = useMemo<TurnoverSuggestion[]>(() => {
    if (typedOptimizationData?.suggestions) {
      return typedOptimizationData.suggestions;
    }
    return [];
  }, [typedOptimizationData]);

  const totalPotentialValue = useMemo(() => {
    return typedOptimizationData?.totalPotentialValue || 0;
  }, [typedOptimizationData]);

  // 检查是否有数据
  const hasOverviewData = inventoryOverview.totalSKU > 0;
  const hasSkuCostData = skuCostTracking.length > 0;
  const hasAlertsData = costAlerts.length > 0;
  const hasSuggestionsData = turnoverSuggestions.length > 0;

  const isLoading = isLoadingInventory || isLoadingSkuCost || isLoadingOptimization;
  
  // 处理同步库存
  const handleSyncStock = useCallback(async () => {
    try {
      await syncStockMutation.mutateAsync({
        shopId: currentShopId || "",
      });
      toast.success("库存数据已同步");
      refetchInventory();
    } catch (error) {
      toast.error("同步失败，请重试");
    }
  }, [syncStockMutation, currentShopId, refetchInventory]);
  
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
      refetchInventory();
    } catch (error) {
      toast.error("更新失败，请重试");
    }
  }, [updateCostingMethodMutation, currentShopId, selectedCostingMethod, refetchInventory]);

  // 处理刷新
  const handleRefresh = useCallback(() => {
    refetchInventory();
    toast.success("数据已刷新");
  }, [refetchInventory]);

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
            导出报表
          </Button>
        </div>
      </div>

      {/* 加载状态 */}
      {isLoading && <LoadingState />}

      {/* 错误状态 */}
      {inventoryError && !isLoading && (
        <EmptyState message="数据加载失败，请检查网络连接" icon={AlertCircle} />
      )}

      {/* 有数据时显示内容 */}
      {!isLoading && !inventoryError && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <Package className="h-4 w-4" />
              库存总览
            </TabsTrigger>
            <TabsTrigger value="sku-cost" className="gap-2">
              <Layers className="h-4 w-4" />
              SKU成本
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Bell className="h-4 w-4" />
              成本预警
            </TabsTrigger>
            <TabsTrigger value="optimization" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              优化建议
            </TabsTrigger>
            <TabsTrigger value="costing" className="gap-2">
              <Settings className="h-4 w-4" />
              计价对比
            </TabsTrigger>
          </TabsList>

          {/* 库存总览 Tab */}
          <TabsContent value="overview" className="space-y-6">
            {hasOverviewData ? (
              <>
                {/* 核心指标卡片 */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">库存总价值</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(inventoryOverview.totalValue)}</div>
                      <p className="text-xs text-muted-foreground">
                        共 {inventoryOverview.totalSKU} 个SKU
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">库存周转天数</CardTitle>
                      <Timer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{inventoryOverview.turnoverDays}天</div>
                      <p className="text-xs text-muted-foreground">
                        月周转率 {inventoryOverview.monthlyTurnover}次
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">平均成本</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">¥{inventoryOverview.avgCost}</div>
                      <p className={cn(
                        "text-xs flex items-center gap-1",
                        inventoryOverview.costChangeRate >= 0 ? "text-danger" : "text-success"
                      )}>
                        {inventoryOverview.costChangeRate >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {inventoryOverview.costChangeRate >= 0 ? "+" : ""}{inventoryOverview.costChangeRate}% 较上月
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">库存健康度</CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-success/10 text-success">{inventoryOverview.healthySKU}</Badge>
                        <Badge className="bg-warning/10 text-warning">{inventoryOverview.warningSKU}</Badge>
                        <Badge className="bg-danger/10 text-danger">{inventoryOverview.dangerSKU}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">健康 / 预警 / 滞销</p>
                    </CardContent>
                  </Card>
                </div>

                {/* 成本构成和库龄分布 */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* 成本构成 */}
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">成本构成分析</CardTitle>
                      <CardDescription>库存成本的各项构成比例</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {costComposition.purchase.value > 0 ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">采购成本</span>
                              <span className="font-bold">{formatCurrency(costComposition.purchase.value)}</span>
                            </div>
                            <Progress value={costComposition.purchase.percent} className="h-2" />
                            <span className="text-xs text-muted-foreground">{costComposition.purchase.percent}%</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">物流成本</span>
                              <span className="font-bold">{formatCurrency(costComposition.freight.value)}</span>
                            </div>
                            <Progress value={costComposition.freight.percent} className="h-2" />
                            <span className="text-xs text-muted-foreground">{costComposition.freight.percent}%</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">仓储成本</span>
                              <span className="font-bold">{formatCurrency(costComposition.storage.value)}</span>
                            </div>
                            <Progress value={costComposition.storage.percent} className="h-2" />
                            <span className="text-xs text-muted-foreground">{costComposition.storage.percent}%</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">其他成本</span>
                              <span className="font-bold">{formatCurrency(costComposition.other.value)}</span>
                            </div>
                            <Progress value={costComposition.other.percent} className="h-2" />
                            <span className="text-xs text-muted-foreground">{costComposition.other.percent}%</span>
                          </div>
                        </div>
                      ) : (
                        <EmptyState message="暂无成本构成数据" icon={BarChart3} />
                      )}
                    </CardContent>
                  </Card>

                  {/* 库龄分布 */}
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">库龄分布</CardTitle>
                      <CardDescription>按入库时间分析库存健康度</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {ageDistribution.length > 0 ? (
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
                      ) : (
                        <EmptyState message="暂无库龄分布数据" icon={History} />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <EmptyState message="暂无库存数据" icon={Package} />
                </CardContent>
              </Card>
            )}
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
                {hasSkuCostData ? (
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
                ) : (
                  <EmptyState message="暂无SKU成本数据" icon={Layers} />
                )}
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
                  <div className="text-3xl font-bold text-danger">
                    {costAlerts.filter(a => a.impact === '高').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">需要立即处理</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-warning">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">中影响预警</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning">
                    {costAlerts.filter(a => a.impact === '中').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">建议尽快处理</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">低影响预警</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {costAlerts.filter(a => a.impact === '低').length}
                  </div>
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
                {hasAlertsData ? (
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
                ) : (
                  <EmptyState message="暂无成本预警" icon={Bell} />
                )}
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
                  <div className="text-3xl font-bold text-primary">{formatCurrency(totalPotentialValue)}</div>
                  <p className="text-xs text-muted-foreground mt-1">通过优化建议可释放的资金</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">待处理建议</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{turnoverSuggestions.length} <span className="text-sm font-normal text-muted-foreground">条</span></div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-danger">高优先 {turnoverSuggestions.filter(s => s.priority === '高').length}</span>
                    <span className="text-warning">中优先 {turnoverSuggestions.filter(s => s.priority === '中').length}</span>
                    <span className="text-muted-foreground">低优先 {turnoverSuggestions.filter(s => s.priority === '低').length}</span>
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
                {hasSuggestionsData ? (
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
                ) : (
                  <EmptyState message="暂无优化建议" icon={Lightbulb} />
                )}
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
                {costingMethods.length > 0 ? (
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
                ) : (
                  <EmptyState message="暂无计价方式数据" icon={Settings} />
                )}
              </CardContent>
            </Card>

            {/* 库存周转趋势 */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>库存周转天数趋势</CardTitle>
                <CardDescription>近6个月库存周转天数变化（目标：30天）</CardDescription>
              </CardHeader>
              <CardContent>
                {turnoverTrend.length > 0 ? (
                  <>
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
                  </>
                ) : (
                  <EmptyState message="暂无周转趋势数据" icon={Timer} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
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
