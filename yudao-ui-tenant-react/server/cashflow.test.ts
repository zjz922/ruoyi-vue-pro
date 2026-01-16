/**
 * 资金流水API测试
 * @author Manus AI
 */
import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3000/api/trpc";

describe("Cashflow Router", () => {
  describe("cashflow.list", () => {
    it("should return cashflow list with mock fallback", async () => {
      const input = encodeURIComponent(
        JSON.stringify({
          json: {
            page: 1,
            pageSize: 10,
          },
        })
      );
      const response = await fetch(`${BASE_URL}/cashflow.list?input=${input}`);

      expect(response.ok).toBe(true);
      const data = await response.json();

      expect(data.result).toBeDefined();
      expect(data.result.data).toBeDefined();

      const listData = data.result.data.json;
      expect(listData).toHaveProperty("items");
      expect(listData).toHaveProperty("total");
      expect(listData).toHaveProperty("page");
      expect(listData).toHaveProperty("pageSize");
      expect(listData).toHaveProperty("totalPages");
      expect(Array.isArray(listData.items)).toBe(true);
    });

    it("should support pagination", async () => {
      const input = encodeURIComponent(
        JSON.stringify({
          json: {
            page: 2,
            pageSize: 5,
          },
        })
      );
      const response = await fetch(`${BASE_URL}/cashflow.list?input=${input}`);

      expect(response.ok).toBe(true);
      const data = await response.json();

      expect(data.result.data.json.page).toBe(2);
      expect(data.result.data.json.pageSize).toBe(5);
    });

    it("should support filter by channel", async () => {
      const input = encodeURIComponent(
        JSON.stringify({
          json: {
            channel: "doudian",
            page: 1,
            pageSize: 10,
          },
        })
      );
      const response = await fetch(`${BASE_URL}/cashflow.list?input=${input}`);

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.result.data).toBeDefined();
    });

    it("should support filter by date range", async () => {
      const input = encodeURIComponent(
        JSON.stringify({
          json: {
            startDate: "2025-04-01",
            endDate: "2025-04-30",
            page: 1,
            pageSize: 10,
          },
        })
      );
      const response = await fetch(`${BASE_URL}/cashflow.list?input=${input}`);

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.result.data).toBeDefined();
    });
  });

  describe("cashflow.getStats", () => {
    it("should return cashflow statistics with mock fallback", async () => {
      const input = encodeURIComponent(
        JSON.stringify({
          json: {
            startDate: "2025-04-01",
            endDate: "2025-04-30",
          },
        })
      );
      const response = await fetch(`${BASE_URL}/cashflow.getStats?input=${input}`);

      expect(response.ok).toBe(true);
      const data = await response.json();

      expect(data.result).toBeDefined();
      expect(data.result.data).toBeDefined();

      const stats = data.result.data.json;
      expect(stats).toHaveProperty("totalIncome");
      expect(stats).toHaveProperty("totalExpense");
      expect(stats).toHaveProperty("netFlow");
      expect(stats).toHaveProperty("transactionCount");
      expect(stats).toHaveProperty("pendingCount");
      expect(stats).toHaveProperty("confirmedCount");
    });

    it("should accept shopId parameter", async () => {
      const input = encodeURIComponent(
        JSON.stringify({
          json: {
            shopId: "shop_001",
            startDate: "2025-04-01",
            endDate: "2025-04-30",
          },
        })
      );
      const response = await fetch(`${BASE_URL}/cashflow.getStats?input=${input}`);

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.result.data).toBeDefined();
    });
  });

  describe("cashflow.getById", () => {
    it("should return single cashflow item with mock fallback", async () => {
      const input = encodeURIComponent(
        JSON.stringify({
          json: {
            id: "cf_1001",
          },
        })
      );
      const response = await fetch(`${BASE_URL}/cashflow.getById?input=${input}`);

      expect(response.ok).toBe(true);
      const data = await response.json();

      expect(data.result).toBeDefined();
      expect(data.result.data).toBeDefined();

      const item = data.result.data.json;
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("shopId");
      expect(item).toHaveProperty("transactionDate");
      expect(item).toHaveProperty("channel");
      expect(item).toHaveProperty("type");
    });
  });
});
