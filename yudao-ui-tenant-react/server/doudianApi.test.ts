/**
 * 抖店API密钥验证测试
 * 验证DOUDIAN_APP_KEY和DOUDIAN_APP_SECRET是否正确配置
 */

import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('抖店API配置验证', () => {
  it('应该正确配置了API密钥', async () => {
    // 调用checkConfig接口验证密钥配置
    const response = await fetch(`${BASE_URL}/api/trpc/doudian.checkConfig`);
    const result = await response.json();
    
    console.log('API配置检查结果:', JSON.stringify(result, null, 2));
    
    expect(result.result).toBeDefined();
    expect(result.result.data).toBeDefined();
    
    const data = result.result.data.json;
    expect(data.configured).toBe(true);
    expect(data.message).toBe('API密钥已配置');
  });

  it('应该返回API可用性信息', async () => {
    const response = await fetch(`${BASE_URL}/api/trpc/doudian.getAvailability`);
    const result = await response.json();
    
    console.log('API可用性信息:', JSON.stringify(result, null, 2));
    
    expect(result.result).toBeDefined();
    expect(result.result.data).toBeDefined();
    
    const availability = result.result.data.json;
    
    // 验证各API模块的可用性信息
    expect(availability.order).toBeDefined();
    expect(availability.order.available).toBe(true);
    
    expect(availability.product).toBeDefined();
    expect(availability.product.available).toBe(true);
    
    expect(availability.settlement).toBeDefined();
    expect(availability.settlement.available).toBe(true);
    
    expect(availability.commission).toBeDefined();
    expect(availability.commission.available).toBe(true);
    
    expect(availability.insurance).toBeDefined();
    expect(availability.insurance.available).toBe(true);
    
    expect(availability.afterSale).toBeDefined();
    expect(availability.afterSale.available).toBe(true);
    
    // 千川API不在抖店范围内
    expect(availability.qianchuan).toBeDefined();
    expect(availability.qianchuan.available).toBe(false);
  });
});
