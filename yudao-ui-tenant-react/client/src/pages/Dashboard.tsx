import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  CreditCard, 
  Percent, 
  Activity,
  MoreHorizontal,
  Calendar,
  Wallet,
  AlertTriangle,
  TrendingUp,
  Package,
  Users,
  ShoppingCart
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { shopInfo, summaryData, dailyStats, influencerStats, payMethodCounts, provinceCounts } from "@/data/realOrderData";

// 使用真实数据生成趋势图数据
const trendData = dailyStats.slice(0, 14).map(item => ({
  date: item.date.substring(5), // 只显示月-日
  sales: item.salesAmount,
  profit: item.completedAmount - (item.completedOrders * 12.5) - (item.completedAmount * 0.1) - (item.completedAmount * 0.01) - (item.completedOrders * 3.2) - (item.salesAmount * 0.30),
})).reverse();

// 达人排行数据
const influencerRanking = influencerStats.slice(0, 5).map(item => ({
  name: item.name.length > 8 ? item.name.substring(0, 8) + '...' : item.name,
  profit: item.amount * 0.15, // 假设利润率15%
  rate: 15,
  orders: item.orders,
  amount: item.amount,
}));

// 支付方式分布
const payMethodData = Object.entries(payMethodCounts)
  .filter(([key]) => key !== '-')
  .map(([name, value]) => ({ name, value }));

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// 省份分布TOP5
const provinceData = Object.entries(provinceCounts)
  .slice(0, 5)
  .map(([name, value]) => ({ name: name.replace('省', '').replace('市', ''), value }));

export default function Dashboard() {
  // 计算今日数据（使用最新一天的数据）
  const todayData = dailyStats[0];
  const yesterdayData = dailyStats[1];
  
  const todaySales = todayData.salesAmount;
  const yesterdaySales = yesterdayData.salesAmount;
  const salesGrowth = ((todaySales - yesterdaySales) / yesterdaySales * 100);
  
  // 计算今日利润
  const todayProfit = todayData.completedAmount - (todayData.completedOrders * 12.5) - (todayData.completedAmount * 0.1) - (todayData.completedAmount * 0.01) - (todayData.completedOrders * 3.2) - (todayData.salesAmount * 0.30);
  const yesterdayProfit = yesterdayData.completedAmount - (yesterdayData.completedOrders * 12.5) - (yesterdayData.completedAmount * 0.1) - (yesterdayData.completedAmount * 0.01) - (yesterdayData.completedOrders * 3.2) - (yesterdayData.salesAmount * 0.30);
  const profitGrowth = ((todayProfit - yesterdayProfit) / Math.abs(yesterdayProfit) * 100);
  
  // 利润率
  const todayProfitRate = todayData.completedAmount > 0 ? (todayProfit / todayData.completedAmount * 100) : 0;
  const yesterdayProfitRate = yesterdayData.completedAmount > 0 ? (yesterdayProfit / yesterdayData.completedAmount * 100) : 0;
  const profitRateChange = todayProfitRate - yesterdayProfitRate;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">工作台</h1>
          <p className="text-muted-foreground">下午好！这是{shopInfo.name}的经营概况。</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Calendar className="w-4 h-4" />
            <span>{shopInfo.dateRange.start} ~ {shopInfo.dateRange.end}</span>
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            下载日报
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">当日销售额</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{todaySales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className={`flex items-center font-medium ${salesGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
                {salesGrowth >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {salesGrowth >= 0 ? '+' : ''}{salesGrowth.toFixed(1)}%
              </span>
              <span className="ml-1">较前日</span>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">当日净利润</CardTitle>
            <Wallet className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{todayProfit.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className={`flex items-center font-medium ${profitGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
                {profitGrowth >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {profitGrowth >= 0 ? '+' : ''}{profitGrowth.toFixed(1)}%
              </span>
              <span className="ml-1">较前日</span>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-chart-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">当日利润率</CardTitle>
            <Percent className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayProfitRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className={`flex items-center font-medium ${profitRateChange >= 0 ? 'text-success' : 'text-danger'}`}>
                {profitRateChange >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {profitRateChange >= 0 ? '+' : ''}{profitRateChange.toFixed(1)}%
              </span>
              <span className="ml-1">较前日</span>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">月度累计销售</CardTitle>
            <CreditCard className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{(summaryData.totalSalesAmount / 10000).toFixed(2)}万</div>
            <p className="text-xs text-muted-foreground mt-1">
              已完成: ¥{(summaryData.completedAmount / 10000).toFixed(2)}万
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 第二行统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">月度订单数</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              已完成: {summaryData.completedOrders.toLocaleString()} 单
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">退款金额</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">¥{(summaryData.refundAmount / 10000).toFixed(2)}万</div>
            <p className="text-xs text-muted-foreground mt-1">
              退款率: {summaryData.refundRatio.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">客单价</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{summaryData.avgOrderAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              优惠总额: ¥{summaryData.totalDiscount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">完成率</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(summaryData.completedOrders / summaryData.totalOrders * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              已关闭: {summaryData.closedOrders.toLocaleString()} 单
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>经营趋势</CardTitle>
                <CardDescription>近14天销售额与净利润趋势分析</CardDescription>
              </div>
              <Tabs defaultValue="sales" className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sales">销售</TabsTrigger>
                  <TabsTrigger value="profit">利润</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--muted-foreground)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `¥${(value/10000).toFixed(0)}万`} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--popover)', 
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: 'var(--popover-foreground)' }}
                    formatter={(value: number) => `¥${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    name="销售额"
                    stroke="var(--primary)" 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    name="净利润"
                    stroke="var(--success)" 
                    fillOpacity={1} 
                    fill="url(#colorProfit)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>达人销售排行</CardTitle>
                <CardDescription>本月TOP5达人销售贡献</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {influencerRanking.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.orders}单</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">¥{item.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">预估利润 ¥{item.profit.toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 第三行图表 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>支付方式分布</CardTitle>
            <CardDescription>本月各支付方式订单占比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={payMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {payMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} 单`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>省份分布TOP5</CardTitle>
            <CardDescription>本月订单量最多的省份</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={provinceData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" tickFormatter={(v) => `${v}`} />
                  <YAxis type="category" dataKey="name" width={60} />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} 单`} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快捷操作 */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>快捷操作</CardTitle>
          <CardDescription>常用功能入口</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <ShoppingCart className="w-6 h-6" />
              <span>订单统计</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <DollarSign className="w-6 h-6" />
              <span>财务核算</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              <span>费用中心</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Package className="w-6 h-6" />
              <span>库存管理</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="w-6 h-6" />
              <span>达人管理</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Activity className="w-6 h-6" />
              <span>数据报表</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
