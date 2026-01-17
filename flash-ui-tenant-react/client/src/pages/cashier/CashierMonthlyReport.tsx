import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Printer,
  Wallet,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  AlertTriangle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useState, useMemo, useCallback } from "react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useMonthlyReportDetail,
  useMonthlyReportGenerate,
  useMonthlyReportExport,
} from "@/hooks/useCashier";
import { toast } from "sonner";

// ============ 类型定义 ============

interface MonthlyReportApiData {
  stats?: {
    monthlyIncome: number;
    monthlyExpense: number;
    netInflow: number;
    endBalance: number;
    incomeChange: number;
    expenseChange: number;
    netInflowChange: number;
    balanceChange: number;
  };
  trendData?: Array<{ day: string; income: number; expense: number; balance: number }>;
  incomeStructure?: Array<{ name: string; value: number; color: string }>;
  expenseStructure?: Array<{ name: string; value: number; color: string }>;
  channelData?: Array<{ channel: string; income: number; expense: number }>;
  diffReasonData?: Array<{ reason: string; count: number; amount: number }>;
  forecastData?: Array<{ item: string; amount: number; confidence: string; factors: string; suggestion: string }>;
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

export default function CashierMonthlyReport() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().substring(0, 7));
  
  // API调用
  const { data: reportApiData, isLoading, error, refetch } = useMonthlyReportDetail(shopId, reportMonth);
  const generateMutation = useMonthlyReportGenerate();
  const exportMutation = useMonthlyReportExport();
  
  // 类型断言
  const typedApiData = reportApiData as MonthlyReportApiData | undefined;
  
  // 从API响应中提取数据
  const stats = useMemo(() => {
    if (typedApiData?.stats) {
      return typedApiData.stats;
    }
    return {
      monthlyIncome: 0,
      monthlyExpense: 0,
      netInflow: 0,
      endBalance: 0,
      incomeChange: 0,
      expenseChange: 0,
      netInflowChange: 0,
      balanceChange: 0,
    };
  }, [typedApiData]);

  const trendData = useMemo(() => {
    return typedApiData?.trendData || [];
  }, [typedApiData]);

  const incomeStructure = useMemo(() => {
    return typedApiData?.incomeStructure || [];
  }, [typedApiData]);

  const expenseStructure = useMemo(() => {
    return typedApiData?.expenseStructure || [];
  }, [typedApiData]);

  const channelData = useMemo(() => {
    return typedApiData?.channelData || [];
  }, [typedApiData]);

  const diffReasonData = useMemo(() => {
    return typedApiData?.diffReasonData || [];
  }, [typedApiData]);

  const forecastData = useMemo(() => {
    return typedApiData?.forecastData || [];
  }, [typedApiData]);

  // 检查是否有数据
  const hasData = trendData.length > 0 || incomeStructure.length > 0;
  
  // 上一月
  const handlePrevMonth = useCallback(() => {
    const [year, month] = reportMonth.split('-').map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    setReportMonth(`${prevYear}-${String(prevMonth).padStart(2, '0')}`);
  }, [reportMonth]);
  
  // 下一月
  const handleNextMonth = useCallback(() => {
    const [year, month] = reportMonth.split('-').map(Number);
    const currentMonth = new Date().toISOString().substring(0, 7);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const nextMonthStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
    if (nextMonthStr <= currentMonth) {
      setReportMonth(nextMonthStr);
    } else {
      toast.error("不能查看未来月份的报告");
    }
  }, [reportMonth]);
  
  // 生成月报
  const handleGenerate = useCallback(() => {
    generateMutation.mutate({
      shopId,
      month: reportMonth,
    }, {
      onSuccess: () => refetch(),
    });
  }, [generateMutation, shopId, reportMonth, refetch]);
  
  // 导出
  const handleExport = useCallback(() => {
    const [year] = reportMonth.split('-').map(Number);
    exportMutation.mutate({
      shopId,
      year,
      format: 'excel',
    });
  }, [exportMutation, shopId, reportMonth]);
  
  // 打印
  const handlePrint = useCallback(() => {
    window.print();
  }, []);
  
  // 快捷选择
  const handleQuickSelect = useCallback((offset: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - offset);
    setReportMonth(date.toISOString().substring(0, 7));
  }, []);

  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">资金月报</h1>
          <p className="text-sm text-gray-500 mt-1">
            月度资金流动汇总分析报告
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            打印
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            <Download className="w-4 h-4" />
            {exportMutation.isPending ? '导出中...' : '导出'}
          </Button>
          <Button 
            className="gap-2"
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
          >
            <FileText className="w-4 h-4" />
            {generateMutation.isPending ? '生成中...' : '生成月报'}
          </Button>
        </div>
      </div>

      {/* 月份选择器 */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-gray-500" />
              <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Input
                type="month"
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                className="w-40"
              />
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleQuickSelect(0)}>本月</Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickSelect(1)}>上月</Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickSelect(2)}>上上月</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 加载状态 */}
      {isLoading && <LoadingState />}

      {/* 错误状态 */}
      {error && !isLoading && (
        <EmptyState message="数据加载失败，请检查网络连接" icon={AlertCircle} />
      )}

      {/* 有数据时显示内容 */}
      {!isLoading && !error && (
        <>
          {/* 月度概览卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <TrendingDown className="w-4 h-4" />
                  月度收入
                </div>
                <div className="text-2xl font-bold text-green-600">¥{stats.monthlyIncome.toLocaleString()}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${stats.incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.incomeChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  环比 {stats.incomeChange >= 0 ? '+' : ''}{stats.incomeChange}%
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  月度支出
                </div>
                <div className="text-2xl font-bold text-red-600">¥{stats.monthlyExpense.toLocaleString()}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${stats.expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.expenseChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  环比 {stats.expenseChange >= 0 ? '+' : ''}{stats.expenseChange}%
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Wallet className="w-4 h-4" />
                  月度净流入
                </div>
                <div className="text-2xl font-bold text-blue-600">¥{stats.netInflow.toLocaleString()}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${stats.netInflowChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.netInflowChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  环比 {stats.netInflowChange >= 0 ? '+' : ''}{stats.netInflowChange}%
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <BarChart3 className="w-4 h-4" />
                  期末余额
                </div>
                <div className="text-2xl font-bold text-gray-900">¥{stats.endBalance.toLocaleString()}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${stats.balanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.balanceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  环比 {stats.balanceChange >= 0 ? '+' : ''}{stats.balanceChange}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 月度趋势图 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">月度资金流动趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#8c8c8c" fontSize={12} />
                      <YAxis stroke="#8c8c8c" fontSize={12} />
                      <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="income"
                        name="收入"
                        stroke="#52c41a"
                        fill="#52c41a"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="expense"
                        name="支出"
                        stroke="#ff4d4f"
                        fill="#ff4d4f"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        name="净流入"
                        stroke="#1890ff"
                        fill="#1890ff"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="暂无趋势数据" icon={BarChart3} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* 收支结构分析 */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-green-500" />
                  收入结构分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  {incomeStructure.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={incomeStructure}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name} ${value}%`}
                        >
                          {incomeStructure.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState message="暂无收入结构数据" icon={PieChartIcon} />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-red-500" />
                  支出结构分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  {expenseStructure.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseStructure}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name} ${value}%`}
                        >
                          {expenseStructure.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState message="暂无支出结构数据" icon={PieChartIcon} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 渠道月度对比 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">渠道月度收支对比</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                {channelData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="channel" stroke="#8c8c8c" fontSize={12} />
                      <YAxis stroke="#8c8c8c" fontSize={12} />
                      <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="income" name="收入" fill="#52c41a" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" name="支出" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="暂无渠道对比数据" icon={BarChart3} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* 差异原因统计 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                差异原因月度统计
              </CardTitle>
            </CardHeader>
            <CardContent>
              {diffReasonData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>差异原因</TableHead>
                      <TableHead className="text-center">发生次数</TableHead>
                      <TableHead className="text-right">涉及金额</TableHead>
                      <TableHead className="text-center">占比</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {diffReasonData.map((item) => {
                      const totalAmount = diffReasonData.reduce((sum, d) => sum + d.amount, 0);
                      const percentage = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : '0';
                      return (
                        <TableRow key={item.reason}>
                          <TableCell className="font-medium">{item.reason}</TableCell>
                          <TableCell className="text-center">{item.count}</TableCell>
                          <TableCell className="text-right text-red-600">¥{item.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{percentage}%</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState message="暂无差异原因数据" icon={AlertTriangle} />
              )}
            </CardContent>
          </Card>

          {/* 下月预测 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                下月资金预测
              </CardTitle>
            </CardHeader>
            <CardContent>
              {forecastData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>预测项目</TableHead>
                      <TableHead className="text-right">预测金额</TableHead>
                      <TableHead className="text-center">置信度</TableHead>
                      <TableHead>影响因素</TableHead>
                      <TableHead>建议</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forecastData.map((item) => (
                      <TableRow key={item.item}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell className="text-right font-bold">¥{item.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">{item.confidence}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{item.factors}</TableCell>
                        <TableCell className="text-sm text-gray-500">{item.suggestion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState message="暂无预测数据" icon={TrendingUp} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AppLayout>
  );
}
