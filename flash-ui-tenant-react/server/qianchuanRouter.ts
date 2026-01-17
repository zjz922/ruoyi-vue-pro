/**
 * 巨量千川API路由
 */

import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './_core/trpc';
import { QianchuanApiClient } from './qianchuanApi';
import {
  getQianchuanConfigData,
  saveQianchuanConfig,
  syncQianchuanCostData,
  getSyncLogs,
  getQianchuanCostDataByRange,
  dailySyncTask,
  manualSyncTask,
} from './qianchuanSyncService';

export const qianchuanRouter = router({
  /**
   * 获取千川配置状态
   */
  getConfigStatus: publicProcedure.query(async () => {
    const config = await getQianchuanConfigData();
    if (!config) {
      return {
        configured: false,
        authorized: false,
        advertiserId: null,
        tokenExpiresAt: null,
      };
    }
    return {
      configured: true,
      authorized: config.status === 1,
      advertiserId: config.advertiserId,
      tokenExpiresAt: config.tokenExpiresAt,
      status: config.status,
    };
  }),

  /**
   * 保存千川配置（App ID和App Secret）
   */
  saveConfig: protectedProcedure
    .input(z.object({
      appId: z.string().min(1, '请输入App ID'),
      appSecret: z.string().min(1, '请输入App Secret'),
      advertiserId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await saveQianchuanConfig({
        appId: input.appId,
        appSecret: input.appSecret,
        advertiserId: input.advertiserId,
        status: 0, // 待授权
      });
      return { success: true, message: '配置保存成功' };
    }),

  /**
   * 获取授权链接
   */
  getAuthUrl: protectedProcedure
    .input(z.object({
      redirectUri: z.string().url(),
      state: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const config = await getQianchuanConfigData();
      if (!config) {
        throw new Error('请先保存千川配置');
      }

      const client = new QianchuanApiClient({
        appId: config.appId,
        appSecret: config.appSecret,
      });

      const authUrl = client.getAuthUrl(
        input.redirectUri,
        input.state || 'qianchuan_auth',
        ['qianchuan.report', 'qianchuan.account']
      );

      return { authUrl };
    }),

  /**
   * 使用授权码获取Token
   */
  exchangeToken: protectedProcedure
    .input(z.object({
      authCode: z.string().min(1, '请输入授权码'),
    }))
    .mutation(async ({ input }) => {
      const config = await getQianchuanConfigData();
      if (!config) {
        throw new Error('请先保存千川配置');
      }

      const client = new QianchuanApiClient({
        appId: config.appId,
        appSecret: config.appSecret,
      });

      const result = await client.getAccessToken(input.authCode);
      
      if (result.code !== 0) {
        throw new Error(result.message || '获取Token失败');
      }

      const now = new Date();
      await saveQianchuanConfig({
        appId: config.appId,
        appSecret: config.appSecret,
        advertiserId: result.data.advertiser_ids?.[0]?.toString(),
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token,
        tokenExpiresAt: new Date(now.getTime() + result.data.expires_in * 1000),
        refreshExpiresAt: new Date(now.getTime() + result.data.refresh_token_expires_in * 1000),
        status: 1, // 已授权
      });

      return {
        success: true,
        message: '授权成功',
        advertiserIds: result.data.advertiser_ids,
      };
    }),

  /**
   * 手动同步千川数据
   */
  syncData: protectedProcedure
    .input(z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式错误'),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式错误'),
    }))
    .mutation(async ({ input }) => {
      const result = await manualSyncTask(input.startDate, input.endDate);
      return result;
    }),

  /**
   * 执行每日同步任务
   */
  runDailySync: protectedProcedure.mutation(async () => {
    const result = await dailySyncTask();
    return result;
  }),

  /**
   * 获取同步日志
   */
  getSyncLogs: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
    }).optional())
    .query(async ({ input }) => {
      const logs = await getSyncLogs(input?.limit || 20);
      return logs;
    }),

  /**
   * 获取千川费用数据
   */
  getCostData: publicProcedure
    .input(z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式错误'),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式错误'),
    }))
    .query(async ({ input }) => {
      const data = await getQianchuanCostDataByRange(input.startDate, input.endDate);
      return data;
    }),

  /**
   * 获取千川费用汇总
   */
  getCostSummary: publicProcedure
    .input(z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式错误'),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式错误'),
    }))
    .query(async ({ input }) => {
      const data = await getQianchuanCostDataByRange(input.startDate, input.endDate);
      
      // 计算汇总
      let totalCost = 0;
      let totalShowCnt = 0;
      let totalClickCnt = 0;
      let totalPayOrderCount = 0;
      let totalPayOrderAmount = 0;

      for (const item of data) {
        totalCost += parseFloat(String(item.statCost)) || 0;
        totalShowCnt += item.showCnt || 0;
        totalClickCnt += item.clickCnt || 0;
        totalPayOrderCount += item.payOrderCount || 0;
        totalPayOrderAmount += parseFloat(String(item.payOrderAmount)) || 0;
      }

      const avgCtr = totalShowCnt > 0 ? totalClickCnt / totalShowCnt : 0;
      const avgCpm = totalShowCnt > 0 ? (totalCost / totalShowCnt) * 1000 : 0;
      const avgRoi = totalCost > 0 ? totalPayOrderAmount / totalCost : 0;
      const avgCostPerOrder = totalPayOrderCount > 0 ? totalCost / totalPayOrderCount : 0;

      return {
        totalCost,
        totalShowCnt,
        totalClickCnt,
        totalPayOrderCount,
        totalPayOrderAmount,
        avgCtr,
        avgCpm,
        avgRoi,
        avgCostPerOrder,
        dayCount: data.length,
      };
    }),
});
