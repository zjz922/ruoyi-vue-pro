import React, { useState, useMemo, useCallback } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  validateOrderCostReconciliation,
  validateOrderInventoryReconciliation,
  validateOrderPromotionReconciliation,
  getDifferenceStyle,
  getDifferenceLabel,
  formatReconciliationRate,
  isReconciliationRateAchieved,
  ReconciliationDifference,
  ReconciliationSummary,
} from '@/lib/reconciliation-validator';
import { useShopSwitcher } from "@/components/ShopSwitcher";
import { toast } from "sonner";

// ============ 类型定义 ============

interface OrderData {
  id: number;
  orderNo: string;
  sku: string;
  quantity: number;
  productCost: number;
  promotionFee: number;
}

interface CostData {
  id: number;
  sku: string;
  currentCost: number;
}

interface InventoryData {
  id: number;
  sku: string;
  quantity: number;
  availableQty: number;
}

interface PromotionExpenseData {
  id: number;
  date: string;
  cost: number;
}

interface DailyStatsData {
  id: number;
  date: string;
  promotionFee: number;
}

// ============ 空状态组件 ============
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <AlertCircle className="h-10 w-10 mb-3 opacity-50" />
      <p className="text-sm">{message}</p>
      <p className="text-xs mt-1">请确认Java后端服务已启动</p>
    </div>
  );
}

// ============ 加载状态组件 ============
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
      <p className="text-sm text-gray-500">正在加载数据...</p>
    </div>
  );
}

/**
 * 数据勾稽仪表板
 * 
 * 展示订单、成本、库存、推广费等多维度的数据勾稽情况
 */
export default function ReconciliationDashboard() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [filterType, setFilterType] = useState('all');

  // 暂时使用空数据，等待Java后端实现
  const isLoading = false;
  const error = null;

  // 空数据
  const orders: OrderData[] = [];
  const costs: CostData[] = [];
  const inventory: InventoryData[] = [];
  const promotionExpense: PromotionExpenseData[] = [];
  const dailyStats: DailyStatsData[] = [];

  // 刷新数据
  const handleRefresh = useCallback(() => {
    toast.info("刷新功能待Java后端实现");
  }, []);

  // 导出报告
  const handleExport = useCallback(() => {
    toast.info("导出功能待Java后端实现");
  }, []);

  // 查询
  const handleQuery = useCallback(() => {
    toast.info("查询功能待Java后端实现");
  }, []);

  // 执行勾稽验证
  const costReconciliation = useMemo(() => 
    validateOrderCostReconciliation(orders, costs),
    [orders, costs]
  );

  const inventoryReconciliation = useMemo(() => 
    validateOrderInventoryReconciliation(orders, inventory),
    [orders, inventory]
  );

  const promotionReconciliation = useMemo(() => 
    validateOrderPromotionReconciliation(dailyStats, promotionExpense),
    [dailyStats, promotionExpense]
  );

  // 汇总所有差异
  const allDifferences = useMemo(() => [
    ...costReconciliation.differences,
    ...inventoryReconciliation.differences,
    ...promotionReconciliation.differences,
  ], [costReconciliation, inventoryReconciliation, promotionReconciliation]);

  // 按类型筛选差异
  const filteredDifferences = useMemo(() => 
    filterType === 'all' 
      ? allDifferences 
      : allDifferences.filter(d => d.type === filterType),
    [allDifferences, filterType]
  );

  // 计算总体勾稽率
  const { overallReconciliationRate, criticalCount, warningCount, infoCount } = useMemo(() => {
    const totalRecords = orders.length + dailyStats.length;
    const matchedRecords = 
      costReconciliation.summary.matchedRecords + 
      inventoryReconciliation.summary.matchedRecords + 
      promotionReconciliation.summary.matchedRecords;
    const rate = totalRecords > 0 ? (matchedRecords / totalRecords) * 100 : 0;
    
    return {
      overallReconciliationRate: rate,
      criticalCount: allDifferences.filter(d => d.level === 'CRITICAL').length,
      warningCount: allDifferences.filter(d => d.level === 'WARNING').length,
      infoCount: allDifferences.filter(d => d.level === 'INFO').length,
    };
  }, [orders, dailyStats, costReconciliation, inventoryReconciliation, promotionReconciliation, allDifferences]);

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">数据勾稽仪表板</h1>
          <p className="text-gray-600 mt-2">订单、成本、库存、推广费的多维度数据一致性检查</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 时间范围选择 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-2">开始日期</label>
              <Input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-2">结束日期</label>
              <Input 
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <Button onClick={handleQuery}>查询</Button>
          </div>
        </CardContent>
      </Card>

      {/* 加载状态 */}
      {isLoading && <LoadingState />}

      {/* 错误状态 */}
      {error && !isLoading && (
        <EmptyState message="数据加载失败，请检查网络连接" />
      )}

      {/* 有数据时显示内容 */}
      {!isLoading && !error && (
        <>
          {/* KPI卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 总勾稽率 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">总勾稽率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className={cn(
                      "text-3xl font-bold",
                      isReconciliationRateAchieved(overallReconciliationRate) ? "text-green-600" : "text-orange-600"
                    )}>
                      {formatReconciliationRate(overallReconciliationRate)}
                    </span>
                  </div>
                  <Progress value={overallReconciliationRate} className="h-2" />
                  <p className="text-xs text-gray-500">目标: 99.5%</p>
                </div>
              </CardContent>
            </Card>

            {/* 成本勾稽率 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">成本勾稽率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {formatReconciliationRate(costReconciliation.summary.matchRate)}
                    </span>
                  </div>
                  <Progress value={costReconciliation.summary.matchRate} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {costReconciliation.summary.matchedRecords}/{costReconciliation.summary.totalRecords} 订单
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 库存勾稽率 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">库存勾稽率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-purple-600">
                      {formatReconciliationRate(inventoryReconciliation.summary.matchRate)}
                    </span>
                  </div>
                  <Progress value={inventoryReconciliation.summary.matchRate} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {inventoryReconciliation.summary.matchedRecords}/{inventoryReconciliation.summary.totalRecords} 订单
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 推广费勾稽率 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">推广费勾稽率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-amber-600">
                      {formatReconciliationRate(promotionReconciliation.summary.matchRate)}
                    </span>
                  </div>
                  <Progress value={promotionReconciliation.summary.matchRate} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {promotionReconciliation.summary.matchedRecords}/{promotionReconciliation.summary.totalRecords} 天
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 差异统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 严重差异 */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-red-900">严重差异</CardTitle>
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
                <p className="text-xs text-red-600 mt-2">需要立即处理</p>
              </CardContent>
            </Card>

            {/* 警告差异 */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-orange-900">警告差异</CardTitle>
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{warningCount}</div>
                <p className="text-xs text-orange-600 mt-2">定期审查</p>
              </CardContent>
            </Card>

            {/* 提示差异 */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-blue-900">提示差异</CardTitle>
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{infoCount}</div>
                <p className="text-xs text-blue-600 mt-2">月度汇总</p>
              </CardContent>
            </Card>
          </div>

          {/* 差异详情 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>差异详情</CardTitle>
                  <CardDescription>查看所有勾稽差异记录</CardDescription>
                </div>
                <div className="flex gap-2">
                  <select 
                    className="px-3 py-2 border rounded-lg text-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">全部类型</option>
                    <option value="COST">成本差异</option>
                    <option value="INVENTORY">库存差异</option>
                    <option value="PROMOTION">推广费差异</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredDifferences.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>类型</TableHead>
                      <TableHead>关联ID</TableHead>
                      <TableHead>差异描述</TableHead>
                      <TableHead>预期值</TableHead>
                      <TableHead>实际值</TableHead>
                      <TableHead>差异金额</TableHead>
                      <TableHead>级别</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDifferences.map((diff, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Badge variant="outline">{getDifferenceLabel(diff.type)}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{diff.sourceId}</TableCell>
                        <TableCell>{diff.message}</TableCell>
                        <TableCell>¥{diff.targetValue.toFixed(2)}</TableCell>
                        <TableCell>¥{diff.sourceValue.toFixed(2)}</TableCell>
                        <TableCell className={getDifferenceStyle(String(diff.difference))}>
                          ¥{diff.difference.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            diff.level === 'CRITICAL' && 'bg-red-100 text-red-800',
                            diff.level === 'WARNING' && 'bg-orange-100 text-orange-800',
                            diff.level === 'INFO' && 'bg-blue-100 text-blue-800',
                          )}>
                            {diff.level === 'CRITICAL' ? '严重' : diff.level === 'WARNING' ? '警告' : '提示'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState message="暂无差异数据" />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
