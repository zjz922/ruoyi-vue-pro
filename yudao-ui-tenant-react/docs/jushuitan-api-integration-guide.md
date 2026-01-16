# 聚水潭ERP API集成指南

## 概述

本文档详细说明如何将聚水潭ERP系统的仓库入库数据和费用数据集成到闪电账PRO系统中。聚水潭是国内领先的电商ERP软件，主要用于订单管理、仓库管理、发货管理等，与抖店等电商平台深度集成。

## 1. 平台接入准备

### 1.1 申请开发者账号

1. 访问聚水潭开放平台：https://open.jushuitan.com
2. 注册开发者账号并完成企业认证
3. 创建应用，获取以下凭证：
   - **Partner ID**：合作方编号
   - **Partner Key**：合作方密钥（用于签名）
   - **Token**：授权码（通过OAuth获取）

### 1.2 API请求地址

| 环境 | 请求地址 |
|------|----------|
| 正式环境 | https://open.erp321.com/api/open/query.aspx |
| 沙箱环境 | https://c.jushuitan.com/api/open/query.aspx |
| 新版正式环境 | https://openapi.jushuitan.com |
| 新版测试环境 | https://dev-api.jushuitan.com |

### 1.3 公共请求参数

所有API请求都需要携带以下公共参数：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| partnerid | String | 是 | 合作方编号 |
| token | String | 是 | 授权码 |
| method | String | 是 | 接口名称 |
| ts | Long | 是 | Unix时间戳（秒），与服务器时间差不超过10分钟 |
| sign | String | 是 | 数字签名 |

## 2. 签名算法

聚水潭API使用MD5签名算法，签名步骤如下：

```
1. 将所有请求参数按参数名ASCII码升序排列
2. 拼接成 key1=value1&key2=value2 格式的字符串
3. 在字符串末尾追加 Partner Key
4. 对整个字符串进行MD5加密，转为大写
```

### TypeScript签名实现

```typescript
import crypto from 'crypto';

interface JstApiParams {
  partnerid: string;
  token: string;
  method: string;
  ts: number;
  [key: string]: any;
}

function generateSign(params: JstApiParams, partnerKey: string): string {
  // 按参数名ASCII码升序排列
  const sortedKeys = Object.keys(params).sort();
  
  // 拼接参数字符串
  const paramStr = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  // 追加密钥并MD5加密
  const signStr = paramStr + partnerKey;
  return crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
}
```

### Java签名实现

```java
import java.security.MessageDigest;
import java.util.*;

public class JstSignUtil {
    public static String generateSign(Map<String, String> params, String partnerKey) {
        // 按参数名ASCII码升序排列
        List<String> keys = new ArrayList<>(params.keySet());
        Collections.sort(keys);
        
        // 拼接参数字符串
        StringBuilder sb = new StringBuilder();
        for (String key : keys) {
            if (sb.length() > 0) sb.append("&");
            sb.append(key).append("=").append(params.get(key));
        }
        
        // 追加密钥并MD5加密
        sb.append(partnerKey);
        return md5(sb.toString()).toUpperCase();
    }
    
    private static String md5(String str) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytes = md.digest(str.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
```

## 3. 核心API接口

### 3.1 入库相关API

#### 3.1.1 采购入库查询 (purchasein.query)

用于查询采购入库单信息，包含入库数量、成本价、供应商等关键数据。

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| modified_begin | String | 是 | 修改开始时间，格式：yyyy-MM-dd HH:mm:ss |
| modified_end | String | 是 | 修改结束时间，间隔不超过7天 |
| page_index | Integer | 否 | 页码，默认1 |
| page_size | Integer | 否 | 每页条数，默认30，最大50 |
| po_ids | Array | 否 | 采购单ID列表 |
| status | String | 否 | 状态筛选 |

**响应参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| io_id | Integer | 入库单ID |
| warehouse | String | 仓库名称 |
| po_id | Integer | 采购单ID |
| supplier_id | Integer | 供应商ID |
| supplier_name | String | 供应商名称 |
| status | String | 状态（Confirmed/Cancelled等） |
| io_date | String | 入库日期 |
| wh_id | Integer | 仓库ID |
| type | String | 类型（采购入库/加工进仓等） |
| items | Array | 入库明细列表 |

**入库明细(items)字段：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| ioi_id | Integer | 明细ID |
| sku_id | String | SKU编码 |
| name | String | 商品名称 |
| qty | Integer | 入库数量 |
| cost_price | Decimal | 成本单价 |
| cost_amount | Decimal | 成本金额 |

**请求示例：**

```json
{
    "modified_begin": "2025-01-01 00:00:00",
    "modified_end": "2025-01-07 23:59:59",
    "page_index": 1,
    "page_size": 30
}
```

**响应示例：**

```json
{
    "code": 0,
    "issuccess": true,
    "msg": "执行成功",
    "page_index": 1,
    "page_size": 30,
    "page_count": 1,
    "has_next": false,
    "datas": [
        {
            "io_id": 183,
            "warehouse": "主仓库",
            "po_id": 271,
            "supplier_id": 3877328,
            "supplier_name": "供应商A",
            "status": "Confirmed",
            "io_date": "2025-01-05 10:30:00",
            "wh_id": 3,
            "type": "采购入库",
            "items": [
                {
                    "ioi_id": 217,
                    "sku_id": "SKU001",
                    "name": "商品A",
                    "qty": 100,
                    "cost_price": 15.00,
                    "cost_amount": 1500.00
                }
            ]
        }
    ]
}
```

#### 3.1.2 入库单确认 (purchasein.received.upload)

用于确认入库单，将入库单状态更新为已确认。

### 3.2 库存相关API

#### 3.2.1 库存查询 (inventory.query)

用于查询商品库存信息。

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| sku_ids | Array | 否 | SKU编码列表 |
| wh_id | Integer | 否 | 仓库ID |
| page_index | Integer | 否 | 页码 |
| page_size | Integer | 否 | 每页条数 |

### 3.3 订单相关API

#### 3.3.1 订单查询 (orders.single.query)

用于查询订单信息，可获取订单的发货状态、物流信息等。

**注意：** 此接口查询不到淘系和拼多多订单信息，需要通过奇门接口获取。

### 3.4 财务相关API

#### 3.4.1 API接口账单查询 (api.bill)

用于查询API接口的消费记录。

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| request_begin | String | 是 | 开始日期，格式：yyyy-MM-dd |
| request_end | String | 是 | 结束日期，间隔不超过50天 |

### 3.5 销售出库API

#### 3.5.1 销售出库查询 (saleout.list.query)

用于查询销售出库单信息，包含物流费用等数据。

## 4. 数据库表设计

### 4.1 聚水潭配置表 (jst_config)

```sql
CREATE TABLE `finance_jst_config` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `partner_id` VARCHAR(64) NOT NULL COMMENT '合作方编号',
    `partner_key` VARCHAR(128) NOT NULL COMMENT '合作方密钥',
    `token` VARCHAR(256) COMMENT '授权Token',
    `token_expires_at` DATETIME COMMENT 'Token过期时间',
    `co_id` BIGINT COMMENT '公司编号',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    `last_sync_time` DATETIME COMMENT '最后同步时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聚水潭配置表';
```

### 4.2 入库单表 (jst_purchase_in)

```sql
CREATE TABLE `finance_jst_purchase_in` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `io_id` BIGINT NOT NULL COMMENT '入库单ID',
    `po_id` BIGINT COMMENT '采购单ID',
    `warehouse` VARCHAR(128) COMMENT '仓库名称',
    `wh_id` BIGINT COMMENT '仓库ID',
    `supplier_id` BIGINT COMMENT '供应商ID',
    `supplier_name` VARCHAR(128) COMMENT '供应商名称',
    `status` VARCHAR(32) COMMENT '状态',
    `io_date` DATETIME COMMENT '入库日期',
    `type` VARCHAR(32) COMMENT '入库类型',
    `total_qty` INT DEFAULT 0 COMMENT '总数量',
    `total_amount` DECIMAL(12,2) DEFAULT 0 COMMENT '总金额',
    `remark` TEXT COMMENT '备注',
    `raw_data` JSON COMMENT '原始数据',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_tenant_io` (`tenant_id`, `io_id`),
    KEY `idx_io_date` (`io_date`),
    KEY `idx_supplier` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聚水潭入库单表';
```

### 4.3 入库明细表 (jst_purchase_in_item)

```sql
CREATE TABLE `finance_jst_purchase_in_item` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `purchase_in_id` BIGINT NOT NULL COMMENT '入库单ID（关联finance_jst_purchase_in.id）',
    `ioi_id` BIGINT NOT NULL COMMENT '明细ID',
    `sku_id` VARCHAR(64) COMMENT 'SKU编码',
    `name` VARCHAR(256) COMMENT '商品名称',
    `qty` INT DEFAULT 0 COMMENT '入库数量',
    `cost_price` DECIMAL(10,2) DEFAULT 0 COMMENT '成本单价',
    `cost_amount` DECIMAL(12,2) DEFAULT 0 COMMENT '成本金额',
    `remark` VARCHAR(512) COMMENT '备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_purchase_in` (`purchase_in_id`),
    KEY `idx_sku` (`sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聚水潭入库明细表';
```

### 4.4 仓库费用表 (jst_warehouse_fee)

```sql
CREATE TABLE `finance_jst_warehouse_fee` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `fee_date` DATE NOT NULL COMMENT '费用日期',
    `wh_id` BIGINT COMMENT '仓库ID',
    `warehouse` VARCHAR(128) COMMENT '仓库名称',
    `storage_fee` DECIMAL(10,2) DEFAULT 0 COMMENT '仓储费',
    `handling_fee` DECIMAL(10,2) DEFAULT 0 COMMENT '操作费',
    `packaging_fee` DECIMAL(10,2) DEFAULT 0 COMMENT '包装费',
    `other_fee` DECIMAL(10,2) DEFAULT 0 COMMENT '其他费用',
    `total_fee` DECIMAL(10,2) DEFAULT 0 COMMENT '总费用',
    `remark` TEXT COMMENT '备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_tenant_date_wh` (`tenant_id`, `fee_date`, `wh_id`),
    KEY `idx_fee_date` (`fee_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聚水潭仓库费用表';
```

### 4.5 同步日志表 (jst_sync_log)

```sql
CREATE TABLE `finance_jst_sync_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tenant_id` BIGINT NOT NULL COMMENT '租户ID',
    `sync_type` VARCHAR(32) NOT NULL COMMENT '同步类型：purchase_in/inventory/order/fee',
    `sync_date` DATE COMMENT '同步数据日期',
    `start_time` DATETIME NOT NULL COMMENT '开始时间',
    `end_time` DATETIME COMMENT '结束时间',
    `status` VARCHAR(16) NOT NULL COMMENT '状态：running/success/failed',
    `total_count` INT DEFAULT 0 COMMENT '总记录数',
    `success_count` INT DEFAULT 0 COMMENT '成功数',
    `fail_count` INT DEFAULT 0 COMMENT '失败数',
    `error_message` TEXT COMMENT '错误信息',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_type` (`tenant_id`, `sync_type`),
    KEY `idx_sync_date` (`sync_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聚水潭同步日志表';
```

## 5. TypeScript实现代码

### 5.1 聚水潭API客户端

```typescript
// server/jstApi.ts
import crypto from 'crypto';

interface JstConfig {
  partnerId: string;
  partnerKey: string;
  token: string;
  baseUrl?: string;
}

interface JstApiResponse<T = any> {
  code: number;
  issuccess: boolean;
  msg: string;
  data?: T;
  datas?: T[];
  page_index?: number;
  page_size?: number;
  page_count?: number;
  has_next?: boolean;
}

export class JstApiClient {
  private config: JstConfig;
  private baseUrl: string;

  constructor(config: JstConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://open.erp321.com/api/open/query.aspx';
  }

  // 生成签名
  private generateSign(params: Record<string, any>): string {
    const sortedKeys = Object.keys(params).sort();
    const paramStr = sortedKeys
      .map(key => `${key}=${params[key]}`)
      .join('&');
    const signStr = paramStr + this.config.partnerKey;
    return crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
  }

  // 发起API请求
  async request<T = any>(method: string, bizParams: Record<string, any> = {}): Promise<JstApiResponse<T>> {
    const ts = Math.floor(Date.now() / 1000);
    
    const params: Record<string, any> = {
      partnerid: this.config.partnerId,
      token: this.config.token,
      method,
      ts,
      ...bizParams
    };

    params.sign = this.generateSign(params);

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(params).toString()
    });

    return response.json();
  }

  // 查询采购入库单
  async queryPurchaseIn(params: {
    modified_begin: string;
    modified_end: string;
    page_index?: number;
    page_size?: number;
    po_ids?: number[];
    status?: string;
  }): Promise<JstApiResponse> {
    return this.request('purchasein.query', params);
  }

  // 查询库存
  async queryInventory(params: {
    sku_ids?: string[];
    wh_id?: number;
    page_index?: number;
    page_size?: number;
  }): Promise<JstApiResponse> {
    return this.request('inventory.query', params);
  }

  // 查询店铺
  async queryShops(params: {
    page_index?: number;
    page_size?: number;
    shop_ids?: number[];
  }): Promise<JstApiResponse> {
    return this.request('shops.query', params);
  }

  // 查询仓库
  async queryWarehouses(): Promise<JstApiResponse> {
    return this.request('wms.partner.query', {});
  }

  // 查询销售出库单
  async querySaleOut(params: {
    modified_begin: string;
    modified_end: string;
    page_index?: number;
    page_size?: number;
  }): Promise<JstApiResponse> {
    return this.request('saleout.list.query', params);
  }
}
```

### 5.2 数据同步服务

```typescript
// server/jstSyncService.ts
import { JstApiClient } from './jstApi';
import { db } from './db';

export class JstSyncService {
  private client: JstApiClient;
  private tenantId: number;

  constructor(tenantId: number, config: {
    partnerId: string;
    partnerKey: string;
    token: string;
  }) {
    this.tenantId = tenantId;
    this.client = new JstApiClient(config);
  }

  // 同步采购入库数据
  async syncPurchaseIn(startDate: string, endDate: string): Promise<{
    total: number;
    success: number;
    failed: number;
  }> {
    let pageIndex = 1;
    const pageSize = 50;
    let hasNext = true;
    let total = 0;
    let success = 0;
    let failed = 0;

    while (hasNext) {
      const response = await this.client.queryPurchaseIn({
        modified_begin: startDate,
        modified_end: endDate,
        page_index: pageIndex,
        page_size: pageSize
      });

      if (response.code !== 0 || !response.datas) {
        throw new Error(response.msg || '查询入库单失败');
      }

      for (const item of response.datas) {
        try {
          await this.savePurchaseIn(item);
          success++;
        } catch (error) {
          failed++;
          console.error('保存入库单失败:', error);
        }
        total++;
      }

      hasNext = response.has_next || false;
      pageIndex++;
    }

    return { total, success, failed };
  }

  // 保存入库单到数据库
  private async savePurchaseIn(data: any): Promise<void> {
    // 计算总数量和总金额
    let totalQty = 0;
    let totalAmount = 0;
    if (data.items) {
      for (const item of data.items) {
        totalQty += item.qty || 0;
        totalAmount += item.cost_amount || 0;
      }
    }

    // 插入或更新入库单主表
    await db.execute(`
      INSERT INTO finance_jst_purchase_in 
      (tenant_id, io_id, po_id, warehouse, wh_id, supplier_id, supplier_name, 
       status, io_date, type, total_qty, total_amount, remark, raw_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        warehouse = VALUES(warehouse),
        supplier_name = VALUES(supplier_name),
        status = VALUES(status),
        total_qty = VALUES(total_qty),
        total_amount = VALUES(total_amount),
        raw_data = VALUES(raw_data),
        updated_at = NOW()
    `, [
      this.tenantId,
      data.io_id,
      data.po_id,
      data.warehouse,
      data.wh_id,
      data.supplier_id,
      data.supplier_name,
      data.status,
      data.io_date,
      data.type,
      totalQty,
      totalAmount,
      data.remark,
      JSON.stringify(data)
    ]);

    // 获取入库单ID
    const [rows] = await db.execute(
      'SELECT id FROM finance_jst_purchase_in WHERE tenant_id = ? AND io_id = ?',
      [this.tenantId, data.io_id]
    );
    const purchaseInId = (rows as any[])[0]?.id;

    // 删除旧的明细记录
    await db.execute(
      'DELETE FROM finance_jst_purchase_in_item WHERE purchase_in_id = ?',
      [purchaseInId]
    );

    // 插入明细记录
    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        await db.execute(`
          INSERT INTO finance_jst_purchase_in_item
          (tenant_id, purchase_in_id, ioi_id, sku_id, name, qty, cost_price, cost_amount, remark)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          this.tenantId,
          purchaseInId,
          item.ioi_id,
          item.sku_id,
          item.name,
          item.qty,
          item.cost_price,
          item.cost_amount,
          item.remark
        ]);
      }
    }
  }

  // 更新每日统计中的入库成本数据
  async updateDailyStats(date: string): Promise<void> {
    // 查询当日入库总成本
    const [rows] = await db.execute(`
      SELECT SUM(total_amount) as total_cost
      FROM finance_jst_purchase_in
      WHERE tenant_id = ? AND DATE(io_date) = ?
    `, [this.tenantId, date]);

    const totalCost = (rows as any[])[0]?.total_cost || 0;

    // 更新每日统计表的入库成本字段
    await db.execute(`
      UPDATE finance_daily_stats
      SET purchase_cost = ?, updated_at = NOW()
      WHERE tenant_id = ? AND stat_date = ?
    `, [totalCost, this.tenantId, date]);
  }
}
```

## 6. Java实现代码

### 6.1 聚水潭API客户端

```java
// JstApiClient.java
package cn.iocoder.yudao.module.finance.service.jst;

import cn.hutool.crypto.digest.DigestUtil;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Slf4j
public class JstApiClient {
    
    private final String partnerId;
    private final String partnerKey;
    private final String token;
    private final String baseUrl;
    
    public JstApiClient(String partnerId, String partnerKey, String token) {
        this(partnerId, partnerKey, token, "https://open.erp321.com/api/open/query.aspx");
    }
    
    public JstApiClient(String partnerId, String partnerKey, String token, String baseUrl) {
        this.partnerId = partnerId;
        this.partnerKey = partnerKey;
        this.token = token;
        this.baseUrl = baseUrl;
    }
    
    /**
     * 生成签名
     */
    private String generateSign(Map<String, String> params) {
        List<String> keys = new ArrayList<>(params.keySet());
        Collections.sort(keys);
        
        StringBuilder sb = new StringBuilder();
        for (String key : keys) {
            if (sb.length() > 0) sb.append("&");
            sb.append(key).append("=").append(params.get(key));
        }
        sb.append(partnerKey);
        
        return DigestUtil.md5Hex(sb.toString()).toUpperCase();
    }
    
    /**
     * 发起API请求
     */
    public JSONObject request(String method, Map<String, Object> bizParams) {
        long ts = System.currentTimeMillis() / 1000;
        
        Map<String, String> params = new HashMap<>();
        params.put("partnerid", partnerId);
        params.put("token", token);
        params.put("method", method);
        params.put("ts", String.valueOf(ts));
        
        // 将业务参数转为JSON字符串
        if (bizParams != null && !bizParams.isEmpty()) {
            params.put("jst_param", JSONUtil.toJsonStr(bizParams));
        }
        
        params.put("sign", generateSign(params));
        
        String response = HttpUtil.post(baseUrl, params);
        return JSONUtil.parseObj(response);
    }
    
    /**
     * 查询采购入库单
     */
    public JSONObject queryPurchaseIn(String modifiedBegin, String modifiedEnd, 
                                       int pageIndex, int pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("modified_begin", modifiedBegin);
        params.put("modified_end", modifiedEnd);
        params.put("page_index", pageIndex);
        params.put("page_size", pageSize);
        return request("purchasein.query", params);
    }
    
    /**
     * 查询库存
     */
    public JSONObject queryInventory(List<String> skuIds, Integer whId, 
                                      int pageIndex, int pageSize) {
        Map<String, Object> params = new HashMap<>();
        if (skuIds != null) params.put("sku_ids", skuIds);
        if (whId != null) params.put("wh_id", whId);
        params.put("page_index", pageIndex);
        params.put("page_size", pageSize);
        return request("inventory.query", params);
    }
    
    /**
     * 查询店铺
     */
    public JSONObject queryShops(int pageIndex, int pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("page_index", pageIndex);
        params.put("page_size", pageSize);
        return request("shops.query", params);
    }
}
```

### 6.2 数据同步服务

```java
// JstSyncService.java
package cn.iocoder.yudao.module.finance.service.jst;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.iocoder.yudao.module.finance.dal.dataobject.jst.*;
import cn.iocoder.yudao.module.finance.dal.mysql.jst.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class JstSyncService {
    
    @Resource
    private JstConfigMapper jstConfigMapper;
    
    @Resource
    private JstPurchaseInMapper purchaseInMapper;
    
    @Resource
    private JstPurchaseInItemMapper purchaseInItemMapper;
    
    @Resource
    private JstSyncLogMapper syncLogMapper;
    
    /**
     * 同步采购入库数据
     */
    @Transactional(rollbackFor = Exception.class)
    public JstSyncLogDO syncPurchaseIn(Long tenantId, String startDate, String endDate) {
        // 获取配置
        JstConfigDO config = jstConfigMapper.selectByTenantId(tenantId);
        if (config == null) {
            throw new RuntimeException("未找到聚水潭配置");
        }
        
        // 创建同步日志
        JstSyncLogDO syncLog = new JstSyncLogDO();
        syncLog.setTenantId(tenantId);
        syncLog.setSyncType("purchase_in");
        syncLog.setStartTime(LocalDateTime.now());
        syncLog.setStatus("running");
        syncLogMapper.insert(syncLog);
        
        try {
            JstApiClient client = new JstApiClient(
                config.getPartnerId(),
                config.getPartnerKey(),
                config.getToken()
            );
            
            int pageIndex = 1;
            int pageSize = 50;
            boolean hasNext = true;
            int total = 0, success = 0, failed = 0;
            
            while (hasNext) {
                JSONObject response = client.queryPurchaseIn(
                    startDate, endDate, pageIndex, pageSize
                );
                
                if (response.getInt("code") != 0) {
                    throw new RuntimeException(response.getStr("msg"));
                }
                
                JSONArray datas = response.getJSONArray("datas");
                if (datas != null) {
                    for (int i = 0; i < datas.size(); i++) {
                        try {
                            savePurchaseIn(tenantId, datas.getJSONObject(i));
                            success++;
                        } catch (Exception e) {
                            log.error("保存入库单失败", e);
                            failed++;
                        }
                        total++;
                    }
                }
                
                hasNext = response.getBool("has_next", false);
                pageIndex++;
            }
            
            // 更新同步日志
            syncLog.setEndTime(LocalDateTime.now());
            syncLog.setStatus("success");
            syncLog.setTotalCount(total);
            syncLog.setSuccessCount(success);
            syncLog.setFailCount(failed);
            syncLogMapper.updateById(syncLog);
            
            return syncLog;
            
        } catch (Exception e) {
            syncLog.setEndTime(LocalDateTime.now());
            syncLog.setStatus("failed");
            syncLog.setErrorMessage(e.getMessage());
            syncLogMapper.updateById(syncLog);
            throw e;
        }
    }
    
    /**
     * 保存入库单
     */
    private void savePurchaseIn(Long tenantId, JSONObject data) {
        Long ioId = data.getLong("io_id");
        
        // 计算总数量和总金额
        int totalQty = 0;
        BigDecimal totalAmount = BigDecimal.ZERO;
        JSONArray items = data.getJSONArray("items");
        if (items != null) {
            for (int i = 0; i < items.size(); i++) {
                JSONObject item = items.getJSONObject(i);
                totalQty += item.getInt("qty", 0);
                totalAmount = totalAmount.add(item.getBigDecimal("cost_amount"));
            }
        }
        
        // 查询是否已存在
        JstPurchaseInDO existing = purchaseInMapper.selectByTenantAndIoId(tenantId, ioId);
        
        JstPurchaseInDO purchaseIn = new JstPurchaseInDO();
        purchaseIn.setTenantId(tenantId);
        purchaseIn.setIoId(ioId);
        purchaseIn.setPoId(data.getLong("po_id"));
        purchaseIn.setWarehouse(data.getStr("warehouse"));
        purchaseIn.setWhId(data.getLong("wh_id"));
        purchaseIn.setSupplierId(data.getLong("supplier_id"));
        purchaseIn.setSupplierName(data.getStr("supplier_name"));
        purchaseIn.setStatus(data.getStr("status"));
        purchaseIn.setIoDate(data.getLocalDateTime("io_date", null));
        purchaseIn.setType(data.getStr("type"));
        purchaseIn.setTotalQty(totalQty);
        purchaseIn.setTotalAmount(totalAmount);
        purchaseIn.setRemark(data.getStr("remark"));
        purchaseIn.setRawData(data.toString());
        
        if (existing != null) {
            purchaseIn.setId(existing.getId());
            purchaseInMapper.updateById(purchaseIn);
        } else {
            purchaseInMapper.insert(purchaseIn);
        }
        
        // 删除旧的明细
        purchaseInItemMapper.deleteByPurchaseInId(purchaseIn.getId());
        
        // 保存明细
        if (items != null) {
            for (int i = 0; i < items.size(); i++) {
                JSONObject item = items.getJSONObject(i);
                JstPurchaseInItemDO itemDO = new JstPurchaseInItemDO();
                itemDO.setTenantId(tenantId);
                itemDO.setPurchaseInId(purchaseIn.getId());
                itemDO.setIoiId(item.getLong("ioi_id"));
                itemDO.setSkuId(item.getStr("sku_id"));
                itemDO.setName(item.getStr("name"));
                itemDO.setQty(item.getInt("qty", 0));
                itemDO.setCostPrice(item.getBigDecimal("cost_price"));
                itemDO.setCostAmount(item.getBigDecimal("cost_amount"));
                itemDO.setRemark(item.getStr("remark"));
                purchaseInItemMapper.insert(itemDO);
            }
        }
    }
}
```

## 7. 与闪电账PRO数据关联

### 7.1 入库成本与订单利润关联

聚水潭入库数据可以与闪电账PRO的订单数据进行关联，实现更精准的利润计算：

1. **SKU成本匹配**：通过SKU编码将入库成本与订单商品关联
2. **每日成本汇总**：按日期汇总入库成本，更新每日统计数据
3. **供应商分析**：分析不同供应商的采购成本变化趋势

### 7.2 数据同步策略

| 数据类型 | 同步频率 | 同步方式 |
|----------|----------|----------|
| 采购入库单 | 每日凌晨2点 | 增量同步（按修改时间） |
| 库存数据 | 每4小时 | 全量同步 |
| 仓库费用 | 每日凌晨3点 | 按日期同步 |

### 7.3 定时任务配置

```java
// JstSyncJob.java
@Component
@Slf4j
public class JstSyncJob {
    
    @Resource
    private JstSyncService jstSyncService;
    
    @Resource
    private TenantService tenantService;
    
    /**
     * 每日凌晨2点同步入库数据
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void syncPurchaseIn() {
        log.info("开始同步聚水潭入库数据");
        
        // 获取所有启用聚水潭的租户
        List<Long> tenantIds = tenantService.getJstEnabledTenants();
        
        String yesterday = LocalDate.now().minusDays(1).toString();
        String today = LocalDate.now().toString();
        
        for (Long tenantId : tenantIds) {
            try {
                jstSyncService.syncPurchaseIn(tenantId, 
                    yesterday + " 00:00:00", 
                    today + " 00:00:00"
                );
                log.info("租户{}入库数据同步完成", tenantId);
            } catch (Exception e) {
                log.error("租户{}入库数据同步失败", tenantId, e);
            }
        }
    }
}
```

## 8. 注意事项

1. **API调用频率限制**：聚水潭API有调用频率限制，建议控制在每秒10次以内
2. **Token有效期**：Token有有效期限制，需要定期刷新
3. **数据一致性**：建议使用增量同步，通过modified_begin/modified_end参数获取变更数据
4. **错误处理**：API返回code非0时表示调用失败，需要记录日志并重试
5. **时间格式**：所有时间参数使用 yyyy-MM-dd HH:mm:ss 格式

## 参考资料

- [聚水潭开放平台官方文档](https://open.jushuitan.com)
- [聚水潭新版开放平台](https://openweb.jushuitan.com/dev-doc)
- [聚水潭API签名算法说明](https://open.jushuitan.com/document/11.html)
