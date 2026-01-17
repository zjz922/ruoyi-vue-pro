-- =============================================
-- 数据同步模块菜单（更新版）
-- 使用ID范围 6080-6099
-- =============================================

-- 同步任务管理（挂在已存在的6020数据同步目录下）
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6081, '同步任务', 'finance:sync:query', 2, 1, 6020, 'task', '', 'finance/sync/task/index', 'SyncTask', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6082, '同步任务创建', 'finance:sync:create', 3, 1, 6081, '', '', '', '', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0'),
(6083, '同步任务更新', 'finance:sync:update', 3, 2, 6081, '', '', '', '', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0'),
(6084, '同步任务删除', 'finance:sync:delete', 3, 3, 6081, '', '', '', '', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 同步日志管理
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6085, '同步日志', 'finance:sync:query', 2, 2, 6020, 'log', '', 'finance/sync/log/index', 'SyncLog', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');

-- 同步异常管理
INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES
(6086, '同步异常', 'finance:sync:query', 2, 3, 6020, 'exception', '', 'finance/sync/exception/index', 'SyncException', 0, b'1', b'1', b'0', 'admin', NOW(), 'admin', NOW(), b'0');
