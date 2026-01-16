# tRPC到RESTful API迁移计划

## 一、迁移概述

### 迁移目标
将闪电帐PRO系统从tRPC架构迁移到RuoYi框架的RESTful API架构，实现以下目标：
1. **统一后端** - 使用RuoYi框架的Java后端，而不是Node.js中间层
2. **标准化API** - 采用RESTful API标准，而不是tRPC
3. **完整SAAS** - 支持多租户、权限管理、数据隔离等企业级功能
4. **降低复杂度** - 减少Node.js中间层的维护成本

### 迁移范围
| 组件 | 当前状态 | 迁移后状态 |
|-----|--------|---------|
| 前端框架 | React + tRPC | React + Axios/React Query |
| 中间层 | Node.js Express | 移除 |
| 后端框架 | Node.js tRPC | Java RuoYi |
| API调用 | tRPC | RESTful API |
| 数据库 | MySQL (Drizzle ORM) | MySQL (MyBatis) |

---

## 二、迁移阶段

### 阶段1：分析和规划（当前）
**目标**：制定详细的迁移计划
**时间**：1天
**任务**：
- [ ] 分析所有tRPC路由和API接口
- [ ] 制定RESTful API规范
- [ ] 规划Java后端代码结构
- [ ] 确定迁移优先级

### 阶段2：完善Java后端代码
**目标**：实现所有业务模块的Java后端代码
**时间**：3-5天
**任务**：
- [ ] 创建所有Entity类（数据库实体）
- [ ] 创建所有Mapper接口和XML
- [ ] 实现所有Service类
- [ ] 实现所有Controller类
- [ ] 编写SQL脚本

**涉及模块**：
1. 订单管理（已部分完成）
2. 总账管理（7个子模块）
3. 出纳管理（8个子模块）
4. 数据同步（抖店、千川、聚水潭）
5. 授权管理
6. 单据中心
7. 数据对账

### 阶段3：创建前端API调用层
**目标**：建立前端与Java后端的通信层
**时间**：1-2天
**任务**：
- [ ] 创建request.ts（Axios配置）
- [ ] 创建API模块（各业务模块的API函数）
- [ ] 配置环境变量
- [ ] 实现认证和Token管理

### 阶段4：迁移租户端页面
**目标**：将所有页面从tRPC迁移到RESTful API
**时间**：3-5天
**任务**：
- [ ] 迁移经营概览页面
- [ ] 迁移订单管理页面
- [ ] 迁移总账管理页面
- [ ] 迁移出纳管理页面
- [ ] 迁移数据同步页面
- [ ] 迁移授权管理页面
- [ ] 迁移单据中心页面
- [ ] 迁移数据对账页面

### 阶段5：实现前端Hook和React Query集成
**目标**：提供类似tRPC的开发体验
**时间**：1-2天
**任务**：
- [ ] 创建useQuery Hook
- [ ] 创建useMutation Hook
- [ ] 实现缓存和无效化
- [ ] 实现乐观更新

### 阶段6：编写测试和验证
**目标**：确保迁移的正确性和完整性
**时间**：1-2天
**任务**：
- [ ] 编写API测试用例
- [ ] 编写页面集成测试
- [ ] 验证所有功能
- [ ] 性能测试

### 阶段7：上线和优化
**目标**：部署到生产环境
**时间**：1天
**任务**：
- [ ] 保存检查点
- [ ] 部署到测试环境
- [ ] 部署到生产环境
- [ ] 监控和优化

---

## 三、Java后端代码结构

### 3.1 包结构规划
```
com.yudao.module.finance
├── entity/              # 数据库实体类（DO）
│   ├── OrderDO.java
│   ├── DailyStatsDO.java
│   ├── CashflowDO.java
│   ├── ProductCostDO.java
│   ├── ReconciliationDO.java
│   ├── DocumentDO.java
│   ├── QianchuanConfigDO.java
│   ├── JstConfigDO.java
│   └── ...
├── mapper/              # MyBatis Mapper接口
│   ├── OrderMapper.java
│   ├── CashflowMapper.java
│   ├── ProductCostMapper.java
│   └── ...
├── service/             # Service接口
│   ├── OrderService.java
│   ├── CashflowService.java
│   ├── ProductCostService.java
│   └── ...
├── service/impl/        # Service实现类
│   ├── OrderServiceImpl.java
│   ├── CashflowServiceImpl.java
│   ├── ProductCostServiceImpl.java
│   └── ...
├── controller/          # REST API控制器
│   ├── OrderController.java
│   ├── CashflowController.java
│   ├── ProductCostController.java
│   └── ...
├── vo/                  # 视图对象（VO）
│   ├── OrderVO.java
│   ├── CashflowVO.java
│   ├── ProductCostVO.java
│   └── ...
├── dto/                 # 数据传输对象（DTO）
│   ├── OrderCreateDTO.java
│   ├── CashflowCreateDTO.java
│   └── ...
├── config/              # 配置类
│   └── FinanceConfig.java
└── constant/            # 常量类
    └── FinanceConstant.java
```

### 3.2 命名规范
- **Entity类**：以DO后缀结尾（如OrderDO）
- **Mapper接口**：以Mapper后缀结尾（如OrderMapper）
- **Service接口**：以Service后缀结尾（如OrderService）
- **Service实现**：以ServiceImpl后缀结尾（如OrderServiceImpl）
- **Controller类**：以Controller后缀结尾（如OrderController）
- **VO类**：以VO后缀结尾（如OrderVO）
- **DTO类**：以DTO后缀结尾（如OrderCreateDTO）

### 3.3 RESTful API规范

#### 订单管理API
```
GET    /finance/order/page              # 分页查询订单
GET    /finance/order/{id}              # 获取订单详情
POST   /finance/order                   # 创建订单
PUT    /finance/order/{id}              # 更新订单
DELETE /finance/order/{id}              # 删除订单
GET    /finance/order/stats             # 订单统计
POST   /finance/order/import            # 批量导入订单
```

#### 资金流水API
```
GET    /finance/cashflow/page           # 分页查询资金流水
GET    /finance/cashflow/{id}           # 获取资金流水详情
POST   /finance/cashflow                # 创建资金流水
PUT    /finance/cashflow/{id}           # 更新资金流水
DELETE /finance/cashflow/{id}           # 删除资金流水
PUT    /finance/cashflow/{id}/confirm   # 确认资金流水
```

#### 商品成本API
```
GET    /finance/product-cost/page       # 分页查询商品成本
GET    /finance/product-cost/{id}       # 获取商品成本详情
POST   /finance/product-cost            # 创建商品成本
PUT    /finance/product-cost/{id}       # 更新商品成本
DELETE /finance/product-cost/{id}       # 删除商品成本
POST   /finance/product-cost/import     # 批量导入商品成本
GET    /finance/product-cost/history    # 获取成本变更历史
```

#### 数据对账API
```
GET    /finance/reconciliation/page     # 分页查询对账记录
POST   /finance/reconciliation/execute  # 执行对账
GET    /finance/reconciliation/diff     # 获取对账差异
PUT    /finance/reconciliation/{id}     # 处理对账差异
```

#### 数据同步API
```
POST   /finance/sync/doudian            # 同步抖店数据
POST   /finance/sync/qianchuan          # 同步千川数据
POST   /finance/sync/jst                # 同步聚水潭数据
GET    /finance/sync/logs               # 获取同步日志
```

---

## 四、前端API调用层结构

### 4.1 文件结构
```
client/src/
├── utils/
│   └── request.ts                      # Axios配置和请求工具
├── api/
│   ├── order.ts                        # 订单API
│   ├── cashflow.ts                     # 资金流水API
│   ├── productCost.ts                  # 商品成本API
│   ├── reconciliation.ts               # 对账API
│   ├── sync.ts                         # 数据同步API
│   ├── doudian.ts                      # 抖店授权API
│   ├── document.ts                     # 单据API
│   └── dashboard.ts                    # 经营概览API
├── hooks/
│   ├── useOrder.ts                     # 订单Hook
│   ├── useCashflow.ts                  # 资金流水Hook
│   ├── useProductCost.ts               # 商品成本Hook
│   ├── useReconciliation.ts            # 对账Hook
│   ├── useSync.ts                      # 数据同步Hook
│   └── ...
└── pages/
    ├── OrderManagement.tsx             # 订单管理页面
    ├── Cashflow.tsx                    # 资金流水页面
    ├── ProductCost.tsx                 # 商品成本页面
    └── ...
```

### 4.2 request.ts 配置
```typescript
// 创建Axios实例
// 配置请求/响应拦截器
// 实现Token自动刷新
// 实现错误处理
// 实现租户隔离
```

### 4.3 API模块示例
```typescript
// api/order.ts
export function getOrderPage(params: OrderPageParams)
export function getOrder(id: number)
export function createOrder(data: OrderCreateDTO)
export function updateOrder(id: number, data: OrderUpdateDTO)
export function deleteOrder(id: number)
export function getOrderStats()
export function importOrders(file: File)
```

---

## 五、迁移优先级

### 优先级1（P0）- 核心功能
1. **订单管理** - 最核心的业务模块
2. **经营概览** - 关键指标展示
3. **资金流水** - 出纳核心功能
4. **授权管理** - 多店铺支持

### 优先级2（P1）- 重要功能
1. **商品成本** - 成本核算
2. **数据对账** - 财务核心
3. **数据同步** - 数据更新

### 优先级3（P2）- 辅助功能
1. **单据中心** - 单据管理
2. **总账管理** - 财务报表
3. **出纳管理** - 资金管理

---

## 六、迁移检查清单

### Java后端代码
- [ ] 创建所有Entity类
- [ ] 创建所有Mapper接口和XML
- [ ] 实现所有Service类
- [ ] 实现所有Controller类
- [ ] 编写SQL脚本
- [ ] 配置MyBatis
- [ ] 配置数据源

### 前端API调用层
- [ ] 创建request.ts
- [ ] 创建所有API模块
- [ ] 配置环境变量
- [ ] 实现Token管理
- [ ] 实现错误处理
- [ ] 实现租户隔离

### 前端页面迁移
- [ ] 迁移经营概览
- [ ] 迁移订单管理
- [ ] 迁移总账管理
- [ ] 迁移出纳管理
- [ ] 迁移数据同步
- [ ] 迁移授权管理
- [ ] 迁移单据中心
- [ ] 迁移数据对账

### 前端Hook实现
- [ ] 实现useQuery Hook
- [ ] 实现useMutation Hook
- [ ] 实现缓存管理
- [ ] 实现乐观更新

### 测试和验证
- [ ] 编写API测试
- [ ] 编写页面测试
- [ ] 验证所有功能
- [ ] 性能测试
- [ ] 安全测试

---

## 七、关键技术点

### 7.1 多租户隔离
- 在所有查询中添加tenant_id过滤
- 在所有修改中验证租户权限
- 使用拦截器自动注入tenant_id

### 7.2 权限管理
- 使用RuoYi的权限系统
- 在Controller中验证权限
- 在前端隐藏无权限功能

### 7.3 数据一致性
- 使用事务保证数据一致性
- 实现乐观锁防止并发修改
- 实现审计日志记录所有修改

### 7.4 性能优化
- 使用分页查询大数据量
- 使用缓存减少数据库查询
- 使用异步处理耗时操作
- 使用索引加速查询

### 7.5 错误处理
- 统一的错误响应格式
- 详细的错误日志
- 前端友好的错误提示
- 自动重试机制

---

## 八、时间估算

| 阶段 | 任务 | 预计时间 |
|-----|------|--------|
| 1 | 分析和规划 | 1天 |
| 2 | 完善Java后端 | 3-5天 |
| 3 | 前端API调用层 | 1-2天 |
| 4 | 迁移租户端页面 | 3-5天 |
| 5 | 前端Hook实现 | 1-2天 |
| 6 | 测试和验证 | 1-2天 |
| 7 | 上线和优化 | 1天 |
| **总计** | | **11-18天** |

---

## 九、风险和对策

### 风险1：数据迁移
**风险**：现有tRPC数据与RESTful API数据格式不兼容
**对策**：
- 编写数据迁移脚本
- 在迁移前备份数据
- 在测试环境验证迁移

### 风险2：功能遗漏
**风险**：迁移过程中遗漏某些功能
**对策**：
- 创建详细的功能清单
- 逐个功能进行迁移和验证
- 编写自动化测试

### 风险3：性能下降
**风险**：RESTful API性能低于tRPC
**对策**：
- 使用缓存减少数据库查询
- 使用异步处理耗时操作
- 进行性能测试和优化

### 风险4：兼容性问题
**风险**：旧版本客户端无法访问新API
**对策**：
- 同时支持旧版本和新版本API
- 提供API版本管理
- 制定API废弃计划

---

## 十、后续工作

### 短期（迁移完成后）
1. 实现管理员端（基于RuoYi框架）
2. 优化性能和安全性
3. 编写完整的API文档

### 中期（1-2个月）
1. 实现高级功能（预警、报表、导出等）
2. 实现数据分析功能
3. 实现第三方集成

### 长期（2-3个月）
1. 实现移动端应用
2. 实现数据可视化
3. 实现AI辅助功能

---

**文档版本**：1.0
**最后更新**：2025年1月16日
**维护者**：Manus AI Agent
