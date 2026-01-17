-- =============================================
-- 数据同步模块菜单
-- =============================================

-- 数据同步目录
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6020, '数据同步', '', 1, 2, 6000, 'sync', 'ep:refresh', '', '', 0, b'1', b'1', b'1', 'admin', NOW(), 'admin', NOW(), b'0');

-- 同步任务管理
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6021, '同步任务', 'finance:sync:query', 2, 1, 6020, 'task', '', 'finance/sync/task/index', 'SyncTask', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6022, '同步任务创建', 'finance:sync:create', 3, 1, 6021, '', '', '', '', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0'),
(6023, '同步任务更新', 'finance:sync:update', 3, 2, 6021, '', '', '', '', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0'),
(6024, '同步任务删除', 'finance:sync:delete', 3, 3, 6021, '', '', '', '', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 同步日志管理
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6025, '同步日志', 'finance:sync:query', 2, 2, 6020, 'log', '', 'finance/sync/log/index', 'SyncLog', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 同步异常管理
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6026, '同步异常', 'finance:sync:query', 2, 3, 6020, 'exception', '', 'finance/sync/exception/index', 'SyncException', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');
