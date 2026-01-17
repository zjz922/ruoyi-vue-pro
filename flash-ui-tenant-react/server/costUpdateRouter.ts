/**
 * 成本自动更新路由
 * 提供入库数据与成本配置的关联API
 */

import { router, publicProcedure } from './_core/trpc';
import { z } from 'zod';
import {
  findProductCostBySku,
  findProductCostByMerchantCode,
  getPurchaseInHistory,
  processInboundForCostUpdate,
  batchProcessInboundForCostUpdate,
  getCostChangeStats,
  getProductCostWithInboundInfo,
  CostCalculationMethod,
} from './costUpdateService';

export const costUpdateRouter = router({
  /**
   * 根据SKU查找商品成本
   */
  findBySku: publicProcedure
    .input(z.object({
      skuId: z.string(),
    }))
    .query(async ({ input }) => {
      const result = await findProductCostBySku(input.skuId);
      return {
        success: !!result,
        data: result,
      };
    }),

  /**
   * 根据商家编码查找商品成本
   */
  findByMerchantCode: publicProcedure
    .input(z.object({
      merchantCode: z.string(),
    }))
    .query(async ({ input }) => {
      const result = await findProductCostByMerchantCode(input.merchantCode);
      return {
        success: !!result,
        data: result,
      };
    }),

  /**
   * 获取商品的入库历史
   */
  getPurchaseHistory: publicProcedure
    .input(z.object({
      skuId: z.string(),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      const results = await getPurchaseInHistory(input.skuId, input.limit);
      return {
        success: true,
        data: results,
        total: results.length,
      };
    }),

  /**
   * 处理入库单，自动更新成本
   */
  processInbound: publicProcedure
    .input(z.object({
      purchaseInId: z.number(),
      method: z.enum(['weighted_average', 'latest_cost', 'fifo']).default('weighted_average'),
    }))
    .mutation(async ({ input }) => {
      const methodMap: Record<string, CostCalculationMethod> = {
        'weighted_average': CostCalculationMethod.WEIGHTED_AVERAGE,
        'latest_cost': CostCalculationMethod.LATEST_COST,
        'fifo': CostCalculationMethod.FIFO,
      };

      const results = await processInboundForCostUpdate(
        input.purchaseInId,
        methodMap[input.method]
      );

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      return {
        success: failCount === 0,
        totalProcessed: results.length,
        successCount,
        failCount,
        results,
      };
    }),

  /**
   * 批量处理入库单，更新成本
   */
  batchProcess: publicProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      method: z.enum(['weighted_average', 'latest_cost', 'fifo']).default('weighted_average'),
    }))
    .mutation(async ({ input }) => {
      const methodMap: Record<string, CostCalculationMethod> = {
        'weighted_average': CostCalculationMethod.WEIGHTED_AVERAGE,
        'latest_cost': CostCalculationMethod.LATEST_COST,
        'fifo': CostCalculationMethod.FIFO,
      };

      const result = await batchProcessInboundForCostUpdate(
        input.startDate,
        input.endDate,
        methodMap[input.method]
      );

      return {
        success: result.failCount === 0,
        ...result,
      };
    }),

  /**
   * 获取成本变动统计
   */
  getCostChangeStats: publicProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      const stats = await getCostChangeStats(input.startDate, input.endDate);
      return {
        success: true,
        data: stats,
      };
    }),

  /**
   * 获取商品成本与入库数据的关联信息
   */
  getProductCostWithInbound: publicProcedure
    .input(z.object({
      productCostId: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        const data = await getProductCostWithInboundInfo(input.productCostId);
        return {
          success: true,
          data,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : '获取信息失败',
        };
      }
    }),
});
