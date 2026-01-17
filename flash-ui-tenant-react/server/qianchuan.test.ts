/**
 * 千川API测试文件
 */

import { describe, it, expect, beforeAll } from 'vitest';

const API_BASE = 'http://localhost:3000/api/trpc';

describe('千川API测试', () => {
  describe('配置状态API', () => {
    it('应该返回配置状态', async () => {
      const response = await fetch(`${API_BASE}/qianchuan.getConfigStatus`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.result).toBeDefined();
      expect(data.result.data.json).toHaveProperty('configured');
      expect(data.result.data.json).toHaveProperty('authorized');
    });
  });

  describe('同步日志API', () => {
    it('应该返回同步日志列表', async () => {
      const input = encodeURIComponent(JSON.stringify({ limit: 10 }));
      const response = await fetch(`${API_BASE}/qianchuan.getSyncLogs?input=${input}`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.result).toBeDefined();
      expect(Array.isArray(data.result.data.json)).toBe(true);
    });
  });

  describe('费用数据API', () => {
    it('应该返回指定日期范围的费用数据', async () => {
      const input = JSON.stringify({
        json: {
          startDate: '2025-04-01',
          endDate: '2025-04-30'
        }
      });
      const response = await fetch(`${API_BASE}/qianchuan.getCostData?input=${encodeURIComponent(input)}`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.result).toBeDefined();
      expect(Array.isArray(data.result.data.json)).toBe(true);
    });

    it('应该返回费用汇总数据', async () => {
      const input = JSON.stringify({
        json: {
          startDate: '2025-04-01',
          endDate: '2025-04-30'
        }
      });
      const response = await fetch(`${API_BASE}/qianchuan.getCostSummary?input=${encodeURIComponent(input)}`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.result).toBeDefined();
      expect(data.result.data.json).toHaveProperty('totalCost');
      expect(data.result.data.json).toHaveProperty('totalShowCnt');
      expect(data.result.data.json).toHaveProperty('totalClickCnt');
      expect(data.result.data.json).toHaveProperty('avgRoi');
    });
  });

  describe('日期格式验证', () => {
    it('应该拒绝无效的日期格式', async () => {
      const input = encodeURIComponent(JSON.stringify({
        startDate: '2025/04/01', // 错误格式
        endDate: '2025-04-30'
      }));
      const response = await fetch(`${API_BASE}/qianchuan.getCostData?input=${input}`);
      
      // 应该返回错误
      const data = await response.json();
      expect(data.error).toBeDefined();
    });
  });
});

describe('定时任务调度器测试', () => {
  it('调度器模块应该可以导入', async () => {
    const scheduler = await import('./scheduler');
    expect(scheduler.scheduler).toBeDefined();
    expect(typeof scheduler.initScheduler).toBe('function');
    expect(typeof scheduler.stopScheduler).toBe('function');
  });

  it('调度器应该有注册的任务', async () => {
    const { scheduler } = await import('./scheduler');
    const status = scheduler.getTaskStatus('qianchuan_daily_sync');
    expect(status).toBeDefined();
    expect(status?.name).toBe('qianchuan_daily_sync');
    expect(status?.cronExpression).toBe('0 2 * * *');
    expect(status?.enabled).toBe(true);
  });

  it('调度器应该能获取所有任务状态', async () => {
    const { scheduler } = await import('./scheduler');
    const allStatus = scheduler.getAllTaskStatus();
    expect(Array.isArray(allStatus)).toBe(true);
    expect(allStatus.length).toBeGreaterThan(0);
  });
});
