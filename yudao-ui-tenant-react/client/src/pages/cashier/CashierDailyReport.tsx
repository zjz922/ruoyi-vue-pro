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
  Loader2,
  AlertCircle,
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
import { useState, useMemo, useCallback } from "react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useDailyReportDetail,
  useDailyReportGenerate,
  useDailyReportExport,
} from "@/hooks/useCashier";
import { toast } from "sonner";

// ============ 类型定义 ============

interface IncomeDetail {
  time: string;
  channel: string;
  type: string;
  orderNo: string;
  amount: number;
  status: string;
}

interface ExpenseDetail {
  time: string;
  channel: string;
  type: string;
  summary: string;
  amount: number;
  status: string;
}

interface IncomeSourceItem {
  name: string;
  value: number;
  color: string;
}

interface ChannelDataItem {
  channel: string;
  amount: number;
}

interface ReconciliationStats {
  total: number;
  reconciled: number;
  difference: number;
  rate: number;
  rateChange: number;
}

interface DailyReportData {
  overview?: {
    totalIncome: number;
    incomeChange: number;
    totalExpense: number;
    expenseChange: number;
    netFlow: number;
    totalBalance: number;
    balanceChange: number;
  };
  incomeDetails?: IncomeDetail[];
  expenseDetails?: ExpenseDetail[];
  incomeSourceData?: IncomeSourceItem[];
  channelIncomeData?: ChannelDataItem[];
  expenseStructureData?: IncomeSourceItem[];
  channelExpenseData?: ChannelDataItem[];
  reconciliation?: ReconciliationStats;
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

export default function CashierDailyReport() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportTemplate, setReportTemplate] = useState("standard");
  
  // API调用
  const { data: reportData, isLoading, error, refetch } = useDailyReportDetail(shopId, reportDate);
  const generateMutation = useDailyReportGenerate();
  const exportMutation = useDailyReportExport();

  // 类型断言
  const typedReportData = reportData as DailyReportData | undefined;

  // 从API响应中提取数据
  const overview = useMemo(() => {
    if (typedReportData?.overview) {
      return typedReportData.overview;
    }
    return {
      totalIncome: 0,
      incomeChange: 0,
      totalExpense: 0,
      expenseChange: 0,
      netFlow: 0,
      totalBalance: 0,
      balanceChange: 0,
    };
  }, [typedReportData]);

  const incomeDetails = useMemo<IncomeDetail[]>(() => {
    return typedReportData?.incomeDetails || [];
  }, [typedReportData]);

  const expenseDetails = useMemo<ExpenseDetail[]>(() => {
    return typedReportData?.expenseDetails || [];
  }, [typedReportData]);

  const incomeSourceData = useMemo<IncomeSourceItem[]>(() => {
    return typedReportData?.incomeSourceData || [];
  }, [typedReportData]);

  const channelIncomeData = useMemo<ChannelDataItem[]>(() => {
    return typedReportData?.channelIncomeData || [];
  }, [typedReportData]);

  const expenseStructureData = useMemo<IncomeSourceItem[]>(() => {
    return typedReportData?.expenseStructureData || [];
  }, [typedReportData]);

  const channelExpenseData = useMemo<ChannelDataItem[]>(() => {
    return typedReportData?.channelExpenseData || [];
  }, [typedReportData]);

  const reconciliation = useMemo<ReconciliationStats>(() => {
    if (typedReportData?.reconciliation) {
      return typedReportData.reconciliation;
    }
    return {
      total: 0,
      reconciled: 0,
      difference: 0,
      rate: 0,
      rateChange: 0,
    };
  }, [typedReportData]);

  // 检查是否有数据
  const hasOverviewData = overview.totalIncome > 0 || overview.totalExpense > 0;
  const hasIncomeDetails = incomeDetails.length > 0;
  const hasExpenseDetails = expenseDetails.length > 0;
  const hasIncomeSourceData = incomeSourceData.length > 0;
  const hasExpenseStructureData = expenseStructureData.length > 0;
  const hasReconciliationData = reconciliation.total > 0;
  
  // 上一天
  const handlePrevDay = useCallback(() => {
    const date = new Date(reportDate);
    date.setDate(date.getDate() - 1);
    setReportDate(date.toISOString().split('T')[0]);
  }, [reportDate]);
  
  // 下一天
  const handleNextDay = useCallback(() => {
    const date = new Date(reportDate);
    date.setDate(date.getDate() + 1);
    const today = new Date().toISOString().split('T')[0];
    if (date.toISOString().split('T')[0] <= today) {
      setReportDate(date.toISOString().split('T')[0]);
    } else {
      toast.error("不能查看未来日期的报告");
    }
  }, [reportDate]);
  
  // 生成日报
  const handleGenerate = useCallback(() => {
    generateMutation.mutate({
      shopId,
      date: reportDate,
    }, {
      onSuccess: () => {
        refetch();
        toast.success("日报生成成功");
      },
    });
  }, [generateMutation, shopId, reportDate, refetch]);
  
  // 导出PDF
  const handleExportPDF = useCallback(() => {
    exportMutation.mutate({
      shopId,
      startDate: reportDate,
      endDate: reportDate,
      format: 'pdf',
    }, {
      onSuccess: () => toast.success("PDF导出成功"),
    });
  }, [exportMutation, shopId, reportDate]);
  
  // 导出Excel
  const handleExportExcel = useCallback(() => {
    exportMutation.mutate({
      shopId,
      startDate: reportDate,
      endDate: reportDate,
      format: 'excel',
    }, {
      onSuccess: () => toast.success("Excel导出成功"),
    });
  }, [exportMutation, shopId, reportDate]);
  
  // 打印
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // 格式化日期显示
  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">资金日报</h1>
          <p className="text-sm text-gray-500 mt-1">
            {formatDateDisplay(reportDate)}资金流动日报
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1"
                  onClick={handleExportExcel}
                  disabled={exportMutation.isPending}
                >
                  <FileSpreadsheet className="w-3 h-3" />
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1"
                  onClick={handlePrint}
                >
                  <Printer className="w-3 h-3" />
                  打印
                </Button>
              </div>
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
          {/* 一、日报概览 */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">一、日报概览</CardTitle>
            </CardHeader>
            <CardContent>
              {hasOverviewData ? (
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">当日总收入</span>
                      <ArrowDownRight className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">¥{overview.totalIncome.toLocaleString()}</div>
                    <div className={`text-xs mt-2 flex items-center gap-1 ${overview.incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {overview.incomeChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      相比昨日 {overview.incomeChange >= 0 ? '+' : ''}{overview.incomeChange}%
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">当日总支出</span>
                      <ArrowUpRight className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">¥{overview.totalExpense.toLocaleString()}</div>
                    <div className={`text-xs mt-2 flex items-center gap-1 ${overview.expenseChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {overview.expenseChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      相比昨日 {overview.expenseChange >= 0 ? '+' : ''}{overview.expenseChange}%
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">当日净现金流</span>
                      <Wallet className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className={`text-2xl font-bold ${overview.netFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ¥{overview.netFlow.toLocaleString()}
                    </div>
                    <div className={`text-xs mt-2 flex items-center gap-1 ${overview.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {overview.netFlow >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {overview.netFlow >= 0 ? '正向流入' : '负向流出'}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">账户总余额</span>
                      <Wallet className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">¥{overview.totalBalance.toLocaleString()}</div>
                    <div className={`text-xs mt-2 flex items-center gap-1 ${overview.balanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {overview.balanceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      相比昨日 {overview.balanceChange >= 0 ? '+' : ''}{overview.balanceChange}%
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState message="暂无日报概览数据" icon={FileText} />
              )}
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
                  {hasIncomeSourceData ? (
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
                  ) : (
                    <EmptyState message="暂无收入来源数据" icon={ArrowDownRight} />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">各渠道收入对比</h4>
                  {channelIncomeData.length > 0 ? (
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
                  ) : (
                    <EmptyState message="暂无渠道收入数据" icon={ArrowDownRight} />
                  )}
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
                {hasIncomeDetails ? (
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
                ) : (
                  <EmptyState message="暂无收入明细数据" icon={FileText} />
                )}
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
                  {hasExpenseStructureData ? (
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
                  ) : (
                    <EmptyState message="暂无支出结构数据" icon={ArrowUpRight} />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">各渠道支出对比</h4>
                  {channelExpenseData.length > 0 ? (
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
                  ) : (
                    <EmptyState message="暂无渠道支出数据" icon={ArrowUpRight} />
                  )}
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
                {hasExpenseDetails ? (
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
                ) : (
                  <EmptyState message="暂无支出明细数据" icon={FileText} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* 四、对账情况 */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">四、对账情况</CardTitle>
            </CardHeader>
            <CardContent>
              {hasReconciliationData ? (
                <>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        当日对账总数
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{reconciliation.total}</div>
                      <div className="text-xs text-gray-500 mt-1">笔</div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        已对账
                      </div>
                      <div className="text-2xl font-bold text-green-600">{reconciliation.reconciled}</div>
                      <div className="text-xs text-gray-500 mt-1">笔</div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        差异订单
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">{reconciliation.difference}</div>
                      <div className="text-xs text-gray-500 mt-1">笔</div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        对账完成率
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{reconciliation.rate}%</div>
                      <div className={`text-xs mt-1 flex items-center gap-1 ${reconciliation.rateChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {reconciliation.rateChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        较昨日 {reconciliation.rateChange >= 0 ? '+' : ''}{reconciliation.rateChange}%
                      </div>
                    </div>
                  </div>

                  {/* 对账进度条 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">对账进度</span>
                      <span className="text-sm text-gray-500">{reconciliation.reconciled}/{reconciliation.total} 笔</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                        style={{ width: `${reconciliation.rate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>已对账: {reconciliation.reconciled}笔</span>
                      <span>差异: {reconciliation.difference}笔</span>
                      <span>待对账: {reconciliation.total - reconciliation.reconciled - reconciliation.difference}笔</span>
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState message="暂无对账数据" icon={CheckCircle} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AppLayout>
  );
}
