/**
 * 经过截图校验的真实订单统计数据
 * 数据来源: 用户提供的抖店后台截图
 * 数据时间范围: 2025-04-01 ~ 2025-04-30
 */

// 扩展的每日统计数据类型
export interface DailyStatsExtended {
  date: string;
  shippedOrders: number;
  salesAmount: number;
  refundAmount: number;
  expressAmount: number;
  commissionAmount: number;
  serviceAmount: number;
  costAmount: number;
  promotionAmount: number;
  otherAmount: number;
  insuranceAmount: number;
  payoutAmount: number;
  smallPayment: number;
  profitAmount: number;
}

// 按创建时间统计的每日数据（来自截图校验）
export const dailyStatsFromScreenshot: DailyStatsExtended[] = [
  { date: "2025-04-30", shippedOrders: 1934, salesAmount: 79553.2, refundAmount: 13833.28, expressAmount: 6188.8, commissionAmount: 4376.76, serviceAmount: 1431.33, costAmount: 35579.0, promotionAmount: 21305.79, otherAmount: 68.46, insuranceAmount: 224.28, payoutAmount: 0, smallPayment: 0, profitAmount: -3454.5 },
  { date: "2025-04-29", shippedOrders: 1434, salesAmount: 56932.9, refundAmount: 9820.53, expressAmount: 4588.8, commissionAmount: 2579.4, serviceAmount: 1114.98, costAmount: 25419.0, promotionAmount: 14942.95, otherAmount: 70.82, insuranceAmount: 381.04, payoutAmount: 0, smallPayment: 0, profitAmount: -1984.62 },
  { date: "2025-04-28", shippedOrders: 2805, salesAmount: 123021.8, refundAmount: 23463.12, expressAmount: 8976.0, commissionAmount: 7118.41, serviceAmount: 2124.15, costAmount: 53854.5, promotionAmount: 33637.29, otherAmount: 86.92, insuranceAmount: 129.96, payoutAmount: 3.87, smallPayment: 0, profitAmount: -6372.42 },
  { date: "2025-04-27", shippedOrders: 725, salesAmount: 28303.3, refundAmount: 5446.26, expressAmount: 2320.0, commissionAmount: 1553.53, serviceAmount: 519.73, costAmount: 11624.5, promotionAmount: 8599.77, otherAmount: 61.8, insuranceAmount: 40.19, payoutAmount: 0, smallPayment: 0, profitAmount: -1862.48 },
  { date: "2025-04-26", shippedOrders: 259, salesAmount: 9265.4, refundAmount: 1495.02, expressAmount: 828.8, commissionAmount: 481.3, serviceAmount: 192.74, costAmount: 4208.0, promotionAmount: 2663.48, otherAmount: 23.92, insuranceAmount: 61.66, payoutAmount: 0, smallPayment: 0, profitAmount: -689.52 },
  { date: "2025-04-25", shippedOrders: 390, salesAmount: 14522.4, refundAmount: 2597.7, expressAmount: 1248.0, commissionAmount: 617.06, serviceAmount: 275.72, costAmount: 6432.0, promotionAmount: 4916.63, otherAmount: 59.8, insuranceAmount: 183.12, payoutAmount: 0, smallPayment: 0, profitAmount: -1807.63 },
  { date: "2025-04-24", shippedOrders: 796, salesAmount: 53397.2, refundAmount: 14312.82, expressAmount: 2547.2, commissionAmount: 8093.26, serviceAmount: 797.73, costAmount: 21465.0, promotionAmount: 2916.31, otherAmount: 27.5, insuranceAmount: 119.88, payoutAmount: 4.22, smallPayment: 0, profitAmount: 3113.28 },
  { date: "2025-04-23", shippedOrders: 585, salesAmount: 21204.0, refundAmount: 3557.4, expressAmount: 1872.0, commissionAmount: 968.42, serviceAmount: 402.91, costAmount: 9449.0, promotionAmount: 8608.93, otherAmount: 71.76, insuranceAmount: 123.26, payoutAmount: 0, smallPayment: 0, profitAmount: -3849.68 },
  { date: "2025-04-22", shippedOrders: 800, salesAmount: 29400.4, refundAmount: 5014.4, expressAmount: 2560.0, commissionAmount: 1267.76, serviceAmount: 555.32, costAmount: 13136.0, promotionAmount: 12975.38, otherAmount: 47.84, insuranceAmount: 141.4, payoutAmount: 0, smallPayment: 0, profitAmount: -6297.7 },
  { date: "2025-04-21", shippedOrders: 612, salesAmount: 22515.2, refundAmount: 3958.92, expressAmount: 1958.4, commissionAmount: 962.99, serviceAmount: 445.06, costAmount: 9952.0, promotionAmount: 11401.72, otherAmount: 17.94, insuranceAmount: 64.95, payoutAmount: 0, smallPayment: 0, profitAmount: -6246.78 },
  { date: "2025-04-20", shippedOrders: 449, salesAmount: 25816.8, refundAmount: 6221.52, expressAmount: 1436.8, commissionAmount: 3315.07, serviceAmount: 433.17, costAmount: 10688.0, promotionAmount: 4209.44, otherAmount: 7.18, insuranceAmount: 31.35, payoutAmount: 0, smallPayment: 0, profitAmount: -525.73 },
  { date: "2025-04-19", shippedOrders: 212, salesAmount: 8133.0, refundAmount: 1402.22, expressAmount: 678.4, commissionAmount: 239.71, serviceAmount: 161.4, costAmount: 3616.0, promotionAmount: 3435.36, otherAmount: 29.9, insuranceAmount: 58.83, payoutAmount: 0, smallPayment: 0, profitAmount: -1488.82 },
  { date: "2025-04-18", shippedOrders: 517, salesAmount: 19674.3, refundAmount: 3946.8, expressAmount: 1654.4, commissionAmount: 508.66, serviceAmount: 432.96, costAmount: 8432.0, promotionAmount: 11672.33, otherAmount: 12.46, insuranceAmount: 84.04, payoutAmount: 0, smallPayment: 5.0, profitAmount: -7074.35 },
  { date: "2025-04-17", shippedOrders: 297, salesAmount: 11300.4, refundAmount: 2061.3, expressAmount: 950.4, commissionAmount: 313.6, serviceAmount: 256.98, costAmount: 5008.0, promotionAmount: 6735.15, otherAmount: 5.98, insuranceAmount: 63.63, payoutAmount: 0, smallPayment: 0, profitAmount: -4094.64 },
  { date: "2025-04-16", shippedOrders: 433, salesAmount: 28444.09, refundAmount: 8678.7, expressAmount: 1385.6, commissionAmount: 3853.6, serviceAmount: 471.29, costAmount: 11008.0, promotionAmount: 3408.33, otherAmount: 0, insuranceAmount: 66.74, payoutAmount: 3.0, smallPayment: 0, profitAmount: -431.17 },
  { date: "2025-04-15", shippedOrders: 507, salesAmount: 27269.99, refundAmount: 7578.62, expressAmount: 1622.4, commissionAmount: 3836.36, serviceAmount: 492.77, costAmount: 14256.0, promotionAmount: 3488.97, otherAmount: 11.96, insuranceAmount: 40.91, payoutAmount: 200.0, smallPayment: 0, profitAmount: -4258.0 },
  { date: "2025-04-14", shippedOrders: 276, salesAmount: 9149.57, refundAmount: 1285.7, expressAmount: 883.2, commissionAmount: 506.38, serviceAmount: 347.03, costAmount: 4848.0, promotionAmount: 3746.84, otherAmount: 0, insuranceAmount: 24.22, payoutAmount: 0, smallPayment: 0, profitAmount: -2491.8 },
  { date: "2025-04-13", shippedOrders: 186, salesAmount: 6488.35, refundAmount: 926.9, expressAmount: 595.2, commissionAmount: 317.7, serviceAmount: 241.08, costAmount: 3120.0, promotionAmount: 2736.81, otherAmount: 0, insuranceAmount: 18.62, payoutAmount: 0, smallPayment: 0, profitAmount: -1467.96 },
  { date: "2025-04-12", shippedOrders: 186, salesAmount: 6338.84, refundAmount: 871.21, expressAmount: 595.2, commissionAmount: 332.43, serviceAmount: 252.14, costAmount: 3072.0, promotionAmount: 2815.55, otherAmount: 0, insuranceAmount: 17.88, payoutAmount: 0, smallPayment: 0, profitAmount: -1617.57 },
  { date: "2025-04-11", shippedOrders: 78, salesAmount: 2960.1, refundAmount: 538.2, expressAmount: 249.6, commissionAmount: 163.26, serviceAmount: 97.78, costAmount: 1296.0, promotionAmount: 1903.02, otherAmount: 0, insuranceAmount: 13.13, payoutAmount: 0, smallPayment: 0, profitAmount: -1300.89 },
  { date: "2025-04-10", shippedOrders: 282, salesAmount: 9807.2, refundAmount: 1130.22, expressAmount: 902.4, commissionAmount: 493.4, serviceAmount: 373.22, costAmount: 4640.0, promotionAmount: 6870.07, otherAmount: 0, insuranceAmount: 53.89, payoutAmount: 0, smallPayment: 0, profitAmount: -4656.0 },
  { date: "2025-04-09", shippedOrders: 320, salesAmount: 11690.9, refundAmount: 1853.8, expressAmount: 1024.0, commissionAmount: 593.39, serviceAmount: 441.25, costAmount: 5280.0, promotionAmount: 7092.67, otherAmount: 0, insuranceAmount: 54.74, payoutAmount: 0, smallPayment: 0, profitAmount: -4648.95 },
  { date: "2025-04-08", shippedOrders: 234, salesAmount: 8461.7, refundAmount: 1375.4, expressAmount: 748.8, commissionAmount: 415.14, serviceAmount: 331.99, costAmount: 3808.0, promotionAmount: 6062.07, otherAmount: 0, insuranceAmount: 9.35, payoutAmount: 0, smallPayment: 0, profitAmount: -4289.05 },
  { date: "2025-04-07", shippedOrders: 65, salesAmount: 2212.6, refundAmount: 269.1, expressAmount: 208.0, commissionAmount: 115.41, serviceAmount: 93.47, costAmount: 1040.0, promotionAmount: 3141.3, otherAmount: 0, insuranceAmount: 16.83, payoutAmount: 0, smallPayment: 0, profitAmount: -2671.51 },
  { date: "2025-04-06", shippedOrders: 92, salesAmount: 3438.5, refundAmount: 713.6, expressAmount: 294.4, commissionAmount: 361.29, serviceAmount: 94.27, costAmount: 1456.0, promotionAmount: 1545.26, otherAmount: 0, insuranceAmount: 2.89, payoutAmount: 0, smallPayment: 0, profitAmount: -1029.21 },
  { date: "2025-04-05", shippedOrders: 4, salesAmount: 119.6, refundAmount: 0, expressAmount: 12.8, commissionAmount: 4.5, serviceAmount: 4.68, costAmount: 64.0, promotionAmount: 98.02, otherAmount: 0, insuranceAmount: 1.53, payoutAmount: 0, smallPayment: 0, profitAmount: -65.93 },
  { date: "2025-04-04", shippedOrders: 4, salesAmount: 89.7, refundAmount: 0, expressAmount: 12.8, commissionAmount: 4.5, serviceAmount: 4.5, costAmount: 64.0, promotionAmount: 101.98, otherAmount: 0, insuranceAmount: 0, payoutAmount: 0, smallPayment: 0, profitAmount: -98.08 },
  { date: "2025-04-03", shippedOrders: 3, salesAmount: 0, refundAmount: 0, expressAmount: 9.6, commissionAmount: 0, serviceAmount: 0, costAmount: 48.0, promotionAmount: 0, otherAmount: 0, insuranceAmount: 0.34, payoutAmount: 0, smallPayment: 0, profitAmount: -57.94 },
  { date: "2025-04-02", shippedOrders: 0, salesAmount: 0, refundAmount: 0, expressAmount: 0, commissionAmount: 0, serviceAmount: 0, costAmount: 0, promotionAmount: 0, otherAmount: 0, insuranceAmount: 0.17, payoutAmount: 0, smallPayment: 0, profitAmount: -0.17 },
  { date: "2025-04-01", shippedOrders: 2, salesAmount: 59.8, refundAmount: 0, expressAmount: 6.4, commissionAmount: 11.96, serviceAmount: 2.58, costAmount: 32.0, promotionAmount: 100.0, otherAmount: 0, insuranceAmount: 0.34, payoutAmount: 0, smallPayment: 0, profitAmount: -93.48 },
];

// 汇总数据（来自截图校验）
export const summaryFromScreenshot = {
  totalSales: 619571.24,
  confirmedAmount: 489749.5,
  confirmedRatio: 98.5,
  unconfirmedAmount: 7469.0,
  refundAmount: 122352.74,
  refundRatio: 19.75,
  promotionAmount: 234536.67,
  promotionRatio: 37.85,
};