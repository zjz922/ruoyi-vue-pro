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
  AlertTriangle,
  Download,
  FileText,
  ListOrdered,
  Eye,
  Loader2,
  AlertCircle,
  PieChart as PieChartIcon,
  Gauge,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useState, useMemo, useCallback } from "react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useDifferenceList,
  useDifferenceBatchHandle,
} from "@/hooks/useCashier";
import { toast } from "sonner";

// ============ 类型定义 ============

interface DiffOrder {
  rank: number;
  orderNo: string;
  platform: string;
  diffAmount: number;
  reason: string;
  duration: string;
  status: string;
}

interface DiffAnalysisApiData {
  stats?: {
    totalAmount: number;
    orderCount: number;
    avgDiffRate: number;
    processedRate: number;
  };
  trendData?: Array<{ date: string; count: number; amount: number }>;
  reasonData?: Array<{ name: string; value: number; color: string }>;
  platformData?: Array<{ platform: string; pending: number; resolved: number }>;
  statusData?: Array<{ name: string; value: number; color: string }>;
  topOrders?: DiffOrder[];
  highFreqReasons?: Array<{ reason: string; count: number }>;
  processTimeData?: Array<{ date: string; avgTime: number }>;
  processorEfficiency?: Array<{
    name: string;
    count: number;
    avgTime: string;
    fastest: string;
    slowest: string;
    rate: string;
    rating: string;
  }>;
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

// 默认颜色
const COLORS = ["#1890ff", "#52c41a", "#faad14", "#ff4d4f", "#722ed1", "#13c2c2"];

export default function CashierDifferences() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [period, setPeriod] = useState("month");
  const [platform, setPlatform] = useState("all");
  const [analysisType, setAnalysisType] = useState("platform");
  const [topType, setTopType] = useState("amount");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // API调用
  const { data: differenceApiData, isLoading, error, refetch } = useDifferenceList({
    shopId,
    status: 'pending',
    platform: platform !== 'all' ? platform : undefined,
  });
  // 使用差异列表数据作为分析数据源
  const analysisApiData = differenceApiData;
  const batchHandleMutation = useDifferenceBatchHandle();
  
  // 类型断言
  const typedAnalysisData = analysisApiData as DiffAnalysisApiData | undefined;
  
  // 从API响应中提取数据
  const stats = useMemo(() => {
    if (typedAnalysisData?.stats) {
      return typedAnalysisData.stats;
    }
    return {
      totalAmount: 0,
      orderCount: 0,
      avgDiffRate: 0,
      processedRate: 0,
    };
  }, [typedAnalysisData]);

  const trendData = useMemo(() => {
    return typedAnalysisData?.trendData || [];
  }, [typedAnalysisData]);

  const reasonData = useMemo(() => {
    if (typedAnalysisData?.reasonData) {
      return typedAnalysisData.reasonData;
    }
    return [];
  }, [typedAnalysisData]);

  const platformData = useMemo(() => {
    return typedAnalysisData?.platformData || [];
  }, [typedAnalysisData]);

  const statusData = useMemo(() => {
    if (typedAnalysisData?.statusData) {
      return typedAnalysisData.statusData;
    }
    return [];
  }, [typedAnalysisData]);

  const topOrders = useMemo(() => {
    return typedAnalysisData?.topOrders || [];
  }, [typedAnalysisData]);

  const highFreqReasons = useMemo(() => {
    return typedAnalysisData?.highFreqReasons || [];
  }, [typedAnalysisData]);

  const processTimeData = useMemo(() => {
    return typedAnalysisData?.processTimeData || [];
  }, [typedAnalysisData]);

  const processorEfficiency = useMemo(() => {
    return typedAnalysisData?.processorEfficiency || [];
  }, [typedAnalysisData]);

  // 检查是否有数据
  const hasData = trendData.length > 0 || reasonData.length > 0;
  
  // 导出分析报告
  const handleExport = useCallback(() => {
    toast.info("导出功能待Java后端实现");
  }, []);
  
  // 批量处理差异
  const handleBatchProcess = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.error("请先选择要处理的差异记录");
      return;
    }
    batchHandleMutation.mutate({
      diffIds: selectedIds,
      action: 'resolve',
      reason: '批量确认处理',
    }, {
      onSuccess: () => {
        setSelectedIds([]);
        refetch();
      },
    });
  }, [batchHandleMutation, selectedIds, refetch]);
  
  // 生成报告
  const handleGenerateReport = useCallback(() => {
    toast.info("报告生成功能待Java后端实现");
  }, []);

  // 查看订单详情
  const handleViewOrder = useCallback((order: DiffOrder) => {
    toast.info(`查看订单详情: ${order.orderNo}`);
  }, []);

  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">差异分析</h1>
          <p className="text-sm text-gray-500 mt-1">
            深度分析对账差异，识别问题根源，优化资金管理
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            导出分析
          </Button>
          <Button className="gap-2" onClick={handleGenerateReport}>
            <FileText className="w-4 h-4" />
            生成报告
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
          {/* 差异分析概览 */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">差异分析概览</CardTitle>
                <div className="flex gap-2">
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">今日</SelectItem>
                      <SelectItem value="yesterday">昨日</SelectItem>
                      <SelectItem value="week">本周</SelectItem>
                      <SelectItem value="month">本月</SelectItem>
                      <SelectItem value="quarter">本季度</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部平台</SelectItem>
                      <SelectItem value="douyin">抖音</SelectItem>
                      <SelectItem value="kuaishou">快手</SelectItem>
                      <SelectItem value="taobao">淘宝</SelectItem>
                      <SelectItem value="pdd">拼多多</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* 统计卡片 */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">¥{stats.totalAmount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 mt-1">差异总额</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-600">{stats.orderCount}</div>
                  <div className="text-sm text-gray-500 mt-1">差异订单数</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">{stats.avgDiffRate}%</div>
                  <div className="text-sm text-gray-500 mt-1">平均差异率</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{stats.processedRate}%</div>
                  <div className="text-sm text-gray-500 mt-1">已处理率</div>
                </div>
              </div>

              {/* 图表区域 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">差异原因分布</h4>
                  <div className="h-[250px]">
                    {reasonData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={reasonData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, value }) => `${name} ${value}%`}
                          >
                            {reasonData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState message="暂无差异原因数据" icon={PieChartIcon} />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">差异金额趋势</h4>
                  <div className="h-[250px]">
                    {trendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" stroke="#8c8c8c" fontSize={12} />
                          <YAxis yAxisId="left" stroke="#8c8c8c" fontSize={12} />
                          <YAxis yAxisId="right" orientation="right" stroke="#8c8c8c" fontSize={12} />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="count"
                            name="差异笔数"
                            stroke="#faad14"
                            strokeWidth={2}
                            dot={{ fill: "#faad14" }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="amount"
                            name="差异金额"
                            stroke="#ff4d4f"
                            strokeWidth={2}
                            dot={{ fill: "#ff4d4f" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState message="暂无趋势数据" icon={AlertTriangle} />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 差异深度分析 */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-blue-500" />
                  差异深度分析
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant={analysisType === "platform" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnalysisType("platform")}
                  >
                    按平台
                  </Button>
                  <Button
                    variant={analysisType === "shop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnalysisType("shop")}
                  >
                    按店铺
                  </Button>
                  <Button
                    variant={analysisType === "channel" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnalysisType("channel")}
                  >
                    按渠道
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">各平台差异金额对比</h4>
                  <div className="h-[250px]">
                    {platformData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={platformData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="platform" stroke="#8c8c8c" fontSize={12} />
                          <YAxis stroke="#8c8c8c" fontSize={12} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="pending" name="待处理" fill="#faad14" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="resolved" name="已处理" fill="#52c41a" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState message="暂无平台对比数据" icon={AlertTriangle} />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">差异订单处理状态</h4>
                  <div className="h-[250px]">
                    {statusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, value }) => `${name} ${value}`}
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState message="暂无状态分布数据" icon={PieChartIcon} />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 差异TOP分析 */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-orange-500" />
                  差异TOP分析
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant={topType === "amount" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTopType("amount")}
                  >
                    金额TOP10
                  </Button>
                  <Button
                    variant={topType === "frequency" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTopType("frequency")}
                  >
                    频率TOP10
                  </Button>
                  <Button
                    variant={topType === "duration" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTopType("duration")}
                  >
                    持续时间TOP10
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">差异金额TOP10订单</h4>
                  <div className="h-[250px]">
                    {topOrders.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topOrders.slice(0, 10)}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis type="number" stroke="#8c8c8c" fontSize={12} />
                          <YAxis
                            dataKey="orderNo"
                            type="category"
                            stroke="#8c8c8c"
                            fontSize={10}
                            width={100}
                          />
                          <Tooltip />
                          <Bar
                            dataKey="diffAmount"
                            name="差异金额"
                            fill="#ff4d4f"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState message="暂无TOP订单数据" icon={ListOrdered} />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">高频差异原因分析</h4>
                  <div className="h-[250px]">
                    {highFreqReasons.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={highFreqReasons}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="reason" stroke="#8c8c8c" fontSize={10} />
                          <YAxis stroke="#8c8c8c" fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="count" name="出现次数" fill="#1890ff" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState message="暂无高频原因数据" icon={AlertTriangle} />
                    )}
                  </div>
                </div>
              </div>

              {/* 差异订单详情表格 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">差异订单详情</h4>
                {topOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">排名</TableHead>
                        <TableHead>订单号</TableHead>
                        <TableHead>平台</TableHead>
                        <TableHead className="text-right">差异金额</TableHead>
                        <TableHead>差异原因</TableHead>
                        <TableHead>持续时间</TableHead>
                        <TableHead>处理状态</TableHead>
                        <TableHead className="text-center">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topOrders.map((order) => (
                        <TableRow key={order.rank}>
                          <TableCell>
                            <Badge
                              className={
                                order.rank <= 3
                                  ? "bg-red-50 text-red-600 border-red-200"
                                  : ""
                              }
                            >
                              {order.rank}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {order.orderNo}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {order.platform}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-red-600 font-medium">
                            ¥{Math.abs(order.diffAmount).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-xs text-gray-500">
                            {order.reason}
                          </TableCell>
                          <TableCell className="text-xs text-gray-500">
                            {order.duration}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="default"
                              className={
                                order.status === "待处理"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              查看
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState message="暂无差异订单数据" icon={FileText} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* 处理效率分析 */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Gauge className="w-4 h-4 text-green-500" />
                处理效率分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">平均处理时长趋势</h4>
                  <div className="h-[200px]">
                    {processTimeData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={processTimeData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" stroke="#8c8c8c" fontSize={12} />
                          <YAxis stroke="#8c8c8c" fontSize={12} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="avgTime"
                            name="平均处理时长(小时)"
                            stroke="#52c41a"
                            strokeWidth={2}
                            dot={{ fill: "#52c41a" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState message="暂无处理时长数据" icon={Gauge} />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">处理人员效率统计</h4>
                  {processorEfficiency.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>处理人</TableHead>
                          <TableHead className="text-center">处理数</TableHead>
                          <TableHead>平均时长</TableHead>
                          <TableHead>处理率</TableHead>
                          <TableHead>评级</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {processorEfficiency.map((processor) => (
                          <TableRow key={processor.name}>
                            <TableCell className="font-medium">{processor.name}</TableCell>
                            <TableCell className="text-center">{processor.count}</TableCell>
                            <TableCell>{processor.avgTime}</TableCell>
                            <TableCell>{processor.rate}</TableCell>
                            <TableCell>
                              <Badge
                                variant="default"
                                className={
                                  processor.rating === "优秀"
                                    ? "bg-green-100 text-green-700"
                                    : processor.rating === "良好"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }
                              >
                                {processor.rating}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <EmptyState message="暂无处理人员数据" icon={Gauge} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </AppLayout>
  );
}
