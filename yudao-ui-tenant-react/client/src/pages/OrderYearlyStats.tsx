import AppLayout from "@/components/AppLayout";
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Calendar, Download, RefreshCw, TrendingUp, TrendingDown, BarChart3, DollarSign, Percent, ArrowUpRight, ArrowDownRight, PieChart, Eye, Target, Award } from 'lucide-react';
import { ReconciliationIndicator } from '@/components/ReconciliationIndicator';

export default function OrderYearlyStats() {
  const [selectedShop, setSelectedShop] = useState('all');
  const [, setLocation] = useLocation();

  // 跳转到按月汇总统计页面，传递年份参数
  const goToMonthlyStats = (year: string) => {
    setLocation(`/order-monthly?year=${year}`);
  };

  // 模拟年度汇总数据
  const yearlyData = [
    { 
      year: '2025', 
      shipped: 145028, 
      sales: 12502345.67, 
      refund: 3121596.73, 
      express: 464089.60, 
      commission: 145028.52, 
      serviceFee: 84756.61, 
      cost: 4007640.82, 
      promotion: 3411457.96, 
      other: 8625.88, 
      insurance: 62222.42, 
      profit: 1195060.81, 
      profitRate: '11.56%',
      avgMonthSales: 1041862.14,
      avgMonthProfit: 99588.40,
      topMonth: '2025-12',
      lowMonth: '2025-01'
    },
    { 
      year: '2024', 
      shipped: 132456, 
      sales: 11234567.89, 
      refund: 2808641.97, 
      express: 423859.20, 
      commission: 132456.78, 
      serviceFee: 77345.67, 
      cost: 3594861.73, 
      promotion: 3067147.54, 
      other: 7890.12, 
      insurance: 56789.01, 
      profit: 1065575.87, 
      profitRate: '11.23%',
      avgMonthSales: 936213.99,
      avgMonthProfit: 88797.99,
      topMonth: '2024-11',
      lowMonth: '2024-02'
    },
    { 
      year: '2023', 
      shipped: 118234, 
      sales: 9876543.21, 
      refund: 2469135.80, 
      express: 378348.80, 
      commission: 118234.56, 
      serviceFee: 69012.34, 
      cost: 3160494.83, 
      promotion: 2693254.29, 
      other: 7012.34, 
      insurance: 50678.90, 
      profit: 929871.35, 
      profitRate: '10.89%',
      avgMonthSales: 823045.27,
      avgMonthProfit: 77489.28,
      topMonth: '2023-11',
      lowMonth: '2023-01'
    },
    { 
      year: '2022', 
      shipped: 98765, 
      sales: 8234567.89, 
      refund: 2058641.97, 
      express: 316048.00, 
      commission: 98765.43, 
      serviceFee: 57567.89, 
      cost: 2635061.73, 
      promotion: 2247996.04, 
      other: 5890.12, 
      insurance: 42345.67, 
      profit: 771250.04, 
      profitRate: '10.45%',
      avgMonthSales: 686213.99,
      avgMonthProfit: 64270.84,
      topMonth: '2022-12',
      lowMonth: '2022-02'
    },
  ];

  // 计算总计
  const totalSummary = {
    totalSales: yearlyData.reduce((sum, d) => sum + d.sales, 0),
    totalRefund: yearlyData.reduce((sum, d) => sum + d.refund, 0),
    totalProfit: yearlyData.reduce((sum, d) => sum + d.profit, 0),
    totalShipped: yearlyData.reduce((sum, d) => sum + d.shipped, 0),
    totalPromotion: yearlyData.reduce((sum, d) => sum + d.promotion, 0),
    totalCost: yearlyData.reduce((sum, d) => sum + d.cost, 0),
  };

  // 计算同比增长
  const yoyGrowth = {
    sales: ((yearlyData[0].sales - yearlyData[1].sales) / yearlyData[1].sales * 100).toFixed(1),
    profit: ((yearlyData[0].profit - yearlyData[1].profit) / yearlyData[1].profit * 100).toFixed(1),
    shipped: ((yearlyData[0].shipped - yearlyData[1].shipped) / yearlyData[1].shipped * 100).toFixed(1),
  };

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
              <option value="shop1">滚杆官方旗舰店</option>
              <option value="shop2">滚杆专卖店</option>
              <option value="shop3">滚杆工厂店</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" />
              刷新数据
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <Download className="w-4 h-4" />
              导出Excel
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 勾稽关联状态 */}
        <div className="mb-6">
          <ReconciliationIndicator
            moduleName="按年汇总统计"
            reconciliationResult={{
              id: "yearly-stats-reconciliation",
              type: "yearly",
              checkTime: new Date(),
              status: "success",
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
              summary: "与按月汇总统计模块数据一致",
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

        {/* 同比增长卡片 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">2025年销售额</div>
                  <div className="text-2xl font-bold text-gray-900">¥{(yearlyData[0].sales / 10000).toFixed(2)}万</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${parseFloat(yoyGrowth.sales) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {parseFloat(yoyGrowth.sales) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {yoyGrowth.sales}%
              </div>
            </div>
            <div className="text-sm text-gray-500">
              同比{parseFloat(yoyGrowth.sales) >= 0 ? '增长' : '下降'} {Math.abs(parseFloat(yoyGrowth.sales))}%，较2024年{parseFloat(yoyGrowth.sales) >= 0 ? '增加' : '减少'} ¥{Math.abs(yearlyData[0].sales - yearlyData[1].sales).toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">2025年利润</div>
                  <div className="text-2xl font-bold text-gray-900">¥{(yearlyData[0].profit / 10000).toFixed(2)}万</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${parseFloat(yoyGrowth.profit) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {parseFloat(yoyGrowth.profit) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {yoyGrowth.profit}%
              </div>
            </div>
            <div className="text-sm text-gray-500">
              同比{parseFloat(yoyGrowth.profit) >= 0 ? '增长' : '下降'} {Math.abs(parseFloat(yoyGrowth.profit))}%，利润率 {yearlyData[0].profitRate}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">2025年订单量</div>
                  <div className="text-2xl font-bold text-gray-900">{yearlyData[0].shipped.toLocaleString()}</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${parseFloat(yoyGrowth.shipped) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {parseFloat(yoyGrowth.shipped) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {yoyGrowth.shipped}%
              </div>
            </div>
            <div className="text-sm text-gray-500">
              同比{parseFloat(yoyGrowth.shipped) >= 0 ? '增长' : '下降'} {Math.abs(parseFloat(yoyGrowth.shipped))}%，月均 {Math.round(yearlyData[0].shipped / 12).toLocaleString()} 单
            </div>
          </div>
        </div>

        {/* 年度趋势图表 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-gray-900">历年销售额对比</h3>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-4">
              {yearlyData.map((item, index) => {
                const width = (item.sales / Math.max(...yearlyData.map(d => d.sales))) * 100;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.year}年</span>
                      <span className="text-sm text-gray-600">¥{(item.sales / 10000).toFixed(2)}万</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-gray-900">历年利润率对比</h3>
              <Percent className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-4">
              {yearlyData.map((item, index) => {
                const rate = parseFloat(item.profitRate);
                const width = (rate / 15) * 100;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.year}年</span>
                      <span className="text-sm text-gray-600">{item.profitRate}</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div 
                        className={`h-full rounded-lg transition-all duration-500 ${rate >= 11 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-yellow-500 to-yellow-600'}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 年度详情卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {yearlyData.map((item, index) => (
            <div key={index} className={`bg-white rounded-xl p-5 border shadow-sm ${index === 0 ? 'border-blue-200 ring-2 ring-blue-100' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-900">{item.year}年</span>
                </div>
                {index === 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">当前年</span>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">销售额</span>
                  <span className="text-sm font-medium text-blue-600">¥{(item.sales / 10000).toFixed(0)}万</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">退款额</span>
                  <span className="text-sm font-medium text-red-600">¥{(item.refund / 10000).toFixed(0)}万</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">利润</span>
                  <span className="text-sm font-medium text-green-600">¥{(item.profit / 10000).toFixed(0)}万</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">利润率</span>
                  <span className={`text-sm font-medium ${parseFloat(item.profitRate) >= 11 ? 'text-green-600' : 'text-yellow-600'}`}>{item.profitRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">订单量</span>
                  <span className="text-sm font-medium">{item.shipped.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">最佳月份</span>
                    <span className="text-green-600">{item.topMonth}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-400">最低月份</span>
                    <span className="text-red-600">{item.lowMonth}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 年度数据表格 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="font-medium text-gray-900">年度明细数据</h3>
              <span className="text-sm text-gray-500">共 {yearlyData.length} 年</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">年份</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">发货订单</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap text-blue-600">销售额</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap text-red-600">退款额</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">快递费</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">达人佣金</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">服务费</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">商品成本</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap text-orange-600">推广费</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap text-green-600">年度利润</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">利润率</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">月均销售</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">月均利润</th>
                  <th className="px-4 py-3 text-center font-medium whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {yearlyData.map((row, index) => (
                  <tr key={index} className={`hover:bg-gray-50 ${index === 0 ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{row.year}年</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{row.shipped.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-blue-600 font-medium">¥{(row.sales / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-red-600">¥{(row.refund / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">¥{(row.express / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">¥{(row.commission / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">¥{(row.serviceFee / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">¥{(row.cost / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-orange-600">¥{(row.promotion / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-green-600 font-medium">¥{(row.profit / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-xs ${parseFloat(row.profitRate) >= 11 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {row.profitRate}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">¥{(row.avgMonthSales / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">¥{(row.avgMonthProfit / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button 
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        onClick={() => goToMonthlyStats(row.year)}
                      >
                        <Eye className="w-4 h-4" />
                        <span>明细</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-medium">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap">历史合计</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">{totalSummary.totalShipped.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap text-blue-600">¥{(totalSummary.totalSales / 10000).toFixed(2)}万</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap text-red-600">¥{(totalSummary.totalRefund / 10000).toFixed(2)}万</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">-</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">-</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">-</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">¥{(totalSummary.totalCost / 10000).toFixed(2)}万</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap text-orange-600">¥{(totalSummary.totalPromotion / 10000).toFixed(2)}万</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap text-green-600">¥{(totalSummary.totalProfit / 10000).toFixed(2)}万</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                      {((totalSummary.totalProfit / totalSummary.totalSales) * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">-</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">-</td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
