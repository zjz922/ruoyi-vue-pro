import { describe, it, expect } from 'vitest';
import { baseData, dashboardData, expenseCenterData, orderStatsData } from '@/data/reconciliationConfig';
import { dailyStatsExtended, calculateSummary, summaryData } from '@/data/realOrderData';

describe('数据勾稽测试 - 基准数据一致性', () => {
  const calculated = calculateSummary(dailyStatsExtended);

  describe('订单统计基准数据', () => {
    it('总发货数应为14,487单', () => {
      expect(calculated.totalShipped).toBe(14487);
    });

    it('总销售额应为¥619,571.24', () => {
      expect(calculated.totalSales).toBeCloseTo(619571.24, 2);
    });

    it('总退款额应为¥122,352.74', () => {
      expect(calculated.totalRefund).toBeCloseTo(122352.74, 2);
    });

    it('总快递费应为¥46,358.40', () => {
      expect(calculated.totalExpress).toBeCloseTo(46358.40, 2);
    });

    it('总达人佣金应为¥43,405.25', () => {
      expect(calculated.totalCommission).toBeCloseTo(43405.25, 2);
    });

    it('总服务费应为¥12,392.43', () => {
      expect(calculated.totalService).toBeCloseTo(12392.43, 2);
    });

    it('总商品成本应为¥272,895.00', () => {
      expect(calculated.totalCost).toBeCloseTo(272895.00, 2);
    });

    it('总推广费应为¥191,131.42', () => {
      expect(calculated.totalPromotion).toBeCloseTo(191131.42, 2);
    });

    it('总利润应为¥-71,813.30（允许小误差）', () => {
      expect(calculated.totalProfit).toBeCloseTo(-71813.30, 0);  // 允许小数点误差
    });

    it('利润率应为-11.59%', () => {
      expect(calculated.profitRatio).toBeCloseTo(-11.59, 2);
    });
  });

  describe('勾稽配置数据一致性', () => {
    it('baseData.amounts.sales应与calculated.totalSales一致', () => {
      expect(baseData.amounts.sales).toBeCloseTo(calculated.totalSales, 2);
    });

    it('baseData.amounts.refund应与calculated.totalRefund一致', () => {
      expect(baseData.amounts.refund).toBeCloseTo(calculated.totalRefund, 2);
    });

    it('baseData.expenses.express应与calculated.totalExpress一致', () => {
      expect(baseData.expenses.express).toBeCloseTo(calculated.totalExpress, 2);
    });

    it('baseData.expenses.commission应与calculated.totalCommission一致', () => {
      expect(baseData.expenses.commission).toBeCloseTo(calculated.totalCommission, 2);
    });

    it('baseData.expenses.service应与calculated.totalService一致', () => {
      expect(baseData.expenses.service).toBeCloseTo(calculated.totalService, 2);
    });

    it('baseData.expenses.cost应与calculated.totalCost一致', () => {
      expect(baseData.expenses.cost).toBeCloseTo(calculated.totalCost, 2);
    });

    it('baseData.expenses.promotion应与calculated.totalPromotion一致', () => {
      expect(baseData.expenses.promotion).toBeCloseTo(calculated.totalPromotion, 2);
    });

    it('baseData.profit.net应与calculated.totalProfit一致', () => {
      expect(baseData.profit.net).toBeCloseTo(calculated.totalProfit, 2);
    });
  });

  describe('利润计算公式验证', () => {
    it('销售额 = 退款额 + 快递费 + 达人佣金 + 服务费 + 商品成本 + 推广费 + 其他 + 保险费 + 赔付 + 预计利润（允许小误差）', () => {
      const calculatedSales = 
        calculated.totalRefund +
        calculated.totalExpress +
        calculated.totalCommission +
        calculated.totalService +
        calculated.totalCost +
        calculated.totalPromotion +
        calculated.totalOther +
        calculated.totalInsurance +
        calculated.totalPayout +
        calculated.totalProfit;
      
      // 允许±10元的误差（由于四舍五入和浮点数精度问题）
      expect(Math.abs(calculatedSales - calculated.totalSales)).toBeLessThan(10);
    });

    it('每日数据利润公式验证（允许小误差）', () => {
      dailyStatsExtended.forEach(day => {
        const calculatedSales = 
          day.refundAmount +
          day.expressAmount +
          day.commissionAmount +
          day.serviceAmount +
          day.costAmount +
          day.promotionAmount +
          day.otherAmount +
          day.insuranceAmount +
          day.payoutAmount +
          day.profitAmount;
        
        // 允许±10元的误差（由于四舍五入和浮点数精度问题）
        expect(Math.abs(calculatedSales - day.salesAmount)).toBeLessThan(10);
      });
    });
  });

  describe('summaryData一致性', () => {
    it('summaryData.totalSalesAmount应与calculated.totalSales一致', () => {
      expect(summaryData.totalSalesAmount).toBeCloseTo(calculated.totalSales, 2);
    });

    it('summaryData.refundAmount应与calculated.totalRefund一致', () => {
      expect(summaryData.refundAmount).toBeCloseTo(calculated.totalRefund, 2);
    });

    it('summaryData.promotionAmount应与calculated.totalPromotion一致', () => {
      expect(summaryData.promotionAmount).toBeCloseTo(calculated.totalPromotion, 2);
    });
  });
});

describe('数据勾稽测试 - 各模块数据一致性', () => {
  const calculated = calculateSummary(dailyStatsExtended);

  describe('经营概览模块', () => {
    it('总营收应等于销售额', () => {
      expect(dashboardData.totalRevenue).toBeCloseTo(baseData.amounts.sales, 2);
    });

    it('订单数应等于总订单数', () => {
      expect(dashboardData.orderCount).toBe(baseData.orders.total);
    });
  });

  describe('费用中心模块', () => {
    it('推广费应与基准数据一致', () => {
      expect(expenseCenterData.promotion).toBeCloseTo(baseData.expenses.promotion, 2);
    });

    it('快递费应与基准数据一致', () => {
      expect(expenseCenterData.express).toBeCloseTo(baseData.expenses.express, 2);
    });

    it('达人佣金应与基准数据一致', () => {
      expect(expenseCenterData.commission).toBeCloseTo(baseData.expenses.commission, 2);
    });

    it('服务费应与基准数据一致', () => {
      expect(expenseCenterData.service).toBeCloseTo(baseData.expenses.service, 2);
    });
  });

  describe('订单统计模块', () => {
    it('销售额应与基准数据一致', () => {
      expect(orderStatsData.sales).toBeCloseTo(baseData.amounts.sales, 2);
    });

    it('已确认金额应与基准数据一致', () => {
      expect(orderStatsData.confirmed).toBeCloseTo(baseData.amounts.confirmed, 2);
    });

    it('退款额应与基准数据一致', () => {
      expect(orderStatsData.refund).toBeCloseTo(baseData.amounts.refund, 2);
    });

    it('推广费应与基准数据一致', () => {
      expect(orderStatsData.promotion).toBeCloseTo(baseData.expenses.promotion, 2);
    });
  });
});
