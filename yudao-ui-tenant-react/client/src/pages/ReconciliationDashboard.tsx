import React, { useState, useMemo } from 'react';
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

/**
 * 数据勾稽仪表板
 * 
 * 展示订单、成本、库存、推广费等多维度的数据勾稽情况
 */
export default function ReconciliationDashboard() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [filterType, setFilterType] = useState('all');

  // Mock数据：订单数据
  const mockOrders = [
    { id: 1, orderNo: 'ORD-001', sku: 'SKU-001', quantity: 2, productCost: 100, promotionFee: 50 },
    { id: 2, orderNo: 'ORD-002', sku: 'SKU-002', quantity: 1, productCost: 150, promotionFee: 75 },
    { id: 3, orderNo: 'ORD-003', sku: 'SKU-001', quantity: 3, productCost: 280, promotionFee: 100 },
  ];

  // Mock数据：成本配置
  const mockCosts = [
    { id: 1, sku: 'SKU-001', currentCost: 50 },
    { id: 2, sku: 'SKU-002', currentCost: 150 },
  ];

  // Mock数据：库存
  const mockInventory = [
    { id: 1, sku: 'SKU-001', quantity: 100, availableQty: 95 },
    { id: 2, sku: 'SKU-002', quantity: 50, availableQty: 48 },
  ];

  // Mock数据：推广费
  const mockPromotionExpense = [
    { id: 1, date: '2025-01-14', cost: 200 },
  ];

  // Mock数据：每日统计
  const mockDailyStats = [
    { id: 1, date: '2025-01-14', promotionFee: 225 },
  ];

  // 执行勾稽验证
  const costReconciliation = useMemo(() => 
    validateOrderCostReconciliation(mockOrders, mockCosts),
    [mockOrders, mockCosts]
  );

  const inventoryReconciliation = useMemo(() => 
    validateOrderInventoryReconciliation(mockOrders, mockInventory),
    [mockOrders, mockInventory]
  );

  const promotionReconciliation = useMemo(() => 
    validateOrderPromotionReconciliation(mockDailyStats, mockPromotionExpense),
    [mockDailyStats, mockPromotionExpense]
  );

  // 汇总所有差异
  const allDifferences = [
    ...costReconciliation.differences,
    ...inventoryReconciliation.differences,
    ...promotionReconciliation.differences,
  ];

  // 按类型筛选差异
  const filteredDifferences = filterType === 'all' 
    ? allDifferences 
    : allDifferences.filter(d => d.type === filterType);

  // 计算总体勾稽率
  const totalRecords = mockOrders.length + mockDailyStats.length;
  const matchedRecords = 
    costReconciliation.summary.matchedRecords + 
    inventoryReconciliation.summary.matchedRecords + 
    promotionReconciliation.summary.matchedRecords;
  const overallReconciliationRate = totalRecords > 0 ? (matchedRecords / totalRecords) * 100 : 0;

  // 计算差异统计
  const criticalCount = allDifferences.filter(d => d.level === 'CRITICAL').length;
  const warningCount = allDifferences.filter(d => d.level === 'WARNING').length;
  const infoCount = allDifferences.filter(d => d.level === 'INFO').length;

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">数据勾稽仪表板</h1>
          <p className="text-gray-600 mt-2">订单、成本、库存、推广费的多维度数据一致性检查</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button variant="outline" size="sm">
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
            <Button>查询</Button>
          </div>
        </CardContent>
      </Card>

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
              <CardDescription>所有发现的数据勾稽差异</CardDescription>
            </div>
            <div className="flex gap-2">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">全部类型</option>
                <option value="ORDER_COST">成本差异</option>
                <option value="ORDER_INVENTORY">库存差异</option>
                <option value="ORDER_PROMOTION">推广费差异</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>差异类型</TableHead>
                  <TableHead>订单/日期</TableHead>
                  <TableHead>源值</TableHead>
                  <TableHead>目标值</TableHead>
                  <TableHead>差异值</TableHead>
                  <TableHead>差异率</TableHead>
                  <TableHead>等级</TableHead>
                  <TableHead>说明</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDifferences.length > 0 ? (
                  filteredDifferences.map((diff, idx) => (
                    <TableRow key={idx} className={cn("hover:bg-gray-50", getDifferenceStyle(diff.level))}>
                      <TableCell className="font-medium">
                        {diff.type === 'ORDER_COST' && '成本差异'}
                        {diff.type === 'ORDER_INVENTORY' && '库存差异'}
                        {diff.type === 'ORDER_PROMOTION' && '推广费差异'}
                        {diff.type === 'ORDER_PURCHASE' && '入库单差异'}
                      </TableCell>
                      <TableCell>{diff.sourceId}</TableCell>
                      <TableCell>¥{diff.sourceValue.toFixed(2)}</TableCell>
                      <TableCell>¥{diff.targetValue.toFixed(2)}</TableCell>
                      <TableCell>¥{diff.difference.toFixed(2)}</TableCell>
                      <TableCell>{diff.differenceRate.toFixed(2)}%</TableCell>
                      <TableCell>
                        <Badge variant={
                          diff.level === 'CRITICAL' ? 'destructive' :
                          diff.level === 'WARNING' ? 'secondary' :
                          'outline'
                        }>
                          {getDifferenceLabel(diff.level)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{diff.message}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p>没有发现差异，数据完全一致！</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 勾稽统计汇总 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 各维度勾稽率对比 */}
        <Card>
          <CardHeader>
            <CardTitle>各维度勾稽率对比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">成本勾稽率</span>
                  <span className="text-sm font-bold">{formatReconciliationRate(costReconciliation.summary.matchRate)}</span>
                </div>
                <Progress value={costReconciliation.summary.matchRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">库存勾稽率</span>
                  <span className="text-sm font-bold">{formatReconciliationRate(inventoryReconciliation.summary.matchRate)}</span>
                </div>
                <Progress value={inventoryReconciliation.summary.matchRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">推广费勾稽率</span>
                  <span className="text-sm font-bold">{formatReconciliationRate(promotionReconciliation.summary.matchRate)}</span>
                </div>
                <Progress value={promotionReconciliation.summary.matchRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 差异分布 */}
        <Card>
          <CardHeader>
            <CardTitle>差异分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">成本差异</span>
                <span className="text-lg font-bold">{costReconciliation.summary.totalDifferences}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">库存差异</span>
                <span className="text-lg font-bold">{inventoryReconciliation.summary.totalDifferences}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">推广费差异</span>
                <span className="text-lg font-bold">{promotionReconciliation.summary.totalDifferences}</span>
              </div>
              <div className="border-t pt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">总差异</span>
                <span className="text-lg font-bold text-red-600">{allDifferences.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
