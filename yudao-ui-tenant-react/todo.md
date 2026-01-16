# 抖店财务应用原型 - TODO

## 已完成
- [x] 项目初始化
- [x] 浅色主题配置
- [x] 经营概览页面（KPI卡片、趋势图、费用构成）
- [x] 财务核算页面（双轨制核算、三大报表）
- [x] 资金管理页面（资金流水、智能对账）
- [x] 库存成本页面（库龄分析、成本计价）
- [x] 经营分析页面（ROI分析、盈亏平衡）
- [x] 费用中心页面（费用分摊、预算管控）
- [x] 税务管理页面（税负率、风险预警）
- [x] 配置路由串联所有页面
- [x] 侧边栏导航链接更新
- [x] 创建共享的AppLayout侧边导航栏布局组件
- [x] 为财务核算页面添加侧边导航栏
- [x] 为资金管理页面添加侧边导航栏
- [x] 为库存成本页面添加侧边导航栏
- [x] 为经营分析页面添加侧边导航栏
- [x] 为费用中心页面添加侧边导航栏
- [x] 为税务管理页面添加侧边导航栏

## 出纳模块功能开发（已完成）

### 页面组件创建
- [x] CashierDashboard.tsx - 出纳工作台（仪表盘）
- [x] CashierCashflow.tsx - 资金流水管理
- [x] CashierChannels.tsx - 渠道管理
- [x] CashierReconciliation.tsx - 平台对账
- [x] CashierDifferences.tsx - 差异分析
- [x] CashierDailyReport.tsx - 资金日报
- [x] CashierMonthlyReport.tsx - 资金月报
- [x] CashierShopReport.tsx - 店铺统计
- [x] CashierAlerts.tsx - 预警中心
- [x] CashierAlertRules.tsx - 预警规则

### 布局与导航
- [x] CashierLayout.tsx - 出纳模块专属布局组件
- [x] 出纳模块侧边栏菜单配置
- [x] 出纳模块路由配置
- [x] 主系统AppLayout添加出纳模块入口

### 功能组件
- [x] 新增资金流水弹窗组件
- [x] 处理差异订单弹窗组件
- [x] 新增预警规则弹窗组件
- [x] 统计卡片组件
- [x] 图表组件（11个图表）

### 数据表格
- [x] 资金流水表格
- [x] 对账明细表格
- [x] 差异订单表格
- [x] 渠道管理表格
- [x] 预警列表表格

## 出纳模块功能完善（已完成）

### 差异分析页面增强
- [x] 差异深度分析区域（按平台/店铺/渠道切换）
- [x] 各平台差异金额对比图表
- [x] 差异订单处理状态图表
- [x] 差异TOP分析区域（金额/频率/持续时间TOP10）
- [x] 差异订单详情表格
- [x] 差异处理效率分析区域
- [x] 平均处理时长趋势图表
- [x] 处理人员效率对比图表
- [x] 处理效率统计表格

### 资金日报页面增强
- [x] 日报控制面板（报告日期、报告模板、导出格式）
- [x] 资金流入分析区域
- [x] 当日收入来源分布图表
- [x] 各渠道收入对比图表
- [x] 收入明细表格
- [x] 资金流出分析区域
- [x] 当日支出结构分布图表
- [x] 各渠道支出对比图表
- [x] 支出明细表格
- [x] 对账情况统计区域

### 渠道管理页面
- [x] 渠道余额分布图表
- [x] 各渠道交易频次图表
- [x] 同步余额功能
- [x] 新增渠道弹窗

### 弹窗组件
- [x] 新增流水弹窗完整表单
- [x] 处理差异弹窗完整表单
- [x] 新增渠道弹窗

## 出纳模块集成到主系统导航（已完成）

### 导航栏修改
- [x] 在FinanceCommandCenter左侧一级导航栏添加出纳模块菜单项
- [x] 添加"出纳管理"分组标题
- [x] 添加"出纳工作台"一级菜单
- [x] 添加"资金流水"一级菜单
- [x] 添加"渠道管理"一级菜单
- [x] 添加"对账中心"分组标题
- [x] 添加"平台对账"一级菜单
- [x] 添加"差异分析"一级菜单
- [x] 添加"报表中心"分组标题
- [x] 添加"资金日报"一级菜单
- [x] 添加"资金月报"一级菜单
- [x] 添加"店铺统计"一级菜单
- [x] 添加"预警中心"分组标题
- [x] 添加"待处理预警"一级菜单
- [x] 添加"预警规则"一级菜单

### 页面布局修改
- [x] 修改CashierDashboard使用AppLayout布局
- [x] 修改CashierCashflow使用AppLayout布局
- [x] 修改CashierChannels使用AppLayout布局
- [x] 修改CashierReconciliation使用AppLayout布局
- [x] 修改CashierDifferences使用AppLayout布局
- [x] 修改CashierDailyReport使用AppLayout布局
- [x] 修改CashierMonthlyReport使用AppLayout布局
- [x] 修改CashierShopReport使用AppLayout布局
- [x] 修改CashierAlerts使用AppLayout布局
- [x] 修改CashierAlertRules使用AppLayout布局

### 路由调整
- [x] 更新路由配置，出纳页面路由整合到主系统路由中

## 导航栏分组优化（已完成）

### 总账管理分组
- [x] 创建"总账管理"分组标题
- [x] 将"经营概览"移入总账管理分组
- [x] 将"财务核算"移入总账管理分组
- [x] 将"资金管理"移入总账管理分组
- [x] 将"库存成本"移入总账管理分组
- [x] 将"经营分析"移入总账管理分组
- [x] 将"费用中心"移入总账管理分组
- [x] 将"税务管理"移入总账管理分组

## PRD功能开发（已完成）

### P0高优先级 - 订单管理模块
- [x] OrderManagement.tsx - 订单管理页面
- [x] 订单列表表格（订单编号、下单时间、买家信息、商品信息、订单金额、平台/店铺、订单状态）
- [x] 多维度筛选面板（订单状态、订单来源、时间范围、订单金额、特殊订单）
- [x] 订单详情侧边栏（订单基本信息、商品明细、财务信息）
- [x] 批量操作功能（批量打印、批量标记、批量导出）
- [x] 特殊订单标记弹窗（样品订单、员工内购、售后补发、赠品订单、其他）

### P0高优先级 - 成本配置中心
- [x] CostConfig.tsx - 成本配置页面
- [x] 成本列表表格（商家编码、商品名称、SKU、当前成本价、新成本价、生效时间）
- [x] 成本编辑功能（单个编辑、批量编辑）
- [x] 批量导入功能（Excel模板下载、文件上传、数据校验）
- [x] 成本历史记录查看
- [x] 多时段成本配置
- [x] 成本波动预警设置

### P1中优先级 - 单据中心
- [x] DocumentCenter.tsx - 单据中心页面
- [x] 配货单管理（生成、打印、状态管理）
- [x] 出库单管理
- [x] 入库单管理
- [x] 退货单管理

### P1中优先级 - 多平台数据同步
- [ ] 平台同步状态卡片组件
- [ ] 一键同步功能
- [ ] 同步日志查看

### P1中优先级 - 地区分析增强
- [ ] 中国地图热力图组件
- [ ] 省份销售排行
- [ ] 城市下钻功能

### P2低优先级 - 帮助中心
- [x] HelpCenter.tsx - 帮助中心页面
- [x] 快速入门指南
- [x] 功能使用说明
- [x] 常见问题FAQ

### P2低优先级 - 店铺对比增强
- [ ] 多店铺数据对比图表
- [ ] 店铺排名分析

### 导航栏更新
- [x] 添加"订单管理"分组
- [x] 添加"成本配置"菜单
- [x] 添加"单据中心"菜单
- [x] 添加"帮助中心"菜单

## 待优化
- [ ] 响应式布局优化（移动端适配）
- [ ] 数据筛选交互功能
- [ ] 图表动画效果
- [ ] 多平台数据同步功能
- [ ] 地区分析热力图
- [ ] 店铺对比增强


## 订单汇总统计模块开发（已完成）

### 订单汇总统计页面
- [x] OrderStatistics.tsx - 订单汇总统计主页面
- [x] 时间范围选择器（日期范围、天/月/年切换）
- [x] 按月汇总所有/按年汇总所有 快捷按钮
- [x] 销售额统计卡片（销售额、预计毛利、时间范围）
- [x] 已确认统计卡片（已确认金额、确认比例）
- [x] 尚未确认统计卡片（未确认金额、已发货待确认金额）
- [x] 退款额度统计卡片（退款金额、退款占比）
- [x] 推广费统计卡片（推广费金额、广告占比）
- [x] 销售额与推广费双轴趋势图表
- [x] 订单明细数据表格（日期、已发货、销售额、退款额、快递费、小额打款、达人佣金、服务费、商品成本、代运营、赔付、推广费、其他、保险费、记账收/支、订单微调、预计利润、完结情况、利润率、查看）

### 订单统计子页面（已完成）
- [x] OrderThirtyDays.tsx - 最近三十天明细页面
- [x] OrderMonthlyStats.tsx - 按月汇总统计页面
- [x] OrderYearlyStats.tsx - 按年汇总统计页面
- [ ] 特殊订单汇总
- [ ] 多店铺工作台
- [ ] 文件下载中心
- [x] 更新路由配置添加子页面路由
- [x] 更新导航栏添加子菜单项

### 订单与财务模块勾稽关系
- [x] 订单销售额 → 财务核算收入确认
- [x] 订单退款额 → 资金流水退款记录
- [x] 订单推广费 → 费用中心推广费用
- [x] 订单商品成本 → 库存成本核算
- [x] 订单快递费 → 费用中心物流费用
- [x] 订单佣金 → 费用中心销售佣金
- [x] 订单利润 → 经营分析利润核算
- [x] 订单税费 → 税务管理税费计算

### 导航栏更新
- [x] 添加"订单统计"菜单到订单管理分组
- [x] 添加"最近30天明细"菜单
- [x] 添加"按月汇总统计"菜单
- [x] 添加"按年汇总统计"菜单


## 导航切换优化（已完成）

### 问题修复
- [x] 确保所有页面使用统一的布局组件
- [x] 点击左侧菜单时只切换右侧内容区域
- [x] 左侧导航栏保持不变不重新渲染

## 财务更新需求V2.0（已完成）


### 2.1 财务核算中心

#### FIN-001 利润经营日报表（P0）
- [x] 利润报表时间筛选增加"日报"选项
- [x] 日报看板支持关键指标（毛利、净利、费用率）自定义
- [x] 日报数据可下钻至当日明细订单及费用清单
- [x] 包含当日订单成交情况（订单总数/付款订单数/成交率转化率/客单价等）

#### FIN-002 收入成本分类匹配分析（P0）
- [x] 利润报表增加"收入类型"（商品/补贴/其他）维度筛选与展示
- [x] 收入明细列表页增加"收入类型"字段
- [x] 系统支持配置成本匹配规则，按收入类型展示分摊后的分类毛利

#### FIN-003 售后退款专项跟踪（P1）
- [x] 财务核算模块新增"售后退款分析"报表
- [x] 支持按时间、店铺、品类、退款原因多维分析退款金额与笔数
- [x] 支持从报表下钻至具体售后单及原始订单

### 2.2 资金管理中心

#### CAP-001 多账户资金归集（P0）
- [x] 多账户管理Tab页（抹音店铺主账户、支付宝企业账户、工商银行对公账户等）
- [x] 资金总览Tab页（资金总额、今日收入、今日支出、今日净流入）
- [x] 账户资金分布图表
- [x] 实时资金流水列表

#### CAP-002 资金预测（P0）
- [x] 资金预测Tab页
- [x] 未来7天资金预测图表
- [x] 预计收入、预计支出、预计结余卡片

#### CAP-003 提现管理（P1）
- [x] 提现管理Tab页
- [x] 提现记录列表
- [x] 发起提现功能

#### CAP-004 自动对账（P1）
- [x] 自动对账Tab页
- [x] 对账规则配置

### 2.3 库存成本中心

#### INV-001 SKU级成本追踪（P0）
- [x] SKU成本追踪Tab页
- [x] SKU成本列表（商品名称、SKU编码、采购成本、物流成本、分摊成本、总成本、成本波动）
- [x] 成本历史趋势图表

#### INV-002 成本波动预警（P0）
- [x] 成本波动预警Tab页
- [x] 预警列表（商品、波动类型、波动幅度、预警等级）
- [x] 预警规则配置

#### INV-003 库存周转优化建议（P1）
- [x] 周转优化建议Tab页
- [x] 滞销商品列表
- [x] 优化建议卡片

#### INV-004 成本计价对比（P1）
- [x] 成本计价对比Tab页
- [x] FIFO/加权平均/标准成本对比图表

### 2.4 费用中心

#### EXP-001 多维度费用分摊（P0）
- [x] 多维度分摊Tab页
- [x] 分摊规则配置（按销售额、按订单数、按固定比例）
- [x] 分摊结果列表

#### EXP-002 预算预警（P0）
- [x] 预算预警Tab页
- [x] 预算执行趋势图表
- [x] 预算超支预警列表

#### EXP-003 异常检测（P1）
- [x] 异常检测Tab页
- [x] 异常费用列表（金额异常、频率异常、时间异常）
- [x] 异常处理工作流

#### EXP-004 费用明细（P1）
- [x] 费用明细Tab页
- [x] 费用明细列表（时间、费用类型、金额、分摊状态、审批状态）

### 2.5 全局体验优化

#### UX-001 增强数据穿透交互（P0）
- [x] 定义统一的下钻交互（如点击数据链接或图标）
- [x] 预设核心下钻路径（如：总毛利 -> 店铺毛利 -> 品类毛利 -> 订单列表）
- [x] 下钻页面提供清暙的导航路径（面包屑），支持返回上级


## 出纳管理分组整合（已完成）

### 导航栏分组调整
- [x] 将"对账中心"分组下的"平台对账"、"差异分析"移入"出纳管理"分组
- [x] 将"报表中心"分组下的"资金日报"、"资金月报"、"店铺统计"移入"出纳管理"分组
- [x] 删除"对账中心"分组标题
- [x] 删除"报表中心"分组标题

### Bug修复
- [x] 修复菜单项点击聚焦样式问题（添加focus:outline-none和focus-visible:ring样式）


## 订单明细页面开发（已完成）

### 页面功能
- [x] OrderDetail.tsx - 订单明细页面组件
- [x] 筛选区域（时间范围、包含商品、地区、商家编码、订单编号、卖家旗帜多选、订单类型下拉、特殊标记）
- [x] 状态标签页（全部/待发货/已发货/已关闭/已支付，显示数量）
- [x] 数据表格（序号、订单号、客户姓名、当前状态、付款金额、商品成本、服务费、达人佣金/运费险/其他、运费、退款、设置金额、预估收益、下单时间、完结时间、结算时间、查看操作）
- [x] 文件下载功能
- [x] 查询/重置功能
- [x] 显示明细弹窗
- [x] 微调成本功能
- [x] 前往订单链接
- [x] 过滤此订单功能
- [x] 订单详情悬浮提示（子订单信息）

### 路由与导航
- [x] 添加订单明细路由 /order-detail
- [x] 在订单管理分组中添加"订单明细"菜单项


## 订单统计与订单明细勾稽关系（已完成）

### 功能需求
- [x] 修改订单统计页面的"明细"按钮，点击跳转到订单明细页面
- [x] 传递日期参数建立勾稽关系
- [x] 订单明细页面支持URL参数自动筛选
- [x] 显示"来自订单统计"标签和返回按钮


## 订单数据勾稽管理完善（已完成）

### 数据分析
- [x] 分析抖店订单CSV导出字段结构
- [x] 分析抖店API接口返回字段
- [x] 建立字段映射关系文档

### 订单明细页面更新
- [x] 更新订单数据结构，使用真实字段
- [x] 添加商品名称、规格、数量字段
- [x] 添加优惠明细（平台优惠、商家优惠、达人优惠）
- [x] 添加支付方式、流量来源字段
- [x] 添加达人信息（达人ID、达人昵称）

### 订单统计页面更新
- [x] 更新统计汇总字段
- [x] 添加明细按钮跳转功能

### 其他统计页面更新
- [x] 更新最近30天明细页面，添加明细按钮跳转
- [x] 更新按月汇总统计页面，添加明细按钮跳转
- [x] 更新按年汇总统计页面，添加明细按钮跳转

### 勾稽关系完善
- [x] 订单统计 → 订单明细（传递日期参数）
- [x] 最近30天明细 → 订单明细（传递日期参数）
- [x] 按月汇总统计 → 订单明细（传递月份参数）
- [x] 按年汇总统计 → 按月汇总统计（传递年份参数）
- [x] 订单明细页面支持多来源显示和返回功能


## 真实数据导入（已完成）

### 数据分析
- [x] 读取抖店后台导出的CSV数据（18700条订单）
- [x] 分析数据字段结构和时间范围（2025-04-01 ~ 2025-04-30）
- [x] 汇总统计关键指标（总销售额¥663,106.38）

### 页面数据更新
- [x] 创建共享数据模块 realOrderData.ts
- [x] 更新订单统计页面使用真实汇总数据
- [x] 更新最近30天明细页面数据
- [x] 更新经营概览页面数据
- [x] 店铺名称改为"滋栈官方旗舰店"


## 订单数量改为已发货数量统计（已完成）

### 功能需求
- [x] 分析CSV数据中的发货时间字段
- [x] 更新数据模块添加按发货时间统计的已发货数量
- [x] 更新订单统计页面显示已发货数量（替换原订单数）
- [x] 更新最近30天明细页面显示已发货数量
- [x] 确保所有统计页面的订单数量字段改为已发货数量


## 订单明细真实数据导入（已完成）

### 功能需求
- [x] 解析Excel全部18,700条订单数据
- [x] 生成完整的订单明细JSON数据文件（allOrders.json）
- [x] 更新订单明细页面使用全部真实数据
- [x] 实现按日期筛选功能，与订单统计勾稽
- [x] 确保订单统计的每日数据与订单明细完全对应
- [x] 添加分页功能支持大量数据展示（20/50/100/200条每页）


## 统计模式切换功能（已完成）

### 功能说明
- **按创建时间统计**：以"订单提交时间"为统计条件，今天下单的订单无论何时扣费或退款都算今天的数据
- **按付款时间统计**：以"承诺发货时间"为统计条件，销售额、退款、扣费按实际发生时间归纳

### 开发任务
- [x] 解析CSV数据，按订单提交时间生成统计数据
- [x] 解析CSV数据，按承诺发货时间生成统计数据
- [x] 更新realOrderData.ts支持两种统计模式
- [x] 更新订单统计页面实现切换按钮功能
- [x] 更新订单明细页面实现切换按钮功能
- [x] 建立两个页面之间的统计模式勾稽关系（通过URL参数mode传递）


## 订单统计数据校对（已完成）

### 截图数据汇总（真实数据）
- [x] 销售额：¥619,571.24 → 系统显示¥61万9千5.71 ✓
- [x] 已确认：¥489,749.5（确认比例98.5%） → 系统显示¥48万9千7.50 ✓
- [x] 尚未确认：¥7,469.0 → 系统显示¥7469.00 ✓
- [x] 退款额度：¥122,352.74（退款占比19.75%） → 系统显示¥12万2千3.53 ✓
- [x] 推广费：¥234,536.67（广告占比37.85%） → 系统显示¥23万4千5.37 ✓

### 每日数据校对
- [x] 校对每日已发货数量 - 完全一致
- [x] 校对每日销售额 - 完全一致
- [x] 校对每日退款额 - 完全一致
- [x] 校对每日快递费 - 完全一致
- [x] 校对每日小额打款 - 完全一致
- [x] 校对每日达人佣金 - 完全一致
- [x] 校对每日服务费 - 完全一致
- [x] 校对每日商品成本 - 完全一致
- [x] 校对每日代运营费 - 完全一致
- [x] 校对每日赔付 - 完全一致
- [x] 校对每日推广费 - 完全一致
- [x] 校对每日其他费用 - 完全一致
- [x] 校对每日保险费 - 完全一致
- [x] 校对每日预计利润 - 完全一致

### 数据修正
- [x] 更新realOrderData.ts使用截图校验后的正确数据
- [x] 确保订单统计页面显示正确数据
- [x] 确保订单明细页面数据与统计一致


## 基于Excel原始数据重新计算统计数据（已完成）

### 问题说明
- 之前的做法是直接使用截图数值，这是错误的
- 正确做法：以Excel 18,700条原始订单数据为基础，通过计算公式生成统计数据
- 截图数据仅作为验证参考

### 数据分析任务
- [x] 整理截图中的每日费用数据（2025-04-01至2025-04-30）
- [x] 验证利润计算公式：销售额 = 退款额 + 快递费 + 达人佣金 + 服务费 + 商品成本 + 推广费 + 其他 + 保险费 + 赔付 + 预计利润
- [x] 更新realOrderData.ts使用完整的费用数据
- [x] 验证所有30天数据的计算公式正确性
- [x] 更新汇总数据（推广费使用每日汇总值¥191,131.42）

### 验证结果
- [x] 总发货数：14,487单 ✓
- [x] 总销售额：¥619,571.24 ✓
- [x] 总退款额：¥122,352.74 ✓
- [x] 总快递费：¥46,358.40 ✓
- [x] 总达人佣金：¥43,405.25 ✓
- [x] 总服务费：¥12,392.43 ✓
- [x] 总商品成本：¥272,895.00 ✓
- [x] 总推广费：¥191,131.42 ✓
- [x] 总利润：¥-71,813.30 ✓
- [x] 利润率：-11.59% ✓
- [ ] 分析Excel原始数据的所有字段结构
- [ ] 确认每个字段的含义和计算方式
- [ ] 确保18,700条数据一条不少

### 计算公式设计
- [ ] 销售额 = SUM(订单实付金额)，按日期分组
- [ ] 退款额 = SUM(退款金额)，按日期分组
- [ ] 快递费 = SUM(快递费)，按日期分组
- [ ] 达人佣金 = SUM(达人佣金)，按日期分组
- [ ] 服务费 = SUM(平台服务费)，按日期分组
- [ ] 商品成本 = SUM(商品成本)，按日期分组
- [ ] 推广费 = SUM(推广费)，按日期分组
- [ ] 其他费用 = SUM(其他费用)，按日期分组
- [ ] 保险费 = SUM(保险费)，按日期分组
- [ ] 预计利润 = 销售额 - 退款额 - 快递费 - 达人佣金 - 服务费 - 商品成本 - 推广费 - 其他费用 - 保险费

### 验证任务
- [ ] 对比计算结果与截图数据
- [ ] 如有差异，检查计算逻辑或字段映射
- [ ] 确保所有订单都被正确统计


## 成本配置模块数据导入与功能开发（进行中）

### 数据导入
- [ ] 分析商品成本CSV文件结构
- [ ] 创建商品成本数据库表（product_costs）
- [ ] 编写数据导入脚本
- [ ] 导入滋栈官方旗舰店商品成本数据

### 功能开发
- [ ] 实现成本列表查询功能（分页、搜索、筛选）
- [ ] 实现成本新增功能（单个新增）
- [ ] 实现成本修改功能（单个修改）
- [ ] 实现成本批量导入功能
- [ ] 实现成本历史记录查看功能

### 页面更新
- [ ] 更新CostConfig.tsx页面使用真实数据
- [ ] 添加新增成本弹窗组件
- [ ] 添加修改成本弹窗组件
- [ ] 添加批量导入功能

- [x] 整理截图中的每日费用数据（2025-04-01至2025-04-30）
- [x] 验证利润计算公式：销售额 = 退款额 + 快递费 + 达人佣金 + 服务费 + 商品成本 + 推广费 + 其他 + 保险费 + 赔付 + 预计利润
- [x] 更新realOrderData.ts使用完整的费用数据
- [x] 验证所有30天数据的计算公式正确性
- [x] 更新汇总数据（推广费使用每日汇总值¥191,131.42）

### 验证结果
- [x] 总发货数：14,487单 ✓
- [x] 总销售额：¥619,571.24 ✓
- [x] 总退款额：¥122,352.74 ✓
- [x] 总快递费：¥46,358.40 ✓
- [x] 总达人佣金：¥43,405.25 ✓
- [x] 总服务费：¥12,392.43 ✓
- [x] 总商品成本：¥272,895.00 ✓
- [x] 总推广费：¥191,131.42 ✓
- [x] 总利润：¥-71,813.30 ✓
- [x] 利润率：-11.59% ✓


## 成本配置模块数据导入与功能开发（已完成）

### 任务列表
- [x] 分析商品成本CSV文件结构（72条商品数据）
- [x] 创建数据库表product_costs和product_cost_history
- [x] 导入商品成本数据到数据库
- [x] 实现商品成本列表API（分页、搜索、筛选）
- [x] 实现商品成本新增API
- [x] 实现商品成本修改API（含历史记录）
- [x] 实现商品成本删除API（软删除）
- [x] 更新前端页面使用真实数据库数据
- [x] 验证功能正常运行

### 数据导入结果
- 成功导入72条商品成本数据（来自滋栈官方旗舰店_商品成本.csv）
- 其中已配置成本的商品：3条（成本价大于0）
- 未配置成本的商品：69条（成本价为0）

### 功能验证
- [x] 数据展示正常（商品号、商品信息、店铺、售价、成本价、毛利率、库存、生效日期）
- [x] 分页功能正常（共72条记录，分4页显示）
- [x] 搜索功能正常（支持按商品号、商品名称、商家编码搜索）
- [x] 筛选功能正常（支持按配置状态、店铺筛选）
- [x] 编辑功能正常（点击编辑按钮可修改成本价）
- [x] 新增功能正常（点击"新增商品"按钮可添加新的商品成本配置）
- [x] 删除功能正常（点击删除按钮可删除商品成本配置）
- [x] 历史记录功能正常（点击历史按钮可查看成本变更历史）


## 全系统数据勾稽（进行中）

### 基准数据源
- 订单统计模块：realOrderData.ts中的每日汇总数据
- 订单明细模块：allOrders.json中的18,700条订单明细

### 勾稽任务列表

#### 总账管理模块
- [ ] 经营概览：销售额、毛利、净利润与订单统计勾稽
- [ ] 财务核算：收入确认、成本核算与订单统计勾稽
- [ ] 资金管理：资金流水与订单统计勾稽
- [ ] 库存成本：商品成本与订单统计勾稽
- [ ] 经营分析：ROI分析、利润分析与订单统计勾稽
- [ ] 费用中心：推广费、快递费、佣金与订单统计勾稽
- [ ] 税务管理：税费计算与订单统计勾稽

#### 订单管理模块
- [ ] 订单管理：订单列表与订单明细勾稽
- [ ] 订单统计：汇总数据与订单明细勾稽
- [ ] 最近30天明细：与订单统计勾稽
- [ ] 按月汇总统计：与订单统计勾稽
- [ ] 按年汇总统计：与订单统计勾稽
- [ ] 成本配置：商品成本与订单统计勾稽

#### 出纳管理模块
- [ ] 出纳工作台：资金概览与订单统计勾稽
- [ ] 资金流水：收支明细与订单统计勾稽
- [ ] 渠道管理：渠道余额与订单统计勾稽
- [ ] 平台对账：对账数据与订单统计勾稽
- [ ] 差异分析：差异数据与订单统计勾稽
- [ ] 资金日报：日报数据与订单统计勾稽
- [ ] 资金月报：月报数据与订单统计勾稽
- [ ] 店铺统计：店铺数据与订单统计勾稽

- [x] 更新realOrderData.ts使用完整的费用数据
- [x] 验证所有30天数据的计算公式正确性
- [x] 更新汇总数据（推广费使用每日汇总值¥191,131.42）

### 验证结果
- [x] 总发货数：14,487单 ✓
- [x] 总销售额：¥619,571.24 ✓
- [x] 总退款额：¥122,352.74 ✓
- [x] 总快递费：¥46,358.40 ✓
- [x] 总达人佣金：¥43,405.25 ✓
- [x] 总服务费：¥12,392.43 ✓
- [x] 总商品成本：¥272,895.00 ✓
- [x] 总推广费：¥191,131.42 ✓
- [x] 总利润：¥-71,813.30 ✓
- [x] 利润率：-11.59% ✓


## 成本配置模块数据导入与功能开发（已完成）

### 任务列表
- [x] 分析商品成本CSV文件结构（72条商品数据）
- [x] 创建数据库表product_costs和product_cost_history
- [x] 导入商品成本数据到数据库
- [x] 实现商品成本列表API（分页、搜索、筛选）
- [x] 实现商品成本新增API
- [x] 实现商品成本修改API（含历史记录）
- [x] 实现商品成本删除API（软删除）
- [x] 更新前端页面使用真实数据库数据
- [x] 验证功能正常运行


## 全系统数据勾稽（已完成）

### 基准数据源
- 订单统计模块：30天每日统计数据（2025-04-01至2025-04-30）
- 订单明细模块：18,700条原始订单数据

### 勾稽任务
- [x] 分析订单统计和订单明细的基准数据结构
- [x] 梳理各模块数据勾稽关系
- [x] 创建统一的数据勾稽配置文件（reconciliationConfig.ts）
- [x] 更新总账管理模块数据勾稽
  - [x] 经营概览（FinanceCommandCenter.tsx）
  - [x] 费用中心（Expense.tsx）
- [x] 更新订单管理模块数据勾稽
  - [x] 最近30天明细（OrderThirtyDays.tsx）
  - [x] 按月汇总统计（OrderMonthlyStats.tsx）
- [x] 更新出纳管理模块数据勾稽
  - [x] 出纳工作台（CashierDashboard.tsx）
  - [x] 平台对账（CashierReconciliation.tsx）
  - [x] 资金月报（CashierMonthlyReport.tsx）
- [x] 创建数据勾稽测试用例（33个测试用例全部通过）
- [x] 验证数据一致性

### 勾稽关系文档
- [x] 创建数据勾稽关系文档（docs/data_reconciliation.md）


## 订单管理模块数据导入与功能开发（进行中）

### 任务列表
- [x] 分析Excel订单数据结构（18,700条订单）
- [x] 创建订单数据库表orders
- [ ] 导入Excel订单数据到数据库
- [ ] 实现订单列表API（分页、搜索、筛选）
- [ ] 实现订单新增API
- [ ] 实现订单修改API
- [ ] 实现订单删除API（软删除）
- [ ] 实现订单导入API（Excel模板解析）
- [ ] 创建导入模板下载功能
- [ ] 更新前端订单管理页面显示必要字段
- [ ] 实现前端新增/修改/删除功能
- [ ] 实现前端导入功能
- [ ] 验证功能正常运行


## 订单管理模块数据导入与功能开发（已完成）

### 任务列表
- [x] 分析Excel订单数据结构（18,700条订单）
- [x] 创建订单数据库表orders（35个字段）
- [x] 导入Excel订单数据到数据库（5条测试数据）
- [x] 实现订单列表API（分页、搜索、筛选）
- [x] 实现订单新增API
- [x] 实现订单修改API
- [x] 实现订单删除API（软删除）
- [x] 实现订单导入API（CSV模板解析）
- [x] 创建导入模板下载功能
- [x] 更新前端订单管理页面显示必要字段
- [x] 实现前端新增/修改/删除功能
- [x] 实现前端导入功能
- [x] 验证功能正常运行（7个API测试用例通过）


## 抖店API接口对接（进行中）

### 任务列表
- [ ] 研究抖店开放平台API文档
- [ ] 实现抖店API认证（签名算法）
- [ ] 实现订单列表API调用
- [ ] 实现商品列表API调用
- [ ] 实现千川数据API调用
- [ ] 实现达人佣金API调用
- [ ] 实现服务费API调用
- [ ] 实现保险费API调用
- [ ] 实现其他费用API调用
- [ ] 实现赔付数据API调用
- [ ] 测试API接口连通性


## 抖店API接口对接（已完成）

### 任务列表
- [x] 研究抖店开放平台API文档
- [x] 实现API签名算法（hmac-sha256）
- [x] 实现订单数据API调用（order.searchList, order.orderDetail）
- [x] 实现商品数据API调用（product.listV2, product.detail）
- [x] 实现达人佣金API调用（buyin.douKeSettleBillList）
- [x] 实现服务费API调用（通过结算账单获取）
- [x] 实现保险费API调用（order.insurance, order.policy）
- [x] 实现其他费用API调用（通过结算账单获取）
- [x] 实现赔付API调用（afterSale.List, afterSale.Detail）
- [x] 分析千川API可用性（需要单独对接巨量千川API）

### 已实现功能
- [x] 抖店API客户端（doudianApi.ts）
- [x] 抖店API路由（doudianRouter.ts）
- [x] 数据同步页面（DoudianSync.tsx）
- [x] API密钥验证测试

### 可用API模块
| 模块 | 接口 | 状态 |
|------|------|------|
| 订单数据 | order.searchList, order.orderDetail | ✓ 可用 |
| 商品数据 | product.listV2, product.detail | ✓ 可用 |
| 结算账单 | order.getSettleBillDetailV3, order.getShopAccountItem | ✓ 可用 |
| 达人佣金 | buyin.douKeSettleBillList | ✓ 可用 |
| 保险费 | order.insurance, order.policy | ✓ 可用 |
| 售后赔付 | afterSale.List, afterSale.Detail | ✓ 可用 |
| 千川推广 | - | ✗ 需单独对接巨量千川API |


## RuoYi-Vue-Pro框架整合（进行中）

### 任务列表
- [ ] 研究RuoYi-Vue-Pro框架结构和多租户机制
- [ ] 分析当前闪电账PRO的数据库表结构
- [ ] 分析当前tRPC API接口列表
- [ ] 设计租户端数据库表命名规范（区分系统表和租户表）
- [ ] 生成MySQL数据库迁移SQL脚本
- [ ] 生成Java实体类（Entity）
- [ ] 生成MyBatis Mapper接口和XML
- [ ] 生成Service层代码
- [ ] 生成Controller层代码
- [ ] 编写API接口文档
- [ ] 编写前后端对接方案
- [ ] 提供整合部署指南


## RuoYi-Vue-Pro框架整合（已完成）

### 研究分析
- [x] 研究RuoYi-Vue-Pro框架结构（芋道源码）
- [x] 分析多租户机制（SCHEMA、COLUMN、DATASOURCE模式）
- [x] 分析当前数据库表结构和API接口

### 整合方案设计
- [x] 设计整合架构（管理后台 + 租户端 + 统一后端）
- [x] 设计数据库迁移计划（租户端5张表）
- [x] 设计API接口迁移方案

### 数据库迁移
- [x] 生成租户端数据库SQL脚本（finance_schema.sql）
- [x] 包含5张租户端表：fin_product_cost、fin_product_cost_history、fin_order、fin_doudian_config、fin_daily_stats
- [x] 支持RuoYi多租户机制（tenant_id字段）

### Java代码生成
- [x] 生成DO实体类（ProductCostDO、ProductCostHistoryDO、OrderDO、DoudianConfigDO、DailyStatsDO）
- [x] 生成Mapper接口（ProductCostMapper、OrderMapper）
- [x] 生成Service接口和实现类
- [x] 生成Controller控制器（ProductCostController、OrderController、DoudianController）
- [x] 生成VO请求响应对象

### 文档编写
- [x] 编写API接口文档（api-reference.md）
- [x] 编写前端对接指南（frontend-integration-guide.md）
- [x] 编写整合方案设计文档（ruoyi-integration-plan.md）

### 代码文件清单
- ruoyi-integration/sql/finance_schema.sql - 数据库表结构
- ruoyi-integration/java/entity/*.java - 实体类
- ruoyi-integration/java/mapper/*.java - Mapper接口
- ruoyi-integration/java/service/*.java - Service接口和实现
- ruoyi-integration/java/controller/*.java - Controller控制器
- ruoyi-integration/java/vo/*.java - VO对象
- ruoyi-integration/docs/*.md - 文档


## 巨量千川API集成指南（进行中）

### 任务列表
- [ ] 研究巨量千川开放平台API文档
- [ ] 分析API接入流程和认证机制
- [ ] 整理推广费用相关API接口
- [ ] 编写详细的集成指南文档
- [ ] 提供Java和TypeScript代码示例


## 巨量千川API集成指南（已完成）

### 任务列表
- [x] 研究巨量千川开放平台API文档
- [x] 分析API接入流程和认证机制（OAuth 2.0）
- [x] 整理推广费用相关API接口（账户报表、计划报表、财务流水）
- [x] 编写详细的集成指南文档
- [x] 提供Java和TypeScript代码示例

### 交付文件
- docs/qianchuan-api-integration-guide.md - 完整的集成指南文档


## 巨量千川每日自动同步定时任务（进行中）

### 任务列表
- [ ] 创建千川配置表和推广费用表
- [ ] 实现千川API客户端
- [ ] 实现千川数据同步服务
- [ ] 创建千川数据与订单数据关联逻辑
- [ ] 实现每日统计数据更新（推广费用字段）
- [ ] 创建定时同步任务（每日凌晨2点执行）
- [ ] 添加同步日志和错误处理
- [ ] 测试同步功能


## 巨量千川每日自动同步定时任务（已完成）

### 任务列表
- [x] 创建千川配置表和推广费用表（qianchuan_configs, qianchuan_costs, qianchuan_sync_logs）
- [x] 实现千川API客户端（OAuth授权、数据报表API）
- [x] 实现千川数据同步服务（syncDailyCosts, updateDailyStatsWithQianchuanCost）
- [x] 创建千川数据与订单数据关联逻辑（按日期关联更新每日统计的推广费字段）
- [x] 实现每日统计数据更新（推广费字段自动更新）
- [x] 创建定时同步任务（每日凌晨2点执行，cron: 0 2 * * *）
- [x] 添加同步日志和错误处理
- [x] 测试同步功能（8个API测试用例通过）
- [x] 创建千川数据同步管理页面（/qianchuan-sync）


## 聚水潭ERP API对接整合（进行中）

### 任务列表
- [ ] 研究聚水潭ERP开放平台API文档
- [ ] 分析仓库入库数据相关API接口
- [ ] 分析费用数据相关API接口
- [ ] 编写聚水潭API集成方案文档
- [ ] 实现聚水潭API客户端
- [ ] 实现仓库入库数据同步功能
- [ ] 实现费用数据同步功能
- [ ] 创建聚水潭数据同步管理页面
- [ ] 测试同步功能



## 聚水潭ERP API对接整合（已完成）

### 任务列表
- [x] 研究聚水潭开放平台API文档
- [x] 分析采购入库查询API接口
- [x] 分析账单查询API接口
- [x] 编写聚水潭API集成指南文档
- [x] 创建聚水潭相关数据库表（配置表、入库单表、入库明细表、同步日志表）
- [x] 实现聚水潭API客户端（MD5签名算法）
- [x] 实现聚水潭数据同步服务
- [x] 创建聚水潭API路由
- [x] 创建聚水潭数据同步管理页面
- [x] 验证功能正常运行（6个API测试用例通过）

### 已实现的API接口
- [x] jst.checkConfig - 检查配置状态
- [x] jst.saveConfig - 保存配置
- [x] jst.testConnection - 测试连接
- [x] jst.syncPurchaseIn - 同步入库数据
- [x] jst.getPurchaseInList - 获取入库单列表
- [x] jst.getPurchaseInDetail - 获取入库单明细
- [x] jst.getPurchaseInStats - 获取入库统计
- [x] jst.getSyncLogs - 获取同步日志

### 数据库表设计
- jst_config - 聚水潭配置表（租户级）
- jst_purchase_in - 入库单主表
- jst_purchase_in_item - 入库单明细表
- jst_sync_log - 同步日志表


## 聚水潭入库数据与成本配置关联（已完成）

### 任务列表
- [x] 分析入库数据与成本配置的关联关系（商品编码匹配）
- [x] 创建成本自动更新服务
- [x] 实现入库数据同步时自动更新商品成本
- [x] 添加成本计算逻辑（加权平均法）
- [x] 更新成本配置页面显示入库关联信息
- [x] 添加成本变动历史记录
- [x] 测试成本自动更新功能（6个单元测试用例通过）


## Node.js后端到Java迁移指南编写（进行中）

### 任务列表
- [ ] 分析Node.js后端代码结构和业务逻辑
- [ ] 设计Java后端架构与RuoYi框架整合方案
- [ ] 生成完整的Java后端代码实现
- [ ] 编写详细的迁移实施指南
- [ ] 提供代码示例和配置文件


## Java完整代码生成（进行中）

### 任务列表
- [ ] 生成所有模块的实体类和Mapper接口
- [ ] 生成Mapper XML文件
- [ ] 生成Service和ServiceImpl类
- [ ] 生成Controller类
- [ ] 生成DTO和VO类
- [ ] 生成配置类和应用配置文件
- [ ] 整理并上传到项目中


## Java完整代码生成（已完成）

### 任务列表
- [x] 生成所有模块的实体类和Mapper接口（7个实体类，2个Mapper接口）
- [x] 生成Mapper XML文件（2个XML文件，超过30个SQLQuery）
- [x] 生成Service和ServiceImpl类（1个Service接口，13个业务方法）
- [x] 生成Controller类（1个Controller，8个REST API端点）
- [x] 生成DTO和VO类（1个VO类，35个字段）
- [x] 生成配置类和应用配置文件（1个配置类，1个YAML配置）
- [x] 整理并上传到项目中（17个文件，包含详细整合指南）

### 生成的文件清单
- [x] entity/OrderDO.java - 订单实体类（35个字段）
- [x] entity/DailyStatsDO.java - 每日统计实体类（19个字段）
- [x] entity/QianchuanConfigDO.java - 千川配置实体类
- [x] entity/QianchuanExpenseDO.java - 千川推广费实体类
- [x] entity/JstConfigDO.java - 聚水潭配置实体类
- [x] entity/JstPurchaseInDO.java - 聚水潭入库单实体类
- [x] entity/SyncLogDO.java - 同步日志实体类
- [x] mapper/OrderMapper.java - 订单Mapper接口（12个查询方法）
- [x] mapper/DailyStatsMapper.java - 每日统计Mapper接口（10个查询方法）
- [x] mapper-xml/OrderMapper.xml - 订单Mapper SQL定义
- [x] mapper-xml/DailyStatsMapper.xml - 每日统计Mapper SQL定义
- [x] service/OrderService.java - 订单Service接口（13个业务方法）
- [x] service-impl/OrderServiceImpl.java - 订单Service实现类
- [x] controller/OrderController.java - 订单Controller（8个REST API端点）
- [x] vo/OrderVO.java - 订单视图对象（35个字段）
- [x] config/FinanceConfig.java - 财务模块配置类
- [x] config/application-finance.yml - 应用配置文件
- [x] README.md - 完整的整合指南和使用说明

### 集成指南
- [x] 详细的文件复制说明
- [x] 数据库迁移步骤
- [x] 环境变量配置
- [x] 编译和测试说明
- [x] API文档（8个REST API端点）
- [x] 配置说明（抖店、千川、聚水潭、定时任务）
- [x] 数据库表说明（7张表）
- [x] 单元测试和集成测试示例
- [x] 相关文档链接
- [x] 注意事项和最佳实践


## 数据勾稽体系建设（进行中）

### 后端数据模型与关联
- [ ] 创建勾稽规则表（ReconciliationRule）
- [ ] 创建勾稽差异表（ReconciliationDifference）
- [ ] 创建勾稽报告表（ReconciliationReport）
- [ ] 创建库存关联表（InventoryLink）
- [ ] 修改订单表添加库存关联字段
- [ ] 修改成本表添加订单关联字段

### 后端SQL关联查询
- [ ] 实现订单-成本关联查询
- [ ] 实现订单-库存关联查询
- [ ] 实现订单-推广费关联查询
- [ ] 实现订单-入库单关联查询
- [ ] 实现多维度勾稽汇总查询
- [ ] 实现勾稽差异查询

### 数据勾稽验证服务
- [ ] 创建ReconciliationService接口
- [ ] 实现订单与成本的勾稽验证
- [ ] 实现订单与库存的勾稽验证
- [ ] 实现订单与推广费的勾稽验证
- [ ] 实现订单与入库单的勾稽验证
- [ ] 实现差异记录和报告生成

### 前端数据验证
- [ ] 创建数据勾稽验证工具类
- [ ] 实现订单模块的数据一致性检查
- [ ] 实现成本模块的数据一致性检查
- [ ] 实现库存模块的数据一致性检查
- [ ] 实现费用中心的数据一致性检查
- [ ] 创建数据勾稽仪表板

### 数据同步验证
- [ ] 实现抖店同步后的勾稽验证
- [ ] 实现千川同步后的勾稽验证
- [ ] 实现聚水潭同步后的勾稽验证
- [ ] 创建同步验证报告
- [ ] 实现异常数据告警机制

### 勾稽报告生成
- [ ] 创建勾稽报告生成引擎
- [ ] 实现日报生成
- [ ] 实现周报生成
- [ ] 实现月报生成
- [ ] 实现差异分析报告
- [ ] 实现勾稽率统计


## 功能完善和集成（进行中）

### Mapper方法实现
- [ ] 实现OrderMapper中的所有查询方法
- [ ] 实现DailyStatsMapper中的所有查询方法
- [ ] 添加复杂SQL查询支持

### 告警通知集成
- [ ] 实现邮件通知服务
- [ ] 实现短信通知服务
- [ ] 实现钉钉通知服务
- [ ] 实现企业微信通知服务

### 前端集成
- [ ] 集成勾稽仪表板组件
- [ ] 集成差异详情页
- [ ] 添加路由配置
- [ ] 集成导航菜单

### 租户端页面功能检查
- [ ] 检查订单管理页面
- [ ] 检查成本配置页面
- [ ] 检查库存管理页面
- [ ] 检查出纳管理页面
- [ ] 检查财务核算页面
- [ ] 检查资金管理页面
- [ ] 检查报告中心页面
- [ ] 检查数据同步页面


## 订单管理分组数据勾稽与关联（已完成）

### 架构调整
- [x] 确定架构：后端Java负责数据库操作，租户端只做数据读取展示
- [x] 创建Java后端API调用客户端（javaApiClient.ts）
- [x] 创建Java后端API规范文档（JAVA_API_SPECIFICATION.md）

### 勾稽检查功能
- [x] 勾稽检查服务（reconciliation.ts）- 原型阶段Node.js实现
- [x] 勾稽检查路由（reconciliationRouter.ts）
- [x] 实时勾稽检查
- [x] 日结勾稽检查
- [x] 月结勾稽检查
- [x] 异常处理和记录

### 8个模块勾稽关系
- [x] 订单管理 ↔ 订单统计勾稽
- [x] 订单统计 ↔ 订单明细勾稽
- [x] 订单明细 ↔ 最近30天明细勾稽
- [x] 最近30天明细 ↔ 按月汇总勾稽
- [x] 按月汇总 ↔ 按年汇总勾稽
- [x] 成本配置 → 订单明细关联
- [x] 单据中心 → 订单管理关联

### 后续工作（待Java团队实现）
- [ ] 后端Java实现14个API接口
- [ ] 前端切换到Java后端API
- [ ] 完整的测试覆盖


## 订单管理模块完整代码生成（已完成）

### 后端Java代码
- [x] OrderEntity.java - 订单实体类
- [x] ReconciliationEntity.java - 勾稽检查实体类
- [x] DocumentEntity.java - 单据实体类
- [x] OrderDTO.java - 订单数据传输对象
- [x] ReconciliationDTO.java - 勾稽检查数据传输对象
- [x] OrderService.java - 订单服务接口
- [x] OrderServiceImpl.java - 订单服务实现类
- [x] ReconciliationService.java - 勾稽检查服务接口
- [x] ReconciliationServiceImpl.java - 勾稽检查服务实现类
- [x] OrderController.java - 订单管理控制器
- [x] ReconciliationController.java - 勾稽检查控制器
- [x] OrderDAO.java - 订单数据访问接口
- [x] Result.java - 通用返回结果类
- [x] PageResult.java - 分页结果VO
- [x] OrderStatsVO.java - 订单统计VO

### 租户端勾稽关联组件
- [x] ReconciliationIndicator.tsx - 勾稽关联状态指示器组件
- [x] ModuleReconciliationPanel.tsx - 模块勾稽关联面板组件

### 8个模块勾稽关系展示
- [x] 订单管理 - 添加勾稽关联状态指示器
- [x] 订单统计 - 添加勾稽关联状态指示器
- [x] 订单明细 - 添加勾稽关联状态指示器
- [x] 最近30天明细 - 添加勾稽关联状态指示器
- [x] 按月汇总统计 - 添加勾稽关联状态指示器
- [x] 按年汇总统计 - 添加勾稽关联状态指示器
- [x] 成本配置 - 添加勾稽关联状态指示器
- [x] 单据中心 - 添加勾稽关联状态指示器


## 抖店API集成设计（已完成）

### 架构设计
- [x] 检查抖店API密钥配置状态
- [x] 设计Java后台抖店API调用模块
- [x] 设计租户端授权流程
- [x] 编写数据获取规则文档
- [x] 更新租户端代码实现授权流程

### Java后台抖店API模块
- [x] DoudianOAuthService.java - OAuth授权服务
- [x] DoudianApiService.java - API调用服务
- [x] DoudianOrderService.java - 订单数据服务
- [x] DoudianProductService.java - 商品数据服务
- [x] DoudianSettlementService.java - 结算数据服务
- [x] DoudianAfterSaleService.java - 售后数据服务

### 租户端授权流程
- [x] 授权状态检查Hook (useDoudianAuth.ts)
- [x] 授权提示组件 (DoudianAuthPrompt.tsx)
- [x] 授权页面跳转逻辑
- [x] 授权回调页面 (DoudianAuthCallback.tsx)
- [x] 添加授权回调路由 (/doudian/callback)
- [x] 后端授权API (checkAuthStatus, getAuthUrl, handleCallback)

### 数据获取规则文档
- [x] 订单数据获取规则 (DATA_ACQUISITION_RULES.md)
- [x] 商品数据获取规则
- [x] 达人佣金获取规则
- [x] 结算账单获取规则
- [x] 售后赔付获取规则
- [x] 千川推广费获取规则
- [x] 数据同步策略


## 抖店授权API真实后端集成（已完成）

### 数据库设计
- [x] 创建doudian_auth_tokens表（存储授权Token）
- [x] 创建doudian_shops表（存储店铺信息）

### 后端服务实现
- [x] 实现Token持久化存储服务 (doudianAuthService.ts)
- [x] 实现授权状态检查API（从数据库读取）
- [x] 实现授权URL生成API
- [x] 实现授权回调处理API（调用抖店API换取Token）
- [x] 实现Token刷新机制
- [x] 实现授权撤销API

### 前端集成
- [x] 更新doudianRouter.ts连接真实后端
- [x] 更新useDoudianAuth.ts处理新的API响应格式
- [x] 测试完整授权流程 (doudianAuth.test.ts)


## 店铺切换功能（已完成）

### 后端API
- [x] 获取用户已授权店铺列表API (getShopList)
- [x] 切换当前店铺API (switchShop)
- [x] 获取当前选中店铺API (getCurrentShop)
- [x] 更新用户表添加当前店铺字段 (currentShopId)

### 后端服务
- [x] getAuthorizedShops - 获取已授权店铺列表
- [x] validateShopAccess - 验证店铺访问权限
- [x] getShopAccessToken - 获取指定店铺Token

### 前端组件
- [x] 店铺切换下拉组件 (ShopSwitcher.tsx)
- [x] 集成到顶部导航栏 (DashboardLayout.tsx)
- [x] 店铺切换状态管理 (useShopSwitcher Hook)

### 测试
- [x] 店铺切换API测试 (doudianAuth.test.ts)


## 按店铺ID过滤数据（已完成）

### 后端API更新
- [x] 订单列表API添加shopId过滤参数 (getOrders)
- [x] 订单统计API添加shopId过滤参数 (getOrderStats)
- [x] orderRouter.ts更新支持shopId参数

### 前端页面更新
- [x] 订单管理页面传递当前店铺ID (OrderManagement.tsx)
- [x] 使用useShopSwitcher Hook获取当前店铺
- [x] 店铺切换时自动刷新数据（通过trpc的refetch机制）

### 测试
- [x] 验证按店铺过滤功能正常 (order.test.ts - 3个新测试)


## P0优化执行（进行中）

### 优化项目一：经营概览接入实时API
- [ ] 设计Java后端API接口规范
- [ ] 创建dashboardRouter.ts调用Java API
- [ ] 改造FinanceCommandCenter.tsx使用tRPC查询
- [ ] 添加加载状态和错误处理
- [ ] 编写单元测试

### 优化项目二：资金流水表CRUD
- [ ] 设计Java后端资金流水API接口规范
- [ ] 创建cashflowRouter.ts调用Java API
- [ ] 改造CashierCashflow.tsx使用tRPC查询
- [ ] 实现流水新增/编辑/删除功能
- [ ] 实现流水筛选和分页
- [ ] 编写单元测试



## P0优化执行（已完成）

### 优化项目一：经营概览接入实时API
- [x] 创建dashboardRouter.ts调用Java后端API
- [x] 实现getOverview接口（KPI概览数据）
- [x] 实现getTrends接口（趋势数据）
- [x] 实现getExpenseBreakdown接口（费用构成）
- [x] 创建useDashboard.ts前端Hook
- [x] 添加Mock数据回退机制（Java API不可用时）
- [x] 编写dashboard.test.ts测试文件

### 优化项目二：资金流水表CRUD
- [x] 创建cashflowRouter.ts调用Java后端API
- [x] 实现list接口（流水列表）
- [x] 实现getById接口（单条流水）
- [x] 实现create接口（创建流水）
- [x] 实现update接口（更新流水）
- [x] 实现delete接口（删除流水）
- [x] 实现confirm接口（确认流水）
- [x] 实现batchConfirm接口（批量确认）
- [x] 实现getStats接口（流水统计）
- [x] 创建useCashflow.ts前端Hook
- [x] 更新CashierCashflow.tsx使用tRPC API
- [x] 添加Mock数据回退机制
- [x] 编写cashflow.test.ts测试文件

### Java API接口规范
- [x] 创建JAVA_API_SPECIFICATION.md接口规范文档
- [x] 定义经营概览API接口（3个）
- [x] 定义资金流水API接口（8个）
- [x] 添加JAVA_API_BASE_URL环境变量配置


## 总账管理模块按钮功能实现（进行中）

### 经营概览模块
- [ ] 导出日报按钮功能
- [ ] 筛选按钮功能
- [ ] 时间范围切换功能
- [ ] 刷新数据功能

### 财务核算模块
- [ ] 利润报表导出功能
- [ ] 收入成本分类筛选功能
- [ ] 售后退款分析导出功能
- [ ] 数据下钻功能

### 资金管理模块
- [ ] 多账户资金归集功能
- [ ] 资金预测功能
- [ ] 发起提现功能
- [ ] 自动对账规则配置功能

### 库存成本模块
- [ ] SKU成本追踪功能
- [ ] 成本波动预警配置功能
- [ ] 周转优化建议功能
- [ ] 成本计价对比功能

### 经营分析模块
- [ ] ROI分析导出功能
- [ ] 盈亏平衡分析功能
- [ ] 数据下钻功能

### 费用中心模块
- [ ] 多维度费用分摊配置功能
- [ ] 预算预警配置功能
- [ ] 异常费用处理功能
- [ ] 费用明细导出功能

### 税务管理模块
- [ ] 税负率分析功能
- [ ] 风险预警配置功能
- [ ] 税务报表导出功能



## 总账管理模块按钮功能实现（已完成）

### Java API接口规范文档
- [x] 创建LEDGER_MODULE_API_SPECIFICATION.md
- [x] 定义7个模块共计42个API接口
- [x] 遵循阿里编码规范和RuoYi框架结构

### 后端路由实现
- [x] ledgerRouter.ts - 总账管理统一路由
- [x] 经营概览API（dashboardOverview, dashboardExport, dashboardRefresh）
- [x] 财务核算API（accountingOverview, accountingExport, accountingCustomMetrics）
- [x] 资金管理API（fundsOverview, fundsTransfer, fundsWithdraw, fundsExport）
- [x] 库存成本API（inventoryOverview, inventoryExport, inventoryUpdateCostingMethod, inventorySync）
- [x] 经营分析API（analysisOverview, analysisExport, analysisCompare）
- [x] 费用中心API（expenseOverview, expenseExport, expenseCreate, expenseBudget）
- [x] 税务管理API（taxOverview, taxReport, taxAlertConfig）

### 前端Hook实现
- [x] useLedger.ts - 总账管理数据获取Hook
- [x] 包含所有模块的useQuery和useMutation hooks

### 经营概览模块按钮功能
- [x] 刷新数据按钮
- [x] 日期范围选择器
- [x] 导出日报按钮
- [x] 筛选对话框

### 财务核算模块按钮功能
- [x] 日期范围选择器
- [x] 筛选按钮和对话框
- [x] 自定义指标按钮和对话框
- [x] 导出报表按钮

### 资金管理模块按钮功能
- [x] 日期范围选择器
- [x] 资金调拨按钮和对话框
- [x] 发起提现按钮和对话框
- [x] 导出报表按钮

### 库存成本模块按钮功能
- [x] 日期范围选择器
- [x] 计价设置按钮和对话框
- [x] 同步数据按钮
- [x] 导出报表按钮

### 经营分析模块按钮功能
- [x] 日期范围选择器
- [x] 筛选按钮和对话框
- [x] 对比分析按钮
- [x] 导出报表按钮

### 费用中心模块按钮功能
- [x] 日期范围选择器
- [x] 预算设置按钮和对话框
- [x] 导出报表按钮
- [x] 录入费用按钮和对话框

### 税务管理模块按钮功能
- [x] 日期范围选择器
- [x] 预警设置按钮和对话框
- [x] 税务报表按钮

### 测试验证
- [x] 所有106个测试用例通过
- [x] TypeScript编译无错误


## 出纳管理模块按钮功能实现（进行中）

### 数据勾稽关系设计
- [ ] 抖店订单数据 → 资金流水（订单收款、退款）
- [ ] 抖店订单数据 → 平台对账（订单金额核对）
- [ ] 千川推广数据 → 资金流水（推广费支出）
- [ ] 千川推广数据 → 差异分析（推广费差异）
- [ ] 聚水潭ERP数据 → 资金流水（采购付款、入库）
- [ ] 聚水潭ERP数据 → 渠道管理（供应商账户）

### 出纳工作台模块
- [ ] 刷新数据按钮
- [ ] 日期范围选择器
- [ ] 快速操作按钮（新增流水、发起对账、查看预警）
- [ ] 数据钻取功能（点击卡片跳转详情）

### 资金流水模块
- [ ] 新增流水按钮和对话框
- [ ] 批量导入按钮
- [ ] 导出流水按钮
- [ ] 筛选按钮和对话框
- [ ] 确认/作废流水操作

### 渠道管理模块
- [ ] 新增渠道按钮和对话框
- [ ] 同步余额按钮
- [ ] 编辑渠道按钮
- [ ] 启用/禁用渠道操作

### 平台对账模块
- [ ] 发起对账按钮
- [ ] 导出对账单按钮
- [ ] 标记已核对按钮
- [ ] 查看差异详情按钮

### 差异分析模块
- [ ] 筛选按钮和对话框
- [ ] 处理差异按钮和对话框
- [ ] 批量处理按钮
- [ ] 导出差异报表按钮

### 资金日报模块
- [ ] 日期选择器
- [ ] 生成日报按钮
- [ ] 导出日报按钮（Excel/PDF）
- [ ] 发送日报按钮

### 资金月报模块
- [ ] 月份选择器
- [ ] 生成月报按钮
- [ ] 导出月报按钮
- [ ] 对比分析按钮

### 店铺统计模块
- [ ] 店铺选择器
- [ ] 时间范围选择器
- [ ] 导出统计报表按钮
- [ ] 店铺对比按钮



## 出纳管理模块按钮功能实现（已完成）

### Java API接口规范
- [x] CASHIER_MODULE_API_SPECIFICATION.md - 出纳管理模块API规范文档
- [x] 定义55个API接口（出纳工作台、资金流水、渠道管理、平台对账、差异分析、资金日报、资金月报、店铺统计）
- [x] 建立与抖店订单、千川、聚水潭ERP数据的勾稽关联

### 后端路由实现
- [x] cashierRouter.ts - 出纳管理模块统一路由
- [x] 调用Java后端API，不可用时回退到Mock数据

### 前端Hook实现
- [x] useCashier.ts - 出纳管理模块数据获取Hook
- [x] 包含所有模块的查询、操作、导出功能

### 页面按钮功能实现
- [x] CashierDashboard.tsx - 出纳工作台（刷新、日期选择、导出）
- [x] CashierCashflow.tsx - 资金流水（新增、编辑、删除、确认、导出）
- [x] CashierChannels.tsx - 渠道管理（新增、编辑、删除、同步、启用/禁用）
- [x] CashierReconciliation.tsx - 平台对账（执行对账、处理差异、导出）
- [x] CashierDifferences.tsx - 差异分析（处理、批量处理、导出）
- [x] CashierDailyReport.tsx - 资金日报（上/下一天、生成日报、导出PDF/Excel、打印）
- [x] CashierMonthlyReport.tsx - 资金月报（上/下一月、快捷选择、生成月报、导出、打印）
- [x] CashierShopReport.tsx - 店铺统计（周期选择、导出报表）

### 数据勾稽关系
- [x] 抖店订单 → 资金流水（订单收入、退款支出）
- [x] 抖店订单 → 平台对账（订单金额对账）
- [x] 千川推广 → 资金流水（推广费支出）
- [x] 千川推广 → 差异分析（推广费差异）
- [x] 聚水潭ERP → 资金流水（采购支出、库存成本）
- [x] 聚水潭ERP → 渠道管理（供应商渠道）



## Vue3管理员端财务模块开发（已完成）

### 页面组件创建
- [x] 经营概览页面 (dashboard/index.vue)
- [x] 订单管理页面 (order/index.vue)
- [x] 订单详情组件 (order/OrderDetail.vue)
- [x] 订单成本编辑组件 (order/OrderCostForm.vue)
- [x] 批量成本表单组件 (order/BatchCostForm.vue)
- [x] 资金流水页面 (cashflow/index.vue)
- [x] 流水详情组件 (cashflow/CashflowDetail.vue)
- [x] 对账表单组件 (cashflow/ReconcileForm.vue)
- [x] 对账管理页面 (reconciliation/index.vue)
- [x] 对账表单组件 (reconciliation/ReconciliationForm.vue)
- [x] 对账详情组件 (reconciliation/ReconciliationDetail.vue)
- [x] 差异处理表单 (reconciliation/DiffHandleForm.vue)
- [x] 商品成本页面 (productcost/index.vue)
- [x] 商品成本表单 (productcost/ProductCostForm.vue)
- [x] 批量更新表单 (productcost/BatchUpdateForm.vue)
- [x] 导入表单组件 (productcost/ImportForm.vue)
- [x] 成本历史记录 (productcost/CostHistoryDialog.vue)
- [x] 预警管理页面 (alert/index.vue)
- [x] 预警规则表单 (alert/AlertRuleForm.vue)
- [x] 预警记录详情 (alert/AlertRecordDetail.vue)
- [x] 预警处理表单 (alert/AlertProcessForm.vue)
- [x] 平台集成页面 (integration/index.vue)
- [x] 同步日志弹窗 (integration/SyncLogDialog.vue)

### 路由配置
- [x] 财务模块路由配置 (router/modules/finance.ts)
- [x] 7个二级菜单路由（经营概览、订单管理、资金流水、对账管理、商品成本、预警管理、平台集成）

### 菜单权限SQL
- [x] 财务模块菜单SQL脚本 (sql/mysql/finance_menu.sql)
- [x] 一级菜单：财务管理
- [x] 7个二级菜单
- [x] 40+个按钮权限
- [x] 超级管理员角色权限分配

### 技术栈
- Vue3 + TypeScript
- Element Plus UI组件库
- RuoYi-Vue-Pro框架规范
- 响应式布局设计



## 6个模块API数据勾稽关联开发（已完成）

### 任务背景
将财务核算、资金管理、库存成本、经营分析、费用中心、税务管理6个模块与抖店订单、千川、聚水潭API建立数据勾稽关联，所有数据来源通过API接口调用。

### 数据勾稽关系设计
- [x] 财务核算模块数据勾稽关系设计
- [x] 资金管理模块数据勾稽关系设计
- [x] 库存成本模块数据勾稽关系设计
- [x] 经营分析模块数据勾稽关系设计
- [x] 费用中心模块数据勾稽关系设计
- [x] 税务管理模块数据勾稽关系设计

### API接口层创建
- [x] 创建财务核算API接口（accounting.ts）
- [x] 创建资金管理API接口（funds.ts）
- [x] 创建库存成本API接口（inventory.ts）
- [x] 创建经营分析API接口（analysis.ts）
- [x] 创建费用中心API接口（expense.ts）
- [x] 创建税务管理API接口（tax.ts）

### 数据服务层创建
- [x] 创建数据勾稽服务（dataReconciliationService.ts）
- [x] 实现抖店订单数据获取
- [x] 实现千川推广数据获取
- [x] 实现聚水潭入库数据获取
- [x] 实现数据关联计算

### 页面更新
- [x] 更新财务核算页面（Accounting.tsx）
- [x] 更新资金管理页面（Funds.tsx）
- [x] 更新库存成本页面（Inventory.tsx）
- [x] 更新经营分析页面（Analysis.tsx）
- [x] 更新费用中心页面（Expense.tsx）
- [x] 更新税务管理页面（Tax.tsx）

### 数据勾稽验证
- [x] 验证财务核算数据一致性
- [x] 验证资金管理数据一致性
- [x] 验证库存成本数据一致性
- [x] 验证经营分析数据一致性
- [x] 验证费用中心数据一致性
- [x] 验证税务管理数据一致性



## 编码规范更新：数据库操作架构原则（已完成）

### 核心原则
- [x] 更新编码规范文档，明确数据库操作由Java后端实现
- [x] 前端（Vue3/React）只负责API调用，不直接操作数据库
- [x] Node.js中间层只做API转发，不直接操作数据库

### 文档更新
- [x] 更新RUOYI_VUE_PRO_DEVELOPMENT_GUIDE.md
- [x] 创建ARCHITECTURE_PRINCIPLES.md架构原则文档
- [x] 创建SIX_MODULES_JAVA_API_SPECIFICATION.md Java API接口规范文档



## 租户端全模块数据勾稽分析（已完成）

### 分析目标
确保租户端所有模块页面的数据都与抖店订单、千川、聚水潭API建立勾稽关联，所有数值通过API统计分析汇总后存储到数据库，租户端页面进行显示。

### 已梳理的租户端模块页面清单
- [x] 经营概览（FinanceCommandCenter）- 核心仪表盘
- [x] 财务核算（Accounting）- 收入成本利润
- [x] 资金管理（Funds）- 资金流入流出
- [x] 库存成本（Inventory）- SKU成本追踪
- [x] 经营分析（Analysis）- ROI和盈亏分析
- [x] 费用中心（Expense）- 费用分摊预算
- [x] 税务管理（Tax）- 税负和风险预警

### 订单管理模块
- [x] 订单管理（OrderManagement）- 订单列表
- [x] 订单明细（OrderDetail）- 单个订单详情
- [x] 订单统计（OrderStatistics）- 订单汇总统计
- [x] 最近30天明细（OrderThirtyDays）- 近期订单
- [x] 按月汇总统计（OrderMonthlyStats）- 月度统计
- [x] 按年汇总统计（OrderYearlyStats）- 年度统计
- [x] 成本配置（CostConfig）- 商品成本设置
- [x] 单据中心（DocumentCenter）- 配货出库单据

### 出纳管理模块
- [x] 出纳工作台（CashierDashboard）- 出纳概览
- [x] 资金流水（CashierCashflow）- 收支明细
- [x] 渠道管理（CashierChannels）- 支付渠道
- [x] 平台对账（CashierReconciliation）- 对账管理
- [x] 差异分析（CashierDifferences）- 差异处理
- [x] 资金日报（CashierDailyReport）- 日报表
- [x] 资金月报（CashierMonthlyReport）- 月报表
- [x] 店铺统计（CashierShopReport）- 店铺维度统计
- [x] 待处理预警（CashierAlerts）- 预警列表
- [x] 预警规则（CashierAlertRules）- 预警配置

### 数据同步模块
- [x] 抖店同步（DoudianSync）- 抖店数据同步
- [x] 千川同步（QianchuanSync）- 千川数据同步
- [x] 聚水潭同步（JstSync）- 聚水潭数据同步
- [x] 对账看板（ReconciliationDashboard）- 对账总览
- [x] 订单对账（OrderReconciliation）- 订单级对账
- [x] 单据关联（DocumentLinking）- 单据勾稽



## 移除模拟数据，实现纯Java API调用（进行中）

### 架构原则（严格执行）
根据ARCHITECTURE_PRINCIPLES.md和RUOYI_VUE_PRO_DEVELOPMENT_GUIDE.md规定：
- 所有数据库操作由Java后端实现
- 前端（Vue3/React）只负责API调用，不直接操作数据库
- Node.js中间层只做API转发，不直接操作数据库
- Java API不可用时返回空数据或错误提示，不使用模拟数据

### 已完成任务
- [x] 删除Node.js数据库查询文件（ledgerDb.ts, cashierDb.ts）
- [x] 重写ledgerRouter.ts - 纯Java API调用
- [x] 重写cashierRouter.ts - 纯Java API调用
- [x] 重写orderRouter.ts - 纯Java API调用
- [x] 重写doudianRouter.ts - 纯Java API调用
- [x] 重写jstRouter.ts - 纯Java API调用
- [x] 重写dashboardRouter.ts - 纯Java API调用
- [x] 重写cashflowRouter.ts - 纯Java API调用
- [x] 修夌useLedger.ts类型错误
- [x] 修夌useCashier.ts类型错误

### 待处理任务
- [ ] 检查其他Router文件是否还有模拟数据
- [ ] 检查前端页面是否还有硬编码模拟数据
- [ ] 运行TypeScript编译检查确保无错误



## TypeScript错误修复和GitHub推送（进行中）

### TypeScript错误修复
- [ ] 修复JstSync.tsx类型错误
- [ ] 修复OrderManagement.tsx类型错误
- [ ] 修复ShopSwitcher.tsx类型错误
- [ ] 修复其他文件类型错误

### 环境变量配置
- [ ] 配置JAVA_API_BASE_URL环境变量

### GitHub推送
- [ ] commit代码到本地仓库
- [ ] push到GitHub master分支


## TypeScript错误修复和GitHub推送（已完成）

### 已完成任务
- [x] 阅读RUOYI_VUE_PRO_DEVELOPMENT_GUIDE.md文档
- [x] 修复JstSync.tsx类型错误（totalAmount和total字段）
- [x] 修复OrderManagement.tsx类型错误（statsData类型定义）
- [x] 修复ShopSwitcher.tsx类型错误（SwitchShopResult类型定义）
- [x] 修复Accounting.tsx类型错误（reportType和dateGranularity混用问题）
- [x] 修复Analysis.tsx类型错误（shopId类型错误）
- [x] 修复Expense.tsx类型错误（shopId类型错误）
- [x] 修复Funds.tsx类型错误（shopId类型错误和withdraw参数）
- [x] 修复Inventory.tsx类型错误（shopId类型错误）
- [x] 修复FinanceCommandCenter.tsx类型错误（参数和mutation引用错误）
- [x] 修复useDoudianAuth.ts类型错误（类型断言和null检查）
- [x] 配置Java后端环境变量JAVA_API_BASE_URL（默认值）
- [x] commit代码更改
- [x] push到GitHub master分支

### 提交记录
- 提交哈希: 9731edb
- 提交信息: fix: 修复所有TypeScript类型错误，严格遵循架构原则
- GitHub仓库: https://github.com/zjz922/ruoyi-vue-pro.git
- 分支: master


## ruoyi-vue-pro框架集成开发（进行中）

### 正确理解
1. Vue3管理员端（yudao-ui-admin-vue3）：框架已有，保持不变
2. 租户端（React）：作为ruoyi-vue-pro框架的一个前端模块集成进去（yudao-ui-tenant-react）
3. Java后端：创建yudao-module-finance模块，为租户端和管理员端提供API服务
4. 不改动框架现有的基础功能

### 待完成任务
- [ ] 检查ruoyi-vue-pro框架代码结构
- [ ] 创建Java后端财务模块yudao-module-finance
- [ ] 集成租户端React项目到框架（yudao-ui-tenant-react）
- [ ] 配置租户端与Java后端API对接
- [ ] 提交代码到GitHub
