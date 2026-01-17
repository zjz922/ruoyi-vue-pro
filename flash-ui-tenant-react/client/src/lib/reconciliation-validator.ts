/**
 * 数据勾稽验证工具
 * 
 * 用于前端数据一致性检查和验证
 */

export interface ReconciliationRule {
  name: string;
  description: string;
  validate: (data: any) => ReconciliationResult;
}

export interface ReconciliationResult {
  passed: boolean;
  differences: ReconciliationDifference[];
  summary: ReconciliationSummary;
}

export interface ReconciliationDifference {
  type: 'ORDER_COST' | 'ORDER_INVENTORY' | 'ORDER_PROMOTION' | 'ORDER_PURCHASE';
  sourceId: string | number;
  targetId: string | number;
  sourceValue: number;
  targetValue: number;
  difference: number;
  differenceRate: number;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
}

export interface ReconciliationSummary {
  totalRecords: number;
  matchedRecords: number;
  matchRate: number;
  totalDifferences: number;
  criticalDifferences: number;
  warningDifferences: number;
  infoDifferences: number;
  totalDifferenceAmount: number;
}

/**
 * 订单-成本勾稽验证
 * 
 * 验证订单中的商品成本是否与成本配置相匹配
 */
export function validateOrderCostReconciliation(orders: any[], costs: any[]): ReconciliationResult {
  const differences: ReconciliationDifference[] = [];
  let matchedCount = 0;

  // 构建成本查找表
  const costMap = new Map<string, any>();
  costs.forEach(cost => {
    costMap.set(`${cost.sku}`, cost);
  });

  orders.forEach(order => {
    const costConfig = costMap.get(order.sku);
    
    if (!costConfig) {
      // 成本配置缺失
      differences.push({
        type: 'ORDER_COST',
        sourceId: order.id,
        targetId: 0,
        sourceValue: order.productCost || 0,
        targetValue: 0,
        difference: order.productCost || 0,
        differenceRate: 100,
        level: 'CRITICAL',
        message: `SKU ${order.sku} 的成本配置不存在`
      });
    } else {
      const expectedCost = costConfig.currentCost * (order.quantity || 1);
      const actualCost = order.productCost || 0;
      const difference = Math.abs(actualCost - expectedCost);
      const differenceRate = expectedCost > 0 ? (difference / expectedCost) * 100 : 0;

      if (differenceRate > 5) {
        // 成本差异超过5%
        differences.push({
          type: 'ORDER_COST',
          sourceId: order.id,
          targetId: costConfig.id,
          sourceValue: actualCost,
          targetValue: expectedCost,
          difference,
          differenceRate,
          level: differenceRate > 10 ? 'CRITICAL' : 'WARNING',
          message: `订单 ${order.orderNo} 的成本差异率为 ${differenceRate.toFixed(2)}%`
        });
      } else {
        matchedCount++;
      }
    }
  });

  return {
    passed: differences.length === 0,
    differences,
    summary: {
      totalRecords: orders.length,
      matchedRecords: matchedCount,
      matchRate: orders.length > 0 ? (matchedCount / orders.length) * 100 : 0,
      totalDifferences: differences.length,
      criticalDifferences: differences.filter(d => d.level === 'CRITICAL').length,
      warningDifferences: differences.filter(d => d.level === 'WARNING').length,
      infoDifferences: differences.filter(d => d.level === 'INFO').length,
      totalDifferenceAmount: differences.reduce((sum, d) => sum + d.difference, 0)
    }
  };
}

/**
 * 订单-库存勾稽验证
 * 
 * 验证订单发货时库存是否充足
 */
export function validateOrderInventoryReconciliation(orders: any[], inventory: any[]): ReconciliationResult {
  const differences: ReconciliationDifference[] = [];
  let matchedCount = 0;

  // 构建库存查找表
  const inventoryMap = new Map<string, any>();
  inventory.forEach(inv => {
    inventoryMap.set(`${inv.sku}`, inv);
  });

  orders.forEach(order => {
    const invConfig = inventoryMap.get(order.sku);
    
    if (!invConfig) {
      // 库存配置缺失
      differences.push({
        type: 'ORDER_INVENTORY',
        sourceId: order.id,
        targetId: 0,
        sourceValue: order.quantity || 0,
        targetValue: 0,
        difference: order.quantity || 0,
        differenceRate: 100,
        level: 'CRITICAL',
        message: `SKU ${order.sku} 的库存信息不存在`
      });
    } else {
      const orderQty = order.quantity || 0;
      const availableQty = invConfig.availableQty || 0;

      if (availableQty < orderQty) {
        // 库存不足
        differences.push({
          type: 'ORDER_INVENTORY',
          sourceId: order.id,
          targetId: invConfig.id,
          sourceValue: orderQty,
          targetValue: availableQty,
          difference: orderQty - availableQty,
          differenceRate: availableQty > 0 ? ((orderQty - availableQty) / orderQty) * 100 : 100,
          level: 'CRITICAL',
          message: `订单 ${order.orderNo} 库存不足，需要 ${orderQty}，可用 ${availableQty}`
        });
      } else {
        matchedCount++;
      }
    }
  });

  return {
    passed: differences.length === 0,
    differences,
    summary: {
      totalRecords: orders.length,
      matchedRecords: matchedCount,
      matchRate: orders.length > 0 ? (matchedCount / orders.length) * 100 : 0,
      totalDifferences: differences.length,
      criticalDifferences: differences.filter(d => d.level === 'CRITICAL').length,
      warningDifferences: differences.filter(d => d.level === 'WARNING').length,
      infoDifferences: differences.filter(d => d.level === 'INFO').length,
      totalDifferenceAmount: differences.reduce((sum, d) => sum + d.difference, 0)
    }
  };
}

/**
 * 订单-推广费勾稽验证
 * 
 * 验证订单中的推广费是否与推广平台数据相匹配
 */
export function validateOrderPromotionReconciliation(dailyStats: any[], promotionExpense: any[]): ReconciliationResult {
  const differences: ReconciliationDifference[] = [];
  let matchedCount = 0;

  // 构建推广费查找表
  const promotionMap = new Map<string, any>();
  promotionExpense.forEach(promo => {
    const dateKey = promo.expenseDate || promo.date;
    promotionMap.set(dateKey, promo);
  });

  dailyStats.forEach(stat => {
    const dateKey = stat.date;
    const promoData = promotionMap.get(dateKey);

    if (!promoData) {
      // 推广费数据缺失
      differences.push({
        type: 'ORDER_PROMOTION',
        sourceId: stat.id || dateKey,
        targetId: 0,
        sourceValue: stat.promotionFee || 0,
        targetValue: 0,
        difference: stat.promotionFee || 0,
        differenceRate: 100,
        level: 'WARNING',
        message: `日期 ${dateKey} 的推广费数据不存在`
      });
    } else {
      const orderPromo = stat.promotionFee || 0;
      const platformPromo = promoData.cost || 0;
      const difference = Math.abs(orderPromo - platformPromo);
      const differenceRate = platformPromo > 0 ? (difference / platformPromo) * 100 : 0;

      if (differenceRate > 2) {
        // 推广费差异超过2%
        differences.push({
          type: 'ORDER_PROMOTION',
          sourceId: stat.id || dateKey,
          targetId: promoData.id,
          sourceValue: orderPromo,
          targetValue: platformPromo,
          difference,
          differenceRate,
          level: differenceRate > 5 ? 'CRITICAL' : 'WARNING',
          message: `日期 ${dateKey} 的推广费差异率为 ${differenceRate.toFixed(2)}%`
        });
      } else {
        matchedCount++;
      }
    }
  });

  return {
    passed: differences.length === 0,
    differences,
    summary: {
      totalRecords: dailyStats.length,
      matchedRecords: matchedCount,
      matchRate: dailyStats.length > 0 ? (matchedCount / dailyStats.length) * 100 : 0,
      totalDifferences: differences.length,
      criticalDifferences: differences.filter(d => d.level === 'CRITICAL').length,
      warningDifferences: differences.filter(d => d.level === 'WARNING').length,
      infoDifferences: differences.filter(d => d.level === 'INFO').length,
      totalDifferenceAmount: differences.reduce((sum, d) => sum + d.difference, 0)
    }
  };
}

/**
 * 订单-入库单勾稽验证
 * 
 * 验证订单中的商品是否有对应的入库单记录
 */
export function validateOrderPurchaseInReconciliation(orders: any[], purchaseIns: any[]): ReconciliationResult {
  const differences: ReconciliationDifference[] = [];
  let matchedCount = 0;

  // 构建入库单查找表
  const purchaseMap = new Map<string, any[]>();
  purchaseIns.forEach(purchase => {
    const sku = purchase.sku;
    if (!purchaseMap.has(sku)) {
      purchaseMap.set(sku, []);
    }
    purchaseMap.get(sku)!.push(purchase);
  });

  orders.forEach(order => {
    const purchaseList = purchaseMap.get(order.sku) || [];

    if (purchaseList.length === 0) {
      // 入库单缺失
      differences.push({
        type: 'ORDER_PURCHASE',
        sourceId: order.id,
        targetId: 0,
        sourceValue: order.quantity || 0,
        targetValue: 0,
        difference: order.quantity || 0,
        differenceRate: 100,
        level: 'WARNING',
        message: `SKU ${order.sku} 的入库单不存在`
      });
    } else {
      // 检查入库数量是否充足
      const totalPurchaseQty = purchaseList.reduce((sum, p) => sum + (p.quantity || 0), 0);
      const orderQty = order.quantity || 0;

      if (totalPurchaseQty < orderQty) {
        differences.push({
          type: 'ORDER_PURCHASE',
          sourceId: order.id,
          targetId: purchaseList[0].id,
          sourceValue: orderQty,
          targetValue: totalPurchaseQty,
          difference: orderQty - totalPurchaseQty,
          differenceRate: orderQty > 0 ? ((orderQty - totalPurchaseQty) / orderQty) * 100 : 0,
          level: 'WARNING',
          message: `订单 ${order.orderNo} 的入库数量不足，需要 ${orderQty}，已入库 ${totalPurchaseQty}`
        });
      } else {
        matchedCount++;
      }
    }
  });

  return {
    passed: differences.length === 0,
    differences,
    summary: {
      totalRecords: orders.length,
      matchedRecords: matchedCount,
      matchRate: orders.length > 0 ? (matchedCount / orders.length) * 100 : 0,
      totalDifferences: differences.length,
      criticalDifferences: differences.filter(d => d.level === 'CRITICAL').length,
      warningDifferences: differences.filter(d => d.level === 'WARNING').length,
      infoDifferences: differences.filter(d => d.level === 'INFO').length,
      totalDifferenceAmount: differences.reduce((sum, d) => sum + d.difference, 0)
    }
  };
}

/**
 * 获取差异等级样式
 */
export function getDifferenceStyle(level: string): string {
  switch (level) {
    case 'CRITICAL':
      return 'text-red-600 bg-red-50';
    case 'WARNING':
      return 'text-orange-600 bg-orange-50';
    case 'INFO':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

/**
 * 获取差异等级标签
 */
export function getDifferenceLabel(level: string): string {
  switch (level) {
    case 'CRITICAL':
      return '严重';
    case 'WARNING':
      return '警告';
    case 'INFO':
      return '提示';
    default:
      return '未知';
  }
}

/**
 * 格式化勾稽率
 */
export function formatReconciliationRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

/**
 * 判断勾稽率是否达成目标
 */
export function isReconciliationRateAchieved(rate: number, target: number = 99.5): boolean {
  return rate >= target;
}
