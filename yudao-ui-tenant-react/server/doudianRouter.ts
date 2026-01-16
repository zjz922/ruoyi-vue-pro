/**
 * 抖店授权管理路由
 * 包含：抖店OAuth授权、店铺管理、Token管理、数据同步等功能
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

import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './_core/trpc';
import { ENV } from './_core/env';
import {
  checkApiConfig,
  API_AVAILABILITY,
  getOrderList,
  getOrderDetail,
  getProductList,
  getProductDetail,
  getSettleBillDetail,
  getShopAccountItem,
  getDouKeSettleBillList,
  getInsuranceDetail,
  getAfterSaleList,
  getAfterSaleDetail,
} from './doudianApi';
import {
  getAuthUrl as getAuthUrlService,
  exchangeCodeForToken,
  getValidAccessToken,
} from './doudianAuthService';

// Java后端API基础URL
const JAVA_API_BASE_URL = ENV.javaApiBaseUrl || "http://localhost:8080";

/**
 * 调用Java后端API的通用方法
 * 严格遵循架构原则：所有数据库操作从Java后端获取
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

export const doudianRouter = router({
  // ========== API配置检查 ==========

  /**
   * 检查API配置状态
   * 操作：检查抖店API配置（不涉及数据库）
   */
  checkConfig: publicProcedure.query(async () => {
    const config = checkApiConfig();
    return {
      ...config,
      availability: API_AVAILABILITY,
    };
  }),

  /**
   * 获取API可用性信息
   */
  getAvailability: publicProcedure.query(async () => {
    return API_AVAILABILITY;
  }),

  // ========== 抖店API直接调用（需要accessToken） ==========

  /**
   * 同步订单列表
   * 操作：调用抖店API获取订单，由Java后端存储
   */
  syncOrders: protectedProcedure
    .input(z.object({
      accessToken: z.string(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      page: z.number().optional().default(1),
      size: z.number().optional().default(50),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await getOrderList(input.accessToken, {
          start_time: input.startTime,
          end_time: input.endTime,
          page: input.page,
          size: input.size,
        });
        return { success: true, data: result };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        return { success: false, error: errorMessage };
      }
    }),

  /**
   * 获取订单详情
   * 操作：调用抖店API获取订单详情
   */
  getOrderDetail: protectedProcedure
    .input(z.object({
      accessToken: z.string(),
      shopOrderId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getOrderDetail(input.accessToken, input.shopOrderId);
        return { success: true, data: result };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        return { success: false, error: errorMessage };
      }
    }),

  /**
   * 同步商品列表
   */
  syncProducts: protectedProcedure
    .input(z.object({
      accessToken: z.string(),
      page: z.number().optional().default(1),
      size: z.number().optional().default(50),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await getProductList(input.accessToken, {
          page: input.page,
          size: input.size,
        });
        return { success: true, data: result };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        return { success: false, error: errorMessage };
      }
    }),

  /**
   * 获取商品详情
   */
  getProductDetail: protectedProcedure
    .input(z.object({
      accessToken: z.string(),
      productId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getProductDetail(input.accessToken, input.productId);
        return { success: true, data: result };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        return { success: false, error: errorMessage };
      }
    }),

  /**
   * 获取结算账单
   */
  getSettleBill: protectedProcedure
    .input(z.object({
      accessToken: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      page: z.number().optional().default(1),
      size: z.number().optional().default(50),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getSettleBillDetail(input.accessToken, {
          start_time: input.startTime,
          end_time: input.endTime,
          page: input.page,
          size: input.size,
        });
        return { success: true, data: result };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        return { success: false, error: errorMessage };
      }
    }),

  /**
   * 获取资金流水
   */
  getAccountFlow: protectedProcedure
    .input(z.object({
      accessToken: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      page: z.number().optional().default(1),
      size: z.number().optional().default(50),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getShopAccountItem(input.accessToken, {
          start_time: input.startTime,
          end_time: input.endTime,
          page: input.page,
          size: input.size,
        });
        return { success: true, data: result };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        return { success: false, error: errorMessage };
      }
    }),

  /**
   * 获取达人佣金（抖客结算）
   */
  getCommission: protectedProcedure
    .input(z.object({
      accessToken: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      page: z.number().optional().default(1),
      size: z.number().optional().default(50),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getDouKeSettleBillList(input.accessToken, {
          start_time: input.startTime,
          end_time: input.endTime,
          page: input.page,
          size: input.size,
        });
        return { success: true, data: result };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        return { success: false, error: errorMessage };
      }
    }),

  /**
   * 获取保险详情
   */
  getInsurance: protectedProcedure
    .input(z.object({
      accessToken: z.string(),
      orderId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getInsuranceDetail(input.accessToken, input.orderId);
        return { success: true, data: result };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        return { success: false, error: errorMessage };
      }
    }),

  /**
   * 获取售后列表
   */
  getAfterSaleList: protectedProcedure
    .input(z.object({
      accessToken: z.string(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      page: z.number().optional().default(1),
      size: z.number().optional().default(50),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getAfterSaleList(input.accessToken, {
          start_time: input.startTime,
          end_time: input.endTime,
          page: input.page,
          size: input.size,
        });
        return { success: true, data: result };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        return { success: false, error: errorMessage };
      }
    }),

  /**
   * 获取售后详情
   */
  getAfterSaleDetail: protectedProcedure
    .input(z.object({
      accessToken: z.string(),
      afterSaleId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getAfterSaleDetail(input.accessToken, input.afterSaleId);
        return { success: true, data: result };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        return { success: false, error: errorMessage };
      }
    }),

  // ========== 授权相关接口（数据库操作通过Java API） ==========

  /**
   * 检查授权状态
   * 数据来源：Java后端 -> 数据库
   */
  checkAuthStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await callJavaApi("/api/doudian/auth/status", { userId: ctx.user.id });
    } catch (error) {
      console.error("[DoudianRouter] checkAuthStatus API调用失败:", error);
      return {
        isAuthorized: false,
        shops: [],
        currentShopId: null,
        expiresAt: null,
      };
    }
  }),

  /**
   * 获取授权URL
   * 操作：生成抖店OAuth授权URL（不涉及数据库）
   */
  getAuthUrl: publicProcedure
    .input(z.object({
      redirectUri: z.string(),
    }))
    .mutation(async ({ input }) => {
      return getAuthUrlService(input.redirectUri);
    }),

  /**
   * 处理授权回调
   * 操作：调用抖店API换取Token，然后调用Java后端API存储
   */
  handleCallback: protectedProcedure
    .input(z.object({
      code: z.string(),
      state: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // 使用授权码换取Token（调用抖店API）
        const tokenData = await exchangeCodeForToken(input.code);
        
        // 调用Java后端API保存Token到数据库
        await callJavaApi("/api/doudian/auth/save-token", {
          userId: ctx.user.id,
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          accessTokenExpiresAt: tokenData.accessTokenExpiresAt.toISOString(),
          refreshTokenExpiresAt: tokenData.refreshTokenExpiresAt.toISOString(),
          shopId: tokenData.shopId,
          shopName: tokenData.shopName,
        }, "POST");
        
        return {
          success: true,
          shopId: tokenData.shopId,
          shopName: tokenData.shopName,
          message: '授权成功',
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '授权失败';
        console.error("[DoudianRouter] handleCallback失败:", error);
        return {
          success: false,
          shopId: null,
          shopName: null,
          message: errorMessage,
        };
      }
    }),

  /**
   * 撤销授权
   * 操作：调用Java后端API删除授权信息
   */
  revokeAuth: protectedProcedure
    .input(z.object({
      shopId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        await callJavaApi("/api/doudian/auth/revoke", {
          userId: ctx.user.id,
          shopId: input.shopId,
        }, "DELETE");
        return { success: true, message: '授权已撤销' };
      } catch (error) {
        console.error("[DoudianRouter] revokeAuth失败:", error);
        return { success: false, message: '撤销授权失败，请确认Java后端服务已启动' };
      }
    }),

  /**
   * 获取有效的Access Token
   * 数据来源：Java后端 -> 数据库
   */
  getAccessToken: protectedProcedure.query(async ({ ctx }) => {
    try {
      const result = await callJavaApi<{ hasToken: boolean }>("/api/doudian/auth/check-token", { userId: ctx.user.id });
      return { hasToken: result.hasToken };
    } catch (error) {
      console.error("[DoudianRouter] getAccessToken API调用失败:", error);
      return { hasToken: false };
    }
  }),

  // ========== 店铺管理接口（数据库操作通过Java API） ==========

  /**
   * 获取已授权店铺列表
   * 数据来源：Java后端 -> 数据库
   */
  getShopList: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await callJavaApi("/api/doudian/shops/list", { userId: ctx.user.id });
    } catch (error) {
      console.error("[DoudianRouter] getShopList API调用失败:", error);
      return { shops: [], currentShopId: null, total: 0 };
    }
  }),

  /**
   * 获取当前选中的店铺
   * 数据来源：Java后端 -> 数据库
   */
  getCurrentShop: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await callJavaApi("/api/doudian/shops/current", { userId: ctx.user.id });
    } catch (error) {
      console.error("[DoudianRouter] getCurrentShop API调用失败:", error);
      return {
        hasCurrentShop: false,
        shopId: null,
        shopName: null,
        expireTime: null,
      };
    }
  }),

  /**
   * 切换当前店铺
   * 操作：调用Java后端API更新当前店铺
   */
  switchShop: protectedProcedure
    .input(z.object({
      shopId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await callJavaApi<{ success: boolean; shopName?: string; message?: string }>("/api/doudian/shops/switch", {
          userId: ctx.user.id,
          shopId: input.shopId,
        }, "PUT");
        
        return {
          success: result.success,
          shopId: input.shopId,
          shopName: result.shopName || '未知店铺',
          message: result.message || '店铺切换成功',
        };
      } catch (error) {
        console.error("[DoudianRouter] switchShop失败:", error);
        return {
          success: false,
          shopId: null,
          shopName: null,
          message: '店铺切换失败，请确认Java后端服务已启动',
        };
      }
    }),
});
