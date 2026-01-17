-- ============================================================
-- 财务报表模块菜单和权限配置
-- ============================================================

-- 删除旧菜单（如果存在）
DELETE FROM sys_menu WHERE name LIKE '财务报表%' OR name LIKE 'Report%';

-- ============================================================
-- 1. 菜单配置
-- ============================================================

-- 财务管理菜单（顶级菜单）
INSERT INTO sys_menu (id, name, permission, type, sort, path, icon, component, visible, status, remark, create_time)
VALUES (
  1001,
  '财务管理',
  'finance:*:*',
  1,
  1,
  'finance',
  'money',
  NULL,
  1,
  0,
  '财务管理模块',
  NOW()
);

-- 财务报表菜单（子菜单）
INSERT INTO sys_menu (id, name, permission, type, sort, path, icon, component, visible, status, remark, create_time)
VALUES (
  1002,
  '财务报表',
  'finance:report:*',
  1,
  5,
  'report',
  'chart',
  'finance/report/index',
  1,
  0,
  '财务报表功能',
  NOW()
);

-- 日报表菜单
INSERT INTO sys_menu (id, name, permission, type, sort, path, icon, component, visible, status, remark, create_time)
VALUES (
  1003,
  '日报表',
  'finance:report:daily',
  1,
  1,
  'daily',
  'calendar',
  'finance/report/daily',
  1,
  0,
  '日报表查看',
  NOW()
);

-- 周报表菜单
INSERT INTO sys_menu (id, name, permission, type, sort, path, icon, component, visible, status, remark, create_time)
VALUES (
  1004,
  '周报表',
  'finance:report:weekly',
  1,
  2,
  'weekly',
  'document-copy',
  'finance/report/weekly',
  1,
  0,
  '周报表查看',
  NOW()
);

-- 月报表菜单
INSERT INTO sys_menu (id, name, permission, type, sort, path, icon, component, visible, status, remark, create_time)
VALUES (
  1005,
  '月报表',
  'finance:report:monthly',
  1,
  3,
  'monthly',
  'document',
  'finance/report/monthly',
  1,
  0,
  '月报表查看',
  NOW()
);

-- 毛利分析菜单
INSERT INTO sys_menu (id, name, permission, type, sort, path, icon, component, visible, status, remark, create_time)
VALUES (
  1006,
  '毛利分析',
  'finance:report:profit',
  1,
  4,
  'profitanalysis',
  'trend-charts',
  'finance/report/profitanalysis',
  1,
  0,
  '毛利分析',
  NOW()
);

-- ============================================================
-- 2. 权限配置
-- ============================================================

-- 查看财务报表权限
INSERT INTO sys_permission (id, name, permission, description, create_time)
VALUES (
  2001,
  '查看财务报表',
  'finance:report:query',
  '查看财务报表数据',
  NOW()
);

-- 导出财务报表权限
INSERT INTO sys_permission (id, name, permission, description, create_time)
VALUES (
  2002,
  '导出财务报表',
  'finance:report:export',
  '导出财务报表数据',
  NOW()
);

-- 生成自定义报表权限
INSERT INTO sys_permission (id, name, permission, description, create_time)
VALUES (
  2003,
  '生成自定义报表',
  'finance:report:custom',
  '生成自定义财务报表',
  NOW()
);

-- 保存报表模板权限
INSERT INTO sys_permission (id, name, permission, description, create_time)
VALUES (
  2004,
  '保存报表模板',
  'finance:report:template',
  '保存和管理报表模板',
  NOW()
);

-- ============================================================
-- 3. 角色权限配置
-- ============================================================

-- 为管理员角色添加财务报表权限
INSERT INTO sys_role_permission (role_id, permission_id, create_time)
VALUES (
  1,  -- 管理员角色ID
  2001,
  NOW()
);

INSERT INTO sys_role_permission (role_id, permission_id, create_time)
VALUES (
  1,
  2002,
  NOW()
);

INSERT INTO sys_role_permission (role_id, permission_id, create_time)
VALUES (
  1,
  2003,
  NOW()
);

INSERT INTO sys_role_permission (role_id, permission_id, create_time)
VALUES (
  1,
  2004,
  NOW()
);

-- 为财务人员角色添加财务报表权限（如果存在）
-- INSERT INTO sys_role_permission (role_id, permission_id, create_time)
-- VALUES (
--   3,  -- 财务人员角色ID
--   2001,
--   NOW()
-- );

-- ============================================================
-- 4. 按钮权限配置
-- ============================================================

-- 查看按钮
INSERT INTO sys_menu (id, name, permission, type, sort, path, icon, component, visible, status, remark, create_time)
VALUES (
  1101,
  '查看',
  'finance:report:query',
  2,
  1,
  NULL,
  NULL,
  NULL,
  1,
  0,
  '查看财务报表',
  NOW()
);

-- 导出按钮
INSERT INTO sys_menu (id, name, permission, type, sort, path, icon, component, visible, status, remark, create_time)
VALUES (
  1102,
  '导出',
  'finance:report:export',
  2,
  2,
  NULL,
  NULL,
  NULL,
  1,
  0,
  '导出财务报表',
  NOW()
);

-- 刷新按钮
INSERT INTO sys_menu (id, name, permission, type, sort, path, icon, component, visible, status, remark, create_time)
VALUES (
  1103,
  '刷新',
  'finance:report:query',
  2,
  3,
  NULL,
  NULL,
  NULL,
  1,
  0,
  '刷新财务报表数据',
  NOW()
);

-- 自定义报表按钮
INSERT INTO sys_menu (id, name, permission, type, sort, path, icon, component, visible, status, remark, create_time)
VALUES (
  1104,
  '自定义报表',
  'finance:report:custom',
  2,
  4,
  NULL,
  NULL,
  NULL,
  1,
  0,
  '生成自定义财务报表',
  NOW()
);

-- ============================================================
-- 5. 数据权限配置
-- ============================================================

-- 财务报表数据权限（仅查看自己店铺的数据）
-- 这通常在Service层通过@DataPermission注解处理
-- 或在SQL查询时添加WHERE tenant_id = ? AND shop_id IN (...)条件

-- ============================================================
-- 6. 菜单国际化配置
-- ============================================================

-- 中文菜单标签
INSERT INTO sys_dict_data (dict_type, dict_label, dict_value, dict_sort, status, remark, create_time)
VALUES (
  'finance_menu',
  '财务管理',
  'finance',
  1,
  0,
  '财务管理菜单',
  NOW()
);

INSERT INTO sys_dict_data (dict_type, dict_label, dict_value, dict_sort, status, remark, create_time)
VALUES (
  'finance_menu',
  '财务报表',
  'report',
  2,
  0,
  '财务报表菜单',
  NOW()
);

INSERT INTO sys_dict_data (dict_type, dict_label, dict_value, dict_sort, status, remark, create_time)
VALUES (
  'report_type',
  '日报表',
  'daily',
  1,
  0,
  '日报表类型',
  NOW()
);

INSERT INTO sys_dict_data (dict_type, dict_label, dict_value, dict_sort, status, remark, create_time)
VALUES (
  'report_type',
  '周报表',
  'weekly',
  2,
  0,
  '周报表类型',
  NOW()
);

INSERT INTO sys_dict_data (dict_type, dict_label, dict_value, dict_sort, status, remark, create_time)
VALUES (
  'report_type',
  '月报表',
  'monthly',
  3,
  0,
  '月报表类型',
  NOW()
);

INSERT INTO sys_dict_data (dict_type, dict_label, dict_value, dict_sort, status, remark, create_time)
VALUES (
  'report_type',
  '毛利分析',
  'profit',
  4,
  0,
  '毛利分析报表',
  NOW()
);

-- ============================================================
-- 7. 操作日志配置
-- ============================================================

-- 财务报表查看操作日志
INSERT INTO sys_oper_log (title, business_type, method, request_method, operator_type, oper_name, dept_name, oper_url, oper_ip, oper_location, oper_param, json_result, status, error_msg, oper_time)
VALUES (
  '查看财务报表',
  1,
  'cn.iocoder.flash.module.finance.controller.admin.report.ReportController.getReportPage',
  'GET',
  1,
  'admin',
  '管理部门',
  '/finance/report/page',
  '127.0.0.1',
  '本地',
  '{}',
  '{}',
  0,
  '',
  NOW()
);

-- ============================================================
-- 8. 审计日志配置
-- ============================================================

-- 财务报表数据访问审计
-- 这通常在Service层通过AOP或拦截器处理

-- ============================================================
-- 9. 缓存配置
-- ============================================================

-- 财务报表缓存配置
-- 缓存键: finance:report:{shopId}:{reportType}:{startDate}:{endDate}
-- 缓存时间: 1小时 (3600秒)

-- ============================================================
-- 10. 系统参数配置
-- ============================================================

-- 财务报表默认展示天数
INSERT INTO sys_config (config_name, config_key, config_value, config_type, remark, create_time)
VALUES (
  '财务报表默认展示天数',
  'finance.report.default.days',
  '30',
  'N',
  '财务报表默认展示的天数',
  NOW()
);

-- 财务报表导出最大条数
INSERT INTO sys_config (config_name, config_key, config_value, config_type, remark, create_time)
VALUES (
  '财务报表导出最大条数',
  'finance.report.export.max.rows',
  '10000',
  'N',
  '财务报表导出的最大条数限制',
  NOW()
);

-- 财务报表预警阈值
INSERT INTO sys_config (config_name, config_key, config_value, config_type, remark, create_time)
VALUES (
  '财务报表预警阈值',
  'finance.report.alert.threshold',
  '0.2',
  'N',
  '财务报表预警的阈值（如毛利率低于此值则预警）',
  NOW()
);

-- ============================================================
-- 11. 通知模板配置
-- ============================================================

-- 财务报表生成完成通知
INSERT INTO sys_notice_template (template_code, template_name, template_content, template_type, status, remark, create_time)
VALUES (
  'FINANCE_REPORT_GENERATED',
  '财务报表生成完成',
  '您的财务报表已生成完成，请登录系统查看。',
  'email',
  0,
  '财务报表生成完成通知',
  NOW()
);

-- ============================================================
-- 12. 数据备份配置
-- ============================================================

-- 财务报表数据备份计划
-- 每天凌晨2点执行一次备份
INSERT INTO sys_job (job_name, job_group, invoke_target, cron_expression, status, remark, create_time)
VALUES (
  '财务报表数据备份',
  'finance',
  'financeReportService.backupReportData()',
  '0 0 2 * * ?',
  0,
  '每天凌晨2点备份财务报表数据',
  NOW()
);

-- ============================================================
-- 完成
-- ============================================================
-- 财务报表菜单和权限配置完成
-- 请根据实际情况调整角色ID和权限配置
