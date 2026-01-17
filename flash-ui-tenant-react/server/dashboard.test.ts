/**
 * 经营概览API测试
 * @author Manus AI
 */
import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3000/api/trpc";

describe("Dashboard Router", () => {
  describe("dashboard.getOverview", () => {
    it("should return overview data with mock fallback", async () => {
      const input = encodeURIComponent(
        JSON.stringify({
          json: {
            startDate: "2025-01-01",
            endDate: "2025-01-31",
          },
        })
      );
      const response = await fetch(`${BASE_URL}/dashboard.getOverview?input=${input}`);

      expect(response.ok).toBe(true);
      const data = await response.json();

      // 验证返回结构
      expect(data.result).toBeDefined();
      expect(data.result.data).toBeDefined();

      const overview = data.result.data.json;
      expect(overview).toHaveProperty("totalRevenue");
      expect(overview).toHaveProperty("grossProfit");
      expect(overview).toHaveProperty("netProfit");
      expect(overview).toHaveProperty("orderCount");
      expect(overview).toHaveProperty("expenses");
      expect(overview).toHaveProperty("ratios");
    });

    it("should accept shopId parameter", async () => {
      const input = encodeURIComponent(
        JSON.stringify({
          json: {
            shopId: "shop_001",
            startDate: "2025-01-01",
            endDate: "2025-01-31",
          },
        })
      );
      const response = await fetch(`${BASE_URL}/dashboard.getOverview?input=${input}`);

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.result.data).toBeDefined();
    });
  });

  describe("dashboard.getTrends", () => {
    it("should return trends data with mock fallback", async () => {
      const input = encodeURIComponent(
        JSON.stringify({
          json: {
            startDate: "2025-01-01",
            endDate: "2025-01-31",
            granularity: "day",
          },
        })
      );
      const response = await fetch(`${BASE_URL}/dashboard.getTrends?input=${input}`);

      expect(response.ok).toBe(true);
      const data = await response.json();

      expect(data.result).toBeDefined();
      expect(data.result.data).toBeDefined();
      expect(Array.isArray(data.result.data.json)).toBe(true);

      if (data.result.data.json.length > 0) {
        const item = data.result.data.json[0];
        expect(item).toHaveProperty("date");
        expect(item).toHaveProperty("salesAmount");
        expect(item).toHaveProperty("orderCount");
      }
    });
  });

  describe("dashboard.getExpenseBreakdown", () => {
    it("should return expense breakdown data with mock fallback", async () => {
      const input = encodeURIComponent(
        JSON.stringify({
          json: {
            startDate: "2025-01-01",
            endDate: "2025-01-31",
          },
        })
      );
      const response = await fetch(`${BASE_URL}/dashboard.getExpenseBreakdown?input=${input}`);

      expect(response.ok).toBe(true);
      const data = await response.json();

      expect(data.result).toBeDefined();
      expect(data.result.data).toBeDefined();
      expect(Array.isArray(data.result.data.json)).toBe(true);

      if (data.result.data.json.length > 0) {
        const item = data.result.data.json[0];
        expect(item).toHaveProperty("category");
        expect(item).toHaveProperty("amount");
        expect(item).toHaveProperty("percent");
      }
    });
  });
});
