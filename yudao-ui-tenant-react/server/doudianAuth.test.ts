/**
 * 抖店授权服务测试
 * 
 * @description 测试抖店OAuth授权流程相关功能
 * @author Manus AI
 */

import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('抖店授权API测试', () => {
  describe('getAuthUrl - 获取授权URL', () => {
    it('应该返回有效的授权URL', async () => {
      const response = await fetch(`${BASE_URL}/api/trpc/doudian.getAuthUrl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          json: {
            redirectUri: 'https://example.com/callback',
          },
        }),
      });

      const result = await response.json();
      console.log('授权URL结果:', JSON.stringify(result, null, 2));

      expect(result.result).toBeDefined();
      expect(result.result.data).toBeDefined();
      
      const data = result.result.data.json;
      expect(data.authUrl).toBeDefined();
      expect(data.state).toBeDefined();
      expect(typeof data.authUrl).toBe('string');
      expect(typeof data.state).toBe('string');
    });

    it('授权URL应该包含正确的参数', async () => {
      const response = await fetch(`${BASE_URL}/api/trpc/doudian.getAuthUrl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          json: {
            redirectUri: 'https://example.com/callback',
          },
        }),
      });

      const result = await response.json();
      const data = result.result.data.json;

      expect(data.authUrl).toContain('fuwu.jinritemai.com/authorize');
      expect(data.authUrl).toContain('app_key=');
      expect(data.authUrl).toContain('response_type=code');
      expect(data.authUrl).toContain('redirect_uri=');
      expect(data.authUrl).toContain('state=');
    });

    it('state应该是有效的随机字符串', async () => {
      const response1 = await fetch(`${BASE_URL}/api/trpc/doudian.getAuthUrl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: { redirectUri: 'https://example.com/callback' } }),
      });
      const result1 = await response1.json();

      const response2 = await fetch(`${BASE_URL}/api/trpc/doudian.getAuthUrl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: { redirectUri: 'https://example.com/callback' } }),
      });
      const result2 = await response2.json();

      const state1 = result1.result.data.json.state;
      const state2 = result2.result.data.json.state;

      // 两次调用应该生成不同的state
      expect(state1).not.toBe(state2);
      // state应该有足够的长度
      expect(state1.length).toBeGreaterThanOrEqual(16);
    });
  });

  describe('checkAuthStatus - 检查授权状态（需要登录）', () => {
    it('未登录时应该返回未授权错误', async () => {
      const response = await fetch(`${BASE_URL}/api/trpc/doudian.checkAuthStatus`);
      const result = await response.json();
      
      console.log('未登录检查授权状态结果:', JSON.stringify(result, null, 2));
      
      // 预期返回错误，因为需要登录
      expect(result.error).toBeDefined();
    });
  });

  describe('handleCallback - 处理授权回调（需要登录）', () => {
    it('未登录时应该返回未授权错误', async () => {
      const response = await fetch(`${BASE_URL}/api/trpc/doudian.handleCallback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: {
            code: 'test_code',
            state: 'test_state',
          },
        }),
      });
      const result = await response.json();
      
      console.log('未登录处理回调结果:', JSON.stringify(result, null, 2));
      
      // 预期返回错误，因为需要登录
      expect(result.error).toBeDefined();
    });
  });

  describe('revokeAuth - 撤销授权（需要登录）', () => {
    it('未登录时应该返回未授权错误', async () => {
      const response = await fetch(`${BASE_URL}/api/trpc/doudian.revokeAuth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: {
            shopId: 'test_shop_id',
          },
        }),
      });
      const result = await response.json();
      
      console.log('未登录撤销授权结果:', JSON.stringify(result, null, 2));
      
      // 预期返回错误，因为需要登录
      expect(result.error).toBeDefined();
    });
  });
});

describe('店铺切换API测试', () => {
  describe('getShopList - 获取店铺列表（需要登录）', () => {
    it('未登录时应该返回未授权错误', async () => {
      const response = await fetch(`${BASE_URL}/api/trpc/doudian.getShopList`);
      const result = await response.json();
      
      console.log('未登录获取店铺列表结果:', JSON.stringify(result, null, 2));
      
      // 预期返回错误，因为需要登录
      expect(result.error).toBeDefined();
    });
  });

  describe('getCurrentShop - 获取当前店铺（需要登录）', () => {
    it('未登录时应该返回未授权错误', async () => {
      const response = await fetch(`${BASE_URL}/api/trpc/doudian.getCurrentShop`);
      const result = await response.json();
      
      console.log('未登录获取当前店铺结果:', JSON.stringify(result, null, 2));
      
      // 预期返回错误，因为需要登录
      expect(result.error).toBeDefined();
    });
  });

  describe('switchShop - 切换店铺（需要登录）', () => {
    it('未登录时应该返回未授权错误', async () => {
      const response = await fetch(`${BASE_URL}/api/trpc/doudian.switchShop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: {
            shopId: 'test_shop_id',
          },
        }),
      });
      const result = await response.json();
      
      console.log('未登录切换店铺结果:', JSON.stringify(result, null, 2));
      
      // 预期返回错误，因为需要登录
      expect(result.error).toBeDefined();
    });
  });
});

describe('抖店授权服务单元测试', () => {
  describe('getAuthUrl函数', () => {
    it('应该生成包含所有必要参数的URL', async () => {
      // 直接导入服务函数进行测试
      const { getAuthUrl } = await import('./doudianAuthService');
      
      const result = getAuthUrl('https://test.com/callback');
      
      expect(result.authUrl).toBeDefined();
      expect(result.state).toBeDefined();
      expect(result.authUrl).toContain('https://fuwu.jinritemai.com/authorize');
    });

    it('生成的URL应该正确编码redirectUri', async () => {
      const { getAuthUrl } = await import('./doudianAuthService');
      
      const redirectUri = 'https://test.com/callback?param=value';
      const result = getAuthUrl(redirectUri);
      
      expect(result.authUrl).toContain(encodeURIComponent(redirectUri));
    });
  });
});
