/**
 * 抖店API集成测试
 */

import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:3000/api/trpc';

describe('抖店API集成测试', () => {
  describe('配置检查', () => {
    it('应该返回API配置状态', async () => {
      const response = await fetch(`${BASE_URL}/doudian.checkConfig`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.result).toBeDefined();
      expect(data.result.data).toBeDefined();
      expect(data.result.data.json.configured).toBeDefined();
      expect(typeof data.result.data.json.configured).toBe('boolean');
    });

    it('应该返回可用API模块列表', async () => {
      const response = await fetch(`${BASE_URL}/doudian.checkConfig`);
      const data = await response.json();
      
      expect(data.result.data.json.availability).toBeDefined();
      const availability = data.result.data.json.availability;
      
      // 验证各模块配置
      expect(availability.order).toBeDefined();
      expect(availability.product).toBeDefined();
      expect(availability.settlement).toBeDefined();
      expect(availability.commission).toBeDefined();
      expect(availability.insurance).toBeDefined();
      expect(availability.afterSale).toBeDefined();
      expect(availability.qianchuan).toBeDefined();
    });

    it('订单模块应该可用', async () => {
      const response = await fetch(`${BASE_URL}/doudian.checkConfig`);
      const data = await response.json();
      
      const orderModule = data.result.data.json.availability.order;
      expect(orderModule.available).toBe(true);
      expect(orderModule.apis).toContain('order.searchList');
      expect(orderModule.apis).toContain('order.orderDetail');
    });

    it('商品模块应该可用', async () => {
      const response = await fetch(`${BASE_URL}/doudian.checkConfig`);
      const data = await response.json();
      
      const productModule = data.result.data.json.availability.product;
      expect(productModule.available).toBe(true);
      expect(productModule.apis).toContain('product.listV2');
      expect(productModule.apis).toContain('product.detail');
    });

    it('结算账单模块应该可用', async () => {
      const response = await fetch(`${BASE_URL}/doudian.checkConfig`);
      const data = await response.json();
      
      const settlementModule = data.result.data.json.availability.settlement;
      expect(settlementModule.available).toBe(true);
      expect(settlementModule.apis).toContain('order.getSettleBillDetailV3');
    });

    it('达人佣金模块应该可用', async () => {
      const response = await fetch(`${BASE_URL}/doudian.checkConfig`);
      const data = await response.json();
      
      const commissionModule = data.result.data.json.availability.commission;
      expect(commissionModule.available).toBe(true);
      expect(commissionModule.apis).toContain('buyin.douKeSettleBillList');
    });

    it('保险费模块应该可用', async () => {
      const response = await fetch(`${BASE_URL}/doudian.checkConfig`);
      const data = await response.json();
      
      const insuranceModule = data.result.data.json.availability.insurance;
      expect(insuranceModule.available).toBe(true);
      expect(insuranceModule.apis).toContain('order.insurance');
    });

    it('售后赔付模块应该可用', async () => {
      const response = await fetch(`${BASE_URL}/doudian.checkConfig`);
      const data = await response.json();
      
      const afterSaleModule = data.result.data.json.availability.afterSale;
      expect(afterSaleModule.available).toBe(true);
      expect(afterSaleModule.apis).toContain('afterSale.List');
    });

    it('千川推广模块应该不可用（需要单独对接）', async () => {
      const response = await fetch(`${BASE_URL}/doudian.checkConfig`);
      const data = await response.json();
      
      const qianchuanModule = data.result.data.json.availability.qianchuan;
      expect(qianchuanModule.available).toBe(false);
      expect(qianchuanModule.description).toContain('巨量千川');
    });
  });
});
