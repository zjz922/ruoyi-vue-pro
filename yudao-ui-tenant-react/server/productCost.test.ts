import { describe, it, expect } from 'vitest';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from './routers';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// 创建tRPC客户端用于测试（公开API，无需认证）
const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BASE_URL}/api/trpc`,
      transformer: superjson,
    }),
  ],
});

describe('ProductCost API - Public Endpoints', () => {
  describe('list', () => {
    it('should return paginated product costs', async () => {
      const result = await client.productCost.list.query({
        page: 1,
        pageSize: 10,
      });

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      expect(result.total).toBeGreaterThanOrEqual(0);
      
      // 验证返回的数据结构
      if (result.data.length > 0) {
        const firstItem = result.data[0];
        expect(firstItem).toHaveProperty('id');
        expect(firstItem).toHaveProperty('productId');
        expect(firstItem).toHaveProperty('title');
        expect(firstItem).toHaveProperty('cost');
        expect(firstItem).toHaveProperty('shopName');
      }
    });

    it('should support search by product title', async () => {
      const result = await client.productCost.list.query({
        page: 1,
        pageSize: 10,
        search: '滋栈',
      });

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      
      // 搜索结果应该包含"滋栈"关键词
      if (result.data.length > 0) {
        const hasMatch = result.data.some(
          (item: any) => 
            item.title.includes('滋栈') || 
            item.productId.includes('滋栈') ||
            (item.merchantCode && item.merchantCode.includes('滋栈'))
        );
        expect(hasMatch).toBe(true);
      }
    });

    it('should support filtering by shop name', async () => {
      const result = await client.productCost.list.query({
        page: 1,
        pageSize: 10,
        shopName: '滋栈官方旗舰店',
      });

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      
      // 所有结果应该属于指定店铺
      result.data.forEach((item: any) => {
        expect(item.shopName).toBe('滋栈官方旗舰店');
      });
    });

    it('should return correct pagination info', async () => {
      const result = await client.productCost.list.query({
        page: 2,
        pageSize: 5,
      });

      expect(result).toBeDefined();
      expect(result.data.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getShopNames', () => {
    it('should return list of shop names', async () => {
      const result = await client.productCost.getShopNames.query();

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
      
      // 应该至少有一个店铺（滋栈官方旗舰店）
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result).toContain('滋栈官方旗舰店');
    });
  });

  describe('getHistory', () => {
    it('should return cost change history for a product', async () => {
      // 先获取一个存在的商品
      const listResult = await client.productCost.list.query({
        page: 1,
        pageSize: 1,
      });

      expect(listResult.data.length).toBeGreaterThan(0);
      
      const product = listResult.data[0];
      const result = await client.productCost.getHistory.query({
        productCostId: product.id,
      });

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
      
      // 验证历史记录的数据结构（如果有记录的话）
      if (result.length > 0) {
        const firstHistory = result[0];
        expect(firstHistory).toHaveProperty('id');
        expect(firstHistory).toHaveProperty('productCostId');
        expect(firstHistory).toHaveProperty('oldCost');
        expect(firstHistory).toHaveProperty('newCost');
      }
    });
  });

  describe('getById', () => {
    it('should return a single product cost by id', async () => {
      // 先获取一个存在的商品
      const listResult = await client.productCost.list.query({
        page: 1,
        pageSize: 1,
      });

      expect(listResult.data.length).toBeGreaterThan(0);
      
      const product = listResult.data[0];
      const result = await client.productCost.getById.query({
        id: product.id,
      });

      expect(result).toBeDefined();
      expect(result?.id).toBe(product.id);
      expect(result?.productId).toBe(product.productId);
      expect(result?.title).toBe(product.title);
    });
  });

  describe('data integrity', () => {
    it('should have imported 72 products from CSV', async () => {
      const result = await client.productCost.list.query({
        page: 1,
        pageSize: 100,
      });

      // 验证导入的数据总数
      expect(result.total).toBeGreaterThanOrEqual(72);
    });

    it('should have products with configured costs', async () => {
      const result = await client.productCost.list.query({
        page: 1,
        pageSize: 100,
      });

      // 验证有已配置成本的商品
      const configuredProducts = result.data.filter(
        (item: any) => parseFloat(item.cost) > 0
      );
      expect(configuredProducts.length).toBeGreaterThanOrEqual(3);
    });
  });
});
