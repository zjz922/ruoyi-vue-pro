import { eq, like, and, sql, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, productCosts, productCostHistory, InsertProductCost, InsertProductCostHistory, ProductCost } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== 商品成本相关操作 ====================

/**
 * 获取商品成本列表（分页、搜索、筛选）
 */
export async function getProductCosts(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  shopName?: string;
  status?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get product costs: database not available");
    return { data: [], total: 0 };
  }

  const { 
    page = 1, 
    pageSize = 20, 
    search, 
    shopName,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = params;

  try {
    // 构建查询条件
    const conditions = [];
    
    if (search) {
      conditions.push(
        sql`(${productCosts.title} LIKE ${`%${search}%`} OR ${productCosts.productId} LIKE ${`%${search}%`} OR ${productCosts.merchantCode} LIKE ${`%${search}%`})`
      );
    }
    
    if (shopName) {
      conditions.push(eq(productCosts.shopName, shopName));
    }
    
    if (status !== undefined) {
      conditions.push(eq(productCosts.status, status));
    }

    // 获取总数
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(productCosts);
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    const [{ count: total }] = await countQuery;

    // 获取数据
    let query = db.select().from(productCosts);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }
    
    // 排序
    const sortColumn = productCosts[sortBy as keyof typeof productCosts] || productCosts.createdAt;
    if (sortOrder === 'asc') {
      query = query.orderBy(asc(sortColumn as any)) as typeof query;
    } else {
      query = query.orderBy(desc(sortColumn as any)) as typeof query;
    }
    
    // 分页
    const offset = (page - 1) * pageSize;
    query = query.limit(pageSize).offset(offset) as typeof query;

    const data = await query;

    return { data, total };
  } catch (error) {
    console.error("[Database] Failed to get product costs:", error);
    throw error;
  }
}

/**
 * 根据ID获取单个商品成本
 */
export async function getProductCostById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get product cost: database not available");
    return undefined;
  }

  const result = await db.select().from(productCosts).where(eq(productCosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * 新增商品成本
 */
export async function createProductCost(data: InsertProductCost) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create product cost: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(productCosts).values(data);
    return { id: result[0].insertId };
  } catch (error) {
    console.error("[Database] Failed to create product cost:", error);
    throw error;
  }
}

/**
 * 更新商品成本
 */
export async function updateProductCost(id: number, data: Partial<InsertProductCost>, operatorId?: number, operatorName?: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update product cost: database not available");
    throw new Error("Database not available");
  }

  try {
    // 获取旧数据
    const oldData = await getProductCostById(id);
    if (!oldData) {
      throw new Error("Product cost not found");
    }

    // 如果成本发生变化，记录历史
    if (data.cost !== undefined && data.cost !== oldData.cost) {
      await db.insert(productCostHistory).values({
        productCostId: id,
        productId: oldData.productId,
        oldCost: oldData.cost,
        newCost: data.cost,
        reason: data.customName || '手动修改',
        operatorId,
        operatorName,
      });
    }

    // 更新数据
    await db.update(productCosts).set(data).where(eq(productCosts.id, id));
    
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to update product cost:", error);
    throw error;
  }
}

/**
 * 删除商品成本（软删除）
 */
export async function deleteProductCost(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete product cost: database not available");
    throw new Error("Database not available");
  }

  try {
    await db.update(productCosts).set({ status: 1 }).where(eq(productCosts.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to delete product cost:", error);
    throw error;
  }
}

/**
 * 批量导入商品成本
 */
export async function batchImportProductCosts(dataList: InsertProductCost[]) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot batch import product costs: database not available");
    throw new Error("Database not available");
  }

  try {
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const data of dataList) {
      try {
        // 检查是否已存在
        const existing = await db.select()
          .from(productCosts)
          .where(and(
            eq(productCosts.productId, data.productId),
            eq(productCosts.sku, data.sku),
            eq(productCosts.shopName, data.shopName || '滋栈官方旗舰店')
          ))
          .limit(1);

        if (existing.length > 0) {
          // 更新现有记录
          await db.update(productCosts)
            .set({
              title: data.title,
              cost: data.cost,
              price: data.price,
              merchantCode: data.merchantCode,
              customName: data.customName,
              stock: data.stock,
              status: data.status,
              effectiveDate: data.effectiveDate,
            })
            .where(eq(productCosts.id, existing[0].id));
        } else {
          // 插入新记录
          await db.insert(productCosts).values(data);
        }
        successCount++;
      } catch (err: any) {
        errorCount++;
        errors.push(`${data.title}: ${err.message}`);
      }
    }

    return { successCount, errorCount, errors };
  } catch (error) {
    console.error("[Database] Failed to batch import product costs:", error);
    throw error;
  }
}

/**
 * 获取商品成本变更历史
 */
export async function getProductCostHistory(productCostId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get product cost history: database not available");
    return [];
  }

  try {
    const result = await db.select()
      .from(productCostHistory)
      .where(eq(productCostHistory.productCostId, productCostId))
      .orderBy(desc(productCostHistory.createdAt));
    
    return result;
  } catch (error) {
    console.error("[Database] Failed to get product cost history:", error);
    throw error;
  }
}

/**
 * 获取所有店铺名称列表
 */
export async function getShopNames() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get shop names: database not available");
    return [];
  }

  try {
    const result = await db.selectDistinct({ shopName: productCosts.shopName }).from(productCosts);
    return result.map(r => r.shopName).filter(Boolean);
  } catch (error) {
    console.error("[Database] Failed to get shop names:", error);
    throw error;
  }
}


// ==================== 订单相关操作 ====================

import { orders, InsertOrder, Order } from "../drizzle/schema";

/**
 * 获取订单列表（分页、搜索、筛选）
 */
export async function getOrders(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  province?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  shopId?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get orders: database not available");
    return { data: [], total: 0 };
  }

  const { 
    page = 1, 
    pageSize = 20, 
    search, 
    status,
    province,
    startDate,
    endDate,
    sortBy = 'orderTime',
    sortOrder = 'desc',
    shopId
  } = params;

  try {
    // 构建查询条件
    const conditions = [];
    
    // 排除已删除的订单
    conditions.push(eq(orders.deleted, 0));
    
    if (search) {
      conditions.push(
        sql`(${orders.mainOrderNo} LIKE ${`%${search}%`} OR ${orders.productName} LIKE ${`%${search}%`} OR ${orders.receiver} LIKE ${`%${search}%`})`
      );
    }
    
    if (status) {
      conditions.push(eq(orders.status, status));
    }
    
    if (province) {
      conditions.push(eq(orders.province, province));
    }

    if (startDate) {
      conditions.push(sql`${orders.orderTime} >= ${startDate}`);
    }

    if (endDate) {
      conditions.push(sql`${orders.orderTime} <= ${endDate}`);
    }

    // 店铺ID过滤（通过shopName匹配，因为订单表存储的是店铺名称）
    // 注意：实际生产中应该通过shopId关联，这里为了兼容现有数据使用shopName
    if (shopId) {
      // 如果有店铺ID，需要查询对应的店铺名称
      // 这里假设 shopId 就是店铺名称，或者通过关联查询获取
      conditions.push(eq(orders.shopName, shopId));
    }

    // 获取总数
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(orders);
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    const [{ count: total }] = await countQuery;

    // 获取数据
    let query = db.select().from(orders);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }
    
    // 排序
    const sortColumn = orders[sortBy as keyof typeof orders] || orders.orderTime;
    if (sortOrder === 'asc') {
      query = query.orderBy(asc(sortColumn as any)) as typeof query;
    } else {
      query = query.orderBy(desc(sortColumn as any)) as typeof query;
    }
    
    // 分页
    const offset = (page - 1) * pageSize;
    query = query.limit(pageSize).offset(offset) as typeof query;

    const data = await query;

    return { data, total };
  } catch (error) {
    console.error("[Database] Failed to get orders:", error);
    throw error;
  }
}

/**
 * 根据ID获取单个订单
 */
export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get order: database not available");
    return undefined;
  }

  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * 新增订单
 */
export async function createOrder(data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create order: database not available");
    throw new Error("Database not available");
  }

  try {
    // 处理时间字段
    const orderData: any = { ...data };
    if (data.orderTime && typeof data.orderTime === 'string') {
      orderData.orderTime = new Date(data.orderTime);
    }
    if (data.payTime && typeof data.payTime === 'string') {
      orderData.payTime = new Date(data.payTime);
    }
    if (data.shipTime && typeof data.shipTime === 'string') {
      orderData.shipTime = new Date(data.shipTime);
    }
    if (data.completeTime && typeof data.completeTime === 'string') {
      orderData.completeTime = new Date(data.completeTime);
    }

    const result = await db.insert(orders).values(orderData);
    return { id: result[0].insertId };
  } catch (error) {
    console.error("[Database] Failed to create order:", error);
    throw error;
  }
}

/**
 * 更新订单
 */
export async function updateOrder(id: number, data: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update order: database not available");
    throw new Error("Database not available");
  }

  try {
    // 处理时间字段
    const orderData: any = { ...data };
    if (data.orderTime && typeof data.orderTime === 'string') {
      orderData.orderTime = new Date(data.orderTime);
    }
    if (data.payTime && typeof data.payTime === 'string') {
      orderData.payTime = new Date(data.payTime);
    }
    if (data.shipTime && typeof data.shipTime === 'string') {
      orderData.shipTime = new Date(data.shipTime);
    }
    if (data.completeTime && typeof data.completeTime === 'string') {
      orderData.completeTime = new Date(data.completeTime);
    }

    await db.update(orders).set(orderData).where(eq(orders.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to update order:", error);
    throw error;
  }
}

/**
 * 删除订单（软删除）
 */
export async function deleteOrder(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete order: database not available");
    throw new Error("Database not available");
  }

  try {
    await db.update(orders).set({ deleted: 1 }).where(eq(orders.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to delete order:", error);
    throw error;
  }
}

/**
 * 批量导入订单
 */
export async function batchImportOrders(dataList: any[]) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot batch import orders: database not available");
    throw new Error("Database not available");
  }

  try {
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const data of dataList) {
      try {
        // 检查是否已存在（通过子订单号）
        const existing = await db.select()
          .from(orders)
          .where(eq(orders.subOrderNo, data.subOrderNo || data.mainOrderNo))
          .limit(1);

        // 处理时间字段
        const orderData: any = { ...data };
        if (data.orderTime && typeof data.orderTime === 'string') {
          orderData.orderTime = new Date(data.orderTime);
        }
        if (data.payTime && typeof data.payTime === 'string') {
          orderData.payTime = new Date(data.payTime);
        }
        if (data.shipTime && typeof data.shipTime === 'string') {
          orderData.shipTime = new Date(data.shipTime);
        }
        if (data.completeTime && typeof data.completeTime === 'string') {
          orderData.completeTime = new Date(data.completeTime);
        }

        if (existing.length > 0) {
          // 更新现有记录
          await db.update(orders)
            .set(orderData)
            .where(eq(orders.id, existing[0].id));
        } else {
          // 插入新记录
          await db.insert(orders).values(orderData);
        }
        successCount++;
      } catch (err: any) {
        errorCount++;
        errors.push(`${data.mainOrderNo}: ${err.message}`);
      }
    }

    return { successCount, errorCount, errors };
  } catch (error) {
    console.error("[Database] Failed to batch import orders:", error);
    throw error;
  }
}

/**
 * 获取订单统计数据
 */
export async function getOrderStats(params?: { shopId?: string }) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get order stats: database not available");
    return {
      totalOrders: 0,
      totalAmount: 0,
      completedOrders: 0,
      pendingOrders: 0,
      refundedOrders: 0,
    };
  }

  const { shopId } = params || {};

  try {
    // 基础条件：未删除
    const baseConditions = [eq(orders.deleted, 0)];
    
    // 如果有店铺ID，添加店铺过滤条件
    if (shopId) {
      baseConditions.push(eq(orders.shopName, shopId));
    }

    // 总订单数
    const [{ count: totalOrders }] = await db.select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(...baseConditions));

    // 总金额
    const [{ total: totalAmount }] = await db.select({ total: sql<number>`COALESCE(SUM(payAmount), 0)` })
      .from(orders)
      .where(and(...baseConditions));

    // 已完成订单数
    const [{ count: completedOrders }] = await db.select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(...baseConditions, eq(orders.status, '已完成')));

    // 待发货订单数
    const [{ count: pendingOrders }] = await db.select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(...baseConditions, eq(orders.status, '待发货')));

    // 退款订单数
    const [{ count: refundedOrders }] = await db.select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(...baseConditions, eq(orders.afterSaleStatus, '退款成功')));

    return {
      totalOrders,
      totalAmount: Number(totalAmount) || 0,
      completedOrders,
      pendingOrders,
      refundedOrders,
    };
  } catch (error) {
    console.error("[Database] Failed to get order stats:", error);
    throw error;
  }
}
