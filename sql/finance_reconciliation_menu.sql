-- =============================================
-- 数据对账模块菜单
-- 使用ID范围 6200-6220
-- =============================================

-- 数据对账目录
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6200, '数据对账', '', 1, 4, 6000, 'reconciliation', 'ep:document-checked', '', '', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 对账总览
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6201, '对账总览', 'finance:reconciliation:query', 2, 1, 6200, 'index', '', 'finance/reconciliation/index', 'ReconciliationIndex', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 差异列表
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6202, '差异列表', 'finance:reconciliation:query', 2, 2, 6200, 'diff', '', 'finance/reconciliation/diff', 'ReconciliationDiff', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 异常监控
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6203, '异常监控', 'finance:reconciliation:query', 2, 3, 6200, 'exception', '', 'finance/reconciliation/exception', 'ReconciliationException', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');
