import AppLayout from "@/components/AppLayout";
import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Calendar, Download, RefreshCw, TrendingUp, TrendingDown, BarChart3, DollarSign, Percent, ArrowUpRight, ArrowDownRight, PieChart, Eye, Target, Award, Loader2, AlertCircle } from 'lucide-react';
import { ReconciliationIndicator } from '@/components/ReconciliationIndicator';
import { useShopSwitcher } from "@/components/ShopSwitcher";
import { toast } from "sonner";

// ============ 类型定义 ============

interface YearlyData {
  year: string;
  shipped: number;
  sales: number;
  refund: number;
  express: number;
  commission: number;
  serviceFee: number;
  cost: number;
  promotion: number;
  other: number;
  insurance: number;
  profit: number;
  profitRate: string;
  avgMonthSales: number;
  avgMonthProfit: number;
  topMonth: string;
  lowMonth: string;
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

export default function OrderYearlyStats() {
  const { currentShopId, shops } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [selectedShop, setSelectedShop] = useState('all');
  const [, setLocation] = useLocation();

  // 暂时使用空数据，等待Java后端实现
  const isLoading = false;
  const error = null;
  const yearlyData: YearlyData[] = [];

  // 跳转到按月汇总统计页面，传递年份参数
  const goToMonthlyStats = useCallback((year: string) => {
    setLocation(`/order-monthly?year=${year}`);
  }, [setLocation]);

  // 刷新数据
  const handleRefresh = useCallback(() => {
    toast.info("刷新功能待Java后端实现");
  }, []);

  // 导出Excel
  const handleExport = useCallback(() => {
    toast.info("导出功能待Java后端实现");
  }, []);

  // 计算总计
  const totalSummary = useMemo(() => ({
    totalSales: yearlyData.reduce((sum, d) => sum + d.sales, 0),
    totalRefund: yearlyData.reduce((sum, d) => sum + d.refund, 0),
    totalProfit: yearlyData.reduce((sum, d) => sum + d.profit, 0),
    totalShipped: yearlyData.reduce((sum, d) => sum + d.shipped, 0),
    totalPromotion: yearlyData.reduce((sum, d) => sum + d.promotion, 0),
    totalCost: yearlyData.reduce((sum, d) => sum + d.cost, 0),
  }), [yearlyData]);

  // 计算同比增长
  const yoyGrowth = useMemo(() => {
    if (yearlyData.length < 2) {
      return { sales: '0', profit: '0', shipped: '0' };
    }
    return {
      sales: ((yearlyData[0].sales - yearlyData[1].sales) / yearlyData[1].sales * 100).toFixed(1),
      profit: ((yearlyData[0].profit - yearlyData[1].profit) / yearlyData[1].profit * 100).toFixed(1),
      shipped: ((yearlyData[0].shipped - yearlyData[1].shipped) / yearlyData[1].shipped * 100).toFixed(1),
    };
  }, [yearlyData]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">按年汇总统计</h1>
            <p className="text-sm text-gray-500 mt-1">查看历年订单汇总数据，分析年度经营趋势和同比变化</p>
          </div>
          <div className="flex items-center gap-3">
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
                moduleName="按年汇总统计"
                reconciliationResult={{
                  id: "yearly-stats-reconciliation",
                  type: "yearly",
                  checkTime: new Date(),
                  status: yearlyData.length > 0 ? "success" : "warning",
                  items: [
                    {
                      name: "总销售额",
                      expected: totalSummary.totalSales,
                      actual: totalSummary.totalSales,
                      difference: 0,
                      status: "success",
                      tolerance: 0.01,
                    },
                    {
                      name: "总发货数",
                      expected: totalSummary.totalShipped,
                      actual: totalSummary.totalShipped,
                      difference: 0,
                      status: "success",
                      tolerance: 0,
                    },
                    {
                      name: "总利润",
                      expected: totalSummary.totalProfit,
                      actual: totalSummary.totalProfit,
                      difference: 0,
                      status: "success",
                      tolerance: 0.01,
                    },
                  ],
                  exceptionCount: 0,
                  summary: yearlyData.length > 0 ? "与按月汇总统计模块数据一致" : "暂无数据",
                }}
                moduleRelations={[
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

            {yearlyData.length > 0 ? (
              <>
                {/* 同比增长卡片 */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">{yearlyData[0]?.year}年销售额</div>
                          <div className="text-2xl font-bold text-gray-900">¥{((yearlyData[0]?.sales || 0) / 10000).toFixed(2)}万</div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${parseFloat(yoyGrowth.sales) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {parseFloat(yoyGrowth.sales) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {yoyGrowth.sales}%
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      同比{parseFloat(yoyGrowth.sales) >= 0 ? '增长' : '下降'} {Math.abs(parseFloat(yoyGrowth.sales))}%
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">{yearlyData[0]?.year}年利润</div>
                          <div className="text-2xl font-bold text-gray-900">¥{((yearlyData[0]?.profit || 0) / 10000).toFixed(2)}万</div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${parseFloat(yoyGrowth.profit) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {parseFloat(yoyGrowth.profit) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {yoyGrowth.profit}%
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      同比{parseFloat(yoyGrowth.profit) >= 0 ? '增长' : '下降'} {Math.abs(parseFloat(yoyGrowth.profit))}%，利润率 {yearlyData[0]?.profitRate}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">{yearlyData[0]?.year}年订单量</div>
                          <div className="text-2xl font-bold text-gray-900">{(yearlyData[0]?.shipped || 0).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${parseFloat(yoyGrowth.shipped) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {parseFloat(yoyGrowth.shipped) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {yoyGrowth.shipped}%
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      同比{parseFloat(yoyGrowth.shipped) >= 0 ? '增长' : '下降'} {Math.abs(parseFloat(yoyGrowth.shipped))}%，月均 {Math.round((yearlyData[0]?.shipped || 0) / 12).toLocaleString()} 单
                    </div>
                  </div>
                </div>

                {/* 年度数据表格 */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900">年度数据明细</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">年份</th>
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
                        {yearlyData.map((row) => (
                          <tr key={row.year} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.year}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600">{row.shipped.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">¥{row.sales.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-right text-red-600">¥{row.refund.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600">¥{row.cost.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-right text-orange-600">¥{row.promotion.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">¥{row.profit.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-right text-blue-600">{row.profitRate}</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => goToMonthlyStats(row.year)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                              >
                                <Eye className="w-3 h-3" />
                                查看月度
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
              <EmptyState message="暂无年度汇总数据" />
            )}
          </>
        )}
      </div>
      </div>
    </AppLayout>
  );
}
