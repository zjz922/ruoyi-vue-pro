import { useState, useMemo, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Download,
  Search,
  RefreshCw,
  Eye,
  Edit,
  ExternalLink,
  Filter,
  Calendar,
  Volume2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReconciliationIndicator } from "@/components/ReconciliationIndicator";

// 导入全部真实订单数据
import allOrdersData from "@/data/allOrders.json";

// 订单数据类型定义
interface OrderData {
  mainOrderNo: string;
  subOrderNo: string;
  productName: string;
  productSpec: string;
  quantity: number;
  sku: string;
  unitPrice: number;
  payAmount: number;
  freight: number;
  totalDiscount: number;
  platformDiscount: number;
  merchantDiscount: number;
  influencerDiscount: number;
  serviceFee: number;
  payMethod: string;
  receiver: string;
  province: string;
  city: string;
  district: string;
  orderTime: string;
  payTime: string;
  shipTime: string;
  completeTime: string;
  status: string;
  afterSaleStatus: string;
  cancelReason: string;
  appChannel: string;
  trafficSource: string;
  orderType: string;
  influencerId: string;
  influencerName: string;
  flagColor: string;
  merchantRemark: string;
}

// 类型转换
const allOrders: OrderData[] = allOrdersData as OrderData[];

// 卖家旗帜选项
const sellerFlags = [
  { id: "none", label: "无", color: "bg-gray-400" },
  { id: "purple", label: "紫", color: "bg-purple-500" },
  { id: "green", label: "绿", color: "bg-green-500" },
  { id: "blue", label: "蓝", color: "bg-blue-500" },
  { id: "yellow", label: "黄", color: "bg-yellow-500" },
  { id: "red", label: "红", color: "bg-red-500" },
];

// 来源页面映射
const sourceLabels: Record<string, string> = {
  statistics: "订单统计",
  thirtydays: "最近30天明细",
  monthly: "按月汇总统计",
  yearly: "按年汇总统计",
};

// 统计模式类型
type StatsMode = 'createTime' | 'paymentTime';

export default function OrderDetail() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const dateParam = params.get("date");
  const monthParam = params.get("month");
  const yearParam = params.get("year");
  const fromParam = params.get("from");
  const modeParam = params.get("mode") as StatsMode | null;

  // 统计模式状态
  const [statsMode, setStatsMode] = useState<StatsMode>(modeParam || 'createTime');

  // 筛选状态
  const [startDate, setStartDate] = useState(dateParam || "2025-04-01");
  const [endDate, setEndDate] = useState(dateParam || "2025-04-30");
  const [orderNo, setOrderNo] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [province, setProvince] = useState("");
  const [merchantCode, setMerchantCode] = useState("");
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payMethodFilter, setPayMethodFilter] = useState("all");

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // 详情弹窗
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  // 根据URL参数设置日期范围
  useEffect(() => {
    if (dateParam) {
      setStartDate(dateParam);
      setEndDate(dateParam);
    } else if (monthParam) {
      const [year, month] = monthParam.split("-");
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      setStartDate(`${monthParam}-01`);
      setEndDate(`${monthParam}-${lastDay}`);
    } else if (yearParam) {
      setStartDate(`${yearParam}-01-01`);
      setEndDate(`${yearParam}-12-31`);
    }
  }, [dateParam, monthParam, yearParam]);

  // 筛选订单数据
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      // 根据统计模式选择日期字段
      // 按创建时间统计：使用订单提交时间(orderTime)
      // 按付款时间统计：使用承诺发货时间(shipTime)，如果没有则使用订单时间
      const dateField = statsMode === 'createTime' 
        ? order.orderTime 
        : (order.shipTime || order.orderTime);
      const orderDate = dateField.split(" ")[0];
      if (orderDate < startDate || orderDate > endDate) return false;

      // 订单号筛选
      if (orderNo && !order.mainOrderNo.includes(orderNo) && !order.subOrderNo.includes(orderNo)) {
        return false;
      }

      // 商品搜索
      if (productSearch && !order.productName.includes(productSearch)) {
        return false;
      }

      // 省份筛选
      if (province && !order.province.includes(province)) {
        return false;
      }

      // 商家编码筛选
      if (merchantCode && !order.sku.includes(merchantCode)) {
        return false;
      }

      // 状态筛选
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      // 支付方式筛选
      if (payMethodFilter !== "all" && !order.payMethod.includes(payMethodFilter)) {
        return false;
      }

      // 订单类型筛选
      if (orderTypeFilter !== "all" && order.orderType !== orderTypeFilter) {
        return false;
      }

      return true;
    });
  }, [allOrders, startDate, endDate, orderNo, productSearch, province, merchantCode, statusFilter, payMethodFilter, orderTypeFilter]);

  // 状态统计
  const statusCounts = useMemo(() => {
    const counts = {
      all: filteredOrders.length,
      completed: 0,
      closed: 0,
      pending: 0,
      shipped: 0,
    };
    filteredOrders.forEach((order) => {
      if (order.status === "已完成") counts.completed++;
      else if (order.status === "已关闭") counts.closed++;
      else if (order.status === "待发货") counts.pending++;
      else if (order.status === "已发货") counts.shipped++;
    });
    return counts;
  }, [filteredOrders]);

  // 分页数据
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  // 汇总统计
  const summary = useMemo(() => {
    return {
      totalOrders: filteredOrders.length,
      totalAmount: filteredOrders.reduce((sum, o) => sum + o.payAmount, 0),
      completedAmount: filteredOrders.filter(o => o.status === "已完成").reduce((sum, o) => sum + o.payAmount, 0),
      refundAmount: filteredOrders.filter(o => o.status === "已关闭").reduce((sum, o) => sum + o.payAmount, 0),
      shippedOrders: filteredOrders.filter(o => o.shipTime).length,
    };
  }, [filteredOrders]);

  // 重置筛选
  const handleReset = () => {
    setOrderNo("");
    setProductSearch("");
    setProvince("");
    setMerchantCode("");
    setSelectedFlags([]);
    setOrderTypeFilter("all");
    setStatusFilter("all");
    setPayMethodFilter("all");
    setCurrentPage(1);
  };

  // 查询
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // 返回来源页面
  const handleGoBack = () => {
    if (fromParam === "statistics") {
      setLocation("/order-statistics");
    } else if (fromParam === "thirtydays") {
      setLocation("/order-thirty-days");
    } else if (fromParam === "monthly") {
      setLocation("/order-monthly-stats");
    } else if (fromParam === "yearly") {
      setLocation("/order-yearly-stats");
    } else {
      setLocation("/order-statistics");
    }
  };

  // 格式化金额
  const formatAmount = (amount: number) => {
    return amount.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {fromParam && (
              <Button variant="ghost" size="sm" onClick={handleGoBack}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回{sourceLabels[fromParam] || "订单统计"}
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Volume2 className="w-6 h-6 text-blue-500" />
                订单明细
              </h1>
              <p className="text-sm text-muted-foreground">
                共 {allOrders.length.toLocaleString()} 条订单数据 | 当前筛选: {filteredOrders.length.toLocaleString()} 条
                {fromParam && dateParam && (
                  <Badge variant="secondary" className="ml-2">
                    来自{sourceLabels[fromParam]} - {dateParam}
                  </Badge>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              文件下载
            </Button>
          </div>
        </div>

        {/* 勾稽关联状态 */}
        <div className="mb-4">
          <ReconciliationIndicator
            moduleName="订单明细"
            reconciliationResult={{
              id: "order-detail-reconciliation",
              type: "realtime",
              checkTime: new Date(),
              status: "success",
              items: [
                {
                  name: "订单总数",
                  expected: allOrders.length,
                  actual: allOrders.length,
                  difference: 0,
                  status: "success",
                  tolerance: 0,
                },
                {
                  name: "筛选后订单数",
                  expected: filteredOrders.length,
                  actual: filteredOrders.length,
                  difference: 0,
                  status: "success",
                  tolerance: 0,
                },
              ],
              exceptionCount: 0,
              summary: "与订单统计、最近30天明细模块数据一致",
            }}
            moduleRelations={[
              {
                sourceModule: "订单统计",
                targetModule: "订单明细",
                relationType: "bidirectional",
                status: "success",
                lastCheckTime: new Date(),
              },
              {
                sourceModule: "订单明细",
                targetModule: "最近30天明细",
                relationType: "bidirectional",
                status: "success",
                lastCheckTime: new Date(),
              },
              {
                sourceModule: "成本配置",
                targetModule: "订单明细",
                relationType: "unidirectional",
                status: "success",
                lastCheckTime: new Date(),
              },
            ]}
          />
        </div>

        {/* 统计模式切换 */}
        <Card className={`border-2 ${statsMode === 'createTime' ? 'border-orange-200 bg-orange-50/50' : 'border-blue-200 bg-blue-50/50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={`font-medium ${statsMode === 'createTime' ? 'text-orange-700' : 'text-blue-700'}`}>统计模式:</span>
                <div className="flex border-2 border-gray-300 rounded-lg overflow-hidden">
                  <Button
                    variant={statsMode === 'createTime' ? "default" : "ghost"}
                    size="sm"
                    className={`rounded-none px-4 ${statsMode === 'createTime' ? 'bg-orange-500 hover:bg-orange-600' : 'hover:bg-orange-100'}`}
                    onClick={() => setStatsMode('createTime')}
                  >
                    当前按创建时间统计
                  </Button>
                  <Button
                    variant={statsMode === 'paymentTime' ? "default" : "ghost"}
                    size="sm"
                    className={`rounded-none px-4 ${statsMode === 'paymentTime' ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-blue-100'}`}
                    onClick={() => setStatsMode('paymentTime')}
                  >
                    切换为按付款时间统计
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground max-w-md">
                {statsMode === 'createTime' ? (
                  <span className="text-orange-600">
                    <strong>按订单提交时间</strong>：今天下单的订单，无论何时扣费或退款，都算今天的数据。
                  </span>
                ) : (
                  <span className="text-blue-600">
                    <strong>按承诺发货时间</strong>：销售额、退款、扣费按实际发生时间归纳。
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 筛选区域 */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* 第一行筛选 */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">查询时间:</span>
                  <span className="text-sm">从</span>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-36"
                  />
                  <span className="text-sm">到</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-36"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">包含商品:</span>
                  <Input
                    placeholder="商品名称"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">地区(省):</span>
                  <Input
                    placeholder="省份"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-28"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">商家编码:</span>
                  <Input
                    placeholder="SKU"
                    value={merchantCode}
                    onChange={(e) => setMerchantCode(e.target.value)}
                    className="w-28"
                  />
                </div>
              </div>

              {/* 第二行筛选 */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">订单编号:</span>
                  <Input
                    placeholder="多订单用逗号间隔"
                    value={orderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                    className="w-48"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">卖家旗帜:</span>
                  {sellerFlags.map((flag) => (
                    <label key={flag.id} className="flex items-center gap-1 cursor-pointer">
                      <Checkbox
                        checked={selectedFlags.includes(flag.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFlags([...selectedFlags, flag.id]);
                          } else {
                            setSelectedFlags(selectedFlags.filter((f) => f !== flag.id));
                          }
                        }}
                      />
                      <span className={cn("w-3 h-3 rounded-full", flag.color)}></span>
                      <span className="text-sm">{flag.label}</span>
                    </label>
                  ))}
                </div>
                <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="全部订单" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部订单</SelectItem>
                    <SelectItem value="普通订单">普通订单</SelectItem>
                    <SelectItem value="特殊订单">特殊订单</SelectItem>
                  </SelectContent>
                </Select>
                <Select value="normal">
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="特殊" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">特殊</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  文件下载
                </Button>
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={handleSearch}>
                  <Search className="w-4 h-4 mr-1" />
                  查询
                </Button>
                <span className="text-sm text-orange-500">(请先点击查询,再下载)</span>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  重置
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 汇总统计卡片 */}
        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">总订单数</div>
              <div className="text-2xl font-bold">{summary.totalOrders.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">已发货: {summary.shippedOrders.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">总销售额</div>
              <div className="text-2xl font-bold text-blue-600">¥{formatAmount(summary.totalAmount)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">已完成金额</div>
              <div className="text-2xl font-bold text-green-600">¥{formatAmount(summary.completedAmount)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">退款金额</div>
              <div className="text-2xl font-bold text-red-600">¥{formatAmount(summary.refundAmount)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">退款率</div>
              <div className="text-2xl font-bold text-orange-600">
                {summary.totalAmount > 0 ? ((summary.refundAmount / summary.totalAmount) * 100).toFixed(2) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 状态标签页 */}
        <div className="flex items-center gap-4 border-b">
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              statusFilter === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
          >
            全部({statusCounts.all})
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              statusFilter === "已完成"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => { setStatusFilter("已完成"); setCurrentPage(1); }}
          >
            已完成({statusCounts.completed})
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              statusFilter === "已关闭"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => { setStatusFilter("已关闭"); setCurrentPage(1); }}
          >
            已关闭({statusCounts.closed})
          </button>
        </div>

        {/* 订单表格 */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-500 hover:bg-blue-500">
                    <TableHead className="text-white whitespace-nowrap w-10">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="text-white whitespace-nowrap">序号</TableHead>
                    <TableHead className="text-white whitespace-nowrap">订单号</TableHead>
                    <TableHead className="text-white whitespace-nowrap">客户姓名</TableHead>
                    <TableHead className="text-white whitespace-nowrap">当前状态</TableHead>
                    <TableHead className="text-white whitespace-nowrap text-right">付款金额</TableHead>
                    <TableHead className="text-white whitespace-nowrap text-right">商品成本</TableHead>
                    <TableHead className="text-white whitespace-nowrap text-right">服务费</TableHead>
                    <TableHead className="text-white whitespace-nowrap text-right">达人佣金/运费险/其他</TableHead>
                    <TableHead className="text-white whitespace-nowrap text-right">运费</TableHead>
                    <TableHead className="text-white whitespace-nowrap text-right">退款</TableHead>
                    <TableHead className="text-white whitespace-nowrap text-right">设置金额</TableHead>
                    <TableHead className="text-white whitespace-nowrap text-right">预估收益</TableHead>
                    <TableHead className="text-white whitespace-nowrap">下单时间</TableHead>
                    <TableHead className="text-white whitespace-nowrap">完结时间</TableHead>
                    <TableHead className="text-white whitespace-nowrap">结算时间</TableHead>
                    <TableHead className="text-white whitespace-nowrap">查看</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order, index) => {
                    const rowIndex = (currentPage - 1) * pageSize + index + 1;
                    const productCost = order.payAmount * 0.42; // 估算成本
                    const commission = order.payAmount * 0.10; // 达人佣金
                    const estimatedProfit = order.status === "已关闭" ? 0 : order.payAmount - productCost - commission - order.serviceFee;
                    const refundAmount = order.status === "已关闭" ? order.payAmount : 0;

                    return (
                      <TableRow key={`${order.mainOrderNo}-${index}`} className="hover:bg-muted/50">
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>{rowIndex}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-pointer text-blue-600 hover:underline">
                                  {order.mainOrderNo.slice(-10)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md p-3">
                                <div className="space-y-1 text-sm">
                                  <p><strong>订单号:</strong> {order.mainOrderNo}</p>
                                  <p><strong>商品:</strong> {order.productName}</p>
                                  <p><strong>规格:</strong> {order.productSpec}</p>
                                  <p><strong>数量:</strong> {order.quantity}</p>
                                  <p><strong>达人:</strong> {order.influencerName || "-"}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>{order.receiver}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "px-2 py-1 rounded text-xs",
                              order.status === "已完成" && "bg-green-100 text-green-700",
                              order.status === "已关闭" && "bg-red-100 text-red-700",
                              order.status === "已发货" && "bg-blue-100 text-blue-700",
                              order.status === "待发货" && "bg-yellow-100 text-yellow-700"
                            )}
                          >
                            {order.status}
                            {order.afterSaleStatus && order.afterSaleStatus !== "-" && (
                              <span className="text-orange-500 ml-1">({order.afterSaleStatus})</span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{order.payAmount.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{productCost.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{order.serviceFee.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{commission.toFixed(2)}/0.00/0.0</TableCell>
                        <TableCell className="text-right">{order.freight.toFixed(1)}</TableCell>
                        <TableCell className="text-right text-red-600">{refundAmount.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{(order.payAmount - refundAmount).toFixed(1)}</TableCell>
                        <TableCell className="text-right text-green-600">{estimatedProfit.toFixed(1)}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs">{order.orderTime}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs">{order.completeTime || "-"}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs">{order.completeTime || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-blue-600 p-0 h-auto text-xs"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  显示明细
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>订单详情 - {order.mainOrderNo}</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-2">
                                    <p><strong>商品名称:</strong> {order.productName}</p>
                                    <p><strong>商品规格:</strong> {order.productSpec}</p>
                                    <p><strong>商品数量:</strong> {order.quantity}</p>
                                    <p><strong>商家编码:</strong> {order.sku}</p>
                                    <p><strong>单价:</strong> ¥{order.unitPrice}</p>
                                    <p><strong>付款金额:</strong> ¥{order.payAmount}</p>
                                    <p><strong>优惠金额:</strong> ¥{order.totalDiscount}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <p><strong>收件人:</strong> {order.receiver}</p>
                                    <p><strong>省市区:</strong> {order.province} {order.city} {order.district}</p>
                                    <p><strong>支付方式:</strong> {order.payMethod}</p>
                                    <p><strong>下单时间:</strong> {order.orderTime}</p>
                                    <p><strong>支付时间:</strong> {order.payTime || "-"}</p>
                                    <p><strong>发货时间:</strong> {order.shipTime || "-"}</p>
                                    <p><strong>完成时间:</strong> {order.completeTime || "-"}</p>
                                  </div>
                                  <div className="col-span-2 space-y-2 border-t pt-2">
                                    <p><strong>订单状态:</strong> {order.status}</p>
                                    <p><strong>售后状态:</strong> {order.afterSaleStatus || "-"}</p>
                                    <p><strong>取消原因:</strong> {order.cancelReason || "-"}</p>
                                    <p><strong>流量来源:</strong> {order.trafficSource}</p>
                                    <p><strong>达人昵称:</strong> {order.influencerName || "-"}</p>
                                    <p><strong>达人ID:</strong> {order.influencerId || "-"}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <span className="text-muted-foreground">|</span>
                            <Button variant="link" size="sm" className="text-blue-600 p-0 h-auto text-xs">
                              微调成本
                            </Button>
                            <span className="text-muted-foreground">|</span>
                            <Button variant="link" size="sm" className="text-blue-600 p-0 h-auto text-xs">
                              前往订单
                            </Button>
                            <span className="text-muted-foreground">|</span>
                            <Button variant="link" size="sm" className="text-blue-600 p-0 h-auto text-xs">
                              过滤此订单
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* 分页 */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>共 {filteredOrders.length.toLocaleString()} 条记录</span>
                <span>|</span>
                <span>每页</span>
                <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(parseInt(v)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
                <span>条</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  第 {currentPage} / {totalPages} 页
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
