-- =============================================
-- 闪电帐PRO - 缺失数据库表SQL脚本
-- 根据MISSING_FEATURES_ANALYSIS.md文档生成
-- 创建时间: 2025-01-16
-- =============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- 1. 抖店授权Token表
-- ----------------------------
DROP TABLE IF EXISTS `finance_doudian_auth_token`;
CREATE TABLE `finance_doudian_auth_token` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    `shop_id` varchar(64) NOT NULL COMMENT '店铺ID',
    `shop_name` varchar(255) DEFAULT NULL COMMENT '店铺名称',
    `access_token` varchar(512) NOT NULL COMMENT '访问令牌',
    `refresh_token` varchar(512) DEFAULT NULL COMMENT '刷新令牌',
    `expires_in` int DEFAULT NULL COMMENT '过期时间(秒)',
    `token_type` varchar(32) DEFAULT 'Bearer' COMMENT '令牌类型',
    `scope` varchar(1024) DEFAULT NULL COMMENT '授权范围',
    `auth_status` tinyint NOT NULL DEFAULT 1 COMMENT '授权状态: 0-未授权 1-已授权 2-已过期 3-已撤销',
    `auth_time` datetime DEFAULT NULL COMMENT '授权时间',
    `expire_time` datetime DEFAULT NULL COMMENT '过期时间',
    `last_refresh_time` datetime DEFAULT NULL COMMENT '最后刷新时间',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_shop_id` (`shop_id`, `deleted`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_auth_status` (`auth_status`),
    KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='抖店授权Token表';

-- ----------------------------
-- 2. 抖店店铺信息表
-- ----------------------------
DROP TABLE IF EXISTS `finance_doudian_shop`;
CREATE TABLE `finance_doudian_shop` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    `shop_id` varchar(64) NOT NULL COMMENT '店铺ID',
    `shop_name` varchar(255) NOT NULL COMMENT '店铺名称',
    `shop_logo` varchar(512) DEFAULT NULL COMMENT '店铺Logo',
    `shop_type` tinyint DEFAULT NULL COMMENT '店铺类型: 1-个人 2-企业 3-旗舰店',
    `shop_status` tinyint DEFAULT 1 COMMENT '店铺状态: 0-关闭 1-正常',
    `category_id` bigint DEFAULT NULL COMMENT '主营类目ID',
    `category_name` varchar(128) DEFAULT NULL COMMENT '主营类目名称',
    `contact_name` varchar(64) DEFAULT NULL COMMENT '联系人姓名',
    `contact_phone` varchar(32) DEFAULT NULL COMMENT '联系人电话',
    `province` varchar(64) DEFAULT NULL COMMENT '省份',
    `city` varchar(64) DEFAULT NULL COMMENT '城市',
    `district` varchar(64) DEFAULT NULL COMMENT '区县',
    `address` varchar(512) DEFAULT NULL COMMENT '详细地址',
    `business_license` varchar(128) DEFAULT NULL COMMENT '营业执照号',
    `legal_person` varchar(64) DEFAULT NULL COMMENT '法人姓名',
    `open_time` datetime DEFAULT NULL COMMENT '开店时间',
    `extra_info` json DEFAULT NULL COMMENT '扩展信息(JSON)',
    `last_sync_time` datetime DEFAULT NULL COMMENT '最后同步时间',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_shop_id` (`shop_id`, `deleted`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_shop_status` (`shop_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='抖店店铺信息表';

-- ----------------------------
-- 3. 单据订单关联表
-- ----------------------------
DROP TABLE IF EXISTS `finance_document_mapping`;
CREATE TABLE `finance_document_mapping` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    `shop_id` bigint NOT NULL COMMENT '店铺ID',
    `document_no` varchar(64) NOT NULL COMMENT '单据编号',
    `document_type` varchar(32) NOT NULL COMMENT '单据类型: ORDER-订单 REFUND-退款 SETTLEMENT-结算',
    `order_id` varchar(64) NOT NULL COMMENT '订单ID',
    `order_no` varchar(64) DEFAULT NULL COMMENT '订单编号',
    `mapping_type` varchar(32) DEFAULT 'AUTO' COMMENT '关联类型: AUTO-自动 MANUAL-手动',
    `mapping_status` tinyint DEFAULT 1 COMMENT '关联状态: 0-无效 1-有效',
    `mapping_time` datetime DEFAULT NULL COMMENT '关联时间',
    `remark` varchar(512) DEFAULT NULL COMMENT '备注',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_document_order` (`document_no`, `order_id`, `deleted`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_shop_id` (`shop_id`),
    KEY `idx_document_no` (`document_no`),
    KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='单据订单关联表';

-- ----------------------------
-- 4. 对账日志表
-- ----------------------------
DROP TABLE IF EXISTS `finance_reconciliation_log`;
CREATE TABLE `finance_reconciliation_log` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    `shop_id` bigint NOT NULL COMMENT '店铺ID',
    `check_date` date NOT NULL COMMENT '对账日期',
    `platform` varchar(32) NOT NULL DEFAULT 'doudian' COMMENT '平台: doudian-抖店 qianchuan-千川 jst-聚水潭',
    `check_type` varchar(32) DEFAULT 'AUTO' COMMENT '对账类型: AUTO-自动 MANUAL-手动',
    `check_status` tinyint NOT NULL DEFAULT 0 COMMENT '对账状态: 0-待对账 1-对账中 2-已完成 3-有差异 4-已处理',
    `total_count` int DEFAULT 0 COMMENT '总记录数',
    `matched_count` int DEFAULT 0 COMMENT '匹配数量',
    `diff_count` int DEFAULT 0 COMMENT '差异数量',
    `total_amount` decimal(18,2) DEFAULT 0.00 COMMENT '总金额',
    `matched_amount` decimal(18,2) DEFAULT 0.00 COMMENT '匹配金额',
    `diff_amount` decimal(18,2) DEFAULT 0.00 COMMENT '差异金额',
    `start_time` datetime DEFAULT NULL COMMENT '开始时间',
    `end_time` datetime DEFAULT NULL COMMENT '结束时间',
    `duration` int DEFAULT NULL COMMENT '耗时(秒)',
    `error_msg` text COMMENT '错误信息',
    `result_summary` json DEFAULT NULL COMMENT '结果摘要(JSON)',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_shop_id` (`shop_id`),
    KEY `idx_check_date` (`check_date`),
    KEY `idx_check_status` (`check_status`),
    KEY `idx_platform` (`platform`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='对账日志表';

-- ----------------------------
-- 5. 对账异常表
-- ----------------------------
DROP TABLE IF EXISTS `finance_reconciliation_exception`;
CREATE TABLE `finance_reconciliation_exception` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    `shop_id` bigint NOT NULL COMMENT '店铺ID',
    `log_id` bigint NOT NULL COMMENT '对账日志ID',
    `check_date` date NOT NULL COMMENT '对账日期',
    `exception_type` varchar(32) NOT NULL COMMENT '异常类型: AMOUNT_DIFF-金额差异 MISSING_ORDER-缺失订单 EXTRA_ORDER-多余订单 STATUS_DIFF-状态差异',
    `exception_level` varchar(16) DEFAULT 'NORMAL' COMMENT '异常级别: LOW-低 NORMAL-普通 HIGH-高 CRITICAL-严重',
    `order_id` varchar(64) DEFAULT NULL COMMENT '订单ID',
    `order_no` varchar(64) DEFAULT NULL COMMENT '订单编号',
    `local_amount` decimal(18,2) DEFAULT NULL COMMENT '本地金额',
    `platform_amount` decimal(18,2) DEFAULT NULL COMMENT '平台金额',
    `diff_amount` decimal(18,2) DEFAULT NULL COMMENT '差异金额',
    `local_status` varchar(32) DEFAULT NULL COMMENT '本地状态',
    `platform_status` varchar(32) DEFAULT NULL COMMENT '平台状态',
    `exception_desc` varchar(1024) DEFAULT NULL COMMENT '异常描述',
    `handle_status` tinyint NOT NULL DEFAULT 0 COMMENT '处理状态: 0-待处理 1-处理中 2-已处理 3-已忽略',
    `handle_type` varchar(32) DEFAULT NULL COMMENT '处理方式: ADJUST-调整 IGNORE-忽略 MANUAL-人工处理',
    `handle_result` varchar(512) DEFAULT NULL COMMENT '处理结果',
    `handle_time` datetime DEFAULT NULL COMMENT '处理时间',
    `handler` varchar(64) DEFAULT NULL COMMENT '处理人',
    `remark` varchar(512) DEFAULT NULL COMMENT '备注',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_shop_id` (`shop_id`),
    KEY `idx_log_id` (`log_id`),
    KEY `idx_check_date` (`check_date`),
    KEY `idx_exception_type` (`exception_type`),
    KEY `idx_handle_status` (`handle_status`),
    KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='对账异常表';

-- ----------------------------
-- 6. 预警规则表
-- ----------------------------
DROP TABLE IF EXISTS `finance_alert_rule`;
CREATE TABLE `finance_alert_rule` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    `shop_id` bigint DEFAULT NULL COMMENT '店铺ID(NULL表示全局规则)',
    `rule_name` varchar(128) NOT NULL COMMENT '规则名称',
    `rule_code` varchar(64) NOT NULL COMMENT '规则编码',
    `rule_type` varchar(32) NOT NULL COMMENT '规则类型: AMOUNT-金额 COUNT-数量 RATE-比率 TIME-时间',
    `alert_type` varchar(32) NOT NULL COMMENT '预警类型: LOW_STOCK-库存不足 HIGH_COST-成本过高 LOW_PROFIT-利润过低 SYNC_FAIL-同步失败 RECONCILIATION_DIFF-对账差异',
    `alert_level` varchar(16) DEFAULT 'NORMAL' COMMENT '预警级别: LOW-低 NORMAL-普通 HIGH-高 CRITICAL-严重',
    `condition_config` json NOT NULL COMMENT '条件配置(JSON): {"field":"amount","operator":"gt","value":1000}',
    `threshold_value` decimal(18,4) DEFAULT NULL COMMENT '阈值',
    `threshold_unit` varchar(32) DEFAULT NULL COMMENT '阈值单位',
    `check_interval` int DEFAULT 60 COMMENT '检查间隔(分钟)',
    `notify_channels` varchar(256) DEFAULT NULL COMMENT '通知渠道: EMAIL,SMS,WECHAT,SYSTEM',
    `notify_users` varchar(512) DEFAULT NULL COMMENT '通知用户ID列表(逗号分隔)',
    `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
    `description` varchar(512) DEFAULT NULL COMMENT '规则描述',
    `last_check_time` datetime DEFAULT NULL COMMENT '最后检查时间',
    `last_alert_time` datetime DEFAULT NULL COMMENT '最后预警时间',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_rule_code` (`rule_code`, `tenant_id`, `deleted`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_shop_id` (`shop_id`),
    KEY `idx_rule_type` (`rule_type`),
    KEY `idx_alert_type` (`alert_type`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预警规则表';

-- ----------------------------
-- 7. 预警记录表
-- ----------------------------
DROP TABLE IF EXISTS `finance_alert_record`;
CREATE TABLE `finance_alert_record` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    `shop_id` bigint DEFAULT NULL COMMENT '店铺ID',
    `rule_id` bigint NOT NULL COMMENT '规则ID',
    `rule_name` varchar(128) DEFAULT NULL COMMENT '规则名称',
    `alert_type` varchar(32) NOT NULL COMMENT '预警类型',
    `alert_level` varchar(16) DEFAULT 'NORMAL' COMMENT '预警级别',
    `alert_title` varchar(256) NOT NULL COMMENT '预警标题',
    `alert_content` text COMMENT '预警内容',
    `alert_data` json DEFAULT NULL COMMENT '预警数据(JSON)',
    `trigger_value` decimal(18,4) DEFAULT NULL COMMENT '触发值',
    `threshold_value` decimal(18,4) DEFAULT NULL COMMENT '阈值',
    `alert_time` datetime NOT NULL COMMENT '预警时间',
    `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态: 0-未处理 1-处理中 2-已处理 3-已忽略',
    `handle_result` varchar(512) DEFAULT NULL COMMENT '处理结果',
    `handle_remark` varchar(512) DEFAULT NULL COMMENT '处理备注',
    `handle_time` datetime DEFAULT NULL COMMENT '处理时间',
    `handler` varchar(64) DEFAULT NULL COMMENT '处理人',
    `notify_status` tinyint DEFAULT 0 COMMENT '通知状态: 0-未通知 1-已通知 2-通知失败',
    `notify_time` datetime DEFAULT NULL COMMENT '通知时间',
    `notify_result` varchar(512) DEFAULT NULL COMMENT '通知结果',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_shop_id` (`shop_id`),
    KEY `idx_rule_id` (`rule_id`),
    KEY `idx_alert_type` (`alert_type`),
    KEY `idx_alert_level` (`alert_level`),
    KEY `idx_status` (`status`),
    KEY `idx_alert_time` (`alert_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预警记录表';

-- ----------------------------
-- 8. 渠道配置表
-- ----------------------------
DROP TABLE IF EXISTS `finance_channel`;
CREATE TABLE `finance_channel` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    `shop_id` bigint NOT NULL COMMENT '店铺ID',
    `channel_code` varchar(64) NOT NULL COMMENT '渠道编码',
    `channel_name` varchar(128) NOT NULL COMMENT '渠道名称',
    `channel_type` varchar(32) NOT NULL COMMENT '渠道类型: DOUDIAN-抖店 QIANCHUAN-千川 JST-聚水潭 BANK-银行 ALIPAY-支付宝 WECHAT-微信',
    `account_no` varchar(128) DEFAULT NULL COMMENT '账户号',
    `account_name` varchar(128) DEFAULT NULL COMMENT '账户名称',
    `bank_name` varchar(128) DEFAULT NULL COMMENT '银行名称',
    `bank_branch` varchar(256) DEFAULT NULL COMMENT '开户行',
    `initial_balance` decimal(18,2) DEFAULT 0.00 COMMENT '初始余额',
    `current_balance` decimal(18,2) DEFAULT 0.00 COMMENT '当前余额',
    `currency` varchar(16) DEFAULT 'CNY' COMMENT '币种',
    `sort` int DEFAULT 0 COMMENT '排序',
    `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
    `is_default` tinyint DEFAULT 0 COMMENT '是否默认: 0-否 1-是',
    `remark` varchar(512) DEFAULT NULL COMMENT '备注',
    `extra_config` json DEFAULT NULL COMMENT '扩展配置(JSON)',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_channel_code` (`channel_code`, `shop_id`, `deleted`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_shop_id` (`shop_id`),
    KEY `idx_channel_type` (`channel_type`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='渠道配置表';

-- ----------------------------
-- 9. 每日统计表
-- ----------------------------
DROP TABLE IF EXISTS `finance_daily_stat`;
CREATE TABLE `finance_daily_stat` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` bigint NOT NULL COMMENT '租户ID',
    `shop_id` bigint NOT NULL COMMENT '店铺ID',
    `stat_date` date NOT NULL COMMENT '统计日期',
    `stat_type` varchar(32) DEFAULT 'DAILY' COMMENT '统计类型: DAILY-日 WEEKLY-周 MONTHLY-月',
    -- 订单相关
    `order_count` int DEFAULT 0 COMMENT '订单数量',
    `order_amount` decimal(18,2) DEFAULT 0.00 COMMENT '订单金额',
    `paid_order_count` int DEFAULT 0 COMMENT '已支付订单数',
    `paid_amount` decimal(18,2) DEFAULT 0.00 COMMENT '已支付金额',
    `refund_count` int DEFAULT 0 COMMENT '退款订单数',
    `refund_amount` decimal(18,2) DEFAULT 0.00 COMMENT '退款金额',
    -- 收入相关
    `total_income` decimal(18,2) DEFAULT 0.00 COMMENT '总收入',
    `product_income` decimal(18,2) DEFAULT 0.00 COMMENT '商品收入',
    `service_income` decimal(18,2) DEFAULT 0.00 COMMENT '服务收入',
    `other_income` decimal(18,2) DEFAULT 0.00 COMMENT '其他收入',
    -- 支出相关
    `total_expense` decimal(18,2) DEFAULT 0.00 COMMENT '总支出',
    `product_cost` decimal(18,2) DEFAULT 0.00 COMMENT '商品成本',
    `logistics_cost` decimal(18,2) DEFAULT 0.00 COMMENT '物流成本',
    `platform_fee` decimal(18,2) DEFAULT 0.00 COMMENT '平台费用',
    `promotion_cost` decimal(18,2) DEFAULT 0.00 COMMENT '推广费用',
    `other_expense` decimal(18,2) DEFAULT 0.00 COMMENT '其他支出',
    -- 利润相关
    `gross_profit` decimal(18,2) DEFAULT 0.00 COMMENT '毛利润',
    `gross_profit_rate` decimal(8,4) DEFAULT 0.0000 COMMENT '毛利率',
    `net_profit` decimal(18,2) DEFAULT 0.00 COMMENT '净利润',
    `net_profit_rate` decimal(8,4) DEFAULT 0.0000 COMMENT '净利率',
    -- 客户相关
    `customer_count` int DEFAULT 0 COMMENT '客户数',
    `new_customer_count` int DEFAULT 0 COMMENT '新客户数',
    `repeat_customer_count` int DEFAULT 0 COMMENT '复购客户数',
    `avg_order_amount` decimal(18,2) DEFAULT 0.00 COMMENT '客单价',
    -- 商品相关
    `product_count` int DEFAULT 0 COMMENT '销售商品数',
    `sku_count` int DEFAULT 0 COMMENT '销售SKU数',
    -- 扩展数据
    `extra_data` json DEFAULT NULL COMMENT '扩展数据(JSON)',
    `stat_time` datetime DEFAULT NULL COMMENT '统计时间',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_shop_date_type` (`shop_id`, `stat_date`, `stat_type`, `deleted`),
    KEY `idx_tenant_id` (`tenant_id`),
    KEY `idx_shop_id` (`shop_id`),
    KEY `idx_stat_date` (`stat_date`),
    KEY `idx_stat_type` (`stat_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='每日统计表';

-- ----------------------------
-- 创建索引优化
-- ----------------------------

-- 为finance_orders表添加复合索引（如果不存在）
-- ALTER TABLE `finance_orders` ADD INDEX `idx_shop_order_time` (`shop_id`, `order_time`);
-- ALTER TABLE `finance_orders` ADD INDEX `idx_shop_status` (`shop_id`, `order_status`);

-- 为finance_cashflow表添加复合索引（如果不存在）
-- ALTER TABLE `finance_cashflow` ADD INDEX `idx_shop_trade_time` (`shop_id`, `trade_time`);
-- ALTER TABLE `finance_cashflow` ADD INDEX `idx_shop_check_status` (`shop_id`, `check_status`);

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- 初始化数据
-- =============================================

-- 插入默认预警规则
INSERT INTO `finance_alert_rule` (`tenant_id`, `rule_name`, `rule_code`, `rule_type`, `alert_type`, `alert_level`, `condition_config`, `threshold_value`, `check_interval`, `notify_channels`, `status`, `description`, `creator`) VALUES
(0, '库存不足预警', 'LOW_STOCK_ALERT', 'COUNT', 'LOW_STOCK', 'HIGH', '{"field":"stock_quantity","operator":"lt","value":10}', 10.0000, 60, 'SYSTEM,EMAIL', 1, '当商品库存低于阈值时触发预警', 'system'),
(0, '成本过高预警', 'HIGH_COST_ALERT', 'RATE', 'HIGH_COST', 'NORMAL', '{"field":"cost_rate","operator":"gt","value":0.8}', 0.8000, 120, 'SYSTEM', 1, '当商品成本率超过80%时触发预警', 'system'),
(0, '利润过低预警', 'LOW_PROFIT_ALERT', 'RATE', 'LOW_PROFIT', 'HIGH', '{"field":"profit_rate","operator":"lt","value":0.1}', 0.1000, 120, 'SYSTEM,EMAIL', 1, '当利润率低于10%时触发预警', 'system'),
(0, '同步失败预警', 'SYNC_FAIL_ALERT', 'COUNT', 'SYNC_FAIL', 'CRITICAL', '{"field":"fail_count","operator":"gt","value":3}', 3.0000, 30, 'SYSTEM,EMAIL,SMS', 1, '当同步连续失败超过3次时触发预警', 'system'),
(0, '对账差异预警', 'RECONCILIATION_DIFF_ALERT', 'AMOUNT', 'RECONCILIATION_DIFF', 'HIGH', '{"field":"diff_amount","operator":"gt","value":100}', 100.0000, 1440, 'SYSTEM,EMAIL', 1, '当对账差异金额超过100元时触发预警', 'system');

-- =============================================
-- 完成
-- =============================================
