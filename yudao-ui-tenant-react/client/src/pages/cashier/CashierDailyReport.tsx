import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  CalendarDays,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Printer,
  RefreshCw,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  FileType,
  CheckCircle,
  AlertTriangle,
  Clock,
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
} from "recharts";
import { useState } from "react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useDailyReportDetail,
  useDailyReportGenerate,
  useDailyReportExport,
} from "@/hooks/useCashier";
import { toast } from "sonner";

// 今日收入明细
const incomeDetails = [
  { time: "08:30", channel: "抖音支付", type: "商品销售", orderNo: "DD20240115001", amount: 1280.00, status: "已确认" },
  { time: "09:15", channel: "支付宝", type: "商品销售", orderNo: "DD20240115002", amount: 2580.00, status: "已确认" },
  { time: "10:20", channel: "微信支付", type: "退款返还", orderNo: "TK20240115001", amount: 299.00, status: "已确认" },
  { time: "11:45", channel: "抖音支付", type: "商品销售", orderNo: "DD20240115003", amount: 1680.00, status: "待确认" },
  { time: "14:30", channel: "银行转账", type: "其他收入", orderNo: "-", amount: 5000.00, status: "已确认" },
  { time: "15:20", channel: "抖音支付", type: "商品销售", orderNo: "DD20240115004", amount: 980.00, status: "已确认" },
  { time: "16:45", channel: "支付宝", type: "商品销售", orderNo: "DD20240115005", amount: 1560.00, status: "已确认" },
  { time: "17:30", channel: "微信支付", type: "商品销售", orderNo: "DD20240115006", amount: 620.00, status: "待确认" },
];

// 今日支出明细
const expenseDetails = [
  { time: "09:00", channel: "抖音支付", type: "平台扣款", summary: "技术服务费", amount: 520.00, status: "已确认" },
  { time: "10:30", channel: "支付宝", type: "推广费用", summary: "直通车推广", amount: 1500.00, status: "已确认" },
  { time: "13:00", channel: "微信支付", type: "退款支出", summary: "客户退款", amount: 680.00, status: "已确认" },
  { time: "15:00", channel: "银行转账", type: "物流费用", summary: "快递结算", amount: 2800.00, status: "待确认" },
  { time: "16:00", channel: "抖音支付", type: "平台扣款", summary: "佣金扣除", amount: 380.00, status: "已确认" },
  { time: "17:00", channel: "银行转账", type: "采购支出", summary: "供应商货款", amount: 1200.00, status: "已确认" },
];

// 收入来源分布
const incomeSourceData = [
  { name: "商品销售", value: 65, color: "#1890ff" },
  { name: "退款返还", value: 15, color: "#52c41a" },
  { name: "其他收入", value: 20, color: "#faad14" },
];

// 渠道收入对比
const channelIncomeData = [
  { channel: "抖音支付", amount: 3940 },
  { channel: "支付宝", amount: 4140 },
  { channel: "微信支付", amount: 919 },
  { channel: "银行转账", amount: 5000 },
];

// 支出结构分布
const expenseStructureData = [
  { name: "平台扣款", value: 25, color: "#ff4d4f" },
  { name: "推广费用", value: 30, color: "#fa8c16" },
  { name: "退款支出", value: 15, color: "#13c2c2" },
  { name: "物流费用", value: 20, color: "#722ed1" },
  { name: "采购支出", value: 10, color: "#eb2f96" },
];

// 渠道支出对比
const channelExpenseData = [
  { channel: "抖音支付", amount: 900 },
  { channel: "支付宝", amount: 1500 },
  { channel: "微信支付", amount: 680 },
  { channel: "银行转账", amount: 4000 },
];

export default function CashierDailyReport() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportTemplate, setReportTemplate] = useState("standard");
  
  // API调用
  const { data: reportData, isLoading, refetch } = useDailyReportDetail(shopId, reportDate);
  const generateMutation = useDailyReportGenerate();
  const exportMutation = useDailyReportExport();
  
  // 上一天
  const handlePrevDay = () => {
    const date = new Date(reportDate);
    date.setDate(date.getDate() - 1);
    setReportDate(date.toISOString().split('T')[0]);
  };
  
  // 下一天
  const handleNextDay = () => {
    const date = new Date(reportDate);
    date.setDate(date.getDate() + 1);
    const today = new Date().toISOString().split('T')[0];
    if (date.toISOString().split('T')[0] <= today) {
      setReportDate(date.toISOString().split('T')[0]);
    } else {
      toast.error("不能查看未来日期的报告");
    }
  };
  
  // 生成日报
  const handleGenerate = () => {
    generateMutation.mutate({
      shopId,
      date: reportDate,
    }, {
      onSuccess: () => refetch(),
    });
  };
  
  // 导出PDF
  const handleExportPDF = () => {
    exportMutation.mutate({
      shopId,
      startDate: reportDate,
      endDate: reportDate,
      format: 'pdf',
    });
  };
  
  // 导出Excel
  const handleExportExcel = () => {
    exportMutation.mutate({
      shopId,
      startDate: reportDate,
      endDate: reportDate,
      format: 'excel',
    });
  };
  
  // 打印
  const handlePrint = () => {
    window.print();
  };

  const totalIncome = incomeDetails.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenseDetails.reduce((sum, item) => sum + item.amount, 0);
  const netFlow = totalIncome - totalExpense;

  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">资金日报</h1>
          <p className="text-sm text-gray-500 mt-1">
            2024年1月15日资金流动日报
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handlePrevDay}>
            <ChevronLeft className="w-4 h-4" />
            上一天
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleNextDay}>
            下一天
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button 
            className="gap-2" 
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
          >
            <RefreshCw className={`w-4 h-4 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
            {generateMutation.isPending ? '生成中...' : '生成日报'}
          </Button>
        </div>
      </div>

      {/* 日报控制面板 */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">报告日期</span>
              <Input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-40 h-8"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">报告模板</span>
              <Select value={reportTemplate} onValueChange={setReportTemplate}>
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">标准日报</SelectItem>
                  <SelectItem value="detailed">详细日报</SelectItem>
                  <SelectItem value="executive">管理层日报</SelectItem>
                  <SelectItem value="custom">自定义模板</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">导出格式</span>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1"
                  onClick={handleExportPDF}
                  disabled={exportMutation.isPending}
                >
                  <FileType className="w-3 h-3" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <FileSpreadsheet className="w-3 h-3" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <FileText className="w-3 h-3" />
                  Word
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 一、日报概览 */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">一、日报概览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">当日总收入</span>
                <ArrowDownRight className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">¥{totalIncome.toLocaleString()}</div>
              <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                相比昨日 +12.5%
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">当日总支出</span>
                <ArrowUpRight className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-600">¥{totalExpense.toLocaleString()}</div>
              <div className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                相比昨日 +3.2%
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">当日净现金流</span>
                <Wallet className="w-4 h-4 text-blue-500" />
              </div>
              <div className={`text-2xl font-bold ${netFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
                ¥{netFlow.toLocaleString()}
              </div>
              <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                正向流入
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">账户总余额</span>
                <Wallet className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">¥186,500</div>
              <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                相比昨日 +5.8%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 二、资金流入分析 */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">二、资金流入分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">当日收入来源分布</h4>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {incomeSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">各渠道收入对比</h4>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelIncomeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="channel" stroke="#8c8c8c" fontSize={12} />
                    <YAxis stroke="#8c8c8c" fontSize={12} />
                    <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                    <Bar dataKey="amount" name="收入金额" fill="#52c41a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 收入明细表格 */}
          <div className="border rounded-lg">
            <div className="flex justify-between items-center p-3 border-b bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700">收入明细</h4>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <Download className="w-3 h-3" />
                导出明细
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>渠道</TableHead>
                  <TableHead>业务类型</TableHead>
                  <TableHead>订单号</TableHead>
                  <TableHead className="text-right">金额</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeDetails.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-gray-500">{item.time}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{item.channel}</Badge>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className="font-mono text-xs">{item.orderNo}</TableCell>
                    <TableCell className="text-right text-green-600 font-medium">
                      +¥{item.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className={
                          item.status === "已确认"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 三、资金流出分析 */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">三、资金流出分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">当日支出结构分布</h4>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseStructureData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
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
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">各渠道支出对比</h4>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelExpenseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="channel" stroke="#8c8c8c" fontSize={12} />
                    <YAxis stroke="#8c8c8c" fontSize={12} />
                    <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                    <Bar dataKey="amount" name="支出金额" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 支出明细表格 */}
          <div className="border rounded-lg">
            <div className="flex justify-between items-center p-3 border-b bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700">支出明细</h4>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <Download className="w-3 h-3" />
                导出明细
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>渠道</TableHead>
                  <TableHead>业务类型</TableHead>
                  <TableHead>摘要</TableHead>
                  <TableHead className="text-right">金额</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseDetails.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-gray-500">{item.time}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{item.channel}</Badge>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className="text-gray-500">{item.summary}</TableCell>
                    <TableCell className="text-right text-red-600 font-medium">
                      -¥{item.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className={
                          item.status === "已确认"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 四、对账情况 */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">四、对账情况</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <FileText className="w-4 h-4 text-blue-500" />
                当日对账总数
              </div>
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-xs text-gray-500 mt-1">笔</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                已对账
              </div>
              <div className="text-2xl font-bold text-green-600">148</div>
              <div className="text-xs text-gray-500 mt-1">笔</div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                差异订单
              </div>
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-xs text-gray-500 mt-1">笔</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <Clock className="w-4 h-4 text-purple-500" />
                对账完成率
              </div>
              <div className="text-2xl font-bold text-purple-600">94.9%</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                较昨日 +2.1%
              </div>
            </div>
          </div>

          {/* 对账进度条 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">对账进度</span>
              <span className="text-sm text-gray-500">148/156 笔</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                style={{ width: "94.9%" }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>已对账: 148笔</span>
              <span>差异: 8笔</span>
              <span>待对账: 0笔</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
