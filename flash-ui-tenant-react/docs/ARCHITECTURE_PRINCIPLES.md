# 闪电帐PRO 架构原则文档

**文档版本**：v1.0  
**创建日期**：2025-01-16  
**最后更新**：2025-01-16  
**适用项目**：闪电帐PRO SAAS系统

---

> **重要提示**：本文档定义了闪电帐PRO系统的核心架构原则，**所有开发人员必须严格遵循**。违反这些原则的代码将不予合并。

---

## 一、核心架构原则

### 1.1 数据库操作原则（最高优先级）

**原则声明**：

> **所有读取数据库相关功能都必须由Java后端实现，前端只负责API调用。**

**具体要求**：

| 层级 | 职责 | 允许操作 | 禁止操作 |
|------|------|---------|---------|
| **Java后端** | 数据库操作、业务逻辑、数据计算 | 数据库CRUD、SQL查询、事务处理 | 无 |
| **Node.js中间层** | API转发、请求代理 | 调用Java API、请求转发 | 直接操作数据库、执行SQL |
| **Vue3管理员端** | UI展示、用户交互 | 调用API接口、数据展示 | 直接操作数据库、执行SQL |
| **React租户端** | UI展示、用户交互 | 调用API接口、数据展示 | 直接操作数据库、执行SQL |

### 1.2 数据流向原则

```
┌─────────────────────────────────────────────────────────────────┐
│                        数据流向架构图                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐              ┌─────────────────┐          │
│  │  Vue3管理员端    │              │  React租户端     │          │
│  │  (只做API调用)   │              │  (只做API调用)   │          │
│  └────────┬────────┘              └────────┬────────┘          │
│           │                                │                    │
│           │         HTTP/HTTPS             │                    │
│           └──────────────┬─────────────────┘                    │
│                          │                                      │
│                          ▼                                      │
│           ┌─────────────────────────────┐                       │
│           │    Node.js中间层（可选）      │                       │
│           │    (只做API转发，不操作DB)    │                       │
│           └──────────────┬──────────────┘                       │
│                          │                                      │
│                          ▼                                      │
│           ┌─────────────────────────────┐                       │
│           │    Java后端 (RuoYi框架)      │                       │
│           │    ★ 唯一的数据库操作层 ★     │                       │
│           └──────────────┬──────────────┘                       │
│                          │                                      │
│                          ▼                                      │
│           ┌─────────────────────────────┐                       │
│           │         MySQL数据库          │                       │
│           └─────────────────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、各层职责详解

### 2.1 Java后端职责

Java后端是**唯一**允许操作数据库的层级，负责：

1. **数据库操作**
   - 所有表的CRUD操作
   - 复杂SQL查询和聚合
   - 事务管理
   - 数据校验和完整性保证

2. **业务逻辑**
   - 财务计算（利润、成本、税费等）
   - 数据勾稽和验证
   - 报表生成
   - 定时任务

3. **第三方API调用**
   - 抖店API调用
   - 千川API调用
   - 聚水潭API调用
   - 数据同步和存储

4. **数据安全**
   - 权限控制
   - 数据脱敏
   - 审计日志

### 2.2 Node.js中间层职责（原型阶段）

Node.js中间层在原型阶段作为临时方案，职责限定为：

1. **API转发**
   - 将前端请求转发到Java后端
   - 处理跨域问题
   - 请求/响应格式转换

2. **Mock数据**（仅开发阶段）
   - Java API不可用时返回模拟数据
   - 便于前端开发调试

**禁止操作**：
- ❌ 直接连接数据库
- ❌ 执行SQL语句
- ❌ 使用ORM操作数据
- ❌ 实现业务逻辑计算

### 2.3 前端职责（Vue3/React）

前端只负责用户界面和交互，职责限定为：

1. **UI展示**
   - 页面布局和样式
   - 数据展示和格式化
   - 图表渲染

2. **用户交互**
   - 表单输入和验证（前端校验）
   - 按钮点击事件
   - 路由导航

3. **API调用**
   - 调用后端API获取数据
   - 提交表单数据
   - 处理API响应

**禁止操作**：
- ❌ 直接连接数据库
- ❌ 执行SQL语句
- ❌ 在前端实现复杂业务逻辑
- ❌ 在前端进行敏感数据计算

---

## 三、API接口规范

### 3.1 接口设计原则

所有数据获取都通过RESTful API实现：

```
GET    /api/finance/accounting/overview     # 获取财务核算概览
GET    /api/finance/funds/overview          # 获取资金管理概览
GET    /api/finance/inventory/overview      # 获取库存成本概览
GET    /api/finance/analysis/overview       # 获取经营分析概览
GET    /api/finance/expense/overview        # 获取费用中心概览
GET    /api/finance/tax/overview            # 获取税务管理概览
```

### 3.2 请求参数规范

```typescript
// 通用请求参数
interface BaseRequest {
  shopId: string;      // 店铺ID（必填）
  startDate: string;   // 开始日期（必填）
  endDate: string;     // 结束日期（必填）
}
```

### 3.3 响应格式规范

```typescript
// 通用响应格式
interface ApiResponse<T> {
  code: number;        // 状态码：0成功，非0失败
  msg: string;         // 提示信息
  data: T;             // 业务数据
}
```

---

## 四、代码审查清单

### 4.1 架构原则检查

在代码审查时，必须检查以下项目：

| 检查项 | 通过条件 | 不通过示例 |
|--------|---------|-----------|
| 数据库操作位置 | 仅在Java后端 | Node.js中使用drizzle查询 |
| SQL语句位置 | 仅在Java Mapper | 前端拼接SQL |
| 业务计算位置 | 仅在Java Service | 前端计算利润 |
| API调用方式 | 通过HTTP调用 | 直接import数据库模块 |

### 4.2 违规代码示例

**❌ 错误示例1：Node.js直接操作数据库**

```typescript
// 错误：Node.js中间层不应直接操作数据库
import { db } from '../drizzle/db';
import { orders } from '../drizzle/schema';

export async function getOrders() {
  return await db.select().from(orders);  // ❌ 禁止
}
```

**✅ 正确示例1：Node.js调用Java API**

```typescript
// 正确：Node.js只做API转发
const JAVA_API_BASE_URL = process.env.JAVA_API_BASE_URL;

export async function getOrders(params: OrderQueryParams) {
  const response = await fetch(`${JAVA_API_BASE_URL}/api/finance/orders`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return response.json();
}
```

**❌ 错误示例2：前端直接计算业务数据**

```typescript
// 错误：前端不应实现复杂业务逻辑
const netProfit = salesRevenue - refundAmount - productCost - 
                  commissionFee - serviceFee - promotionCost;  // ❌ 禁止
```

**✅ 正确示例2：前端展示后端计算结果**

```typescript
// 正确：前端只展示后端返回的计算结果
const { data } = await api.getAccountingOverview(params);
const netProfit = data.netProfit;  // ✅ 使用后端计算结果
```

---

## 五、迁移指南

### 5.1 现有代码迁移

对于现有的Node.js数据库操作代码，需要按以下步骤迁移：

1. **识别数据库操作代码**
   - 搜索 `import { db }` 或 `from '../drizzle'`
   - 搜索 `db.select()`, `db.insert()`, `db.update()`, `db.delete()`

2. **创建Java API接口**
   - 在Java后端创建对应的Controller
   - 实现Service业务逻辑
   - 实现Mapper数据访问

3. **修改Node.js代码**
   - 删除数据库操作代码
   - 改为调用Java API
   - 添加Mock数据回退机制

4. **测试验证**
   - 验证API调用正常
   - 验证数据一致性
   - 验证性能满足要求

### 5.2 新功能开发流程

开发新功能时，必须按以下流程：

1. **Java后端先行**
   - 设计数据库表结构
   - 实现Mapper和Service
   - 实现Controller API

2. **前端API调用**
   - 创建API调用函数
   - 实现页面UI
   - 调用API获取数据

3. **禁止的开发方式**
   - ❌ 先在Node.js实现数据库操作，后续再迁移
   - ❌ 前端直接连接数据库进行开发
   - ❌ 在前端实现业务计算逻辑

---

## 六、例外情况

### 6.1 允许的例外

以下情况允许在非Java层操作数据：

1. **前端本地存储**
   - localStorage/sessionStorage
   - IndexedDB（仅用于离线缓存）

2. **Node.js临时缓存**
   - 内存缓存（Redis等）
   - 仅用于性能优化，不作为数据源

### 6.2 不允许的例外

以下情况**绝不允许**：

1. **任何业务数据的数据库操作**
2. **任何涉及金额的计算**
3. **任何涉及权限的判断**
4. **任何涉及审计的记录**

---

## 七、执行与监督

### 7.1 代码审查要求

所有代码合并前必须经过架构原则审查：

- [ ] 确认无前端数据库操作
- [ ] 确认无Node.js数据库操作
- [ ] 确认业务逻辑在Java后端
- [ ] 确认API调用方式正确

### 7.2 违规处理

发现违规代码的处理方式：

1. **开发阶段**：拒绝合并，要求修改
2. **已上线代码**：创建技术债务工单，限期修复
3. **紧急情况**：临时允许，但必须在下个迭代修复

---

**文档结束**

> **重要提示**：本文档定义的架构原则是闪电帐PRO系统的基石，所有开发人员必须严格遵循。如有疑问，请咨询项目架构师。
