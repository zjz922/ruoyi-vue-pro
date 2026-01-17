# 抖店开放平台API研究

## API基础信息

**开放平台地址**: https://op.jinritemai.com/
**API文档地址**: https://op.jinritemai.com/docs/api-docs/
**API调用地址**: https://openapi-fxg.jinritemai.com/

## 用户提供的密钥
- appKey: 7569846683366884874
- appSecret: 5ed2bbdd-cc97-4871-a3c3-e013ff1f381e

## 公共参数

| 参数名称 | 参数类型 | 是否必须 | 示例值 | 参数描述 |
|---------|---------|---------|-------|---------|
| method | String | 是 | order.searchList | 调用的API接口名称 |
| app_key | String | 是 | 7569846683366884874 | 应用创建完成后被分配的key |
| access_token | String | 是 | edae7c30-8386-443b-8a1-031111596fdd | 用于调用API的access_token |
| param_json | String | 是 | {cid:12,page:1} | 标准json类型，业务参数按照参数名的字符串大小排序 |
| timestamp | String | 是 | 2020-09-15 14:48:13 | 时间戳，格式为yyyy-MM-dd HH:mm:ss，时区为GMT+8 |
| v | String | 是 | 2 | API协议版本，当前版本为2 |
| sign | String | 是 | 796559d40beb08a1a1113c456c5c5a62 | 输入参数签名结果 |
| sign_method | String | 否 | hmac-sha256 | 签名算法类型，推荐使用hmac-sha256 |

## 签名算法
推荐使用hmac-sha256算法，后续会下线md5

## 可用的API接口

### 订单API
- /order/searchList - 订单列表查询（支持近90天数据）
- /order/orderDetail - 订单详情查询
- /order/invoiceList - 查看商家开票列表
- /order/batchDecrypt - 批量解密接口
- /order/batchEncrypt - 批量加密接口

### 商品API
- /product/listV2 - 商品列表查询
- /product/detail - 商品详情查询

### 账单API（财务相关）
- 需要进一步查看账单API分类

### 精选联盟API（达人佣金相关）
- 需要进一步查看精选联盟API分类

### 保险API
- 需要进一步查看保险API分类

## 限流规则
- 应用限流频次：1000次/秒
- 接口总限流频次：5500次/秒

## 注意事项
1. 需要先获取access_token才能调用业务API
2. 订单列表查询最大支持查询近90天的数据
3. 翻页查询最多支持查询到5万条，需要缩短查询时间范围
4. 单页最大支持100条数据


## 账单API（财务相关）

| 接口名称 | 接口描述 |
|---------|---------|
| /order/downloadShopAccountItemFile | 资金流水明细文件下载(境内) |
| /order/getShopAccountItem | 资金流水明细接口(境内) |
| /order/downloadShopAccountItem | 资金流水明细下载请求(境内) |
| /order/downloadSettleItemToShop | 结算账单下载请求（境内） |
| /order/downloadToShop | 结算账单文件下载-URL方式（境内） |
| /order/getSettleBillDetailV3 | 商家结算账单 |
| /sendHome/settle/getShopAccountItem | 资金流水明细接口(境内,关联门店ID门店自编码) |


## 精选联盟API（达人佣金相关）

| 接口名称 | 接口描述 |
|---------|---------|
| /buyin/douKeSettleBillList | 支持查询抖客结算账单明细 |
| /buyin/shopPidMemberCreate | 店铺会员绑定渠道关系创建 |
| /buyin/kolLivePreviewShare | 达人直播预告转链 |
| /buyin/doukeActivityShare | 活动页转链接口 |
| /buyin/doukeCommandParseAndShare | 口令解析&转链 |
| /buyin/shareRedpack | 抖客红包转链 |
| /buyin/distributionRedpackDetailList | 达人抖客红包详情 |
| /buyin/doukePidDel | 独立抖客PID删除 |
| /buyin/doukePidEdit | 独立抖客PID编辑 |
| /buyin/doukePidCreate | 独立抖客PID创建 |


## 保险API

| 接口名称 | 接口描述 |
|---------|---------|
| /order/policy | 查保单详情 |
| /order/insurance | 查询运费险保单的详细信息 |

## API可用性分析

根据抖店开放平台API文档分析，以下是各类数据的API可用性：

| 数据类型 | API可用性 | 相关接口 |
|---------|----------|---------|
| 订单数据 | ✓ 可用 | /order/searchList, /order/orderDetail |
| 商品数据 | ✓ 可用 | /product/listV2, /product/detail |
| 达人佣金 | ✓ 可用 | /buyin/douKeSettleBillList |
| 服务费 | ⚠️ 部分可用 | 需通过结算账单获取 |
| 保险费 | ✓ 可用 | /order/insurance, /order/policy |
| 快递费 | ⚠️ 需通过订单详情获取 | /order/orderDetail |
| 推广费（千川） | ❌ 不在抖店API范围 | 需要对接巨量千川API |
| 其他费用 | ⚠️ 需通过结算账单获取 | /order/getSettleBillDetailV3 |
| 赔付 | ⚠️ 需通过售后API获取 | /afterSale/List, /afterSale/Detail |

## 千川API说明

千川（巨量千川）是独立于抖店的广告投放平台，需要单独对接：
- 巨量千川开放平台: https://ad.oceanengine.com/
- 需要单独的广告账户和API密钥
- 与抖店API是两套独立的系统

