import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { productCostRouter } from "./productCostRouter";
import { orderRouter } from "./orderRouter";
import { doudianRouter } from "./doudianRouter";
import { qianchuanRouter } from "./qianchuanRouter";
import { jstRouter } from "./jstRouter";
import { costUpdateRouter } from "./costUpdateRouter";
import { reconciliationRouter } from "./reconciliationRouter";
import { dashboardRouter } from "./dashboardRouter";
import { cashflowRouter } from "./cashflowRouter";
import { ledgerRouter } from "./ledgerRouter";
import { cashierRouter } from "./cashierRouter";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 商品成本管理
  productCost: productCostRouter,

  // 订单管理
  order: orderRouter,

  // 抖店API
  doudian: doudianRouter,

  // 千川推广费用
  qianchuan: qianchuanRouter,

  // 聚水潭ERP
  jst: jstRouter,

  // 成本自动更新
  costUpdate: costUpdateRouter,

  // 数据勾稽检查
  reconciliation: reconciliationRouter,

  // 经营概览
  dashboard: dashboardRouter,

  // 资金流水
  cashflow: cashflowRouter,

  // 总账管理（经营概览、财务核算、资金管理、库存成本、经营分析、费用中心、税务管理）
  ledger: ledgerRouter,

  // 出纳管理（出纳工作台、渠道管理、平台对账、差异分析、资金日报、资金月报、店铺统计）
  cashier: cashierRouter,
});

export type AppRouter = typeof appRouter;

