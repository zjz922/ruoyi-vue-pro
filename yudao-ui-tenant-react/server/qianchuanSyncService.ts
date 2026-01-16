/**
 * 巨量千川数据同步服务
 * 负责同步千川推广费用数据并与订单数据关联
 */

import { getDb } from './db';
import { qianchuanConfig, qianchuanCost, qianchuanSyncLog, dailyStats } from '../drizzle/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { QianchuanApiClient } from './qianchuanApi';

interface SyncResult {
  success: boolean;
  recordCount: number;
  message: string;
  duration: number;
}

/**
 * 获取千川配置
 */
export async function getQianchuanConfigData() {
  const db = await getDb();
  if (!db) return null;
  
  const configs = await db.select().from(qianchuanConfig).where(eq(qianchuanConfig.status, 1));
  return configs[0] || null;
}

/**
 * 保存千川配置
 */
export async function saveQianchuanConfig(config: {
  appId: string;
  appSecret: string;
  advertiserId?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  refreshExpiresAt?: Date;
  status?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const existing = await db.select().from(qianchuanConfig).limit(1);
  
  if (existing.length > 0) {
    await db.update(qianchuanConfig)
      .set({
        ...config,
        updatedAt: new Date(),
      })
      .where(eq(qianchuanConfig.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(qianchuanConfig).values({
      appId: config.appId,
      appSecret: config.appSecret,
      advertiserId: config.advertiserId,
      accessToken: config.accessToken,
      refreshToken: config.refreshToken,
      tokenExpiresAt: config.tokenExpiresAt,
      refreshExpiresAt: config.refreshExpiresAt,
      status: config.status || 0,
    });
    return result[0].insertId;
  }
}

/**
 * 刷新千川Token
 */
export async function refreshQianchuanToken(): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const config = await getQianchuanConfigData();
  if (!config || !config.refreshToken) {
    console.error('[QianchuanSync] No config or refresh token available');
    return false;
  }

  // 检查refresh token是否过期
  if (config.refreshExpiresAt && new Date(config.refreshExpiresAt) < new Date()) {
    console.error('[QianchuanSync] Refresh token expired, need re-authorization');
    await db.update(qianchuanConfig)
      .set({ status: 2 }) // 标记为已过期
      .where(eq(qianchuanConfig.id, config.id));
    return false;
  }

  try {
    const client = new QianchuanApiClient({
      appId: config.appId,
      appSecret: config.appSecret,
      refreshToken: config.refreshToken,
    });

    const result = await client.refreshToken();
    
    if (result.code !== 0) {
      console.error('[QianchuanSync] Failed to refresh token:', result.message);
      return false;
    }

    // 更新token
    const now = new Date();
    await db.update(qianchuanConfig)
      .set({
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token,
        tokenExpiresAt: new Date(now.getTime() + result.data.expires_in * 1000),
        refreshExpiresAt: new Date(now.getTime() + result.data.refresh_token_expires_in * 1000),
        status: 1,
        updatedAt: now,
      })
      .where(eq(qianchuanConfig.id, config.id));

    console.log('[QianchuanSync] Token refreshed successfully');
    return true;
  } catch (error) {
    console.error('[QianchuanSync] Error refreshing token:', error);
    return false;
  }
}

/**
 * 同步千川推广费用数据
 */
export async function syncQianchuanCostData(
  startDate: string,
  endDate: string,
  syncType: 'daily' | 'manual' = 'manual'
): Promise<SyncResult> {
  const db = await getDb();
  if (!db) {
    return {
      success: false,
      recordCount: 0,
      message: 'Database not available',
      duration: 0,
    };
  }
  
  const startTime = Date.now();
  
  // 创建同步日志
  const logResult = await db.insert(qianchuanSyncLog).values({
    syncType,
    startDate,
    endDate,
    status: 'pending',
  });
  const logId = logResult[0].insertId;

  try {
    // 获取配置
    const config = await getQianchuanConfigData();
    if (!config) {
      throw new Error('千川配置不存在，请先完成授权');
    }

    if (config.status !== 1) {
      throw new Error('千川授权已过期，请重新授权');
    }

    // 检查token是否即将过期（提前5分钟刷新）
    if (config.tokenExpiresAt) {
      const expiresAt = new Date(config.tokenExpiresAt);
      const now = new Date();
      if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
        const refreshed = await refreshQianchuanToken();
        if (!refreshed) {
          throw new Error('Token刷新失败');
        }
        // 重新获取配置
        const newConfig = await getQianchuanConfigData();
        if (newConfig) {
          config.accessToken = newConfig.accessToken;
        }
      }
    }

    // 创建API客户端
    const client = new QianchuanApiClient({
      appId: config.appId,
      appSecret: config.appSecret,
      accessToken: config.accessToken || undefined,
      advertiserId: config.advertiserId || undefined,
    });

    // 调用API获取数据
    const result = await client.getAdvertiserReport({
      advertiserId: config.advertiserId || '',
      startDate,
      endDate,
      timeGranularity: 'TIME_GRANULARITY_DAILY',
    });

    if (result.code !== 0) {
      throw new Error(result.message || '获取千川数据失败');
    }

    // 保存数据
    let recordCount = 0;
    for (const item of result.data.list) {
      // 计算衍生指标
      const showCnt = item.show_cnt || 0;
      const clickCnt = item.click_cnt || 0;
      const statCost = item.stat_cost || 0;
      const payOrderCount = item.pay_order_count || 0;

      const ctr = showCnt > 0 ? clickCnt / showCnt : null;
      const cpm = showCnt > 0 ? (statCost / showCnt) * 1000 : null;
      const costPerOrder = payOrderCount > 0 ? statCost / payOrderCount : null;

      // 检查是否已存在
      const existing = await db.select()
        .from(qianchuanCost)
        .where(and(
          eq(qianchuanCost.advertiserId, config.advertiserId || ''),
          eq(qianchuanCost.statDate, item.stat_datetime)
        ));

      if (existing.length > 0) {
        // 更新
        await db.update(qianchuanCost)
          .set({
            statCost: String(statCost),
            showCnt,
            clickCnt,
            ctr: ctr !== null ? String(ctr) : null,
            cpm: cpm !== null ? String(cpm) : null,
            payOrderCount,
            payOrderAmount: String(item.pay_order_amount || 0),
            roi: item.prepay_and_pay_order_roi !== undefined ? String(item.prepay_and_pay_order_roi) : null,
            costPerOrder: costPerOrder !== null ? String(costPerOrder) : null,
            syncTime: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(qianchuanCost.id, existing[0].id));
      } else {
        // 插入
        await db.insert(qianchuanCost).values({
          advertiserId: config.advertiserId || '',
          statDate: item.stat_datetime,
          statCost: String(statCost),
          showCnt,
          clickCnt,
          ctr: ctr !== null ? String(ctr) : null,
          cpm: cpm !== null ? String(cpm) : null,
          payOrderCount,
          payOrderAmount: String(item.pay_order_amount || 0),
          roi: item.prepay_and_pay_order_roi !== undefined ? String(item.prepay_and_pay_order_roi) : null,
          costPerOrder: costPerOrder !== null ? String(costPerOrder) : null,
          syncTime: new Date(),
        });
      }

      // 更新每日统计表的推广费字段
      await updateDailyStatsPromotionFee(db, item.stat_datetime, statCost, {
        payOrderCount,
        payOrderAmount: item.pay_order_amount || 0,
        roi: item.prepay_and_pay_order_roi,
      });

      recordCount++;
    }

    const duration = Date.now() - startTime;

    // 更新同步日志
    await db.update(qianchuanSyncLog)
      .set({
        advertiserId: config.advertiserId,
        status: 'success',
        recordCount,
        duration,
        updatedAt: new Date(),
      })
      .where(eq(qianchuanSyncLog.id, logId));

    console.log(`[QianchuanSync] Sync completed: ${recordCount} records in ${duration}ms`);

    return {
      success: true,
      recordCount,
      message: `同步成功，共${recordCount}条数据`,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    // 更新同步日志
    await db.update(qianchuanSyncLog)
      .set({
        status: 'failed',
        errorMessage,
        duration,
        updatedAt: new Date(),
      })
      .where(eq(qianchuanSyncLog.id, logId));

    console.error('[QianchuanSync] Sync failed:', errorMessage);

    return {
      success: false,
      recordCount: 0,
      message: errorMessage,
      duration,
    };
  }
}

/**
 * 更新每日统计表的推广费字段
 */
async function updateDailyStatsPromotionFee(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  statDate: string,
  promotionFee: number,
  qcData: {
    payOrderCount: number;
    payOrderAmount: number;
    roi?: number;
  }
) {
  // 检查是否已存在
  const existing = await db.select()
    .from(dailyStats)
    .where(eq(dailyStats.statDate, statDate));

  if (existing.length > 0) {
    // 更新推广费和千川数据
    const record = existing[0];
    const salesAmount = parseFloat(String(record.salesAmount)) || 0;
    const refundAmount = parseFloat(String(record.refundAmount)) || 0;
    const expressFee = parseFloat(String(record.expressFee)) || 0;
    const influencerCommission = parseFloat(String(record.influencerCommission)) || 0;
    const serviceFee = parseFloat(String(record.serviceFee)) || 0;
    const productCostVal = parseFloat(String(record.productCost)) || 0;
    const otherFee = parseFloat(String(record.otherFee)) || 0;
    const insuranceFee = parseFloat(String(record.insuranceFee)) || 0;
    const compensation = parseFloat(String(record.compensation)) || 0;

    // 重新计算利润
    const estimatedProfit = salesAmount - refundAmount - expressFee - influencerCommission 
      - serviceFee - productCostVal - promotionFee - otherFee - insuranceFee - compensation;
    const profitRate = salesAmount > 0 ? estimatedProfit / salesAmount : 0;

    await db.update(dailyStats)
      .set({
        promotionFee: String(promotionFee),
        qcPayOrderCount: qcData.payOrderCount,
        qcPayOrderAmount: String(qcData.payOrderAmount),
        qcRoi: qcData.roi !== undefined ? String(qcData.roi) : null,
        estimatedProfit: String(estimatedProfit),
        profitRate: String(profitRate),
        promotionSyncTime: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(dailyStats.id, record.id));
  } else {
    // 创建新记录（仅包含推广费数据）
    await db.insert(dailyStats).values({
      statDate,
      promotionFee: String(promotionFee),
      qcPayOrderCount: qcData.payOrderCount,
      qcPayOrderAmount: String(qcData.payOrderAmount),
      qcRoi: qcData.roi !== undefined ? String(qcData.roi) : null,
      promotionSyncTime: new Date(),
    });
  }
}

/**
 * 获取同步日志列表
 */
export async function getSyncLogs(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(qianchuanSyncLog)
    .orderBy(sql`${qianchuanSyncLog.createdAt} DESC`)
    .limit(limit);
}

/**
 * 获取千川费用数据
 */
export async function getQianchuanCostDataByRange(startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(qianchuanCost)
    .where(and(
      gte(qianchuanCost.statDate, startDate),
      lte(qianchuanCost.statDate, endDate)
    ))
    .orderBy(sql`${qianchuanCost.statDate} ASC`);
}

/**
 * 每日自动同步任务（同步前一天的数据）
 */
export async function dailySyncTask(): Promise<SyncResult> {
  console.log('[QianchuanSync] Starting daily sync task...');
  
  // 计算前一天的日期
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];

  return syncQianchuanCostData(dateStr, dateStr, 'daily');
}

/**
 * 手动同步指定日期范围的数据
 */
export async function manualSyncTask(startDate: string, endDate: string): Promise<SyncResult> {
  console.log(`[QianchuanSync] Starting manual sync: ${startDate} to ${endDate}`);
  return syncQianchuanCostData(startDate, endDate, 'manual');
}
