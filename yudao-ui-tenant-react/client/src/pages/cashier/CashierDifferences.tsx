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
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  ListOrdered,
  Gauge,
  Eye,
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
import { useState } from "react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useDifferenceList,
  useDifferenceBatchHandle,
} from "@/hooks/useCashier";
import { toast } from "sonner";

// 差异趋势数据
const diffTrendData = [
  { date: "01-09", count: 12, amount: 1580 },
  { date: "01-10", count: 8, amount: 920 },
  { date: "01-11", count: 15, amount: 2100 },
  { date: "01-12", count: 10, amount: 1350 },
  { date: "01-13", count: 6, amount: 780 },
  { date: "01-14", count: 18, amount: 2450 },
  { date: "01-15", count: 14, amount: 1860 },
];

// 差异原因分布
const diffReasonData = [
  { name: "平台手续费", value: 35, color: "#1890ff" },
  { name: "技术服务费", value: 25, color: "#52c41a" },
  { name: "推广费扣除", value: 20, color: "#faad14" },
  { name: "退款差异", value: 12, color: "#ff4d4f" },
  { name: "其他", value: 8, color: "#722ed1" },
];

// 平台差异对比
const platformDiffData = [
  { platform: "抖音", pending: 15, resolved: 45 },
  { platform: "快手", pending: 8, resolved: 28 },
  { platform: "淘宝", pending: 5, resolved: 18 },
  { platform: "拼多多", pending: 3, resolved: 12 },
];

// 差异状态分布
const diffStatusData = [
  { name: "待处理", value: 38, color: "#faad14" },
  { name: "处理中", value: 25, color: "#1890ff" },
  { name: "已处理", value: 85, color: "#52c41a" },
  { name: "已关闭", value: 8, color: "#8c8c8c" },
];

// TOP差异订单
const topDiffOrders = [
  {
    rank: 1,
    orderNo: "DD20240115008",
    platform: "抖音",
    diffAmount: -520.00,
    reason: "推广费扣除",
    duration: "3天",
    status: "待处理",
  },
  {
    rank: 2,
    orderNo: "DD20240114025",
    platform: "抖音",
    diffAmount: -380.00,
    reason: "技术服务费",
    duration: "4天",
    status: "待处理",
  },
  {
    rank: 3,
    orderNo: "DD20240113012",
    platform: "快手",
    diffAmount: -320.00,
    reason: "平台手续费",
    duration: "5天",
    status: "处理中",
  },
  {
    rank: 4,
    orderNo: "DD20240112018",
    platform: "抖音",
    diffAmount: -280.00,
    reason: "退款差异",
    duration: "6天",
    status: "待处理",
  },
  {
    rank: 5,
    orderNo: "DD20240111009",
    platform: "淘宝",
    diffAmount: -250.00,
    reason: "平台手续费",
    duration: "7天",
    status: "处理中",
  },
  {
    rank: 6,
    orderNo: "DD20240110015",
    platform: "拼多多",
    diffAmount: -220.00,
    reason: "技术服务费",
    duration: "8天",
    status: "待处理",
  },
  {
    rank: 7,
    orderNo: "DD20240109022",
    platform: "抖音",
    diffAmount: -180.00,
    reason: "平台手续费",
    duration: "9天",
    status: "处理中",
  },
  {
    rank: 8,
    orderNo: "DD20240108011",
    platform: "快手",
    diffAmount: -150.00,
    reason: "推广费扣除",
    duration: "10天",
    status: "待处理",
  },
  {
    rank: 9,
    orderNo: "DD20240107008",
    platform: "淘宝",
    diffAmount: -120.00,
    reason: "退款差异",
    duration: "11天",
    status: "待处理",
  },
  {
    rank: 10,
    orderNo: "DD20240106005",
    platform: "抖音",
    diffAmount: -100.00,
    reason: "其他",
    duration: "12天",
    status: "处理中",
  },
];

// 高频差异原因数据
const highFreqReasonData = [
  { reason: "平台手续费", count: 45 },
  { reason: "技术服务费", count: 38 },
  { reason: "推广费扣除", count: 32 },
  { reason: "退款差异", count: 25 },
  { reason: "在途资金", count: 18 },
  { reason: "时间差异", count: 12 },
];

// 处理时长趋势数据
const processTimeData = [
  { date: "01-09", avgTime: 3.2 },
  { date: "01-10", avgTime: 2.8 },
  { date: "01-11", avgTime: 3.5 },
  { date: "01-12", avgTime: 2.5 },
  { date: "01-13", avgTime: 2.2 },
  { date: "01-14", avgTime: 2.8 },
  { date: "01-15", avgTime: 2.4 },
];

// 处理人员效率数据
const processorEffData = [
  { name: "张出纳", count: 86, efficiency: 92 },
  { name: "李会计", count: 42, efficiency: 85 },
  { name: "王财务", count: 28, efficiency: 78 },
];

// 处理效率统计
const processorEfficiency = [
  {
    name: "张出纳",
    count: 86,
    avgTime: "2.5小时",
    fastest: "15分钟",
    slowest: "8小时",
    rate: "92%",
    rating: "优秀",
  },
  {
    name: "李会计",
    count: 42,
    avgTime: "4.2小时",
    fastest: "30分钟",
    slowest: "12小时",
    rate: "85%",
    rating: "良好",
  },
  {
    name: "王财务",
    count: 28,
    avgTime: "6.8小时",
    fastest: "45分钟",
    slowest: "24小时",
    rate: "78%",
    rating: "一般",
  },
];

export default function CashierDifferences() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [period, setPeriod] = useState("month");
  const [platform, setPlatform] = useState("all");
  const [analysisType, setAnalysisType] = useState("platform");
  const [topType, setTopType] = useState("amount");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // API调用
  const { data: differenceData, isLoading, refetch } = useDifferenceList({
    shopId,
    status: 'pending',
    platform: platform !== 'all' ? platform : undefined,
  });
  const batchHandleMutation = useDifferenceBatchHandle();
  
  // 导出分析报告
  const handleExport = () => {
    toast.info("导出功能待Java后端实现");
  };
  
  // 批量处理差异
  const handleBatchProcess = () => {
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
  };
  
  // 生成报告
  const handleGenerateReport = () => {
    toast.info("报告生成功能待Java后端实现");
  };

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
              <div className="text-2xl font-bold text-blue-600">¥12,850</div>
              <div className="text-sm text-gray-500 mt-1">差异总额</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">128</div>
              <div className="text-sm text-gray-500 mt-1">差异订单数</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">8.2%</div>
              <div className="text-sm text-gray-500 mt-1">平均差异率</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-gray-500 mt-1">已处理率</div>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">差异原因分布</h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diffReasonData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {diffReasonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">差异金额趋势</h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={diffTrendData}>
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformDiffData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="platform" stroke="#8c8c8c" fontSize={12} />
                    <YAxis stroke="#8c8c8c" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pending" name="待处理" fill="#faad14" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" name="已处理" fill="#52c41a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">差异订单处理状态</h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diffStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}`}
                    >
                      {diffStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topDiffOrders.slice(0, 10)}
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
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">高频差异原因分析</h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={highFreqReasonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="reason" stroke="#8c8c8c" fontSize={10} />
                    <YAxis stroke="#8c8c8c" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" name="出现次数" fill="#1890ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 差异订单详情表格 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">差异订单详情</h4>
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
                {topDiffOrders.map((order) => (
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
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Eye className="w-3 h-3 mr-1" />
                        查看
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 差异处理效率分析 */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Gauge className="w-4 h-4 text-purple-500" />
            差异处理效率分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">平均处理时长趋势</h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#8c8c8c" fontSize={12} />
                    <YAxis stroke="#8c8c8c" fontSize={12} unit="h" />
                    <Tooltip formatter={(value: number) => `${value}小时`} />
                    <Line
                      type="monotone"
                      dataKey="avgTime"
                      name="平均处理时长"
                      stroke="#722ed1"
                      strokeWidth={2}
                      dot={{ fill: "#722ed1" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">处理人员效率对比</h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processorEffData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#8c8c8c" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#8c8c8c" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#8c8c8c" fontSize={12} unit="%" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="处理订单数" fill="#1890ff" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="efficiency" name="效率评分" fill="#52c41a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 处理效率统计表格 */}
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-700">处理效率统计</h4>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="w-3 h-3" />
              导出数据
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>处理人</TableHead>
                <TableHead className="text-center">处理订单数</TableHead>
                <TableHead className="text-center">平均处理时长</TableHead>
                <TableHead className="text-center">最快处理</TableHead>
                <TableHead className="text-center">最慢处理</TableHead>
                <TableHead className="text-center">一次解决率</TableHead>
                <TableHead className="text-center">评价</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processorEfficiency.map((processor) => (
                <TableRow key={processor.name}>
                  <TableCell className="font-medium">
                    {processor.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {processor.count}
                  </TableCell>
                  <TableCell className="text-center text-gray-500">
                    {processor.avgTime}
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    {processor.fastest}
                  </TableCell>
                  <TableCell className="text-center text-red-600">
                    {processor.slowest}
                  </TableCell>
                  <TableCell className="text-center">
                    {processor.rate}
                  </TableCell>
                  <TableCell className="text-center">
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
        </CardContent>
      </Card>
    </AppLayout>
  );
}
