/**
 * 聚水潭ERP API路由
 * 提供聚水潭数据同步和查询接口
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
import { JstApiClient } from './jstApi';
import { JstSyncService } from './jstSyncService';

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

export const jstRouter = router({
  // ========== 配置管理 ==========

  /**
   * 检查配置状态
   * 数据来源：Java后端 -> 数据库
   */
  checkConfig: publicProcedure.query(async () => {
    try {
      return await callJavaApi("/api/jst/config/check", {});
    } catch (error) {
      console.error("[JstRouter] checkConfig API调用失败:", error);
      return {
        configured: false,
        message: 'Java后端服务不可用，请确认服务已启动',
      };
    }
  }),

  /**
   * 保存配置
   * 操作：调用Java后端API保存配置到数据库
   */
  saveConfig: protectedProcedure
    .input(z.object({
      partnerId: z.string().min(1, '合作方编号不能为空'),
      partnerKey: z.string().min(1, '合作方密钥不能为空'),
      token: z.string().optional(),
      coId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // 先验证配置（调用聚水潭API）
        if (input.token) {
          const client = new JstApiClient({
            partnerId: input.partnerId,
            partnerKey: input.partnerKey,
            token: input.token,
          });
          const validation = await client.validateConfig();
          if (!validation.valid) {
            throw new Error(validation.message);
          }
        }

        // 调用Java后端API保存配置
        await callJavaApi("/api/jst/config/save", {
          partnerId: input.partnerId,
          partnerKey: input.partnerKey,
          token: input.token || null,
          coId: input.coId || null,
          status: input.token ? 1 : 0,
        }, "POST");

        return { success: true, message: '配置保存成功' };
      } catch (error) {
        console.error("[JstRouter] saveConfig失败:", error);
        const errorMessage = error instanceof Error ? error.message : '配置保存失败';
        return { success: false, message: errorMessage };
      }
    }),

  // ========== 数据同步 ==========

  /**
   * 同步入库数据
   * 操作：调用聚水潭API获取数据，然后调用Java后端API存储
   */
  syncPurchaseIn: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // 从Java后端获取配置
        const config = await callJavaApi<{
          configured: boolean;
          partnerId: string;
          partnerKey: string;
          token: string;
        }>("/api/jst/config/check", {});

        if (!config.configured || !config.token) {
          throw new Error('请先配置聚水潭API授权');
        }

        // 创建同步服务并获取数据
        const syncService = new JstSyncService({
          partnerId: config.partnerId,
          partnerKey: config.partnerKey,
          token: config.token,
        });

        const result = await syncService.syncPurchaseIn(input.startDate, input.endDate);

        // 调用Java后端API更新最后同步时间
        await callJavaApi("/api/jst/config/update-sync-time", {}, "PUT");

        return result;
      } catch (error) {
        console.error("[JstRouter] syncPurchaseIn失败:", error);
        const errorMessage = error instanceof Error ? error.message : '同步失败';
        throw new Error(errorMessage);
      }
    }),

  // ========== 数据查询 ==========

  /**
   * 获取入库单列表
   * 数据来源：Java后端 -> 数据库
   */
  getPurchaseInList: publicProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      status: z.string().optional(),
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/jst/purchase-in/page", {
          startDate: input.startDate,
          endDate: input.endDate,
          status: input.status,
          pageNo: input.page,
          pageSize: input.pageSize,
        });
      } catch (error) {
        console.error("[JstRouter] getPurchaseInList API调用失败:", error);
        return { data: [], total: 0, page: input.page, pageSize: input.pageSize };
      }
    }),

  /**
   * 获取入库单明细
   * 数据来源：Java后端 -> 数据库
   */
  getPurchaseInDetail: publicProcedure
    .input(z.object({
      ioId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi(`/api/jst/purchase-in/detail/${input.ioId}`, {});
      } catch (error) {
        console.error("[JstRouter] getPurchaseInDetail API调用失败:", error);
        return null;
      }
    }),

  /**
   * 获取入库统计数据
   * 数据来源：Java后端 -> 数据库聚合统计
   */
  getPurchaseInStats: publicProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/jst/purchase-in/stats", {
          startDate: input.startDate,
          endDate: input.endDate,
        });
      } catch (error) {
        console.error("[JstRouter] getPurchaseInStats API调用失败:", error);
        return {
          totalCount: 0,
          totalQty: 0,
          totalAmount: 0,
          bySupplier: [],
          byWarehouse: [],
        };
      }
    }),

  // ========== 同步日志 ==========

  /**
   * 获取同步日志
   * 数据来源：Java后端 -> 数据库
   */
  getSyncLogs: publicProcedure
    .input(z.object({
      syncType: z.string().optional(),
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
    }))
    .query(async ({ input }) => {
      try {
        return await callJavaApi("/api/jst/sync-logs/page", {
          syncType: input.syncType,
          pageNo: input.page,
          pageSize: input.pageSize,
        });
      } catch (error) {
        console.error("[JstRouter] getSyncLogs API调用失败:", error);
        return { data: [], total: 0, page: input.page, pageSize: input.pageSize };
      }
    }),

  // ========== API测试 ==========

  /**
   * 测试API连接
   * 操作：直接调用聚水潭API验证配置（不涉及数据库）
   */
  testConnection: protectedProcedure
    .input(z.object({
      partnerId: z.string(),
      partnerKey: z.string(),
      token: z.string(),
    }))
    .mutation(async ({ input }) => {
      const client = new JstApiClient({
        partnerId: input.partnerId,
        partnerKey: input.partnerKey,
        token: input.token,
      });

      const result = await client.validateConfig();
      return result;
    }),
});
