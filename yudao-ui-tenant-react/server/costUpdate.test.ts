import { describe, it, expect, beforeAll } from 'vitest';
import {
  calculateWeightedAverageCost,
  CostCalculationMethod,
} from './costUpdateService';

describe('成本自动更新服务', () => {
  describe('calculateWeightedAverageCost', () => {
    it('应该正确计算加权平均成本', () => {
      // 现有库存：100件，成本价¥10/件
      // 新入库：50件，成本价¥12/件
      // 预期：(100*10 + 50*12) / (100+50) = 1600/150 = 10.67
      const result = calculateWeightedAverageCost(10, 100, 12, 50);
      expect(result).toBe(10.67);
    });

    it('应该处理库存为0的情况', () => {
      // 现有库存：0件
      // 新入库：100件，成本价¥10/件
      // 预期：10
      const result = calculateWeightedAverageCost(0, 0, 10, 100);
      expect(result).toBe(10);
    });

    it('应该处理新入库数量为0的情况', () => {
      // 现有库存：100件，成本价¥10/件
      // 新入库：0件
      // 预期：10
      const result = calculateWeightedAverageCost(10, 100, 12, 0);
      expect(result).toBe(10);
    });

    it('应该正确处理小数成本', () => {
      // 现有库存：50件，成本价¥9.99/件
      // 新入库：30件，成本价¥10.50/件
      // 预期：(50*9.99 + 30*10.50) / (50+30) = 814.5/80 = 10.18
      const result = calculateWeightedAverageCost(9.99, 50, 10.50, 30);
      expect(result).toBe(10.18);
    });

    it('应该处理大数额成本', () => {
      // 现有库存：1000件，成本价¥100/件
      // 新入库：500件，成本价¥120/件
      // 预期：(1000*100 + 500*120) / (1000+500) = 160000/1500 = 106.67
      const result = calculateWeightedAverageCost(100, 1000, 120, 500);
      expect(result).toBe(106.67);
    });
  });

  describe('CostCalculationMethod', () => {
    it('应该定义正确的计算方法枚举', () => {
      expect(CostCalculationMethod.WEIGHTED_AVERAGE).toBe('weighted_average');
      expect(CostCalculationMethod.LATEST_COST).toBe('latest_cost');
      expect(CostCalculationMethod.FIFO).toBe('fifo');
    });
  });
});
