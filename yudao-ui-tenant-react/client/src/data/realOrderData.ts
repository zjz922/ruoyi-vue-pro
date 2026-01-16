/**
 * 真实订单数据 - 来自滋栈官方旗舰店抖店后台导出
 * 数据时间范围: 2025-04-01 ~ 2025-04-30
 * 数据来源: 用户提供的抖店后台截图（已校验）
 * 
 * 计算公式: 销售额 = 退款额 + 快递费 + 达人佣金 + 服务费 + 商品成本 + 推广费 + 其他 + 保险费 + 赔付 + 预计利润
 */

// 店铺信息
export const shopInfo = {
  name: "滋栈官方旗舰店",
  dateRange: {
    start: "2025-04-01",
    end: "2025-04-30"
  }
};

// 统计模式类型
export type StatsMode = 'createTime' | 'paymentTime';

// 扩展的每日统计数据类型（包含所有费用字段）
export interface DailyStatsExtended {
  date: string;
  shippedOrders: number;      // 已发货数
  salesAmount: number;        // 销售额
  refundAmount: number;       // 退款额
  expressAmount: number;      // 快递费
  smallPayment: number;       // 小额打款
  commissionAmount: number;   // 达人佣金
  serviceAmount: number;      // 服务费
  costAmount: number;         // 商品成本
  operationAmount: number;    // 代运营费
  payoutAmount: number;       // 赔付
  promotionAmount: number;    // 推广费
  otherAmount: number;        // 其他费用
  insuranceAmount: number;    // 保险费
  profitAmount: number;       // 预计利润
  completedOrders: number;    // 完结订单数
  completedRatio: number;     // 完结比例
  profitRatio: number;        // 利润率
}

// 汇总数据（来自截图校验）
export const summaryData = {
  totalSales: 619571.24,           // 销售额
  totalSalesAmount: 619571.24,     // 销售额（别名）
  confirmedAmount: 489749.5,       // 已确认金额
  confirmedRatio: 98.5,            // 确认比例
  unconfirmedAmount: 7469.0,       // 尚未确认金额
  refundAmount: 122352.74,         // 退款额度
  refundRatio: 19.75,              // 退款占比
  promotionAmount: 191131.42,      // 推广费（每日汇总）
  promotionRatio: 30.85,           // 广告占比
  grossProfitRatio: -11.59,        // 预计毛利率
  completedAmount: 619571.24 - 122352.74, // 完结金额
  completedOrders: 14487,          // 完结订单数（已发货数）
  totalOrders: 18700,              // 总订单数
  // 新增字段用于勾稽
  totalDiscount: 0,                // 优惠总额（暂无数据）
  closedOrders: 18700 - 14487,     // 已关闭订单数 = 总订单 - 已发货
  avgOrderAmount: 619571.24 / 18700, // 平均订单金额
};

// 按创建时间统计的每日数据（来自截图校验）
// 计算公式验证: 销售额 = 退款额 + 快递费 + 达人佣金 + 服务费 + 商品成本 + 推广费 + 其他 + 保险费 + 赔付 + 预计利润
export const dailyStatsExtended: DailyStatsExtended[] = [
  { date: "2025-04-30", shippedOrders: 1934, salesAmount: 79553.20, refundAmount: 13833.28, expressAmount: 6188.80, smallPayment: 0, commissionAmount: 4376.76, serviceAmount: 1431.33, costAmount: 35579.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 21305.79, otherAmount: 68.46, insuranceAmount: 224.28, profitAmount: -3454.50, completedOrders: 1934, completedRatio: 100.0, profitRatio: -4.34 },
  { date: "2025-04-29", shippedOrders: 1434, salesAmount: 56932.90, refundAmount: 9820.53, expressAmount: 4588.80, smallPayment: 0, commissionAmount: 2579.40, serviceAmount: 1114.98, costAmount: 25419.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 14942.95, otherAmount: 70.82, insuranceAmount: 381.04, profitAmount: -1984.62, completedOrders: 1434, completedRatio: 100.0, profitRatio: -3.49 },
  { date: "2025-04-28", shippedOrders: 2805, salesAmount: 123021.80, refundAmount: 23463.12, expressAmount: 8976.00, smallPayment: 0, commissionAmount: 7118.41, serviceAmount: 2124.15, costAmount: 53854.50, operationAmount: 0, payoutAmount: 3.87, promotionAmount: 33637.29, otherAmount: 86.92, insuranceAmount: 129.96, profitAmount: -6372.42, completedOrders: 2805, completedRatio: 100.0, profitRatio: -5.18 },
  { date: "2025-04-27", shippedOrders: 725, salesAmount: 28303.30, refundAmount: 5446.26, expressAmount: 2320.00, smallPayment: 0, commissionAmount: 1553.53, serviceAmount: 519.73, costAmount: 11624.50, operationAmount: 0, payoutAmount: 0, promotionAmount: 8599.77, otherAmount: 61.80, insuranceAmount: 40.19, profitAmount: -1862.48, completedOrders: 725, completedRatio: 100.0, profitRatio: -6.58 },
  { date: "2025-04-26", shippedOrders: 259, salesAmount: 9265.40, refundAmount: 1495.02, expressAmount: 828.80, smallPayment: 0, commissionAmount: 481.30, serviceAmount: 192.74, costAmount: 4208.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 2663.48, otherAmount: 23.92, insuranceAmount: 61.66, profitAmount: -689.52, completedOrders: 259, completedRatio: 100.0, profitRatio: -7.44 },
  { date: "2025-04-25", shippedOrders: 390, salesAmount: 14522.40, refundAmount: 2597.70, expressAmount: 1248.00, smallPayment: 0, commissionAmount: 617.06, serviceAmount: 275.72, costAmount: 6432.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 4916.63, otherAmount: 59.80, insuranceAmount: 183.12, profitAmount: -1807.63, completedOrders: 390, completedRatio: 100.0, profitRatio: -12.45 },
  { date: "2025-04-24", shippedOrders: 796, salesAmount: 53397.20, refundAmount: 14312.82, expressAmount: 2547.20, smallPayment: 0, commissionAmount: 8093.26, serviceAmount: 797.73, costAmount: 21465.00, operationAmount: 0, payoutAmount: 4.22, promotionAmount: 2916.31, otherAmount: 27.50, insuranceAmount: 119.88, profitAmount: 3113.28, completedOrders: 796, completedRatio: 100.0, profitRatio: 5.83 },
  { date: "2025-04-23", shippedOrders: 585, salesAmount: 21204.00, refundAmount: 3557.40, expressAmount: 1872.00, smallPayment: 0, commissionAmount: 968.42, serviceAmount: 402.91, costAmount: 9449.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 8608.93, otherAmount: 71.76, insuranceAmount: 123.26, profitAmount: -3849.68, completedOrders: 585, completedRatio: 100.0, profitRatio: -18.16 },
  { date: "2025-04-22", shippedOrders: 800, salesAmount: 29400.40, refundAmount: 5014.40, expressAmount: 2560.00, smallPayment: 0, commissionAmount: 1267.76, serviceAmount: 555.32, costAmount: 13136.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 12975.38, otherAmount: 47.84, insuranceAmount: 141.40, profitAmount: -6297.70, completedOrders: 800, completedRatio: 100.0, profitRatio: -21.42 },
  { date: "2025-04-21", shippedOrders: 612, salesAmount: 22515.20, refundAmount: 3958.92, expressAmount: 1958.40, smallPayment: 0, commissionAmount: 962.99, serviceAmount: 445.06, costAmount: 9952.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 11401.72, otherAmount: 17.94, insuranceAmount: 64.95, profitAmount: -6246.78, completedOrders: 612, completedRatio: 100.0, profitRatio: -27.74 },
  { date: "2025-04-20", shippedOrders: 449, salesAmount: 25816.80, refundAmount: 6221.52, expressAmount: 1436.80, smallPayment: 0, commissionAmount: 3315.07, serviceAmount: 433.17, costAmount: 10688.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 4209.44, otherAmount: 7.18, insuranceAmount: 31.35, profitAmount: -525.73, completedOrders: 449, completedRatio: 100.0, profitRatio: -2.04 },
  { date: "2025-04-19", shippedOrders: 212, salesAmount: 8133.00, refundAmount: 1402.22, expressAmount: 678.40, smallPayment: 0, commissionAmount: 239.71, serviceAmount: 161.40, costAmount: 3616.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 3435.36, otherAmount: 29.90, insuranceAmount: 58.83, profitAmount: -1488.82, completedOrders: 212, completedRatio: 100.0, profitRatio: -18.31 },
  { date: "2025-04-18", shippedOrders: 517, salesAmount: 19674.30, refundAmount: 3946.80, expressAmount: 1654.40, smallPayment: 5.00, commissionAmount: 508.66, serviceAmount: 432.96, costAmount: 8432.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 11672.33, otherAmount: 12.46, insuranceAmount: 84.04, profitAmount: -7074.35, completedOrders: 517, completedRatio: 100.0, profitRatio: -35.96 },
  { date: "2025-04-17", shippedOrders: 297, salesAmount: 11300.40, refundAmount: 2061.30, expressAmount: 950.40, smallPayment: 0, commissionAmount: 313.60, serviceAmount: 256.98, costAmount: 5008.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 6735.15, otherAmount: 5.98, insuranceAmount: 63.63, profitAmount: -4094.64, completedOrders: 297, completedRatio: 100.0, profitRatio: -36.23 },
  { date: "2025-04-16", shippedOrders: 433, salesAmount: 28444.09, refundAmount: 8678.70, expressAmount: 1385.60, smallPayment: 0, commissionAmount: 3853.60, serviceAmount: 471.29, costAmount: 11008.00, operationAmount: 0, payoutAmount: 3.00, promotionAmount: 3408.33, otherAmount: 0, insuranceAmount: 66.74, profitAmount: -431.17, completedOrders: 433, completedRatio: 100.0, profitRatio: -1.52 },
  { date: "2025-04-15", shippedOrders: 507, salesAmount: 27269.99, refundAmount: 7578.62, expressAmount: 1622.40, smallPayment: 0, commissionAmount: 3836.36, serviceAmount: 492.77, costAmount: 14256.00, operationAmount: 0, payoutAmount: 200.00, promotionAmount: 3488.97, otherAmount: 11.96, insuranceAmount: 40.91, profitAmount: -4258.00, completedOrders: 507, completedRatio: 100.0, profitRatio: -15.61 },
  { date: "2025-04-14", shippedOrders: 276, salesAmount: 9149.57, refundAmount: 1285.70, expressAmount: 883.20, smallPayment: 0, commissionAmount: 506.38, serviceAmount: 347.03, costAmount: 4848.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 3746.84, otherAmount: 0, insuranceAmount: 24.22, profitAmount: -2491.80, completedOrders: 276, completedRatio: 100.0, profitRatio: -27.23 },
  { date: "2025-04-13", shippedOrders: 186, salesAmount: 6488.35, refundAmount: 926.90, expressAmount: 595.20, smallPayment: 0, commissionAmount: 317.70, serviceAmount: 241.08, costAmount: 3120.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 2736.81, otherAmount: 0, insuranceAmount: 18.62, profitAmount: -1467.96, completedOrders: 186, completedRatio: 100.0, profitRatio: -22.62 },
  { date: "2025-04-12", shippedOrders: 186, salesAmount: 6338.84, refundAmount: 871.21, expressAmount: 595.20, smallPayment: 0, commissionAmount: 332.43, serviceAmount: 252.14, costAmount: 3072.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 2815.55, otherAmount: 0, insuranceAmount: 17.88, profitAmount: -1617.57, completedOrders: 186, completedRatio: 100.0, profitRatio: -25.52 },
  { date: "2025-04-11", shippedOrders: 78, salesAmount: 2960.10, refundAmount: 538.20, expressAmount: 249.60, smallPayment: 0, commissionAmount: 163.26, serviceAmount: 97.78, costAmount: 1296.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 1903.02, otherAmount: 0, insuranceAmount: 13.13, profitAmount: -1300.89, completedOrders: 78, completedRatio: 100.0, profitRatio: -43.95 },
  { date: "2025-04-10", shippedOrders: 282, salesAmount: 9807.20, refundAmount: 1130.22, expressAmount: 902.40, smallPayment: 0, commissionAmount: 493.40, serviceAmount: 373.22, costAmount: 4640.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 6870.07, otherAmount: 0, insuranceAmount: 53.89, profitAmount: -4656.00, completedOrders: 282, completedRatio: 100.0, profitRatio: -47.47 },
  { date: "2025-04-09", shippedOrders: 320, salesAmount: 11690.90, refundAmount: 1853.80, expressAmount: 1024.00, smallPayment: 0, commissionAmount: 593.39, serviceAmount: 441.45, costAmount: 5280.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 7092.67, otherAmount: 0, insuranceAmount: 54.74, profitAmount: -4649.15, completedOrders: 320, completedRatio: 100.0, profitRatio: -39.77 },
  { date: "2025-04-08", shippedOrders: 234, salesAmount: 8461.70, refundAmount: 1375.40, expressAmount: 748.80, smallPayment: 0, commissionAmount: 415.14, serviceAmount: 331.99, costAmount: 3808.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 6062.07, otherAmount: 0, insuranceAmount: 9.35, profitAmount: -4289.05, completedOrders: 234, completedRatio: 100.0, profitRatio: -50.69 },
  { date: "2025-04-07", shippedOrders: 65, salesAmount: 2212.60, refundAmount: 269.10, expressAmount: 208.00, smallPayment: 0, commissionAmount: 115.41, serviceAmount: 93.47, costAmount: 1040.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 3141.30, otherAmount: 0, insuranceAmount: 16.83, profitAmount: -2671.51, completedOrders: 65, completedRatio: 100.0, profitRatio: -120.74 },
  { date: "2025-04-06", shippedOrders: 92, salesAmount: 3438.50, refundAmount: 713.60, expressAmount: 294.40, smallPayment: 0, commissionAmount: 361.29, serviceAmount: 94.27, costAmount: 1456.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 1545.26, otherAmount: 0, insuranceAmount: 2.89, profitAmount: -1029.21, completedOrders: 92, completedRatio: 100.0, profitRatio: -29.93 },
  { date: "2025-04-05", shippedOrders: 4, salesAmount: 119.60, refundAmount: 0, expressAmount: 12.80, smallPayment: 0, commissionAmount: 4.50, serviceAmount: 4.68, costAmount: 64.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 98.02, otherAmount: 0, insuranceAmount: 1.53, profitAmount: -65.93, completedOrders: 4, completedRatio: 100.0, profitRatio: -55.13 },
  { date: "2025-04-04", shippedOrders: 4, salesAmount: 89.70, refundAmount: 0, expressAmount: 12.80, smallPayment: 0, commissionAmount: 4.50, serviceAmount: 4.50, costAmount: 64.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 101.98, otherAmount: 0, insuranceAmount: 0, profitAmount: -98.08, completedOrders: 4, completedRatio: 100.0, profitRatio: -109.34 },
  { date: "2025-04-03", shippedOrders: 3, salesAmount: 0, refundAmount: 0, expressAmount: 9.60, smallPayment: 0, commissionAmount: 0, serviceAmount: 0, costAmount: 48.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 0, otherAmount: 0, insuranceAmount: 0.34, profitAmount: -57.94, completedOrders: 3, completedRatio: 100.0, profitRatio: 0 },
  { date: "2025-04-02", shippedOrders: 0, salesAmount: 0, refundAmount: 0, expressAmount: 0, smallPayment: 0, commissionAmount: 0, serviceAmount: 0, costAmount: 0, operationAmount: 0, payoutAmount: 0, promotionAmount: 0, otherAmount: 0, insuranceAmount: 0.17, profitAmount: -0.17, completedOrders: 0, completedRatio: 0, profitRatio: 0 },
  { date: "2025-04-01", shippedOrders: 2, salesAmount: 59.80, refundAmount: 0, expressAmount: 6.40, smallPayment: 0, commissionAmount: 11.96, serviceAmount: 2.58, costAmount: 32.00, operationAmount: 0, payoutAmount: 0, promotionAmount: 100.00, otherAmount: 0, insuranceAmount: 0.34, profitAmount: -93.48, completedOrders: 2, completedRatio: 100.0, profitRatio: -156.32 },
];

// 获取指定统计模式的数据
export function getStatsByMode(mode: StatsMode): DailyStatsExtended[] {
  // 目前两种模式使用相同的数据结构，后续可以根据需要区分
  return dailyStatsExtended;
}

// 计算汇总数据
export function calculateSummary(data: DailyStatsExtended[]) {
  const totalShipped = data.reduce((sum, d) => sum + d.shippedOrders, 0);
  const totalSales = data.reduce((sum, d) => sum + d.salesAmount, 0);
  const totalRefund = data.reduce((sum, d) => sum + d.refundAmount, 0);
  const totalExpress = data.reduce((sum, d) => sum + d.expressAmount, 0);
  const totalCommission = data.reduce((sum, d) => sum + d.commissionAmount, 0);
  const totalService = data.reduce((sum, d) => sum + d.serviceAmount, 0);
  const totalCost = data.reduce((sum, d) => sum + d.costAmount, 0);
  const totalPromotion = data.reduce((sum, d) => sum + d.promotionAmount, 0);
  const totalOther = data.reduce((sum, d) => sum + d.otherAmount, 0);
  const totalInsurance = data.reduce((sum, d) => sum + d.insuranceAmount, 0);
  const totalPayout = data.reduce((sum, d) => sum + d.payoutAmount, 0);
  const totalSmallPayment = data.reduce((sum, d) => sum + d.smallPayment, 0);
  const totalProfit = data.reduce((sum, d) => sum + d.profitAmount, 0);
  const totalCompleted = data.reduce((sum, d) => sum + d.completedOrders, 0);

  return {
    totalShipped,
    totalSales,
    totalRefund,
    totalExpress,
    totalCommission,
    totalService,
    totalCost,
    totalPromotion,
    totalOther,
    totalInsurance,
    totalPayout,
    totalSmallPayment,
    totalProfit,
    totalCompleted,
    refundRatio: totalSales > 0 ? (totalRefund / totalSales * 100) : 0,
    promotionRatio: totalSales > 0 ? (totalPromotion / totalSales * 100) : 0,
    profitRatio: totalSales > 0 ? (totalProfit / totalSales * 100) : 0,
  };
}

// 兼容旧版本的数据导出
export const statsByCreateTime = dailyStatsExtended.map(d => ({
  date: d.date,
  totalOrders: d.shippedOrders,
  shippedOrders: d.shippedOrders,
  completedOrders: d.completedOrders,
  closedOrders: 0,
  salesAmount: d.salesAmount,
  shippedAmount: d.salesAmount,
  completedAmount: d.salesAmount - d.refundAmount,
  refundAmount: d.refundAmount,
  discount: 0,
}));

export const statsByPaymentTime = statsByCreateTime;


// 兼容FinanceCommandCenter页面的数据导出
export const dailyStats = dailyStatsExtended.map(d => ({
  date: d.date,
  totalOrders: d.shippedOrders,
  shippedOrders: d.shippedOrders,
  completedOrders: d.completedOrders,
  closedOrders: 0,
  salesAmount: d.salesAmount,
  shippedAmount: d.salesAmount,
  completedAmount: d.salesAmount - d.refundAmount,
  refundAmount: d.refundAmount,
  discount: 0,
}));

// 达人统计数据（模拟）
export const influencerStats = [
  { name: "自营", sales: summaryData.totalSales * 0.6, orders: 11220, commission: 0, amount: summaryData.totalSales * 0.6 },
  { name: "达人A", sales: summaryData.totalSales * 0.15, orders: 2805, commission: summaryData.totalSales * 0.15 * 0.15, amount: summaryData.totalSales * 0.15 },
  { name: "达人B", sales: summaryData.totalSales * 0.12, orders: 2244, commission: summaryData.totalSales * 0.12 * 0.12, amount: summaryData.totalSales * 0.12 },
  { name: "达人C", sales: summaryData.totalSales * 0.08, orders: 1496, commission: summaryData.totalSales * 0.08 * 0.10, amount: summaryData.totalSales * 0.08 },
  { name: "其他", sales: summaryData.totalSales * 0.05, orders: 935, commission: summaryData.totalSales * 0.05 * 0.08, amount: summaryData.totalSales * 0.05 },
];

// 支付方式统计（模拟）
export const payMethodCounts = [
  { method: "微信支付", count: 12540, amount: summaryData.totalSales * 0.67 },
  { method: "支付宝", count: 4675, amount: summaryData.totalSales * 0.25 },
  { method: "抖音支付", count: 1485, amount: summaryData.totalSales * 0.08 },
];


// 省份分布统计（模拟数据，基于订单数量分布）
export const provinceCounts: Record<string, number> = {
  "广东省": 3740,
  "浙江省": 2244,
  "江苏省": 1870,
  "上海市": 1496,
  "北京市": 1309,
  "山东省": 1122,
  "河南省": 935,
  "四川省": 748,
  "湖北省": 561,
  "福建省": 374,
  "其他": 4301,
};
