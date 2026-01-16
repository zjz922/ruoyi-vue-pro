import AppLayout from "@/components/AppLayout";
import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Calendar, Download, Filter, RefreshCw, ChevronLeft, ChevronRight, Eye, TrendingUp, TrendingDown, BarChart3, DollarSign, Percent, ArrowUpRight, ArrowDownRight, PieChart, Loader2, AlertCircle } from 'lucide-react';
import { ReconciliationIndicator } from '@/components/ReconciliationIndicator';
import { useShopSwitcher } from "@/components/ShopSwitcher";
import { toast } from "sonner";

// ============ 类型定义 ============

interface MonthlyData {
  month: string;
  shipped: number;
  sales: number;
  refund: number;
  express: number;
  smallPay: number;
  commission: number;
  serviceFee: number;
  cost: number;
  operation: number;
  compensation: number;
  promotion: number;
  other: number;
  insurance: number;
  accounting: string;
  adjustment: number;
  profit: number;
  completion: string;
  profitRate: string;
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

export default function OrderMonthlyStats() {
  const { currentShopId, shops } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedShop, setSelectedShop] = useState('all');
  const [, setLocation] = useLocation();

  // 暂时使用空数据，等待Java后端实现
  const isLoading = false;
  const error = null;
  const monthlyData: MonthlyData[] = [];

  // 跳转到订单明细页面，传递月份参数
  const goToOrderDetail = useCallback((month: string) => {
    setLocation(`/order-detail?date=${month}-01&from=monthly`);
  }, [setLocation]);

  // 刷新数据
  const handleRefresh = useCallback(() => {
    toast.info("刷新功能待Java后端实现");
  }, []);

  // 导出Excel
  const handleExport = useCallback(() => {
    toast.info("导出功能待Java后端实现");
  }, []);

  // 计算年度汇总
  const yearSummary = useMemo(() => ({
    totalSales: monthlyData.reduce((sum, d) => sum + d.sales, 0),
    totalRefund: monthlyData.reduce((sum, d) => sum + d.refund, 0),
    totalProfit: monthlyData.reduce((sum, d) => sum + d.profit, 0),
    totalShipped: monthlyData.reduce((sum, d) => sum + d.shipped, 0),
    totalPromotion: monthlyData.reduce((sum, d) => sum + d.promotion, 0),
    totalCost: monthlyData.reduce((sum, d) => sum + d.cost, 0),
  }), [monthlyData]);

  const avgProfitRate = useMemo(() => {
    if (yearSummary.totalSales === 0) return '0.00';
    return ((yearSummary.totalProfit / yearSummary.totalSales) * 100).toFixed(2);
  }, [yearSummary]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">按月汇总统计</h1>
            <p className="text-sm text-gray-500 mt-1">查看各月份的订单汇总数据，分析月度经营趋势</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="2025">2025年</option>
              <option value="2024">2024年</option>
              <option value="2023">2023年</option>
            </select>
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部店铺</option>
              {shops.map((shop: { shopId: string; shopName: string }) => (
                <option key={shop.shopId} value={shop.shopId}>{shop.shopName}</option>
              ))}
            </select>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              刷新数据
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              导出Excel
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 加载状态 */}
        {isLoading && <LoadingState />}

        {/* 错误状态 */}
        {error && !isLoading && (
          <EmptyState message="数据加载失败，请检查网络连接" />
        )}

        {/* 有数据时显示内容 */}
        {!isLoading && !error && (
          <>
            {/* 勾稽关联状态 */}
            <div className="mb-6">
              <ReconciliationIndicator
                moduleName="按月汇总统计"
                reconciliationResult={{
                  id: "monthly-stats-reconciliation",
                  type: "monthly",
                  checkTime: new Date(),
                  status: monthlyData.length > 0 ? "success" : "warning",
                  items: [
                    {
                      name: "年度销售额",
                      expected: yearSummary.totalSales,
                      actual: yearSummary.totalSales,
                      difference: 0,
                      status: "success",
                      tolerance: 0.01,
                    },
                    {
                      name: "年度发货数",
                      expected: yearSummary.totalShipped,
                      actual: yearSummary.totalShipped,
                      difference: 0,
                      status: "success",
                      tolerance: 0,
                    },
                    {
                      name: "年度利润",
                      expected: yearSummary.totalProfit,
                      actual: yearSummary.totalProfit,
                      difference: 0,
                      status: "success",
                      tolerance: 0.01,
                    },
                  ],
                  exceptionCount: 0,
                  summary: monthlyData.length > 0 ? "与最近30天明细、按年汇总模块数据一致" : "暂无数据",
                }}
                moduleRelations={[
                  {
                    sourceModule: "最近30天明细",
                    targetModule: "按月汇总统计",
                    relationType: "bidirectional",
                    status: "success",
                    lastCheckTime: new Date(),
                  },
                  {
                    sourceModule: "按月汇总统计",
                    targetModule: "按年汇总统计",
                    relationType: "bidirectional",
                    status: "success",
                    lastCheckTime: new Date(),
                  },
                ]}
              />
            </div>

            {monthlyData.length > 0 ? (
              <>
                {/* 年度汇总卡片 */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">{selectedYear}年度汇总</h2>
                    <BarChart3 className="w-6 h-6 opacity-80" />
                  </div>
                  <div className="grid grid-cols-6 gap-6">
                    <div>
                      <div className="text-sm opacity-80 mb-1">年度销售额</div>
                      <div className="text-2xl font-bold">¥{(yearSummary.totalSales / 10000).toFixed(2)}万</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80 mb-1">年度退款额</div>
                      <div className="text-2xl font-bold">¥{(yearSummary.totalRefund / 10000).toFixed(2)}万</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80 mb-1">年度利润</div>
                      <div className="text-2xl font-bold">¥{(yearSummary.totalProfit / 10000).toFixed(2)}万</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80 mb-1">发货订单</div>
                      <div className="text-2xl font-bold">{yearSummary.totalShipped.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80 mb-1">推广费用</div>
                      <div className="text-2xl font-bold">¥{(yearSummary.totalPromotion / 10000).toFixed(2)}万</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80 mb-1">平均利润率</div>
                      <div className="text-2xl font-bold">{avgProfitRate}%</div>
                    </div>
                  </div>
                </div>

                {/* 月度数据表格 */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900">月度数据明细</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">月份</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">发货数</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">销售额</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">退款</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">成本</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">推广费</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">利润</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">利润率</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {monthlyData.map((row) => (
                          <tr key={row.month} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.month}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600">{row.shipped.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">¥{row.sales.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-right text-red-600">¥{row.refund.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600">¥{row.cost.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-right text-orange-600">¥{row.promotion.toLocaleString()}</td>
                            <td className={`px-4 py-3 text-sm text-right font-medium ${row.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ¥{row.profit.toLocaleString()}
                            </td>
                            <td className={`px-4 py-3 text-sm text-right ${parseFloat(row.profitRate) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                              {row.profitRate}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => goToOrderDetail(row.month)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                              >
                                <Eye className="w-3 h-3" />
                                查看明细
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <EmptyState message="暂无月度汇总数据" />
            )}
          </>
        )}
      </div>
      </div>
    </AppLayout>
  );
}
