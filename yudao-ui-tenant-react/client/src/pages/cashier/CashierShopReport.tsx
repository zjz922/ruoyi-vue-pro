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
  Store,
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useState } from "react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useShopReportList,
} from "@/hooks/useCashier";
import { toast } from "sonner";

// 店铺数据
const shopData = [
  {
    id: 1,
    name: "抖音旗舰店",
    platform: "抖音",
    income: 125000,
    expense: 45000,
    netProfit: 80000,
    orders: 1580,
    avgOrder: 79.11,
    growth: 12.5,
    status: "正常",
  },
  {
    id: 2,
    name: "快手专营店",
    platform: "快手",
    income: 85000,
    expense: 32000,
    netProfit: 53000,
    orders: 980,
    avgOrder: 86.73,
    growth: 8.3,
    status: "正常",
  },
  {
    id: 3,
    name: "淘宝官方店",
    platform: "淘宝",
    income: 65000,
    expense: 28000,
    netProfit: 37000,
    orders: 720,
    avgOrder: 90.28,
    growth: -2.1,
    status: "关注",
  },
  {
    id: 4,
    name: "拼多多旗舰店",
    platform: "拼多多",
    income: 45000,
    expense: 15000,
    netProfit: 30000,
    orders: 650,
    avgOrder: 69.23,
    growth: 15.8,
    status: "正常",
  },
];

// 店铺收入对比
const shopIncomeData = shopData.map(shop => ({
  name: shop.name,
  income: shop.income,
  expense: shop.expense,
}));

// 店铺收入占比
const shopIncomeShareData = shopData.map((shop, index) => ({
  name: shop.name,
  value: Math.round((shop.income / shopData.reduce((sum, s) => sum + s.income, 0)) * 100),
  color: ["#1890ff", "#52c41a", "#faad14", "#722ed1"][index],
}));

// 店铺趋势数据
const shopTrendData = [
  { month: "10月", shop1: 98000, shop2: 72000, shop3: 58000, shop4: 35000 },
  { month: "11月", shop1: 105000, shop2: 78000, shop3: 62000, shop4: 38000 },
  { month: "12月", shop1: 118000, shop2: 82000, shop3: 68000, shop4: 42000 },
  { month: "1月", shop1: 125000, shop2: 85000, shop3: 65000, shop4: 45000 },
];

export default function CashierShopReport() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [period, setPeriod] = useState("month");
  
  // 计算日期范围
  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    };
  };
  
  const dateRange = getDateRange();
  
  // API调用
  const { data: shopReportData, isLoading, refetch } = useShopReportList({
    shopId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
  // 导出报表
  const handleExport = () => {
    toast.info("导出功能待Java后端实现");
  };
  
  // 使用API数据或静态数据
  const apiData = shopReportData as { shops?: typeof shopData } | undefined;
  const displayShops = apiData?.shops || shopData;
  
  const totalIncome = displayShops.reduce((sum, shop) => sum + shop.income, 0);
  const totalExpense = displayShops.reduce((sum, shop) => sum + shop.expense, 0);
  const totalOrders = displayShops.reduce((sum, shop) => sum + shop.orders, 0);

  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">店铺统计</h1>
          <p className="text-sm text-gray-500 mt-1">
            各店铺财务数据汇总分析
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            导出报表
          </Button>
        </div>
      </div>

      {/* 汇总卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Store className="w-4 h-4" />
              店铺总数
            </div>
            <div className="text-2xl font-bold text-gray-900">{displayShops.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              活跃 {displayShops.filter(s => s.status === "正常").length} 个
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <ArrowDownRight className="w-4 h-4" />
              总收入
            </div>
            <div className="text-2xl font-bold text-green-600">
              ¥{totalIncome.toLocaleString()}
            </div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              环比 +10.5%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <ArrowUpRight className="w-4 h-4" />
              总支出
            </div>
            <div className="text-2xl font-bold text-red-600">
              ¥{totalExpense.toLocaleString()}
            </div>
            <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              环比 +5.2%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <ShoppingCart className="w-4 h-4" />
              总订单数
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalOrders.toLocaleString()}
            </div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              环比 +8.7%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">各店铺收支对比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shopIncomeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#8c8c8c" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#8c8c8c" fontSize={12} width={100} />
                  <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="income" name="收入" fill="#52c41a" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="expense" name="支出" fill="#ff4d4f" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">店铺收入占比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shopIncomeShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {shopIncomeShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 店铺趋势 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">店铺收入趋势（近4月）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={shopTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#8c8c8c" fontSize={12} />
                <YAxis stroke="#8c8c8c" fontSize={12} />
                <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="shop1" name="抖音旗舰店" stroke="#1890ff" strokeWidth={2} />
                <Line type="monotone" dataKey="shop2" name="快手专营店" stroke="#52c41a" strokeWidth={2} />
                <Line type="monotone" dataKey="shop3" name="淘宝官方店" stroke="#faad14" strokeWidth={2} />
                <Line type="monotone" dataKey="shop4" name="拼多多旗舰店" stroke="#722ed1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 店铺明细表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">店铺财务明细</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>店铺名称</TableHead>
                <TableHead>平台</TableHead>
                <TableHead className="text-right">收入</TableHead>
                <TableHead className="text-right">支出</TableHead>
                <TableHead className="text-right">净利润</TableHead>
                <TableHead className="text-right">订单数</TableHead>
                <TableHead className="text-right">客单价</TableHead>
                <TableHead className="text-right">环比增长</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shopData.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{shop.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{shop.platform}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    ¥{shop.income.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    ¥{shop.expense.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ¥{shop.netProfit.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {shop.orders.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ¥{shop.avgOrder.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`flex items-center justify-end gap-1 ${
                      shop.growth >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {shop.growth >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {shop.growth >= 0 ? "+" : ""}{shop.growth}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className={
                        shop.status === "正常"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {shop.status}
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
