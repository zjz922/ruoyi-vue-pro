-- =============================================
-- 经营分析模块菜单
-- 使用ID范围 6300-6320
-- =============================================

-- 经营分析目录
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6300, '经营分析', '', 1, 5, 6000, 'analysis', 'ep:data-analysis', '', '', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 运营仪表盘
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6301, '运营仪表盘', 'finance:analysis:query', 2, 1, 6300, 'dashboard', '', 'finance/analysis/dashboard', 'AnalysisDashboard', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 租户活跃度分析
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6302, '租户活跃度', 'finance:analysis:query', 2, 2, 6300, 'tenant', '', 'finance/analysis/tenant', 'TenantAnalysis', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 收入分析
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6303, '收入分析', 'finance:analysis:query', 2, 3, 6300, 'revenue', '', 'finance/analysis/revenue', 'RevenueAnalysis', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 趋势分析
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6304, '趋势分析', 'finance:analysis:query', 2, 4, 6300, 'trend', '', 'finance/analysis/trend', 'TrendAnalysis', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');
