# 抖店API对接功能验证

## 已实现功能

### 1. API密钥配置
- DOUDIAN_APP_KEY 和 DOUDIAN_APP_SECRET 已配置
- 系统自动检测并显示配置状态

### 2. 数据同步页面 (/doudian-sync)
- 显示API配置状态
- 支持设置同步时间范围（最近30天/90天）
- 显示各数据模块的可用接口

### 3. 可用API模块

| 模块 | 接口 | 状态 |
|------|------|------|
| 订单数据 | order.searchList, order.orderDetail | ✓ 可用 |
| 商品数据 | product.listV2, product.detail | ✓ 可用 |
| 结算账单 | order.getSettleBillDetailV3, order.getShopAccountItem | ✓ 可用 |
| 达人佣金 | buyin.douKeSettleBillList | ✓ 可用 |
| 保险费 | order.insurance, order.policy | ✓ 可用 |
| 售后赔付 | afterSale.List, afterSale.Detail | ✓ 可用 |
| 千川推广 | - | ✗ 需单独对接巨量千川API |

### 4. 技术实现
- 签名算法: hmac-sha256
- API调用地址: https://openapi-fxg.jinritemai.com
- 支持OAuth授权流程获取Access Token

## 待完成功能

1. **OAuth授权流程**: 实现完整的店铺授权流程，自动获取和刷新Access Token
2. **数据自动同步**: 实现定时自动同步订单和财务数据
3. **千川API对接**: 需要单独申请巨量千川API密钥

## 使用说明

1. 在抖店开放平台创建应用并获取App Key和App Secret
2. 在系统中配置DOUDIAN_APP_KEY和DOUDIAN_APP_SECRET环境变量
3. 通过OAuth授权流程获取Access Token
4. 在数据同步页面选择需要同步的数据模块
