# 6个模块Java后端API接口规范文档

**文档版本**：v1.0  
**创建日期**：2025-01-16  
**适用项目**：闪电帐PRO SAAS系统  
**遵循规范**：阿里巴巴Java开发手册、RuoYi-Vue-Pro框架规范

---

## 一、概述

本文档定义了财务核算、资金管理、库存成本、经营分析、费用中心、税务管理6个模块的Java后端API接口规范。所有接口负责从抖店订单API、千川推广API、聚水潭ERP API获取数据并进行勾稽计算。

**架构原则**：所有数据库操作和业务计算由Java后端实现，前端只负责API调用。

---

## 二、通用规范

### 2.1 请求规范

**请求头**：
```
Content-Type: application/json
Authorization: Bearer {token}
tenant-id: {租户ID}
```

**通用请求参数**：
```java
public class BaseQueryReqVO {
    @NotNull(message = "店铺ID不能为空")
    private Long shopId;
    
    @NotNull(message = "开始日期不能为空")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    
    @NotNull(message = "结束日期不能为空")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
}
```

### 2.2 响应规范

**统一响应格式**：
```java
public class CommonResult<T> {
    private Integer code;    // 状态码：0成功，非0失败
    private String msg;      // 提示信息
    private T data;          // 业务数据
}
```

### 2.3 数据源标识

所有响应必须包含数据源信息：
```java
public class DataSourceInfo {
    private SyncInfo doudian;    // 抖店数据源
    private SyncInfo qianchuan;  // 千川数据源
    private SyncInfo jst;        // 聚水潭数据源
}

public class SyncInfo {
    private LocalDateTime syncTime;  // 同步时间
    private Integer recordCount;     // 记录数量
}
```

---

## 三、财务核算模块（Accounting）

### 3.1 获取财务核算概览

**接口路径**：`GET /admin-api/finance/accounting/overview`

**请求参数**：
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| startDate | String | 是 | 开始日期(yyyy-MM-dd) |
| endDate | String | 是 | 结束日期(yyyy-MM-dd) |

**响应数据**：
```java
public class AccountingOverviewRespVO {
    // 收入数据（来源：抖店订单API）
    private BigDecimal salesRevenue;      // 销售收入
    private BigDecimal refundAmount;      // 退款金额
    private BigDecimal netSales;          // 净销售额
    
    // 成本数据（来源：聚水潭ERP API）
    private BigDecimal productCost;       // 商品成本
    
    // 费用数据（来源：抖店+千川API）
    private BigDecimal commissionFee;     // 达人佣金（抖店）
    private BigDecimal serviceFee;        // 平台服务费（抖店）
    private BigDecimal promotionCost;     // 推广费用（千川）
    private BigDecimal shippingFee;       // 快递费用（抖店）
    private BigDecimal insuranceFee;      // 保险费用（抖店）
    private BigDecimal afterSaleCost;     // 售后赔付（抖店）
    
    // 利润数据（计算字段）
    private BigDecimal grossProfit;       // 毛利润
    private BigDecimal netProfit;         // 净利润
    private BigDecimal grossProfitRate;   // 毛利率
    private BigDecimal netProfitRate;     // 净利率
    
    // 数据源信息
    private DataSourceInfo dataSource;
}
```

**Java Service实现要点**：
```java
@Service
public class AccountingServiceImpl implements AccountingService {
    
    @Resource
    private DoudianApiClient doudianApiClient;
    
    @Resource
    private QianchuanApiClient qianchuanApiClient;
    
    @Resource
    private JstApiClient jstApiClient;
    
    @Override
    public AccountingOverviewRespVO getOverview(AccountingQueryReqVO reqVO) {
        // 1. 从抖店API获取订单数据
        DoudianOrderSummary orderSummary = doudianApiClient.getOrderSummary(
            reqVO.getShopId(), reqVO.getStartDate(), reqVO.getEndDate());
        
        // 2. 从千川API获取推广数据
        QianchuanCostSummary promotionSummary = qianchuanApiClient.getCostSummary(
            reqVO.getShopId(), reqVO.getStartDate(), reqVO.getEndDate());
        
        // 3. 从聚水潭API获取成本数据
        JstCostSummary costSummary = jstApiClient.getCostSummary(
            reqVO.getShopId(), reqVO.getStartDate(), reqVO.getEndDate());
        
        // 4. 计算财务指标
        BigDecimal netSales = orderSummary.getSalesRevenue()
            .subtract(orderSummary.getRefundAmount());
        BigDecimal grossProfit = netSales.subtract(costSummary.getProductCost());
        BigDecimal netProfit = grossProfit
            .subtract(orderSummary.getCommissionFee())
            .subtract(orderSummary.getServiceFee())
            .subtract(promotionSummary.getCost())
            .subtract(orderSummary.getShippingFee())
            .subtract(orderSummary.getInsuranceFee())
            .subtract(orderSummary.getAfterSaleCost());
        
        // 5. 组装响应
        return AccountingOverviewRespVO.builder()
            .salesRevenue(orderSummary.getSalesRevenue())
            .refundAmount(orderSummary.getRefundAmount())
            .netSales(netSales)
            .productCost(costSummary.getProductCost())
            .commissionFee(orderSummary.getCommissionFee())
            .serviceFee(orderSummary.getServiceFee())
            .promotionCost(promotionSummary.getCost())
            .shippingFee(orderSummary.getShippingFee())
            .insuranceFee(orderSummary.getInsuranceFee())
            .afterSaleCost(orderSummary.getAfterSaleCost())
            .grossProfit(grossProfit)
            .netProfit(netProfit)
            .grossProfitRate(calculateRate(grossProfit, netSales))
            .netProfitRate(calculateRate(netProfit, netSales))
            .dataSource(buildDataSourceInfo(orderSummary, promotionSummary, costSummary))
            .build();
    }
}
```

### 3.2 获取财务核算趋势

**接口路径**：`GET /admin-api/finance/accounting/trends`

**请求参数**：
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| startDate | String | 是 | 开始日期 |
| endDate | String | 是 | 结束日期 |
| dimension | String | 否 | 维度(day/week/month)，默认day |

**响应数据**：
```java
public class AccountingTrendsRespVO {
    private List<AccountingTrendItem> trends;
    private DataSourceInfo dataSource;
}

public class AccountingTrendItem {
    private String date;              // 日期
    private BigDecimal salesRevenue;  // 销售收入（抖店）
    private BigDecimal productCost;   // 商品成本（聚水潭）
    private BigDecimal promotionCost; // 推广费用（千川）
    private BigDecimal grossProfit;   // 毛利润
    private BigDecimal netProfit;     // 净利润
}
```

### 3.3 导出财务核算报表

**接口路径**：`GET /admin-api/finance/accounting/export`

**请求参数**：同获取概览接口

**响应**：Excel文件流

---

## 四、资金管理模块（Funds）

### 4.1 获取资金管理概览

**接口路径**：`GET /admin-api/finance/funds/overview`

**请求参数**：
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| startDate | String | 是 | 开始日期 |
| endDate | String | 是 | 结束日期 |

**响应数据**：
```java
public class FundsOverviewRespVO {
    // 资金流入（来源：抖店订单API）
    private FundsInflowVO inflow;
    
    // 资金流出（来源：抖店+千川+聚水潭API）
    private FundsOutflowVO outflow;
    
    // 资金净流入（计算字段）
    private BigDecimal netCashflow;
    
    // 账户余额
    private FundsBalanceVO balance;
    
    // 数据源信息
    private DataSourceInfo dataSource;
}

public class FundsInflowVO {
    private BigDecimal orderIncome;    // 订单收入（抖店）
    private BigDecimal otherIncome;    // 其他收入
    private BigDecimal totalInflow;    // 总流入
}

public class FundsOutflowVO {
    private BigDecimal refundExpense;      // 退款支出（抖店）
    private BigDecimal promotionExpense;   // 推广支出（千川）
    private BigDecimal purchaseExpense;    // 采购支出（聚水潭）
    private BigDecimal commissionExpense;  // 佣金支出（抖店）
    private BigDecimal serviceFeeExpense;  // 服务费支出（抖店）
    private BigDecimal shippingExpense;    // 快递费支出（抖店）
    private BigDecimal totalOutflow;       // 总流出
}

public class FundsBalanceVO {
    private BigDecimal doudianBalance;    // 抖店余额
    private BigDecimal qianchuanBalance;  // 千川余额
    private BigDecimal totalBalance;      // 总余额
}
```

### 4.2 获取资金流水列表

**接口路径**：`GET /admin-api/finance/funds/cashflow/page`

**请求参数**：
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| startDate | String | 是 | 开始日期 |
| endDate | String | 是 | 结束日期 |
| type | String | 否 | 流水类型(income/expense) |
| source | String | 否 | 数据来源(doudian/qianchuan/jst) |
| pageNo | Integer | 否 | 页码，默认1 |
| pageSize | Integer | 否 | 每页条数，默认20 |

**响应数据**：
```java
public class PageResult<CashflowRespVO> {
    private List<CashflowRespVO> list;
    private Long total;
}

public class CashflowRespVO {
    private Long id;
    private String flowNo;            // 流水号
    private String type;              // 类型(income/expense)
    private BigDecimal amount;        // 金额
    private String source;            // 来源(doudian/qianchuan/jst)
    private String sourceOrderNo;     // 来源单号
    private String category;          // 分类
    private String remark;            // 备注
    private LocalDateTime createTime; // 创建时间
}
```

### 4.3 资金调拨

**接口路径**：`POST /admin-api/finance/funds/transfer`

**请求参数**：
```java
public class FundsTransferReqVO {
    @NotNull
    private Long shopId;
    @NotNull
    private String fromAccount;    // 来源账户
    @NotNull
    private String toAccount;      // 目标账户
    @NotNull
    private BigDecimal amount;     // 调拨金额
    private String remark;         // 备注
}
```

### 4.4 发起提现

**接口路径**：`POST /admin-api/finance/funds/withdraw`

**请求参数**：
```java
public class FundsWithdrawReqVO {
    @NotNull
    private Long shopId;
    @NotNull
    private String account;        // 提现账户
    @NotNull
    private BigDecimal amount;     // 提现金额
    @NotNull
    private String bankAccount;    // 银行账户
    private String remark;         // 备注
}
```

---

## 五、库存成本模块（Inventory）

### 5.1 获取库存成本概览

**接口路径**：`GET /admin-api/finance/inventory/overview`

**请求参数**：
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| startDate | String | 是 | 开始日期 |
| endDate | String | 是 | 结束日期 |
| skuId | String | 否 | SKU编码 |

**响应数据**：
```java
public class InventoryOverviewRespVO {
    // 汇总数据
    private InventorySummaryVO summary;
    
    // SKU列表
    private List<InventorySkuVO> skuList;
    
    // 数据源信息
    private DataSourceInfo dataSource;
}

public class InventorySummaryVO {
    private Integer totalSku;            // SKU总数
    private Integer totalInboundQty;     // 入库总数量（聚水潭）
    private BigDecimal totalInboundAmount; // 入库总金额（聚水潭）
    private Integer totalSalesQty;       // 销售总数量（抖店）
    private BigDecimal totalSalesCost;   // 销售成本
    private BigDecimal avgCost;          // 平均成本
    private BigDecimal turnoverRate;     // 库存周转率
    private Integer turnoverDays;        // 库存周转天数
}

public class InventorySkuVO {
    private String skuId;                // SKU编码
    private String skuName;              // SKU名称
    private Integer inboundQty;          // 入库数量（聚水潭）
    private BigDecimal inboundAmount;    // 入库金额（聚水潭）
    private Integer salesQty;            // 销售数量（抖店）
    private BigDecimal avgCost;          // 平均成本
    private Integer currentStock;        // 当前库存
    private BigDecimal costChange;       // 成本变动率
}
```

### 5.2 更新成本计价方法

**接口路径**：`PUT /admin-api/finance/inventory/costing-method`

**请求参数**：
```java
public class CostingMethodReqVO {
    @NotNull
    private Long shopId;
    @NotNull
    private String method;    // 计价方法(FIFO/LIFO/WEIGHTED_AVG/LATEST)
}
```

### 5.3 同步库存数据

**接口路径**：`POST /admin-api/finance/inventory/sync`

**请求参数**：
```java
public class InventorySyncReqVO {
    @NotNull
    private Long shopId;
    private LocalDate startDate;    // 同步开始日期
    private LocalDate endDate;      // 同步结束日期
}
```

---

## 六、经营分析模块（Analysis）

### 6.1 获取经营分析概览

**接口路径**：`GET /admin-api/finance/analysis/overview`

**请求参数**：
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| startDate | String | 是 | 开始日期 |
| endDate | String | 是 | 结束日期 |
| dimension | String | 否 | 维度(day/week/month) |

**响应数据**：
```java
public class AnalysisOverviewRespVO {
    // ROI分析
    private AnalysisRoiVO roi;
    
    // 转化分析（来源：千川API）
    private AnalysisConversionVO conversion;
    
    // 订单指标（来源：抖店API）
    private AnalysisOrderMetricsVO orderMetrics;
    
    // 盈亏平衡分析
    private AnalysisBreakevenVO breakeven;
    
    // 趋势数据
    private List<AnalysisTrendVO> trends;
    
    // 数据源信息
    private DataSourceInfo dataSource;
}

public class AnalysisRoiVO {
    private BigDecimal promotionROI;    // 推广ROI（千川）
    private BigDecimal orderROI;        // 订单ROI
    private BigDecimal totalInvestment; // 总投入
    private BigDecimal totalReturn;     // 总回报
}

public class AnalysisConversionVO {
    private Long showCount;           // 展示数（千川）
    private Long clickCount;          // 点击数（千川）
    private Long convertCount;        // 转化数（千川）
    private BigDecimal clickRate;     // 点击率
    private BigDecimal convertRate;   // 转化率
}

public class AnalysisOrderMetricsVO {
    private Long orderCount;          // 订单数（抖店）
    private BigDecimal avgOrderValue; // 客单价
    private BigDecimal repeatRate;    // 复购率
}

public class AnalysisBreakevenVO {
    private BigDecimal fixedCost;         // 固定成本
    private BigDecimal variableCostRate;  // 变动成本率
    private BigDecimal breakevenPoint;    // 盈亏平衡点
    private String currentStatus;         // 当前状态(profit/loss/breakeven)
}

public class AnalysisTrendVO {
    private String date;                  // 日期
    private BigDecimal revenue;           // 收入（抖店）
    private BigDecimal cost;              // 成本（聚水潭+千川）
    private BigDecimal profit;            // 利润
    private BigDecimal promotionCost;     // 推广费（千川）
}
```

### 6.2 获取对比分析

**接口路径**：`GET /admin-api/finance/analysis/compare`

**请求参数**：
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| currentStartDate | String | 是 | 当前周期开始日期 |
| currentEndDate | String | 是 | 当前周期结束日期 |
| compareStartDate | String | 是 | 对比周期开始日期 |
| compareEndDate | String | 是 | 对比周期结束日期 |

**响应数据**：
```java
public class AnalysisCompareRespVO {
    private AnalysisOverviewRespVO current;   // 当前周期数据
    private AnalysisOverviewRespVO compare;   // 对比周期数据
    private AnalysisChangeVO change;          // 变化数据
}

public class AnalysisChangeVO {
    private BigDecimal revenueChange;         // 收入变化率
    private BigDecimal profitChange;          // 利润变化率
    private BigDecimal roiChange;             // ROI变化率
    private BigDecimal orderCountChange;      // 订单数变化率
}
```

---

## 七、费用中心模块（Expense）

### 7.1 获取费用中心概览

**接口路径**：`GET /admin-api/finance/expense/overview`

**请求参数**：
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| startDate | String | 是 | 开始日期 |
| endDate | String | 是 | 结束日期 |
| category | String | 否 | 费用分类 |

**响应数据**：
```java
public class ExpenseOverviewRespVO {
    // 汇总数据
    private ExpenseSummaryVO summary;
    
    // 费用明细
    private ExpenseBreakdownVO breakdown;
    
    // 趋势数据
    private List<ExpenseTrendVO> trends;
    
    // 预算数据
    private ExpenseBudgetVO budget;
    
    // 数据源信息
    private DataSourceInfo dataSource;
}

public class ExpenseSummaryVO {
    private BigDecimal totalExpense;    // 总费用
    private BigDecimal totalRevenue;    // 总收入（抖店）
    private BigDecimal expenseRate;     // 费用率
}

public class ExpenseBreakdownVO {
    private BigDecimal promotionFee;    // 推广费用（千川）
    private BigDecimal commissionFee;   // 达人佣金（抖店）
    private BigDecimal serviceFee;      // 平台服务费（抖店）
    private BigDecimal shippingFee;     // 快递费用（抖店）
    private BigDecimal insuranceFee;    // 保险费用（抖店）
    private BigDecimal afterSaleFee;    // 售后赔付（抖店）
    private BigDecimal purchaseFee;     // 采购费用（聚水潭）
    private BigDecimal storageFee;      // 仓储费用（聚水潭）
    private BigDecimal otherFee;        // 其他费用
}

public class ExpenseTrendVO {
    private String date;                // 日期
    private BigDecimal promotionFee;    // 推广费用（千川）
    private BigDecimal commissionFee;   // 达人佣金（抖店）
    private BigDecimal serviceFee;      // 平台服务费（抖店）
    private BigDecimal shippingFee;     // 快递费用（抖店）
    private BigDecimal totalFee;        // 总费用
}

public class ExpenseBudgetVO {
    private BigDecimal totalBudget;     // 总预算
    private BigDecimal usedBudget;      // 已用预算
    private BigDecimal remainingBudget; // 剩余预算
    private BigDecimal usageRate;       // 使用率
    private String alertLevel;          // 预警级别(normal/warning/danger)
}
```

### 7.2 录入费用

**接口路径**：`POST /admin-api/finance/expense/create`

**请求参数**：
```java
public class ExpenseCreateReqVO {
    @NotNull
    private Long shopId;
    @NotNull
    private String category;       // 费用分类
    @NotNull
    private BigDecimal amount;     // 金额
    @NotNull
    private LocalDate expenseDate; // 费用日期
    private String remark;         // 备注
    private String attachments;    // 附件
}
```

### 7.3 设置预算

**接口路径**：`POST /admin-api/finance/expense/budget`

**请求参数**：
```java
public class ExpenseBudgetReqVO {
    @NotNull
    private Long shopId;
    @NotNull
    private String category;       // 费用分类
    @NotNull
    private BigDecimal budget;     // 预算金额
    @NotNull
    private String period;         // 周期(month/quarter/year)
    private BigDecimal alertThreshold; // 预警阈值(0-1)
}
```

---

## 八、税务管理模块（Tax）

### 8.1 获取税务管理概览

**接口路径**：`GET /admin-api/finance/tax/overview`

**请求参数**：
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| startDate | String | 是 | 开始日期 |
| endDate | String | 是 | 结束日期 |
| taxRate | BigDecimal | 否 | 税率，默认0.13 |

**响应数据**：
```java
public class TaxOverviewRespVO {
    // 汇总数据
    private TaxSummaryVO summary;
    
    // 税费明细
    private TaxBreakdownVO breakdown;
    
    // 趋势数据
    private List<TaxTrendVO> trends;
    
    // 预警信息
    private TaxAlertVO alert;
    
    // 数据源信息
    private DataSourceInfo dataSource;
}

public class TaxSummaryVO {
    private BigDecimal salesRevenue;    // 销售收入（抖店）
    private BigDecimal outputTax;       // 销项税额
    private BigDecimal purchaseAmount;  // 采购金额（聚水潭）
    private BigDecimal inputTax;        // 进项税额
    private BigDecimal taxPayable;      // 应纳税额
    private BigDecimal taxBurdenRate;   // 税负率
}

public class TaxBreakdownVO {
    private BigDecimal vatOutput;       // 增值税销项
    private BigDecimal vatInput;        // 增值税进项
    private BigDecimal vatPayable;      // 增值税应纳
    private BigDecimal additionalTax;   // 附加税
    private BigDecimal incomeTax;       // 所得税
    private BigDecimal totalTax;        // 税费合计
}

public class TaxTrendVO {
    private String month;               // 月份
    private BigDecimal salesRevenue;    // 销售收入（抖店）
    private BigDecimal purchaseAmount;  // 采购金额（聚水潭）
    private BigDecimal taxPayable;      // 应纳税额
    private BigDecimal taxBurdenRate;   // 税负率
}

public class TaxAlertVO {
    private Boolean taxBurdenAlert;     // 税负率预警
    private Boolean invoiceAlert;       // 发票预警
    private String alertLevel;          // 预警级别(normal/warning/danger)
    private String alertMessage;        // 预警信息
}
```

### 8.2 生成税务报表

**接口路径**：`GET /admin-api/finance/tax/report`

**请求参数**：
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| shopId | Long | 是 | 店铺ID |
| month | String | 是 | 月份(yyyy-MM) |
| reportType | String | 是 | 报表类型(vat/income/summary) |

**响应数据**：
```java
public class TaxReportRespVO {
    private String reportType;          // 报表类型
    private String month;               // 月份
    private Object reportData;          // 报表数据（根据类型不同）
    private LocalDateTime generateTime; // 生成时间
}
```

### 8.3 配置税务预警

**接口路径**：`POST /admin-api/finance/tax/alert-config`

**请求参数**：
```java
public class TaxAlertConfigReqVO {
    @NotNull
    private Long shopId;
    private BigDecimal taxBurdenThreshold;  // 税负率预警阈值
    private BigDecimal invoiceThreshold;    // 发票预警阈值
    private Boolean enableAlert;            // 是否启用预警
    private String notifyMethod;            // 通知方式(email/sms/system)
}
```

---

## 九、数据勾稽验证接口

### 9.1 执行数据勾稽

**接口路径**：`POST /admin-api/finance/reconciliation/execute`

**请求参数**：
```java
public class ReconciliationExecuteReqVO {
    @NotNull
    private Long shopId;
    @NotNull
    private LocalDate date;           // 勾稽日期
    @NotNull
    private List<String> modules;     // 勾稽模块列表
}
```

**响应数据**：
```java
public class ReconciliationResultVO {
    private String status;            // 状态(success/warning/error)
    private List<ReconciliationItemVO> items;
    private LocalDateTime executeTime;
}

public class ReconciliationItemVO {
    private String module;            // 模块名称
    private String indicator;         // 指标名称
    private BigDecimal expectedValue; // 预期值
    private BigDecimal actualValue;   // 实际值
    private BigDecimal difference;    // 差异值
    private String status;            // 状态(match/mismatch)
    private String source;            // 数据来源
}
```

---

## 十、错误码定义

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 1001001 | 抖店API调用失败 |
| 1001002 | 千川API调用失败 |
| 1001003 | 聚水潭API调用失败 |
| 1002001 | 数据勾稽失败 |
| 1002002 | 数据不一致 |

---

**文档结束**
