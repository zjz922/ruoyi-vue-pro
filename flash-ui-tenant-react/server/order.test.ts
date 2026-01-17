import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = 'http://localhost:3000/api/trpc';

describe('订单管理API测试', () => {
  // 测试订单列表查询
  describe('order.list', () => {
    it('应该返回订单列表', async () => {
      const input = encodeURIComponent(JSON.stringify({ json: { page: 1, pageSize: 10 } }));
      const response = await fetch(`${BASE_URL}/order.list?input=${input}`);
      const result = await response.json();
      
      expect(response.ok).toBe(true);
      expect(result.result.data.json).toHaveProperty('data');
      expect(result.result.data.json).toHaveProperty('total');
      expect(Array.isArray(result.result.data.json.data)).toBe(true);
    });

    it('应该支持分页查询', async () => {
      const input = encodeURIComponent(JSON.stringify({ json: { page: 1, pageSize: 5 } }));
      const response = await fetch(`${BASE_URL}/order.list?input=${input}`);
      const result = await response.json();
      
      expect(response.ok).toBe(true);
      expect(result.result.data.json.data.length).toBeLessThanOrEqual(5);
    });

    it('应该支持搜索功能', async () => {
      const input = encodeURIComponent(JSON.stringify({ json: { page: 1, pageSize: 10, search: '滋栈' } }));
      const response = await fetch(`${BASE_URL}/order.list?input=${input}`);
      const result = await response.json();
      
      expect(response.ok).toBe(true);
      expect(result.result.data.json).toHaveProperty('data');
    });

    it('应该支持状态筛选', async () => {
      const input = encodeURIComponent(JSON.stringify({ json: { page: 1, pageSize: 10, status: '已完成' } }));
      const response = await fetch(`${BASE_URL}/order.list?input=${input}`);
      const result = await response.json();
      
      expect(response.ok).toBe(true);
      if (result.result.data.json.data.length > 0) {
        result.result.data.json.data.forEach((order: any) => {
          expect(order.status).toBe('已完成');
        });
      }
    });
  });

  // 测试店铺ID过滤
  describe('order.list with shopId', () => {
    it('应该支持店铺ID过滤', async () => {
      const input = encodeURIComponent(JSON.stringify({ json: { page: 1, pageSize: 10, shopId: '滋栈官方旗舰店' } }));
      const response = await fetch(`${BASE_URL}/order.list?input=${input}`);
      const result = await response.json();
      
      expect(response.ok).toBe(true);
      expect(result.result.data.json).toHaveProperty('data');
      expect(result.result.data.json).toHaveProperty('total');
      // 如果有数据，验证店铺名称匹配
      if (result.result.data.json.data.length > 0) {
        result.result.data.json.data.forEach((order: any) => {
          expect(order.shopName).toBe('滋栈官方旗舰店');
        });
      }
    });

    it('不传店铺ID时应该返回所有店铺的订单', async () => {
      const input = encodeURIComponent(JSON.stringify({ json: { page: 1, pageSize: 10 } }));
      const response = await fetch(`${BASE_URL}/order.list?input=${input}`);
      const result = await response.json();
      
      expect(response.ok).toBe(true);
      expect(result.result.data.json).toHaveProperty('data');
    });
  });

  // 测试订单统计
  describe('order.stats', () => {
    it('应该返回订单统计数据', async () => {
      const response = await fetch(`${BASE_URL}/order.stats`);
      const result = await response.json();
      
      expect(response.ok).toBe(true);
      expect(result.result.data.json).toHaveProperty('totalOrders');
      expect(result.result.data.json).toHaveProperty('totalAmount');
      expect(result.result.data.json).toHaveProperty('completedOrders');
      expect(result.result.data.json).toHaveProperty('pendingOrders');
      expect(result.result.data.json).toHaveProperty('refundedOrders');
    });

    it('统计数据应该是有效数字', async () => {
      const response = await fetch(`${BASE_URL}/order.stats`);
      const result = await response.json();
      
      expect(typeof result.result.data.json.totalOrders).toBe('number');
      expect(result.result.data.json.totalOrders).toBeGreaterThanOrEqual(0);
    });

    it('应该支持店铺ID过滤统计数据', async () => {
      const input = encodeURIComponent(JSON.stringify({ json: { shopId: '滋栈官方旗舰店' } }));
      const response = await fetch(`${BASE_URL}/order.stats?input=${input}`);
      const result = await response.json();
      
      expect(response.ok).toBe(true);
      expect(result.result.data.json).toHaveProperty('totalOrders');
      expect(result.result.data.json).toHaveProperty('totalAmount');
    });
  });

  // 测试订单详情
  describe('order.getById', () => {
    it('应该返回订单详情', async () => {
      // 先获取订单列表
      const listInput = encodeURIComponent(JSON.stringify({ json: { page: 1, pageSize: 1 } }));
      const listResponse = await fetch(`${BASE_URL}/order.list?input=${listInput}`);
      const listResult = await listResponse.json();
      
      if (listResult.result.data.json.data.length > 0) {
        const orderId = listResult.result.data.json.data[0].id;
        const input = encodeURIComponent(JSON.stringify({ json: { id: orderId } }));
        const response = await fetch(`${BASE_URL}/order.getById?input=${input}`);
        const result = await response.json();
        
        expect(response.ok).toBe(true);
        expect(result.result.data.json).toHaveProperty('id');
        expect(result.result.data.json).toHaveProperty('mainOrderNo');
        expect(result.result.data.json).toHaveProperty('subOrderNo');
      }
    });
  });
});
