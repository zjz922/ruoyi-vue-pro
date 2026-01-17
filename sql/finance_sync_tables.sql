-- =============================================
-- 数据同步模块表结构
-- =============================================

-- 同步任务表
CREATE TABLE IF NOT EXISTS `finance_sync_task` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '任务编号',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  `task_name` varchar(100) NOT NULL COMMENT '任务名称',
  `platform_type` tinyint NOT NULL COMMENT '平台类型：1-抖店 2-千川 3-聚水潭',
  `task_type` tinyint NOT NULL COMMENT '任务类型：1-抖店订单 2-抖店结算 3-千川消耗 4-聚水潭库存',
  `config_id` bigint NOT NULL COMMENT '关联配置ID',
  `cron_expression` varchar(50) NOT NULL COMMENT 'Cron表达式',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：0-停用 1-启用',
  `last_execute_time` datetime DEFAULT NULL COMMENT '上次执行时间',
  `last_execute_result` tinyint DEFAULT NULL COMMENT '上次执行结果：0-失败 1-成功',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_platform_type` (`platform_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='同步任务表';

-- 同步日志表
CREATE TABLE IF NOT EXISTS `finance_sync_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志编号',
  `task_id` bigint NOT NULL COMMENT '任务编号',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  `platform_type` tinyint NOT NULL COMMENT '平台类型：1-抖店 2-千川 3-聚水潭',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `duration` bigint DEFAULT NULL COMMENT '执行耗时(ms)',
  `result` tinyint NOT NULL DEFAULT 0 COMMENT '执行结果：0-失败 1-成功',
  `sync_count` int DEFAULT 0 COMMENT '同步条数',
  `success_count` int DEFAULT 0 COMMENT '成功条数',
  `fail_count` int DEFAULT 0 COMMENT '失败条数',
  `error_message` text COMMENT '错误信息',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_task_id` (`task_id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_platform_type` (`platform_type`),
  KEY `idx_start_time` (`start_time`),
  KEY `idx_result` (`result`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='同步日志表';

-- 同步异常表
CREATE TABLE IF NOT EXISTS `finance_sync_exception` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '异常编号',
  `task_id` bigint NOT NULL COMMENT '任务编号',
  `log_id` bigint DEFAULT NULL COMMENT '日志编号',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  `platform_type` tinyint NOT NULL COMMENT '平台类型：1-抖店 2-千川 3-聚水潭',
  `exception_type` tinyint NOT NULL COMMENT '异常类型：1-数据格式错误 2-网络超时 3-API限流 4-数据冲突 5-其他',
  `exception_message` text COMMENT '异常信息',
  `exception_data` text COMMENT '异常数据(JSON)',
  `handle_status` tinyint NOT NULL DEFAULT 0 COMMENT '处理状态：0-待处理 1-已重试 2-已忽略 3-已解决',
  `retry_count` int NOT NULL DEFAULT 0 COMMENT '重试次数',
  `last_retry_time` datetime DEFAULT NULL COMMENT '最后重试时间',
  `handle_remark` varchar(500) DEFAULT NULL COMMENT '处理备注',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_task_id` (`task_id`),
  KEY `idx_log_id` (`log_id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_platform_type` (`platform_type`),
  KEY `idx_handle_status` (`handle_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='同步异常表';
