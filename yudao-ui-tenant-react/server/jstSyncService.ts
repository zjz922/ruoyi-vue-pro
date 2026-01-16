/**
 * 聚水潭数据同步服务
 * 负责同步入库数据、库存数据和仓库费用数据
 */
import { JstApiClient, type JstConfig, type PurchaseInData } from './jstApi';
import { getDb } from './db';
import { jstPurchaseIn, jstPurchaseInItem, jstSyncLog, jstWarehouseFee, dailyStats } from '../drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';

interface SyncResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

export class JstSyncService {
  private client: JstApiClient;

  constructor(config: JstConfig) {
    this.client = new JstApiClient(config);
  }

  /**
   * 同步采购入库数据
   */
  async syncPurchaseIn(startDate: string, endDate: string): Promise<SyncResult> {
    const db = await getDb();
    if (!db) throw new Error('数据库连接不可用');
    const result: SyncResult = { total: 0, success: 0, failed: 0, errors: [] };

    // 创建同步日志
    const [logResult] = await db.insert(jstSyncLog).values({
      syncType: 'purchase_in',
      syncDate: startDate.split(' ')[0],
      startTime: new Date(),
      status: 'running',
    });
    const logId = logResult.insertId;

    try {
      let pageIndex = 1;
      const pageSize = 50;
      let hasNext = true;

      while (hasNext) {
        const response = await this.client.queryPurchaseIn({
          modified_begin: startDate,
          modified_end: endDate,
          page_index: pageIndex,
          page_size: pageSize,
        });

        if (response.code !== 0 || !response.datas) {
          throw new Error(response.msg || '查询入库单失败');
        }

        for (const item of response.datas) {
          try {
            await this.savePurchaseIn(item);
            result.success++;
          } catch (error) {
            result.failed++;
            result.errors.push(`入库单${item.io_id}保存失败: ${error}`);
            console.error('保存入库单失败:', error);
          }
          result.total++;
        }

        hasNext = response.has_next || false;
        pageIndex++;
      }

      // 更新同步日志为成功
      await db.update(jstSyncLog)
        .set({
          endTime: new Date(),
          status: 'success',
          totalCount: result.total,
          successCount: result.success,
          failCount: result.failed,
        })
        .where(eq(jstSyncLog.id, Number(logId)));

    } catch (error) {
      // 更新同步日志为失败
      await db.update(jstSyncLog)
        .set({
          endTime: new Date(),
          status: 'failed',
          totalCount: result.total,
          successCount: result.success,
          failCount: result.failed,
          errorMessage: String(error),
        })
        .where(eq(jstSyncLog.id, Number(logId)));
      throw error;
    }

    return result;
  }

  /**
   * 保存入库单到数据库
   */
  private async savePurchaseIn(data: PurchaseInData): Promise<void> {
    const db = await getDb();
    if (!db) throw new Error('数据库连接不可用');

    // 计算总数量和总金额
    let totalQty = 0;
    let totalAmount = 0;
    if (data.items) {
      for (const item of data.items) {
        totalQty += item.qty || 0;
        totalAmount += item.cost_amount || 0;
      }
    }

    // 查询是否已存在
    const existing = await db.select()
      .from(jstPurchaseIn)
      .where(eq(jstPurchaseIn.ioId, String(data.io_id)))
      .limit(1);

    if (existing.length > 0) {
      // 更新现有记录
      await db.update(jstPurchaseIn)
        .set({
          poId: data.po_id ? String(data.po_id) : null,
          warehouse: data.warehouse,
          whId: data.wh_id ? String(data.wh_id) : null,
          supplierId: data.supplier_id ? String(data.supplier_id) : null,
          supplierName: data.supplier_name,
          status: data.status,
          ioDate: data.io_date ? new Date(data.io_date) : null,
          type: data.type,
          totalQty,
          totalAmount: String(totalAmount),
          remark: data.remark,
          rawData: JSON.stringify(data),
        })
        .where(eq(jstPurchaseIn.ioId, String(data.io_id)));

      // 删除旧的明细记录
      await db.delete(jstPurchaseInItem)
        .where(eq(jstPurchaseInItem.purchaseInId, existing[0].id));

      // 插入新的明细记录
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          await db.insert(jstPurchaseInItem).values({
            purchaseInId: existing[0].id,
            ioiId: String(item.ioi_id),
            skuId: item.sku_id,
            name: item.name,
            qty: item.qty,
            costPrice: String(item.cost_price),
            costAmount: String(item.cost_amount),
            remark: item.remark,
          });
        }
      }
    } else {
      // 插入新记录
      const [insertResult] = await db.insert(jstPurchaseIn).values({
        ioId: String(data.io_id),
        poId: data.po_id ? String(data.po_id) : null,
        warehouse: data.warehouse,
        whId: data.wh_id ? String(data.wh_id) : null,
        supplierId: data.supplier_id ? String(data.supplier_id) : null,
        supplierName: data.supplier_name,
        status: data.status,
        ioDate: data.io_date ? new Date(data.io_date) : null,
        type: data.type,
        totalQty,
        totalAmount: String(totalAmount),
        remark: data.remark,
        rawData: JSON.stringify(data),
      });

      // 插入明细记录
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          await db.insert(jstPurchaseInItem).values({
            purchaseInId: Number(insertResult.insertId),
            ioiId: String(item.ioi_id),
            skuId: item.sku_id,
            name: item.name,
            qty: item.qty,
            costPrice: String(item.cost_price),
            costAmount: String(item.cost_amount),
            remark: item.remark,
          });
        }
      }
    }
  }

  /**
   * 更新每日统计中的入库成本数据
   */
  async updateDailyPurchaseCost(date: string): Promise<void> {
    const db = await getDb();
    if (!db) return;

    // 查询当日入库总成本
    const result = await db.select({
      totalCost: sql<string>`COALESCE(SUM(${jstPurchaseIn.totalAmount}), 0)`,
    })
      .from(jstPurchaseIn)
      .where(sql`DATE(${jstPurchaseIn.ioDate}) = ${date}`);

    const totalCost = result[0]?.totalCost || '0';

    // 查询是否已有当日统计记录
    const existing = await db.select()
      .from(dailyStats)
      .where(eq(dailyStats.statDate, date))
      .limit(1);

    if (existing.length > 0) {
      // 更新入库成本字段（这里假设有一个purchaseCost字段，如果没有可以用productCost代替）
      await db.update(dailyStats)
        .set({
          productCost: totalCost,
        })
        .where(eq(dailyStats.statDate, date));
    }
  }

  /**
   * 获取同步日志列表
   */
  async getSyncLogs(params: {
    syncType?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ data: any[]; total: number }> {
    const db = await getDb();
    if (!db) return { data: [], total: 0 };
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const offset = (page - 1) * pageSize;

    let query = db.select().from(jstSyncLog);
    
    if (params.syncType) {
      query = query.where(eq(jstSyncLog.syncType, params.syncType)) as any;
    }

    const data = await query
      .orderBy(sql`${jstSyncLog.createdAt} DESC`)
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const countResult = await db.select({
      count: sql<number>`COUNT(*)`,
    }).from(jstSyncLog);

    return {
      data,
      total: countResult[0]?.count || 0,
    };
  }

  /**
   * 获取入库单列表
   */
  async getPurchaseInList(params: {
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ data: any[]; total: number }> {
    const db = await getDb();
    if (!db) return { data: [], total: 0 };
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const offset = (page - 1) * pageSize;

    const conditions = [];
    if (params.startDate) {
      conditions.push(sql`DATE(${jstPurchaseIn.ioDate}) >= ${params.startDate}`);
    }
    if (params.endDate) {
      conditions.push(sql`DATE(${jstPurchaseIn.ioDate}) <= ${params.endDate}`);
    }
    if (params.status) {
      conditions.push(eq(jstPurchaseIn.status, params.status));
    }

    let query = db.select().from(jstPurchaseIn);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const data = await query
      .orderBy(sql`${jstPurchaseIn.ioDate} DESC`)
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    let countQuery = db.select({ count: sql<number>`COUNT(*)` }).from(jstPurchaseIn);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions)) as any;
    }
    const countResult = await countQuery;

    return {
      data,
      total: countResult[0]?.count || 0,
    };
  }

  /**
   * 获取入库单明细
   */
  async getPurchaseInDetail(ioId: string): Promise<any> {
    const db = await getDb();
    if (!db) return null;

    const purchaseIn = await db.select()
      .from(jstPurchaseIn)
      .where(eq(jstPurchaseIn.ioId, ioId))
      .limit(1);

    if (purchaseIn.length === 0) {
      return null;
    }

    const items = await db.select()
      .from(jstPurchaseInItem)
      .where(eq(jstPurchaseInItem.purchaseInId, purchaseIn[0].id));

    return {
      ...purchaseIn[0],
      items,
    };
  }

  /**
   * 获取入库统计数据
   */
  async getPurchaseInStats(params: {
    startDate?: string;
    endDate?: string;
  } = {}): Promise<{
    totalCount: number;
    totalQty: number;
    totalAmount: number;
    bySupplier: { supplierName: string; count: number; amount: number }[];
    byWarehouse: { warehouse: string; count: number; amount: number }[];
  }> {
    const db = await getDb();
    if (!db) return { totalCount: 0, totalQty: 0, totalAmount: 0, bySupplier: [], byWarehouse: [] };

    const conditions = [];
    if (params.startDate) {
      conditions.push(sql`DATE(${jstPurchaseIn.ioDate}) >= ${params.startDate}`);
    }
    if (params.endDate) {
      conditions.push(sql`DATE(${jstPurchaseIn.ioDate}) <= ${params.endDate}`);
    }

    // 总体统计
    let totalQuery = db.select({
      totalCount: sql<number>`COUNT(*)`,
      totalQty: sql<number>`COALESCE(SUM(${jstPurchaseIn.totalQty}), 0)`,
      totalAmount: sql<string>`COALESCE(SUM(${jstPurchaseIn.totalAmount}), 0)`,
    }).from(jstPurchaseIn);
    
    if (conditions.length > 0) {
      totalQuery = totalQuery.where(and(...conditions)) as any;
    }
    const totalResult = await totalQuery;

    // 按供应商统计
    let supplierQuery = db.select({
      supplierName: jstPurchaseIn.supplierName,
      count: sql<number>`COUNT(*)`,
      amount: sql<string>`COALESCE(SUM(${jstPurchaseIn.totalAmount}), 0)`,
    })
      .from(jstPurchaseIn)
      .groupBy(jstPurchaseIn.supplierName);
    
    if (conditions.length > 0) {
      supplierQuery = supplierQuery.where(and(...conditions)) as any;
    }
    const supplierResult = await supplierQuery;

    // 按仓库统计
    let warehouseQuery = db.select({
      warehouse: jstPurchaseIn.warehouse,
      count: sql<number>`COUNT(*)`,
      amount: sql<string>`COALESCE(SUM(${jstPurchaseIn.totalAmount}), 0)`,
    })
      .from(jstPurchaseIn)
      .groupBy(jstPurchaseIn.warehouse);
    
    if (conditions.length > 0) {
      warehouseQuery = warehouseQuery.where(and(...conditions)) as any;
    }
    const warehouseResult = await warehouseQuery;

    return {
      totalCount: totalResult[0]?.totalCount || 0,
      totalQty: totalResult[0]?.totalQty || 0,
      totalAmount: parseFloat(totalResult[0]?.totalAmount || '0'),
      bySupplier: supplierResult.map(r => ({
        supplierName: r.supplierName || '未知供应商',
        count: r.count,
        amount: parseFloat(r.amount || '0'),
      })),
      byWarehouse: warehouseResult.map(r => ({
        warehouse: r.warehouse || '未知仓库',
        count: r.count,
        amount: parseFloat(r.amount || '0'),
      })),
    };
  }
}

export type { SyncResult };
