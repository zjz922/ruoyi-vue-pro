/**
 * 订单同步服务
 * 从抖店API同步订单数据，支持增量同步
 */

import { getDb } from "./db";
import { orders, syncLogs } from "../drizzle/schema";
import { sql } from "drizzle-orm";

export interface SyncOptions {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  accessToken: string;
}

export interface SyncResult {
  success: boolean;
  newCount: number;
  updatedCount: number;
  totalCount: number;
  errorMessage?: string;
}

/**
 * 从抖店API获取订单列表
 * 这是一个模拟实现，实际应该调用真实的抖店API
 */
async function fetchOrdersFromDoudian(options: SyncOptions): Promise<any[]> {
  // TODO: 实现真实的抖店API调用
  // 这里使用模拟数据作为示例
  console.log(`[OrderSync] 从抖店获取订单: ${options.startDate} ~ ${options.endDate}`);

  // 模拟API调用
  return [];
}

/**
 * 同步订单数据
 * 支持增量同步（只同步新订单和更新订单）
 */
export async function syncOrdersFromDoudian(options: SyncOptions): Promise<SyncResult> {
  const db = await getDb();
  if (!db) {
    return {
      success: false,
      newCount: 0,
      updatedCount: 0,
      totalCount: 0,
      errorMessage: "数据库连接失败",
    };
  }

  let newCount = 0;
  let updatedCount = 0;
  let totalCount = 0;
  let errorMessage: string | undefined;

  try {
    // 记录同步开始
    const syncLogId = await db
      .insert(syncLogs)
      .values({
        syncType: "orders",
        startDate: new Date(options.startDate),
        endDate: new Date(options.endDate),
        status: "pending",
      })
      .$returningId();

    // 从抖店获取订单
    const doudianOrders = await fetchOrdersFromDoudian(options);
    totalCount = doudianOrders.length;

    if (totalCount === 0) {
      // 更新同步日志
      await db
        .update(syncLogs)
        .set({
          status: "success",
          newCount: 0,
          updatedCount: 0,
          totalCount: 0,
          completedAt: new Date(),
        })
        .where(sql`id = ${syncLogId}`);

      return {
        success: true,
        newCount: 0,
        updatedCount: 0,
        totalCount: 0,
      };
    }

    // 获取本地已有的订单
    const localOrderNos = await db
      .select({ mainOrderNo: orders.mainOrderNo })
      .from(orders)
      .where(
        sql`orderTime >= ${new Date(options.startDate)} AND orderTime <= ${new Date(options.endDate)}`
      );

    const localOrderNoSet = new Set(localOrderNos.map((o) => o.mainOrderNo));

    // 分类订单：新增和更新
    const newOrders: any[] = [];
    const updateOrders: any[] = [];

    for (const doudianOrder of doudianOrders) {
      if (localOrderNoSet.has(doudianOrder.order_no)) {
        updateOrders.push(doudianOrder);
      } else {
        newOrders.push(doudianOrder);
      }
    }

    // 批量插入新订单
    if (newOrders.length > 0) {
      const ordersToInsert = newOrders.map((o) => ({
        mainOrderNo: o.order_no,
        subOrderNo: o.sub_order_no,
        productName: o.product_name,
        productSpec: o.product_spec,
        quantity: o.quantity || 1,
        sku: o.sku,
        unitPrice: o.unit_price,
        payAmount: o.pay_amount,
        freight: o.freight || 0,
        totalDiscount: o.total_discount || 0,
        platformDiscount: o.platform_discount || 0,
        merchantDiscount: o.merchant_discount || 0,
        influencerDiscount: o.influencer_discount || 0,
        serviceFee: o.service_fee || 0,
        payMethod: o.pay_method,
        receiver: o.receiver,
        province: o.province,
        city: o.city,
        district: o.district,
        orderTime: new Date(o.order_time),
        payTime: o.pay_time ? new Date(o.pay_time) : null,
        shipTime: o.ship_time ? new Date(o.ship_time) : null,
        completeTime: o.complete_time ? new Date(o.complete_time) : null,
        status: o.status || "待付款",
        afterSaleStatus: o.after_sale_status,
        cancelReason: o.cancel_reason,
        appChannel: o.app_channel,
        trafficSource: o.traffic_source,
        orderType: o.order_type,
        influencerId: o.influencer_id,
        influencerName: o.influencer_name,
        flagColor: o.flag_color,
        merchantRemark: o.merchant_remark,
        shopName: "滋栈官方旗舰店",
      }));

      await db.insert(orders).values(ordersToInsert);
      newCount = newOrders.length;
    }

    // 批量更新已有订单
    if (updateOrders.length > 0) {
      for (const doudianOrder of updateOrders) {
        await db
          .update(orders)
          .set({
            status: doudianOrder.status || "待付款",
            payAmount: doudianOrder.pay_amount,
            payTime: doudianOrder.pay_time ? new Date(doudianOrder.pay_time) : null,
            shipTime: doudianOrder.ship_time ? new Date(doudianOrder.ship_time) : null,
            completeTime: doudianOrder.complete_time ? new Date(doudianOrder.complete_time) : null,
            afterSaleStatus: doudianOrder.after_sale_status,
            updatedAt: new Date(),
          })
          .where(sql`mainOrderNo = ${doudianOrder.order_no}`);
      }
      updatedCount = updateOrders.length;
    }

    // 更新同步日志
    await db
      .update(syncLogs)
      .set({
        status: "success",
        newCount,
        updatedCount,
        totalCount,
        completedAt: new Date(),
      })
      .where(sql`id = ${syncLogId}`);

    return {
      success: true,
      newCount,
      updatedCount,
      totalCount,
    };
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);

    // 记录同步失败
    try {
      await db
        .update(syncLogs)
        .set({
          status: "failed",
          errorMessage,
        })
        .where(sql`syncType = 'orders' AND status = 'pending'`);
    } catch (logError) {
      console.error("Failed to update sync log:", logError);
    }

    return {
      success: false,
      newCount,
      updatedCount,
      totalCount,
      errorMessage,
    };
  }
}

/**
 * 获取同步日志
 */
export async function getSyncLogs(syncType: string = "orders", limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(syncLogs)
      .where(sql`syncType = ${syncType}`)
      .orderBy(sql`createdAt DESC`)
      .limit(limit);
  } catch (error) {
    console.error("Failed to get sync logs:", error);
    return [];
  }
}

/**
 * 获取最后一次同步的时间
 */
export async function getLastSyncTime(syncType: string = "orders"): Promise<Date | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select({ completedAt: syncLogs.completedAt })
      .from(syncLogs)
      .where(sql`syncType = ${syncType} AND status = 'success'`)
      .orderBy(sql`completedAt DESC`)
      .limit(1);

    return result[0]?.completedAt || null;
  } catch (error) {
    console.error("Failed to get last sync time:", error);
    return null;
  }
}
