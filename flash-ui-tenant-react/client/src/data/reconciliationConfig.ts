/**
 * 数据勾稽配置文件
 * 以订单统计和订单明细为基准，定义各模块的数据映射关系
 * 确保全系统数据一致性
 */

import { summaryData, dailyStatsExtended, calculateSummary } from './realOrderData';

// 计算汇总数据
const calculated = calculateSummary(dailyStatsExtended);

/**
 * 基准数据 - 来自订单统计模块
 * 所有其他模块的数据都应该从这里派生
 */
export const baseData = {
  // 时间范围
  dateRange: {
    start: '2025-04-01',
    end: '2025-04-30',
    days: 30,
  },
  
  // 订单基础数据
  orders: {
    total: summaryData.totalOrders,           // 总订单数: 18,700
    shipped: summaryData.completedOrders,     // 已发货数: 14,487
    shippedRatio: 77.47,                      // 发货率
  },
  
  // 金额数据
  amounts: {
    sales: summaryData.totalSales,            // 销售额: 619,571.24
    confirmed: summaryData.confirmedAmount,   // 已确认: 489,749.5
    unconfirmed: summaryData.unconfirmedAmount, // 未确认: 7,469.0
    refund: summaryData.refundAmount,         // 退款额: 122,352.74
    netSales: summaryData.totalSales - summaryData.refundAmount, // 净销售额: 497,218.5
  },
  
  // 费用数据
  expenses: {
    express: calculated.totalExpress,         // 快递费: 46,358.40
    commission: calculated.totalCommission,   // 达人佣金: 43,405.25
    service: calculated.totalService,         // 服务费: 12,392.43
    cost: calculated.totalCost,               // 商品成本: 272,895.00
    promotion: calculated.totalPromotion,     // 推广费: 191,131.42
    other: calculated.totalOther,             // 其他: 604.22
    insurance: calculated.totalInsurance,     // 保险费: 2,049.57
    payout: calculated.totalPayout,           // 赔付: 211.09
    total: calculated.totalExpress + calculated.totalCommission + 
           calculated.totalService + calculated.totalPromotion + 
           calculated.totalOther + calculated.totalInsurance + calculated.totalPayout,
  },
  
  // 利润数据
  profit: {
    gross: summaryData.totalSales - calculated.totalCost - summaryData.refundAmount, // 毛利: 224,323.5
    net: calculated.totalProfit,              // 净利润: -71,813.30
    ratio: summaryData.grossProfitRatio,      // 利润率: -11.59%
  },
  
  // 比例数据
  ratios: {
    refund: summaryData.refundRatio,          // 退款占比: 19.75%
    promotion: summaryData.promotionRatio,    // 推广占比: 30.85%
    confirmed: summaryData.confirmedRatio,    // 确认比例: 98.5%
  },
};

/**
 * 总账管理 - 经营概览模块数据映射
 */
export const dashboardData = {
  // 快捷访问字段
  totalRevenue: baseData.amounts.sales,
  orderCount: baseData.orders.total,
  
  // KPI卡片数据
  kpiCards: {
    totalRevenue: baseData.amounts.sales,           // 总营收 = 销售额
    grossProfit: baseData.profit.gross,             // 总毛利
    netProfit: baseData.profit.net,                 // 净利润
    availableFunds: baseData.amounts.confirmed,     // 可用资金 = 已确认金额
    inventoryValue: baseData.expenses.cost * 0.66,  // 库存总值（估算）
    taxRate: 6.8,                                   // 综合税负率
    orderCount: baseData.orders.total,              // 订单数
  },
  
  // 趋势数据
  trends: {
    revenueGrowth: 39.7,    // 营收增长率（与上期对比）
    profitGrowth: 82.4,     // 利润增长率
    fundsGrowth: 5.8,       // 资金增长率
    inventoryChange: -3.2,  // 库存变化
    taxChange: 0.3,         // 税负变化
    orderGrowth: 34.9,      // 订单增长率
  },
  
  // 费用构成
  expenseComposition: [
    { name: '商品成本', value: baseData.expenses.cost, ratio: 44.05 },
    { name: '推广费', value: baseData.expenses.promotion, ratio: 30.85 },
    { name: '快递费', value: baseData.expenses.express, ratio: 7.48 },
    { name: '达人佣金', value: baseData.expenses.commission, ratio: 7.01 },
    { name: '服务费', value: baseData.expenses.service, ratio: 2.00 },
    { name: '其他', value: baseData.expenses.other + baseData.expenses.insurance + baseData.expenses.payout, ratio: 0.46 },
  ],
};

/**
 * 总账管理 - 财务核算模块数据映射
 */
export const financeData = {
  // 收入确认
  revenue: {
    total: baseData.amounts.sales,
    confirmed: baseData.amounts.confirmed,
    unconfirmed: baseData.amounts.unconfirmed,
    refund: baseData.amounts.refund,
  },
  
  // 成本核算
  cost: {
    goods: baseData.expenses.cost,
    logistics: baseData.expenses.express,
    commission: baseData.expenses.commission,
    service: baseData.expenses.service,
    promotion: baseData.expenses.promotion,
  },
  
  // 利润表
  profitStatement: {
    revenue: baseData.amounts.sales,
    costOfGoods: baseData.expenses.cost,
    grossProfit: baseData.profit.gross,
    operatingExpenses: baseData.expenses.total,
    netProfit: baseData.profit.net,
  },
};

/**
 * 总账管理 - 费用中心模块数据映射
 */
export const expenseCenterData = {
  // 费用快捷访问
  promotion: baseData.expenses.promotion,
  express: baseData.expenses.express,
  commission: baseData.expenses.commission,
  service: baseData.expenses.service,
  
  // 费用分类
  categories: [
    { 
      name: '推广费用', 
      amount: baseData.expenses.promotion,
      ratio: (baseData.expenses.promotion / baseData.amounts.sales * 100).toFixed(2),
      budget: 200000,
      budgetUsage: (baseData.expenses.promotion / 200000 * 100).toFixed(1),
    },
    { 
      name: '物流费用', 
      amount: baseData.expenses.express,
      ratio: (baseData.expenses.express / baseData.amounts.sales * 100).toFixed(2),
      budget: 50000,
      budgetUsage: (baseData.expenses.express / 50000 * 100).toFixed(1),
    },
    { 
      name: '销售佣金', 
      amount: baseData.expenses.commission,
      ratio: (baseData.expenses.commission / baseData.amounts.sales * 100).toFixed(2),
      budget: 50000,
      budgetUsage: (baseData.expenses.commission / 50000 * 100).toFixed(1),
    },
    { 
      name: '平台服务费', 
      amount: baseData.expenses.service,
      ratio: (baseData.expenses.service / baseData.amounts.sales * 100).toFixed(2),
      budget: 15000,
      budgetUsage: (baseData.expenses.service / 15000 * 100).toFixed(1),
    },
    { 
      name: '其他费用', 
      amount: baseData.expenses.other + baseData.expenses.insurance + baseData.expenses.payout,
      ratio: ((baseData.expenses.other + baseData.expenses.insurance + baseData.expenses.payout) / baseData.amounts.sales * 100).toFixed(2),
      budget: 5000,
      budgetUsage: ((baseData.expenses.other + baseData.expenses.insurance + baseData.expenses.payout) / 5000 * 100).toFixed(1),
    },
  ],
  
  // 费用汇总
  summary: {
    total: baseData.expenses.total + baseData.expenses.cost,
    totalBudget: 320000,
    budgetUsage: ((baseData.expenses.total + baseData.expenses.cost) / 320000 * 100).toFixed(1),
  },
};

/**
 * 出纳管理 - 资金流水模块数据映射
 */
export const cashflowData = {
  // 资金概览
  overview: {
    totalIncome: baseData.amounts.sales,
    totalExpense: baseData.expenses.total + baseData.expenses.cost,
    netFlow: baseData.amounts.sales - baseData.expenses.total - baseData.expenses.cost - baseData.amounts.refund,
    refund: baseData.amounts.refund,
  },
  
  // 收入明细
  income: {
    sales: baseData.amounts.sales,
    confirmed: baseData.amounts.confirmed,
    pending: baseData.amounts.unconfirmed,
  },
  
  // 支出明细
  expense: {
    goods: baseData.expenses.cost,
    logistics: baseData.expenses.express,
    promotion: baseData.expenses.promotion,
    commission: baseData.expenses.commission,
    service: baseData.expenses.service,
    other: baseData.expenses.other + baseData.expenses.insurance + baseData.expenses.payout,
  },
};

/**
 * 出纳管理 - 平台对账模块数据映射
 */
export const reconciliationData = {
  // 对账汇总
  summary: {
    platformAmount: baseData.amounts.sales,
    systemAmount: baseData.amounts.sales,
    difference: 0,
    matchRate: 100,
  },
  
  // 退款对账
  refund: {
    platformRefund: baseData.amounts.refund,
    systemRefund: baseData.amounts.refund,
    difference: 0,
  },
  
  // 费用对账
  expense: {
    platformExpense: baseData.expenses.total,
    systemExpense: baseData.expenses.total,
    difference: 0,
  },
};

/**
 * 订单管理 - 订单统计模块数据映射
 */
export const orderStatsData = {
  // 快捷访问字段
  sales: baseData.amounts.sales,
  confirmed: baseData.amounts.confirmed,
  unconfirmed: baseData.amounts.unconfirmed,
  refund: baseData.amounts.refund,
  promotion: baseData.expenses.promotion,
  
  // 汇总卡片
  cards: {
    sales: {
      amount: baseData.amounts.sales,
      label: '销售额',
    },
    confirmed: {
      amount: baseData.amounts.confirmed,
      ratio: baseData.ratios.confirmed,
      label: '已确认',
    },
    unconfirmed: {
      amount: baseData.amounts.unconfirmed,
      label: '尚未确认',
    },
    refund: {
      amount: baseData.amounts.refund,
      ratio: baseData.ratios.refund,
      label: '退款额度',
    },
    promotion: {
      amount: baseData.expenses.promotion,
      ratio: baseData.ratios.promotion,
      label: '推广费',
    },
  },
  
  // 每日数据
  dailyData: dailyStatsExtended,
};

/**
 * 库存成本模块数据映射
 */
export const inventoryCostData = {
  // 成本汇总
  summary: {
    totalCost: baseData.expenses.cost,
    avgCost: baseData.expenses.cost / baseData.orders.shipped,
    costRatio: (baseData.expenses.cost / baseData.amounts.sales * 100).toFixed(2),
  },
};

/**
 * 格式化金额显示
 */
export function formatAmount(value: number, options?: { 
  showUnit?: boolean; 
  precision?: number;
  compact?: boolean;
}): string {
  const { showUnit = true, precision = 2, compact = false } = options || {};
  
  if (compact && Math.abs(value) >= 10000) {
    const wan = value / 10000;
    return `${showUnit ? '¥' : ''}${wan.toFixed(precision)}万`;
  }
  
  return `${showUnit ? '¥' : ''}${value.toLocaleString('zh-CN', { 
    minimumFractionDigits: precision, 
    maximumFractionDigits: precision 
  })}`;
}

/**
 * 格式化百分比显示
 */
export function formatPercent(value: number, precision: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(precision)}%`;
}

/**
 * 获取趋势样式类名
 */
export function getTrendClass(value: number): string {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
}
