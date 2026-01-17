-- =============================================
-- 财务报表模块菜单
-- 使用ID范围 6100-6120
-- =============================================

-- 财务报表目录
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6100, '财务报表', '', 1, 3, 6000, 'report', 'ep:document', '', '', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 报表总览
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6101, '报表总览', 'finance:report:query', 2, 1, 6100, 'index', '', 'finance/report/index', 'ReportIndex', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 日报表
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6102, '日报表', 'finance:report:query', 2, 2, 6100, 'daily', '', 'finance/report/daily', 'ReportDaily', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 月报表
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6103, '月报表', 'finance:report:query', 2, 3, 6100, 'monthly', '', 'finance/report/monthly', 'ReportMonthly', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 租户报表
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6104, '租户报表', 'finance:report:query', 2, 4, 6100, 'tenant', '', 'finance/report/tenant', 'ReportTenant', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 报表导出
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6105, '报表导出', 'finance:report:export', 2, 5, 6100, 'export', '', 'finance/report/export', 'ReportExport', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');
