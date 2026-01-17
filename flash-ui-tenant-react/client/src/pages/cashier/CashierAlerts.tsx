import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  Eye,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useAlertList,
  useAlertHandle,
  useAlertBatchHandle,
} from "@/hooks/useCashier";
import { toast } from "sonner";

// ============ 类型定义 ============

interface AlertItem {
  id: number;
  title: string;
  type: string;
  level: string;
  time: string;
  duration: string;
  description: string;
  status: string;
  handler: string;
}

interface AlertStats {
  total: number;
  pending: number;
  processing: number;
  resolved: number;
  high: number;
  medium: number;
  low: number;
}

interface AlertsApiData {
  records?: AlertItem[];
  stats?: AlertStats;
  total?: number;
}

// ============ 空状态组件 ============
function EmptyState({ message, icon: Icon = AlertCircle }: { message: string; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
      <Icon className="h-10 w-10 mb-3 opacity-50" />
      <p className="text-sm">{message}</p>
      <p className="text-xs mt-1">请确认Java后端服务已启动</p>
    </div>
  );
}

// ============ 加载状态组件 ============
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
      <p className="text-sm text-muted-foreground">正在加载数据...</p>
    </div>
  );
}

export default function CashierAlerts() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [alertType, setAlertType] = useState("all");
  const [alertLevel, setAlertLevel] = useState("all");
  const [alertStatus, setAlertStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // API调用
  const { data: alertsApiData, isLoading, error, refetch } = useAlertList({
    shopId,
    type: alertType !== "all" ? alertType : undefined,
    level: alertLevel !== "all" ? alertLevel : undefined,
    status: alertStatus !== "all" ? alertStatus : undefined,
    pageNum: page,
    pageSize,
  });
  const handleMutation = useAlertHandle();
  const batchHandleMutation = useAlertBatchHandle();

  // 类型断言
  const typedApiData = alertsApiData as AlertsApiData | undefined;

  // 从API响应中提取数据
  const alertsData = useMemo<AlertItem[]>(() => {
    return typedApiData?.records || [];
  }, [typedApiData]);

  const alertStats = useMemo<AlertStats>(() => {
    if (typedApiData?.stats) {
      return typedApiData.stats;
    }
    return {
      total: 0,
      pending: 0,
      processing: 0,
      resolved: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
  }, [typedApiData]);

  const totalRecords = typedApiData?.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  // 检查是否有数据
  const hasData = alertsData.length > 0;
  const hasStatsData = alertStats.total > 0;

  // 刷新
  const handleRefresh = useCallback(() => {
    refetch();
    toast.success("数据已刷新");
  }, [refetch]);

  // 全部已读
  const handleMarkAllRead = useCallback(() => {
    batchHandleMutation.mutate({ alertIds: [], action: 'ignore' }, {
      onSuccess: () => {
        refetch();
        toast.success("已全部标记为已读");
      },
    });
  }, [batchHandleMutation, refetch]);

  // 查看详情
  const handleView = useCallback((alert: AlertItem) => {
    toast.info(`查看预警详情: ${alert.title}`);
  }, []);

  // 处理预警
  const handleProcess = useCallback((alert: AlertItem, action: 'process' | 'ignore') => {
    handleMutation.mutate({ 
      alertId: alert.id, 
      action,
    }, {
      onSuccess: () => {
        refetch();
        toast.success(action === 'process' ? "预警已处理" : "预警已忽略");
      },
    });
  }, [handleMutation, refetch]);

  // 分页
  const handlePrevPage = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) setPage(page + 1);
  }, [page, totalPages]);

  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">预警中心</h1>
          <p className="text-sm text-gray-500 mt-1">
            财务预警通知与处理
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleMarkAllRead}
            disabled={batchHandleMutation.isPending}
          >
            <Check className="w-4 h-4" />
            全部已读
          </Button>
        </div>
      </div>

      {/* 加载状态 */}
      {isLoading && <LoadingState />}

      {/* 错误状态 */}
      {error && !isLoading && (
        <EmptyState message="数据加载失败，请检查网络连接" icon={AlertCircle} />
      )}

      {/* 有数据时显示内容 */}
      {!isLoading && !error && (
        <>
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Bell className="w-4 h-4" />
                  总预警数
                </div>
                <div className="text-2xl font-bold text-gray-900">{alertStats.total}</div>
                <div className="text-xs text-gray-500 mt-1">本月累计</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  待处理
                </div>
                <div className="text-2xl font-bold text-red-600">{alertStats.pending}</div>
                <div className="text-xs text-red-600 mt-1">
                  高危 {alertStats.high} 个
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  处理中
                </div>
                <div className="text-2xl font-bold text-yellow-600">{alertStats.processing}</div>
                <div className="text-xs text-gray-500 mt-1">正在跟进</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <CheckCircle className="w-4 h-4" />
                  已处理
                </div>
                <div className="text-2xl font-bold text-green-600">{alertStats.resolved}</div>
                <div className="text-xs text-green-600 mt-1">
                  处理率 {alertStats.total > 0 ? Math.round((alertStats.resolved / alertStats.total) * 100) : 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 筛选区域 */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Select value={alertType} onValueChange={setAlertType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="预警类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="fund">资金预警</SelectItem>
                    <SelectItem value="business">业务预警</SelectItem>
                    <SelectItem value="reconcile">对账预警</SelectItem>
                    <SelectItem value="transaction">交易预警</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={alertLevel} onValueChange={setAlertLevel}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="预警级别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部级别</SelectItem>
                    <SelectItem value="high">高危</SelectItem>
                    <SelectItem value="medium">中危</SelectItem>
                    <SelectItem value="low">低危</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={alertStatus} onValueChange={setAlertStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="处理状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待处理</SelectItem>
                    <SelectItem value="processing">处理中</SelectItem>
                    <SelectItem value="resolved">已处理</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2" onClick={() => toast.info("更多筛选功能开发中")}>
                  <Filter className="w-4 h-4" />
                  更多筛选
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 预警列表 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">预警列表</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {hasData ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">级别</TableHead>
                      <TableHead>预警标题</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>触发时间</TableHead>
                      <TableHead>持续时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>处理人</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alertsData.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          {alert.level === "high" ? (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          ) : alert.level === "medium" ? (
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                          ) : (
                            <Bell className="w-5 h-5 text-blue-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{alert.title}</div>
                            <div className="text-xs text-gray-500 mt-1 max-w-md truncate">
                              {alert.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{alert.type}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {alert.time}
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {alert.duration}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="default"
                            className={
                              alert.status === "待处理"
                                ? "bg-red-100 text-red-700"
                                : alert.status === "处理中"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }
                          >
                            {alert.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {alert.handler || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleView(alert)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {alert.status === "待处理" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-green-600"
                                  onClick={() => handleProcess(alert, 'process')}
                                  disabled={handleMutation.isPending}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-gray-400"
                                  onClick={() => handleProcess(alert, 'ignore')}
                                  disabled={handleMutation.isPending}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState message="暂无预警数据" icon={Bell} />
              )}
            </CardContent>
          </Card>

          {/* 分页 */}
          {hasData && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                共 {totalRecords} 条预警，当前显示第 {page} 页
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page <= 1}
                  onClick={handlePrevPage}
                >
                  上一页
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant="outline"
                    size="sm"
                    className={page === p ? "bg-primary text-white" : ""}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={handleNextPage}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}
