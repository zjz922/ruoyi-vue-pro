-- =============================================
-- 财务管理模块菜单权限SQL脚本 (修正版)
-- 适用于RuoYi-Vue-Pro框架
-- 创建时间: 2026-01-16
-- 菜单ID范围: 6000-6100 (避免与现有模块冲突)
-- =============================================

-- 删除已存在的财务菜单（如果需要重新初始化）
-- DELETE FROM system_menu WHERE id >= 6000 AND id < 6100;

-- =============================================
-- 一级菜单：财务管理
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6000, '财务管理', '', 1, 10, 0, '/finance', 'ep:money', NULL, NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：经营概览
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6001, '经营概览', '', 2, 1, 6000, 'dashboard', 'ep:data-analysis', 'finance/dashboard/index', 'FinanceDashboard', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 经营概览按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6011, '查看概览', 'finance:dashboard:query', 3, 1, 6001, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6012, '导出报表', 'finance:dashboard:export', 3, 2, 6001, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：订单管理
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6002, '订单管理', '', 2, 2, 6000, 'order', 'ep:document', 'finance/order/index', 'FinanceOrder', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 订单管理按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6021, '查询订单', 'finance:order:query', 3, 1, 6002, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6022, '同步订单', 'finance:order:sync', 3, 2, 6002, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6023, '导出订单', 'finance:order:export', 3, 3, 6002, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6024, '编辑成本', 'finance:order:update-cost', 3, 4, 6002, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6025, '批量成本', 'finance:order:batch-cost', 3, 5, 6002, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：资金流水
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6003, '资金流水', '', 2, 3, 6000, 'cashflow', 'ep:money', 'finance/cashflow/index', 'FinanceCashflow', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 资金流水按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6031, '查询流水', 'finance:cashflow:query', 3, 1, 6003, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6032, '同步流水', 'finance:cashflow:sync', 3, 2, 6003, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6033, '导出流水', 'finance:cashflow:export', 3, 3, 6003, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6034, '对账操作', 'finance:cashflow:reconcile', 3, 4, 6003, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6035, '批量对账', 'finance:cashflow:batch-reconcile', 3, 5, 6003, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：对账管理
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6004, '对账管理', '', 2, 4, 6000, 'reconciliation', 'ep:document-checked', 'finance/reconciliation/index', 'FinanceReconciliation', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 对账管理按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6041, '查询对账', 'finance:reconciliation:query', 3, 1, 6004, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6042, '新建对账', 'finance:reconciliation:create', 3, 2, 6004, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6043, '执行对账', 'finance:reconciliation:execute', 3, 3, 6004, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6044, '处理差异', 'finance:reconciliation:handle-diff', 3, 4, 6004, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6045, '删除对账', 'finance:reconciliation:delete', 3, 5, 6004, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：商品成本
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6005, '商品成本', '', 2, 5, 6000, 'productcost', 'ep:price-tag', 'finance/productcost/index', 'FinanceProductCost', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 商品成本按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6051, '查询成本', 'finance:productcost:query', 3, 1, 6005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6052, '新增成本', 'finance:productcost:create', 3, 2, 6005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6053, '编辑成本', 'finance:productcost:update', 3, 3, 6005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6054, '删除成本', 'finance:productcost:delete', 3, 4, 6005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6055, '批量更新', 'finance:productcost:batch-update', 3, 5, 6005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6056, '导入成本', 'finance:productcost:import', 3, 6, 6005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6057, '导出成本', 'finance:productcost:export', 3, 7, 6005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：预警管理
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6006, '预警管理', '', 2, 6, 6000, 'alert', 'ep:warning', 'finance/alert/index', 'FinanceAlert', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 预警管理按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6061, '查询规则', 'finance:alert:query-rule', 3, 1, 6006, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6062, '新增规则', 'finance:alert:create-rule', 3, 2, 6006, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6063, '编辑规则', 'finance:alert:update-rule', 3, 3, 6006, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6064, '删除规则', 'finance:alert:delete-rule', 3, 4, 6006, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6065, '查询记录', 'finance:alert:query-record', 3, 5, 6006, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6066, '处理预警', 'finance:alert:process', 3, 6, 6006, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：平台集成
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6007, '平台集成', '', 2, 7, 6000, 'integration', 'ep:connection', 'finance/integration/index', 'FinanceIntegration', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 平台集成按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6071, '查看配置', 'finance:integration:query', 3, 1, 6007, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6072, '保存配置', 'finance:integration:save', 3, 2, 6007, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6073, '测试连接', 'finance:integration:test', 3, 3, 6007, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6074, '同步数据', 'finance:integration:sync', 3, 4, 6007, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(6075, '查看日志', 'finance:integration:log', 3, 5, 6007, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 为超级管理员角色分配财务管理权限
-- =============================================
-- 注意：以下SQL假设超级管理员角色ID为1，请根据实际情况调整

-- 分配一级菜单权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 6000, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配二级菜单权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 6001, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6002, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6003, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6004, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6005, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6006, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6007, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（经营概览）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 6011, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6012, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（订单管理）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 6021, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6022, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6023, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6024, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6025, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（资金流水）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 6031, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6032, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6033, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6034, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6035, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（对账管理）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 6041, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6042, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6043, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6044, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6045, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（商品成本）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 6051, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6052, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6053, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6054, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6055, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6056, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6057, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（预警管理）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 6061, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6062, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6063, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6064, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6065, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6066, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（平台集成）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 6071, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6072, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6073, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6074, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 6075, 'admin', NOW(), 'admin', NOW(), b'0', 1);
