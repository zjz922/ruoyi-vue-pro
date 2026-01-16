# RuoYi-Vue-Pro脚手架集成方案

## 一、项目概述

### 目标
将现有的闪电帐PRO系统集成到RuoYi-Vue-Pro官方脚手架中，实现：
1. **Java后端** - 基于RuoYi框架的标准模块结构
2. **React租户端** - 保持现有的React前端
3. **Vue3管理员端** - 基于RuoYi官方的Vue3管理后台

### 系统架构
```
┌─────────────────────────────────────────────┐
│         租户端 (React)                      │
│  - 店铺经营管理                             │
│  - 财务数据展示                             │
│  - 多店铺切换                               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│      管理员端 (Vue3 - RuoYi)                │
│  - 租户管理                                  │
│  - 系统配置                                  │
│  - 数据监控                                  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│    Java后端 (RuoYi-Vue-Pro框架)            │
│  - yudao-module-finance 财务模块            │
│  - yudao-module-system 系统模块             │
│  - yudao-module-infra 基础设施模块          │
│  - yudao-server 服务器启动项                │
└─────────────────────────────────────────────┘
                    ↓
┌──────────────────┬──────────────────┬──────────────────┐
│   抖店API        │   千川API        │   聚水潭API      │
└──────────────────┴──────────────────┴──────────────────┘
```

---

## 二、RuoYi-Vue-Pro脚手架分析

### 2.1 项目结构

```
ruoyi-vue-pro-scaffold/
├── yudao-dependencies/           # 依赖管理 (pom.xml)
├── yudao-framework/              # 框架核心
│   ├── yudao-common/             # 公共工具
│   ├── yudao-spring-boot-starter-*/ # 各种Starter
│   └── ...
├── yudao-server/                 # 服务器启动项
│   ├── pom.xml
│   └── src/main/java/...
├── yudao-module-system/          # 系统模块
│   ├── pom.xml
│   └── src/main/java/...
├── yudao-module-infra/           # 基础设施模块
├── yudao-module-erp/             # ERP模块（参考）
├── yudao-module-crm/             # CRM模块（参考）
├── yudao-module-mall/            # 商城模块（参考）
├── yudao-ui/                     # 前端UI
│   ├── yudao-ui-admin-vue3/      # Vue3管理后台
│   ├── yudao-ui-admin-vben/      # Vben管理后台
│   ├── yudao-ui-admin-vue2/      # Vue2管理后台
│   └── yudao-ui-mall-uniapp/     # 商城小程序
├── sql/                          # 数据库脚本
│   ├── mysql/
│   ├── postgresql/
│   └── ...
├── script/                       # 脚本工具
├── pom.xml                       # 根pom.xml
└── README.md
```

### 2.2 模块结构规范

每个模块遵循以下结构：
```
yudao-module-finance/
├── pom.xml                       # 模块依赖
└── src/
    └── main/
        ├── java/
        │   └── cn/iocoder/yudao/module/finance/
        │       ├── controller/
        │       │   └── admin/
        │       │       ├── doudian/
        │       │       │   ├── DoudianController.java
        │       │       │   └── vo/
        │       │       ├── order/
        │       │       │   ├── OrderController.java
        │       │       │   └── vo/
        │       │       └── ...
        │       ├── service/
        │       │   ├── doudian/
        │       │   │   ├── DoudianService.java
        │       │   │   └── impl/
        │       │   ├── order/
        │       │   │   ├── OrderService.java
        │       │   │   └── impl/
        │       │   └── ...
        │       ├── dal/
        │       │   ├── dataobject/
        │       │   │   ├── doudian/
        │       │   │   ├── order/
        │       │   │   └── ...
        │       │   └── mysql/
        │       │       ├── doudian/
        │       │       ├── order/
        │       │       └── ...
        │       ├── enums/
        │       ├── convert/
        │       └── framework/
        └── resources/
            └── mapper/
                └── finance/
                    ├── doudian/
                    ├── order/
                    └── ...
```

### 2.3 关键特性

1. **多租户支持** - 内置租户隔离机制
2. **权限管理** - Spring Security集成
3. **数据权限** - 数据级别的权限控制
4. **MyBatis** - ORM框架
5. **Swagger** - API文档
6. **事务管理** - 声明式事务
7. **缓存** - Redis集成
8. **消息队列** - MQ支持
9. **定时任务** - Job调度

---

## 三、集成步骤

### 步骤1：创建财务模块

#### 1.1 创建模块目录结构
```bash
# 在ruoyi-vue-pro-scaffold中创建财务模块
mkdir -p yudao-module-finance/src/main/java/cn/iocoder/yudao/module/finance
mkdir -p yudao-module-finance/src/main/resources/mapper/finance
```

#### 1.2 创建pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>cn.iocoder.boot</groupId>
        <artifactId>yudao</artifactId>
        <version>${revision}</version>
    </parent>

    <artifactId>yudao-module-finance</artifactId>
    <packaging>jar</packaging>
    <name>${project.artifactId}</name>
    <description>财务管理模块</description>

    <dependencies>
        <!-- 框架核心 -->
        <dependency>
            <groupId>cn.iocoder.boot</groupId>
            <artifactId>yudao-common</artifactId>
        </dependency>
        <!-- Spring Boot -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!-- MyBatis -->
        <dependency>
            <groupId>cn.iocoder.boot</groupId>
            <artifactId>yudao-spring-boot-starter-mybatis</artifactId>
        </dependency>
        <!-- 其他依赖 -->
    </dependencies>
</project>
```

#### 1.3 在根pom.xml中添加模块
```xml
<modules>
    <!-- ... 其他模块 ... -->
    <module>yudao-module-finance</module>
</modules>
```

### 步骤2：迁移Java后端代码

#### 2.1 迁移Entity类
将`ruoyi-integration/java-complete/entity/`中的所有Entity类迁移到：
```
yudao-module-finance/src/main/java/cn/iocoder/yudao/module/finance/dal/dataobject/
```

**命名规范**：
- 类名以`DO`后缀结尾
- 包路径按业务分类：`...dataobject.doudian/`, `...dataobject.order/`等
- 添加`@Data`、`@Builder`、`@NoArgsConstructor`等Lombok注解

#### 2.2 迁移Mapper接口
将`ruoyi-integration/java-complete/mapper/`中的Mapper接口迁移到：
```
yudao-module-finance/src/main/java/cn/iocoder/yudao/module/finance/dal/mysql/
```

**命名规范**：
- 接口名以`Mapper`后缀结尾
- 继承`BaseMapper<T>`
- 添加`@Mapper`注解

#### 2.3 迁移Mapper XML
将`ruoyi-integration/java-complete/mapper-xml/`中的XML文件迁移到：
```
yudao-module-finance/src/main/resources/mapper/finance/
```

#### 2.4 创建Service接口和实现
在以下目录创建Service类：
```
yudao-module-finance/src/main/java/cn/iocoder/yudao/module/finance/service/
```

**结构**：
```
service/
├── doudian/
│   ├── DoudianService.java       # 接口
│   └── impl/
│       └── DoudianServiceImpl.java # 实现
├── order/
│   ├── OrderService.java
│   └── impl/
│       └── OrderServiceImpl.java
└── ...
```

#### 2.5 创建Controller
在以下目录创建Controller类：
```
yudao-module-finance/src/main/java/cn/iocoder/yudao/module/finance/controller/admin/
```

**结构**：
```
controller/admin/
├── doudian/
│   ├── DoudianController.java
│   └── vo/
│       ├── DoudianConfigCreateReqVO.java
│       ├── DoudianConfigUpdateReqVO.java
│       └── ...
├── order/
│   ├── OrderController.java
│   └── vo/
│       ├── OrderCreateReqVO.java
│       ├── OrderUpdateReqVO.java
│       └── ...
└── ...
```

#### 2.6 创建VO、DTO、Convert类
```
yudao-module-finance/src/main/java/cn/iocoder/yudao/module/finance/
├── controller/admin/*/vo/        # 视图对象
├── convert/                      # 对象转换
│   ├── DoudianConvert.java
│   ├── OrderConvert.java
│   └── ...
└── ...
```

#### 2.7 创建Enum、Constant类
```
yudao-module-finance/src/main/java/cn/iocoder/yudao/module/finance/
├── enums/                        # 枚举类
│   ├── DoudianStatusEnum.java
│   ├── OrderStatusEnum.java
│   └── ...
└── ...
```

### 步骤3：配置数据库

#### 3.1 执行SQL脚本
```bash
# 在MySQL中执行
mysql -u root -p < ruoyi-integration/sql/finance_schema.sql
```

#### 3.2 配置数据源
在`yudao-server/src/main/resources/application.yml`中配置：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/yudao?useSSL=false&serverTimezone=UTC
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### 步骤4：集成前端

#### 4.1 React租户端集成
保持现有的React项目结构，创建API调用层：
```
client/src/
├── utils/
│   └── request.ts                # Axios配置
├── api/
│   ├── order.ts                  # 订单API
│   ├── doudian.ts                # 抖店API
│   ├── cashflow.ts               # 资金流水API
│   └── ...
└── ...
```

**API调用示例**：
```typescript
// client/src/api/order.ts
import { request } from '@/utils/request';

export function getOrderPage(params: OrderPageParams) {
  return request.get('/finance/order/page', params);
}

export function createOrder(data: OrderCreateDTO) {
  return request.post('/finance/order', data);
}
```

#### 4.2 Vue3管理员端集成
基于RuoYi官方的Vue3模板创建管理员端：
```
yudao-ui/yudao-ui-admin-vue3/src/
├── views/
│   └── finance/                  # 财务模块
│       ├── doudian/              # 抖店管理
│       ├── order/                # 订单管理
│       ├── cashflow/             # 资金流水
│       └── ...
├── api/
│   └── finance/                  # 财务API
│       ├── doudian.ts
│       ├── order.ts
│       └── ...
└── ...
```

### 步骤5：配置和启动

#### 5.1 配置应用属性
在`yudao-server/src/main/resources/application.yml`中添加：
```yaml
# 财务模块配置
finance:
  doudian:
    baseUrl: https://api.jinritemai.com
    appKey: ${DOUDIAN_APP_KEY}
    appSecret: ${DOUDIAN_APP_SECRET}
    timeout: 30000
  qianchuan:
    baseUrl: https://api.oceanengine.com
    appId: ${QIANCHUAN_APP_ID}
    appSecret: ${QIANCHUAN_APP_SECRET}
  jushuitan:
    baseUrl: https://api.jushuitan.com
    partnerId: ${JUSHUITAN_PARTNER_ID}
    partnerSecret: ${JUSHUITAN_PARTNER_SECRET}
```

#### 5.2 编译和启动
```bash
# 编译
mvn clean install

# 启动
mvn spring-boot:run -pl yudao-server
```

---

## 四、文件迁移清单

### 4.1 Java后端文件

| 源文件 | 目标位置 | 说明 |
|--------|--------|------|
| ruoyi-integration/java-complete/entity/*.java | yudao-module-finance/src/main/java/.../dal/dataobject/ | Entity类 |
| ruoyi-integration/java-complete/mapper/*.java | yudao-module-finance/src/main/java/.../dal/mysql/ | Mapper接口 |
| ruoyi-integration/java-complete/mapper-xml/*.xml | yudao-module-finance/src/main/resources/mapper/finance/ | Mapper XML |
| ruoyi-integration/java-complete/service/*.java | yudao-module-finance/src/main/java/.../service/ | Service接口和实现 |
| ruoyi-integration/java-complete/controller/*.java | yudao-module-finance/src/main/java/.../controller/admin/ | Controller类 |
| ruoyi-integration/java-complete/vo/*.java | yudao-module-finance/src/main/java/.../controller/admin/*/vo/ | VO类 |
| ruoyi-integration/java-complete/config/*.java | yudao-module-finance/src/main/java/.../framework/config/ | 配置类 |
| ruoyi-integration/sql/finance_schema.sql | sql/mysql/ | SQL脚本 |

### 4.2 前端文件

| 源文件 | 目标位置 | 说明 |
|--------|--------|------|
| client/src/pages/*.tsx | 保持不变 | React租户端页面 |
| client/src/hooks/*.ts | 保持不变 | React Hook |
| client/src/api/ | 新建 | Axios API调用 |
| client/src/utils/request.ts | 新建 | Axios配置 |
| yudao-ui/yudao-ui-admin-vue3/src/views/finance/ | 新建 | Vue3管理员端 |
| yudao-ui/yudao-ui-admin-vue3/src/api/finance/ | 新建 | Vue3 API |

---

## 五、关键代码示例

### 5.1 Entity类示例
```java
package cn.iocoder.yudao.module.finance.dal.dataobject.order;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@TableName("finance_orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDO extends BaseDO {
    
    private Long id;
    private Long tenantId;
    private String orderNo;
    private String productTitle;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal payAmount;
    private String status;
    // ... 其他字段
}
```

### 5.2 Mapper接口示例
```java
package cn.iocoder.yudao.module.finance.dal.mysql.order;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapper;
import cn.iocoder.yudao.module.finance.dal.dataobject.order.OrderDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderMapper extends BaseMapper<OrderDO> {
    // 自定义查询方法
}
```

### 5.3 Service接口示例
```java
package cn.iocoder.yudao.module.finance.service.order;

import cn.iocoder.yudao.module.finance.dal.dataobject.order.OrderDO;
import cn.iocoder.yudao.module.finance.controller.admin.order.vo.*;

public interface OrderService {
    
    Long createOrder(OrderCreateReqVO createReqVO);
    
    void updateOrder(OrderUpdateReqVO updateReqVO);
    
    void deleteOrder(Long id);
    
    OrderDO getOrder(Long id);
    
    PageResult<OrderDO> getOrderPage(OrderPageReqVO pageReqVO);
}
```

### 5.4 Service实现示例
```java
package cn.iocoder.yudao.module.finance.service.order.impl;

import cn.iocoder.yudao.module.finance.dal.dataobject.order.OrderDO;
import cn.iocoder.yudao.module.finance.dal.mysql.order.OrderMapper;
import cn.iocoder.yudao.module.finance.service.order.OrderService;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;

@Service
public class OrderServiceImpl implements OrderService {
    
    @Resource
    private OrderMapper orderMapper;
    
    @Override
    public Long createOrder(OrderCreateReqVO createReqVO) {
        OrderDO order = OrderConvert.INSTANCE.convert(createReqVO);
        orderMapper.insert(order);
        return order.getId();
    }
    
    // ... 其他方法实现
}
```

### 5.5 Controller示例
```java
package cn.iocoder.yudao.module.finance.controller.admin.order;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.order.vo.*;
import cn.iocoder.yudao.module.finance.convert.order.OrderConvert;
import cn.iocoder.yudao.module.finance.dal.dataobject.order.OrderDO;
import cn.iocoder.yudao.module.finance.service.order.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.validation.Valid;

@Tag(name = "管理后台 - 订单管理")
@RestController
@RequestMapping("/finance/order")
public class OrderController {
    
    @Resource
    private OrderService orderService;
    
    @PostMapping
    @Operation(summary = "创建订单")
    @PreAuthorize("@ss.hasPermission('finance:order:create')")
    public CommonResult<Long> createOrder(@Valid @RequestBody OrderCreateReqVO createReqVO) {
        return CommonResult.success(orderService.createOrder(createReqVO));
    }
    
    @GetMapping("/page")
    @Operation(summary = "获取订单分页")
    @PreAuthorize("@ss.hasPermission('finance:order:query')")
    public CommonResult<PageResult<OrderRespVO>> getOrderPage(@Valid OrderPageReqVO pageReqVO) {
        PageResult<OrderDO> pageResult = orderService.getOrderPage(pageReqVO);
        return CommonResult.success(OrderConvert.INSTANCE.convertPage(pageResult));
    }
    
    // ... 其他方法
}
```

### 5.6 React API调用示例
```typescript
// client/src/api/order.ts
import { request } from '@/utils/request';

export interface OrderPageParams {
  pageNo?: number;
  pageSize?: number;
  orderNo?: string;
  status?: string;
}

export function getOrderPage(params: OrderPageParams) {
  return request.get('/finance/order/page', params);
}

export function createOrder(data: any) {
  return request.post('/finance/order', data);
}

export function updateOrder(id: number, data: any) {
  return request.put(`/finance/order/${id}`, data);
}

export function deleteOrder(id: number) {
  return request.delete(`/finance/order/${id}`);
}
```

### 5.7 React页面集成示例
```typescript
// client/src/pages/OrderManagement.tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { getOrderPage, createOrder } from '@/api/order';

export function OrderManagement() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrderPage({ pageNo: 1, pageSize: 20 })
  });
  
  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // 刷新列表
    }
  });
  
  return (
    <div>
      {/* 订单列表UI */}
    </div>
  );
}
```

---

## 六、环境配置

### 6.1 Java后端环境变量
```bash
# .env 或 application-dev.yml
DOUDIAN_APP_KEY=your_app_key
DOUDIAN_APP_SECRET=your_app_secret
QIANCHUAN_APP_ID=your_app_id
QIANCHUAN_APP_SECRET=your_app_secret
JUSHUITAN_PARTNER_ID=your_partner_id
JUSHUITAN_PARTNER_SECRET=your_partner_secret
```

### 6.2 React前端环境变量
```bash
# client/.env
VITE_API_BASE_URL=http://localhost:48080/app-api
VITE_APP_TITLE=闪电帐PRO
```

### 6.3 Vue3管理员端环境变量
```bash
# yudao-ui/yudao-ui-admin-vue3/.env
VITE_API_BASE_URL=http://localhost:48080/app-api
VITE_APP_TITLE=闪电帐PRO管理后台
```

---

## 七、迁移检查清单

### Java后端
- [ ] 创建yudao-module-finance模块
- [ ] 迁移所有Entity类
- [ ] 迁移所有Mapper接口和XML
- [ ] 创建Service接口和实现
- [ ] 创建Controller和VO
- [ ] 创建Convert和Enum类
- [ ] 执行SQL脚本创建表
- [ ] 配置数据源和应用属性
- [ ] 编译验证
- [ ] 单元测试

### React租户端
- [ ] 创建utils/request.ts
- [ ] 创建api/目录和API模块
- [ ] 迁移所有页面
- [ ] 配置环境变量
- [ ] 测试API调用

### Vue3管理员端
- [ ] 创建views/finance/目录
- [ ] 创建api/finance/目录
- [ ] 创建管理员页面
- [ ] 配置路由和菜单
- [ ] 配置权限

### 部署和测试
- [ ] 本地开发环境测试
- [ ] 功能测试
- [ ] 性能测试
- [ ] 安全测试
- [ ] 部署到测试环境
- [ ] 部署到生产环境

---

## 八、常见问题

### Q1: 如何处理多租户隔离？
A: RuoYi框架已内置多租户支持，通过`TenantContextHolder`自动注入租户ID。

### Q2: 如何添加权限控制？
A: 使用`@PreAuthorize`注解，例如：
```java
@PreAuthorize("@ss.hasPermission('finance:order:query')")
```

### Q3: 如何处理事务？
A: 使用`@Transactional`注解：
```java
@Transactional
public void updateOrder(OrderUpdateReqVO updateReqVO) {
    // 事务处理
}
```

### Q4: 如何集成缓存？
A: 使用`@Cacheable`注解：
```java
@Cacheable(cacheNames = "order", key = "#id")
public OrderDO getOrder(Long id) {
    // 缓存查询结果
}
```

### Q5: 如何处理API文档？
A: 使用Swagger注解：
```java
@Tag(name = "订单管理")
@Operation(summary = "获取订单")
@GetMapping("/{id}")
public CommonResult<OrderRespVO> getOrder(@PathVariable Long id) {
    // ...
}
```

---

## 九、后续工作

### 短期（1-2周）
1. ✅ 创建yudao-module-finance模块
2. ✅ 迁移Java后端代码
3. ✅ 配置数据库和应用属性
4. ✅ 迁移React前端API
5. ✅ 创建Vue3管理员端

### 中期（2-4周）
1. ⏳ 实现千川API集成
2. ⏳ 实现聚水潭ERP集成
3. ⏳ 实现资金流水管理
4. ⏳ 实现对账差异处理
5. ⏳ 实现数据同步调度

### 长期（1-2个月）
1. ⏳ 性能优化
2. ⏳ 安全加固
3. ⏳ 完整的测试覆盖
4. ⏳ 生产环境部署
5. ⏳ 文档完善

---

**文档版本**：1.0
**最后更新**：2025年1月16日
**维护者**：Manus AI Agent
