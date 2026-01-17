/**
 * 勾稽检查 tRPC 路由
 */

import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import {
  performRealtimeReconciliation,
  performDailyReconciliation,
  performMonthlyReconciliation,
  getPendingExceptions,
  getReconciliationLogs,
  resolveReconciliationException,
} from "./reconciliation";

export const reconciliationRouter = router({
  /**
   * 实时勾稽检查
   */
  checkRealtime: protectedProcedure.query(async () => {
    const result = await performRealtimeReconciliation();
    return result;
  }),

  /**
   * 日结勾稽检查
   */
  checkDaily: protectedProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input }) => {
      const result = await performDailyReconciliation(input.date);
      return result;
    }),

  /**
   * 月结勾稽检查
   */
  checkMonthly: protectedProcedure
    .input(z.object({ month: z.string() }))
    .query(async ({ input }) => {
      const result = await performMonthlyReconciliation(input.month);
      return result;
    }),

  /**
   * 获取待处理的勾稽异常
   */
  getPendingExceptions: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const exceptions = await getPendingExceptions(input.limit);
      return {
        total: exceptions.length,
        data: exceptions,
      };
    }),

  /**
   * 获取勾稽日志
   */
  getLogs: protectedProcedure
    .input(
      z.object({
        checkType: z.enum(["realtime", "daily", "monthly"]).optional(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const logs = await getReconciliationLogs(input.checkType, input.limit);
      return {
        total: logs.length,
        data: logs,
      };
    }),

  /**
   * 解决勾稽异常
   */
  resolveException: protectedProcedure
    .input(
      z.object({
        exceptionId: z.number(),
        remark: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await resolveReconciliationException(input.exceptionId, ctx.user.id, input.remark);
      return {
        success: true,
        message: "异常已解决",
      };
    }),
});
