-- =============================================
-- 财务管理模块菜单权限SQL脚本
-- 适用于RuoYi-Vue-Pro框架
-- 创建时间: 2026-01-16
-- =============================================

-- 删除已存在的财务菜单（如果需要重新初始化）
-- DELETE FROM system_menu WHERE id >= 2000 AND id < 2100;

-- =============================================
-- 一级菜单：财务管理
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2000, '财务管理', '', 1, 10, 0, '/finance', 'ep:money', NULL, NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：经营概览
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2001, '经营概览', '', 2, 1, 2000, 'dashboard', 'ep:data-analysis', 'finance/dashboard/index', 'FinanceDashboard', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 经营概览按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2011, '查看概览', 'finance:dashboard:query', 3, 1, 2001, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2012, '导出报表', 'finance:dashboard:export', 3, 2, 2001, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：订单管理
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2002, '订单管理', '', 2, 2, 2000, 'order', 'ep:document', 'finance/order/index', 'FinanceOrder', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 订单管理按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2021, '查询订单', 'finance:order:query', 3, 1, 2002, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2022, '同步订单', 'finance:order:sync', 3, 2, 2002, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2023, '导出订单', 'finance:order:export', 3, 3, 2002, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2024, '编辑成本', 'finance:order:update-cost', 3, 4, 2002, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2025, '批量成本', 'finance:order:batch-cost', 3, 5, 2002, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：资金流水
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2003, '资金流水', '', 2, 3, 2000, 'cashflow', 'ep:money', 'finance/cashflow/index', 'FinanceCashflow', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 资金流水按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2031, '查询流水', 'finance:cashflow:query', 3, 1, 2003, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2032, '同步流水', 'finance:cashflow:sync', 3, 2, 2003, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2033, '导出流水', 'finance:cashflow:export', 3, 3, 2003, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2034, '对账操作', 'finance:cashflow:reconcile', 3, 4, 2003, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2035, '批量对账', 'finance:cashflow:batch-reconcile', 3, 5, 2003, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：对账管理
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2004, '对账管理', '', 2, 4, 2000, 'reconciliation', 'ep:document-checked', 'finance/reconciliation/index', 'FinanceReconciliation', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 对账管理按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2041, '查询对账', 'finance:reconciliation:query', 3, 1, 2004, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2042, '新建对账', 'finance:reconciliation:create', 3, 2, 2004, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2043, '执行对账', 'finance:reconciliation:execute', 3, 3, 2004, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2044, '处理差异', 'finance:reconciliation:handle-diff', 3, 4, 2004, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2045, '删除对账', 'finance:reconciliation:delete', 3, 5, 2004, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：商品成本
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2005, '商品成本', '', 2, 5, 2000, 'productcost', 'ep:price-tag', 'finance/productcost/index', 'FinanceProductCost', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 商品成本按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2051, '查询成本', 'finance:productcost:query', 3, 1, 2005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2052, '新增成本', 'finance:productcost:create', 3, 2, 2005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2053, '编辑成本', 'finance:productcost:update', 3, 3, 2005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2054, '删除成本', 'finance:productcost:delete', 3, 4, 2005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2055, '批量更新', 'finance:productcost:batch-update', 3, 5, 2005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2056, '导入成本', 'finance:productcost:import', 3, 6, 2005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2057, '导出成本', 'finance:productcost:export', 3, 7, 2005, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：预警管理
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2006, '预警管理', '', 2, 6, 2000, 'alert', 'ep:warning', 'finance/alert/index', 'FinanceAlert', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 预警管理按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2061, '查询规则', 'finance:alert:query-rule', 3, 1, 2006, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2062, '新增规则', 'finance:alert:create-rule', 3, 2, 2006, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2063, '编辑规则', 'finance:alert:update-rule', 3, 3, 2006, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2064, '删除规则', 'finance:alert:delete-rule', 3, 4, 2006, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2065, '查询记录', 'finance:alert:query-record', 3, 5, 2006, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2066, '处理预警', 'finance:alert:process', 3, 6, 2006, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 二级菜单：平台集成
-- =============================================
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2007, '平台集成', '', 2, 7, 2000, 'integration', 'ep:connection', 'finance/integration/index', 'FinanceIntegration', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 平台集成按钮权限
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(2071, '查看配置', 'finance:integration:query', 3, 1, 2007, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2072, '保存配置', 'finance:integration:save', 3, 2, 2007, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2073, '测试连接', 'finance:integration:test', 3, 3, 2007, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2074, '同步数据', 'finance:integration:sync', 3, 4, 2007, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0'),
(2075, '查看日志', 'finance:integration:log', 3, 5, 2007, '', '', '', NULL, 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- =============================================
-- 为超级管理员角色分配财务管理权限
-- =============================================
-- 注意：以下SQL假设超级管理员角色ID为1，请根据实际情况调整

-- 分配一级菜单权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 2000, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配二级菜单权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 2001, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2002, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2003, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2004, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2005, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2006, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2007, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（经营概览）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 2011, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2012, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（订单管理）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 2021, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2022, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2023, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2024, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2025, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（资金流水）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 2031, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2032, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2033, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2034, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2035, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（对账管理）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 2041, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2042, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2043, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2044, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2045, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（商品成本）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 2051, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2052, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2053, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2054, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2055, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2056, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2057, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（预警管理）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 2061, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2062, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2063, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2064, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2065, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2066, 'admin', NOW(), 'admin', NOW(), b'0', 1);

-- 分配按钮权限（平台集成）
INSERT INTO `system_role_menu` (`role_id`, `menu_id`, `creator`, `create_time`, `updater`, `update_time`, `deleted`, `tenant_id`) VALUES
(1, 2071, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2072, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2073, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2074, 'admin', NOW(), 'admin', NOW(), b'0', 1),
(1, 2075, 'admin', NOW(), 'admin', NOW(), b'0', 1);
