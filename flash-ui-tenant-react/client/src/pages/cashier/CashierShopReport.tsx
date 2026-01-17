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
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
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
import { useState, useMemo, useCallback } from "react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useShopReportList,
} from "@/hooks/useCashier";
import { toast } from "sonner";

// ============ 类型定义 ============

interface ShopData {
  id: number;
  name: string;
  platform: string;
  income: number;
  expense: number;
  netProfit: number;
  orders: number;
  avgOrder: number;
  growth: number;
  status: string;
}

interface ShopReportApiData {
  shops?: ShopData[];
  trendData?: Array<{ month: string; [key: string]: string | number }>;
  stats?: {
    totalIncomeChange: number;
    totalExpenseChange: number;
    totalOrdersChange: number;
  };
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
const COLORS = ["#1890ff", "#52c41a", "#faad14", "#722ed1", "#ff4d4f", "#13c2c2"];

export default function CashierShopReport() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [period, setPeriod] = useState("month");
  
  // 计算日期范围
  const getDateRange = useCallback(() => {
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
  }, [period]);
  
  const dateRange = useMemo(() => getDateRange(), [getDateRange]);
  
  // API调用
  const { data: shopReportApiData, isLoading, error } = useShopReportList({
    shopId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
  
  // 类型断言
  const typedApiData = shopReportApiData as ShopReportApiData | undefined;
  
  // 从API响应中提取数据
  const displayShops = useMemo(() => {
    return typedApiData?.shops || [];
  }, [typedApiData]);

  const trendData = useMemo(() => {
    return typedApiData?.trendData || [];
  }, [typedApiData]);

  const stats = useMemo(() => {
    return typedApiData?.stats || {
      totalIncomeChange: 0,
      totalExpenseChange: 0,
      totalOrdersChange: 0,
    };
  }, [typedApiData]);

  // 计算汇总数据
  const totalIncome = useMemo(() => {
    return displayShops.reduce((sum, shop) => sum + shop.income, 0);
  }, [displayShops]);

  const totalExpense = useMemo(() => {
    return displayShops.reduce((sum, shop) => sum + shop.expense, 0);
  }, [displayShops]);

  const totalOrders = useMemo(() => {
    return displayShops.reduce((sum, shop) => sum + shop.orders, 0);
  }, [displayShops]);

  // 店铺收入对比数据
  const shopIncomeData = useMemo(() => {
    return displayShops.map(shop => ({
      name: shop.name,
      income: shop.income,
      expense: shop.expense,
    }));
  }, [displayShops]);

  // 店铺收入占比数据
  const shopIncomeShareData = useMemo(() => {
    if (totalIncome === 0) return [];
    return displayShops.map((shop, index) => ({
      name: shop.name,
      value: Math.round((shop.income / totalIncome) * 100),
      color: COLORS[index % COLORS.length],
    }));
  }, [displayShops, totalIncome]);

  // 检查是否有数据
  const hasData = displayShops.length > 0;

  // 导出报表
  const handleExport = useCallback(() => {
    toast.info("导出功能待Java后端实现");
  }, []);

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

      {/* 加载状态 */}
      {isLoading && <LoadingState />}

      {/* 错误状态 */}
      {error && !isLoading && (
        <EmptyState message="数据加载失败，请检查网络连接" icon={AlertCircle} />
      )}

      {/* 有数据时显示内容 */}
      {!isLoading && !error && (
        <>
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
                <div className={`text-xs mt-1 flex items-center gap-1 ${stats.totalIncomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.totalIncomeChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  环比 {stats.totalIncomeChange >= 0 ? '+' : ''}{stats.totalIncomeChange}%
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
                <div className={`text-xs mt-1 flex items-center gap-1 ${stats.totalExpenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.totalExpenseChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  环比 {stats.totalExpenseChange >= 0 ? '+' : ''}{stats.totalExpenseChange}%
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
                <div className={`text-xs mt-1 flex items-center gap-1 ${stats.totalOrdersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.totalOrdersChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  环比 {stats.totalOrdersChange >= 0 ? '+' : ''}{stats.totalOrdersChange}%
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
                  {shopIncomeData.length > 0 ? (
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
                  ) : (
                    <EmptyState message="暂无店铺收支数据" icon={BarChart3} />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">店铺收入占比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  {shopIncomeShareData.length > 0 ? (
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
                  ) : (
                    <EmptyState message="暂无店铺占比数据" icon={PieChartIcon} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 店铺趋势 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">店铺收入趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#8c8c8c" fontSize={12} />
                      <YAxis stroke="#8c8c8c" fontSize={12} />
                      <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                      <Legend />
                      {displayShops.map((shop, index) => (
                        <Line
                          key={shop.id}
                          type="monotone"
                          dataKey={`shop${shop.id}`}
                          name={shop.name}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="暂无趋势数据" icon={BarChart3} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* 店铺明细表 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">店铺明细</CardTitle>
            </CardHeader>
            <CardContent>
              {displayShops.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>店铺名称</TableHead>
                      <TableHead>平台</TableHead>
                      <TableHead className="text-right">收入</TableHead>
                      <TableHead className="text-right">支出</TableHead>
                      <TableHead className="text-right">净利润</TableHead>
                      <TableHead className="text-center">订单数</TableHead>
                      <TableHead className="text-right">客单价</TableHead>
                      <TableHead className="text-center">增长率</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayShops.map((shop) => (
                      <TableRow key={shop.id}>
                        <TableCell className="font-medium">{shop.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{shop.platform}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          ¥{shop.income.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          ¥{shop.expense.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ¥{shop.netProfit.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">{shop.orders}</TableCell>
                        <TableCell className="text-right">¥{shop.avgOrder.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <span className={shop.growth >= 0 ? "text-green-600" : "text-red-600"}>
                            {shop.growth >= 0 ? "+" : ""}{shop.growth}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
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
              ) : (
                <EmptyState message="暂无店铺数据" icon={Store} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AppLayout>
  );
}
