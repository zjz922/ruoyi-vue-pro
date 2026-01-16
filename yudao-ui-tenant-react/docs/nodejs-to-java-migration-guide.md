# 闪电账PRO：Node.js后端到Java迁移完整指南

## 一、项目概述

### 迁移目标

将"闪电账PRO"的Node.js/TypeScript后端代码迁移到Java，并整合进RuoYi-Vue-Pro框架，实现以下目标：

- **统一技术栈**：使用Java作为唯一的后端开发语言
- **多租户支持**：通过RuoYi框架的租户隔离机制，支持多个商家独立使用
- **管理员后台**：RuoYi-Vue作为系统管理员后台
- **商家前端**：保留现有的React前端作为商家租户端

### 迁移范围

当前Node.js后端包含以下核心模块，需要全部迁移到Java：

| 模块 | 功能 | 对应文件 |
|------|------|--------|
| 商品成本管理 | 商品成本的增删改查、批量导入、历史记录 | productCostRouter.ts, db.ts |
| 订单管理 | 订单数据的增删改查、批量导入、统计分析 | orderRouter.ts, db.ts |
| 抖店API对接 | 订单、商品、结算账单、达人佣金、保险费、售后赔付数据同步 | doudianApi.ts, doudianRouter.ts |
| 千川推广费 | 千川推广费用数据同步、定时任务 | qianchuanApi.ts, qianchuanRouter.ts, scheduler.ts |
| 聚水潭ERP对接 | 入库单数据同步、成本自动更新 | jstApi.ts, jstRouter.ts, jstSyncService.ts |
| 成本自动更新 | 基于入库数据的成本计算与更新 | costUpdateService.ts, costUpdateRouter.ts |
| 数据勾稽 | 各模块数据一致性校验 | reconciliationConfig.ts |

---

## 二、架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    RuoYi-Vue-Pro框架                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │  RuoYi-Vue      │  │  闪电账PRO前端   │  │  Admin后台 │ │
│  │  (管理员后台)   │  │  (商家租户端)    │  │ (RuoYi)    │ │
│  └────────┬────────┘  └────────┬─────────┘  └────────┬───┘ │
└───────────┼──────────────────────┼────────────────────┼─────┘
            │                      │                    │
            └──────────────────────┼────────────────────┘
                                   │
        ┌──────────────────────────▼──────────────────────────┐
        │           Java后端 (RuoYi-Vue-Pro)                  │
        ├───────────────────────────────────────────────────┤
        │  ┌──────────────┐  ┌──────────────┐  ┌─────────┐ │
        │  │  Controller  │  │   Service    │  │ Mapper  │ │
        │  │   (REST API) │  │  (业务逻辑)  │  │ (DAO)   │ │
        │  └──────────────┘  └──────────────┘  └─────────┘ │
        │                                                   │
        │  ┌─────────────────────────────────────────────┐ │
        │  │  定时任务 (Quartz)                         │ │
        │  │  - 千川数据同步                            │ │
        │  │  - 聚水潭数据同步                          │ │
        │  │  - 成本自动更新                            │ │
        │  └─────────────────────────────────────────────┘ │
        │                                                   │
        │  ┌─────────────────────────────────────────────┐ │
        │  │  第三方API集成                              │ │
        │  │  - 抖店开放平台API                          │ │
        │  │  - 巨量千川API                              │ │
        │  │  - 聚水潭ERP API                            │ │
        │  └─────────────────────────────────────────────┘ │
        └───────────────────────────────────────────────────┘
                            │
        ┌───────────────────▼──────────────────┐
        │         MySQL数据库                  │
        │  (支持多租户数据隔离)                │
        └────────────────────────────────────┘
```

### 2.2 多租户设计

RuoYi框架支持两种多租户模式：

**COLUMN模式（推荐）**：在每张表中添加`tenant_id`字段进行数据隔离。这种模式的优点是：

- 数据库结构简单，易于维护
- 支持租户间数据共享和跨租户查询
- 性能开销小，适合中小型系统

**SCHEMA模式**：为每个租户创建独立的数据库schema。这种模式的优点是：

- 数据完全隔离，安全性最高
- 支持租户定制化扩展
- 适合大型企业级应用

本指南采用**COLUMN模式**，所有数据表都包含`tenant_id`字段。

### 2.3 模块划分

Java后端代码按功能划分为以下模块：

| 模块 | 包名 | 功能 |
|------|------|------|
| 财务管理 | com.yudao.module.finance | 核心财务功能 |
| 订单管理 | com.yudao.module.finance.order | 订单相关功能 |
| 成本管理 | com.yudao.module.finance.cost | 成本配置与管理 |
| 数据同步 | com.yudao.module.finance.sync | 第三方API数据同步 |
| 定时任务 | com.yudao.module.finance.job | 定时任务调度 |

---

## 三、详细迁移步骤

### 3.1 环境准备

**前置条件**：

- Java 11+（推荐Java 17）
- Maven 3.8+
- MySQL 8.0+
- Git

**第一步：克隆RuoYi-Vue-Pro项目**

```bash
git clone https://github.com/YunaiV/ruoyi-vue-pro.git
cd ruoyi-vue-pro
```

**第二步：创建财务模块**

```bash
# 在ruoyi-vue-pro/yudao-modules目录下创建财务模块
mkdir -p yudao-modules/yudao-module-finance

# 创建模块目录结构
cd yudao-modules/yudao-module-finance
mkdir -p src/main/java/com/yudao/module/finance/{controller,service,mapper,entity,dto,vo,api,job}
mkdir -p src/main/resources/mapper
mkdir -p src/test/java
```

**第三步：创建pom.xml**

在`yudao-modules/yudao-module-finance/pom.xml`中添加以下配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.yudao</groupId>
        <artifactId>yudao-modules</artifactId>
        <version>1.0.0</version>
    </parent>

    <artifactId>yudao-module-finance</artifactId>
    <packaging>jar</packaging>
    <name>yudao-module-finance</name>
    <description>财务管理模块</description>

    <dependencies>
        <!-- RuoYi框架依赖 -->
        <dependency>
            <groupId>com.yudao</groupId>
            <artifactId>yudao-framework-common</artifactId>
        </dependency>
        <dependency>
            <groupId>com.yudao</groupId>
            <artifactId>yudao-framework-mybatis</artifactId>
        </dependency>
        <dependency>
            <groupId>com.yudao</groupId>
            <artifactId>yudao-framework-web</artifactId>
        </dependency>

        <!-- 第三方API依赖 -->
        <dependency>
            <groupId>com.squareup.okhttp3</groupId>
            <artifactId>okhttp</artifactId>
            <version>4.11.0</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>2.0.41</version>
        </dependency>

        <!-- 定时任务 -->
        <dependency>
            <groupId>org.quartz-scheduler</groupId>
            <artifactId>quartz</artifactId>
            <version>2.3.2</version>
        </dependency>

        <!-- 测试 -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 3.2 数据库表迁移

**第一步：执行SQL脚本**

将`ruoyi-integration/sql/finance_schema.sql`中的SQL语句复制到RuoYi数据库中执行。该脚本创建以下表：

- `finance_product_costs`：商品成本表
- `finance_product_cost_history`：成本变动历史表
- `finance_orders`：订单表
- `finance_daily_stats`：每日统计表
- `finance_doudian_config`：抖店配置表
- `finance_qianchuan_config`：千川配置表
- `finance_qianchuan_expenses`：千川推广费表
- `finance_jst_config`：聚水潭配置表
- `finance_jst_purchase_in`：入库单表
- `finance_jst_purchase_in_item`：入库单明细表
- `finance_sync_log`：同步日志表

**第二步：添加租户隔离字段**

确保所有表都包含以下字段用于多租户隔离：

```sql
ALTER TABLE finance_product_costs ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 0 COMMENT '租户ID';
ALTER TABLE finance_orders ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 0 COMMENT '租户ID';
-- 其他表类似...

-- 为租户ID字段添加索引
ALTER TABLE finance_product_costs ADD INDEX idx_tenant_id (tenant_id);
ALTER TABLE finance_orders ADD INDEX idx_tenant_id (tenant_id);
-- 其他表类似...
```

### 3.3 实体类编写

**示例：商品成本实体类**

将`ruoyi-integration/java/entity/ProductCostDO.java`复制到`yudao-modules/yudao-module-finance/src/main/java/com/yudao/module/finance/entity/ProductCostDO.java`，并根据RuoYi框架规范调整：

```java
package com.yudao.module.finance.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.yudao.framework.common.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 商品成本 DO
 */
@TableName("finance_product_costs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCostDO extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 租户ID
     */
    private Long tenantId;

    /**
     * 商品ID（抖店商品ID）
     */
    private String productId;

    /**
     * SKU编码
     */
    private String sku;

    /**
     * 商品标题
     */
    private String title;

    /**
     * 商品成本价
     */
    private BigDecimal cost;

    /**
     * 商家编码
     */
    private String merchantCode;

    /**
     * 商品售价
     */
    private BigDecimal price;

    /**
     * 自定义名称
     */
    private String customName;

    /**
     * 库存数量
     */
    private Integer stock;

    /**
     * 状态：0有效，1删除
     */
    private Integer status;

    /**
     * 生效日期
     */
    private LocalDateTime effectiveDate;

    /**
     * 店铺名称
     */
    private String shopName;
}
```

### 3.4 Mapper接口编写

**示例：商品成本Mapper**

创建`ProductCostMapper.java`：

```java
package com.yudao.module.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yudao.module.finance.entity.ProductCostDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 商品成本 Mapper
 */
@Mapper
public interface ProductCostMapper extends BaseMapper<ProductCostDO> {

    /**
     * 分页查询商品成本
     */
    IPage<ProductCostDO> selectPage(Page<ProductCostDO> page,
                                    @Param("tenantId") Long tenantId,
                                    @Param("searchKey") String searchKey,
                                    @Param("shopName") String shopName);

    /**
     * 根据商品ID查询成本
     */
    ProductCostDO selectByProductId(@Param("tenantId") Long tenantId,
                                    @Param("productId") String productId);

    /**
     * 批量查询
     */
    List<ProductCostDO> selectByProductIds(@Param("tenantId") Long tenantId,
                                           @Param("productIds") List<String> productIds);
}
```

### 3.5 Service服务层编写

**示例：商品成本Service**

创建`ProductCostService.java`接口：

```java
package com.yudao.module.finance.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yudao.module.finance.dto.ProductCostCreateReqDTO;
import com.yudao.module.finance.dto.ProductCostUpdateReqDTO;
import com.yudao.module.finance.entity.ProductCostDO;
import com.yudao.module.finance.vo.ProductCostVO;

import java.util.List;

/**
 * 商品成本 Service
 */
public interface ProductCostService {

    /**
     * 分页查询商品成本
     */
    IPage<ProductCostVO> getProductCostPage(Long tenantId, Page<ProductCostDO> page,
                                            String searchKey, String shopName);

    /**
     * 获取商品成本详情
     */
    ProductCostVO getProductCost(Long tenantId, Long id);

    /**
     * 创建商品成本
     */
    Long createProductCost(Long tenantId, ProductCostCreateReqDTO createReqDTO);

    /**
     * 更新商品成本
     */
    void updateProductCost(Long tenantId, ProductCostUpdateReqDTO updateReqDTO);

    /**
     * 删除商品成本（软删除）
     */
    void deleteProductCost(Long tenantId, Long id);

    /**
     * 批量导入商品成本
     */
    void batchImportProductCosts(Long tenantId, List<ProductCostCreateReqDTO> costs);

    /**
     * 获取成本变动历史
     */
    List<ProductCostHistoryVO> getCostHistory(Long tenantId, Long productCostId);
}
```

创建`ProductCostServiceImpl.java`实现类：

```java
package com.yudao.module.finance.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yudao.framework.common.exception.ServiceException;
import com.yudao.module.finance.dto.ProductCostCreateReqDTO;
import com.yudao.module.finance.dto.ProductCostUpdateReqDTO;
import com.yudao.module.finance.entity.ProductCostDO;
import com.yudao.module.finance.entity.ProductCostHistoryDO;
import com.yudao.module.finance.mapper.ProductCostMapper;
import com.yudao.module.finance.mapper.ProductCostHistoryMapper;
import com.yudao.module.finance.service.ProductCostService;
import com.yudao.module.finance.vo.ProductCostVO;
import com.yudao.module.finance.vo.ProductCostHistoryVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 商品成本 Service 实现
 */
@Service
@Slf4j
public class ProductCostServiceImpl extends ServiceImpl<ProductCostMapper, ProductCostDO>
        implements ProductCostService {

    @Resource
    private ProductCostMapper productCostMapper;

    @Resource
    private ProductCostHistoryMapper productCostHistoryMapper;

    @Override
    public IPage<ProductCostVO> getProductCostPage(Long tenantId, Page<ProductCostDO> page,
                                                   String searchKey, String shopName) {
        IPage<ProductCostDO> pageResult = productCostMapper.selectPage(page, tenantId, searchKey, shopName);
        return pageResult.convert(this::convertToVO);
    }

    @Override
    public ProductCostVO getProductCost(Long tenantId, Long id) {
        ProductCostDO productCost = baseMapper.selectById(id);
        if (productCost == null || !productCost.getTenantId().equals(tenantId)) {
            throw new ServiceException("商品成本不存在");
        }
        return convertToVO(productCost);
    }

    @Override
    @Transactional
    public Long createProductCost(Long tenantId, ProductCostCreateReqDTO createReqDTO) {
        ProductCostDO productCost = ProductCostDO.builder()
                .tenantId(tenantId)
                .productId(createReqDTO.getProductId())
                .sku(createReqDTO.getSku())
                .title(createReqDTO.getTitle())
                .cost(createReqDTO.getCost())
                .merchantCode(createReqDTO.getMerchantCode())
                .price(createReqDTO.getPrice())
                .customName(createReqDTO.getCustomName())
                .stock(createReqDTO.getStock())
                .status(0)
                .effectiveDate(LocalDateTime.now())
                .shopName(createReqDTO.getShopName())
                .build();

        baseMapper.insert(productCost);
        return productCost.getId();
    }

    @Override
    @Transactional
    public void updateProductCost(Long tenantId, ProductCostUpdateReqDTO updateReqDTO) {
        ProductCostDO productCost = baseMapper.selectById(updateReqDTO.getId());
        if (productCost == null || !productCost.getTenantId().equals(tenantId)) {
            throw new ServiceException("商品成本不存在");
        }

        // 记录成本变动历史
        if (!productCost.getCost().equals(updateReqDTO.getCost())) {
            ProductCostHistoryDO history = ProductCostHistoryDO.builder()
                    .tenantId(tenantId)
                    .productCostId(productCost.getId())
                    .productId(productCost.getProductId())
                    .oldCost(productCost.getCost())
                    .newCost(updateReqDTO.getCost())
                    .reason(updateReqDTO.getReason())
                    .build();
            productCostHistoryMapper.insert(history);
        }

        // 更新成本信息
        productCost.setCost(updateReqDTO.getCost());
        productCost.setPrice(updateReqDTO.getPrice());
        productCost.setCustomName(updateReqDTO.getCustomName());
        productCost.setStock(updateReqDTO.getStock());
        baseMapper.updateById(productCost);
    }

    @Override
    @Transactional
    public void deleteProductCost(Long tenantId, Long id) {
        ProductCostDO productCost = baseMapper.selectById(id);
        if (productCost == null || !productCost.getTenantId().equals(tenantId)) {
            throw new ServiceException("商品成本不存在");
        }

        productCost.setStatus(1); // 软删除
        baseMapper.updateById(productCost);
    }

    @Override
    @Transactional
    public void batchImportProductCosts(Long tenantId, List<ProductCostCreateReqDTO> costs) {
        List<ProductCostDO> productCosts = costs.stream()
                .map(cost -> ProductCostDO.builder()
                        .tenantId(tenantId)
                        .productId(cost.getProductId())
                        .sku(cost.getSku())
                        .title(cost.getTitle())
                        .cost(cost.getCost())
                        .merchantCode(cost.getMerchantCode())
                        .price(cost.getPrice())
                        .customName(cost.getCustomName())
                        .stock(cost.getStock())
                        .status(0)
                        .effectiveDate(LocalDateTime.now())
                        .shopName(cost.getShopName())
                        .build())
                .collect(Collectors.toList());

        saveBatch(productCosts);
    }

    @Override
    public List<ProductCostHistoryVO> getCostHistory(Long tenantId, Long productCostId) {
        List<ProductCostHistoryDO> histories = productCostHistoryMapper.selectByProductCostId(tenantId, productCostId);
        return histories.stream()
                .map(this::convertHistoryToVO)
                .collect(Collectors.toList());
    }

    private ProductCostVO convertToVO(ProductCostDO productCost) {
        return ProductCostVO.builder()
                .id(productCost.getId())
                .productId(productCost.getProductId())
                .sku(productCost.getSku())
                .title(productCost.getTitle())
                .cost(productCost.getCost())
                .merchantCode(productCost.getMerchantCode())
                .price(productCost.getPrice())
                .customName(productCost.getCustomName())
                .stock(productCost.getStock())
                .shopName(productCost.getShopName())
                .createdAt(productCost.getCreateTime())
                .updatedAt(productCost.getUpdateTime())
                .build();
    }

    private ProductCostHistoryVO convertHistoryToVO(ProductCostHistoryDO history) {
        return ProductCostHistoryVO.builder()
                .id(history.getId())
                .productCostId(history.getProductCostId())
                .productId(history.getProductId())
                .oldCost(history.getOldCost())
                .newCost(history.getNewCost())
                .reason(history.getReason())
                .createdAt(history.getCreateTime())
                .build();
    }
}
```

### 3.6 Controller控制层编写

**示例：商品成本Controller**

创建`ProductCostController.java`：

```java
package com.yudao.module.finance.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yudao.framework.common.pojo.CommonResult;
import com.yudao.framework.common.pojo.PageResult;
import com.yudao.framework.web.core.util.ServletUtils;
import com.yudao.module.finance.dto.ProductCostCreateReqDTO;
import com.yudao.module.finance.dto.ProductCostUpdateReqDTO;
import com.yudao.module.finance.entity.ProductCostDO;
import com.yudao.module.finance.service.ProductCostService;
import com.yudao.module.finance.vo.ProductCostVO;
import com.yudao.module.finance.vo.ProductCostHistoryVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

/**
 * 商品成本 Controller
 */
@Tag(name = "商品成本管理")
@RestController
@RequestMapping("/finance/product-cost")
@Slf4j
public class ProductCostController {

    @Resource
    private ProductCostService productCostService;

    /**
     * 分页查询商品成本
     */
    @Operation(summary = "分页查询商品成本")
    @GetMapping("/page")
    public CommonResult<PageResult<ProductCostVO>> getProductCostPage(
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String searchKey,
            @RequestParam(required = false) String shopName) {

        Long tenantId = getTenantId();
        Page<ProductCostDO> page = new Page<>(pageNo, pageSize);
        IPage<ProductCostVO> result = productCostService.getProductCostPage(tenantId, page, searchKey, shopName);

        return CommonResult.success(new PageResult<>(result.getRecords(), result.getTotal()));
    }

    /**
     * 获取商品成本详情
     */
    @Operation(summary = "获取商品成本详情")
    @GetMapping("/{id}")
    public CommonResult<ProductCostVO> getProductCost(@PathVariable Long id) {
        Long tenantId = getTenantId();
        ProductCostVO productCost = productCostService.getProductCost(tenantId, id);
        return CommonResult.success(productCost);
    }

    /**
     * 创建商品成本
     */
    @Operation(summary = "创建商品成本")
    @PostMapping
    public CommonResult<Long> createProductCost(@Valid @RequestBody ProductCostCreateReqDTO createReqDTO) {
        Long tenantId = getTenantId();
        Long id = productCostService.createProductCost(tenantId, createReqDTO);
        return CommonResult.success(id);
    }

    /**
     * 更新商品成本
     */
    @Operation(summary = "更新商品成本")
    @PutMapping
    public CommonResult<Void> updateProductCost(@Valid @RequestBody ProductCostUpdateReqDTO updateReqDTO) {
        Long tenantId = getTenantId();
        productCostService.updateProductCost(tenantId, updateReqDTO);
        return CommonResult.success();
    }

    /**
     * 删除商品成本
     */
    @Operation(summary = "删除商品成本")
    @DeleteMapping("/{id}")
    public CommonResult<Void> deleteProductCost(@PathVariable Long id) {
        Long tenantId = getTenantId();
        productCostService.deleteProductCost(tenantId, id);
        return CommonResult.success();
    }

    /**
     * 批量导入商品成本
     */
    @Operation(summary = "批量导入商品成本")
    @PostMapping("/batch-import")
    public CommonResult<Void> batchImportProductCosts(@RequestBody List<ProductCostCreateReqDTO> costs) {
        Long tenantId = getTenantId();
        productCostService.batchImportProductCosts(tenantId, costs);
        return CommonResult.success();
    }

    /**
     * 获取成本变动历史
     */
    @Operation(summary = "获取成本变动历史")
    @GetMapping("/{id}/history")
    public CommonResult<List<ProductCostHistoryVO>> getCostHistory(@PathVariable Long id) {
        Long tenantId = getTenantId();
        List<ProductCostHistoryVO> histories = productCostService.getCostHistory(tenantId, id);
        return CommonResult.success(histories);
    }

    /**
     * 获取当前租户ID
     */
    private Long getTenantId() {
        // 从请求上下文中获取租户ID
        // 这里假设已通过拦截器或过滤器设置到ThreadLocal中
        return ServletUtils.getTenantId();
    }
}
```

### 3.7 定时任务配置

**示例：千川数据同步定时任务**

创建`QianchuanSyncJob.java`：

```java
package com.yudao.module.finance.job;

import com.yudao.module.finance.service.QianchuanSyncService;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobExecutionContext;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.time.LocalDate;

/**
 * 千川数据同步定时任务
 * 每日凌晨2点执行
 */
@Component
@Slf4j
public class QianchuanSyncJob extends QuartzJobBean {

    @Resource
    private QianchuanSyncService qianchuanSyncService;

    @Override
    protected void executeInternal(JobExecutionContext context) {
        try {
            log.info("开始执行千川数据同步任务");
            
            // 获取所有租户并同步数据
            LocalDate yesterday = LocalDate.now().minusDays(1);
            qianchuanSyncService.syncAllTenantsQianchuanData(yesterday, LocalDate.now());
            
            log.info("千川数据同步任务执行完成");
        } catch (Exception e) {
            log.error("千川数据同步任务执行失败", e);
        }
    }
}
```

在RuoYi配置文件中注册定时任务：

```yaml
spring:
  quartz:
    job-store-type: jdbc
    jdbc:
      initialize-schema: never
    properties:
      org:
        quartz:
          scheduler:
            instanceName: FinanceScheduler
          jobStore:
            class: org.quartz.impl.jdbcjobstore.JobStoreTX
            driverDelegateClass: org.quartz.impl.jdbcjobstore.StdJdbcDelegate
            tablePrefix: qrtz_
            isClustered: true
          threadPool:
            class: org.quartz.simpl.SimpleThreadPool
            threadCount: 10
```

### 3.8 第三方API集成

**示例：抖店API客户端**

创建`DoudianApiClient.java`：

```java
package com.yudao.module.finance.api;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.TreeMap;

/**
 * 抖店API客户端
 */
@Component
@Slf4j
public class DoudianApiClient {

    @Value("${doudian.app-key}")
    private String appKey;

    @Value("${doudian.app-secret}")
    private String appSecret;

    @Value("${doudian.api-url:https://api-seller.douyin.com}")
    private String apiUrl;

    private final OkHttpClient httpClient = new OkHttpClient();

    /**
     * 调用抖店API
     */
    public JSONObject callApi(String method, String path, JSONObject params, String accessToken) throws IOException {
        // 生成签名
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        String sign = generateSign(method, path, params, timestamp);

        // 构建请求头
        Headers headers = new Headers.Builder()
                .add("Authorization", "Bearer " + accessToken)
                .add("Content-Type", "application/json")
                .add("X-Timestamp", timestamp)
                .add("X-Sign", sign)
                .build();

        // 构建请求
        String url = apiUrl + path;
        Request.Builder requestBuilder = new Request.Builder()
                .url(url)
                .headers(headers);

        if ("GET".equals(method)) {
            requestBuilder.get();
        } else if ("POST".equals(method)) {
            RequestBody body = RequestBody.create(params.toJSONString(), MediaType.get("application/json"));
            requestBuilder.post(body);
        }

        Request request = requestBuilder.build();

        // 发送请求
        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body().string();
            return JSONObject.parseObject(responseBody);
        }
    }

    /**
     * 生成请求签名
     */
    private String generateSign(String method, String path, JSONObject params, String timestamp) {
        TreeMap<String, String> sortedParams = new TreeMap<>();
        sortedParams.put("timestamp", timestamp);
        sortedParams.put("app_key", appKey);

        if (params != null && !params.isEmpty()) {
            params.forEach((k, v) -> sortedParams.put(k, v.toString()));
        }

        StringBuilder sb = new StringBuilder();
        sb.append(method).append("\n");
        sb.append(path).append("\n");

        sortedParams.forEach((k, v) -> sb.append(k).append("=").append(v).append("&"));
        if (sb.length() > 0) {
            sb.deleteCharAt(sb.length() - 1);
        }

        String stringToSign = sb.toString();
        return hmacSha256(stringToSign, appSecret);
    }

    /**
     * HMAC-SHA256签名
     */
    private String hmacSha256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("HMAC-SHA256签名失败", e);
        }
    }
}
```

### 3.9 前端对接配置

**修改React前端API调用地址**

在`client/src/lib/trpc.ts`中修改API基础URL：

```typescript
// 原来的Node.js后端地址
// const apiUrl = 'http://localhost:3000/api/trpc'

// 修改为Java后端地址
const apiUrl = 'http://java-backend:8080/api/finance'

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: apiUrl,
      // ... 其他配置
    }),
  ],
})
```

---

## 四、测试与验证

### 4.1 单元测试

为每个Service编写单元测试，确保业务逻辑正确：

```java
package com.yudao.module.finance.service;

import com.yudao.module.finance.dto.ProductCostCreateReqDTO;
import com.yudao.module.finance.vo.ProductCostVO;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ProductCostServiceTest {

    @Resource
    private ProductCostService productCostService;

    @Test
    public void testCreateProductCost() {
        Long tenantId = 1L;
        ProductCostCreateReqDTO createReqDTO = new ProductCostCreateReqDTO();
        createReqDTO.setProductId("123456");
        createReqDTO.setSku("SKU001");
        createReqDTO.setTitle("测试商品");
        createReqDTO.setCost(new BigDecimal("50.00"));
        createReqDTO.setPrice(new BigDecimal("100.00"));

        Long id = productCostService.createProductCost(tenantId, createReqDTO);
        assertNotNull(id);

        ProductCostVO productCost = productCostService.getProductCost(tenantId, id);
        assertEquals("测试商品", productCost.getTitle());
    }
}
```

### 4.2 集成测试

测试API端点的完整流程：

```bash
# 创建商品成本
curl -X POST http://localhost:8080/api/finance/product-cost \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "productId": "123456",
    "sku": "SKU001",
    "title": "测试商品",
    "cost": "50.00",
    "price": "100.00"
  }'

# 查询商品成本列表
curl -X GET "http://localhost:8080/api/finance/product-cost/page?pageNo=1&pageSize=10" \
  -H "Authorization: Bearer {accessToken}"

# 更新商品成本
curl -X PUT http://localhost:8080/api/finance/product-cost \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "id": 1,
    "cost": "55.00",
    "reason": "供应商涨价"
  }'
```

---

## 五、部署与运维

### 5.1 打包部署

```bash
# 编译财务模块
cd yudao-modules/yudao-module-finance
mvn clean package -DskipTests

# 将生成的jar包复制到RuoYi项目的lib目录
cp target/yudao-module-finance-1.0.0.jar ../../../yudao-server/lib/

# 重启RuoYi应用
```

### 5.2 数据库备份

定期备份MySQL数据库，特别是财务相关表：

```bash
# 备份财务相关表
mysqldump -u root -p ruoyi_db finance_* > finance_backup_$(date +%Y%m%d).sql

# 恢复备份
mysql -u root -p ruoyi_db < finance_backup_20240101.sql
```

### 5.3 监控告警

配置日志监控和告警规则：

```yaml
# logback-spring.xml
<appender name="FINANCE_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>logs/finance.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
        <fileNamePattern>logs/finance.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
        <maxFileSize>100MB</maxFileSize>
        <maxHistory>30</maxHistory>
    </rollingPolicy>
    <encoder>
        <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
    </encoder>
</appender>

<logger name="com.yudao.module.finance" level="INFO" additivity="false">
    <appender-ref ref="FINANCE_FILE"/>
</logger>
```

---

## 六、常见问题解决

### Q1：多租户数据隔离不生效

**解决方案**：确保在所有查询操作中都添加了`tenant_id`条件。可以通过MyBatis拦截器自动添加：

```java
@Component
public class TenantInterceptor implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        // 自动为SQL添加租户条件
        // ...
        return invocation.proceed();
    }
}
```

### Q2：第三方API调用超时

**解决方案**：增加HTTP客户端超时时间，并实现重试机制：

```java
OkHttpClient httpClient = new OkHttpClient.Builder()
    .connectTimeout(30, TimeUnit.SECONDS)
    .readTimeout(30, TimeUnit.SECONDS)
    .writeTimeout(30, TimeUnit.SECONDS)
    .addInterceptor(new RetryInterceptor(3)) // 重试3次
    .build();
```

### Q3：定时任务重复执行

**解决方案**：在Quartz配置中启用集群模式，使用数据库锁防止重复执行：

```yaml
spring:
  quartz:
    properties:
      org:
        quartz:
          jobStore:
            isClustered: true
            clusterCheckinInterval: 15000
```

---

## 七、总结

通过本指南，您可以系统地将"闪电账PRO"的Node.js后端代码迁移到Java，并整合进RuoYi-Vue-Pro框架。关键步骤包括：

1. **环境准备**：搭建Java开发环境和RuoYi项目结构
2. **数据库迁移**：创建租户隔离的数据库表
3. **代码实现**：编写实体类、Mapper、Service、Controller等核心代码
4. **API集成**：对接抖店、千川、聚水潭等第三方API
5. **定时任务**：配置数据同步和自动更新任务
6. **测试部署**：完整的单元测试和集成测试
7. **运维监控**：日志监控和告警配置

迁移完成后，整个系统将具有更好的可扩展性、可维护性和企业级特性。

---

## 参考资源

- [RuoYi-Vue-Pro官方文档](https://doc.iocoder.cn/)
- [MyBatis-Plus官方文档](https://baomidou.com/)
- [Spring Boot官方文档](https://spring.io/projects/spring-boot)
- [抖店开放平台API文档](https://op.jinritemai.com/)
- [巨量千川API文档](https://open.oceanengine.com/)
- [聚水潭ERP API文档](https://open.jushuitan.com/)
