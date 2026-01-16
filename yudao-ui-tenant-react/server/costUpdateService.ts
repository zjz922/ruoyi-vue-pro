/**
 * 成本自动更新服务
 * 将聚水潭入库数据与成本配置模块关联，实现采购成本的自动更新和计算
 */

import { getDb } from './db';
import { productCosts, productCostHistory, jstPurchaseIn, jstPurchaseInItem } from '../drizzle/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';

/**
 * 成本计算方法枚举
 */
export enum CostCalculationMethod {
  WEIGHTED_AVERAGE = 'weighted_average',
  LATEST_COST = 'latest_cost',
  FIFO = 'fifo',
}

/**
 * 成本更新结果
 */
export interface CostUpdateResult {
  success: boolean;
  skuId: string;
  productName: string;
  oldCost: number;
  newCost: number;
  method: CostCalculationMethod;
  reason: string;
  purchaseInId?: string;
}

/**
 * 根据SKU编码匹配商品成本记录
 */
export async function findProductCostBySku(skuId: string): Promise<any | null> {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select()
    .from(productCosts)
    .where(and(
      eq(productCosts.sku, skuId),
      eq(productCosts.status, 0)
    ))
    .limit(1);
  
  return results.length > 0 ? results[0] : null;
}

/**
 * 根据商家编码匹配商品成本记录
 */
export async function findProductCostByMerchantCode(merchantCode: string): Promise<any | null> {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select()
    .from(productCosts)
    .where(and(
      eq(productCosts.merchantCode, merchantCode),
      eq(productCosts.status, 0)
    ))
    .limit(1);
  
  return results.length > 0 ? results[0] : null;
}

/**
 * 获取商品的入库历史记录
 */
export async function getPurchaseInHistory(skuId: string, limit: number = 10): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select({
      ioId: jstPurchaseIn.ioId,
      ioDate: jstPurchaseIn.ioDate,
      supplierName: jstPurchaseIn.supplierName,
      warehouse: jstPurchaseIn.warehouse,
      qty: jstPurchaseInItem.qty,
      costPrice: jstPurchaseInItem.costPrice,
      costAmount: jstPurchaseInItem.costAmount,
    })
    .from(jstPurchaseInItem)
    .innerJoin(jstPurchaseIn, eq(jstPurchaseInItem.purchaseInId, jstPurchaseIn.id))
    .where(eq(jstPurchaseInItem.skuId, skuId))
    .orderBy(desc(jstPurchaseIn.ioDate))
    .limit(limit);
  
  return results;
}

/**
 * 使用加权平均法计算成本
 */
export function calculateWeightedAverageCost(
  currentCost: number,
  currentStock: number,
  newCost: number,
  newQty: number
): number {
  const totalValue = (currentCost * currentStock) + (newCost * newQty);
  const totalQty = currentStock + newQty;
  
  if (totalQty === 0) {
    return newCost;
  }
  
  return Math.round((totalValue / totalQty) * 100) / 100;
}

/**
 * 更新商品成本
 */
export async function updateProductCost(
  productCostId: number,
  newCost: number,
  reason: string,
  operatorName: string = '系统自动'
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const currentProduct = await db
    .select()
    .from(productCosts)
    .where(eq(productCosts.id, productCostId))
    .limit(1);
  
  if (currentProduct.length === 0) {
    return false;
  }
  
  const oldCost = parseFloat(currentProduct[0].cost as string);
  
  if (Math.abs(oldCost - newCost) < 0.01) {
    return true;
  }
  
  await db
    .update(productCosts)
    .set({
      cost: newCost.toFixed(2),
      effectiveDate: new Date(),
    })
    .where(eq(productCosts.id, productCostId));
  
  await db.insert(productCostHistory).values({
    productCostId: productCostId,
    productId: currentProduct[0].productId,
    oldCost: oldCost.toFixed(2),
    newCost: newCost.toFixed(2),
    reason: reason,
    operatorName: operatorName,
  });
  
  return true;
}

/**
 * 处理入库单，自动更新关联商品的成本
 */
export async function processInboundForCostUpdate(
  purchaseInId: number,
  method: CostCalculationMethod = CostCalculationMethod.WEIGHTED_AVERAGE
): Promise<CostUpdateResult[]> {
  const db = await getDb();
  if (!db) return [];
  
  const items = await db
    .select()
    .from(jstPurchaseInItem)
    .where(eq(jstPurchaseInItem.purchaseInId, purchaseInId));
  
  const purchaseIn = await db
    .select()
    .from(jstPurchaseIn)
    .where(eq(jstPurchaseIn.id, purchaseInId))
    .limit(1);
  
  const ioId = purchaseIn.length > 0 ? purchaseIn[0].ioId : '';
  const results: CostUpdateResult[] = [];
  
  for (const item of items) {
    const skuId = item.skuId || '';
    const inboundCost = parseFloat(item.costPrice as string);
    const inboundQty = item.qty;
    
    if (!skuId) {
      continue;
    }
    
    const productCost = await findProductCostBySku(skuId);
    
    if (!productCost) {
      results.push({
        success: false,
        skuId: skuId,
        productName: item.name || '',
        oldCost: 0,
        newCost: inboundCost,
        method: method,
        reason: '未找到匹配的商品成本记录',
        purchaseInId: ioId,
      });
      continue;
    }
    
    const currentCost = parseFloat(productCost.cost as string);
    const currentStock = productCost.stock || 0;
    let newCost: number;
    
    switch (method) {
      case CostCalculationMethod.LATEST_COST:
        newCost = inboundCost;
        break;
      case CostCalculationMethod.WEIGHTED_AVERAGE:
      default:
        newCost = calculateWeightedAverageCost(currentCost, currentStock, inboundCost, inboundQty);
        break;
    }
    
    const reason = `入库单 ${ioId} 自动更新，入库数量: ${inboundQty}，入库单价: ¥${inboundCost.toFixed(2)}，计算方法: ${method}`;
    const success = await updateProductCost(productCost.id, newCost, reason);
    
    if (success) {
      await db
        .update(productCosts)
        .set({
          stock: currentStock + inboundQty,
        })
        .where(eq(productCosts.id, productCost.id));
    }
    
    results.push({
      success: success,
      skuId: skuId,
      productName: productCost.title,
      oldCost: currentCost,
      newCost: newCost,
      method: method,
      reason: success ? reason : '更新失败',
      purchaseInId: ioId,
    });
  }
  
  return results;
}

/**
 * 批量处理入库单，更新成本
 */
export async function batchProcessInboundForCostUpdate(
  startDate: string,
  endDate: string,
  method: CostCalculationMethod = CostCalculationMethod.WEIGHTED_AVERAGE
): Promise<{
  totalProcessed: number;
  successCount: number;
  failCount: number;
  results: CostUpdateResult[];
}> {
  const db = await getDb();
  if (!db) return { totalProcessed: 0, successCount: 0, failCount: 0, results: [] };
  
  const purchaseIns = await db
    .select()
    .from(jstPurchaseIn)
    .where(and(
      gte(jstPurchaseIn.ioDate, new Date(startDate)),
      lte(jstPurchaseIn.ioDate, new Date(endDate + ' 23:59:59'))
    ))
    .orderBy(jstPurchaseIn.ioDate);
  
  const allResults: CostUpdateResult[] = [];
  let successCount = 0;
  let failCount = 0;
  
  for (const purchaseIn of purchaseIns) {
    const results = await processInboundForCostUpdate(purchaseIn.id, method);
    allResults.push(...results);
    
    for (const result of results) {
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    }
  }
  
  return {
    totalProcessed: allResults.length,
    successCount,
    failCount,
    results: allResults,
  };
}

/**
 * 获取成本变动统计
 */
export async function getCostChangeStats(
  startDate: string,
  endDate: string
): Promise<{
  totalChanges: number;
  avgChangePercent: number;
  increaseCount: number;
  decreaseCount: number;
  topIncreases: any[];
  topDecreases: any[];
}> {
  const db = await getDb();
  if (!db) return { totalChanges: 0, avgChangePercent: 0, increaseCount: 0, decreaseCount: 0, topIncreases: [], topDecreases: [] };
  
  const changes = await db
    .select({
      id: productCostHistory.id,
      productId: productCostHistory.productId,
      oldCost: productCostHistory.oldCost,
      newCost: productCostHistory.newCost,
      reason: productCostHistory.reason,
      createdAt: productCostHistory.createdAt,
      title: productCosts.title,
    })
    .from(productCostHistory)
    .leftJoin(productCosts, eq(productCostHistory.productCostId, productCosts.id))
    .where(and(
      gte(productCostHistory.createdAt, new Date(startDate)),
      lte(productCostHistory.createdAt, new Date(endDate + ' 23:59:59'))
    ))
    .orderBy(desc(productCostHistory.createdAt));
  
  let totalChangePercent = 0;
  let increaseCount = 0;
  let decreaseCount = 0;
  const changesWithPercent: any[] = [];
  
  for (const change of changes) {
    const oldCost = parseFloat(change.oldCost as string);
    const newCost = parseFloat(change.newCost as string);
    const changePercent = oldCost > 0 ? ((newCost - oldCost) / oldCost) * 100 : 0;
    
    totalChangePercent += Math.abs(changePercent);
    
    if (newCost > oldCost) {
      increaseCount++;
    } else if (newCost < oldCost) {
      decreaseCount++;
    }
    
    changesWithPercent.push({
      ...change,
      changePercent,
      changeAmount: newCost - oldCost,
    });
  }
  
  const sortedByChange = [...changesWithPercent].sort((a, b) => b.changePercent - a.changePercent);
  
  return {
    totalChanges: changes.length,
    avgChangePercent: changes.length > 0 ? totalChangePercent / changes.length : 0,
    increaseCount,
    decreaseCount,
    topIncreases: sortedByChange.filter(c => c.changePercent > 0).slice(0, 5),
    topDecreases: sortedByChange.filter(c => c.changePercent < 0).slice(0, 5),
  };
}

/**
 * 获取商品成本与入库数据的关联信息
 */
export async function getProductCostWithInboundInfo(productCostId: number): Promise<{
  productCost: any;
  recentInbounds: any[];
  costHistory: any[];
  avgInboundCost: number;
  totalInboundQty: number;
}> {
  const db = await getDb();
  if (!db) throw new Error('数据库连接失败');
  
  const productCostResult = await db
    .select()
    .from(productCosts)
    .where(eq(productCosts.id, productCostId))
    .limit(1);
  
  if (productCostResult.length === 0) {
    throw new Error('商品成本记录不存在');
  }
  
  const productCost = productCostResult[0];
  const skuId = productCost.sku;
  
  const recentInbounds = await getPurchaseInHistory(skuId, 10);
  
  const costHistory = await db
    .select()
    .from(productCostHistory)
    .where(eq(productCostHistory.productCostId, productCostId))
    .orderBy(desc(productCostHistory.createdAt))
    .limit(10);
  
  let totalCost = 0;
  let totalQty = 0;
  
  for (const inbound of recentInbounds) {
    const qty = inbound.qty || 0;
    const cost = parseFloat(inbound.costPrice as string) || 0;
    totalCost += cost * qty;
    totalQty += qty;
  }
  
  const avgInboundCost = totalQty > 0 ? totalCost / totalQty : 0;
  
  return {
    productCost,
    recentInbounds,
    costHistory,
    avgInboundCost: Math.round(avgInboundCost * 100) / 100,
    totalInboundQty: totalQty,
  };
}
