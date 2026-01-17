# 闪电账PRO Java完整代码包

本目录包含了"闪电账PRO"从Node.js迁移到Java的完整代码实现，可直接集成到RuoYi-Vue-Pro框架中。

## 📁 目录结构

```
java-complete/
├── entity/              # 数据库实体类（DO）
│   ├── OrderDO.java
│   ├── DailyStatsDO.java
│   ├── QianchuanConfigDO.java
│   ├── QianchuanExpenseDO.java
│   ├── JstConfigDO.java
│   ├── JstPurchaseInDO.java
│   └── SyncLogDO.java
├── mapper/              # MyBatis Mapper接口
│   ├── OrderMapper.java
│   └── DailyStatsMapper.java
├── mapper-xml/          # MyBatis Mapper XML文件
│   ├── OrderMapper.xml
│   └── DailyStatsMapper.xml
├── service/             # Service接口
│   └── OrderService.java
├── service-impl/        # Service实现类
│   └── OrderServiceImpl.java
├── controller/          # Controller控制器
│   └── OrderController.java
├── vo/                  # 视图对象（VO）
│   └── OrderVO.java
├── config/              # 配置类
│   ├── FinanceConfig.java
│   └── application-finance.yml
└── README.md            # 本文件
```

## 📋 文件清单

### 实体类（Entity）- 7个文件
- **OrderDO.java** - 订单实体类（35个字段）
- **DailyStatsDO.java** - 每日统计实体类（19个字段）
- **QianchuanConfigDO.java** - 千川配置实体类
- **QianchuanExpenseDO.java** - 千川推广费实体类
- **JstConfigDO.java** - 聚水潭配置实体类
- **JstPurchaseInDO.java** - 聚水潭入库单实体类
- **SyncLogDO.java** - 同步日志实体类

### Mapper接口 - 2个文件
- **OrderMapper.java** - 订单Mapper接口（12个查询方法）
- **DailyStatsMapper.java** - 每日统计Mapper接口（10个查询方法）

### Mapper XML - 2个文件
- **OrderMapper.xml** - 订单Mapper SQL定义（支持分页、搜索、筛选、统计）
- **DailyStatsMapper.xml** - 每日统计Mapper SQL定义（支持趋势分析、费用分布）

### Service层 - 2个文件
- **OrderService.java** - 订单Service接口（13个业务方法）
- **OrderServiceImpl.java** - 订单Service实现类（完整的业务逻辑）

### Controller层 - 1个文件
- **OrderController.java** - 订单Controller（8个REST API端点）

### VO层 - 1个文件
- **OrderVO.java** - 订单视图对象（与前端交互）

### 配置 - 2个文件
- **FinanceConfig.java** - 财务模块配置类（常量、枚举定义）
- **application-finance.yml** - 应用配置文件（API配置、定时任务配置）

## 🚀 集成步骤

### 1. 复制文件到RuoYi项目

```bash
# 假设RuoYi项目路径为 ~/flash-saas

# 复制实体类
cp entity/*.java ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/entity/

# 复制Mapper接口
cp mapper/*.java ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/mapper/

# 复制Mapper XML
cp mapper-xml/*.xml ~/flash-saas/flash-module-finance/src/main/resources/mapper/finance/

# 复制Service接口和实现
cp service/*.java ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/service/
cp service-impl/*.java ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/service/impl/

# 复制Controller
cp controller/*.java ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/controller/

# 复制VO
cp vo/*.java ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/vo/

# 复制配置类
cp config/FinanceConfig.java ~/flash-saas/flash-module-finance/src/main/java/com/flash/module/finance/config/

# 合并应用配置
cat config/application-finance.yml >> ~/flash-saas/flash-server/src/main/resources/application.yml
```

### 2. 执行数据库迁移

```bash
# 执行SQL脚本创建数据库表
mysql -u root -p < ../sql/finance_schema.sql
```

### 3. 配置环境变量

在 `application.yml` 或 `.env` 文件中配置以下环境变量：

```yaml
# 抖店API配置
DOUDIAN_APP_KEY: your_app_key
DOUDIAN_APP_SECRET: your_app_secret

# 巨量千川API配置
QIANCHUAN_APP_ID: your_app_id
QIANCHUAN_APP_SECRET: your_app_secret

# 聚水潭ERP API配置
JUSHUITAN_PARTNER_ID: your_partner_id
JUSHUITAN_PARTNER_SECRET: your_partner_secret
```

### 4. 编译和测试

```bash
# 进入RuoYi项目目录
cd ~/flash-saas

# 编译项目
mvn clean install

# 运行单元测试
mvn test

# 启动应用
mvn spring-boot:run
```

## 📝 API文档

### 订单管理API

#### 分页查询订单列表
```
GET /finance/order/page?pageNo=1&pageSize=10&orderNo=&productTitle=&province=&orderStatus=&startDate=&endDate=
```

#### 按日期范围查询订单
```
GET /finance/order/list?startDate=2025-04-01&endDate=2025-04-30
```

#### 查询订单统计
```
GET /finance/order/count?startDate=2025-04-01&endDate=2025-04-30
```

#### 按订单号查询订单
```
GET /finance/order/{orderNo}
```

#### 创建订单
```
POST /finance/order
Content-Type: application/json

{
  "orderNo": "20250401001",
  "productId": "123456",
  "sku": "SKU001",
  "productTitle": "商品名称",
  "quantity": 1,
  "unitPrice": 100.00,
  "payableAmount": 100.00,
  "recipientName": "收件人",
  "recipientPhone": "13800138000",
  "recipientAddress": "地址",
  "province": "浙江省",
  "city": "杭州市",
  "district": "西湖区"
}
```

#### 更新订单
```
PUT /finance/order/{orderId}
Content-Type: application/json

{
  "orderNo": "20250401001",
  "productId": "123456",
  "sku": "SKU001",
  "productTitle": "商品名称",
  "quantity": 1,
  "unitPrice": 100.00,
  "payableAmount": 100.00,
  "recipientName": "收件人",
  "recipientPhone": "13800138000",
  "recipientAddress": "地址",
  "province": "浙江省",
  "city": "杭州市",
  "district": "西湖区"
}
```

#### 删除订单
```
DELETE /finance/order/{orderId}
```

#### 按省份统计订单
```
GET /finance/order/stats/province?startDate=2025-04-01&endDate=2025-04-30
```

#### 批量导入订单
```
POST /finance/order/import
Content-Type: application/json

[
  {
    "orderNo": "20250401001",
    "productId": "123456",
    "sku": "SKU001",
    "productTitle": "商品名称",
    "quantity": 1,
    "unitPrice": 100.00,
    "payableAmount": 100.00,
    "recipientName": "收件人",
    "recipientPhone": "13800138000",
    "recipientAddress": "地址",
    "province": "浙江省",
    "city": "杭州市",
    "district": "西湖区"
  }
]
```

## 🔧 配置说明

### 财务模块配置（application-finance.yml）

#### 抖店API配置
```yaml
finance:
  doudian:
    baseUrl: https://api.jinritemai.com
    appKey: ${DOUDIAN_APP_KEY}
    appSecret: ${DOUDIAN_APP_SECRET}
    timeout: 30000
    retryCount: 3
    retryDelay: 1000
```

#### 巨量千川API配置
```yaml
finance:
  qianchuan:
    baseUrl: https://api.oceanengine.com
    appId: ${QIANCHUAN_APP_ID}
    appSecret: ${QIANCHUAN_APP_SECRET}
    timeout: 30000
    retryCount: 3
    retryDelay: 1000
```

#### 聚水潭ERP API配置
```yaml
finance:
  jushuitan:
    baseUrl: https://api.jushuitan.com
    partnerId: ${JUSHUITAN_PARTNER_ID}
    partnerSecret: ${JUSHUITAN_PARTNER_SECRET}
    timeout: 30000
    retryCount: 3
    retryDelay: 1000
```

#### 定时任务配置
```yaml
finance:
  scheduler:
    dailySyncCron: "0 0 2 * * ?"        # 每日凌晨2点
    weeklySyncCron: "0 0 3 ? * MON"     # 每周一凌晨3点
    monthlySyncCron: "0 0 4 1 * ?"      # 每月1日凌晨4点
    taskTimeout: 300                     # 5分钟超时
```

## 📊 数据库表说明

### finance_orders（订单表）
- 字段数：35个
- 主键：id
- 租户隔离：tenant_id
- 索引：order_no, sku, order_time, province

### finance_daily_stats（每日统计表）
- 字段数：19个
- 主键：id
- 租户隔离：tenant_id
- 索引：stats_date, tenant_id

### finance_qianchuan_config（千川配置表）
- 字段数：8个
- 主键：id
- 租户隔离：tenant_id

### finance_qianchuan_expense（千川推广费表）
- 字段数：12个
- 主键：id
- 租户隔离：tenant_id
- 索引：expense_date, tenant_id

### finance_jst_config（聚水潭配置表）
- 字段数：8个
- 主键：id
- 租户隔离：tenant_id

### finance_jst_purchase_in（聚水潭入库单表）
- 字段数：15个
- 主键：id
- 租户隔离：tenant_id
- 索引：purchase_no, sku, inbound_date

### finance_sync_log（同步日志表）
- 字段数：10个
- 主键：id
- 租户隔离：tenant_id
- 索引：sync_date, sync_type, status

## 🧪 测试

### 单元测试

所有Service类都应该有对应的单元测试，例如：

```java
@SpringBootTest
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Test
    public void testGetOrderPage() {
        Page<OrderDO> page = orderService.getOrderPage(1L, 1, 10, null, null, null, null, null, null);
        assertNotNull(page);
    }

    @Test
    public void testCreateOrder() {
        OrderDO order = new OrderDO();
        order.setOrderNo("TEST20250401001");
        order.setProductTitle("测试商品");
        Long orderId = orderService.createOrder(1L, order);
        assertNotNull(orderId);
    }
}
```

### 集成测试

使用MockMvc进行Controller集成测试：

```java
@SpringBootTest
@AutoConfigureMockMvc
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetOrderPage() throws Exception {
        mockMvc.perform(get("/finance/order/page")
                .param("pageNo", "1")
                .param("pageSize", "10"))
                .andExpect(status().isOk());
    }
}
```

## 📚 相关文档

- [Node.js到Java迁移指南](../docs/nodejs-to-java-migration-guide.md)
- [RuoYi-Vue-Pro官方文档](https://doc.iocoder.cn/)
- [抖店开放平台API文档](https://op.jinritemai.com/)
- [巨量千川API文档](https://open.oceanengine.com/)
- [聚水潭ERP API文档](https://open.jushuitan.com/)

## ⚠️ 注意事项

1. **租户隔离**：所有查询操作都需要传入tenantId，确保数据隔离
2. **事务管理**：所有修改操作都使用@Transactional注解，确保数据一致性
3. **错误处理**：所有API调用都应该有重试机制和错误日志
4. **性能优化**：大数据量查询应该使用分页，避免一次性加载所有数据
5. **安全性**：所有API端点都应该有权限验证，确保只有授权用户才能访问

## 🤝 贡献指南

如果您发现任何问题或有改进建议，欢迎提出Issue或Pull Request。

## 📄 许可证

本代码包遵循RuoYi-Vue-Pro的许可证。

---

**最后更新时间**：2025年1月14日
**版本**：1.0.0
