# P0级别优化技术实现方案

**文档版本**: v1.0  
**编写日期**: 2026年1月15日  
**作者**: Manus AI

---

## 目录

1. [概述](#一概述)
2. [优化项目一：经营概览接入实时订单API](#二优化项目一经营概览接入实时订单api)
3. [优化项目二：建立资金流水表+CRUD](#三优化项目二建立资金流水表crud)
4. [资源评估汇总](#四资源评估汇总)
5. [实施计划](#五实施计划)
6. [风险评估与应对](#六风险评估与应对)

---

## 一、概述

本文档针对闪电帐PRO系统的两项P0级别优化需求，提供详细的技术实现方案和资源评估。

| 优化项目 | 目标 | 预期收益 |
|---------|-----|---------|
| 经营概览接入实时订单API | 将静态数据替换为实时API查询 | 核心KPI实时更新，数据准确性提升 |
| 建立资金流水表+CRUD | 创建资金流水数据表并实现完整CRUD | 记录真实资金变动，支持对账功能 |

---

## 二、优化项目一：经营概览接入实时订单API

### 2.1 现状分析

当前经营概览页面(`FinanceCommandCenter.tsx`)的数据来源：

```typescript
// 当前：静态导入
import { summaryData, dailyStatsExtended } from "@/data/realOrderData";
import { baseData, dashboardData } from "@/data/reconciliationConfig";
```

**问题**：
1. 数据为静态导入，无法反映实时业务状态
2. 数据更新需要手动修改代码文件
3. 无法按店铺、时间范围动态筛选

### 2.2 目标架构

```
┌─────────────────────────────────────────────────────────────┐
│                     经营概览页面                             │
│                 FinanceCommandCenter.tsx                    │
└───────────────────────┬─────────────────────────────────────┘
                        │ trpc.dashboard.xxx.useQuery()
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    dashboardRouter.ts                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ getOverview │ │ getTrends   │ │ getExpenseBreakdown │   │
│  └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘   │
└─────────┼───────────────┼───────────────────┼───────────────┘
          │               │                   │
          ▼               ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      db.ts (查询层)                          │
│  ┌──────────────────┐ ┌──────────────────────────────────┐  │
│  │ getDashboardKPI  │ │ getDashboardTrends               │  │
│  │ - 销售额统计     │ │ - 每日趋势数据                   │  │
│  │ - 订单数统计     │ │ - 费用构成数据                   │  │
│  │ - 利润计算       │ │ - 同比环比计算                   │  │
│  └────────┬─────────┘ └─────────────┬────────────────────┘  │
└───────────┼─────────────────────────┼───────────────────────┘
            │                         │
            ▼                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    数据库 (orders表)                         │
│  已有字段: orderId, shopId, orderAmount, status, ...        │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 技术实现方案

#### 2.3.1 后端API设计

**文件**: `server/dashboardRouter.ts` (新建)

```typescript
import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getDashboardKPI, getDashboardTrends, getExpenseBreakdown } from "./db";

export const dashboardRouter = router({
  // 获取KPI概览数据
  getOverview: protectedProcedure
    .input(z.object({
      shopId: z.string().optional(),
      dateRange: z.object({
        start: z.string(),
        end: z.string(),
      }).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { shopId, dateRange } = input;
      
      // 默认查询最近30天
      const endDate = dateRange?.end || new Date().toISOString().split('T')[0];
      const startDate = dateRange?.start || getDateBefore(30);
      
      return await getDashboardKPI(userId, shopId, startDate, endDate);
    }),

  // 获取趋势数据
  getTrends: protectedProcedure
    .input(z.object({
      shopId: z.string().optional(),
      dateRange: z.object({
        start: z.string(),
        end: z.string(),
      }),
      granularity: z.enum(["day", "week", "month"]).default("day"),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      return await getDashboardTrends(userId, input);
    }),

  // 获取费用构成
  getExpenseBreakdown: protectedProcedure
    .input(z.object({
      shopId: z.string().optional(),
      dateRange: z.object({
        start: z.string(),
        end: z.string(),
      }),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      return await getExpenseBreakdown(userId, input);
    }),
});
```

#### 2.3.2 数据库查询函数

**文件**: `server/db.ts` (扩展)

```typescript
// KPI数据查询
export async function getDashboardKPI(
  userId: string,
  shopId: string | undefined,
  startDate: string,
  endDate: string
) {
  const db = await getDb();
  
  // 构建查询条件
  const conditions = [
    eq(orders.userId, userId),
    gte(orders.orderDate, startDate),
    lte(orders.orderDate, endDate),
  ];
  
  if (shopId) {
    conditions.push(eq(orders.shopId, shopId));
  }
  
  // 聚合查询
  const result = await db
    .select({
      totalSales: sql<number>`SUM(${orders.orderAmount})`,
      totalOrders: sql<number>`COUNT(*)`,
      completedOrders: sql<number>`SUM(CASE WHEN ${orders.status} = 'completed' THEN 1 ELSE 0 END)`,
      refundAmount: sql<number>`SUM(${orders.refundAmount})`,
      expressAmount: sql<number>`SUM(${orders.expressAmount})`,
      commissionAmount: sql<number>`SUM(${orders.commissionAmount})`,
      serviceAmount: sql<number>`SUM(${orders.serviceAmount})`,
      promotionAmount: sql<number>`SUM(${orders.promotionAmount})`,
      costAmount: sql<number>`SUM(${orders.costAmount})`,
      profitAmount: sql<number>`SUM(${orders.profitAmount})`,
    })
    .from(orders)
    .where(and(...conditions));
  
  const data = result[0];
  
  // 计算派生指标
  return {
    totalRevenue: data.totalSales || 0,
    orderCount: data.totalOrders || 0,
    completedOrders: data.completedOrders || 0,
    refundAmount: data.refundAmount || 0,
    netSales: (data.totalSales || 0) - (data.refundAmount || 0),
    grossProfit: (data.totalSales || 0) - (data.costAmount || 0) - (data.refundAmount || 0),
    netProfit: data.profitAmount || 0,
    expenses: {
      express: data.expressAmount || 0,
      commission: data.commissionAmount || 0,
      service: data.serviceAmount || 0,
      promotion: data.promotionAmount || 0,
    },
    ratios: {
      refundRate: data.totalSales ? ((data.refundAmount || 0) / data.totalSales * 100).toFixed(2) : 0,
      profitRate: data.totalSales ? ((data.profitAmount || 0) / data.totalSales * 100).toFixed(2) : 0,
      completionRate: data.totalOrders ? ((data.completedOrders || 0) / data.totalOrders * 100).toFixed(2) : 0,
    },
  };
}

// 趋势数据查询
export async function getDashboardTrends(
  userId: string,
  params: { shopId?: string; dateRange: { start: string; end: string }; granularity: string }
) {
  const db = await getDb();
  
  const conditions = [
    eq(orders.userId, userId),
    gte(orders.orderDate, params.dateRange.start),
    lte(orders.orderDate, params.dateRange.end),
  ];
  
  if (params.shopId) {
    conditions.push(eq(orders.shopId, params.shopId));
  }
  
  // 按日期分组聚合
  const result = await db
    .select({
      date: orders.orderDate,
      salesAmount: sql<number>`SUM(${orders.orderAmount})`,
      orderCount: sql<number>`COUNT(*)`,
      refundAmount: sql<number>`SUM(${orders.refundAmount})`,
      profitAmount: sql<number>`SUM(${orders.profitAmount})`,
    })
    .from(orders)
    .where(and(...conditions))
    .groupBy(orders.orderDate)
    .orderBy(orders.orderDate);
  
  return result;
}

// 费用构成查询
export async function getExpenseBreakdown(
  userId: string,
  params: { shopId?: string; dateRange: { start: string; end: string } }
) {
  const db = await getDb();
  
  const conditions = [
    eq(orders.userId, userId),
    gte(orders.orderDate, params.dateRange.start),
    lte(orders.orderDate, params.dateRange.end),
  ];
  
  if (params.shopId) {
    conditions.push(eq(orders.shopId, params.shopId));
  }
  
  const result = await db
    .select({
      expressAmount: sql<number>`SUM(${orders.expressAmount})`,
      commissionAmount: sql<number>`SUM(${orders.commissionAmount})`,
      serviceAmount: sql<number>`SUM(${orders.serviceAmount})`,
      promotionAmount: sql<number>`SUM(${orders.promotionAmount})`,
      otherAmount: sql<number>`SUM(${orders.otherAmount})`,
      insuranceAmount: sql<number>`SUM(${orders.insuranceAmount})`,
      payoutAmount: sql<number>`SUM(${orders.payoutAmount})`,
    })
    .from(orders)
    .where(and(...conditions));
  
  const data = result[0];
  const total = Object.values(data).reduce((sum, val) => sum + (val || 0), 0);
  
  return [
    { category: "推广费用", amount: data.promotionAmount || 0, percent: ((data.promotionAmount || 0) / total * 100).toFixed(1) },
    { category: "物流费用", amount: data.expressAmount || 0, percent: ((data.expressAmount || 0) / total * 100).toFixed(1) },
    { category: "达人佣金", amount: data.commissionAmount || 0, percent: ((data.commissionAmount || 0) / total * 100).toFixed(1) },
    { category: "平台服务费", amount: data.serviceAmount || 0, percent: ((data.serviceAmount || 0) / total * 100).toFixed(1) },
    { category: "保险费", amount: data.insuranceAmount || 0, percent: ((data.insuranceAmount || 0) / total * 100).toFixed(1) },
    { category: "赔付", amount: data.payoutAmount || 0, percent: ((data.payoutAmount || 0) / total * 100).toFixed(1) },
    { category: "其他", amount: data.otherAmount || 0, percent: ((data.otherAmount || 0) / total * 100).toFixed(1) },
  ];
}
```

#### 2.3.3 前端页面改造

**文件**: `client/src/pages/FinanceCommandCenter.tsx` (修改)

```typescript
// 改造前：静态导入
// import { summaryData, dailyStatsExtended } from "@/data/realOrderData";

// 改造后：使用tRPC查询
import { trpc } from "@/lib/trpc";
import { useShopSwitcher } from "@/hooks/useShopSwitcher";

export default function FinanceCommandCenter() {
  const { currentShopId } = useShopSwitcher();
  const [dateRange, setDateRange] = useState({
    start: getDateBefore(30),
    end: new Date().toISOString().split('T')[0],
  });

  // 查询KPI数据
  const { data: kpiData, isLoading: kpiLoading } = trpc.dashboard.getOverview.useQuery({
    shopId: currentShopId,
    dateRange,
  });

  // 查询趋势数据
  const { data: trendsData, isLoading: trendsLoading } = trpc.dashboard.getTrends.useQuery({
    shopId: currentShopId,
    dateRange,
    granularity: "day",
  });

  // 查询费用构成
  const { data: expenseData, isLoading: expenseLoading } = trpc.dashboard.getExpenseBreakdown.useQuery({
    shopId: currentShopId,
    dateRange,
  });

  // 渲染逻辑...
  if (kpiLoading) return <DashboardSkeleton />;

  return (
    <AppLayout>
      {/* KPI卡片 */}
      <KPICards data={kpiData} />
      
      {/* 趋势图表 */}
      <TrendsChart data={trendsData} />
      
      {/* 费用构成 */}
      <ExpenseBreakdown data={expenseData} />
    </AppLayout>
  );
}
```

### 2.4 数据库表扩展

当前`orders`表需要确保包含以下字段用于KPI计算：

| 字段名 | 类型 | 说明 | 是否已有 |
|-------|-----|------|---------|
| orderAmount | decimal | 订单金额 | ✅ 已有 |
| refundAmount | decimal | 退款金额 | ✅ 已有 |
| expressAmount | decimal | 快递费 | ✅ 已有 |
| commissionAmount | decimal | 达人佣金 | ✅ 已有 |
| serviceAmount | decimal | 服务费 | ✅ 已有 |
| promotionAmount | decimal | 推广费 | ✅ 已有 |
| costAmount | decimal | 商品成本 | ✅ 已有 |
| profitAmount | decimal | 预计利润 | ✅ 已有 |
| otherAmount | decimal | 其他费用 | ⚠️ 需确认 |
| insuranceAmount | decimal | 保险费 | ⚠️ 需确认 |
| payoutAmount | decimal | 赔付金额 | ⚠️ 需确认 |

### 2.5 资源评估

| 资源类型 | 工作量 | 说明 |
|---------|-------|-----|
| 后端开发 | 2天 | dashboardRouter + db查询函数 |
| 前端开发 | 2天 | 页面改造 + 加载状态处理 |
| 测试 | 1天 | 单元测试 + 集成测试 |
| 联调 | 0.5天 | 前后端联调 |
| **总计** | **5.5天** | 约1周工作量 |

---

## 三、优化项目二：建立资金流水表+CRUD

### 3.1 现状分析

当前资金流水页面(`CashierCashflow.tsx`)使用硬编码的Mock数据：

```typescript
// 当前：硬编码Mock数据
const cashflowData = [
  { id: 1, date: "2024-01-15", channel: "抖音支付", income: 1280.00, ... },
  ...
];
```

**问题**：
1. 无法记录真实的资金流水
2. 无法进行资金对账
3. 无法生成资金报表

### 3.2 目标架构

```
┌─────────────────────────────────────────────────────────────┐
│                     资金流水页面                             │
│                  CashierCashflow.tsx                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 流水列表 │ │ 新增流水 │ │ 编辑流水 │ │ 删除流水 │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
└───────┼────────────┼────────────┼────────────┼──────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                   cashflowRouter.ts                          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐  │
│  │ list   │ │ create │ │ update │ │ delete │ │ getStats │  │
│  └────┬───┘ └────┬───┘ └────┬───┘ └────┬───┘ └────┬─────┘  │
└───────┼──────────┼──────────┼──────────┼──────────┼─────────┘
        │          │          │          │          │
        ▼          ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────┐
│                  financial_cashflow 表                       │
│  id | user_id | shop_id | date | channel | type | amount   │
│  order_no | balance | status | remark | created_at | ...    │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 数据库表设计

#### 3.3.1 资金流水表 (financial_cashflow)

**文件**: `drizzle/schema.ts` (扩展)

```typescript
// 资金渠道枚举
export const cashflowChannelEnum = mysqlEnum("cashflow_channel", [
  "doudian",      // 抖店支付
  "alipay",       // 支付宝
  "wechat",       // 微信支付
  "bank",         // 银行转账
  "qianchuan",    // 千川账户
  "other",        // 其他
]);

// 流水类型枚举
export const cashflowTypeEnum = mysqlEnum("cashflow_type", [
  "order_income",     // 订单收入
  "refund_out",       // 退款支出
  "platform_fee",     // 平台扣款
  "promotion_fee",    // 推广费用
  "withdrawal",       // 提现
  "deposit",          // 充值
  "transfer_in",      // 转入
  "transfer_out",     // 转出
  "settlement",       // 平台结算
  "other",            // 其他
]);

// 流水状态枚举
export const cashflowStatusEnum = mysqlEnum("cashflow_status", [
  "pending",      // 待确认
  "confirmed",    // 已确认
  "cancelled",    // 已取消
]);

// 资金流水表
export const financialCashflow = mysqlTable("financial_cashflow", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 }).notNull(),
  shopId: varchar("shop_id", { length: 64 }),
  
  // 流水基本信息
  transactionDate: date("transaction_date").notNull(),
  transactionTime: time("transaction_time"),
  channel: cashflowChannelEnum.notNull(),
  type: cashflowTypeEnum.notNull(),
  
  // 金额信息
  income: decimal("income", { precision: 12, scale: 2 }).default("0"),
  expense: decimal("expense", { precision: 12, scale: 2 }).default("0"),
  balance: decimal("balance", { precision: 12, scale: 2 }),
  
  // 关联信息
  orderNo: varchar("order_no", { length: 64 }),
  settlementNo: varchar("settlement_no", { length: 64 }),
  
  // 状态和备注
  status: cashflowStatusEnum.default("pending"),
  remark: text("remark"),
  tags: json("tags").$type<string[]>(),
  
  // 来源信息
  source: varchar("source", { length: 32 }).default("manual"), // manual, sync, import
  sourceId: varchar("source_id", { length: 64 }),
  
  // 时间戳
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  shopIdx: index("shop_idx").on(table.shopId),
  dateIdx: index("date_idx").on(table.transactionDate),
  orderIdx: index("order_idx").on(table.orderNo),
  channelIdx: index("channel_idx").on(table.channel),
}));

// 类型导出
export type FinancialCashflow = typeof financialCashflow.$inferSelect;
export type NewFinancialCashflow = typeof financialCashflow.$inferInsert;
```

#### 3.3.2 资金账户表 (financial_accounts)

```typescript
// 账户类型枚举
export const accountTypeEnum = mysqlEnum("account_type", [
  "platform",     // 平台账户
  "bank",         // 银行账户
  "ad",           // 广告账户
  "other",        // 其他
]);

// 资金账户表
export const financialAccounts = mysqlTable("financial_accounts", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 }).notNull(),
  shopId: varchar("shop_id", { length: 64 }),
  
  // 账户信息
  name: varchar("name", { length: 100 }).notNull(),
  type: accountTypeEnum.notNull(),
  accountNo: varchar("account_no", { length: 64 }),
  
  // 余额信息
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0"),
  availableBalance: decimal("available_balance", { precision: 12, scale: 2 }).default("0"),
  frozenBalance: decimal("frozen_balance", { precision: 12, scale: 2 }).default("0"),
  
  // 状态
  status: varchar("status", { length: 20 }).default("active"),
  isDefault: boolean("is_default").default(false),
  
  // 时间戳
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  shopIdx: index("shop_idx").on(table.shopId),
}));
```

### 3.4 后端API设计

**文件**: `server/cashflowRouter.ts` (新建)

```typescript
import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { 
  getCashflowList, 
  createCashflow, 
  updateCashflow, 
  deleteCashflow,
  getCashflowStats,
  getCashflowById,
} from "./db";

// 输入验证Schema
const cashflowInputSchema = z.object({
  shopId: z.string().optional(),
  transactionDate: z.string(),
  transactionTime: z.string().optional(),
  channel: z.enum(["doudian", "alipay", "wechat", "bank", "qianchuan", "other"]),
  type: z.enum([
    "order_income", "refund_out", "platform_fee", "promotion_fee",
    "withdrawal", "deposit", "transfer_in", "transfer_out", "settlement", "other"
  ]),
  income: z.number().optional(),
  expense: z.number().optional(),
  orderNo: z.string().optional(),
  remark: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const cashflowRouter = router({
  // 获取流水列表
  list: protectedProcedure
    .input(z.object({
      shopId: z.string().optional(),
      dateRange: z.object({
        start: z.string(),
        end: z.string(),
      }).optional(),
      channel: z.string().optional(),
      type: z.string().optional(),
      status: z.string().optional(),
      keyword: z.string().optional(),
      page: z.number().default(1),
      pageSize: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      return await getCashflowList(ctx.user.id, input);
    }),

  // 获取单条流水
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await getCashflowById(ctx.user.id, input.id);
    }),

  // 创建流水
  create: protectedProcedure
    .input(cashflowInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await createCashflow(ctx.user.id, input);
    }),

  // 批量创建（导入）
  batchCreate: protectedProcedure
    .input(z.object({
      items: z.array(cashflowInputSchema),
    }))
    .mutation(async ({ ctx, input }) => {
      const results = [];
      for (const item of input.items) {
        const result = await createCashflow(ctx.user.id, item);
        results.push(result);
      }
      return { created: results.length };
    }),

  // 更新流水
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: cashflowInputSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await updateCashflow(ctx.user.id, input.id, input.data);
    }),

  // 确认流水
  confirm: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await updateCashflow(ctx.user.id, input.id, { status: "confirmed" });
    }),

  // 批量确认
  batchConfirm: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      for (const id of input.ids) {
        await updateCashflow(ctx.user.id, id, { status: "confirmed" });
      }
      return { confirmed: input.ids.length };
    }),

  // 删除流水
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await deleteCashflow(ctx.user.id, input.id);
    }),

  // 获取统计数据
  getStats: protectedProcedure
    .input(z.object({
      shopId: z.string().optional(),
      dateRange: z.object({
        start: z.string(),
        end: z.string(),
      }),
    }))
    .query(async ({ ctx, input }) => {
      return await getCashflowStats(ctx.user.id, input);
    }),
});
```

### 3.5 数据库查询函数

**文件**: `server/db.ts` (扩展)

```typescript
// 获取流水列表
export async function getCashflowList(
  userId: string,
  params: {
    shopId?: string;
    dateRange?: { start: string; end: string };
    channel?: string;
    type?: string;
    status?: string;
    keyword?: string;
    page: number;
    pageSize: number;
  }
) {
  const db = await getDb();
  
  const conditions = [eq(financialCashflow.userId, userId)];
  
  if (params.shopId) {
    conditions.push(eq(financialCashflow.shopId, params.shopId));
  }
  if (params.dateRange) {
    conditions.push(gte(financialCashflow.transactionDate, params.dateRange.start));
    conditions.push(lte(financialCashflow.transactionDate, params.dateRange.end));
  }
  if (params.channel) {
    conditions.push(eq(financialCashflow.channel, params.channel));
  }
  if (params.type) {
    conditions.push(eq(financialCashflow.type, params.type));
  }
  if (params.status) {
    conditions.push(eq(financialCashflow.status, params.status));
  }
  if (params.keyword) {
    conditions.push(
      or(
        like(financialCashflow.orderNo, `%${params.keyword}%`),
        like(financialCashflow.remark, `%${params.keyword}%`)
      )
    );
  }
  
  // 查询总数
  const countResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(financialCashflow)
    .where(and(...conditions));
  
  const total = countResult[0].count;
  
  // 分页查询
  const offset = (params.page - 1) * params.pageSize;
  const items = await db
    .select()
    .from(financialCashflow)
    .where(and(...conditions))
    .orderBy(desc(financialCashflow.transactionDate), desc(financialCashflow.transactionTime))
    .limit(params.pageSize)
    .offset(offset);
  
  return {
    items,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(total / params.pageSize),
  };
}

// 创建流水
export async function createCashflow(userId: string, data: NewFinancialCashflow) {
  const db = await getDb();
  
  const [result] = await db.insert(financialCashflow).values({
    ...data,
    userId,
    status: "pending",
  });
  
  return { id: result.insertId };
}

// 更新流水
export async function updateCashflow(userId: string, id: string, data: Partial<FinancialCashflow>) {
  const db = await getDb();
  
  await db
    .update(financialCashflow)
    .set(data)
    .where(and(
      eq(financialCashflow.id, id),
      eq(financialCashflow.userId, userId)
    ));
  
  return { success: true };
}

// 删除流水
export async function deleteCashflow(userId: string, id: string) {
  const db = await getDb();
  
  await db
    .delete(financialCashflow)
    .where(and(
      eq(financialCashflow.id, id),
      eq(financialCashflow.userId, userId)
    ));
  
  return { success: true };
}

// 获取流水统计
export async function getCashflowStats(
  userId: string,
  params: { shopId?: string; dateRange: { start: string; end: string } }
) {
  const db = await getDb();
  
  const conditions = [
    eq(financialCashflow.userId, userId),
    gte(financialCashflow.transactionDate, params.dateRange.start),
    lte(financialCashflow.transactionDate, params.dateRange.end),
  ];
  
  if (params.shopId) {
    conditions.push(eq(financialCashflow.shopId, params.shopId));
  }
  
  const result = await db
    .select({
      totalIncome: sql<number>`SUM(${financialCashflow.income})`,
      totalExpense: sql<number>`SUM(${financialCashflow.expense})`,
      transactionCount: sql<number>`COUNT(*)`,
      pendingCount: sql<number>`SUM(CASE WHEN ${financialCashflow.status} = 'pending' THEN 1 ELSE 0 END)`,
      confirmedCount: sql<number>`SUM(CASE WHEN ${financialCashflow.status} = 'confirmed' THEN 1 ELSE 0 END)`,
    })
    .from(financialCashflow)
    .where(and(...conditions));
  
  const data = result[0];
  
  return {
    totalIncome: data.totalIncome || 0,
    totalExpense: data.totalExpense || 0,
    netFlow: (data.totalIncome || 0) - (data.totalExpense || 0),
    transactionCount: data.transactionCount || 0,
    pendingCount: data.pendingCount || 0,
    confirmedCount: data.confirmedCount || 0,
  };
}
```

### 3.6 前端页面改造

**文件**: `client/src/pages/cashier/CashierCashflow.tsx` (修改)

```typescript
import { trpc } from "@/lib/trpc";
import { useShopSwitcher } from "@/hooks/useShopSwitcher";
import { useState } from "react";

export default function CashierCashflow() {
  const { currentShopId } = useShopSwitcher();
  const [filters, setFilters] = useState({
    dateRange: { start: getDateBefore(30), end: getTodayDate() },
    channel: undefined,
    type: undefined,
    status: undefined,
    keyword: "",
    page: 1,
    pageSize: 20,
  });

  // 查询流水列表
  const { data, isLoading, refetch } = trpc.cashflow.list.useQuery({
    shopId: currentShopId,
    ...filters,
  });

  // 查询统计数据
  const { data: stats } = trpc.cashflow.getStats.useQuery({
    shopId: currentShopId,
    dateRange: filters.dateRange,
  });

  // 创建流水
  const createMutation = trpc.cashflow.create.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("流水创建成功");
    },
  });

  // 确认流水
  const confirmMutation = trpc.cashflow.confirm.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("流水已确认");
    },
  });

  // 删除流水
  const deleteMutation = trpc.cashflow.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("流水已删除");
    },
  });

  // 渲染逻辑...
}
```

### 3.7 资源评估

| 资源类型 | 工作量 | 说明 |
|---------|-------|-----|
| 数据库设计 | 0.5天 | 表结构设计 + 迁移 |
| 后端开发 | 3天 | cashflowRouter + db函数 + 测试 |
| 前端开发 | 3天 | 页面改造 + 表单 + 列表 |
| 测试 | 1天 | 单元测试 + 集成测试 |
| 联调 | 0.5天 | 前后端联调 |
| **总计** | **8天** | 约1.5周工作量 |

---

## 四、资源评估汇总

### 4.1 开发工作量

| 优化项目 | 后端 | 前端 | 测试 | 联调 | 总计 |
|---------|-----|-----|-----|-----|-----|
| 经营概览实时API | 2天 | 2天 | 1天 | 0.5天 | 5.5天 |
| 资金流水表CRUD | 3.5天 | 3天 | 1天 | 0.5天 | 8天 |
| **合计** | **5.5天** | **5天** | **2天** | **1天** | **13.5天** |

### 4.2 人力资源需求

| 角色 | 人数 | 参与阶段 | 工作量 |
|-----|-----|---------|-------|
| 后端开发 | 1人 | 全程 | 5.5人天 |
| 前端开发 | 1人 | 全程 | 5人天 |
| 测试工程师 | 1人 | 测试阶段 | 2人天 |
| 产品经理 | 1人 | 需求确认、验收 | 1人天 |

### 4.3 技术栈要求

| 技术 | 版本 | 用途 |
|-----|-----|-----|
| TypeScript | 5.x | 类型安全 |
| tRPC | 11.x | API层 |
| Drizzle ORM | 0.44.x | 数据库操作 |
| React | 19.x | 前端框架 |
| TanStack Query | 5.x | 数据获取 |
| Zod | 3.x | 输入验证 |

### 4.4 基础设施需求

| 资源 | 当前状态 | 是否需要扩展 |
|-----|---------|------------|
| 数据库 | MySQL/TiDB | 新增2张表，无需扩展 |
| 服务器 | Node.js | 无需扩展 |
| 缓存 | 无 | 建议后续添加Redis |

---

## 五、实施计划

### 5.1 阶段划分

```
Week 1: 经营概览实时API
├── Day 1-2: 后端API开发 (dashboardRouter + db函数)
├── Day 3-4: 前端页面改造 (FinanceCommandCenter.tsx)
└── Day 5: 测试 + 联调

Week 2: 资金流水表CRUD
├── Day 1: 数据库表设计 + 迁移
├── Day 2-4: 后端API开发 (cashflowRouter + db函数)
├── Day 5: 前端页面改造 (CashierCashflow.tsx)

Week 3: 收尾
├── Day 1-2: 前端完善 + 边界情况处理
├── Day 3: 集成测试
├── Day 4: Bug修复
└── Day 5: 验收 + 上线
```

### 5.2 里程碑

| 里程碑 | 时间点 | 交付物 |
|-------|-------|-------|
| M1 | Week 1 Day 2 | 经营概览API可调用 |
| M2 | Week 1 Day 5 | 经营概览页面改造完成 |
| M3 | Week 2 Day 1 | 资金流水表创建完成 |
| M4 | Week 2 Day 4 | 资金流水CRUD API完成 |
| M5 | Week 3 Day 3 | 集成测试通过 |
| M6 | Week 3 Day 5 | 上线发布 |

---

## 六、风险评估与应对

### 6.1 技术风险

| 风险 | 概率 | 影响 | 应对措施 |
|-----|-----|-----|---------|
| 数据库查询性能问题 | 中 | 高 | 添加索引、分页查询、后续引入缓存 |
| 前后端类型不一致 | 低 | 中 | 使用tRPC确保类型安全 |
| 数据迁移失败 | 低 | 高 | 备份数据、分批迁移、回滚方案 |

### 6.2 业务风险

| 风险 | 概率 | 影响 | 应对措施 |
|-----|-----|-----|---------|
| 需求变更 | 中 | 中 | 模块化设计、预留扩展点 |
| 数据准确性问题 | 中 | 高 | 数据校验、对账机制 |
| 用户接受度低 | 低 | 中 | 保留旧版入口、渐进式迁移 |

### 6.3 应急预案

1. **性能问题**：如查询超时，临时降级为分页加载，后续优化索引
2. **数据问题**：保留原有静态数据作为备份，可快速回滚
3. **上线失败**：准备回滚脚本，可在30分钟内恢复旧版本

---

## 七、附录

### 7.1 相关文件清单

| 文件路径 | 操作 | 说明 |
|---------|-----|-----|
| `drizzle/schema.ts` | 修改 | 新增资金流水表定义 |
| `server/dashboardRouter.ts` | 新建 | 经营概览API |
| `server/cashflowRouter.ts` | 新建 | 资金流水CRUD API |
| `server/routers.ts` | 修改 | 注册新路由 |
| `server/db.ts` | 修改 | 新增查询函数 |
| `client/src/pages/FinanceCommandCenter.tsx` | 修改 | 接入实时API |
| `client/src/pages/cashier/CashierCashflow.tsx` | 修改 | 接入CRUD API |

### 7.2 测试用例清单

**经营概览API测试**：
- [ ] 无店铺筛选时返回所有店铺汇总数据
- [ ] 指定店铺时返回该店铺数据
- [ ] 日期范围筛选正确
- [ ] 空数据时返回默认值
- [ ] 大数据量时性能正常（<500ms）

**资金流水CRUD测试**：
- [ ] 创建流水成功
- [ ] 创建时必填字段校验
- [ ] 列表分页正确
- [ ] 筛选条件组合正确
- [ ] 更新流水成功
- [ ] 确认流水状态变更
- [ ] 删除流水成功
- [ ] 权限隔离（用户只能操作自己的数据）

---

*文档完成*
