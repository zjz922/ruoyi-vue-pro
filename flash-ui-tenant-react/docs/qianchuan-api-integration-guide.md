# 巨量千川API集成指南

> 本指南详细说明如何将巨量千川（Ocean Engine）推广费用数据集成到闪电账PRO系统中，实现推广费用的自动获取和统计分析。

---

## 目录

1. [概述](#概述)
2. [前置准备](#前置准备)
3. [OAuth 2.0 授权流程](#oauth-20-授权流程)
4. [核心API接口](#核心api接口)
5. [数据库设计](#数据库设计)
6. [代码实现](#代码实现)
7. [前端对接](#前端对接)
8. [常见问题](#常见问题)

---

## 概述

### 什么是巨量千川

巨量千川是字节跳动旗下的电商广告投放平台，为抖音电商商家提供一站式营销解决方案。通过巨量千川API，可以获取广告投放数据、消耗报表、计划详情等信息。

### 与抖店API的区别

| 平台 | 用途 | 数据类型 |
|------|------|----------|
| **抖店开放平台** | 店铺管理、订单处理 | 订单、商品、售后、结算 |
| **巨量千川** | 广告投放管理 | 推广费用、投放计划、素材数据 |

### 集成目标

通过集成巨量千川API，闪电账PRO将能够：
- 自动获取每日推广费用消耗数据
- 按计划/素材维度分析投放效果
- 与订单数据关联计算真实ROI
- 实现推广费用的自动化对账

---

## 前置准备

### 1. 注册开发者账号

访问 [巨量引擎开放平台](https://open.oceanengine.com/) 注册开发者账号：

1. 点击右上角【注册】按钮
2. 使用公司邮箱进行注册（建议使用公司邮箱，一个公司信息仅能注册认证一个开发者账户）
3. 注册完成后自动登陆进入巨量开放平台
4. 点击开放平台官网右上角【开发者后台】，继续完善信息并通过企业认证

### 2. 创建应用

在开发者后台创建应用：

1. 进入【开发者后台】→【应用管理】
2. 点击【创建应用】
3. 选择应用类型：**自用型**（仅管理自己的广告账户）或 **工具型**（为多个客户提供服务）
4. 填写应用信息：应用名称、应用描述、回调地址等
5. 提交审核，等待审核通过

### 3. 获取应用凭证

审核通过后，获取以下凭证：

| 凭证 | 说明 | 示例 |
|------|------|------|
| **App ID** | 应用唯一标识 | `1234567890` |
| **App Secret** | 应用密钥（请妥善保管） | `xxxxxxxxxxxxxxxx` |

### 4. 申请API权限

在应用详情页申请所需的API权限（Scope）：

| 权限点 | 说明 | 必需 |
|--------|------|------|
| `qianchuan.report` | 数据报表权限 | ✓ |
| `qianchuan.ad` | 广告计划管理 | 可选 |
| `qianchuan.account` | 账户信息查询 | ✓ |
| `qianchuan.finance` | 财务流水查询 | ✓ |

---

## OAuth 2.0 授权流程

巨量千川使用OAuth 2.0协议进行授权，流程如下：

```
┌─────────┐     1. 引导授权      ┌─────────┐
│  用户   │ ─────────────────→  │ 千川授权 │
│ 浏览器  │                      │   页面   │
└─────────┘                      └─────────┘
     │                                │
     │     2. 用户同意授权            │
     │ ←──────────────────────────────┘
     │
     │     3. 重定向回调（带auth_code）
     ↓
┌─────────┐     4. 换取Token     ┌─────────┐
│  闪电账  │ ─────────────────→  │ 千川API │
│   PRO   │                      │  服务器  │
└─────────┘ ←─────────────────── └─────────┘
              5. 返回Access Token
```

### 步骤1：生成授权链接

```
https://ad.oceanengine.com/openapi/audit/oauth.html?
  app_id={app_id}&
  state={state}&
  scope={scope}&
  redirect_uri={redirect_uri}
```

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `app_id` | number | 是 | 应用ID |
| `state` | string | 否 | 自定义状态参数，用于防止CSRF攻击 |
| `scope` | string | 是 | 申请的权限范围，多个用逗号分隔 |
| `redirect_uri` | string | 是 | 授权回调地址（需URL编码） |

**示例：**

```
https://ad.oceanengine.com/openapi/audit/oauth.html?
  app_id=1234567890&
  state=random_string&
  scope=qianchuan.report,qianchuan.account,qianchuan.finance&
  redirect_uri=https%3A%2F%2Fyour-domain.com%2Fapi%2Fqianchuan%2Fcallback
```

### 步骤2：用户授权

用户在授权页面登录并选择要授权的广告账户，点击【同意授权】后，系统会重定向到回调地址：

```
https://your-domain.com/api/qianchuan/callback?auth_code=xxxx&state=random_string
```

### 步骤3：获取Access Token

使用`auth_code`换取`access_token`：

**请求地址：** `POST https://ad.oceanengine.com/open_api/oauth2/access_token/`

**请求参数：**

```json
{
  "app_id": 1234567890,
  "secret": "your_app_secret",
  "auth_code": "auth_code_from_callback"
}
```

**响应示例：**

```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "access_token": "xxxxxxxxxxxxxxxx",
    "refresh_token": "xxxxxxxxxxxxxxxx",
    "advertiser_id": 1234567890,
    "advertiser_ids": [1234567890, 1234567891],
    "expires_in": 86400,
    "refresh_token_expires_in": 604800
  }
}
```

**Token有效期：**

| Token类型 | 有效期 | 说明 |
|-----------|--------|------|
| `access_token` | 24小时 | 用于调用API |
| `refresh_token` | 7天 | 用于刷新access_token |

### 步骤4：刷新Token

在`refresh_token`有效期内，可以刷新获取新的Token：

**请求地址：** `POST https://ad.oceanengine.com/open_api/oauth2/refresh_token/`

**请求参数：**

```json
{
  "app_id": 1234567890,
  "secret": "your_app_secret",
  "grant_type": "refresh_token",
  "refresh_token": "your_refresh_token"
}
```

> **注意：** 刷新成功后，原`refresh_token`将失效，请妥善保存新的Token。

---

## 核心API接口

### 1. 获取投放账户数据（推广费用）

这是获取推广费用的核心接口。

**请求地址：** `GET https://ad.oceanengine.com/open_api/v1.0/qianchuan/report/advertiser/get/`

**请求头：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `Access-Token` | string | 是 | 授权access_token |

**请求参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `advertiser_id` | number | 是 | 广告主ID |
| `start_date` | string | 是 | 开始日期，格式：2025-04-01 |
| `end_date` | string | 是 | 结束日期，格式：2025-04-30 |
| `fields` | string[] | 是 | 查询字段列表 |
| `filtering` | object | 是 | 过滤条件 |
| `time_granularity` | string | 否 | 时间粒度：TIME_GRANULARITY_DAILY（天）/ TIME_GRANULARITY_HOURLY（小时） |

**常用查询字段（fields）：**

| 字段 | 说明 |
|------|------|
| `stat_cost` | 消耗金额（推广费用） |
| `show_cnt` | 展示次数 |
| `click_cnt` | 点击次数 |
| `ctr` | 点击率 |
| `cpm_platform` | 千次展示成本 |
| `pay_order_count` | 成交订单数 |
| `pay_order_amount` | 成交金额 |
| `prepay_and_pay_order_roi` | 支付ROI |
| `live_pay_order_cost_per_order` | 成交成本 |

**请求示例：**

```bash
curl --location --request GET 'https://ad.oceanengine.com/open_api/v1.0/qianchuan/report/advertiser/get/?advertiser_id=1234567890&start_date=2025-04-01&end_date=2025-04-30&fields=["stat_cost","show_cnt","click_cnt","pay_order_count","pay_order_amount"]&filtering={"marketing_goal":"ALL"}' \
--header 'Access-Token: your_access_token'
```

**响应示例：**

```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "list": [
      {
        "stat_datetime": "2025-04-01",
        "stat_cost": 5000.00,
        "show_cnt": 100000,
        "click_cnt": 5000,
        "pay_order_count": 100,
        "pay_order_amount": 15000.00
      }
    ],
    "page_info": {
      "page": 1,
      "page_size": 20,
      "total_number": 30,
      "total_page": 2
    }
  }
}
```

### 2. 获取投放计划数据

按投放计划维度获取消耗数据。

**请求地址：** `GET https://ad.oceanengine.com/open_api/v1.0/qianchuan/report/ad/get/`

**请求参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `advertiser_id` | number | 是 | 广告主ID |
| `start_date` | string | 是 | 开始日期 |
| `end_date` | string | 是 | 结束日期 |
| `fields` | string[] | 是 | 查询字段列表 |
| `filtering` | object | 否 | 过滤条件 |
| `page` | number | 否 | 页码，默认1 |
| `page_size` | number | 否 | 每页数量，默认20，最大100 |

### 3. 获取财务流水信息

获取账户的财务流水明细。

**请求地址：** `GET https://ad.oceanengine.com/open_api/v1.0/qianchuan/finance/flow/get/`

**请求参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `advertiser_id` | number | 是 | 广告主ID |
| `start_date` | string | 是 | 开始日期 |
| `end_date` | string | 是 | 结束日期 |
| `page` | number | 否 | 页码 |
| `page_size` | number | 否 | 每页数量 |

### 4. 获取账户余额

查询广告账户的余额信息。

**请求地址：** `GET https://ad.oceanengine.com/open_api/v1.0/qianchuan/account/balance/get/`

**请求参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `advertiser_id` | number | 是 | 广告主ID |

**响应示例：**

```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "balance": 50000.00,
    "valid_balance": 48000.00,
    "frozen": 2000.00,
    "cash": 30000.00,
    "grant": 20000.00
  }
}
```

---

## 数据库设计

### 千川配置表（qianchuan_config）

```sql
CREATE TABLE `qianchuan_config` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  `app_id` varchar(64) NOT NULL COMMENT '应用ID',
  `app_secret` varchar(256) NOT NULL COMMENT '应用密钥（加密存储）',
  `advertiser_id` bigint DEFAULT NULL COMMENT '广告主ID',
  `access_token` varchar(512) DEFAULT NULL COMMENT 'Access Token（加密存储）',
  `refresh_token` varchar(512) DEFAULT NULL COMMENT 'Refresh Token（加密存储）',
  `token_expires_at` datetime DEFAULT NULL COMMENT 'Token过期时间',
  `refresh_expires_at` datetime DEFAULT NULL COMMENT 'Refresh Token过期时间',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态：0-未授权，1-已授权，2-已过期',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='千川配置表';
```

### 千川推广费用表（qianchuan_cost）

```sql
CREATE TABLE `qianchuan_cost` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  `advertiser_id` bigint NOT NULL COMMENT '广告主ID',
  `stat_date` date NOT NULL COMMENT '统计日期',
  `stat_cost` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '消耗金额（推广费用）',
  `show_cnt` bigint NOT NULL DEFAULT '0' COMMENT '展示次数',
  `click_cnt` bigint NOT NULL DEFAULT '0' COMMENT '点击次数',
  `ctr` decimal(8,4) DEFAULT NULL COMMENT '点击率',
  `cpm` decimal(10,2) DEFAULT NULL COMMENT '千次展示成本',
  `pay_order_count` int NOT NULL DEFAULT '0' COMMENT '成交订单数',
  `pay_order_amount` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '成交金额',
  `roi` decimal(8,4) DEFAULT NULL COMMENT '支付ROI',
  `cost_per_order` decimal(10,2) DEFAULT NULL COMMENT '成交成本',
  `marketing_goal` varchar(32) DEFAULT NULL COMMENT '营销目标',
  `sync_time` datetime DEFAULT NULL COMMENT '同步时间',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_advertiser_date` (`tenant_id`, `advertiser_id`, `stat_date`),
  KEY `idx_stat_date` (`stat_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='千川推广费用表';
```

### 千川计划消耗表（qianchuan_ad_cost）

```sql
CREATE TABLE `qianchuan_ad_cost` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `tenant_id` bigint NOT NULL COMMENT '租户ID',
  `advertiser_id` bigint NOT NULL COMMENT '广告主ID',
  `ad_id` bigint NOT NULL COMMENT '计划ID',
  `ad_name` varchar(256) DEFAULT NULL COMMENT '计划名称',
  `stat_date` date NOT NULL COMMENT '统计日期',
  `stat_cost` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '消耗金额',
  `show_cnt` bigint NOT NULL DEFAULT '0' COMMENT '展示次数',
  `click_cnt` bigint NOT NULL DEFAULT '0' COMMENT '点击次数',
  `pay_order_count` int NOT NULL DEFAULT '0' COMMENT '成交订单数',
  `pay_order_amount` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '成交金额',
  `sync_time` datetime DEFAULT NULL COMMENT '同步时间',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_ad_date` (`tenant_id`, `advertiser_id`, `ad_id`, `stat_date`),
  KEY `idx_stat_date` (`stat_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='千川计划消耗表';
```

---

## 代码实现

### TypeScript实现（Node.js后端）

#### 1. 千川API客户端

```typescript
// server/qianchuanApi.ts
import crypto from 'crypto';

interface QianchuanConfig {
  appId: string;
  appSecret: string;
  accessToken?: string;
  refreshToken?: string;
  advertiserId?: number;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export class QianchuanApiClient {
  private config: QianchuanConfig;
  private baseUrl = 'https://ad.oceanengine.com/open_api';

  constructor(config: QianchuanConfig) {
    this.config = config;
  }

  // 生成授权链接
  getAuthUrl(redirectUri: string, state: string, scope: string[]): string {
    const params = new URLSearchParams({
      app_id: this.config.appId,
      state,
      scope: scope.join(','),
      redirect_uri: redirectUri,
    });
    return `https://ad.oceanengine.com/openapi/audit/oauth.html?${params.toString()}`;
  }

  // 获取Access Token
  async getAccessToken(authCode: string): Promise<ApiResponse<{
    access_token: string;
    refresh_token: string;
    advertiser_ids: number[];
    expires_in: number;
    refresh_token_expires_in: number;
  }>> {
    const response = await fetch(`${this.baseUrl}/oauth2/access_token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: parseInt(this.config.appId),
        secret: this.config.appSecret,
        auth_code: authCode,
      }),
    });
    return response.json();
  }

  // 刷新Token
  async refreshToken(): Promise<ApiResponse<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_token_expires_in: number;
  }>> {
    const response = await fetch(`${this.baseUrl}/oauth2/refresh_token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: parseInt(this.config.appId),
        secret: this.config.appSecret,
        grant_type: 'refresh_token',
        refresh_token: this.config.refreshToken,
      }),
    });
    return response.json();
  }

  // 获取投放账户数据（推广费用）
  async getAdvertiserReport(params: {
    advertiserId: number;
    startDate: string;
    endDate: string;
    fields: string[];
    marketingGoal?: string;
    timeGranularity?: string;
  }): Promise<ApiResponse<{
    list: Array<{
      stat_datetime: string;
      stat_cost: number;
      show_cnt: number;
      click_cnt: number;
      pay_order_count: number;
      pay_order_amount: number;
      [key: string]: any;
    }>;
    page_info: {
      page: number;
      page_size: number;
      total_number: number;
      total_page: number;
    };
  }>> {
    const queryParams = new URLSearchParams({
      advertiser_id: params.advertiserId.toString(),
      start_date: params.startDate,
      end_date: params.endDate,
      fields: JSON.stringify(params.fields),
      filtering: JSON.stringify({
        marketing_goal: params.marketingGoal || 'ALL',
      }),
    });

    if (params.timeGranularity) {
      queryParams.append('time_granularity', params.timeGranularity);
    }

    const response = await fetch(
      `${this.baseUrl}/v1.0/qianchuan/report/advertiser/get/?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Access-Token': this.config.accessToken || '',
        },
      }
    );
    return response.json();
  }

  // 获取账户余额
  async getAccountBalance(advertiserId: number): Promise<ApiResponse<{
    balance: number;
    valid_balance: number;
    frozen: number;
    cash: number;
    grant: number;
  }>> {
    const response = await fetch(
      `${this.baseUrl}/v1.0/qianchuan/account/balance/get/?advertiser_id=${advertiserId}`,
      {
        method: 'GET',
        headers: {
          'Access-Token': this.config.accessToken || '',
        },
      }
    );
    return response.json();
  }

  // 获取财务流水
  async getFinanceFlow(params: {
    advertiserId: number;
    startDate: string;
    endDate: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<{
    list: Array<{
      transaction_seq: string;
      transaction_type: number;
      amount: number;
      cash: number;
      grant: number;
      create_time: string;
      remark: string;
    }>;
    page_info: {
      page: number;
      page_size: number;
      total_number: number;
      total_page: number;
    };
  }>> {
    const queryParams = new URLSearchParams({
      advertiser_id: params.advertiserId.toString(),
      start_date: params.startDate,
      end_date: params.endDate,
      page: (params.page || 1).toString(),
      page_size: (params.pageSize || 20).toString(),
    });

    const response = await fetch(
      `${this.baseUrl}/v1.0/qianchuan/finance/flow/get/?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Access-Token': this.config.accessToken || '',
        },
      }
    );
    return response.json();
  }
}
```

#### 2. 千川路由（tRPC）

```typescript
// server/qianchuanRouter.ts
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './_core/trpc';
import { QianchuanApiClient } from './qianchuanApi';

export const qianchuanRouter = router({
  // 获取授权链接
  getAuthUrl: protectedProcedure
    .input(z.object({
      redirectUri: z.string(),
      state: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const appId = process.env.QIANCHUAN_APP_ID;
      const appSecret = process.env.QIANCHUAN_APP_SECRET;
      
      if (!appId || !appSecret) {
        throw new Error('千川API凭证未配置');
      }

      const client = new QianchuanApiClient({ appId, appSecret });
      const scope = ['qianchuan.report', 'qianchuan.account', 'qianchuan.finance'];
      const state = input.state || crypto.randomUUID();
      
      return {
        authUrl: client.getAuthUrl(input.redirectUri, state, scope),
        state,
      };
    }),

  // 处理授权回调
  handleCallback: protectedProcedure
    .input(z.object({
      authCode: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const appId = process.env.QIANCHUAN_APP_ID;
      const appSecret = process.env.QIANCHUAN_APP_SECRET;
      
      if (!appId || !appSecret) {
        throw new Error('千川API凭证未配置');
      }

      const client = new QianchuanApiClient({ appId, appSecret });
      const result = await client.getAccessToken(input.authCode);
      
      if (result.code !== 0) {
        throw new Error(result.message || '获取Token失败');
      }

      // 保存Token到数据库（需要实现）
      // await saveQianchuanConfig(ctx.userId, result.data);

      return {
        success: true,
        advertiserIds: result.data.advertiser_ids,
      };
    }),

  // 同步推广费用数据
  syncCostData: protectedProcedure
    .input(z.object({
      advertiserId: z.number(),
      startDate: z.string(),
      endDate: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // 从数据库获取Token（需要实现）
      // const config = await getQianchuanConfig(ctx.userId);
      
      const client = new QianchuanApiClient({
        appId: process.env.QIANCHUAN_APP_ID!,
        appSecret: process.env.QIANCHUAN_APP_SECRET!,
        accessToken: 'your_access_token', // 从数据库获取
      });

      const result = await client.getAdvertiserReport({
        advertiserId: input.advertiserId,
        startDate: input.startDate,
        endDate: input.endDate,
        fields: [
          'stat_cost',
          'show_cnt',
          'click_cnt',
          'pay_order_count',
          'pay_order_amount',
          'prepay_and_pay_order_roi',
        ],
        timeGranularity: 'TIME_GRANULARITY_DAILY',
      });

      if (result.code !== 0) {
        throw new Error(result.message || '获取数据失败');
      }

      // 保存数据到数据库（需要实现）
      // await saveQianchuanCostData(ctx.userId, input.advertiserId, result.data.list);

      return {
        success: true,
        count: result.data.list.length,
        data: result.data.list,
      };
    }),

  // 获取账户余额
  getBalance: protectedProcedure
    .input(z.object({
      advertiserId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const client = new QianchuanApiClient({
        appId: process.env.QIANCHUAN_APP_ID!,
        appSecret: process.env.QIANCHUAN_APP_SECRET!,
        accessToken: 'your_access_token', // 从数据库获取
      });

      const result = await client.getAccountBalance(input.advertiserId);

      if (result.code !== 0) {
        throw new Error(result.message || '获取余额失败');
      }

      return result.data;
    }),
});
```

### Java实现（RuoYi后端）

#### 1. 千川API客户端

```java
// QianchuanApiClient.java
package cn.iocoder.flash.module.finance.service.qianchuan;

import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class QianchuanApiClient {
    
    private static final String BASE_URL = "https://ad.oceanengine.com/open_api";
    
    /**
     * 生成授权链接
     */
    public String getAuthUrl(String appId, String redirectUri, String state, List<String> scope) {
        StringBuilder url = new StringBuilder("https://ad.oceanengine.com/openapi/audit/oauth.html?");
        url.append("app_id=").append(appId);
        url.append("&state=").append(state);
        url.append("&scope=").append(String.join(",", scope));
        url.append("&redirect_uri=").append(java.net.URLEncoder.encode(redirectUri, java.nio.charset.StandardCharsets.UTF_8));
        return url.toString();
    }
    
    /**
     * 获取Access Token
     */
    public JSONObject getAccessToken(String appId, String appSecret, String authCode) {
        String url = BASE_URL + "/oauth2/access_token/";
        
        Map<String, Object> params = new HashMap<>();
        params.put("app_id", Long.parseLong(appId));
        params.put("secret", appSecret);
        params.put("auth_code", authCode);
        
        String response = HttpUtil.post(url, JSONUtil.toJsonStr(params));
        return JSONUtil.parseObj(response);
    }
    
    /**
     * 刷新Token
     */
    public JSONObject refreshToken(String appId, String appSecret, String refreshToken) {
        String url = BASE_URL + "/oauth2/refresh_token/";
        
        Map<String, Object> params = new HashMap<>();
        params.put("app_id", Long.parseLong(appId));
        params.put("secret", appSecret);
        params.put("grant_type", "refresh_token");
        params.put("refresh_token", refreshToken);
        
        String response = HttpUtil.post(url, JSONUtil.toJsonStr(params));
        return JSONUtil.parseObj(response);
    }
    
    /**
     * 获取投放账户数据（推广费用）
     */
    public JSONObject getAdvertiserReport(String accessToken, Long advertiserId, 
            String startDate, String endDate, List<String> fields, String marketingGoal) {
        StringBuilder url = new StringBuilder(BASE_URL + "/v1.0/qianchuan/report/advertiser/get/?");
        url.append("advertiser_id=").append(advertiserId);
        url.append("&start_date=").append(startDate);
        url.append("&end_date=").append(endDate);
        url.append("&fields=").append(JSONUtil.toJsonStr(fields));
        
        Map<String, String> filtering = new HashMap<>();
        filtering.put("marketing_goal", marketingGoal != null ? marketingGoal : "ALL");
        url.append("&filtering=").append(JSONUtil.toJsonStr(filtering));
        url.append("&time_granularity=TIME_GRANULARITY_DAILY");
        
        String response = HttpUtil.createGet(url.toString())
                .header("Access-Token", accessToken)
                .execute()
                .body();
        
        return JSONUtil.parseObj(response);
    }
    
    /**
     * 获取账户余额
     */
    public JSONObject getAccountBalance(String accessToken, Long advertiserId) {
        String url = BASE_URL + "/v1.0/qianchuan/account/balance/get/?advertiser_id=" + advertiserId;
        
        String response = HttpUtil.createGet(url)
                .header("Access-Token", accessToken)
                .execute()
                .body();
        
        return JSONUtil.parseObj(response);
    }
}
```

#### 2. 千川Service

```java
// QianchuanService.java
package cn.iocoder.flash.module.finance.service.qianchuan;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.iocoder.flash.module.finance.dal.dataobject.QianchuanConfigDO;
import cn.iocoder.flash.module.finance.dal.dataobject.QianchuanCostDO;
import cn.iocoder.flash.module.finance.dal.mysql.QianchuanConfigMapper;
import cn.iocoder.flash.module.finance.dal.mysql.QianchuanCostMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class QianchuanService {
    
    private final QianchuanApiClient apiClient;
    private final QianchuanConfigMapper configMapper;
    private final QianchuanCostMapper costMapper;
    
    /**
     * 同步推广费用数据
     */
    @Transactional(rollbackFor = Exception.class)
    public int syncCostData(Long tenantId, Long advertiserId, String startDate, String endDate) {
        // 获取配置
        QianchuanConfigDO config = configMapper.selectByTenantAndAdvertiser(tenantId, advertiserId);
        if (config == null || config.getAccessToken() == null) {
            throw new RuntimeException("千川账户未授权");
        }
        
        // 检查Token是否过期
        if (config.getTokenExpiresAt().isBefore(LocalDateTime.now())) {
            // 刷新Token
            refreshAndSaveToken(config);
        }
        
        // 调用API获取数据
        List<String> fields = Arrays.asList(
            "stat_cost", "show_cnt", "click_cnt", 
            "pay_order_count", "pay_order_amount", "prepay_and_pay_order_roi"
        );
        
        JSONObject result = apiClient.getAdvertiserReport(
            config.getAccessToken(), advertiserId, startDate, endDate, fields, "ALL"
        );
        
        if (result.getInt("code") != 0) {
            throw new RuntimeException("获取数据失败: " + result.getStr("message"));
        }
        
        // 保存数据
        JSONArray list = result.getJSONObject("data").getJSONArray("list");
        int count = 0;
        
        for (int i = 0; i < list.size(); i++) {
            JSONObject item = list.getJSONObject(i);
            
            QianchuanCostDO cost = new QianchuanCostDO();
            cost.setTenantId(tenantId);
            cost.setAdvertiserId(advertiserId);
            cost.setStatDate(LocalDate.parse(item.getStr("stat_datetime")));
            cost.setStatCost(item.getBigDecimal("stat_cost"));
            cost.setShowCnt(item.getLong("show_cnt"));
            cost.setClickCnt(item.getLong("click_cnt"));
            cost.setPayOrderCount(item.getInt("pay_order_count"));
            cost.setPayOrderAmount(item.getBigDecimal("pay_order_amount"));
            cost.setRoi(item.getBigDecimal("prepay_and_pay_order_roi"));
            cost.setSyncTime(LocalDateTime.now());
            
            // 计算点击率和千次展示成本
            if (cost.getShowCnt() > 0) {
                cost.setCtr(BigDecimal.valueOf(cost.getClickCnt())
                    .divide(BigDecimal.valueOf(cost.getShowCnt()), 4, BigDecimal.ROUND_HALF_UP));
                cost.setCpm(cost.getStatCost()
                    .divide(BigDecimal.valueOf(cost.getShowCnt()), 2, BigDecimal.ROUND_HALF_UP)
                    .multiply(BigDecimal.valueOf(1000)));
            }
            
            // 计算成交成本
            if (cost.getPayOrderCount() > 0) {
                cost.setCostPerOrder(cost.getStatCost()
                    .divide(BigDecimal.valueOf(cost.getPayOrderCount()), 2, BigDecimal.ROUND_HALF_UP));
            }
            
            // 插入或更新
            costMapper.insertOrUpdate(cost);
            count++;
        }
        
        return count;
    }
    
    /**
     * 刷新并保存Token
     */
    private void refreshAndSaveToken(QianchuanConfigDO config) {
        JSONObject result = apiClient.refreshToken(
            config.getAppId(), config.getAppSecret(), config.getRefreshToken()
        );
        
        if (result.getInt("code") != 0) {
            throw new RuntimeException("刷新Token失败: " + result.getStr("message"));
        }
        
        JSONObject data = result.getJSONObject("data");
        config.setAccessToken(data.getStr("access_token"));
        config.setRefreshToken(data.getStr("refresh_token"));
        config.setTokenExpiresAt(LocalDateTime.now().plusSeconds(data.getLong("expires_in")));
        config.setRefreshExpiresAt(LocalDateTime.now().plusSeconds(data.getLong("refresh_token_expires_in")));
        
        configMapper.updateById(config);
    }
}
```

---

## 前端对接

### 千川授权组件

```tsx
// components/QianchuanAuth.tsx
import React, { useState } from 'react';
import { Button, Card, message, Steps, Input, Alert } from 'antd';
import { trpc } from '../utils/trpc';

export function QianchuanAuth() {
  const [step, setStep] = useState(0);
  const [authCode, setAuthCode] = useState('');
  
  const { data: authData, refetch: getAuthUrl } = trpc.qianchuan.getAuthUrl.useQuery({
    redirectUri: `${window.location.origin}/api/qianchuan/callback`,
  }, { enabled: false });
  
  const handleAuthMutation = trpc.qianchuan.handleCallback.useMutation({
    onSuccess: (data) => {
      message.success('授权成功！');
      setStep(2);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  
  const handleStartAuth = async () => {
    const result = await getAuthUrl();
    if (result.data?.authUrl) {
      window.open(result.data.authUrl, '_blank');
      setStep(1);
    }
  };
  
  const handleSubmitCode = () => {
    if (!authCode) {
      message.warning('请输入授权码');
      return;
    }
    handleAuthMutation.mutate({ authCode });
  };
  
  return (
    <Card title="巨量千川授权">
      <Steps current={step} style={{ marginBottom: 24 }}>
        <Steps.Step title="开始授权" />
        <Steps.Step title="输入授权码" />
        <Steps.Step title="完成" />
      </Steps>
      
      {step === 0 && (
        <div>
          <Alert
            message="授权说明"
            description="点击下方按钮将打开巨量千川授权页面，请登录并选择要授权的广告账户。授权完成后，将授权码粘贴到下一步的输入框中。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Button type="primary" onClick={handleStartAuth}>
            开始授权
          </Button>
        </div>
      )}
      
      {step === 1 && (
        <div>
          <Alert
            message="请完成授权"
            description="在打开的页面中完成授权后，将URL中的auth_code参数值粘贴到下方输入框。"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Input.Search
            placeholder="请输入授权码(auth_code)"
            enterButton="提交"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            onSearch={handleSubmitCode}
            loading={handleAuthMutation.isLoading}
          />
        </div>
      )}
      
      {step === 2 && (
        <Alert
          message="授权成功"
          description="您已成功授权巨量千川账户，现在可以同步推广费用数据了。"
          type="success"
          showIcon
        />
      )}
    </Card>
  );
}
```

### 推广费用同步组件

```tsx
// components/QianchuanSync.tsx
import React, { useState } from 'react';
import { Button, Card, DatePicker, Table, message, Statistic, Row, Col } from 'antd';
import { trpc } from '../utils/trpc';
import dayjs from 'dayjs';

export function QianchuanSync({ advertiserId }: { advertiserId: number }) {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  
  const syncMutation = trpc.qianchuan.syncCostData.useMutation({
    onSuccess: (data) => {
      message.success(`同步成功，共${data.count}条数据`);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  
  const { data: balance } = trpc.qianchuan.getBalance.useQuery({ advertiserId });
  
  const handleSync = () => {
    syncMutation.mutate({
      advertiserId,
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
    });
  };
  
  const columns = [
    { title: '日期', dataIndex: 'stat_datetime', key: 'date' },
    { title: '消耗', dataIndex: 'stat_cost', key: 'cost', render: (v: number) => `¥${v.toFixed(2)}` },
    { title: '展示', dataIndex: 'show_cnt', key: 'show', render: (v: number) => v.toLocaleString() },
    { title: '点击', dataIndex: 'click_cnt', key: 'click', render: (v: number) => v.toLocaleString() },
    { title: '成交订单', dataIndex: 'pay_order_count', key: 'orders' },
    { title: '成交金额', dataIndex: 'pay_order_amount', key: 'amount', render: (v: number) => `¥${v.toFixed(2)}` },
  ];
  
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="账户余额" value={balance?.balance || 0} prefix="¥" precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="可用余额" value={balance?.valid_balance || 0} prefix="¥" precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="冻结金额" value={balance?.frozen || 0} prefix="¥" precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="赠款余额" value={balance?.grant || 0} prefix="¥" precision={2} />
          </Card>
        </Col>
      </Row>
      
      <Card title="推广费用同步">
        <div style={{ marginBottom: 16 }}>
          <DatePicker.RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            style={{ marginRight: 16 }}
          />
          <Button type="primary" onClick={handleSync} loading={syncMutation.isLoading}>
            同步数据
          </Button>
        </div>
        
        {syncMutation.data && (
          <Table
            columns={columns}
            dataSource={syncMutation.data.data}
            rowKey="stat_datetime"
            pagination={false}
            summary={(data) => {
              const totalCost = data.reduce((sum, item) => sum + item.stat_cost, 0);
              const totalAmount = data.reduce((sum, item) => sum + item.pay_order_amount, 0);
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>¥{totalCost.toFixed(2)}</Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>¥{totalAmount.toFixed(2)}</Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />
        )}
      </Card>
    </div>
  );
}
```

---

## 常见问题

### 1. 授权失败

**问题：** 用户授权后，回调地址收不到auth_code

**解决方案：**
- 检查回调地址是否与应用配置一致
- 确保回调地址已在开发者后台配置
- 回调地址必须使用HTTPS协议

### 2. Token过期

**问题：** 调用API返回"access_token已过期"

**解决方案：**
- 在每次API调用前检查Token过期时间
- 实现自动刷新Token的逻辑
- 建议在Token过期前5分钟主动刷新

### 3. 频控限制

**问题：** 调用API返回"请求过于频繁"

**解决方案：**
- 巨量千川API有频控限制，通常为10次/秒
- 实现请求队列和限流机制
- 批量获取数据时使用分页，避免单次请求过大

### 4. 数据延迟

**问题：** 同步的数据与千川后台不一致

**解决方案：**
- 千川数据通常有T+1的延迟
- 建议同步前一天及之前的数据
- 当天数据可能会有更新，建议定时重新同步

### 5. 权限不足

**问题：** 调用API返回"没有权限"

**解决方案：**
- 检查应用是否申请了对应的Scope权限
- 确认用户授权时选择了正确的权限范围
- 部分接口需要特殊权限，需联系千川客服申请

---

## 参考资料

- [巨量千川开放平台文档](https://open.oceanengine.com/labels/12)
- [OAuth 2.0授权流程](https://open.oceanengine.com/labels/12/docs/1697458777498636)
- [数据报表API](https://open.oceanengine.com/labels/12/docs/1697466393573376)
- [频控限制说明](https://open.oceanengine.com/labels/12/docs/1697459486216200)

---

*本文档由 Manus AI 生成，最后更新时间：2026年1月14日*
