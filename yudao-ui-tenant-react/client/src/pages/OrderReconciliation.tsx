/**
 * 订单对账页面
 * 从抖店同步订单并进行对账
 */

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";

export default function OrderReconciliation() {
  const [syncLoading, setSyncLoading] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // 同步结果状态
  const [syncResult, setSyncResult] = useState<any>(null);
  const [compareResult, setCompareResult] = useState<any>(null);

  /**
   * 从抖店同步订单
   */
  const handleSyncOrders = async () => {
    setSyncLoading(true);
    try {
      // TODO: 调用后端API
      // const response = await fetch('/api/v1/reconciliation/orders/sync', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     startDate,
      //     endDate,
      //     accessToken: 'xxx'
      //   })
      // });
      // const data = await response.json();
      // setSyncResult(data.data);

      // 模拟数据
      setSyncResult({
        success: true,
        newCount: 150,
        updatedCount: 50,
        totalCount: 200,
        syncLogId: 1,
      });
    } catch (error) {
      console.error("Failed to sync orders:", error);
    } finally {
      setSyncLoading(false);
    }
  };

  /**
   * 执行订单对账
   */
  const handleCompareOrders = async () => {
    setCompareLoading(true);
    try {
      // TODO: 调用后端API
      // const response = await fetch('/api/v1/reconciliation/orders/compare', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     startDate,
      //     endDate
      //   })
      // });
      // const data = await response.json();
      // setCompareResult(data.data);

      // 模拟数据
      setCompareResult({
        matched: 195,
        warning: 3,
        error: 2,
        details: [
          {
            orderNo: "2025011400001",
            status: "matched",
            message: "订单数据一致",
          },
          {
            orderNo: "2025011400002",
            status: "warning",
            message: "金额不匹配：本地100.00，抖店99.99",
          },
          {
            orderNo: "2025011400003",
            status: "error",
            message: "本地订单在抖店中不存在",
          },
        ],
      });
    } catch (error) {
      console.error("Failed to compare orders:", error);
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">订单对账</h1>
            <p className="text-muted-foreground">
              从抖店同步订单并进行数据对账
            </p>
          </div>
        </div>

        {/* 日期范围选择 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">对账时间范围</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium block mb-2">
                  开始日期
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium block mb-2">
                  结束日期
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSyncOrders}
                disabled={syncLoading}
                className="gap-2"
              >
                <Upload className={`w-4 h-4 ${syncLoading ? "animate-spin" : ""}`} />
                {syncLoading ? "同步中..." : "同步订单"}
              </Button>
              <Button
                onClick={handleCompareOrders}
                disabled={compareLoading}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${compareLoading ? "animate-spin" : ""}`} />
                {compareLoading ? "对账中..." : "执行对账"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 同步结果 */}
        {syncResult && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  同步结果
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">新增订单</p>
                  <p className="text-2xl font-bold text-green-600">
                    {syncResult.newCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">更新订单</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {syncResult.updatedCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">同步总数</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {syncResult.totalCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">同步状态</p>
                  <Badge className="mt-2 bg-green-600">
                    {syncResult.success ? "成功" : "失败"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 对账结果 */}
        {compareResult && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">对账结果统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                  <p className="text-sm text-gray-600">一致订单</p>
                  <p className="text-3xl font-bold text-green-600">
                    {compareResult.matched}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(
                      (compareResult.matched /
                        (compareResult.matched +
                          compareResult.warning +
                          compareResult.error)) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                  <p className="text-sm text-gray-600">警告订单</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {compareResult.warning}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">需要审查</p>
                </div>

                <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                  <p className="text-sm text-gray-600">错误订单</p>
                  <p className="text-3xl font-bold text-red-600">
                    {compareResult.error}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">需要处理</p>
                </div>
              </div>

              {/* 对账详情表格 */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>订单号</TableHead>
                      <TableHead>对账状态</TableHead>
                      <TableHead>说明</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {compareResult.details.map((detail: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-sm">
                          {detail.orderNo}
                        </TableCell>
                        <TableCell>
                          {detail.status === "matched" && (
                            <Badge className="bg-green-100 text-green-800">
                              一致
                            </Badge>
                          )}
                          {detail.status === "warning" && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              警告
                            </Badge>
                          )}
                          {detail.status === "error" && (
                            <Badge className="bg-red-100 text-red-800">
                              错误
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {detail.message}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 同步日志 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">同步日志</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>暂无同步日志</p>
              <p className="text-xs mt-2">执行同步后将显示日志记录</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
