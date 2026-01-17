/**
 * 聚水潭ERP API测试
 */
import { describe, it, expect } from 'vitest';

const API_BASE = 'http://localhost:3000/api/trpc';

// tRPC需要将参数包装在json对象中
function encodeInput(params: any): string {
  return encodeURIComponent(JSON.stringify({ json: params }));
}

describe('聚水潭ERP API测试', () => {
  // 测试检查配置状态
  it('应该能够检查配置状态', async () => {
    const response = await fetch(`${API_BASE}/jst.checkConfig`);
    expect(response.status).toBe(200);
    
    const result = await response.json();
    expect(result.result).toBeDefined();
    expect(result.result.data).toBeDefined();
    const data = result.result.data.json || result.result.data;
    expect(typeof data.configured).toBe('boolean');
    expect(typeof data.message).toBe('string');
  });

  // 测试获取入库单列表
  it('应该能够获取入库单列表', async () => {
    const params = {
      page: 1,
      pageSize: 10,
    };
    const response = await fetch(`${API_BASE}/jst.getPurchaseInList?input=${encodeInput(params)}`);
    expect(response.status).toBe(200);
    
    const result = await response.json();
    expect(result.result).toBeDefined();
    expect(result.result.data).toBeDefined();
    const data = result.result.data.json || result.result.data;
    expect(Array.isArray(data.data)).toBe(true);
    expect(typeof data.total).toBe('number');
  });

  // 测试获取入库统计数据
  it('应该能够获取入库统计数据', async () => {
    const params = {};
    const response = await fetch(`${API_BASE}/jst.getPurchaseInStats?input=${encodeInput(params)}`);
    expect(response.status).toBe(200);
    
    const result = await response.json();
    expect(result.result).toBeDefined();
    expect(result.result.data).toBeDefined();
    const data = result.result.data.json || result.result.data;
    expect(typeof data.totalCount).toBe('number');
    expect(typeof data.totalQty).toBe('number');
    expect(typeof data.totalAmount).toBe('number');
    expect(Array.isArray(data.bySupplier)).toBe(true);
    expect(Array.isArray(data.byWarehouse)).toBe(true);
  });

  // 测试获取同步日志
  it('应该能够获取同步日志', async () => {
    const params = {
      page: 1,
      pageSize: 10,
    };
    const response = await fetch(`${API_BASE}/jst.getSyncLogs?input=${encodeInput(params)}`);
    expect(response.status).toBe(200);
    
    const result = await response.json();
    expect(result.result).toBeDefined();
    expect(result.result.data).toBeDefined();
    const data = result.result.data.json || result.result.data;
    expect(Array.isArray(data.data)).toBe(true);
    expect(typeof data.total).toBe('number');
  });

  // 测试按日期范围获取入库单
  it('应该能够按日期范围获取入库单', async () => {
    const params = {
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      page: 1,
      pageSize: 10,
    };
    const response = await fetch(`${API_BASE}/jst.getPurchaseInList?input=${encodeInput(params)}`);
    expect(response.status).toBe(200);
    
    const result = await response.json();
    expect(result.result).toBeDefined();
    expect(result.result.data).toBeDefined();
    const data = result.result.data.json || result.result.data;
    expect(Array.isArray(data.data)).toBe(true);
  });

  // 测试获取入库单明细（不存在的单号）
  it('应该能够处理不存在的入库单明细查询', async () => {
    const params = {
      ioId: 'non-existent-id',
    };
    const response = await fetch(`${API_BASE}/jst.getPurchaseInDetail?input=${encodeInput(params)}`);
    expect(response.status).toBe(200);
    
    const result = await response.json();
    expect(result.result).toBeDefined();
    // 不存在的单号应返回null
    const data = result.result.data.json !== undefined ? result.result.data.json : result.result.data;
    expect(data).toBeNull();
  });
});
