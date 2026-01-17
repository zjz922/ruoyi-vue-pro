# 聚水潭ERP开放平台API研究

## 平台概述

聚水潭ERP是一款电商ERP软件，主要用于订单管理、仓库管理、发货管理等。开放平台提供了丰富的API接口供第三方系统对接。

## API接口分类

根据聚水潭开放平台文档，主要API分类如下：

1. **基础API** - 店铺查询、物流公司查询、仓库查询
2. **商品API** - 商品信息管理
3. **库存API** - 库存查询和管理
4. **订单API** - 订单查询和管理
5. **物流API** - 物流信息管理
6. **采购API** - 采购单管理
7. **入库API** - 入库单管理（重点关注）
8. **出库API** - 出库单管理
9. **售后API** - 售后单管理
10. **其它出入库API** - 其他出入库操作
11. **调拨API** - 调拨单管理
12. **财务API** - 财务相关接口（重点关注）
13. **WMS API** - 仓库管理系统接口

## API请求地址

| 环境 | 地址 |
|------|------|
| 正式环境 | https://openapi.jushuitan.com |
| 测试环境 | https://dev-api.jushuitan.com |

## 公共请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| app_key | String | 是 | POP分配给应用的app_key |
| access_token | String | 是 | 通过code获取的access_token |
| timestamp | Long | 是 | UNIX时间戳，单位秒 |
| charset | String | 是 | 字符编码（固定值：utf-8） |
| version | String | 是 | 版本号，固定传2 |
| sign | String | 是 | 数字签名 |

## 待研究的重点接口

### 入库相关
- 入库单查询
- 入库单明细查询
- 入库单创建/上传

### 财务相关
- 费用单查询
- 结算单查询
- 财务流水查询

### 采购相关
- 采购单查询
- 采购入库单查询


## 入库API接口详情

### 采购入库查询 (purchasein.query)

**接口地址：**
- 正式环境: https://open.erp321.com/api/open/query.aspx
- 沙箱环境: https://c.jushuitan.com/api/open/query.aspx

**系统参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| partnerid | string | 是 | 合作方编号 |
| token | string | 是 | 授权码 |
| method | string | 是 | purchasein.query |
| ts | int | 是 | Unix时间戳 |
| sign | string | 是 | 签名 |

**请求参数：**
```json
{
    "modified_begin": "2021-09-26 20:00:34",
    "modified_end": "2021-09-26 20:00:36",
    "page_index": 1,
    "page_size": 30,
    "po_ids": ["271"]
}
```

**响应参数：**
- io_id: 入库单ID
- warehouse: 仓库名称
- po_id: 采购单ID
- supplier_id: 供应商ID
- supplier_name: 供应商名称
- status: 状态 (Confirmed等)
- io_date: 入库日期
- wh_id: 仓库ID
- type: 类型 (加工进仓等)
- items: 入库明细
  - ioi_id: 明细ID
  - sku_id: SKU编码
  - name: 商品名称
  - qty: 数量
  - cost_price: 成本价
  - cost_amount: 成本金额

### 入库单确认 (purchasein.received.upload)

用于确认入库单，将入库单状态更新为已确认。
