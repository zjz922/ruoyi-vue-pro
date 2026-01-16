# 闪电帐PRO 管理员后台API接口设计文档

> **文档版本**：v1.0  
> **创建日期**：2026-01-17  
> **作者**：Manus AI

---

## 一、概述

本文档详细描述管理员后台24个新增页面的功能定义和后端API接口设计。所有API接口遵循RuoYi-Vue-Pro框架的RESTful规范，采用统一的请求/响应格式。

### 1.1 API设计规范

根据README.md中的框架规范，API接口遵循以下设计原则：

| 规范项 | 说明 |
|--------|------|
| **URL格式** | `/admin-api/{模块}/{功能}/{操作}` |
| **请求方式** | GET（查询）、POST（创建）、PUT（更新）、DELETE（删除） |
| **分页查询** | 统一使用 `pageNo`、`pageSize` 参数 |
| **响应格式** | `{ code: 0, data: {...}, msg: "success" }` |
| **权限控制** | 使用 `@PreAuthorize("@ss.hasPermission('xxx')")` 注解 |
| **数据校验** | 使用 `@Valid` + `@NotNull`、`@Size` 等注解 |

### 1.2 通用响应结构

```java
public class CommonResult<T> {
    private Integer code;      // 状态码，0表示成功
    private T data;            // 响应数据
    private String msg;        // 响应消息
}

public class PageResult<T> {
    private List<T> list;      // 数据列表
    private Long total;        // 总记录数
}
```

---

## 二、平台集成模块（6个页面）

### 2.1 抖店配置管理

#### 页面1：抖店配置列表（platform/doudian/index.vue）

**功能描述**：展示所有租户的抖店授权配置，包括AppKey、授权状态、店铺信息、最后同步时间等。支持搜索、筛选、分页。

**页面功能点**：
- 列表展示：租户名称、店铺名称、AppKey（脱敏）、授权状态、授权时间、最后同步时间
- 搜索筛选：按租户名称、店铺名称、授权状态筛选
- 操作按钮：新增、编辑、删除、测试连接、手动同步

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取配置分页 | GET | `/admin-api/finance/platform/doudian/page` | 分页查询抖店配置列表 |
| 获取配置详情 | GET | `/admin-api/finance/platform/doudian/get` | 根据ID获取配置详情 |
| 创建配置 | POST | `/admin-api/finance/platform/doudian/create` | 创建抖店配置 |
| 更新配置 | PUT | `/admin-api/finance/platform/doudian/update` | 更新抖店配置 |
| 删除配置 | DELETE | `/admin-api/finance/platform/doudian/delete` | 删除抖店配置 |
| 测试连接 | POST | `/admin-api/finance/platform/doudian/test-connection` | 测试抖店API连接 |
| 手动同步 | POST | `/admin-api/finance/platform/doudian/sync` | 触发手动数据同步 |

**请求参数（分页查询）**：

```typescript
interface DoudianConfigPageReqVO {
  pageNo: number;           // 页码，默认1
  pageSize: number;         // 每页条数，默认10
  tenantId?: number;        // 租户ID（可选）
  shopName?: string;        // 店铺名称（可选，模糊查询）
  status?: number;          // 授权状态：0-未授权，1-已授权，2-已过期
  createTime?: string[];    // 创建时间范围
}
```

**响应数据（配置详情）**：

```typescript
interface DoudianConfigRespVO {
  id: number;               // 配置ID
  tenantId: number;         // 租户ID
  tenantName: string;       // 租户名称
  shopId: string;           // 抖店店铺ID
  shopName: string;         // 店铺名称
  appKey: string;           // AppKey（脱敏显示）
  appSecret: string;        // AppSecret（脱敏显示）
  accessToken: string;      // 访问令牌（脱敏显示）
  refreshToken: string;     // 刷新令牌（脱敏显示）
  tokenExpireTime: string;  // 令牌过期时间
  status: number;           // 授权状态
  lastSyncTime: string;     // 最后同步时间
  syncStatus: number;       // 同步状态：0-未同步，1-同步中，2-同步成功，3-同步失败
  createTime: string;       // 创建时间
  updateTime: string;       // 更新时间
}
```

**Java Controller示例**：

```java
@Tag(name = "管理后台 - 抖店配置")
@RestController
@RequestMapping("/admin-api/finance/platform/doudian")
@Validated
public class AdminDoudianConfigController {

    @Resource
    private DoudianConfigService doudianConfigService;

    @GetMapping("/page")
    @Operation(summary = "获取抖店配置分页")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<PageResult<DoudianConfigRespVO>> getDoudianConfigPage(
            @Valid DoudianConfigPageReqVO pageVO) {
        return success(doudianConfigService.getDoudianConfigPage(pageVO));
    }

    @GetMapping("/get")
    @Operation(summary = "获取抖店配置详情")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<DoudianConfigRespVO> getDoudianConfig(@RequestParam("id") Long id) {
        return success(doudianConfigService.getDoudianConfig(id));
    }

    @PostMapping("/create")
    @Operation(summary = "创建抖店配置")
    @PreAuthorize("@ss.hasPermission('finance:doudian:create')")
    public CommonResult<Long> createDoudianConfig(@Valid @RequestBody DoudianConfigCreateReqVO createReqVO) {
        return success(doudianConfigService.createDoudianConfig(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新抖店配置")
    @PreAuthorize("@ss.hasPermission('finance:doudian:update')")
    public CommonResult<Boolean> updateDoudianConfig(@Valid @RequestBody DoudianConfigUpdateReqVO updateReqVO) {
        doudianConfigService.updateDoudianConfig(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除抖店配置")
    @PreAuthorize("@ss.hasPermission('finance:doudian:delete')")
    public CommonResult<Boolean> deleteDoudianConfig(@RequestParam("id") Long id) {
        doudianConfigService.deleteDoudianConfig(id);
        return success(true);
    }

    @PostMapping("/test-connection")
    @Operation(summary = "测试抖店连接")
    @PreAuthorize("@ss.hasPermission('finance:doudian:update')")
    public CommonResult<Boolean> testConnection(@RequestParam("id") Long id) {
        return success(doudianConfigService.testConnection(id));
    }

    @PostMapping("/sync")
    @Operation(summary = "手动同步抖店数据")
    @PreAuthorize("@ss.hasPermission('finance:doudian:update')")
    public CommonResult<Boolean> syncData(@RequestParam("id") Long id) {
        doudianConfigService.syncData(id);
        return success(true);
    }
}
```

---

#### 页面2：抖店配置表单（platform/doudian/DoudianForm.vue）

**功能描述**：新增/编辑抖店配置的表单页面，支持填写AppKey、AppSecret，获取授权链接，完成OAuth授权流程。

**页面功能点**：
- 基础信息：选择租户、填写AppKey、AppSecret
- 授权流程：生成授权链接、跳转授权、回调处理
- 高级配置：同步频率、同步范围、数据保留天数

**API接口**：复用页面1的创建/更新接口，新增以下接口：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取授权链接 | GET | `/admin-api/finance/platform/doudian/auth-url` | 生成抖店OAuth授权链接 |
| 处理授权回调 | POST | `/admin-api/finance/platform/doudian/auth-callback` | 处理OAuth回调，保存Token |

---

### 2.2 千川配置管理

#### 页面3：千川配置列表（platform/qianchuan/index.vue）

**功能描述**：展示所有租户的千川广告平台授权配置，管理广告账户、投放数据同步。

**页面功能点**：
- 列表展示：租户名称、广告主ID、广告主名称、授权状态、账户余额、最后同步时间
- 搜索筛选：按租户名称、广告主名称、授权状态筛选
- 操作按钮：新增、编辑、删除、刷新余额、同步投放数据

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取配置分页 | GET | `/admin-api/finance/platform/qianchuan/page` | 分页查询千川配置列表 |
| 获取配置详情 | GET | `/admin-api/finance/platform/qianchuan/get` | 根据ID获取配置详情 |
| 创建配置 | POST | `/admin-api/finance/platform/qianchuan/create` | 创建千川配置 |
| 更新配置 | PUT | `/admin-api/finance/platform/qianchuan/update` | 更新千川配置 |
| 删除配置 | DELETE | `/admin-api/finance/platform/qianchuan/delete` | 删除千川配置 |
| 刷新账户余额 | POST | `/admin-api/finance/platform/qianchuan/refresh-balance` | 刷新广告账户余额 |
| 同步投放数据 | POST | `/admin-api/finance/platform/qianchuan/sync-ads` | 同步广告投放数据 |

**响应数据（配置详情）**：

```typescript
interface QianchuanConfigRespVO {
  id: number;               // 配置ID
  tenantId: number;         // 租户ID
  tenantName: string;       // 租户名称
  advertiserId: string;     // 广告主ID
  advertiserName: string;   // 广告主名称
  appId: string;            // 应用ID
  appSecret: string;        // 应用密钥（脱敏）
  accessToken: string;      // 访问令牌（脱敏）
  tokenExpireTime: string;  // 令牌过期时间
  status: number;           // 授权状态
  balance: number;          // 账户余额（分）
  dailyBudget: number;      // 日预算（分）
  lastSyncTime: string;     // 最后同步时间
  createTime: string;       // 创建时间
}
```

---

#### 页面4：千川配置表单（platform/qianchuan/QianchuanForm.vue）

**功能描述**：新增/编辑千川配置的表单页面。

**API接口**：复用页面3的创建/更新接口，新增授权链接接口。

---

### 2.3 聚水潭配置管理

#### 页面5：聚水潭配置列表（platform/jst/index.vue）

**功能描述**：展示所有租户的聚水潭ERP授权配置，管理库存、订单数据同步。

**页面功能点**：
- 列表展示：租户名称、公司名称、AppKey、授权状态、同步范围、最后同步时间
- 搜索筛选：按租户名称、公司名称、授权状态筛选
- 操作按钮：新增、编辑、删除、测试连接、同步库存、同步订单

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取配置分页 | GET | `/admin-api/finance/platform/jst/page` | 分页查询聚水潭配置列表 |
| 获取配置详情 | GET | `/admin-api/finance/platform/jst/get` | 根据ID获取配置详情 |
| 创建配置 | POST | `/admin-api/finance/platform/jst/create` | 创建聚水潭配置 |
| 更新配置 | PUT | `/admin-api/finance/platform/jst/update` | 更新聚水潭配置 |
| 删除配置 | DELETE | `/admin-api/finance/platform/jst/delete` | 删除聚水潭配置 |
| 测试连接 | POST | `/admin-api/finance/platform/jst/test-connection` | 测试聚水潭API连接 |
| 同步库存 | POST | `/admin-api/finance/platform/jst/sync-inventory` | 同步库存数据 |
| 同步订单 | POST | `/admin-api/finance/platform/jst/sync-orders` | 同步订单数据 |

**响应数据（配置详情）**：

```typescript
interface JstConfigRespVO {
  id: number;               // 配置ID
  tenantId: number;         // 租户ID
  tenantName: string;       // 租户名称
  companyId: string;        // 聚水潭公司ID
  companyName: string;      // 公司名称
  appKey: string;           // AppKey
  appSecret: string;        // AppSecret（脱敏）
  accessToken: string;      // 访问令牌（脱敏）
  status: number;           // 授权状态
  syncScope: string[];      // 同步范围：inventory, orders, products
  lastInventorySyncTime: string;  // 最后库存同步时间
  lastOrderSyncTime: string;      // 最后订单同步时间
  createTime: string;       // 创建时间
}
```

---

#### 页面6：聚水潭配置表单（platform/jst/JstForm.vue）

**功能描述**：新增/编辑聚水潭配置的表单页面。

**API接口**：复用页面5的创建/更新接口。

---

## 三、数据同步模块（3个页面）

### 3.1 同步任务管理

#### 页面7：同步任务列表（sync/index.vue）

**功能描述**：展示所有数据同步任务的状态和进度，支持手动触发、暂停、重启任务。

**页面功能点**：
- 列表展示：任务名称、任务类型、关联租户、执行状态、进度百分比、上次执行时间、下次执行时间
- 搜索筛选：按任务类型、执行状态、租户筛选
- 操作按钮：立即执行、暂停、恢复、查看日志
- 统计卡片：运行中任务数、今日成功数、今日失败数、待执行数

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取任务分页 | GET | `/admin-api/finance/sync/task/page` | 分页查询同步任务列表 |
| 获取任务详情 | GET | `/admin-api/finance/sync/task/get` | 根据ID获取任务详情 |
| 立即执行任务 | POST | `/admin-api/finance/sync/task/execute` | 立即执行指定任务 |
| 暂停任务 | PUT | `/admin-api/finance/sync/task/pause` | 暂停指定任务 |
| 恢复任务 | PUT | `/admin-api/finance/sync/task/resume` | 恢复指定任务 |
| 获取任务统计 | GET | `/admin-api/finance/sync/task/statistics` | 获取任务执行统计 |

**请求参数（分页查询）**：

```typescript
interface SyncTaskPageReqVO {
  pageNo: number;
  pageSize: number;
  taskType?: string;        // 任务类型：doudian_order, doudian_refund, qianchuan_ads, jst_inventory
  status?: number;          // 执行状态：0-待执行，1-执行中，2-已完成，3-已暂停，4-执行失败
  tenantId?: number;        // 租户ID
}
```

**响应数据（任务详情）**：

```typescript
interface SyncTaskRespVO {
  id: number;               // 任务ID
  taskName: string;         // 任务名称
  taskType: string;         // 任务类型
  tenantId: number;         // 租户ID
  tenantName: string;       // 租户名称
  platformType: string;     // 平台类型：doudian, qianchuan, jst
  status: number;           // 执行状态
  progress: number;         // 进度百分比（0-100）
  totalCount: number;       // 总记录数
  successCount: number;     // 成功数
  failCount: number;        // 失败数
  lastExecuteTime: string;  // 上次执行时间
  nextExecuteTime: string;  // 下次执行时间
  cronExpression: string;   // Cron表达式
  errorMessage: string;     // 错误信息
  createTime: string;       // 创建时间
}

interface SyncTaskStatisticsVO {
  runningCount: number;     // 运行中任务数
  todaySuccessCount: number;// 今日成功数
  todayFailCount: number;   // 今日失败数
  pendingCount: number;     // 待执行数
}
```

---

#### 页面8：同步日志列表（sync/SyncLog.vue）

**功能描述**：展示同步任务的执行日志，包括成功/失败详情、耗时、数据量等。

**页面功能点**：
- 列表展示：任务名称、执行时间、执行结果、耗时、同步数据量、错误信息
- 搜索筛选：按任务名称、执行结果、时间范围筛选
- 详情查看：点击查看详细的执行日志和错误堆栈

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取日志分页 | GET | `/admin-api/finance/sync/log/page` | 分页查询同步日志列表 |
| 获取日志详情 | GET | `/admin-api/finance/sync/log/get` | 根据ID获取日志详情 |
| 导出日志 | GET | `/admin-api/finance/sync/log/export` | 导出同步日志Excel |

**响应数据（日志详情）**：

```typescript
interface SyncLogRespVO {
  id: number;               // 日志ID
  taskId: number;           // 任务ID
  taskName: string;         // 任务名称
  taskType: string;         // 任务类型
  tenantId: number;         // 租户ID
  tenantName: string;       // 租户名称
  executeTime: string;      // 执行时间
  finishTime: string;       // 完成时间
  duration: number;         // 耗时（毫秒）
  result: number;           // 执行结果：0-失败，1-成功，2-部分成功
  totalCount: number;       // 总记录数
  successCount: number;     // 成功数
  failCount: number;        // 失败数
  errorMessage: string;     // 错误信息
  errorStack: string;       // 错误堆栈
  requestData: string;      // 请求数据（JSON）
  responseData: string;     // 响应数据（JSON）
}
```

---

#### 页面9：同步异常处理（sync/SyncException.vue）

**功能描述**：展示同步过程中产生的异常数据，支持重试、忽略、手动处理。

**页面功能点**：
- 列表展示：异常类型、关联任务、异常数据、异常原因、处理状态、创建时间
- 搜索筛选：按异常类型、处理状态、时间范围筛选
- 操作按钮：重试、忽略、手动处理、批量处理

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取异常分页 | GET | `/admin-api/finance/sync/exception/page` | 分页查询异常列表 |
| 获取异常详情 | GET | `/admin-api/finance/sync/exception/get` | 根据ID获取异常详情 |
| 重试异常 | POST | `/admin-api/finance/sync/exception/retry` | 重试处理异常 |
| 忽略异常 | PUT | `/admin-api/finance/sync/exception/ignore` | 忽略异常 |
| 批量重试 | POST | `/admin-api/finance/sync/exception/batch-retry` | 批量重试异常 |
| 批量忽略 | PUT | `/admin-api/finance/sync/exception/batch-ignore` | 批量忽略异常 |

**响应数据（异常详情）**：

```typescript
interface SyncExceptionRespVO {
  id: number;               // 异常ID
  taskId: number;           // 任务ID
  taskName: string;         // 任务名称
  logId: number;            // 日志ID
  tenantId: number;         // 租户ID
  tenantName: string;       // 租户名称
  exceptionType: string;    // 异常类型：data_format, api_error, timeout, duplicate
  exceptionData: string;    // 异常数据（JSON）
  exceptionReason: string;  // 异常原因
  handleStatus: number;     // 处理状态：0-待处理，1-已重试，2-已忽略，3-已手动处理
  retryCount: number;       // 重试次数
  handleTime: string;       // 处理时间
  handleBy: string;         // 处理人
  handleRemark: string;     // 处理备注
  createTime: string;       // 创建时间
}
```

---

## 四、财务报表模块（5个页面）

### 4.1 报表总览

#### 页面10：报表总览（finance/report/index.vue）

**功能描述**：展示全平台财务数据汇总，包括总收入、总支出、利润、订单量等核心指标，支持多维度分析。

**页面功能点**：
- 核心指标卡片：总收入、总支出、净利润、订单总量、平均客单价、退款率
- 趋势图表：收入趋势、利润趋势、订单趋势（日/周/月）
- 租户排行：收入TOP10、利润TOP10、订单量TOP10
- 平台分布：各平台收入占比饼图

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取总览数据 | GET | `/admin-api/finance/report/overview` | 获取财务总览数据 |
| 获取趋势数据 | GET | `/admin-api/finance/report/trend` | 获取趋势图表数据 |
| 获取租户排行 | GET | `/admin-api/finance/report/tenant-ranking` | 获取租户排行榜 |
| 获取平台分布 | GET | `/admin-api/finance/report/platform-distribution` | 获取平台分布数据 |

**请求参数（总览数据）**：

```typescript
interface ReportOverviewReqVO {
  startDate: string;        // 开始日期
  endDate: string;          // 结束日期
  tenantId?: number;        // 租户ID（可选，不传则查询全部）
  platformType?: string;    // 平台类型（可选）
}
```

**响应数据（总览数据）**：

```typescript
interface ReportOverviewRespVO {
  totalRevenue: number;           // 总收入（分）
  totalRevenueGrowth: number;     // 收入环比增长率
  totalExpense: number;           // 总支出（分）
  totalExpenseGrowth: number;     // 支出环比增长率
  netProfit: number;              // 净利润（分）
  netProfitGrowth: number;        // 利润环比增长率
  totalOrders: number;            // 订单总量
  totalOrdersGrowth: number;      // 订单环比增长率
  avgOrderAmount: number;         // 平均客单价（分）
  refundRate: number;             // 退款率（百分比）
  grossProfitMargin: number;      // 毛利率（百分比）
}

interface ReportTrendRespVO {
  dates: string[];                // 日期数组
  revenues: number[];             // 收入数组
  expenses: number[];             // 支出数组
  profits: number[];              // 利润数组
  orders: number[];               // 订单数组
}

interface TenantRankingRespVO {
  tenantId: number;
  tenantName: string;
  value: number;                  // 排行值（收入/利润/订单量）
  growth: number;                 // 环比增长率
}
```

---

#### 页面11：日报表（finance/report/daily.vue）

**功能描述**：展示每日财务数据明细，支持按租户、店铺、平台维度查看。

**页面功能点**：
- 日期选择：选择查看日期
- 维度切换：按租户/店铺/平台维度展示
- 数据表格：日期、维度名称、收入、支出、利润、订单量、客单价
- 导出功能：导出Excel报表

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取日报数据 | GET | `/admin-api/finance/report/daily` | 获取日报表数据 |
| 导出日报 | GET | `/admin-api/finance/report/daily/export` | 导出日报表Excel |

**响应数据（日报数据）**：

```typescript
interface DailyReportRespVO {
  date: string;                   // 日期
  dimension: string;              // 维度类型：tenant, shop, platform
  dimensionId: string;            // 维度ID
  dimensionName: string;          // 维度名称
  revenue: number;                // 收入（分）
  expense: number;                // 支出（分）
  profit: number;                 // 利润（分）
  orderCount: number;             // 订单量
  avgOrderAmount: number;         // 客单价（分）
  refundAmount: number;           // 退款金额（分）
  refundCount: number;            // 退款数量
}
```

---

#### 页面12：月报表（finance/report/monthly.vue）

**功能描述**：展示月度财务数据汇总，支持同比环比分析。

**页面功能点**：
- 月份选择：选择查看月份
- 同比环比：与上月、去年同期对比
- 数据表格：月份、收入、支出、利润、同比、环比
- 趋势图表：近12个月趋势

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取月报数据 | GET | `/admin-api/finance/report/monthly` | 获取月报表数据 |
| 获取月度趋势 | GET | `/admin-api/finance/report/monthly/trend` | 获取近12个月趋势 |
| 导出月报 | GET | `/admin-api/finance/report/monthly/export` | 导出月报表Excel |

---

#### 页面13：租户报表（finance/report/tenant.vue）

**功能描述**：查看单个租户的详细财务报表。

**页面功能点**：
- 租户选择：下拉选择租户
- 时间范围：选择查看时间范围
- 详细报表：收入明细、支出明细、利润分析、订单分析
- 店铺对比：多店铺数据对比

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取租户报表 | GET | `/admin-api/finance/report/tenant/{tenantId}` | 获取租户详细报表 |
| 获取店铺对比 | GET | `/admin-api/finance/report/tenant/{tenantId}/shop-comparison` | 获取店铺对比数据 |

---

#### 页面14：报表导出（finance/report/export.vue）

**功能描述**：批量导出财务报表，支持自定义导出模板和格式。

**页面功能点**：
- 报表类型：选择导出的报表类型（日报/月报/年报/自定义）
- 时间范围：选择导出时间范围
- 维度选择：选择导出维度（租户/店铺/平台）
- 格式选择：Excel/PDF/CSV
- 导出历史：查看历史导出记录

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 创建导出任务 | POST | `/admin-api/finance/report/export/create` | 创建报表导出任务 |
| 获取导出历史 | GET | `/admin-api/finance/report/export/history` | 获取导出历史记录 |
| 下载导出文件 | GET | `/admin-api/finance/report/export/download/{id}` | 下载导出文件 |

---

## 五、数据对账模块（3个页面）

### 5.1 对账管理

#### 页面15：对账总览（finance/reconciliation/index.vue）

**功能描述**：展示全平台数据对账状态，包括订单对账、资金对账、库存对账的整体情况。

**页面功能点**：
- 对账状态卡片：今日待对账、对账中、已完成、异常数量
- 对账进度：各类型对账完成进度
- 异常汇总：各类型异常数量统计
- 快速操作：一键发起对账、查看异常

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取对账总览 | GET | `/admin-api/finance/reconciliation/overview` | 获取对账总览数据 |
| 发起对账 | POST | `/admin-api/finance/reconciliation/start` | 发起对账任务 |
| 获取对账进度 | GET | `/admin-api/finance/reconciliation/progress` | 获取对账进度 |

**响应数据（对账总览）**：

```typescript
interface ReconciliationOverviewRespVO {
  pendingCount: number;           // 待对账数量
  processingCount: number;        // 对账中数量
  completedCount: number;         // 已完成数量
  exceptionCount: number;         // 异常数量
  orderReconciliation: {          // 订单对账
    total: number;
    matched: number;
    unmatched: number;
    progress: number;
  };
  fundReconciliation: {           // 资金对账
    total: number;
    matched: number;
    unmatched: number;
    progress: number;
  };
  inventoryReconciliation: {      // 库存对账
    total: number;
    matched: number;
    unmatched: number;
    progress: number;
  };
}
```

---

#### 页面16：差异列表（finance/reconciliation/diff.vue）

**功能描述**：展示对账过程中发现的数据差异，支持处理和标记。

**页面功能点**：
- 差异列表：差异类型、关联数据、差异金额、差异原因、处理状态
- 搜索筛选：按差异类型、处理状态、金额范围筛选
- 操作按钮：标记已处理、忽略、创建调整单

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取差异分页 | GET | `/admin-api/finance/reconciliation/diff/page` | 分页查询差异列表 |
| 获取差异详情 | GET | `/admin-api/finance/reconciliation/diff/get` | 获取差异详情 |
| 处理差异 | PUT | `/admin-api/finance/reconciliation/diff/handle` | 处理差异 |
| 批量处理 | PUT | `/admin-api/finance/reconciliation/diff/batch-handle` | 批量处理差异 |

**响应数据（差异详情）**：

```typescript
interface ReconciliationDiffRespVO {
  id: number;                     // 差异ID
  diffType: string;               // 差异类型：order, fund, inventory
  tenantId: number;               // 租户ID
  tenantName: string;             // 租户名称
  sourceData: string;             // 源数据（JSON）
  targetData: string;             // 目标数据（JSON）
  diffAmount: number;             // 差异金额（分）
  diffReason: string;             // 差异原因
  handleStatus: number;           // 处理状态：0-待处理，1-已处理，2-已忽略
  handleTime: string;             // 处理时间
  handleBy: string;               // 处理人
  handleRemark: string;           // 处理备注
  createTime: string;             // 创建时间
}
```

---

#### 页面17：异常监控（finance/reconciliation/exception.vue）

**功能描述**：监控对账过程中的异常情况，提供处理建议。

**页面功能点**：
- 异常列表：异常类型、异常描述、影响范围、处理建议、处理状态
- 异常统计：各类型异常数量趋势图
- 告警设置：配置异常告警阈值

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取异常分页 | GET | `/admin-api/finance/reconciliation/exception/page` | 分页查询异常列表 |
| 获取异常统计 | GET | `/admin-api/finance/reconciliation/exception/statistics` | 获取异常统计数据 |
| 处理异常 | PUT | `/admin-api/finance/reconciliation/exception/handle` | 处理异常 |

---

## 六、预警中心模块（3个页面）

### 6.1 预警管理

#### 页面18：预警记录列表（finance/alert/index.vue）

**功能描述**：展示全平台的财务预警记录，包括资金异常、对账异常、同步异常等。

**页面功能点**：
- 预警列表：预警类型、预警级别、预警内容、关联租户、触发时间、处理状态
- 搜索筛选：按预警类型、级别、处理状态、时间范围筛选
- 操作按钮：标记已读、处理、忽略
- 统计卡片：今日预警数、未处理数、各级别数量

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取预警分页 | GET | `/admin-api/finance/alert/page` | 分页查询预警列表 |
| 获取预警详情 | GET | `/admin-api/finance/alert/get` | 获取预警详情 |
| 处理预警 | PUT | `/admin-api/finance/alert/handle` | 处理预警 |
| 批量标记已读 | PUT | `/admin-api/finance/alert/batch-read` | 批量标记已读 |
| 获取预警统计 | GET | `/admin-api/finance/alert/statistics` | 获取预警统计 |

**响应数据（预警详情）**：

```typescript
interface AlertRespVO {
  id: number;                     // 预警ID
  alertType: string;              // 预警类型：fund_abnormal, reconciliation_diff, sync_fail, threshold_exceed
  alertLevel: number;             // 预警级别：1-低，2-中，3-高，4-紧急
  alertTitle: string;             // 预警标题
  alertContent: string;           // 预警内容
  tenantId: number;               // 租户ID
  tenantName: string;             // 租户名称
  relatedData: string;            // 关联数据（JSON）
  triggerTime: string;            // 触发时间
  handleStatus: number;           // 处理状态：0-未处理，1-已处理，2-已忽略
  handleTime: string;             // 处理时间
  handleBy: string;               // 处理人
  handleRemark: string;           // 处理备注
}

interface AlertStatisticsVO {
  todayCount: number;             // 今日预警数
  unhandledCount: number;         // 未处理数
  lowCount: number;               // 低级别数
  mediumCount: number;            // 中级别数
  highCount: number;              // 高级别数
  urgentCount: number;            // 紧急级别数
}
```

---

#### 页面19：预警规则配置（finance/alert/rule.vue）

**功能描述**：配置预警规则，包括全局规则和租户级规则。

**页面功能点**：
- 规则列表：规则名称、规则类型、触发条件、通知方式、状态
- 规则配置：阈值设置、触发条件、通知渠道
- 操作按钮：新增、编辑、启用/禁用、删除

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取规则分页 | GET | `/admin-api/finance/alert/rule/page` | 分页查询规则列表 |
| 获取规则详情 | GET | `/admin-api/finance/alert/rule/get` | 获取规则详情 |
| 创建规则 | POST | `/admin-api/finance/alert/rule/create` | 创建预警规则 |
| 更新规则 | PUT | `/admin-api/finance/alert/rule/update` | 更新预警规则 |
| 删除规则 | DELETE | `/admin-api/finance/alert/rule/delete` | 删除预警规则 |
| 启用/禁用规则 | PUT | `/admin-api/finance/alert/rule/toggle` | 启用/禁用规则 |

**响应数据（规则详情）**：

```typescript
interface AlertRuleRespVO {
  id: number;                     // 规则ID
  ruleName: string;               // 规则名称
  ruleType: string;               // 规则类型：global, tenant
  alertType: string;              // 预警类型
  alertLevel: number;             // 预警级别
  triggerCondition: string;       // 触发条件（JSON）
  thresholdValue: number;         // 阈值
  thresholdUnit: string;          // 阈值单位
  notifyChannels: string[];       // 通知渠道：email, sms, dingtalk, wechat
  notifyUsers: number[];          // 通知用户ID列表
  tenantId?: number;              // 租户ID（租户级规则）
  status: number;                 // 状态：0-禁用，1-启用
  createTime: string;             // 创建时间
}
```

---

#### 页面20：通知配置（finance/alert/notify.vue）

**功能描述**：配置预警通知渠道和接收人。

**页面功能点**：
- 渠道配置：邮件、短信、钉钉、企业微信配置
- 接收人管理：配置各类预警的接收人
- 通知模板：配置通知消息模板
- 测试发送：测试通知渠道是否正常

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取通知配置 | GET | `/admin-api/finance/alert/notify/config` | 获取通知配置 |
| 更新通知配置 | PUT | `/admin-api/finance/alert/notify/config` | 更新通知配置 |
| 测试通知 | POST | `/admin-api/finance/alert/notify/test` | 测试通知发送 |
| 获取通知模板 | GET | `/admin-api/finance/alert/notify/template` | 获取通知模板 |
| 更新通知模板 | PUT | `/admin-api/finance/alert/notify/template` | 更新通知模板 |

---

## 七、运营分析模块（4个页面）

### 7.1 运营数据分析

#### 页面21：租户活跃度分析（finance/analysis/tenant.vue）

**功能描述**：分析租户的活跃度数据，包括DAU、MAU、留存率等。

**页面功能点**：
- 活跃度指标：DAU、WAU、MAU、活跃率
- 留存分析：次日留存、7日留存、30日留存
- 活跃趋势：活跃用户趋势图
- 租户分布：活跃/沉默/流失租户分布

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取活跃度数据 | GET | `/admin-api/finance/analysis/tenant/active` | 获取租户活跃度数据 |
| 获取留存数据 | GET | `/admin-api/finance/analysis/tenant/retention` | 获取留存分析数据 |
| 获取租户分布 | GET | `/admin-api/finance/analysis/tenant/distribution` | 获取租户分布数据 |

**响应数据（活跃度数据）**：

```typescript
interface TenantActiveRespVO {
  dau: number;                    // 日活跃租户数
  dauGrowth: number;              // 日活环比增长
  wau: number;                    // 周活跃租户数
  wauGrowth: number;              // 周活环比增长
  mau: number;                    // 月活跃租户数
  mauGrowth: number;              // 月活环比增长
  activeRate: number;             // 活跃率
  retention: {                    // 留存数据
    day1: number;                 // 次日留存率
    day7: number;                 // 7日留存率
    day30: number;                // 30日留存率
  };
  trend: {                        // 趋势数据
    dates: string[];
    values: number[];
  };
}

interface TenantDistributionRespVO {
  activeCount: number;            // 活跃租户数
  silentCount: number;            // 沉默租户数（7天未登录）
  churnCount: number;             // 流失租户数（30天未登录）
  newCount: number;               // 新增租户数
}
```

---

#### 页面22：收入分析（finance/analysis/revenue.vue）

**功能描述**：分析平台收入数据，包括订阅收入、增值服务收入等。

**页面功能点**：
- 收入概览：总收入、订阅收入、增值服务收入、其他收入
- 收入趋势：收入趋势图（日/周/月）
- 收入构成：各类收入占比饼图
- ARPU分析：每用户平均收入分析

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取收入概览 | GET | `/admin-api/finance/analysis/revenue/overview` | 获取收入概览数据 |
| 获取收入趋势 | GET | `/admin-api/finance/analysis/revenue/trend` | 获取收入趋势数据 |
| 获取收入构成 | GET | `/admin-api/finance/analysis/revenue/composition` | 获取收入构成数据 |
| 获取ARPU数据 | GET | `/admin-api/finance/analysis/revenue/arpu` | 获取ARPU分析数据 |

**响应数据（收入概览）**：

```typescript
interface RevenueOverviewRespVO {
  totalRevenue: number;           // 总收入（分）
  totalRevenueGrowth: number;     // 收入环比增长
  subscriptionRevenue: number;    // 订阅收入（分）
  subscriptionGrowth: number;     // 订阅收入环比增长
  valueAddedRevenue: number;      // 增值服务收入（分）
  valueAddedGrowth: number;       // 增值服务收入环比增长
  otherRevenue: number;           // 其他收入（分）
  arpu: number;                   // 每用户平均收入（分）
  arpuGrowth: number;             // ARPU环比增长
}
```

---

#### 页面23：趋势分析（finance/analysis/trend.vue）

**功能描述**：分析平台各项指标的趋势变化。

**页面功能点**：
- 用户增长趋势：新增租户、累计租户趋势
- 数据量趋势：订单量、同步数据量趋势
- 使用趋势：API调用量、功能使用频率
- 预测分析：基于历史数据的趋势预测

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取用户增长趋势 | GET | `/admin-api/finance/analysis/trend/user-growth` | 获取用户增长趋势 |
| 获取数据量趋势 | GET | `/admin-api/finance/analysis/trend/data-volume` | 获取数据量趋势 |
| 获取使用趋势 | GET | `/admin-api/finance/analysis/trend/usage` | 获取使用趋势 |
| 获取趋势预测 | GET | `/admin-api/finance/analysis/trend/forecast` | 获取趋势预测 |

---

#### 页面24：运营仪表盘（finance/analysis/dashboard.vue）

**功能描述**：运营核心指标汇总仪表盘，一目了然查看平台运营状况。

**页面功能点**：
- 核心指标：租户总数、活跃租户、总收入、总订单量
- 实时数据：今日新增租户、今日收入、今日订单
- 健康度评分：平台健康度综合评分
- 快速入口：跳转到各分析页面

**API接口设计**：

| 接口名称 | 请求方式 | URL | 功能描述 |
|---------|---------|-----|---------|
| 获取仪表盘数据 | GET | `/admin-api/finance/analysis/dashboard` | 获取仪表盘数据 |
| 获取实时数据 | GET | `/admin-api/finance/analysis/dashboard/realtime` | 获取实时数据 |
| 获取健康度评分 | GET | `/admin-api/finance/analysis/dashboard/health-score` | 获取健康度评分 |

**响应数据（仪表盘数据）**：

```typescript
interface DashboardRespVO {
  totalTenants: number;           // 租户总数
  activeTenants: number;          // 活跃租户数
  totalRevenue: number;           // 总收入（分）
  totalOrders: number;            // 总订单量
  todayNewTenants: number;        // 今日新增租户
  todayRevenue: number;           // 今日收入（分）
  todayOrders: number;            // 今日订单量
  healthScore: number;            // 健康度评分（0-100）
  healthStatus: string;           // 健康状态：excellent, good, warning, critical
  alerts: {                       // 预警摘要
    unhandledCount: number;
    urgentCount: number;
  };
}
```

---

## 八、API接口汇总

### 8.1 接口统计

| 模块 | 页面数 | API接口数 |
|------|--------|----------|
| 平台集成 | 6 | 21 |
| 数据同步 | 3 | 15 |
| 财务报表 | 5 | 14 |
| 数据对账 | 3 | 10 |
| 预警中心 | 3 | 14 |
| 运营分析 | 4 | 13 |
| **总计** | **24** | **87** |

### 8.2 权限设计

| 权限标识 | 权限名称 | 关联页面 |
|---------|---------|---------|
| `finance:doudian:query` | 抖店配置查询 | 抖店配置列表 |
| `finance:doudian:create` | 抖店配置创建 | 抖店配置表单 |
| `finance:doudian:update` | 抖店配置更新 | 抖店配置表单 |
| `finance:doudian:delete` | 抖店配置删除 | 抖店配置列表 |
| `finance:qianchuan:query` | 千川配置查询 | 千川配置列表 |
| `finance:qianchuan:create` | 千川配置创建 | 千川配置表单 |
| `finance:qianchuan:update` | 千川配置更新 | 千川配置表单 |
| `finance:qianchuan:delete` | 千川配置删除 | 千川配置列表 |
| `finance:jst:query` | 聚水潭配置查询 | 聚水潭配置列表 |
| `finance:jst:create` | 聚水潭配置创建 | 聚水潭配置表单 |
| `finance:jst:update` | 聚水潭配置更新 | 聚水潭配置表单 |
| `finance:jst:delete` | 聚水潭配置删除 | 聚水潭配置列表 |
| `finance:sync:query` | 同步任务查询 | 同步任务列表 |
| `finance:sync:execute` | 同步任务执行 | 同步任务列表 |
| `finance:sync:manage` | 同步任务管理 | 同步任务列表 |
| `finance:report:query` | 财务报表查询 | 报表页面 |
| `finance:report:export` | 财务报表导出 | 报表导出 |
| `finance:reconciliation:query` | 对账查询 | 对账页面 |
| `finance:reconciliation:handle` | 对账处理 | 对账页面 |
| `finance:alert:query` | 预警查询 | 预警列表 |
| `finance:alert:handle` | 预警处理 | 预警列表 |
| `finance:alert:rule:manage` | 预警规则管理 | 预警规则 |
| `finance:analysis:query` | 运营分析查询 | 分析页面 |

---

## 参考资料

- [RuoYi-Vue-Pro官方文档](https://doc.iocoder.cn/)
- [RESTful API设计规范](https://restfulapi.net/)
- [闪电帐PRO开发规范指南](../README.md)
