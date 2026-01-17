-- ========================================
-- 抖店授权管理菜单
-- ========================================

-- 检查父菜单是否存在，如果不存在则创建平台集成菜单
INSERT IGNORE INTO system_menu (id, name, permission, type, sort, parent_id, path, icon, component, component_name, status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted)
VALUES (3010, '平台集成', '', 1, 10, 3000, 'platform', 'ep:connection', '', '', 0, 1, 1, 1, 'admin', NOW(), 'admin', NOW(), 0);

-- 添加抖店授权管理菜单
INSERT IGNORE INTO system_menu (id, name, permission, type, sort, parent_id, path, icon, component, component_name, status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted)
VALUES (3011, '抖店授权', 'finance:doudian:auth', 2, 1, 3010, 'doudian-auth', 'ep:shop', 'finance/platform/doudian-auth', 'DoudianAuth', 0, 1, 1, 1, 'admin', NOW(), 'admin', NOW(), 0);

-- 添加抖店授权相关按钮权限
INSERT IGNORE INTO system_menu (id, name, permission, type, sort, parent_id, path, icon, component, component_name, status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted)
VALUES (301101, '获取授权URL', 'finance:doudian:oauth:authorize', 3, 1, 3011, '', '', '', '', 0, 1, 1, 1, 'admin', NOW(), 'admin', NOW(), 0);

INSERT IGNORE INTO system_menu (id, name, permission, type, sort, parent_id, path, icon, component, component_name, status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted)
VALUES (301102, '查看授权状态', 'finance:doudian:oauth:status', 3, 2, 3011, '', '', '', '', 0, 1, 1, 1, 'admin', NOW(), 'admin', NOW(), 0);

INSERT IGNORE INTO system_menu (id, name, permission, type, sort, parent_id, path, icon, component, component_name, status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted)
VALUES (301103, '换取Token', 'finance:doudian:oauth:exchange', 3, 3, 3011, '', '', '', '', 0, 1, 1, 1, 'admin', NOW(), 'admin', NOW(), 0);

INSERT IGNORE INTO system_menu (id, name, permission, type, sort, parent_id, path, icon, component, component_name, status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted)
VALUES (301104, '刷新Token', 'finance:doudian:oauth:refresh', 3, 4, 3011, '', '', '', '', 0, 1, 1, 1, 'admin', NOW(), 'admin', NOW(), 0);

INSERT IGNORE INTO system_menu (id, name, permission, type, sort, parent_id, path, icon, component, component_name, status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted)
VALUES (301105, '撤销授权', 'finance:doudian:oauth:revoke', 3, 5, 3011, '', '', '', '', 0, 1, 1, 1, 'admin', NOW(), 'admin', NOW(), 0);
