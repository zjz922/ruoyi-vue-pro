/**
 * 订单管理模块路由
 * 包含：订单列表、订单详情、订单统计、订单同步等功能
 * 
 * 架构原则（严格执行）：
 * 1. 所有数据库读取操作由Java后端实现
 * 2. Node.js中间层只做API转发，不直接操作数据库
 * 3. 当Java API不可用时，返回空数据或错误提示，不使用模拟数据
 * 
 * @author Manus AI
 * @see ARCHITECTURE_PRINCIPLES.md
 * @see RUOYI_VUE_PRO_DEVELOPMENT_GUIDE.md
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { ENV } from "./_core/env";

// Java后端API基础URL
const JAVA_API_BASE_URL = ENV.javaApiBaseUrl || "http://localhost:8080";

/**
 * 调用Java后端API的通用方法
 * 严格遵循架构原则：所有数据从Java后端获取
 * 
 * @param endpoint API端点路径
 * @param params 请求参数
 * @param method HTTP方法
 * @returns API响应数据
 */
async function callJavaApi<T>(
  endpoint: string,
  params?: Record<string, unknown>,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
): Promise<T> {
  let url = `${JAVA_API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method === "GET" && params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  } else if ((method === "POST" || method === "PUT") && params) {
    options.body = JSON.stringify(params);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Java API error: ${response.status} ${response.statusText}`);
  }
  const result = await response.json();
  return result.data as T;
}

/**
 * 返回空数据结构（当Java API不可用时使用）
 * 不使用模拟数据，保持数据真实性
 */
const emptyResponse = {
  list: { list: [], total: 0 },
  detail: null,
  stats: {
    totalOrders: 0,
    totalAmount: 0,
    totalProfit: 0,
    avgOrderAmount: 0,
    orderGrowth: 0,
    amountGrowth: 0,
  },
};

export const orderRouter = router({
  // ========== 订单列表 ==========

  /**
   * 获取订单列表（公开）
   * 数据来源：Java后端 -> 抖店API同步数据
   */
  list: publicProcedure
    .input(z.object({
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
      search: z.string().optional(),
      status: z.string().optional(),
      province: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      sortBy: z.string().optional().default('orderTime'),
      sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
      shopId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/page", {
          pageNo: input.page,
          pageSize: input.pageSize,
          keyword: input.search,
          status: input.status,
          province: input.province,
          startDate: input.startDate,
          endDate: input.endDate,
          sortBy: input.sortBy,
          sortOrder: input.sortOrder,
          shopId: input.shopId,
        });
      } catch (error) {
        console.error("[OrderRouter] list API调用失败:", error);
        return emptyResponse.list;
      }
    }),

  // ========== 订单详情 ==========

  /**
   * 获取单个订单详情（公开）
   * 数据来源：Java后端 -> 数据库
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi(`/api/finance/orders/${input.id}`, {});
      } catch (error) {
        console.error("[OrderRouter] getById API调用失败:", error);
        return emptyResponse.detail;
      }
    }),

  /**
   * 根据订单号获取订单详情
   * 数据来源：Java后端 -> 数据库
   */
  getByOrderNo: publicProcedure
    .input(z.object({ orderNo: z.string() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/getByOrderNo", { orderNo: input.orderNo });
      } catch (error) {
        console.error("[OrderRouter] getByOrderNo API调用失败:", error);
        return emptyResponse.detail;
      }
    }),

  // ========== 订单统计 ==========

  /**
   * 获取订单统计数据（公开）
   * 数据来源：Java后端 -> 抖店订单数据聚合统计
   */
  stats: publicProcedure
    .input(z.object({
      shopId: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/stats", input || {});
      } catch (error) {
        console.error("[OrderRouter] stats API调用失败:", error);
        return emptyResponse.stats;
      }
    }),

  /**
   * 获取今日订单统计
   * 数据来源：Java后端 -> 抖店订单数据
   */
  todayStats: publicProcedure
    .input(z.object({ shopId: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/today-stats", input);
      } catch (error) {
        console.error("[OrderRouter] todayStats API调用失败:", error);
        return { orderCount: 0, totalAmount: 0, avgAmount: 0 };
      }
    }),

  /**
   * 获取最近30天订单统计
   * 数据来源：Java后端 -> 抖店订单数据聚合
   */
  thirtyDaysStats: publicProcedure
    .input(z.object({ shopId: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/thirty-days-stats", input);
      } catch (error) {
        console.error("[OrderRouter] thirtyDaysStats API调用失败:", error);
        return { dailyStats: [], summary: {} };
      }
    }),

  /**
   * 获取月度订单统计
   * 数据来源：Java后端 -> 抖店订单数据按月聚合
   */
  monthlyStats: publicProcedure
    .input(z.object({
      shopId: z.string().optional(),
      year: z.number().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/monthly-stats", input);
      } catch (error) {
        console.error("[OrderRouter] monthlyStats API调用失败:", error);
        return { monthlyStats: [], summary: {} };
      }
    }),

  /**
   * 获取年度订单统计
   * 数据来源：Java后端 -> 抖店订单数据按年聚合
   */
  yearlyStats: publicProcedure
    .input(z.object({ shopId: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/yearly-stats", input);
      } catch (error) {
        console.error("[OrderRouter] yearlyStats API调用失败:", error);
        return { yearlyStats: [], summary: {} };
      }
    }),

  // ========== 订单操作（需要登录） ==========

  /**
   * 新增订单（需要登录）
   * 操作：调用Java后端API，由Java后端写入数据库
   */
  create: protectedProcedure
    .input(z.object({
      mainOrderNo: z.string(),
      subOrderNo: z.string(),
      productName: z.string(),
      productSpec: z.string().optional(),
      quantity: z.number().default(1),
      sku: z.string().optional(),
      unitPrice: z.number(),
      payAmount: z.number(),
      freight: z.number().optional().default(0),
      totalDiscount: z.number().optional().default(0),
      platformDiscount: z.number().optional().default(0),
      merchantDiscount: z.number().optional().default(0),
      influencerDiscount: z.number().optional().default(0),
      serviceFee: z.number().optional().default(0),
      payMethod: z.string().optional(),
      receiver: z.string().optional(),
      province: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
      orderTime: z.string().optional(),
      payTime: z.string().optional(),
      shipTime: z.string().optional(),
      completeTime: z.string().optional(),
      status: z.string().default('待付款'),
      afterSaleStatus: z.string().optional(),
      cancelReason: z.string().optional(),
      appChannel: z.string().optional(),
      trafficSource: z.string().optional(),
      orderType: z.string().optional(),
      influencerId: z.string().optional(),
      influencerName: z.string().optional(),
      flagColor: z.string().optional(),
      merchantRemark: z.string().optional(),
      shopName: z.string().optional().default('滋栈官方旗舰店'),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/create", input, "POST");
      } catch (error) {
        console.error("[OrderRouter] create API调用失败:", error);
        return { success: false, message: "订单创建服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /**
   * 更新订单（需要登录）
   * 操作：调用Java后端API，由Java后端更新数据库
   */
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      mainOrderNo: z.string().optional(),
      subOrderNo: z.string(),
      productName: z.string().optional(),
      productSpec: z.string().optional(),
      quantity: z.number().optional(),
      sku: z.string().optional(),
      unitPrice: z.number().optional(),
      payAmount: z.number().optional(),
      freight: z.number().optional(),
      totalDiscount: z.number().optional(),
      platformDiscount: z.number().optional(),
      merchantDiscount: z.number().optional(),
      influencerDiscount: z.number().optional(),
      serviceFee: z.number().optional(),
      payMethod: z.string().optional(),
      receiver: z.string().optional(),
      province: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
      orderTime: z.string().optional(),
      payTime: z.string().optional(),
      shipTime: z.string().optional(),
      completeTime: z.string().optional(),
      status: z.string().optional(),
      afterSaleStatus: z.string().optional(),
      cancelReason: z.string().optional(),
      appChannel: z.string().optional(),
      trafficSource: z.string().optional(),
      orderType: z.string().optional(),
      influencerId: z.string().optional(),
      influencerName: z.string().optional(),
      flagColor: z.string().optional(),
      merchantRemark: z.string().optional(),
      shopName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi(`/api/finance/orders/${input.id}`, input, "PUT");
      } catch (error) {
        console.error("[OrderRouter] update API调用失败:", error);
        return { success: false, message: "订单更新服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /**
   * 删除订单（需要登录）
   * 操作：调用Java后端API，由Java后端删除数据库记录
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi(`/api/finance/orders/${input.id}`, {}, "DELETE");
      } catch (error) {
        console.error("[OrderRouter] delete API调用失败:", error);
        return { success: false, message: "订单删除服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /**
   * 批量导入订单（需要登录）
   * 操作：调用Java后端API，由Java后端批量写入数据库
   */
  batchImport: protectedProcedure
    .input(z.array(z.object({
      mainOrderNo: z.string(),
      subOrderNo: z.string(),
      productName: z.string(),
      productSpec: z.string().optional(),
      quantity: z.number().default(1),
      sku: z.string().optional(),
      unitPrice: z.number(),
      payAmount: z.number(),
      freight: z.number().optional().default(0),
      totalDiscount: z.number().optional().default(0),
      platformDiscount: z.number().optional().default(0),
      merchantDiscount: z.number().optional().default(0),
      influencerDiscount: z.number().optional().default(0),
      serviceFee: z.number().optional().default(0),
      payMethod: z.string().optional(),
      receiver: z.string().optional(),
      province: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
      orderTime: z.string().optional(),
      payTime: z.string().optional(),
      shipTime: z.string().optional(),
      completeTime: z.string().optional(),
      status: z.string().default('待付款'),
      afterSaleStatus: z.string().optional(),
      cancelReason: z.string().optional(),
      appChannel: z.string().optional(),
      trafficSource: z.string().optional(),
      orderType: z.string().optional(),
      influencerId: z.string().optional(),
      influencerName: z.string().optional(),
      flagColor: z.string().optional(),
      merchantRemark: z.string().optional(),
      shopName: z.string().optional().default('滋栈官方旗舰店'),
    })))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/batch-import", { orders: input }, "POST");
      } catch (error) {
        console.error("[OrderRouter] batchImport API调用失败:", error);
        return { success: false, message: "批量导入服务暂不可用，请确认Java后端服务已启动", imported: 0, failed: input.length };
      }
    }),

  // ========== 订单同步 ==========

  /**
   * 从抖店同步订单
   * 操作：调用Java后端API，由Java后端调用抖店API并写入数据库
   */
  syncFromDoudian: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      syncType: z.enum(["full", "incremental"]).optional().default("incremental"),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/sync-from-doudian", input, "POST");
      } catch (error) {
        console.error("[OrderRouter] syncFromDoudian API调用失败:", error);
        return { success: false, message: "抖店订单同步服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /**
   * 获取订单同步状态
   * 数据来源：Java后端 -> 同步日志表
   */
  syncStatus: publicProcedure
    .input(z.object({ shopId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/sync-status", input);
      } catch (error) {
        console.error("[OrderRouter] syncStatus API调用失败:", error);
        return { lastSyncTime: null, syncStatus: "unknown", pendingCount: 0 };
      }
    }),

  // ========== 订单对账 ==========

  /**
   * 获取订单对账数据
   * 数据来源：Java后端 -> 抖店订单与聚水潭出库单勾稽
   */
  reconciliation: publicProcedure
    .input(z.object({
      shopId: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      pageNo: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/reconciliation", input);
      } catch (error) {
        console.error("[OrderRouter] reconciliation API调用失败:", error);
        return { list: [], total: 0, matchedCount: 0, unmatchedCount: 0, differenceAmount: 0 };
      }
    }),

  /**
   * 执行订单对账
   * 操作：调用Java后端API，由Java后端执行对账逻辑并写入结果
   */
  executeReconciliation: protectedProcedure
    .input(z.object({
      shopId: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/execute-reconciliation", input, "POST");
      } catch (error) {
        console.error("[OrderRouter] executeReconciliation API调用失败:", error);
        return { success: false, message: "订单对账服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 订单成本 ==========

  /**
   * 更新订单成本
   * 操作：调用Java后端API，由Java后端更新订单成本数据
   */
  updateCost: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      productCost: z.number().optional(),
      shippingCost: z.number().optional(),
      packagingCost: z.number().optional(),
      otherCost: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi(`/api/finance/orders/${input.orderId}/cost`, input, "PUT");
      } catch (error) {
        console.error("[OrderRouter] updateCost API调用失败:", error);
        return { success: false, message: "成本更新服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  /**
   * 批量更新订单成本
   * 操作：调用Java后端API，由Java后端批量更新订单成本数据
   */
  batchUpdateCost: protectedProcedure
    .input(z.object({
      orderIds: z.array(z.number()),
      productCost: z.number().optional(),
      shippingCost: z.number().optional(),
      packagingCost: z.number().optional(),
      otherCost: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/batch-update-cost", input, "PUT");
      } catch (error) {
        console.error("[OrderRouter] batchUpdateCost API调用失败:", error);
        return { success: false, message: "批量成本更新服务暂不可用，请确认Java后端服务已启动" };
      }
    }),

  // ========== 订单导出 ==========

  /**
   * 导出订单数据
   * 操作：调用Java后端API，由Java后端生成导出文件
   */
  export: protectedProcedure
    .input(z.object({
      shopId: z.string().optional(),
      startDate: z.string(),
      endDate: z.string(),
      status: z.string().optional(),
      format: z.enum(["excel", "csv"]).optional().default("excel"),
    }))
    .mutation(async ({ input }) => {
      try {
        return await callJavaApi("/api/finance/orders/export", input, "POST");
      } catch (error) {
        console.error("[OrderRouter] export API调用失败:", error);
        return { success: false, message: "订单导出服务暂不可用，请确认Java后端服务已启动" };
      }
    }),
});
