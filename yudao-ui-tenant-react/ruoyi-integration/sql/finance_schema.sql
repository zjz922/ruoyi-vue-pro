-- =============================================
-- 闪电账PRO - RuoYi-Vue-Pro 整合数据库脚本
-- 模块：yudao-module-finance（财务管理模块）
-- 作者：Manus AI
-- 日期：2025-01-14
-- =============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- 1. 商品成本表
-- ----------------------------
DROP TABLE IF EXISTS `finance_product_cost`;
CREATE TABLE `finance_product_cost` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户ID',
  `product_id` varchar(64) NOT NULL COMMENT '商品号（抖店商品ID）',
  `sku` varchar(64) NOT NULL DEFAULT '0' COMMENT 'SKU编码',
  `title` varchar(512) NOT NULL COMMENT '商品标题',
  `cost` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '商品成本价',
  `merchant_code` varchar(64) DEFAULT NULL COMMENT '商家编码',
  `price` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '商品售价',
  `custom_name` varchar(255) DEFAULT NULL COMMENT '自定义名称',
  `stock` int NOT NULL DEFAULT 0 COMMENT '库存数量',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0有效，1删除',
  `effective_date` datetime DEFAULT NULL COMMENT '最新生效时间',
  `shop_name` varchar(128) DEFAULT '滋栈官方旗舰店' COMMENT '店铺名称',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_sku` (`sku`),
  KEY `idx_shop_name` (`shop_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品成本表';

-- ----------------------------
-- 2. 商品成本历史记录表
-- ----------------------------
DROP TABLE IF EXISTS `finance_product_cost_history`;
CREATE TABLE `finance_product_cost_history` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户ID',
  `product_cost_id` bigint NOT NULL COMMENT '关联的商品成本ID',
  `product_id` varchar(64) NOT NULL COMMENT '商品号',
  `old_cost` decimal(10,2) NOT NULL COMMENT '旧成本价',
  `new_cost` decimal(10,2) NOT NULL COMMENT '新成本价',
  `reason` varchar(512) DEFAULT NULL COMMENT '变更原因',
  `operator_id` bigint DEFAULT NULL COMMENT '操作人ID',
  `operator_name` varchar(128) DEFAULT NULL COMMENT '操作人名称',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_product_cost_id` (`product_cost_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品成本历史记录表';

-- ----------------------------
-- 3. 订单表
-- ----------------------------
DROP TABLE IF EXISTS `finance_order`;
CREATE TABLE `finance_order` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户ID',
  `main_order_no` varchar(32) NOT NULL COMMENT '主订单编号',
  `sub_order_no` varchar(32) NOT NULL COMMENT '子订单编号',
  `product_name` varchar(512) DEFAULT NULL COMMENT '商品名称',
  `product_spec` varchar(255) DEFAULT NULL COMMENT '商品规格',
  `quantity` int NOT NULL DEFAULT 1 COMMENT '商品数量',
  `sku` varchar(64) DEFAULT NULL COMMENT '商家编码/SKU',
  `unit_price` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '商品单价',
  `pay_amount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '订单应付金额',
  `freight` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '运费',
  `total_discount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '优惠总金额',
  `platform_discount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '平台优惠',
  `merchant_discount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '商家优惠',
  `influencer_discount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '达人优惠',
  `service_fee` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '服务费/手续费',
  `pay_method` varchar(32) DEFAULT NULL COMMENT '支付方式',
  `receiver` varchar(64) DEFAULT NULL COMMENT '收件人',
  `receiver_phone` varchar(32) DEFAULT NULL COMMENT '收件人手机号',
  `province` varchar(32) DEFAULT NULL COMMENT '省',
  `city` varchar(32) DEFAULT NULL COMMENT '市',
  `district` varchar(32) DEFAULT NULL COMMENT '区',
  `address` varchar(512) DEFAULT NULL COMMENT '详细地址',
  `order_time` datetime DEFAULT NULL COMMENT '订单提交时间',
  `pay_time` datetime DEFAULT NULL COMMENT '支付完成时间',
  `ship_time` datetime DEFAULT NULL COMMENT '发货时间',
  `complete_time` datetime DEFAULT NULL COMMENT '订单完成时间',
  `status` varchar(32) NOT NULL DEFAULT '待发货' COMMENT '订单状态',
  `after_sale_status` varchar(32) DEFAULT NULL COMMENT '售后状态',
  `cancel_reason` varchar(512) DEFAULT NULL COMMENT '取消原因',
  `app_channel` varchar(32) DEFAULT NULL COMMENT 'APP渠道',
  `traffic_source` varchar(64) DEFAULT NULL COMMENT '流量来源',
  `order_type` varchar(32) DEFAULT NULL COMMENT '订单类型',
  `influencer_id` varchar(64) DEFAULT NULL COMMENT '达人ID',
  `influencer_name` varchar(128) DEFAULT NULL COMMENT '达人昵称',
  `flag_color` varchar(16) DEFAULT NULL COMMENT '旗帜颜色',
  `merchant_remark` varchar(512) DEFAULT NULL COMMENT '商家备注',
  `buyer_message` varchar(512) DEFAULT NULL COMMENT '买家留言',
  `shop_name` varchar(128) DEFAULT '滋栈官方旗舰店' COMMENT '店铺名称',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sub_order_no` (`sub_order_no`, `tenant_id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_main_order_no` (`main_order_no`),
  KEY `idx_order_time` (`order_time`),
  KEY `idx_status` (`status`),
  KEY `idx_shop_name` (`shop_name`),
  KEY `idx_province` (`province`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- ----------------------------
-- 4. 订单费用明细表（新增）
-- ----------------------------
DROP TABLE IF EXISTS `finance_order_fee`;
CREATE TABLE `finance_order_fee` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户ID',
  `order_id` bigint NOT NULL COMMENT '关联订单ID',
  `sub_order_no` varchar(32) NOT NULL COMMENT '子订单编号',
  `fee_type` varchar(32) NOT NULL COMMENT '费用类型：express快递费,commission达人佣金,service服务费,promotion推广费,insurance保险费,compensation赔付,other其他',
  `fee_name` varchar(64) NOT NULL COMMENT '费用名称',
  `fee_amount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '费用金额',
  `fee_date` date DEFAULT NULL COMMENT '费用日期',
  `remark` varchar(512) DEFAULT NULL COMMENT '备注',
  `source` varchar(32) DEFAULT 'manual' COMMENT '数据来源：manual手动,api接口同步',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_sub_order_no` (`sub_order_no`),
  KEY `idx_fee_type` (`fee_type`),
  KEY `idx_fee_date` (`fee_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单费用明细表';

-- ----------------------------
-- 5. 抖店API配置表
-- ----------------------------
DROP TABLE IF EXISTS `finance_doudian_config`;
CREATE TABLE `finance_doudian_config` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户ID',
  `shop_name` varchar(128) NOT NULL COMMENT '店铺名称',
  `app_key` varchar(64) NOT NULL COMMENT '应用Key',
  `app_secret` varchar(128) NOT NULL COMMENT '应用Secret（加密存储）',
  `access_token` varchar(512) DEFAULT NULL COMMENT '访问令牌',
  `refresh_token` varchar(512) DEFAULT NULL COMMENT '刷新令牌',
  `token_expire_time` datetime DEFAULT NULL COMMENT '令牌过期时间',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：0禁用，1启用',
  `last_sync_time` datetime DEFAULT NULL COMMENT '最后同步时间',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_shop_name` (`shop_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='抖店API配置表';

-- ----------------------------
-- 6. 数据同步日志表
-- ----------------------------
DROP TABLE IF EXISTS `finance_sync_log`;
CREATE TABLE `finance_sync_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户ID',
  `sync_type` varchar(32) NOT NULL COMMENT '同步类型：order订单,product商品,commission佣金,settle结算',
  `sync_status` tinyint NOT NULL DEFAULT 0 COMMENT '同步状态：0进行中，1成功，2失败',
  `start_time` datetime NOT NULL COMMENT '同步开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '同步结束时间',
  `total_count` int DEFAULT 0 COMMENT '总记录数',
  `success_count` int DEFAULT 0 COMMENT '成功数',
  `fail_count` int DEFAULT 0 COMMENT '失败数',
  `error_msg` text COMMENT '错误信息',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_sync_type` (`sync_type`),
  KEY `idx_sync_status` (`sync_status`),
  KEY `idx_start_time` (`start_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据同步日志表';

-- ----------------------------
-- 7. 每日统计汇总表（新增，用于存储订单统计页面的汇总数据）
-- ----------------------------
DROP TABLE IF EXISTS `finance_daily_stats`;
CREATE TABLE `finance_daily_stats` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户ID',
  `stats_date` date NOT NULL COMMENT '统计日期',
  `shop_name` varchar(128) DEFAULT NULL COMMENT '店铺名称',
  `order_count` int NOT NULL DEFAULT 0 COMMENT '订单数',
  `shipped_count` int NOT NULL DEFAULT 0 COMMENT '已发货数',
  `sales_amount` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT '销售额',
  `refund_amount` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT '退款额',
  `express_fee` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT '快递费',
  `commission_fee` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT '达人佣金',
  `service_fee` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT '服务费',
  `product_cost` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT '商品成本',
  `promotion_fee` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT '推广费',
  `insurance_fee` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT '保险费',
  `compensation_fee` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT '赔付',
  `other_fee` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT '其他费用',
  `profit` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT '利润',
  `profit_rate` decimal(6,2) NOT NULL DEFAULT 0.00 COMMENT '利润率(%)',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_date_shop` (`tenant_id`, `stats_date`, `shop_name`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_stats_date` (`stats_date`),
  KEY `idx_shop_name` (`shop_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='每日统计汇总表';

SET FOREIGN_KEY_CHECKS = 1;
