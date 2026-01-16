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
import { baseData } from "@/data/reconciliationConfig";
import { dailyStatsExtended } from "@/data/realOrderData";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useDashboardOverview,
  useDashboardTrend,
  useDashboardTasks,
  useDashboardRefresh,
} from "@/hooks/useCashier";
import { toast } from "sonner";
import { useLocation } from "wouter";

// 资金流动趋势数据 - 勾稽订单统计数据
const cashflowTrendData = dailyStatsExtended.slice(0, 7).map(item => ({
  date: item.date.substring(5),  // 显示月-日
  income: item.salesAmount,      // 勾稽：收入 = 销售额
  expense: item.refundAmount + item.expressAmount + item.commissionAmount + item.serviceAmount + item.promotionAmount,  // 勾稽：支出 = 退款+快递+佣金+服务费+推广
})).reverse();

// 收入来源分布 - 勾稽订单统计数据
const incomeSourceData = [
  { name: "抹音订单", value: Math.round(baseData.amounts.confirmed / baseData.amounts.sales * 100), color: "#1890ff" },  // 勾稽：已确认金额占比
  { name: "平台结算", value: Math.round(baseData.amounts.unconfirmed / baseData.amounts.sales * 100), color: "#52c41a" },  // 勾稽：未确认金额占比
  { name: "退款返还", value: Math.round(baseData.amounts.refund / baseData.amounts.sales * 100), color: "#faad14" },  // 勾稽：退款额占比
  { name: "其他收入", value: 1, color: "#722ed1" },
];

// 支出结构分布 - 勾稽订单统计数据
const totalExpense = baseData.expenses.promotion + baseData.expenses.express + baseData.expenses.commission + baseData.expenses.service;
const expenseStructureData = [
  { name: "推广费用", value: Math.round(baseData.expenses.promotion / totalExpense * 100), color: "#ff4d4f" },  // 勾稽：推广费占比
  { name: "物流费用", value: Math.round(baseData.expenses.express / totalExpense * 100), color: "#fa8c16" },  // 勾稽：快递费占比
  { name: "达人佣金", value: Math.round(baseData.expenses.commission / totalExpense * 100), color: "#13c2c2" },  // 勾稽：达人佣金占比
  { name: "服务费", value: Math.round(baseData.expenses.service / totalExpense * 100), color: "#eb2f96" },  // 勾稽：服务费占比
];

// 预警数据
const alertsData = [
  {
    id: 1,
    title: "抖音账户未提现金额超限",
    level: "high",
    time: "2024-01-15 09:00",
    duration: "3天",
    description: "抖音支付账户尚有 ¥58,200 元超过7天未提现",
  },
  {
    id: 2,
    title: "退款率异常升高",
    level: "medium",
    time: "2024-01-15 10:30",
    amount: "¥12,500",
    description: '店铺"XX旗舰店"近7天退款率达4.2%，超过阈值3.5%',
  },
];

// 待办任务
const todoTasks = [
  { id: 1, title: "核对差异订单", desc: "3笔待处理差异订单", action: "去处理" },
  { id: 2, title: "生成资金日报", desc: "每日16:00前完成", action: "去生成" },
  { id: 3, title: "提现操作", desc: "抖音账户余额 ¥58,200", action: "去操作" },
];

export default function CashierDashboard() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [, setLocation] = useLocation();
  
  // API调用
  const { data: overviewData, isLoading: overviewLoading, refetch: refetchOverview } = useDashboardOverview(shopId);
  const { data: trendData, isLoading: trendLoading, refetch: refetchTrend } = useDashboardTrend(shopId, 7);
  const { data: tasksData, isLoading: tasksLoading, refetch: refetchTasks } = useDashboardTasks(shopId);
  const refreshMutation = useDashboardRefresh();
  
  // 刷新数据
  const handleRefresh = () => {
    refreshMutation.mutate({ shopId, syncDoudian: true, syncQianchuan: true, syncJushuitan: true });
    refetchOverview();
    refetchTrend();
    refetchTasks();
  };
  
  // 快捷操作处理
  const handleQuickAction = (action: string) => {
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
        toast.info("预警功能开发中");
        break;
    }
  };
  
  // 待办任务处理
  const handleTaskAction = (task: { id: number; title: string; action: string }) => {
    if (task.title.includes("差异")) {
      setLocation("/cashier/differences");
    } else if (task.title.includes("日报")) {
      setLocation("/cashier/daily-report");
    } else if (task.title.includes("提现")) {
      setLocation("/cashier/channels");
    } else {
      toast.info(`执行任务: ${task.title}`);
    }
  };
  
  // 预警处理
  const handleAlertAction = (alertId: number) => {
    toast.info(`处理预警 #${alertId}`);
  };
  
  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">仪表盘</h1>
          <p className="text-sm text-gray-500 mt-1">
            欢迎回来，张出纳！今天是2024年1月15日 周一
          </p>
        </div>
        <Button 
          className="gap-2" 
          onClick={handleRefresh}
          disabled={refreshMutation.isPending}
        >
          <RefreshCw className={`w-4 h-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
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

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <TrendingDown className="w-4 h-4" />
              今日收入
            </div>
            <div className="text-2xl font-bold text-gray-900">¥15,000</div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              相比昨日 +12.5%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              今日支出
            </div>
            <div className="text-2xl font-bold text-gray-900">¥8,500</div>
            <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              相比昨日 +3.2%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <CreditCard className="w-4 h-4" />
              当前总余额
            </div>
            <div className="text-2xl font-bold text-gray-900">¥186,500</div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              相比昨日 +5.8%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <CheckCircle className="w-4 h-4" />
              对账状态
            </div>
            <div className="text-2xl font-bold text-gray-900">92%</div>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">支出结构分布</CardTitle>
          </CardHeader>
          <CardContent>
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
            <Button variant="ghost" size="sm" className="text-primary">
              查看全部
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertsData.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-gray-50 rounded-lg border-l-4 border-l-red-500"
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
                      {alert.level === "high" ? "高危" : "中危"}
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
                    : `影响金额: ${alert.amount}`}
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
            ))}
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
            {todoTasks.map((task) => (
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
                <Button size="sm" variant="outline" className="gap-1">
                  {task.action}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
