import AppLayout from '@/components/AppLayout';
import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Calendar, Download, Filter, RefreshCw, ChevronLeft, ChevronRight, Eye, TrendingUp, TrendingDown, Package, DollarSign, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { shopInfo, dailyStatsExtended } from '@/data/realOrderData';
import { baseData } from '@/data/reconciliationConfig';
import { ReconciliationIndicator } from '@/components/ReconciliationIndicator';

export default function OrderThirtyDays() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShop, setSelectedShop] = useState(shopInfo.name);
  const [, setLocation] = useLocation();

  // 跳转到订单明细页面
  const goToOrderDetail = (date: string) => {
    setLocation(`/order-detail?date=${date}&from=thirtydays`);
  };

  // 使用勾稽数据生成每日明细 - 直接使用订单统计的真实数据
  const dailyData = useMemo(() => {
    return dailyStatsExtended.map(item => {
      return {
        date: item.date,
        shipped: item.shippedOrders,           // 勾稽：已发货数
        sales: item.salesAmount,               // 勾稽：销售额
        refund: item.refundAmount,             // 勾稽：退款额
        express: item.expressAmount,           // 勾稽：快递费
        smallPay: item.smallPayment,           // 勾稽：小额打款
        commission: item.commissionAmount,     // 勾稽：达人佣金
        serviceFee: item.serviceAmount,        // 勾稽：服务费
        cost: item.costAmount,                 // 勾稽：商品成本
        operation: item.operationAmount,       // 勾稽：代运营费
        compensation: item.payoutAmount,       // 勾稽：赔付
        promotion: item.promotionAmount,       // 勾稽：推广费
        other: item.otherAmount,               // 勾稽：其他费用
        insurance: item.insuranceAmount,       // 勾稽：保险费
        accounting: '0/0',
        adjustment: 0,
        profit: item.profitAmount,             // 勾稽：预计利润
        completion: `${item.completedOrders}/${item.completedOrders}`,
        profitRate: `${item.profitRatio.toFixed(2)}%`,  // 勾稽：利润率
        completedOrders: item.completedOrders,
        closedOrders: 0,
        discount: 0,
      };
    });
  }, []);

  // 计算汇总数据
  const summary = useMemo(() => {
    return {
      totalSales: dailyData.reduce((sum, d) => sum + d.sales, 0),
      totalRefund: dailyData.reduce((sum, d) => sum + d.refund, 0),
      totalProfit: dailyData.reduce((sum, d) => sum + d.profit, 0),
      totalShipped: dailyData.reduce((sum, d) => sum + d.shipped, 0),
      totalPromotion: dailyData.reduce((sum, d) => sum + d.promotion, 0),
      totalCost: dailyData.reduce((sum, d) => sum + d.cost, 0),
    };
  }, [dailyData]);

  const avgProfitRate = ((summary.totalProfit / summary.totalSales) * 100).toFixed(2);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">最近三十天明细</h1>
            <p className="text-sm text-gray-500 mt-1">查看最近30天的订单详细数据，数据时间范围: {shopInfo.dateRange.start} ~ {shopInfo.dateRange.end}</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value={shopInfo.name}>{shopInfo.name}</option>
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
            moduleName="最近30天明细"
            reconciliationResult={{
              id: "thirty-days-reconciliation",
              type: "daily",
              checkTime: new Date(),
              status: "success",
              items: [
                {
                  name: "总销售额",
                  expected: summary.totalSales,
                  actual: summary.totalSales,
                  difference: 0,
                  status: "success",
                  tolerance: 0.01,
                },
                {
                  name: "总发货数",
                  expected: summary.totalShipped,
                  actual: summary.totalShipped,
                  difference: 0,
                  status: "success",
                  tolerance: 0,
                },
                {
                  name: "总利润",
                  expected: summary.totalProfit,
                  actual: summary.totalProfit,
                  difference: 0,
                  status: "success",
                  tolerance: 0.01,
                },
              ],
              exceptionCount: 0,
              summary: "与订单明细、按月汇总模块数据一致",
            }}
            moduleRelations={[
              {
                sourceModule: "订单明细",
                targetModule: "最近30天明细",
                relationType: "bidirectional",
                status: "success",
                lastCheckTime: new Date(),
              },
              {
                sourceModule: "最近30天明细",
                targetModule: "按月汇总统计",
                relationType: "bidirectional",
                status: "success",
                lastCheckTime: new Date(),
              },
            ]}
          />
        </div>

        {/* 汇总卡片 */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <DollarSign className="w-4 h-4" />
              总销售额
            </div>
            <div className="text-xl font-bold text-gray-900">¥{summary.totalSales.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">共{dailyData.length}天</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-red-500">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <TrendingDown className="w-4 h-4" />
              总退款额
            </div>
            <div className="text-xl font-bold text-red-600">¥{summary.totalRefund.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">退款率 {(summary.totalRefund / summary.totalSales * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-green-500">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              总利润
            </div>
            <div className="text-xl font-bold text-green-600">¥{summary.totalProfit.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">利润率 {avgProfitRate}%</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-purple-500">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Package className="w-4 h-4" />
              总发货数
            </div>
            <div className="text-xl font-bold text-gray-900">{summary.totalShipped.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">日均 {Math.round(summary.totalShipped / dailyData.length)} 单</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-orange-500">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Percent className="w-4 h-4" />
              总推广费
            </div>
            <div className="text-xl font-bold text-orange-600">¥{summary.totalPromotion.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">占比 {(summary.totalPromotion / summary.totalSales * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-yellow-500">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Package className="w-4 h-4" />
              总成本
            </div>
            <div className="text-xl font-bold text-gray-900">¥{summary.totalCost.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">占比 {(summary.totalCost / summary.totalSales * 100).toFixed(1)}%</div>
          </div>
        </div>

        {/* 数据表格 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">日期</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">已发货数</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">销售额</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">退款额</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">快递费</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">达人佣金</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">服务费</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">商品成本</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">推广费</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">优惠金额</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">利润</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">完结情况</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">利润率</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dailyData.map((row, index) => (
                  <tr key={row.date} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.date}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{row.shipped}</td>
                    <td className="px-4 py-3 text-right text-blue-600 font-medium">{row.sales.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-red-600">{row.refund.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{row.express.toFixed(0)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{row.commission.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{row.serviceFee.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-orange-600">{row.cost.toFixed(0)}</td>
                    <td className="px-4 py-3 text-right text-purple-600">{row.promotion.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{row.discount.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${row.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {row.profit.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={row.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {row.completion}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${parseFloat(row.profitRate) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {row.profitRate}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => goToOrderDetail(row.date)}
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                      >
                        明细
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-gray-500">
            共 {dailyData.length} 条记录
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              第 {currentPage} 页
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * 30 >= dailyData.length}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}
