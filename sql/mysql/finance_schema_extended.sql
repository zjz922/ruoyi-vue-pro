-- ========================================
-- 闪电帐PRO 财务管理模块 扩展数据库脚本
-- ========================================
-- 本脚本包含扩展表和索引优化

-- 千川配置表
CREATE TABLE IF NOT EXISTS `finance_qianchuan_config` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '配置ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` BIGINT NOT NULL COMMENT '店铺ID',
    `app_key` VARCHAR(255) NOT NULL COMMENT 'App Key',
    `app_secret` VARCHAR(255) NOT NULL COMMENT 'App Secret',
    `access_token` LONGTEXT COMMENT 'Access Token',
    `refresh_token` LONGTEXT COMMENT 'Refresh Token',
    `token_expire_time` BIGINT COMMENT 'Token过期时间',
    `auth_status` VARCHAR(32) COMMENT '授权状态(unauthorized/authorized/expired/revoked)',
    `auth_time` BIGINT COMMENT '授权时间(时间戳)',
    `enabled` TINYINT DEFAULT 1 COMMENT '是否启用(0=禁用,1=启用)',
    `remark` VARCHAR(500) COMMENT '备注',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` VARCHAR(64) COMMENT '创建人',
    `update_by` VARCHAR(64) COMMENT '更新人',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志(0=未删除,1=已删除)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_shop_id` (`shop_id`, `tenant_id`),
    KEY `idx_auth_status` (`auth_status`),
    KEY `idx_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='千川配置表';

-- 聚水潭配置表
CREATE TABLE IF NOT EXISTS `finance_jst_config` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '配置ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` BIGINT NOT NULL COMMENT '店铺ID',
    `api_key` VARCHAR(255) NOT NULL COMMENT 'API Key',
    `api_secret` VARCHAR(255) NOT NULL COMMENT 'API Secret',
    `auth_status` VARCHAR(32) COMMENT '授权状态(unauthorized/authorized/expired/revoked)',
    `auth_time` BIGINT COMMENT '授权时间(时间戳)',
    `enabled` TINYINT DEFAULT 1 COMMENT '是否启用(0=禁用,1=启用)',
    `remark` VARCHAR(500) COMMENT '备注',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by` VARCHAR(64) COMMENT '创建人',
    `update_by` VARCHAR(64) COMMENT '更新人',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志(0=未删除,1=已删除)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_shop_id` (`shop_id`, `tenant_id`),
    KEY `idx_auth_status` (`auth_status`),
    KEY `idx_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='聚水潭配置表';

-- 对账差异表
CREATE TABLE IF NOT EXISTS `finance_reconciliation_diff` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '差异ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` BIGINT NOT NULL COMMENT '店铺ID',
    `reconciliation_date` DATE NOT NULL COMMENT '对账日期',
    `platform` VARCHAR(32) COMMENT '平台(doudian/qianchuan)',
    `platform_amount` DECIMAL(10, 2) COMMENT '平台金额',
    `system_amount` DECIMAL(10, 2) COMMENT '系统金额',
    `diff_amount` DECIMAL(10, 2) COMMENT '差异金额',
    `diff_reason` VARCHAR(255) COMMENT '差异原因',
    `status` VARCHAR(32) COMMENT '处理状态(unprocessed/processed)',
    `handler_id` BIGINT COMMENT '处理人ID',
    `handle_time` DATETIME COMMENT '处理时间',
    `remark` VARCHAR(500) COMMENT '备注',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志(0=未删除,1=已删除)',
    PRIMARY KEY (`id`),
    KEY `idx_shop_id` (`shop_id`, `tenant_id`),
    KEY `idx_reconciliation_date` (`reconciliation_date`),
    KEY `idx_status` (`status`),
    KEY `idx_platform` (`platform`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='对账差异表';

-- 成本调整记录表
CREATE TABLE IF NOT EXISTS `finance_cost_adjustment` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '调整ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` BIGINT NOT NULL COMMENT '店铺ID',
    `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
    `sku_id` VARCHAR(64) COMMENT 'SKU ID',
    `old_cost` DECIMAL(10, 2) COMMENT '原成本',
    `new_cost` DECIMAL(10, 2) COMMENT '新成本',
    `adjustment_reason` VARCHAR(255) COMMENT '调整原因',
    `remark` VARCHAR(500) COMMENT '备注',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(64) COMMENT '创建人',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志(0=未删除,1=已删除)',
    PRIMARY KEY (`id`),
    KEY `idx_shop_id` (`shop_id`, `tenant_id`),
    KEY `idx_product_id` (`product_id`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='成本调整记录表';

-- 财务报表表
CREATE TABLE IF NOT EXISTS `finance_report` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '报表ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `shop_id` BIGINT NOT NULL COMMENT '店铺ID',
    `report_type` VARCHAR(32) NOT NULL COMMENT '报表类型(daily/weekly/monthly)',
    `report_date` DATE NOT NULL COMMENT '报表日期',
    `total_income` DECIMAL(10, 2) COMMENT '总收入',
    `total_expense` DECIMAL(10, 2) COMMENT '总支出',
    `total_refund` DECIMAL(10, 2) COMMENT '总退款',
    `net_income` DECIMAL(10, 2) COMMENT '净收入',
    `order_count` INT COMMENT '订单数',
    `product_count` INT COMMENT '商品数',
    `report_data` LONGTEXT COMMENT '报表数据(JSON)',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `del_flag` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标志(0=未删除,1=已删除)',
    PRIMARY KEY (`id`),
    KEY `idx_shop_id` (`shop_id`, `tenant_id`),
    KEY `idx_report_date` (`report_date`),
    KEY `idx_report_type` (`report_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='财务报表表';

-- ========================================
-- 索引优化
-- ========================================

-- 订单表复合索引
ALTER TABLE `finance_orders` ADD KEY `idx_shop_create_time` (`shop_id`, `create_time`);
ALTER TABLE `finance_orders` ADD KEY `idx_platform_order_id` (`platform_order_id`, `platform`);
ALTER TABLE `finance_orders` ADD KEY `idx_status_create_time` (`status`, `create_time`);

-- 资金流水表复合索引
ALTER TABLE `finance_cashflow` ADD KEY `idx_shop_trade_time` (`shop_id`, `trade_time`);
ALTER TABLE `finance_cashflow` ADD KEY `idx_platform_flow_id` (`platform_flow_id`, `platform`);
ALTER TABLE `finance_cashflow` ADD KEY `idx_confirm_status_time` (`confirm_status`, `create_time`);
ALTER TABLE `finance_cashflow` ADD KEY `idx_reconciliation_status_time` (`reconciliation_status`, `create_time`);

-- 商品成本表复合索引
ALTER TABLE `finance_product_cost` ADD KEY `idx_shop_product_id` (`shop_id`, `product_id`);
ALTER TABLE `finance_product_cost` ADD KEY `idx_platform_product_id` (`platform_product_id`, `platform`);
ALTER TABLE `finance_product_cost` ADD KEY `idx_stock_cost` (`stock`, `cost`);

-- ========================================
-- 视图定义
-- ========================================

-- 每日财务汇总视图
CREATE OR REPLACE VIEW `v_finance_daily_summary` AS
SELECT
    DATE(o.create_time) as summary_date,
    o.shop_id,
    o.tenant_id,
    COUNT(DISTINCT o.id) as order_count,
    SUM(o.pay_amount) as total_amount,
    COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN o.id END) as completed_count,
    SUM(CASE WHEN o.status = 'completed' THEN o.pay_amount ELSE 0 END) as completed_amount,
    (SELECT SUM(amount) FROM finance_cashflow cf WHERE cf.shop_id = o.shop_id AND DATE(cf.trade_time) = DATE(o.create_time) AND cf.trade_type = 'income') as income_amount,
    (SELECT SUM(amount) FROM finance_cashflow cf WHERE cf.shop_id = o.shop_id AND DATE(cf.trade_time) = DATE(o.create_time) AND cf.trade_type = 'expense') as expense_amount
FROM finance_orders o
WHERE o.del_flag = 0
GROUP BY DATE(o.create_time), o.shop_id, o.tenant_id;

-- 商品成本统计视图
CREATE OR REPLACE VIEW `v_finance_product_cost_summary` AS
SELECT
    pc.shop_id,
    pc.tenant_id,
    COUNT(*) as product_count,
    SUM(pc.stock) as total_stock,
    SUM(pc.cost * pc.stock) as total_cost_value,
    SUM(pc.sale_price * pc.stock) as total_sale_value,
    AVG(pc.cost) as avg_cost,
    AVG(pc.sale_price) as avg_sale_price,
    MIN(pc.cost) as min_cost,
    MAX(pc.cost) as max_cost
FROM finance_product_cost pc
WHERE pc.del_flag = 0
GROUP BY pc.shop_id, pc.tenant_id;

-- 对账状态统计视图
CREATE OR REPLACE VIEW `v_finance_reconciliation_summary` AS
SELECT
    cf.shop_id,
    cf.tenant_id,
    cf.platform,
    COUNT(*) as total_count,
    SUM(CASE WHEN cf.reconciliation_status = 'reconciled' THEN 1 ELSE 0 END) as reconciled_count,
    SUM(CASE WHEN cf.reconciliation_status = 'unreconciled' THEN 1 ELSE 0 END) as unreconciled_count,
    SUM(CASE WHEN cf.reconciliation_status = 'discrepancy' THEN 1 ELSE 0 END) as discrepancy_count,
    SUM(CASE WHEN cf.reconciliation_status = 'reconciled' THEN cf.amount ELSE 0 END) as reconciled_amount,
    SUM(CASE WHEN cf.reconciliation_status = 'unreconciled' THEN cf.amount ELSE 0 END) as unreconciled_amount
FROM finance_cashflow cf
WHERE cf.del_flag = 0
GROUP BY cf.shop_id, cf.tenant_id, cf.platform;
