import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FileCheck,
  Upload,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Play,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useState, useMemo, useCallback } from "react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useReconciliationList,
  useReconciliationStart,
  useReconciliationExport,
  useReconciliationMarkVerified,
} from "@/hooks/useCashier";
import { toast } from "sonner";

// ============ 类型定义 ============

interface ReconciliationItem {
  id: number;
  orderNo: string;
  platformAmount: number;
  actualAmount: number;
  difference: number;
  reason: string;
  status: string;
  platform: string;
  date: string;
}

interface StatusDistributionItem {
  name: string;
  value: number;
  color: string;
}

interface ReconciliationStats {
  total: number;
  matched: number;
  matchedRate: number;
  hasDifference: number;
  differenceAmount: number;
  unmatched: number;
  unmatchedAmount: number;
}

interface ReconciliationApiData {
  records?: ReconciliationItem[];
  stats?: ReconciliationStats;
  statusDistribution?: StatusDistributionItem[];
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

export default function CashierReconciliation() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ReconciliationItem | null>(null);
  const [processAction, setProcessAction] = useState("confirm");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  
  // API调用
  const { data: reconciliationApiData, isLoading, error, refetch } = useReconciliationList({
    shopId,
    startDate: dateRange.start,
    endDate: dateRange.end,
    platform,
    status,
  });
  const startMutation = useReconciliationStart();
  const exportMutation = useReconciliationExport();
  const markVerifiedMutation = useReconciliationMarkVerified();

  // 类型断言
  const typedApiData = reconciliationApiData as ReconciliationApiData | undefined;

  // 从API响应中提取数据
  const reconciliationData = useMemo<ReconciliationItem[]>(() => {
    return typedApiData?.records || [];
  }, [typedApiData]);

  const stats = useMemo<ReconciliationStats>(() => {
    if (typedApiData?.stats) {
      return typedApiData.stats;
    }
    return {
      total: 0,
      matched: 0,
      matchedRate: 0,
      hasDifference: 0,
      differenceAmount: 0,
      unmatched: 0,
      unmatchedAmount: 0,
    };
  }, [typedApiData]);

  const statusDistribution = useMemo<StatusDistributionItem[]>(() => {
    if (typedApiData?.statusDistribution) {
      return typedApiData.statusDistribution;
    }
    return [];
  }, [typedApiData]);

  // 检查是否有数据
  const hasData = reconciliationData.length > 0;
  const hasStatsData = stats.total > 0;
  const hasDistributionData = statusDistribution.length > 0;
  
  // 开始对账
  const handleStartReconciliation = useCallback(() => {
    startMutation.mutate({
      shopId,
      startDate: dateRange.start || new Date().toISOString().split('T')[0],
      endDate: dateRange.end || new Date().toISOString().split('T')[0],
      platform: platform || 'doudian',
    }, {
      onSuccess: () => {
        refetch();
        toast.success("对账任务已启动");
      },
    });
  }, [startMutation, shopId, dateRange, platform, refetch]);
  
  // 导出报告
  const handleExport = useCallback(() => {
    exportMutation.mutate({
      shopId,
      startDate: dateRange.start,
      endDate: dateRange.end,
      format: 'excel',
    }, {
      onSuccess: () => toast.success("导出成功"),
    });
  }, [exportMutation, shopId, dateRange]);
  
  // 标记已核对
  const handleMarkVerified = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.error("请先选择要标记的记录");
      return;
    }
    markVerifiedMutation.mutate({ ids: selectedIds }, {
      onSuccess: () => {
        setSelectedIds([]);
        refetch();
        toast.success("标记成功");
      },
    });
  }, [markVerifiedMutation, selectedIds, refetch]);
  
  // 导入账单
  const handleImport = useCallback(() => {
    toast.info("导入账单功能开发中");
  }, []);
  
  // 处理差异
  const handleProcessOrder = useCallback((order: ReconciliationItem) => {
    setSelectedOrder(order);
    setIsProcessModalOpen(true);
  }, []);

  // 重置筛选
  const handleReset = useCallback(() => {
    setDateRange({ start: "", end: "" });
    setPlatform("");
    setStatus("");
    setSearchKeyword("");
  }, []);

  // 查询
  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">平台对账</h1>
          <p className="text-sm text-gray-500 mt-1">
            核对平台账单与实际到账金额
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleImport}>
            <Upload className="w-4 h-4" />
            导入账单
          </Button>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            <Download className="w-4 h-4" />
            {exportMutation.isPending ? '导出中...' : '导出报告'}
          </Button>
          <Button 
            className="gap-2" 
            onClick={handleStartReconciliation}
            disabled={startMutation.isPending}
          >
            <Play className={`w-4 h-4 ${startMutation.isPending ? 'animate-pulse' : ''}`} />
            {startMutation.isPending ? '对账中...' : '开始对账'}
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
                  <FileCheck className="w-4 h-4" />
                  总笔数
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-xs text-gray-500 mt-1">今日待对账订单</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <CheckCircle className="w-4 h-4" />
                  已匹配
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.matched}</div>
                <div className="text-xs text-green-600 mt-1">匹配率 {stats.matchedRate}%</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  有差异
                </div>
                <div className="text-2xl font-bold text-yellow-600">{stats.hasDifference}</div>
                <div className="text-xs text-yellow-600 mt-1">差异金额 ¥{stats.differenceAmount.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <XCircle className="w-4 h-4" />
                  未匹配
                </div>
                <div className="text-2xl font-bold text-red-600">{stats.unmatched}</div>
                <div className="text-xs text-red-600 mt-1">待处理金额 ¥{stats.unmatchedAmount.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* 图表和筛选 */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-base">对账状态分布</CardTitle>
              </CardHeader>
              <CardContent>
                {hasDistributionData ? (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState message="暂无状态分布数据" icon={FileCheck} />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-base">筛选条件</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">日期范围</Label>
                    <Input 
                      type="date" 
                      className="h-9" 
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">平台</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="全部平台" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部平台</SelectItem>
                        <SelectItem value="douyin">抖音</SelectItem>
                        <SelectItem value="kuaishou">快手</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">状态</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="matched">已匹配</SelectItem>
                        <SelectItem value="diff">有差异</SelectItem>
                        <SelectItem value="unmatched">未匹配</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">搜索</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder="订单号" 
                        className="pl-8 h-9" 
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={handleSearch}>查询</Button>
                  <Button size="sm" variant="outline" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    重置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 对账列表 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">对账明细</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {hasData ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>订单号</TableHead>
                      <TableHead>平台</TableHead>
                      <TableHead className="text-right">平台账单金额</TableHead>
                      <TableHead className="text-right">实际到账金额</TableHead>
                      <TableHead className="text-right">差异金额</TableHead>
                      <TableHead>差异原因</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reconciliationData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.orderNo}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.platform}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          ¥{item.platformAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ¥{item.actualAmount.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            item.difference < 0
                              ? "text-red-600"
                              : item.difference > 0
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {item.difference !== 0
                            ? `${item.difference > 0 ? "+" : ""}¥${item.difference.toFixed(2)}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-gray-500">{item.reason}</TableCell>
                        <TableCell>
                          <Badge
                            variant="default"
                            className={
                              item.status === "已匹配"
                                ? "bg-green-100 text-green-700"
                                : item.status === "有差异"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.status !== "已匹配" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleProcessOrder(item)}
                            >
                              处理
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState message="暂无对账数据" icon={FileCheck} />
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* 处理差异弹窗 */}
      <Dialog open={isProcessModalOpen} onOpenChange={setIsProcessModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>处理差异订单: {selectedOrder?.orderNo}</DialogTitle>
            <DialogDescription>
              请选择差异处理方式
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* 差异详情 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">差异详情</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-500 mb-1">平台账单金额</div>
                  <div className="text-lg font-bold text-gray-900">
                    ¥{selectedOrder?.platformAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">实际到账金额</div>
                  <div className="text-lg font-bold text-gray-900">
                    ¥{selectedOrder?.actualAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">差异金额</div>
                  <div className="text-lg font-bold text-red-600">
                    ¥{selectedOrder?.difference.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>差异原因</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择差异原因" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fee">平台手续费</SelectItem>
                  <SelectItem value="tech">技术服务费</SelectItem>
                  <SelectItem value="promo">推广费用扣除</SelectItem>
                  <SelectItem value="refund">退款扣除</SelectItem>
                  <SelectItem value="other">其他原因</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>详细说明</Label>
              <Textarea placeholder="请输入详细说明" />
            </div>

            <div className="space-y-2">
              <Label>处理方式</Label>
              <RadioGroup defaultValue="accept" value={processAction} onValueChange={setProcessAction}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="accept" id="accept" />
                  <Label htmlFor="accept" className="font-normal">
                    接受差异，记录为手续费支出
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mark" id="mark" />
                  <Label htmlFor="mark" className="font-normal">
                    标记为异常，需要跟进
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="adjust" id="adjust" />
                  <Label htmlFor="adjust" className="font-normal">
                    调整账务记录
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>处理人</Label>
                <Input placeholder="请输入处理人" />
              </div>
              <div className="space-y-2">
                <Label>处理时间</Label>
                <Input type="datetime-local" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProcessModalOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              setIsProcessModalOpen(false);
              toast.success("差异处理成功");
              refetch();
            }}>
              确认处理
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
