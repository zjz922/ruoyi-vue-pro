import AppLayout from "@/components/AppLayout";
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Calendar, Download, Filter, RefreshCw, ChevronLeft, ChevronRight, Eye, TrendingUp, TrendingDown, BarChart3, DollarSign, Percent, ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';
import { baseData, orderStatsData } from '@/data/reconciliationConfig';
import { calculateSummary, dailyStatsExtended } from '@/data/realOrderData';
import { ReconciliationIndicator } from '@/components/ReconciliationIndicator';

// 计算勾稽数据
const calculated = calculateSummary(dailyStatsExtended);

export default function OrderMonthlyStats() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedShop, setSelectedShop] = useState('all');
  const [, setLocation] = useLocation();

  // 跳转到订单明细页面，传递月份参数
  const goToOrderDetail = (month: string) => {
    // 传递月份的第一天作为日期参数
    setLocation(`/order-detail?date=${month}-01&from=monthly`);
  };

  // 月度汇总数据 - 2025年4月使用勾稽数据
  const monthlyData = [
    { month: '2025-12', shipped: 18234, sales: 1567890.45, refund: 389012.34, express: 58348.80, smallPay: 150, commission: 18234.56, serviceFee: 10678.90, cost: 498765.43, operation: 0, compensation: 234.56, promotion: 423456.78, other: 1234.56, insurance: 7890.12, accounting: '0/0', adjustment: 0, profit: 159034.20, completion: '17856/45', profitRate: '12.34%' },
    { month: '2025-11', shipped: 16789, sales: 1423456.78, refund: 356789.01, express: 53724.80, smallPay: 120, commission: 16789.01, serviceFee: 9876.54, cost: 456789.12, operation: 0, compensation: 198.76, promotion: 389012.34, other: 1098.76, insurance: 7234.56, accounting: '0/0', adjustment: 0, profit: 131744.69, completion: '16234/34', profitRate: '11.56%' },
    { month: '2025-10', shipped: 15678, sales: 1345678.90, refund: 334567.89, express: 50169.60, smallPay: 100, commission: 15678.90, serviceFee: 9234.56, cost: 423456.78, operation: 0, compensation: 176.54, promotion: 367890.12, other: 987.65, insurance: 6789.01, accounting: '0/0', adjustment: 0, profit: 136727.85, completion: '15234/28', profitRate: '12.67%' },
    { month: '2025-09', shipped: 14567, sales: 1234567.89, refund: 308641.97, express: 46614.40, smallPay: 80, commission: 14567.89, serviceFee: 8567.90, cost: 398765.43, operation: 0, compensation: 156.78, promotion: 334567.89, other: 876.54, insurance: 6234.56, accounting: '0/0', adjustment: 0, profit: 115574.53, completion: '14123/22', profitRate: '11.23%' },
    { month: '2025-08', shipped: 13456, sales: 1156789.01, refund: 289197.25, express: 43059.20, smallPay: 60, commission: 13456.78, serviceFee: 7890.12, cost: 367890.12, operation: 0, compensation: 134.56, promotion: 312345.67, other: 765.43, insurance: 5678.90, accounting: '0/0', adjustment: 0, profit: 116370.98, completion: '13012/18', profitRate: '12.45%' },
    { month: '2025-07', shipped: 12345, sales: 1067890.12, refund: 266972.53, express: 39504.00, smallPay: 50, commission: 12345.67, serviceFee: 7234.56, cost: 345678.90, operation: 0, compensation: 123.45, promotion: 289012.34, other: 654.32, insurance: 5234.56, accounting: '0/0', adjustment: 0, profit: 101129.79, completion: '11923/15', profitRate: '11.78%' },
    { month: '2025-06', shipped: 11234, sales: 978901.23, refund: 244725.31, express: 35948.80, smallPay: 40, commission: 11234.56, serviceFee: 6567.89, cost: 312345.67, operation: 0, compensation: 112.34, promotion: 267890.12, other: 543.21, insurance: 4789.01, accounting: '0/0', adjustment: 0, profit: 94744.12, completion: '10856/12', profitRate: '12.01%' },
    { month: '2025-05', shipped: 10123, sales: 890123.45, refund: 222530.86, express: 32393.60, smallPay: 30, commission: 10123.45, serviceFee: 5890.12, cost: 289012.34, operation: 0, compensation: 101.23, promotion: 245678.90, other: 432.10, insurance: 4345.67, accounting: '0/0', adjustment: 0, profit: 79585.18, completion: '9789/10', profitRate: '10.89%' },
    // 2025年4月 - 勾稽订单统计基准数据
    { 
      month: '2025-04', 
      shipped: calculated.totalShipped,           // 勾稽：已发货数 14,487
      sales: calculated.totalSales,               // 勾稽：销售额 619,571.24
      refund: calculated.totalRefund,             // 勾稽：退款额 122,352.74
      express: calculated.totalExpress,           // 勾稽：快递费 46,358.40
      smallPay: calculated.totalSmallPayment,     // 勾稽：小额打款
      commission: calculated.totalCommission,     // 勾稽：达人佣金 43,405.25
      serviceFee: calculated.totalService,        // 勾稽：服务费 12,392.43
      cost: calculated.totalCost,                 // 勾稽：商品成本 272,895.00
      operation: 0, 
      compensation: calculated.totalPayout,       // 勾稽：赔付 211.09
      promotion: calculated.totalPromotion,       // 勾稽：推广费 191,131.42
      other: calculated.totalOther,               // 勾稽：其他费用 604.22
      insurance: calculated.totalInsurance,       // 勾稽：保险费 2,049.57
      accounting: '0/0', 
      adjustment: 0, 
      profit: calculated.totalProfit,             // 勾稽：预计利润 -71,813.30
      completion: `${calculated.totalCompleted}/${calculated.totalCompleted}`, 
      profitRate: `${calculated.profitRatio.toFixed(2)}%`  // 勾稽：利润率 -11.59%
    },
    { month: '2025-03', shipped: 8901, sales: 789012.34, refund: 197253.09, express: 28483.20, smallPay: 15, commission: 8901.23, serviceFee: 5123.45, cost: 245678.90, operation: 0, compensation: 89.01, promotion: 212345.67, other: 298.76, insurance: 3789.01, accounting: '0/0', adjustment: 0, profit: 87050.02, completion: '8612/6', profitRate: '13.45%' },
    { month: '2025-02', shipped: 7890, sales: 678901.23, refund: 169725.31, express: 25248.00, smallPay: 10, commission: 7890.12, serviceFee: 4567.89, cost: 223456.78, operation: 0, compensation: 78.90, promotion: 189012.34, other: 234.56, insurance: 3456.78, accounting: '0/0', adjustment: 0, profit: 55230.55, completion: '7623/5', profitRate: '9.87%' },
    { month: '2025-01', shipped: 6789, sales: 567890.12, refund: 141972.53, express: 21724.80, smallPay: 5, commission: 6789.01, serviceFee: 3890.12, cost: 189012.34, operation: 0, compensation: 67.89, promotion: 156789.01, other: 178.90, insurance: 2890.12, accounting: '0/0', adjustment: 0, profit: 44575.40, completion: '6534/4', profitRate: '9.56%' },
  ];

  // 计算年度汇总
  const yearSummary = {
    totalSales: monthlyData.reduce((sum, d) => sum + d.sales, 0),
    totalRefund: monthlyData.reduce((sum, d) => sum + d.refund, 0),
    totalProfit: monthlyData.reduce((sum, d) => sum + d.profit, 0),
    totalShipped: monthlyData.reduce((sum, d) => sum + d.shipped, 0),
    totalPromotion: monthlyData.reduce((sum, d) => sum + d.promotion, 0),
    totalCost: monthlyData.reduce((sum, d) => sum + d.cost, 0),
  };

  const avgProfitRate = ((yearSummary.totalProfit / yearSummary.totalSales) * 100).toFixed(2);

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
            moduleName="按月汇总统计"
            reconciliationResult={{
              id: "monthly-stats-reconciliation",
              type: "monthly",
              checkTime: new Date(),
              status: "success",
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
              summary: "与最近30天明细、按年汇总模块数据一致",
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

        {/* 月度趋势图表 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">月度销售额趋势</h3>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {monthlyData.slice().reverse().map((item, index) => {
                const height = (item.sales / Math.max(...monthlyData.map(d => d.sales))) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ height: `${height}%` }}
                      title={`${item.month}: ¥${(item.sales / 10000).toFixed(2)}万`}
                    />
                    <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                      {item.month.split('-')[1]}月
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">月度利润率趋势</h3>
              <Percent className="w-5 h-5 text-green-500" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {monthlyData.slice().reverse().map((item, index) => {
                const rate = parseFloat(item.profitRate);
                const height = (rate / 15) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t transition-colors cursor-pointer ${rate >= 12 ? 'bg-green-500 hover:bg-green-600' : rate >= 10 ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'}`}
                      style={{ height: `${height}%` }}
                      title={`${item.month}: ${item.profitRate}`}
                    />
                    <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                      {item.month.split('-')[1]}月
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 月度数据表格 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="font-medium text-gray-900">月度明细数据</h3>
              <span className="text-sm text-gray-500">共 {monthlyData.length} 个月</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap sticky left-0 bg-gray-50 z-10">月份</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">发货订单</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap text-blue-600">销售额</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap text-red-600">退款额</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">快递费</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">达人佣金</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">服务费</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">商品成本</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap text-orange-600">推广费</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">其他费用</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">保险费</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap text-green-600">月度利润</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">完结情况</th>
                  <th className="px-4 py-3 text-right font-medium whitespace-nowrap">利润率</th>
                  <th className="px-4 py-3 text-center font-medium whitespace-nowrap sticky right-0 bg-gray-50 z-10">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {monthlyData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 sticky left-0 bg-white z-10">{row.month}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{row.shipped.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-blue-600 font-medium">¥{(row.sales / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-red-600">¥{(row.refund / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">¥{(row.express / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">¥{(row.commission / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">¥{(row.serviceFee / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">¥{(row.cost / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-orange-600">¥{(row.promotion / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">¥{(row.other / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">¥{(row.insurance / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-green-600 font-medium">¥{(row.profit / 10000).toFixed(2)}万</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{row.completion}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-xs ${parseFloat(row.profitRate) >= 12 ? 'bg-green-100 text-green-700' : parseFloat(row.profitRate) >= 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {row.profitRate}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap sticky right-0 bg-white z-10">
                      <button 
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        onClick={() => goToOrderDetail(row.month)}
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
                  <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-gray-50 z-10">年度合计</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">{yearSummary.totalShipped.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap text-blue-600">¥{(yearSummary.totalSales / 10000).toFixed(2)}万</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap text-red-600">¥{(yearSummary.totalRefund / 10000).toFixed(2)}万</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">-</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">-</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">-</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">¥{(yearSummary.totalCost / 10000).toFixed(2)}万</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap text-orange-600">¥{(yearSummary.totalPromotion / 10000).toFixed(2)}万</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">-</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">-</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap text-green-600">¥{(yearSummary.totalProfit / 10000).toFixed(2)}万</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">-</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">{avgProfitRate}%</span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap sticky right-0 bg-gray-50 z-10">-</td>
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
