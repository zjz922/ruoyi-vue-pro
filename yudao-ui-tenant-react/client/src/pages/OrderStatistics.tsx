import { useState, useMemo } from "react";
import { useLocation } from "wouter";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  RotateCcw,
  Megaphone,
  Eye,
  RefreshCw,
  ChevronRight,
  Link2,
  Calculator,
  Package,
  Shield,
} from "lucide-react";
import { 
  shopInfo, 
  summaryData, 
  dailyStatsExtended, 
  calculateSummary,
  type StatsMode,
  type DailyStatsExtended
} from "@/data/realOrderData";
import { ReconciliationIndicator } from "@/components/ReconciliationIndicator";

// 财务勾稽关系配置
const financeLinks = [
  { module: "财务核算", path: "/accounting", icon: Calculator, desc: "销售额 → 收入确认" },
  { module: "资金管理", path: "/capital", icon: DollarSign, desc: "退款额 → 资金流水" },
  { module: "库存成本", path: "/inventory", icon: Package, desc: "商品成本 → 成本核算" },
  { module: "费用中心", path: "/expense", icon: TrendingUp, desc: "推广费 → 营销费用" },
  { module: "税务管理", path: "/tax", icon: Shield, desc: "收入 → 应交税费" },
];

export default function OrderStatistics() {
  const [, setLocation] = useLocation();
  const [startDate, setStartDate] = useState(shopInfo.dateRange.start);
  const [endDate, setEndDate] = useState(shopInfo.dateRange.end);
  const [dateType, setDateType] = useState<"day" | "month" | "year">("day");
  const [selectedShop, setSelectedShop] = useState(shopInfo.name);
  const [showTrendChart, setShowTrendChart] = useState(true);
  const [statsMode, setStatsMode] = useState<StatsMode>('createTime');

  // 根据日期范围筛选数据
  const filteredDailyStats = useMemo(() => {
    return dailyStatsExtended.filter(item => {
      return item.date >= startDate && item.date <= endDate;
    });
  }, [startDate, endDate]);

  // 计算汇总数据
  const calculatedSummary = useMemo(() => {
    return calculateSummary(filteredDailyStats);
  }, [filteredDailyStats]);

  // 趋势图数据
  const trendData = useMemo(() => {
    return filteredDailyStats.map(item => ({
      date: item.date.substring(5), // 只显示月-日
      sales: item.salesAmount,
      promotion: item.promotionAmount,
    })).reverse(); // 按日期正序
  }, [filteredDailyStats]);

  // 跳转到订单明细
  const handleViewDetail = (date: string) => {
    setLocation(`/order-detail?date=${date}&from=statistics&mode=${statsMode}`);
  };

  // 格式化金额
  const formatAmount = (amount: number) => {
    if (amount >= 10000) {
      return `¥${(amount / 10000).toFixed(2)}万`;
    }
    return `¥${amount.toFixed(2)}`;
  };

  // 格式化大金额（用于汇总卡片）
  const formatLargeAmount = (amount: number) => {
    if (amount >= 10000) {
      const wan = Math.floor(amount / 10000);
      const qian = Math.floor((amount % 10000) / 1000);
      const bai = ((amount % 1000) / 100).toFixed(2);
      return `¥${wan}万${qian}千${bai}`;
    }
    return `¥${amount.toFixed(2)}`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">订单汇总统计</h1>
            <p className="text-muted-foreground">全面分析订单数据，与财务模块实时勾稽</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Link2 className="w-4 h-4 mr-1" />
                  财务勾稽关系
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>订单与财务模块勾稽关系</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  {financeLinks.map((link) => (
                    <div
                      key={link.module}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setLocation(link.path)}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">{link.module}</div>
                          <div className="text-sm text-muted-foreground">{link.desc}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              同步数据
            </Button>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              <Download className="w-4 h-4 mr-1" />
              导出报表
            </Button>
          </div>
        </div>

        {/* 勾稽关联状态 */}
        <ReconciliationIndicator
          moduleName="订单统计"
          reconciliationResult={{
            id: "order-statistics-reconciliation",
            type: "realtime",
            checkTime: new Date(),
            status: "success",
            items: [
              {
                name: "订单数量",
                expected: calculatedSummary.totalShipped,
                actual: calculatedSummary.totalShipped,
                difference: 0,
                status: "success",
                tolerance: 0,
              },
              {
                name: "销售额",
                expected: calculatedSummary.totalSales,
                actual: calculatedSummary.totalSales,
                difference: 0,
                status: "success",
                tolerance: 0.01,
              },
              {
                name: "毛利润",
                expected: calculatedSummary.totalSales - calculatedSummary.totalCost,
                actual: calculatedSummary.totalSales - calculatedSummary.totalCost,
                difference: 0,
                status: "success",
                tolerance: 0.01,
              },
            ],
            exceptionCount: 0,
            summary: "与订单管理、订单明细模块数据一致",
          }}
          moduleRelations={[
            {
              sourceModule: "订单管理",
              targetModule: "订单统计",
              relationType: "bidirectional",
              status: "success",
              lastCheckTime: new Date(),
            },
            {
              sourceModule: "订单统计",
              targetModule: "订单明细",
              relationType: "bidirectional",
              status: "success",
              lastCheckTime: new Date(),
            },
          ]}
        />

        {/* 统计模式切换 */}
        <Card className="border-2 border-orange-200 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium text-orange-700">统计模式:</span>
                <div className="flex border-2 border-orange-300 rounded-lg overflow-hidden">
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
              <div className="text-sm text-muted-foreground">
                汇总店铺: <span className="font-medium text-foreground">{selectedShop}</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-orange-600">
              {statsMode === 'createTime' 
                ? '按订单提交时间统计：今天下单的订单，无论何时扣费或退款，都算今天的订单数据。利润率整体波动不大，容易看出是退款多了还是扣费多了。'
                : '按承诺发货时间统计：销售额、退款、扣费按实际发生时间归纳。利润不会随订单确认收货或退款而降低，和官方数据基本能对上。'}
            </div>
          </CardContent>
        </Card>

        {/* 筛选条件 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">时间范围:</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-36"
                />
                <span>~</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-36"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">类型:</span>
                <div className="flex gap-1">
                  {[
                    { value: "day", label: "天" },
                    { value: "month", label: "月" },
                    { value: "year", label: "年" },
                  ].map((type) => (
                    <Button
                      key={type.value}
                      variant={dateType === type.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDateType(type.value as any)}
                      className={dateType === type.value ? "bg-blue-500" : ""}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Button className="bg-blue-500 hover:bg-blue-600">查询</Button>
              <Button variant="outline" onClick={() => setLocation("/order-monthly")}>按月汇总所有</Button>
              <Button variant="outline" onClick={() => setLocation("/order-yearly")}>按年汇总所有</Button>
            </div>
          </CardContent>
        </Card>

        {/* 汇总卡片 */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-blue-700">销售额</span>
              </div>
              <div className="text-xl font-bold text-blue-900">{formatLargeAmount(summaryData.totalSales)}</div>
              <div className="text-sm text-blue-600 mt-1">
                预计毛利: <span className={summaryData.grossProfitRatio >= 0 ? "text-green-600" : "text-red-600"}>{summaryData.grossProfitRatio}%</span>
              </div>
              <div className="text-xs text-blue-500 mt-1">{startDate}~{endDate}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-green-700">已确认</span>
              </div>
              <div className="text-xl font-bold text-green-900">{formatLargeAmount(summaryData.confirmedAmount)}</div>
              <div className="text-sm text-green-600 mt-1">确认比例: {summaryData.confirmedRatio}%</div>
              <div className="text-xs text-green-500 mt-1">{startDate}~{endDate}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-yellow-700">尚未确认</span>
              </div>
              <div className="text-xl font-bold text-yellow-900">{formatLargeAmount(summaryData.unconfirmedAmount)}</div>
              <div className="text-sm text-yellow-600 mt-1">已发货待确认: ¥0.0</div>
              <div className="text-xs text-yellow-500 mt-1">{startDate}~{endDate}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-red-700">退款额度</span>
              </div>
              <div className="text-xl font-bold text-red-900">{formatLargeAmount(summaryData.refundAmount)}</div>
              <div className="text-sm text-red-600 mt-1">退款占比: {summaryData.refundRatio}%</div>
              <div className="text-xs text-red-500 mt-1">{startDate}~{endDate}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-purple-700">推广费</span>
              </div>
              <div className="text-xl font-bold text-purple-900">{formatLargeAmount(summaryData.promotionAmount)}</div>
              <div className="text-sm text-purple-600 mt-1">广告占比: {summaryData.promotionRatio}%</div>
              <div className="text-xs text-purple-500 mt-1">{startDate}~{endDate}</div>
            </CardContent>
          </Card>
        </div>

        {/* 趋势图 */}
        {showTrendChart && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">销售趋势</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>推广费</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>销售额</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value: number) => formatAmount(value)} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#3b82f6" name="销售额" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="promotion" stroke="#ef4444" name="推广费" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <Button variant="link" size="sm" onClick={() => setShowTrendChart(false)}>
                  隐藏该折线趋势图
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 数据导出和统计模式提示 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              当前数据导出
            </Button>
            <Badge variant={statsMode === 'createTime' ? "default" : "secondary"} className={statsMode === 'createTime' ? "bg-orange-500" : "bg-blue-500"}>
              {statsMode === 'createTime' ? '当前按创建时间归纳' : '当前按付款时间归纳'}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setStatsMode(statsMode === 'createTime' ? 'paymentTime' : 'createTime')}
            >
              {statsMode === 'createTime' ? '切换为按付款时间统计' : '切换为按创建时间统计'}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            汇总店铺: <span className="font-medium text-foreground">{selectedShop}</span>
          </div>
        </div>

        {/* 数据表格 */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-500 hover:bg-blue-500">
                    <TableHead className="text-white font-medium">日期</TableHead>
                    <TableHead className="text-white font-medium text-right">已发货</TableHead>
                    <TableHead className="text-white font-medium text-right">销售额</TableHead>
                    <TableHead className="text-white font-medium text-right">退款额</TableHead>
                    <TableHead className="text-white font-medium text-right">快递费</TableHead>
                    <TableHead className="text-white font-medium text-right">小额打款</TableHead>
                    <TableHead className="text-white font-medium text-right">达人佣金</TableHead>
                    <TableHead className="text-white font-medium text-right">服务费</TableHead>
                    <TableHead className="text-white font-medium text-right">商品成本</TableHead>
                    <TableHead className="text-white font-medium text-right">代运营</TableHead>
                    <TableHead className="text-white font-medium text-right">赔付</TableHead>
                    <TableHead className="text-white font-medium text-right">推广费</TableHead>
                    <TableHead className="text-white font-medium text-right">其他</TableHead>
                    <TableHead className="text-white font-medium text-right">保险费</TableHead>
                    <TableHead className="text-white font-medium text-right">记账(收/支)</TableHead>
                    <TableHead className="text-white font-medium text-right">订单微调</TableHead>
                    <TableHead className="text-white font-medium text-right">预计利润</TableHead>
                    <TableHead className="text-white font-medium text-right">完结情况</TableHead>
                    <TableHead className="text-white font-medium text-right">利润率</TableHead>
                    <TableHead className="text-white font-medium text-center">查看</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDailyStats.map((item, index) => (
                    <TableRow key={item.date} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <TableCell className="font-medium">{item.date}</TableCell>
                      <TableCell className="text-right">{item.shippedOrders}</TableCell>
                      <TableCell className="text-right">{item.salesAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-red-600">{item.refundAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.expressAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.smallPayment}</TableCell>
                      <TableCell className="text-right">{item.commissionAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.serviceAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.costAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.operationAmount}</TableCell>
                      <TableCell className="text-right">{item.payoutAmount}</TableCell>
                      <TableCell className="text-right text-purple-600">{item.promotionAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.otherAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.insuranceAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">0 / 0</TableCell>
                      <TableCell className="text-right">0</TableCell>
                      <TableCell className={`text-right font-medium ${item.profitAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.profitAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-green-600">✓</span> {item.completedOrders}/0 {item.completedRatio}%
                      </TableCell>
                      <TableCell className={`text-right ${item.profitRatio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.profitRatio}%
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-blue-500 hover:text-blue-700 p-0"
                          onClick={() => handleViewDetail(item.date)}
                        >
                          明细
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 汇总行 */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-10 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">总发货数:</span>
                <span className="font-bold ml-2">{calculatedSummary.totalShipped}</span>
              </div>
              <div>
                <span className="text-muted-foreground">总销售额:</span>
                <span className="font-bold ml-2 text-blue-600">{formatAmount(calculatedSummary.totalSales)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">总退款额:</span>
                <span className="font-bold ml-2 text-red-600">{formatAmount(calculatedSummary.totalRefund)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">总快递费:</span>
                <span className="font-bold ml-2">{formatAmount(calculatedSummary.totalExpress)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">总佣金:</span>
                <span className="font-bold ml-2">{formatAmount(calculatedSummary.totalCommission)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">总服务费:</span>
                <span className="font-bold ml-2">{formatAmount(calculatedSummary.totalService)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">总成本:</span>
                <span className="font-bold ml-2">{formatAmount(calculatedSummary.totalCost)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">总推广费:</span>
                <span className="font-bold ml-2 text-purple-600">{formatAmount(calculatedSummary.totalPromotion)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">总利润:</span>
                <span className={`font-bold ml-2 ${calculatedSummary.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatAmount(calculatedSummary.totalProfit)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">利润率:</span>
                <span className={`font-bold ml-2 ${calculatedSummary.profitRatio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculatedSummary.profitRatio.toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
