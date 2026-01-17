import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Plus,
  Upload,
  FileCheck,
  FileText,
  Bell,
  RefreshCw,
  ArrowRight,
  Clock,
  Loader2,
  AlertCircle,
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
  Legend,
} from "recharts";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useDashboardOverview,
  useDashboardTrend,
  useDashboardTasks,
  useDashboardRefresh,
} from "@/hooks/useCashier";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useMemo, useCallback } from "react";

// ============ 类型定义 ============

interface OverviewData {
  todayIncome: number;
  todayIncomeChange: number;
  todayExpense: number;
  todayExpenseChange: number;
  totalBalance: number;
  balanceChange: number;
  reconciliationRate: number;
}

interface TrendItem {
  date: string;
  income: number;
  expense: number;
}

interface IncomeSourceItem {
  name: string;
  value: number;
  color: string;
}

interface ExpenseStructureItem {
  name: string;
  value: number;
  color: string;
}

interface AlertItem {
  id: number;
  title: string;
  level: "high" | "medium" | "low";
  time: string;
  duration?: string;
  amount?: string;
  description: string;
}

interface TaskItem {
  id: number;
  title: string;
  desc: string;
  action: string;
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

export default function CashierDashboard() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [, setLocation] = useLocation();
  
  // API调用
  const { 
    data: overviewData, 
    isLoading: overviewLoading, 
    error: overviewError,
    refetch: refetchOverview 
  } = useDashboardOverview(shopId);
  const { 
    data: trendData, 
    isLoading: trendLoading, 
    refetch: refetchTrend 
  } = useDashboardTrend(shopId, 7);
  const { 
    data: tasksData, 
    isLoading: tasksLoading, 
    refetch: refetchTasks 
  } = useDashboardTasks(shopId);
  const refreshMutation = useDashboardRefresh();

  // 定义API响应类型
  type OverviewDataType = {
    overview?: OverviewData;
    incomeSource?: IncomeSourceItem[];
    expenseStructure?: ExpenseStructureItem[];
    alerts?: AlertItem[];
  };

  type TrendDataType = {
    trend?: TrendItem[];
  };

  type TasksDataType = {
    tasks?: TaskItem[];
  };

  // 类型断言
  const typedOverviewData = overviewData as OverviewDataType | undefined;
  const typedTrendData = trendData as TrendDataType | undefined;
  const typedTasksData = tasksData as TasksDataType | undefined;

  // 从API响应中提取数据
  const overview = useMemo<OverviewData>(() => {
    if (typedOverviewData?.overview) {
      return typedOverviewData.overview;
    }
    return {
      todayIncome: 0,
      todayIncomeChange: 0,
      todayExpense: 0,
      todayExpenseChange: 0,
      totalBalance: 0,
      balanceChange: 0,
      reconciliationRate: 0,
    };
  }, [typedOverviewData]);

  const incomeSourceData = useMemo<IncomeSourceItem[]>(() => {
    if (typedOverviewData?.incomeSource) {
      return typedOverviewData.incomeSource;
    }
    return [];
  }, [typedOverviewData]);

  const expenseStructureData = useMemo<ExpenseStructureItem[]>(() => {
    if (typedOverviewData?.expenseStructure) {
      return typedOverviewData.expenseStructure;
    }
    return [];
  }, [typedOverviewData]);

  const alertsData = useMemo<AlertItem[]>(() => {
    if (typedOverviewData?.alerts) {
      return typedOverviewData.alerts;
    }
    return [];
  }, [typedOverviewData]);

  const cashflowTrendData = useMemo<TrendItem[]>(() => {
    if (typedTrendData?.trend) {
      return typedTrendData.trend;
    }
    return [];
  }, [typedTrendData]);

  const todoTasks = useMemo<TaskItem[]>(() => {
    if (typedTasksData?.tasks) {
      return typedTasksData.tasks;
    }
    return [];
  }, [typedTasksData]);

  // 检查是否有数据
  const hasOverviewData = overview.todayIncome > 0 || overview.todayExpense > 0 || overview.totalBalance > 0;
  const hasTrendData = cashflowTrendData.length > 0;
  const hasIncomeSourceData = incomeSourceData.length > 0;
  const hasExpenseStructureData = expenseStructureData.length > 0;
  const hasAlertsData = alertsData.length > 0;
  const hasTasksData = todoTasks.length > 0;

  const isLoading = overviewLoading || trendLoading || tasksLoading;
  
  // 刷新数据
  const handleRefresh = useCallback(() => {
    refreshMutation.mutate({ shopId, syncDoudian: true, syncQianchuan: true, syncJushuitan: true });
    refetchOverview();
    refetchTrend();
    refetchTasks();
    toast.success("数据已刷新");
  }, [refreshMutation, shopId, refetchOverview, refetchTrend, refetchTasks]);
  
  // 快捷操作处理
  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case "快速录入":
        setLocation("/cashier/cashflow");
        toast.info("跳转到资金流水页面进行录入");
        break;
      case "导入流水":
        toast.info("导入功能开发中");
        break;
      case "开始对账":
        setLocation("/cashier/reconciliation");
        break;
      case "生成日报":
        setLocation("/cashier/daily-report");
        break;
      case "查看预警":
        setLocation("/cashier/alerts");
        break;
    }
  }, [setLocation]);
  
  // 待办任务处理
  const handleTaskAction = useCallback((task: TaskItem) => {
    if (task.title.includes("差异")) {
      setLocation("/cashier/differences");
    } else if (task.title.includes("日报")) {
      setLocation("/cashier/daily-report");
    } else if (task.title.includes("提现")) {
      setLocation("/cashier/channels");
    } else {
      toast.info(`执行任务: ${task.title}`);
    }
  }, [setLocation]);
  
  // 格式化金额
  const formatCurrency = (value: number): string => {
    if (Math.abs(value) >= 10000) {
      return `¥${(value / 10000).toFixed(2)}万`;
    }
    return `¥${value.toLocaleString()}`;
  };

  // 获取当前日期
  const today = new Date();
  const dateString = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekDay = weekDays[today.getDay()];
  
  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">仪表盘</h1>
          <p className="text-sm text-gray-500 mt-1">
            欢迎回来！今天是{dateString} {weekDay}
          </p>
        </div>
        <Button 
          className="gap-2" 
          onClick={handleRefresh}
          disabled={refreshMutation.isPending || isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${(refreshMutation.isPending || isLoading) ? 'animate-spin' : ''}`} />
          {refreshMutation.isPending ? '刷新中...' : '刷新'}
        </Button>
      </div>

      {/* 快捷操作 */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { icon: Plus, label: "快速录入", color: "bg-green-500" },
          { icon: Upload, label: "导入流水", color: "bg-orange-500" },
          { icon: FileCheck, label: "开始对账", color: "bg-blue-500" },
          { icon: FileText, label: "生成日报", color: "bg-purple-500" },
          { icon: Bell, label: "查看预警", color: "bg-yellow-500" },
        ].map((item, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleQuickAction(item.label)}
          >
            <CardContent className="flex flex-col items-center justify-center py-4">
              <div
                className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mb-2`}
              >
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 加载状态 */}
      {isLoading && <LoadingState />}

      {/* 错误状态 */}
      {overviewError && !isLoading && (
        <EmptyState message="数据加载失败，请检查网络连接" icon={AlertCircle} />
      )}

      {/* 有数据时显示内容 */}
      {!isLoading && !overviewError && (
        <>
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <TrendingDown className="w-4 h-4" />
                  今日收入
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(overview.todayIncome)}
                </div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${overview.todayIncomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overview.todayIncomeChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  相比昨日 {overview.todayIncomeChange >= 0 ? '+' : ''}{overview.todayIncomeChange}%
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  今日支出
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(overview.todayExpense)}
                </div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${overview.todayExpenseChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {overview.todayExpenseChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  相比昨日 {overview.todayExpenseChange >= 0 ? '+' : ''}{overview.todayExpenseChange}%
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <CreditCard className="w-4 h-4" />
                  当前总余额
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(overview.totalBalance)}
                </div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${overview.balanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overview.balanceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  相比昨日 {overview.balanceChange >= 0 ? '+' : ''}{overview.balanceChange}%
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <CheckCircle className="w-4 h-4" />
                  对账状态
                </div>
                <div className="text-2xl font-bold text-gray-900">{overview.reconciliationRate}%</div>
                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  今日已完成
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">最近7天资金流动趋势</CardTitle>
              </CardHeader>
              <CardContent>
                {hasTrendData ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={cashflowTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#8c8c8c" fontSize={12} />
                        <YAxis stroke="#8c8c8c" fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="income"
                          name="收入"
                          stroke="#52c41a"
                          strokeWidth={2}
                          dot={{ fill: "#52c41a" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="expense"
                          name="支出"
                          stroke="#ff4d4f"
                          strokeWidth={2}
                          dot={{ fill: "#ff4d4f" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState message="暂无趋势数据" icon={TrendingUp} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* 饼图区域 */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">收入来源分布</CardTitle>
              </CardHeader>
              <CardContent>
                {hasIncomeSourceData ? (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={incomeSourceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name} ${value}%`}
                        >
                          {incomeSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState message="暂无收入来源数据" icon={DollarSign} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">支出结构分布</CardTitle>
              </CardHeader>
              <CardContent>
                {hasExpenseStructureData ? (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseStructureData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name} ${value}%`}
                        >
                          {expenseStructureData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState message="暂无支出结构数据" icon={CreditCard} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* 预警与待办 */}
          <div className="grid grid-cols-2 gap-6">
            {/* 预警与提醒 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-4 h-4 text-yellow-500" />
                  预警与提醒
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary" onClick={() => setLocation("/cashier/alerts")}>
                  查看全部
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasAlertsData ? (
                  alertsData.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 bg-gray-50 rounded-lg border-l-4 ${alert.level === 'high' ? 'border-l-red-500' : alert.level === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {alert.title}
                          </span>
                          <Badge
                            variant={
                              alert.level === "high" ? "destructive" : "secondary"
                            }
                            className="text-xs"
                          >
                            {alert.level === "high" ? "高危" : alert.level === "medium" ? "中危" : "低危"}
                          </Badge>
                        </div>
                        <AlertTriangle
                          className={`w-4 h-4 ${
                            alert.level === "high"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        触发时间: {alert.time} •{" "}
                        {alert.duration
                          ? `持续: ${alert.duration}`
                          : alert.amount ? `影响金额: ${alert.amount}` : ''}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive">
                          立即处理
                        </Button>
                        <Button size="sm" variant="outline">
                          标记已读
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="暂无预警信息" icon={Bell} />
                )}
              </CardContent>
            </Card>

            {/* 待办任务 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  待办任务
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary">
                  全部完成
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {hasTasksData ? (
                  todoTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {task.title}
                          </div>
                          <div className="text-xs text-gray-500">{task.desc}</div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1"
                        onClick={() => handleTaskAction(task)}
                      >
                        {task.action}
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <EmptyState message="暂无待办任务" icon={Clock} />
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AppLayout>
  );
}
