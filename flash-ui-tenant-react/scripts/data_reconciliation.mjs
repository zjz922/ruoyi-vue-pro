/**
 * 数据勾稽分析脚本
 * 以订单统计和订单明细为基准，分析各模块应该使用的数据
 */

// 基准数据（来自realOrderData.ts）
const summaryData = {
  // 订单基础数据
  totalOrders: 18700,           // 总订单数
  shippedOrders: 14487,         // 已发货数（完结订单数）
  
  // 金额数据
  totalSales: 619571.24,        // 销售额
  confirmedAmount: 489749.5,    // 已确认金额
  unconfirmedAmount: 7469.0,    // 尚未确认金额
  refundAmount: 122352.74,      // 退款额度
  
  // 费用数据
  expressAmount: 46358.40,      // 快递费
  commissionAmount: 43405.25,   // 达人佣金
  serviceAmount: 12392.43,      // 服务费
  costAmount: 272895.00,        // 商品成本
  promotionAmount: 191131.42,   // 推广费
  otherAmount: 604.22,          // 其他费用
  insuranceAmount: 2049.57,     // 保险费
  payoutAmount: 211.09,         // 赔付
  
  // 利润数据
  profitAmount: -71813.30,      // 预计利润
  profitRatio: -11.59,          // 利润率
  
  // 比例数据
  refundRatio: 19.75,           // 退款占比
  promotionRatio: 30.85,        // 广告占比
};

// 计算衍生数据
const derivedData = {
  // 毛利 = 销售额 - 商品成本 - 退款额
  grossProfit: summaryData.totalSales - summaryData.costAmount - summaryData.refundAmount,
  
  // 净销售额 = 销售额 - 退款额
  netSales: summaryData.totalSales - summaryData.refundAmount,
  
  // 总费用 = 快递费 + 达人佣金 + 服务费 + 推广费 + 其他 + 保险费 + 赔付
  totalExpenses: summaryData.expressAmount + summaryData.commissionAmount + 
                 summaryData.serviceAmount + summaryData.promotionAmount + 
                 summaryData.otherAmount + summaryData.insuranceAmount + summaryData.payoutAmount,
  
  // 平均订单金额
  avgOrderAmount: summaryData.totalSales / summaryData.totalOrders,
  
  // 平均发货订单金额
  avgShippedOrderAmount: summaryData.totalSales / summaryData.shippedOrders,
  
  // 发货率
  shippedRatio: (summaryData.shippedOrders / summaryData.totalOrders * 100),
};

console.log("=== 数据勾稽基准数据 ===\n");
console.log("【订单基础数据】");
console.log(`  总订单数: ${summaryData.totalOrders.toLocaleString()} 单`);
console.log(`  已发货数: ${summaryData.shippedOrders.toLocaleString()} 单`);
console.log(`  发货率: ${derivedData.shippedRatio.toFixed(2)}%`);

console.log("\n【金额数据】");
console.log(`  销售额: ¥${summaryData.totalSales.toLocaleString()}`);
console.log(`  已确认金额: ¥${summaryData.confirmedAmount.toLocaleString()}`);
console.log(`  尚未确认金额: ¥${summaryData.unconfirmedAmount.toLocaleString()}`);
console.log(`  退款额: ¥${summaryData.refundAmount.toLocaleString()} (${summaryData.refundRatio}%)`);
console.log(`  净销售额: ¥${derivedData.netSales.toLocaleString()}`);

console.log("\n【费用数据】");
console.log(`  快递费: ¥${summaryData.expressAmount.toLocaleString()}`);
console.log(`  达人佣金: ¥${summaryData.commissionAmount.toLocaleString()}`);
console.log(`  服务费: ¥${summaryData.serviceAmount.toLocaleString()}`);
console.log(`  商品成本: ¥${summaryData.costAmount.toLocaleString()}`);
console.log(`  推广费: ¥${summaryData.promotionAmount.toLocaleString()} (${summaryData.promotionRatio}%)`);
console.log(`  其他费用: ¥${summaryData.otherAmount.toLocaleString()}`);
console.log(`  保险费: ¥${summaryData.insuranceAmount.toLocaleString()}`);
console.log(`  赔付: ¥${summaryData.payoutAmount.toLocaleString()}`);
console.log(`  总费用: ¥${derivedData.totalExpenses.toLocaleString()}`);

console.log("\n【利润数据】");
console.log(`  毛利: ¥${derivedData.grossProfit.toLocaleString()}`);
console.log(`  预计利润: ¥${summaryData.profitAmount.toLocaleString()}`);
console.log(`  利润率: ${summaryData.profitRatio}%`);

console.log("\n【平均数据】");
console.log(`  平均订单金额: ¥${derivedData.avgOrderAmount.toFixed(2)}`);
console.log(`  平均发货订单金额: ¥${derivedData.avgShippedOrderAmount.toFixed(2)}`);

console.log("\n=== 各模块数据勾稽映射 ===\n");

console.log("【总账管理 - 经营概览】");
console.log(`  总营收: ¥${summaryData.totalSales.toLocaleString()} (= 销售额)`);
console.log(`  总毛利: ¥${derivedData.grossProfit.toLocaleString()} (= 销售额 - 商品成本 - 退款额)`);
console.log(`  净利润: ¥${summaryData.profitAmount.toLocaleString()} (= 预计利润)`);
console.log(`  订单数: ${summaryData.totalOrders.toLocaleString()} 单`);

console.log("\n【总账管理 - 费用中心】");
console.log(`  推广费: ¥${summaryData.promotionAmount.toLocaleString()}`);
console.log(`  物流费: ¥${summaryData.expressAmount.toLocaleString()}`);
console.log(`  佣金: ¥${summaryData.commissionAmount.toLocaleString()}`);
console.log(`  服务费: ¥${summaryData.serviceAmount.toLocaleString()}`);
console.log(`  其他费用: ¥${(summaryData.otherAmount + summaryData.insuranceAmount + summaryData.payoutAmount).toLocaleString()}`);

console.log("\n【出纳管理 - 资金流水】");
console.log(`  收入: ¥${summaryData.totalSales.toLocaleString()} (= 销售额)`);
console.log(`  支出: ¥${(derivedData.totalExpenses + summaryData.costAmount).toLocaleString()} (= 总费用 + 商品成本)`);
console.log(`  退款: ¥${summaryData.refundAmount.toLocaleString()}`);

// 输出JSON格式的勾稽数据
const reconciliationData = {
  基准数据: summaryData,
  衍生数据: derivedData,
  模块映射: {
    经营概览: {
      总营收: summaryData.totalSales,
      总毛利: derivedData.grossProfit,
      净利润: summaryData.profitAmount,
      订单数: summaryData.totalOrders,
    },
    费用中心: {
      推广费: summaryData.promotionAmount,
      物流费: summaryData.expressAmount,
      佣金: summaryData.commissionAmount,
      服务费: summaryData.serviceAmount,
      其他费用: summaryData.otherAmount + summaryData.insuranceAmount + summaryData.payoutAmount,
    },
    资金流水: {
      收入: summaryData.totalSales,
      支出: derivedData.totalExpenses + summaryData.costAmount,
      退款: summaryData.refundAmount,
    },
  }
};

import { writeFileSync } from 'fs';
writeFileSync('scripts/reconciliation_data.json', JSON.stringify(reconciliationData, null, 2));
console.log("\n数据已保存到 scripts/reconciliation_data.json");
