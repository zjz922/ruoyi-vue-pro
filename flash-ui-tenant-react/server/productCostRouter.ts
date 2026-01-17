import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getProductCosts,
  getProductCostById,
  createProductCost,
  updateProductCost,
  deleteProductCost,
  batchImportProductCosts,
  getProductCostHistory,
  getShopNames,
} from "./db";

// 商品成本输入验证schema
const productCostInputSchema = z.object({
  productId: z.string().min(1, "商品号不能为空"),
  sku: z.string().default("0"),
  title: z.string().min(1, "商品标题不能为空"),
  cost: z.string().or(z.number()).transform(v => String(v)).default("0"),
  merchantCode: z.string().nullable().optional(),
  price: z.string().or(z.number()).transform(v => String(v)).default("0"),
  customName: z.string().nullable().optional(),
  stock: z.number().int().default(0),
  status: z.number().int().default(0),
  effectiveDate: z.date().nullable().optional(),
  shopName: z.string().default("滋栈官方旗舰店"),
});

export const productCostRouter = router({
  // 获取商品成本列表
  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(20),
        search: z.string().optional(),
        shopName: z.string().optional(),
        status: z.number().int().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
    )
    .query(async ({ input }) => {
      return await getProductCosts(input);
    }),

  // 获取单个商品成本
  getById: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      return await getProductCostById(input.id);
    }),

  // 新增商品成本
  create: protectedProcedure
    .input(productCostInputSchema)
    .mutation(async ({ input }) => {
      return await createProductCost(input);
    }),

  // 更新商品成本
  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        data: productCostInputSchema.partial(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await updateProductCost(
        input.id,
        input.data,
        ctx.user?.id,
        ctx.user?.name || undefined
      );
    }),

  // 删除商品成本
  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      return await deleteProductCost(input.id);
    }),

  // 批量导入商品成本
  batchImport: protectedProcedure
    .input(
      z.object({
        data: z.array(productCostInputSchema),
      })
    )
    .mutation(async ({ input }) => {
      return await batchImportProductCosts(input.data);
    }),

  // 获取成本变更历史
  getHistory: publicProcedure
    .input(z.object({ productCostId: z.number().int() }))
    .query(async ({ input }) => {
      return await getProductCostHistory(input.productCostId);
    }),

  // 获取店铺列表
  getShopNames: publicProcedure.query(async () => {
    return await getShopNames();
  }),
});
