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
  Send,
  Wallet,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  AlertTriangle,
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
  LineChart,
  Line,
} from "recharts";
import { useState } from "react";
import { baseData } from "@/data/reconciliationConfig";
import { dailyStatsExtended, calculateSummary } from "@/data/realOrderData";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useMonthlyReportDetail,
  useMonthlyReportGenerate,
  useMonthlyReportExport,
} from "@/hooks/useCashier";
import { toast } from "sonner";

// 计算勾稽数据
const calculated = calculateSummary(dailyStatsExtended);

// 月度趋势数据 - 勾稽订单统计数据
const monthlyTrendData = dailyStatsExtended.filter((_, i) => i % 5 === 0).slice(0, 7).map(item => {
  const expense = item.refundAmount + item.expressAmount + item.commissionAmount + item.serviceAmount + item.promotionAmount;
  return {
    day: item.date.substring(8),  // 显示日期
    income: Math.round(item.salesAmount),  // 勾稽：收入 = 销售额
    expense: Math.round(expense),  // 勾稽：支出 = 退款+快递+佣金+服务费+推广
    balance: Math.round(item.salesAmount - expense),  // 勾稽：余额 = 收入-支出
  };
}).reverse();

// 收入结构 - 勾稽订单统计数据
const incomeStructureData = [
  { name: "订单收入", value: Math.round(baseData.amounts.confirmed / baseData.amounts.sales * 100), color: "#1890ff" },  // 勾稽：已确认金额占比
  { name: "平台结算", value: Math.round(baseData.amounts.unconfirmed / baseData.amounts.sales * 100), color: "#52c41a" },  // 勾稽：未确认金额占比
  { name: "退款返还", value: Math.round(baseData.amounts.refund / baseData.amounts.sales * 100), color: "#faad14" },  // 勾稽：退款额占比
  { name: "其他收入", value: 1, color: "#722ed1" },
];

// 支出结构 - 勾稽订单统计数据
const totalExpense = baseData.expenses.promotion + baseData.expenses.express + baseData.expenses.commission + baseData.expenses.service + baseData.amounts.refund;
const expenseStructureData = [
  { name: "推广费用", value: Math.round(baseData.expenses.promotion / totalExpense * 100), color: "#ff4d4f" },  // 勾稽：推广费占比
  { name: "物流费用", value: Math.round(baseData.expenses.express / totalExpense * 100), color: "#fa8c16" },  // 勾稽：快递费占比
  { name: "达人佣金", value: Math.round(baseData.expenses.commission / totalExpense * 100), color: "#13c2c2" },  // 勾稽：达人佣金占比
  { name: "退款支出", value: Math.round(baseData.amounts.refund / totalExpense * 100), color: "#eb2f96" },  // 勾稽：退款额占比
  { name: "服务费", value: Math.round(baseData.expenses.service / totalExpense * 100), color: "#722ed1" },  // 勾稽：服务费占比
];

// 渠道月度对比
const channelMonthlyData = [
  { channel: "抖音支付", income: 125000, expense: 45000 },
  { channel: "支付宝", income: 85000, expense: 32000 },
  { channel: "微信支付", income: 65000, expense: 28000 },
  { channel: "银行转账", income: 45000, expense: 15000 },
];

// 差异原因月度统计
const diffReasonMonthlyData = [
  { reason: "平台手续费", count: 85, amount: 12500 },
  { reason: "技术服务费", count: 62, amount: 8800 },
  { reason: "推广费扣除", count: 45, amount: 15200 },
  { reason: "退款差异", count: 28, amount: 4500 },
  { reason: "其他", count: 15, amount: 2100 },
];

// 下月预测
const forecastData = [
  { item: "预计收入", amount: 350000, confidence: "85%", factors: "历史趋势、季节因素", suggestion: "保持当前运营策略" },
  { item: "预计支出", amount: 125000, confidence: "80%", factors: "固定成本、推广计划", suggestion: "优化推广投放" },
  { item: "预计净流入", amount: 225000, confidence: "75%", factors: "综合预测", suggestion: "关注现金流健康" },
];

export default function CashierMonthlyReport() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().substring(0, 7));
  
  // API调用
  const { data: reportData, isLoading, refetch } = useMonthlyReportDetail(shopId, reportMonth);
  const generateMutation = useMonthlyReportGenerate();
  const exportMutation = useMonthlyReportExport();
  
  // 上一月
  const handlePrevMonth = () => {
    const [year, month] = reportMonth.split('-').map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    setReportMonth(`${prevYear}-${String(prevMonth).padStart(2, '0')}`);
  };
  
  // 下一月
  const handleNextMonth = () => {
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
  };
  
  // 生成月报
  const handleGenerate = () => {
    generateMutation.mutate({
      shopId,
      month: reportMonth,
    }, {
      onSuccess: () => refetch(),
    });
  };
  
  // 导出
  const handleExport = () => {
    const [year] = reportMonth.split('-').map(Number);
    exportMutation.mutate({
      shopId,
      year,
      format: 'excel',
    });
  };
  
  // 打印
  const handlePrint = () => {
    window.print();
  };
  
  // 快捷选择
  const handleQuickSelect = (offset: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - offset);
    setReportMonth(date.toISOString().substring(0, 7));
  };

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

      {/* 月度概览卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <TrendingDown className="w-4 h-4" />
              月度收入
            </div>
            <div className="text-2xl font-bold text-green-600">¥320,000</div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              环比 +12.5%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              月度支出
            </div>
            <div className="text-2xl font-bold text-red-600">¥120,000</div>
            <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              环比 +8.3%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Wallet className="w-4 h-4" />
              月度净流入
            </div>
            <div className="text-2xl font-bold text-blue-600">¥200,000</div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              环比 +15.2%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <BarChart3 className="w-4 h-4" />
              期末余额
            </div>
            <div className="text-2xl font-bold text-gray-900">¥486,500</div>
            <div className="text-xs text-gray-500 mt-1">
              期初 ¥286,500
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 月度趋势图 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">月度资金趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#8c8c8c" fontSize={12} />
                <YAxis stroke="#8c8c8c" fontSize={12} />
                <Tooltip />
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
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 收支结构 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">收入结构分析</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeStructureData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {incomeStructureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">支出结构分析</CardTitle>
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
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 渠道对比 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">各渠道月度收支对比</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="channel" stroke="#8c8c8c" fontSize={12} />
                <YAxis stroke="#8c8c8c" fontSize={12} />
                <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="income" name="收入" fill="#52c41a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="支出" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 差异统计和下月预测 */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              月度差异统计
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>差异原因</TableHead>
                  <TableHead className="text-center">笔数</TableHead>
                  <TableHead className="text-right">金额</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diffReasonMonthlyData.map((item) => (
                  <TableRow key={item.reason}>
                    <TableCell>{item.reason}</TableCell>
                    <TableCell className="text-center">{item.count}</TableCell>
                    <TableCell className="text-right text-red-600">
                      ¥{item.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50 font-medium">
                  <TableCell>合计</TableCell>
                  <TableCell className="text-center">
                    {diffReasonMonthlyData.reduce((sum, item) => sum + item.count, 0)}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    ¥{diffReasonMonthlyData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              下月资金预测
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>预测项目</TableHead>
                  <TableHead className="text-right">预测金额</TableHead>
                  <TableHead className="text-center">置信区间</TableHead>
                  <TableHead>建议行动</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forecastData.map((item) => (
                  <TableRow key={item.item}>
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell className={`text-right font-medium ${
                      item.item.includes("收入") || item.item.includes("净流入")
                        ? "text-green-600"
                        : item.item.includes("支出")
                        ? "text-red-600"
                        : ""
                    }`}>
                      ¥{item.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.confidence}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {item.suggestion}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
