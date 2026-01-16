import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** 当前选中的店铺ID */
  currentShopId: varchar("currentShopId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 商品成本表 - 存储商品的成本配置信息
 */
export const productCosts = mysqlTable("product_costs", {
  id: int("id").autoincrement().primaryKey(),
  /** 商品号（抖店商品ID） */
  productId: varchar("productId", { length: 64 }).notNull(),
  /** SKU编码 */
  sku: varchar("sku", { length: 64 }).notNull(),
  /** 商品标题 */
  title: text("title").notNull(),
  /** 商品成本价 */
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 商家编码 */
  merchantCode: varchar("merchantCode", { length: 64 }),
  /** 商品售价 */
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 自定义名称 */
  customName: varchar("customName", { length: 255 }),
  /** 库存数量 */
  stock: int("stock").notNull().default(0),
  /** 状态：0有效，1删除 */
  status: int("status").notNull().default(0),
  /** 最新生效时间 */
  effectiveDate: timestamp("effectiveDate"),
  /** 店铺名称 */
  shopName: varchar("shopName", { length: 128 }).default("滋栈官方旗舰店"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductCost = typeof productCosts.$inferSelect;
export type InsertProductCost = typeof productCosts.$inferInsert;

/**
 * 商品成本历史记录表 - 记录成本变更历史
 */
export const productCostHistory = mysqlTable("product_cost_history", {
  id: int("id").autoincrement().primaryKey(),
  /** 关联的商品成本ID */
  productCostId: int("productCostId").notNull(),
  /** 商品号 */
  productId: varchar("productId", { length: 64 }).notNull(),
  /** 旧成本价 */
  oldCost: decimal("oldCost", { precision: 10, scale: 2 }).notNull(),
  /** 新成本价 */
  newCost: decimal("newCost", { precision: 10, scale: 2 }).notNull(),
  /** 变更原因 */
  reason: text("reason"),
  /** 操作人 */
  operatorId: int("operatorId"),
  /** 操作人名称 */
  operatorName: varchar("operatorName", { length: 128 }),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductCostHistory = typeof productCostHistory.$inferSelect;
export type InsertProductCostHistory = typeof productCostHistory.$inferInsert;

/**
 * 订单表 - 存储抖店订单数据
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  /** 主订单编号 */
  mainOrderNo: varchar("mainOrderNo", { length: 32 }).notNull(),
  /** 子订单编号 */
  subOrderNo: varchar("subOrderNo", { length: 32 }).notNull().unique(),
  /** 商品名称 */
  productName: text("productName"),
  /** 商品规格 */
  productSpec: text("productSpec"),
  /** 商品数量 */
  quantity: int("quantity").notNull().default(1),
  /** 商家编码/SKU */
  sku: varchar("sku", { length: 64 }),
  /** 商品单价 */
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 订单应付金额 */
  payAmount: decimal("payAmount", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 运费 */
  freight: decimal("freight", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 优惠总金额 */
  totalDiscount: decimal("totalDiscount", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 平台优惠 */
  platformDiscount: decimal("platformDiscount", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 商家优惠 */
  merchantDiscount: decimal("merchantDiscount", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 达人优惠 */
  influencerDiscount: decimal("influencerDiscount", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 服务费/手续费 */
  serviceFee: decimal("serviceFee", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 支付方式 */
  payMethod: varchar("payMethod", { length: 32 }),
  /** 收件人 */
  receiver: varchar("receiver", { length: 64 }),
  /** 收件人手机号 */
  receiverPhone: varchar("receiverPhone", { length: 32 }),
  /** 省 */
  province: varchar("province", { length: 32 }),
  /** 市 */
  city: varchar("city", { length: 32 }),
  /** 区 */
  district: varchar("district", { length: 32 }),
  /** 详细地址 */
  address: text("address"),
  /** 订单提交时间 */
  orderTime: timestamp("orderTime"),
  /** 支付完成时间 */
  payTime: timestamp("payTime"),
  /** 发货时间 */
  shipTime: timestamp("shipTime"),
  /** 订单完成时间 */
  completeTime: timestamp("completeTime"),
  /** 订单状态 */
  status: varchar("status", { length: 32 }).notNull().default("待发货"),
  /** 售后状态 */
  afterSaleStatus: varchar("afterSaleStatus", { length: 32 }),
  /** 取消原因 */
  cancelReason: text("cancelReason"),
  /** APP渠道 */
  appChannel: varchar("appChannel", { length: 32 }),
  /** 流量来源 */
  trafficSource: varchar("trafficSource", { length: 64 }),
  /** 订单类型 */
  orderType: varchar("orderType", { length: 32 }),
  /** 达人ID */
  influencerId: varchar("influencerId", { length: 64 }),
  /** 达人昵称 */
  influencerName: varchar("influencerName", { length: 128 }),
  /** 旗帜颜色 */
  flagColor: varchar("flagColor", { length: 16 }),
  /** 商家备注 */
  merchantRemark: text("merchantRemark"),
  /** 买家留言 */
  buyerMessage: text("buyerMessage"),
  /** 店铺名称 */
  shopName: varchar("shopName", { length: 128 }).default("滋栈官方旗舰店"),
  /** 删除状态：0正常，1已删除 */
  deleted: int("deleted").notNull().default(0),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;


/**
 * 千川配置表 - 存储千川API授权配置
 */
export const qianchuanConfig = mysqlTable("qianchuan_config", {
  id: int("id").autoincrement().primaryKey(),
  /** 应用ID */
  appId: varchar("appId", { length: 64 }).notNull(),
  /** 应用密钥（加密存储） */
  appSecret: varchar("appSecret", { length: 256 }).notNull(),
  /** 广告主ID */
  advertiserId: varchar("advertiserId", { length: 64 }),
  /** Access Token */
  accessToken: text("accessToken"),
  /** Refresh Token */
  refreshToken: text("refreshToken"),
  /** Token过期时间 */
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  /** Refresh Token过期时间 */
  refreshExpiresAt: timestamp("refreshExpiresAt"),
  /** 状态：0未授权，1已授权，2已过期 */
  status: int("status").notNull().default(0),
  /** 店铺名称 */
  shopName: varchar("shopName", { length: 128 }).default("滋栈官方旗舰店"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QianchuanConfig = typeof qianchuanConfig.$inferSelect;
export type InsertQianchuanConfig = typeof qianchuanConfig.$inferInsert;

/**
 * 千川推广费用表 - 存储每日推广费用数据
 */
export const qianchuanCost = mysqlTable("qianchuan_cost", {
  id: int("id").autoincrement().primaryKey(),
  /** 广告主ID */
  advertiserId: varchar("advertiserId", { length: 64 }).notNull(),
  /** 统计日期 */
  statDate: varchar("statDate", { length: 10 }).notNull(),
  /** 消耗金额（推广费用） */
  statCost: decimal("statCost", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 展示次数 */
  showCnt: int("showCnt").notNull().default(0),
  /** 点击次数 */
  clickCnt: int("clickCnt").notNull().default(0),
  /** 点击率 */
  ctr: decimal("ctr", { precision: 8, scale: 4 }),
  /** 千次展示成本 */
  cpm: decimal("cpm", { precision: 10, scale: 2 }),
  /** 成交订单数 */
  payOrderCount: int("payOrderCount").notNull().default(0),
  /** 成交金额 */
  payOrderAmount: decimal("payOrderAmount", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 支付ROI */
  roi: decimal("roi", { precision: 8, scale: 4 }),
  /** 成交成本 */
  costPerOrder: decimal("costPerOrder", { precision: 10, scale: 2 }),
  /** 营销目标 */
  marketingGoal: varchar("marketingGoal", { length: 32 }),
  /** 同步时间 */
  syncTime: timestamp("syncTime"),
  /** 店铺名称 */
  shopName: varchar("shopName", { length: 128 }).default("滋栈官方旗舰店"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QianchuanCost = typeof qianchuanCost.$inferSelect;
export type InsertQianchuanCost = typeof qianchuanCost.$inferInsert;

/**
 * 千川同步日志表 - 记录同步任务执行情况
 */
export const qianchuanSyncLog = mysqlTable("qianchuan_sync_log", {
  id: int("id").autoincrement().primaryKey(),
  /** 广告主ID */
  advertiserId: varchar("advertiserId", { length: 64 }),
  /** 同步类型：daily-每日同步，manual-手动同步 */
  syncType: varchar("syncType", { length: 16 }).notNull(),
  /** 同步开始日期 */
  startDate: varchar("startDate", { length: 10 }).notNull(),
  /** 同步结束日期 */
  endDate: varchar("endDate", { length: 10 }).notNull(),
  /** 同步状态：pending-进行中，success-成功，failed-失败 */
  status: varchar("status", { length: 16 }).notNull().default("pending"),
  /** 同步记录数 */
  recordCount: int("recordCount").default(0),
  /** 错误信息 */
  errorMessage: text("errorMessage"),
  /** 执行耗时（毫秒） */
  duration: int("duration"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QianchuanSyncLog = typeof qianchuanSyncLog.$inferSelect;
export type InsertQianchuanSyncLog = typeof qianchuanSyncLog.$inferInsert;

/**
 * 每日统计汇总表 - 存储每日订单和费用汇总数据
 */
export const dailyStats = mysqlTable("daily_stats", {
  id: int("id").autoincrement().primaryKey(),
  /** 统计日期 */
  statDate: varchar("statDate", { length: 10 }).notNull().unique(),
  /** 已发货数量 */
  shippedCount: int("shippedCount").notNull().default(0),
  /** 销售额 */
  salesAmount: decimal("salesAmount", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 退款额 */
  refundAmount: decimal("refundAmount", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 快递费 */
  expressFee: decimal("expressFee", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 小额打款 */
  smallPayment: decimal("smallPayment", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 达人佣金 */
  influencerCommission: decimal("influencerCommission", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 服务费 */
  serviceFee: decimal("serviceFee", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 商品成本 */
  productCost: decimal("productCost", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 代运营费 */
  operationFee: decimal("operationFee", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 赔付 */
  compensation: decimal("compensation", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 推广费（来自千川同步） */
  promotionFee: decimal("promotionFee", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 其他费用 */
  otherFee: decimal("otherFee", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 保险费 */
  insuranceFee: decimal("insuranceFee", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 预计利润 */
  estimatedProfit: decimal("estimatedProfit", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 利润率 */
  profitRate: decimal("profitRate", { precision: 8, scale: 4 }),
  /** 千川成交订单数 */
  qcPayOrderCount: int("qcPayOrderCount").default(0),
  /** 千川成交金额 */
  qcPayOrderAmount: decimal("qcPayOrderAmount", { precision: 12, scale: 2 }).default("0"),
  /** 千川ROI */
  qcRoi: decimal("qcRoi", { precision: 8, scale: 4 }),
  /** 推广费同步时间 */
  promotionSyncTime: timestamp("promotionSyncTime"),
  /** 店铺名称 */
  shopName: varchar("shopName", { length: 128 }).default("滋栈官方旗舰店"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyStats = typeof dailyStats.$inferSelect;
export type InsertDailyStats = typeof dailyStats.$inferInsert;


/**
 * 聚水潭配置表 - 存储聚水潭ERP API授权配置
 */
export const jstConfig = mysqlTable("jst_config", {
  id: int("id").autoincrement().primaryKey(),
  /** 合作方编号 */
  partnerId: varchar("partnerId", { length: 64 }).notNull(),
  /** 合作方密钥（加密存储） */
  partnerKey: varchar("partnerKey", { length: 256 }).notNull(),
  /** 授权Token */
  token: text("token"),
  /** Token过期时间 */
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  /** 公司编号 */
  coId: varchar("coId", { length: 64 }),
  /** 状态：0未授权，1已授权，2已过期 */
  status: int("status").notNull().default(0),
  /** 最后同步时间 */
  lastSyncTime: timestamp("lastSyncTime"),
  /** 店铺名称 */
  shopName: varchar("shopName", { length: 128 }).default("滋栈官方旗舰店"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JstConfig = typeof jstConfig.$inferSelect;
export type InsertJstConfig = typeof jstConfig.$inferInsert;

/**
 * 聚水潭入库单表 - 存储采购入库单信息
 */
export const jstPurchaseIn = mysqlTable("jst_purchase_in", {
  id: int("id").autoincrement().primaryKey(),
  /** 入库单ID */
  ioId: varchar("ioId", { length: 32 }).notNull().unique(),
  /** 采购单ID */
  poId: varchar("poId", { length: 32 }),
  /** 仓库名称 */
  warehouse: varchar("warehouse", { length: 128 }),
  /** 仓库ID */
  whId: varchar("whId", { length: 32 }),
  /** 供应商ID */
  supplierId: varchar("supplierId", { length: 32 }),
  /** 供应商名称 */
  supplierName: varchar("supplierName", { length: 128 }),
  /** 状态 */
  status: varchar("status", { length: 32 }),
  /** 入库日期 */
  ioDate: timestamp("ioDate"),
  /** 入库类型 */
  type: varchar("type", { length: 32 }),
  /** 总数量 */
  totalQty: int("totalQty").notNull().default(0),
  /** 总金额 */
  totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 备注 */
  remark: text("remark"),
  /** 原始数据JSON */
  rawData: text("rawData"),
  /** 店铺名称 */
  shopName: varchar("shopName", { length: 128 }).default("滋栈官方旗舰店"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JstPurchaseIn = typeof jstPurchaseIn.$inferSelect;
export type InsertJstPurchaseIn = typeof jstPurchaseIn.$inferInsert;

/**
 * 聚水潭入库明细表 - 存储入库单商品明细
 */
export const jstPurchaseInItem = mysqlTable("jst_purchase_in_item", {
  id: int("id").autoincrement().primaryKey(),
  /** 入库单ID（关联jst_purchase_in.id） */
  purchaseInId: int("purchaseInId").notNull(),
  /** 明细ID */
  ioiId: varchar("ioiId", { length: 32 }).notNull(),
  /** SKU编码 */
  skuId: varchar("skuId", { length: 64 }),
  /** 商品名称 */
  name: varchar("name", { length: 256 }),
  /** 入库数量 */
  qty: int("qty").notNull().default(0),
  /** 成本单价 */
  costPrice: decimal("costPrice", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 成本金额 */
  costAmount: decimal("costAmount", { precision: 12, scale: 2 }).notNull().default("0"),
  /** 备注 */
  remark: varchar("remark", { length: 512 }),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type JstPurchaseInItem = typeof jstPurchaseInItem.$inferSelect;
export type InsertJstPurchaseInItem = typeof jstPurchaseInItem.$inferInsert;

/**
 * 聚水潭仓库费用表 - 存储仓储费用数据
 */
export const jstWarehouseFee = mysqlTable("jst_warehouse_fee", {
  id: int("id").autoincrement().primaryKey(),
  /** 费用日期 */
  feeDate: varchar("feeDate", { length: 10 }).notNull(),
  /** 仓库ID */
  whId: varchar("whId", { length: 32 }),
  /** 仓库名称 */
  warehouse: varchar("warehouse", { length: 128 }),
  /** 仓储费 */
  storageFee: decimal("storageFee", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 操作费 */
  handlingFee: decimal("handlingFee", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 包装费 */
  packagingFee: decimal("packagingFee", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 其他费用 */
  otherFee: decimal("otherFee", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 总费用 */
  totalFee: decimal("totalFee", { precision: 10, scale: 2 }).notNull().default("0"),
  /** 备注 */
  remark: text("remark"),
  /** 店铺名称 */
  shopName: varchar("shopName", { length: 128 }).default("滋栈官方旗舰店"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JstWarehouseFee = typeof jstWarehouseFee.$inferSelect;
export type InsertJstWarehouseFee = typeof jstWarehouseFee.$inferInsert;

/**
 * 聚水潭同步日志表 - 记录同步任务执行情况
 */
export const jstSyncLog = mysqlTable("jst_sync_log", {
  id: int("id").autoincrement().primaryKey(),
  /** 同步类型：purchase_in/inventory/fee */
  syncType: varchar("syncType", { length: 32 }).notNull(),
  /** 同步数据日期 */
  syncDate: varchar("syncDate", { length: 10 }),
  /** 开始时间 */
  startTime: timestamp("startTime").notNull(),
  /** 结束时间 */
  endTime: timestamp("endTime"),
  /** 状态：running/success/failed */
  status: varchar("status", { length: 16 }).notNull().default("running"),
  /** 总记录数 */
  totalCount: int("totalCount").default(0),
  /** 成功数 */
  successCount: int("successCount").default(0),
  /** 失败数 */
  failCount: int("failCount").default(0),
  /** 错误信息 */
  errorMessage: text("errorMessage"),
  /** 店铺名称 */
  shopName: varchar("shopName", { length: 128 }).default("滋栈官方旗舰店"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type JstSyncLog = typeof jstSyncLog.$inferSelect;
export type InsertJstSyncLog = typeof jstSyncLog.$inferInsert;


/**
 * 单据表 - 存储配货单、出库单、入库单、退货单等
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  /** 单据编号 */
  documentNo: varchar("documentNo", { length: 100 }).notNull().unique(),
  /** 单据类型：picking/outbound/inbound/return */
  type: mysqlEnum("type", ["picking", "outbound", "inbound", "return"]).notNull(),
  /** 单据状态：pending/processing/completed/cancelled */
  status: mysqlEnum("status", ["pending", "processing", "completed", "cancelled"]).default("pending"),
  /** 创建时间 */
  createTime: timestamp("createTime").notNull(),
  /** 操作人ID */
  operatorId: int("operatorId"),
  /** 操作人名称 */
  operatorName: varchar("operatorName", { length: 100 }),
  /** 店铺名称 */
  shopName: varchar("shopName", { length: 100 }),
  /** 订单数量 */
  orderCount: int("orderCount").default(0),
  /** 商品数量 */
  productCount: int("productCount").default(0),
  /** 备注 */
  remark: text("remark"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * 单据与订单关联表 - 建立单据与订单的多对多关系
 */
export const documentOrderMapping = mysqlTable("document_order_mapping", {
  id: int("id").autoincrement().primaryKey(),
  /** 单据ID */
  documentId: int("documentId").notNull(),
  /** 订单ID */
  orderId: int("orderId").notNull(),
  /** 单据类型 */
  documentType: varchar("documentType", { length: 50 }).notNull(),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DocumentOrderMapping = typeof documentOrderMapping.$inferSelect;
export type InsertDocumentOrderMapping = typeof documentOrderMapping.$inferInsert;

/**
 * 勾稽日志表 - 记录数据勾稽检查结果
 */
export const reconciliationLogs = mysqlTable("reconciliation_logs", {
  id: int("id").autoincrement().primaryKey(),
  /** 检查类型：realtime/daily/monthly */
  checkType: mysqlEnum("checkType", ["realtime", "daily", "monthly"]).notNull(),
  /** 检查日期 */
  checkDate: timestamp("checkDate").notNull(),
  /** 检查状态：passed/failed */
  status: mysqlEnum("status", ["passed", "failed"]).notNull(),
  /** 检查详情（JSON格式） */
  details: text("details"),
  /** 错误信息 */
  errorMessage: text("errorMessage"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReconciliationLog = typeof reconciliationLogs.$inferSelect;
export type InsertReconciliationLog = typeof reconciliationLogs.$inferInsert;

/**
 * 勾稽异常表 - 记录数据勾稽发现的异常
 */
export const reconciliationExceptions = mysqlTable("reconciliation_exceptions", {
  id: int("id").autoincrement().primaryKey(),
  /** 异常类型 */
  exceptionType: varchar("exceptionType", { length: 50 }).notNull(),
  /** 订单ID */
  orderId: int("orderId"),
  /** 期望值 */
  expectedValue: decimal("expectedValue", { precision: 15, scale: 2 }),
  /** 实际值 */
  actualValue: decimal("actualValue", { precision: 15, scale: 2 }),
  /** 差异 */
  difference: decimal("difference", { precision: 15, scale: 2 }),
  /** 异常状态：pending/resolved */
  status: mysqlEnum("status", ["pending", "resolved"]).default("pending"),
  /** 解决人ID */
  resolvedBy: int("resolvedBy"),
  /** 解决时间 */
  resolvedAt: timestamp("resolvedAt"),
  /** 备注 */
  remark: text("remark"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReconciliationException = typeof reconciliationExceptions.$inferSelect;
export type InsertReconciliationException = typeof reconciliationExceptions.$inferInsert;

/**
 * 数据同步日志表 - 记录从抖店同步数据的过程
 */
export const syncLogs = mysqlTable("sync_logs", {
  id: int("id").autoincrement().primaryKey(),
  /** 同步类型：orders/products/etc */
  syncType: varchar("syncType", { length: 50 }).notNull(),
  /** 同步开始日期 */
  startDate: timestamp("startDate"),
  /** 同步结束日期 */
  endDate: timestamp("endDate"),
  /** 同步状态：pending/success/failed */
  status: mysqlEnum("status", ["pending", "success", "failed"]).notNull(),
  /** 新增数量 */
  newCount: int("newCount").default(0),
  /** 更新数量 */
  updatedCount: int("updatedCount").default(0),
  /** 总数量 */
  totalCount: int("totalCount").default(0),
  /** 错误信息 */
  errorMessage: text("errorMessage"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 完成时间 */
  completedAt: timestamp("completedAt"),
});

export type SyncLog = typeof syncLogs.$inferSelect;
export type InsertSyncLog = typeof syncLogs.$inferInsert;


/**
 * 抖店授权Token表 - 存储商户的抖店OAuth授权信息
 */
export const doudianAuthTokens = mysqlTable("doudian_auth_tokens", {
  id: int("id").autoincrement().primaryKey(),
  /** 关联用户ID */
  userId: int("userId").notNull(),
  /** 店铺ID */
  shopId: varchar("shopId", { length: 64 }).notNull(),
  /** 店铺名称 */
  shopName: varchar("shopName", { length: 128 }),
  /** Access Token */
  accessToken: text("accessToken").notNull(),
  /** Refresh Token */
  refreshToken: text("refreshToken"),
  /** Access Token过期时间 */
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt").notNull(),
  /** Refresh Token过期时间 */
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  /** 授权范围 */
  scope: text("scope"),
  /** 授权状态：0未授权，1已授权，2已过期，3已失效 */
  status: int("status").notNull().default(1),
  /** 最后同步时间 */
  lastSyncAt: timestamp("lastSyncAt"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DoudianAuthToken = typeof doudianAuthTokens.$inferSelect;
export type InsertDoudianAuthToken = typeof doudianAuthTokens.$inferInsert;

/**
 * 抖店店铺信息表 - 存储已授权的店铺基本信息
 */
export const doudianShops = mysqlTable("doudian_shops", {
  id: int("id").autoincrement().primaryKey(),
  /** 店铺ID */
  shopId: varchar("shopId", { length: 64 }).notNull().unique(),
  /** 店铺名称 */
  shopName: varchar("shopName", { length: 128 }),
  /** 店铺Logo */
  shopLogo: text("shopLogo"),
  /** 店铺类型 */
  shopType: varchar("shopType", { length: 32 }),
  /** 店铺状态 */
  shopStatus: varchar("shopStatus", { length: 32 }),
  /** 关联用户ID */
  userId: int("userId").notNull(),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DoudianShop = typeof doudianShops.$inferSelect;
export type InsertDoudianShop = typeof doudianShops.$inferInsert;
