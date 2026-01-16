/**
 * 订单对账页面
 * 从抖店同步订单并进行对账
 */

import { useState, useCallback } from "react";
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
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Download,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import { toast } from "sonner";

// ============ 类型定义 ============

interface SyncResult {
  success: boolean;
  newCount: number;
  updatedCount: number;
  totalCount: number;
  syncLogId: number;
}

interface CompareDetail {
  orderNo: string;
  status: "matched" | "warning" | "error";
  message: string;
}

interface CompareResult {
  matched: number;
  warning: number;
  error: number;
  details: CompareDetail[];
}

// ============ 空状态组件 ============
function EmptyState({ message, icon: Icon = AlertCircle }: { message: string; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
      <Icon className="h-8 w-8 mb-2 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default function OrderReconciliation() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [syncLoading, setSyncLoading] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // 同步结果状态
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);

  /**
   * 从抖店同步订单
   */
  const handleSyncOrders = useCallback(async () => {
    if (!shopId) {
      toast.error("请先选择店铺");
      return;
    }
    
    setSyncLoading(true);
    try {
      // TODO: 调用Java后端API
      // const response = await fetch('/api/v1/reconciliation/orders/sync', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     shopId,
      //     startDate,
      //     endDate,
      //   })
      // });
      // const data = await response.json();
      // setSyncResult(data.data);

      toast.info("订单同步功能待Java后端实现");
      // 暂时不设置模拟数据
      setSyncResult(null);
    } catch (error) {
      console.error("Failed to sync orders:", error);
      toast.error("同步失败");
    } finally {
      setSyncLoading(false);
    }
  }, [shopId, startDate, endDate]);

  /**
   * 执行订单对账
   */
  const handleCompareOrders = useCallback(async () => {
    if (!shopId) {
      toast.error("请先选择店铺");
      return;
    }
    
    setCompareLoading(true);
    try {
      // TODO: 调用Java后端API
      // const response = await fetch('/api/v1/reconciliation/orders/compare', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     shopId,
      //     startDate,
      //     endDate
      //   })
      // });
      // const data = await response.json();
      // setCompareResult(data.data);

      toast.info("订单对账功能待Java后端实现");
      // 暂时不设置模拟数据
      setCompareResult(null);
    } catch (error) {
      console.error("Failed to compare orders:", error);
      toast.error("对账失败");
    } finally {
      setCompareLoading(false);
    }
  }, [shopId, startDate, endDate]);

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
                {syncLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {syncLoading ? "同步中..." : "同步订单"}
              </Button>
              <Button
                onClick={handleCompareOrders}
                disabled={compareLoading}
                variant="outline"
                className="gap-2"
              >
                {compareLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
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
                    {compareResult.details.map((detail, idx) => (
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
            <EmptyState 
              message="暂无同步日志，执行同步后将显示日志记录" 
              icon={AlertCircle} 
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
