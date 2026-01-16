/**
 * 抖店开放平台API客户端
 * 文档: https://op.jinritemai.com/docs/guide-docs/10/23
 */

import crypto from 'crypto';

// API配置
const DOUDIAN_API_URL = 'https://openapi-fxg.jinritemai.com';
const API_VERSION = '2';

// 从环境变量获取密钥
const APP_KEY = process.env.DOUDIAN_APP_KEY || '';
const APP_SECRET = process.env.DOUDIAN_APP_SECRET || '';

/**
 * 对对象的键进行递归排序
 */
function sortObjectKeys(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  
  const sortedObj: any = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sortedObj[key] = sortObjectKeys(obj[key]);
  }
  return sortedObj;
}

/**
 * 生成签名
 * 签名算法: hmac-sha256
 * 拼接顺序: app_key + method + param_json + timestamp + v
 * 头尾拼接app_secret
 */
function generateSign(
  appKey: string,
  appSecret: string,
  method: string,
  paramJson: string,
  timestamp: string
): string {
  // 按照指定顺序拼接参数
  const paramPattern = `app_key${appKey}method${method}param_json${paramJson}timestamp${timestamp}v${API_VERSION}`;
  
  // 头尾拼接app_secret
  const signPattern = `${appSecret}${paramPattern}${appSecret}`;
  
  // 使用hmac-sha256算法计算签名
  const sign = crypto.createHmac('sha256', appSecret)
    .update(signPattern)
    .digest('hex');
  
  return sign;
}

/**
 * 调用抖店API
 */
export async function callDoudianApi(
  method: string,
  params: Record<string, any>,
  accessToken: string
): Promise<any> {
  if (!APP_KEY || !APP_SECRET) {
    throw new Error('抖店API密钥未配置，请设置DOUDIAN_APP_KEY和DOUDIAN_APP_SECRET环境变量');
  }
  
  // 对参数进行排序并序列化
  const sortedParams = sortObjectKeys(params);
  const paramJson = JSON.stringify(sortedParams);
  
  // 生成时间戳（Unix时间戳）
  const timestamp = Math.floor(Date.now() / 1000).toString();
  
  // 生成签名
  const sign = generateSign(APP_KEY, APP_SECRET, method, paramJson, timestamp);
  
  // 构建URL（公共参数通过query传递）
  const apiPath = '/' + method.replace(/\./g, '/');
  const queryParams = new URLSearchParams({
    method,
    app_key: APP_KEY,
    access_token: accessToken,
    timestamp,
    v: API_VERSION,
    sign,
    sign_method: 'hmac-sha256'
  });
  
  const url = `${DOUDIAN_API_URL}${apiPath}?${queryParams.toString()}`;
  
  // 发起POST请求（业务参数通过body传递）
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: paramJson,
  });
  
  const result = await response.json();
  
  // 检查响应状态
  if (result.code !== 10000) {
    throw new Error(`抖店API调用失败: ${result.msg || result.message || '未知错误'} (code: ${result.code})`);
  }
  
  return result.data;
}

/**
 * 获取access_token
 * 注意: 这需要先通过OAuth授权流程获取code
 */
export async function getAccessToken(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  if (!APP_KEY || !APP_SECRET) {
    throw new Error('抖店API密钥未配置');
  }
  
  const method = 'token.create';
  const params = {
    code,
    grant_type: 'authorization_code',
  };
  
  const sortedParams = sortObjectKeys(params);
  const paramJson = JSON.stringify(sortedParams);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sign = generateSign(APP_KEY, APP_SECRET, method, paramJson, timestamp);
  
  const queryParams = new URLSearchParams({
    method,
    app_key: APP_KEY,
    timestamp,
    v: API_VERSION,
    sign,
    sign_method: 'hmac-sha256'
  });
  
  const url = `${DOUDIAN_API_URL}/token/create?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: paramJson,
  });
  
  const result = await response.json();
  
  if (result.code !== 10000) {
    throw new Error(`获取access_token失败: ${result.msg || result.message}`);
  }
  
  return result.data;
}

/**
 * 刷新access_token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  if (!APP_KEY || !APP_SECRET) {
    throw new Error('抖店API密钥未配置');
  }
  
  const method = 'token.refresh';
  const params = {
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  };
  
  const sortedParams = sortObjectKeys(params);
  const paramJson = JSON.stringify(sortedParams);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sign = generateSign(APP_KEY, APP_SECRET, method, paramJson, timestamp);
  
  const queryParams = new URLSearchParams({
    method,
    app_key: APP_KEY,
    timestamp,
    v: API_VERSION,
    sign,
    sign_method: 'hmac-sha256'
  });
  
  const url = `${DOUDIAN_API_URL}/token/refresh?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: paramJson,
  });
  
  const result = await response.json();
  
  if (result.code !== 10000) {
    throw new Error(`刷新access_token失败: ${result.msg || result.message}`);
  }
  
  return result.data;
}

// ==================== 订单相关API ====================

/**
 * 订单列表查询
 * 接口: /order/searchList
 * 支持查询近90天的数据
 */
export async function getOrderList(
  accessToken: string,
  params: {
    start_time?: string;  // 下单开始时间
    end_time?: string;    // 下单结束时间
    order_status?: number; // 订单状态
    page?: number;        // 页码
    size?: number;        // 每页数量（最大100）
    order_by?: string;    // 排序字段
    order_asc?: boolean;  // 是否升序
  }
): Promise<any> {
  const method = 'order.searchList';
  return callDoudianApi(method, params, accessToken);
}

/**
 * 订单详情查询
 * 接口: /order/orderDetail
 */
export async function getOrderDetail(
  accessToken: string,
  shopOrderId: string
): Promise<any> {
  const method = 'order.orderDetail';
  return callDoudianApi(method, { shop_order_id: shopOrderId }, accessToken);
}

// ==================== 商品相关API ====================

/**
 * 商品列表查询
 * 接口: /product/listV2
 */
export async function getProductList(
  accessToken: string,
  params: {
    page?: number;
    size?: number;
    status?: number;
    check_status?: number;
  }
): Promise<any> {
  const method = 'product.listV2';
  return callDoudianApi(method, params, accessToken);
}

/**
 * 商品详情查询
 * 接口: /product/detail
 */
export async function getProductDetail(
  accessToken: string,
  productId: string
): Promise<any> {
  const method = 'product.detail';
  return callDoudianApi(method, { product_id: productId }, accessToken);
}

// ==================== 账单相关API ====================

/**
 * 商家结算账单
 * 接口: /order/getSettleBillDetailV3
 */
export async function getSettleBillDetail(
  accessToken: string,
  params: {
    start_time: string;
    end_time: string;
    page?: number;
    size?: number;
  }
): Promise<any> {
  const method = 'order.getSettleBillDetailV3';
  return callDoudianApi(method, params, accessToken);
}

/**
 * 资金流水明细
 * 接口: /order/getShopAccountItem
 */
export async function getShopAccountItem(
  accessToken: string,
  params: {
    start_time: string;
    end_time: string;
    page?: number;
    size?: number;
  }
): Promise<any> {
  const method = 'order.getShopAccountItem';
  return callDoudianApi(method, params, accessToken);
}

// ==================== 精选联盟API（达人佣金） ====================

/**
 * 抖客结算账单明细
 * 接口: /buyin/douKeSettleBillList
 */
export async function getDouKeSettleBillList(
  accessToken: string,
  params: {
    start_time: string;
    end_time: string;
    page?: number;
    size?: number;
  }
): Promise<any> {
  const method = 'buyin.douKeSettleBillList';
  return callDoudianApi(method, params, accessToken);
}

// ==================== 保险相关API ====================

/**
 * 查询运费险保单详情
 * 接口: /order/insurance
 */
export async function getInsuranceDetail(
  accessToken: string,
  orderId: string
): Promise<any> {
  const method = 'order.insurance';
  return callDoudianApi(method, { order_id: orderId }, accessToken);
}

/**
 * 查保单详情
 * 接口: /order/policy
 */
export async function getPolicyDetail(
  accessToken: string,
  orderId: string
): Promise<any> {
  const method = 'order.policy';
  return callDoudianApi(method, { order_id: orderId }, accessToken);
}

// ==================== 售后相关API ====================

/**
 * 售后列表
 * 接口: /afterSale/List
 */
export async function getAfterSaleList(
  accessToken: string,
  params: {
    start_time?: string;
    end_time?: string;
    page?: number;
    size?: number;
    type?: number;
  }
): Promise<any> {
  const method = 'afterSale.List';
  return callDoudianApi(method, params, accessToken);
}

/**
 * 售后详情
 * 接口: /afterSale/Detail
 */
export async function getAfterSaleDetail(
  accessToken: string,
  afterSaleId: string
): Promise<any> {
  const method = 'afterSale.Detail';
  return callDoudianApi(method, { aftersale_id: afterSaleId }, accessToken);
}

// 导出API客户端配置检查函数
export function checkApiConfig(): { configured: boolean; message: string } {
  if (!APP_KEY || !APP_SECRET) {
    return {
      configured: false,
      message: '抖店API密钥未配置。请在环境变量中设置DOUDIAN_APP_KEY和DOUDIAN_APP_SECRET。'
    };
  }
  return {
    configured: true,
    message: 'API密钥已配置'
  };
}

// 导出API可用性信息
export const API_AVAILABILITY = {
  order: {
    available: true,
    apis: ['order.searchList', 'order.orderDetail'],
    description: '订单数据（支持近90天）'
  },
  product: {
    available: true,
    apis: ['product.listV2', 'product.detail'],
    description: '商品数据'
  },
  settlement: {
    available: true,
    apis: ['order.getSettleBillDetailV3', 'order.getShopAccountItem'],
    description: '结算账单和资金流水'
  },
  commission: {
    available: true,
    apis: ['buyin.douKeSettleBillList'],
    description: '达人佣金（抖客结算）'
  },
  insurance: {
    available: true,
    apis: ['order.insurance', 'order.policy'],
    description: '保险费（运费险）'
  },
  afterSale: {
    available: true,
    apis: ['afterSale.List', 'afterSale.Detail'],
    description: '售后和赔付'
  },
  qianchuan: {
    available: false,
    apis: [],
    description: '千川推广费（需要单独对接巨量千川API）'
  }
};
