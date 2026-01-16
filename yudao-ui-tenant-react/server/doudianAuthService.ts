/**
 * 抖店授权服务
 * 
 * @description 处理抖店OAuth授权流程，包括Token获取、存储、刷新
 * @author Manus AI
 */

import { getDb } from './db';
import { doudianAuthTokens, doudianShops } from '../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
import crypto from 'crypto';

// 抖店API配置
const DOUDIAN_APP_KEY = process.env.DOUDIAN_APP_KEY || '';
const DOUDIAN_APP_SECRET = process.env.DOUDIAN_APP_SECRET || '';
const DOUDIAN_API_BASE = 'https://openapi-fxg.jinritemai.com';

/**
 * 生成抖店API签名
 */
function generateSign(params: Record<string, string>, secret: string): string {
  // 按key排序
  const sortedKeys = Object.keys(params).sort();
  // 拼接参数
  let signStr = secret;
  for (const key of sortedKeys) {
    signStr += key + params[key];
  }
  signStr += secret;
  // MD5加密
  return crypto.createHash('md5').update(signStr).digest('hex');
}

/**
 * 调用抖店API
 */
async function callDoudianApi(method: string, params: Record<string, any>, accessToken?: string): Promise<any> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  
  const commonParams: Record<string, string> = {
    app_key: DOUDIAN_APP_KEY,
    method,
    timestamp,
    v: '2',
    sign_method: 'md5',
  };
  
  if (accessToken) {
    commonParams.access_token = accessToken;
  }
  
  // 将业务参数转为JSON字符串
  commonParams.param_json = JSON.stringify(params);
  
  // 生成签名
  const sign = generateSign(commonParams, DOUDIAN_APP_SECRET);
  commonParams.sign = sign;
  
  // 发送请求
  const url = `${DOUDIAN_API_BASE}/${method.replace(/\./g, '/')}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(commonParams).toString(),
  });
  
  const result = await response.json();
  return result;
}

/**
 * 获取授权URL
 */
export function getAuthUrl(redirectUri: string): { authUrl: string; state: string } {
  const state = crypto.randomBytes(16).toString('hex');
  const authUrl = `https://fuwu.jinritemai.com/authorize?app_key=${DOUDIAN_APP_KEY}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  return { authUrl, state };
}

/**
 * 使用授权码换取Token
 */
export async function exchangeCodeForToken(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
  shopId: string;
  shopName: string;
  scope: string;
}> {
  const result = await callDoudianApi('token.create', {
    code,
    grant_type: 'authorization_code',
  });
  
  if (result.err_no !== 0) {
    throw new Error(result.message || '获取Token失败');
  }
  
  const data = result.data;
  const now = new Date();
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessTokenExpiresAt: new Date(now.getTime() + data.expires_in * 1000),
    refreshTokenExpiresAt: new Date(now.getTime() + data.refresh_expires_in * 1000),
    shopId: data.shop_id,
    shopName: data.shop_name || '',
    scope: data.scope || '',
  };
}

/**
 * 刷新Token
 */
export async function refreshToken(refreshTokenStr: string): Promise<{
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}> {
  const result = await callDoudianApi('token.refresh', {
    refresh_token: refreshTokenStr,
    grant_type: 'refresh_token',
  });
  
  if (result.err_no !== 0) {
    throw new Error(result.message || '刷新Token失败');
  }
  
  const data = result.data;
  const now = new Date();
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessTokenExpiresAt: new Date(now.getTime() + data.expires_in * 1000),
    refreshTokenExpiresAt: new Date(now.getTime() + data.refresh_expires_in * 1000),
  };
}

/**
 * 保存授权Token到数据库
 */
export async function saveAuthToken(
  userId: number,
  tokenData: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
    shopId: string;
    shopName: string;
    scope: string;
  }
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error('数据库连接不可用');
  }

  // 检查是否已存在该店铺的授权
  const existing = await db.select()
    .from(doudianAuthTokens)
    .where(and(
      eq(doudianAuthTokens.userId, userId),
      eq(doudianAuthTokens.shopId, tokenData.shopId)
    ))
    .limit(1);
  
  if (existing.length > 0) {
    // 更新现有记录
    await db.update(doudianAuthTokens)
      .set({
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        accessTokenExpiresAt: tokenData.accessTokenExpiresAt,
        refreshTokenExpiresAt: tokenData.refreshTokenExpiresAt,
        shopName: tokenData.shopName,
        scope: tokenData.scope,
        status: 1,
      })
      .where(eq(doudianAuthTokens.id, existing[0].id));
  } else {
    // 插入新记录
    await db.insert(doudianAuthTokens).values({
      userId,
      shopId: tokenData.shopId,
      shopName: tokenData.shopName,
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      accessTokenExpiresAt: tokenData.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokenData.refreshTokenExpiresAt,
      scope: tokenData.scope,
      status: 1,
    });
  }
  
  // 同时更新或创建店铺信息
  const existingShop = await db.select()
    .from(doudianShops)
    .where(eq(doudianShops.shopId, tokenData.shopId))
    .limit(1);
  
  if (existingShop.length > 0) {
    await db.update(doudianShops)
      .set({
        shopName: tokenData.shopName,
        userId,
      })
      .where(eq(doudianShops.shopId, tokenData.shopId));
  } else {
    await db.insert(doudianShops).values({
      shopId: tokenData.shopId,
      shopName: tokenData.shopName,
      userId,
    });
  }
}

/**
 * 获取用户的授权状态
 */
export async function getAuthStatus(userId: number): Promise<{
  authorized: boolean;
  shopId: string | null;
  shopName: string | null;
  expireTime: string | null;
  message: string;
}> {
  const db = await getDb();
  if (!db) {
    return {
      authorized: false,
      shopId: null,
      shopName: null,
      expireTime: null,
      message: '数据库连接不可用',
    };
  }

  const tokens = await db.select()
    .from(doudianAuthTokens)
    .where(and(
      eq(doudianAuthTokens.userId, userId),
      eq(doudianAuthTokens.status, 1)
    ))
    .orderBy(desc(doudianAuthTokens.updatedAt))
    .limit(1);
  
  if (tokens.length === 0) {
    return {
      authorized: false,
      shopId: null,
      shopName: null,
      expireTime: null,
      message: '请先授权抖店账号',
    };
  }
  
  const token = tokens[0];
  const now = new Date();
  
  // 检查Token是否过期
  if (token.accessTokenExpiresAt < now) {
    // 尝试刷新Token
    if (token.refreshToken && token.refreshTokenExpiresAt && token.refreshTokenExpiresAt > now) {
      try {
        const newTokenData = await refreshToken(token.refreshToken);
        await db.update(doudianAuthTokens)
          .set({
            accessToken: newTokenData.accessToken,
            refreshToken: newTokenData.refreshToken,
            accessTokenExpiresAt: newTokenData.accessTokenExpiresAt,
            refreshTokenExpiresAt: newTokenData.refreshTokenExpiresAt,
          })
          .where(eq(doudianAuthTokens.id, token.id));
        
        return {
          authorized: true,
          shopId: token.shopId,
          shopName: token.shopName,
          expireTime: newTokenData.accessTokenExpiresAt.toISOString(),
          message: '授权有效',
        };
      } catch (error) {
        // 刷新失败，标记为过期
        await db.update(doudianAuthTokens)
          .set({ status: 2 })
          .where(eq(doudianAuthTokens.id, token.id));
        
        return {
          authorized: false,
          shopId: token.shopId,
          shopName: token.shopName,
          expireTime: null,
          message: '授权已过期，请重新授权',
        };
      }
    } else {
      // Refresh Token也过期了
      await db.update(doudianAuthTokens)
        .set({ status: 2 })
        .where(eq(doudianAuthTokens.id, token.id));
      
      return {
        authorized: false,
        shopId: token.shopId,
        shopName: token.shopName,
        expireTime: null,
        message: '授权已过期，请重新授权',
      };
    }
  }
  
  return {
    authorized: true,
    shopId: token.shopId,
    shopName: token.shopName,
    expireTime: token.accessTokenExpiresAt.toISOString(),
    message: '授权有效',
  };
}

/**
 * 获取有效的Access Token
 */
export async function getValidAccessToken(userId: number): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const tokens = await db.select()
    .from(doudianAuthTokens)
    .where(and(
      eq(doudianAuthTokens.userId, userId),
      eq(doudianAuthTokens.status, 1)
    ))
    .orderBy(desc(doudianAuthTokens.updatedAt))
    .limit(1);
  
  if (tokens.length === 0) {
    return null;
  }
  
  const token = tokens[0];
  const now = new Date();
  
  // 检查Token是否过期
  if (token.accessTokenExpiresAt < now) {
    // 尝试刷新
    if (token.refreshToken && token.refreshTokenExpiresAt && token.refreshTokenExpiresAt > now) {
      try {
        const newTokenData = await refreshToken(token.refreshToken);
        await db.update(doudianAuthTokens)
          .set({
            accessToken: newTokenData.accessToken,
            refreshToken: newTokenData.refreshToken,
            accessTokenExpiresAt: newTokenData.accessTokenExpiresAt,
            refreshTokenExpiresAt: newTokenData.refreshTokenExpiresAt,
          })
          .where(eq(doudianAuthTokens.id, token.id));
        
        return newTokenData.accessToken;
      } catch (error) {
        return null;
      }
    }
    return null;
  }
  
  return token.accessToken;
}

/**
 * 撤销授权
 */
export async function revokeAuth(userId: number, shopId: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error('数据库连接不可用');
  }

  await db.update(doudianAuthTokens)
    .set({ status: 3 })
    .where(and(
      eq(doudianAuthTokens.userId, userId),
      eq(doudianAuthTokens.shopId, shopId)
    ));
}


/**
 * 店铺信息接口
 */
export interface ShopInfo {
  shopId: string;
  shopName: string;
  status: number;
  expireTime: string | null;
  isCurrentShop: boolean;
}

/**
 * 获取用户已授权的店铺列表
 */
export async function getAuthorizedShops(userId: number, currentShopId: string | null): Promise<ShopInfo[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const tokens = await db.select()
    .from(doudianAuthTokens)
    .where(and(
      eq(doudianAuthTokens.userId, userId),
      eq(doudianAuthTokens.status, 1)
    ))
    .orderBy(desc(doudianAuthTokens.updatedAt));

  return tokens.map(token => ({
    shopId: token.shopId,
    shopName: token.shopName || '未知店铺',
    status: token.status,
    expireTime: token.accessTokenExpiresAt?.toISOString() || null,
    isCurrentShop: token.shopId === currentShopId,
  }));
}

/**
 * 获取指定店铺的有效Access Token
 */
export async function getShopAccessToken(userId: number, shopId: string): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const tokens = await db.select()
    .from(doudianAuthTokens)
    .where(and(
      eq(doudianAuthTokens.userId, userId),
      eq(doudianAuthTokens.shopId, shopId),
      eq(doudianAuthTokens.status, 1)
    ))
    .limit(1);

  if (tokens.length === 0) {
    return null;
  }

  const token = tokens[0];
  const now = new Date();

  // 检查Token是否过期
  if (token.accessTokenExpiresAt < now) {
    // 尝试刷新
    if (token.refreshToken && token.refreshTokenExpiresAt && token.refreshTokenExpiresAt > now) {
      try {
        const newTokenData = await refreshToken(token.refreshToken);
        await db.update(doudianAuthTokens)
          .set({
            accessToken: newTokenData.accessToken,
            refreshToken: newTokenData.refreshToken,
            accessTokenExpiresAt: newTokenData.accessTokenExpiresAt,
            refreshTokenExpiresAt: newTokenData.refreshTokenExpiresAt,
          })
          .where(eq(doudianAuthTokens.id, token.id));

        return newTokenData.accessToken;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  return token.accessToken;
}

/**
 * 验证店铺是否属于用户且授权有效
 */
export async function validateShopAccess(userId: number, shopId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return false;
  }

  const tokens = await db.select()
    .from(doudianAuthTokens)
    .where(and(
      eq(doudianAuthTokens.userId, userId),
      eq(doudianAuthTokens.shopId, shopId),
      eq(doudianAuthTokens.status, 1)
    ))
    .limit(1);

  if (tokens.length === 0) {
    return false;
  }

  const token = tokens[0];
  const now = new Date();

  // 检查Token是否过期（包括refresh token）
  if (token.accessTokenExpiresAt < now) {
    if (!token.refreshToken || !token.refreshTokenExpiresAt || token.refreshTokenExpiresAt < now) {
      return false;
    }
  }

  return true;
}
