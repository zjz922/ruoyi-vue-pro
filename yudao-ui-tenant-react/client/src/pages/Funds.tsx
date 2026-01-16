import AppLayout from "@/components/AppLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  Download,
  TrendingUp,
  TrendingDown,
  Building2,
  CreditCard,
  Banknote,
  PiggyBank,
  ArrowRightLeft,
  Clock,
  Calendar,
  Target,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  ChevronRight,
  Landmark,
  CircleDollarSign
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useFundsOverview, useFundsTransfer, useFundsWithdraw } from "@/hooks/useLedger";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// 多账户数据
const accountsData = [
  { 
    id: 1, 
    name: "抖音店铺主账户", 
    type: "platform",
    icon: "🎵",
    balance: 285000.00, 
    available: 265000.00, 
    frozen: 20000.00,
    todayIn: 45800.00,
    todayOut: 12500.00,
    status: "normal"
  },
  { 
    id: 2, 
    name: "支付宝企业账户", 
    type: "bank",
    icon: "💳",
    balance: 156000.00, 
    available: 156000.00, 
    frozen: 0,
    todayIn: 0,
    todayOut: 5000.00,
    status: "normal"
  },
  { 
    id: 3, 
    name: "工商银行对公账户", 
    type: "bank",
    icon: "🏦",
    balance: 89000.00, 
    available: 89000.00, 
    frozen: 0,
    todayIn: 50000.00,
    todayOut: 0,
    status: "normal"
  },
  { 
    id: 4, 
    name: "巨量千川推广账户", 
    type: "ad",
    icon: "📢",
    balance: 12000.00, 
    available: 12000.00, 
    frozen: 0,
    todayIn: 5000.00,
    todayOut: 8500.00,
    status: "warning"
  },
];

// 资金流水数据
const transactions = [
  { id: "TRX-001", time: "10:23:45", type: "income", category: "货款结算", amount: 12500.00, status: "success", desc: "订单结算 20260110-01", account: "抖音店铺主账户" },
  { id: "TRX-002", time: "09:15:30", type: "expense", category: "推广充值", amount: -5000.00, status: "success", desc: "巨量千川账户充值", account: "支付宝企业账户" },
  { id: "TRX-003", time: "08:45:12", type: "income", category: "退款返还", amount: 128.00, status: "success", desc: "运费险理赔到账", account: "抖音店铺主账户" },
  { id: "TRX-004", time: "昨天 16:30", type: "expense", category: "售后退款", amount: -299.00, status: "success", desc: "订单 8829102 退款", account: "抖音店铺主账户" },
  { id: "TRX-005", time: "昨天 14:20", type: "income", category: "货款结算", amount: 8900.00, status: "success", desc: "订单结算 20260109-02", account: "抖音店铺主账户" },
  { id: "TRX-006", time: "昨天 10:15", type: "transfer", category: "账户转账", amount: 50000.00, status: "success", desc: "提现至工商银行", account: "抖音店铺主账户 → 工商银行" },
];

// 资金预测数据
const forecastData = {
  next7Days: {
    expectedIn: 156000.00,
    expectedOut: 89000.00,
    netFlow: 67000.00
  },
  next30Days: {
    expectedIn: 580000.00,
    expectedOut: 320000.00,
    netFlow: 260000.00
  },
  alerts: [
    { date: "2026-01-15", type: "expense", desc: "预计推广费用支出", amount: 30000.00 },
    { date: "2026-01-20", type: "expense", desc: "供应商货款到期", amount: 85000.00 },
    { date: "2026-01-25", type: "income", desc: "预计货款结算", amount: 120000.00 },
  ]
};

// 提现记录数据
const withdrawalRecords = [
  { id: "W-001", date: "2026-01-10", amount: 50000.00, from: "抖音店铺主账户", to: "工商银行对公账户", status: "completed", fee: 0 },
  { id: "W-002", date: "2026-01-08", amount: 30000.00, from: "抖音店铺主账户", to: "支付宝企业账户", status: "completed", fee: 0 },
  { id: "W-003", date: "2026-01-05", amount: 80000.00, from: "抖音店铺主账户", to: "工商银行对公账户", status: "completed", fee: 0 },
  { id: "W-004", date: "2026-01-03", amount: 25000.00, from: "抖音店铺主账户", to: "支付宝企业账户", status: "completed", fee: 0 },
];

export default function Funds() {
  const [activeTab, setActiveTab] = useState("overview");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({ fromAccount: "", toAccount: "", amount: "" });
  const [withdrawForm, setWithdrawForm] = useState({ account: "", amount: "", bankAccount: "" });
  
  // 获取店铺信息
  const { currentShopId } = useShopSwitcher();
  
  // 获取资金概览数据
  const { data: fundsData, isLoading: isLoadingFunds, refetch: refetchFunds } = useFundsOverview();
  
  // 资金调拨
  const transferMutation = useFundsTransfer();
  
  // 发起提现
  const withdrawMutation = useFundsWithdraw();
  
  // 处理同步全部账户
  const handleSyncAll = useCallback(async () => {
    toast.info("同步功能待Java后端实现");
  }, []);
  
  // 处理资金调拨
  const handleTransfer = useCallback(async () => {
    if (!transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount) {
      toast.error("请填写完整的调拨信息");
      return;
    }
    try {
      await transferMutation.mutateAsync({
        shopId: currentShopId || "",
        fromAccountId: parseInt(transferForm.fromAccount, 10),
        toAccountId: parseInt(transferForm.toAccount, 10),
        amount: parseFloat(transferForm.amount),
      });
      toast.success("资金调拨成功");
      setTransferDialogOpen(false);
      setTransferForm({ fromAccount: "", toAccount: "", amount: "" });
    } catch (error) {
      toast.error("调拨失败，请重试");
    }
  }, [transferMutation, currentShopId, transferForm]);
  
  // 处理发起提现
  const handleWithdraw = useCallback(async () => {
    if (!withdrawForm.account || !withdrawForm.amount || !withdrawForm.bankAccount) {
      toast.error("请填写完整的提现信息");
      return;
    }
    try {
      await withdrawMutation.mutateAsync({
        shopId: currentShopId || "",
        accountId: parseInt(withdrawForm.account, 10),
        amount: parseFloat(withdrawForm.amount),
        bankAccount: withdrawForm.bankAccount,
        bankName: "默认银行",
      });
      toast.success("提现申请已提交");
      setWithdrawDialogOpen(false);
      setWithdrawForm({ account: "", amount: "", bankAccount: "" });
    } catch (error) {
      toast.error("提现失败，请重试");
    }
  }, [withdrawMutation, currentShopId, withdrawForm]);
  const [showAccountDetail, setShowAccountDetail] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<typeof accountsData[0] | null>(null);

  // 计算总资产
  const totalBalance = accountsData.reduce((sum, acc) => sum + acc.balance, 0);
  const totalAvailable = accountsData.reduce((sum, acc) => sum + acc.available, 0);
  const totalFrozen = accountsData.reduce((sum, acc) => sum + acc.frozen, 0);
  const todayTotalIn = accountsData.reduce((sum, acc) => sum + acc.todayIn, 0);
  const todayTotalOut = accountsData.reduce((sum, acc) => sum + acc.todayOut, 0);

  return (
    <AppLayout>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">资金管理中心</h1>
          <p className="text-muted-foreground">多账户资金归集、智能预测、自动对账</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleSyncAll}
          >
            <RefreshCw className="w-4 h-4" />
            同步全部账户
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setTransferDialogOpen(true)}
          >
            <ArrowRightLeft className="w-4 h-4" />
            资金调拨
          </Button>
          <Button 
            className="gap-2"
            onClick={() => setWithdrawDialogOpen(true)}
          >
            <Banknote className="w-4 h-4" />
            发起提现
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="overview">资金总览</TabsTrigger>
          <TabsTrigger value="accounts">多账户管理</TabsTrigger>
          <TabsTrigger value="forecast">资金预测</TabsTrigger>
          <TabsTrigger value="withdrawal">提现管理</TabsTrigger>
          <TabsTrigger value="reconciliation">自动对账</TabsTrigger>
        </TabsList>

        {/* 资金总览 Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* 资金概览卡片 */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  资金总额
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">¥{totalBalance.toLocaleString()}</div>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">可用资金</p>
                    <p className="font-medium text-success">¥{totalAvailable.toLocaleString()}</p>
                  </div>
                  <div className="w-px h-8 bg-border"></div>
                  <div>
                    <p className="text-muted-foreground text-xs">冻结资金</p>
                    <p className="font-medium text-warning">¥{totalFrozen.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-success" />
                  今日收入
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">+¥{todayTotalIn.toLocaleString()}</div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span>较昨日 <span className="text-success">+12.5%</span></span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-danger" />
                  今日支出
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-danger">-¥{todayTotalOut.toLocaleString()}</div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingDown className="w-3 h-3 text-success" />
                  <span>较昨日 <span className="text-success">-8.3%</span></span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CircleDollarSign className="w-4 h-4 text-blue-500" />
                  今日净流入
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">+¥{(todayTotalIn - todayTotalOut).toLocaleString()}</div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="w-3 h-3" />
                  <span>本月累计净流入 ¥320,000</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 账户分布 + 资金流水 */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* 账户分布 */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">账户资金分布</CardTitle>
                <CardDescription>各账户余额占比</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {accountsData.map((account) => (
                  <div key={account.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{account.icon}</span>
                        <span className="font-medium">{account.name}</span>
                      </div>
                      <span className="font-bold">¥{account.balance.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(account.balance / totalBalance) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>占比 {((account.balance / totalBalance) * 100).toFixed(1)}%</span>
                      <span>可用 ¥{account.available.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 资金流水 */}
            <Card className="md:col-span-2 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>实时资金流水</CardTitle>
                    <CardDescription>最近的收支记录明细</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="w-4 h-4" />
                    查看全部
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>时间</TableHead>
                      <TableHead>类型/摘要</TableHead>
                      <TableHead>账户</TableHead>
                      <TableHead className="text-right">金额</TableHead>
                      <TableHead className="text-right">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 5).map((trx) => (
                      <TableRow key={trx.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="text-muted-foreground text-sm">{trx.time}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{trx.category}</span>
                            <span className="text-xs text-muted-foreground">{trx.desc}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{trx.account}</TableCell>
                        <TableCell className={`text-right font-bold ${trx.type === 'income' ? 'text-success' : trx.type === 'transfer' ? 'text-blue-600' : 'text-foreground'}`}>
                          {trx.type === 'income' ? '+' : trx.type === 'transfer' ? '↔' : ''}{trx.type === 'transfer' ? '' : (trx.amount > 0 ? '' : '')}{Math.abs(trx.amount).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 border-transparent">
                            成功
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 多账户管理 Tab */}
        <TabsContent value="accounts" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {accountsData.map((account) => (
              <Card key={account.id} className={`shadow-sm hover:shadow-md transition-shadow cursor-pointer ${account.status === 'warning' ? 'border-warning/50' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                        {account.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{account.name}</CardTitle>
                        <CardDescription>
                          {account.type === 'platform' ? '电商平台账户' : account.type === 'bank' ? '银行/支付账户' : '推广账户'}
                        </CardDescription>
                      </div>
                    </div>
                    {account.status === 'warning' && (
                      <Badge variant="outline" className="border-warning text-warning">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        余额不足
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">¥{account.balance.toLocaleString()}</div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">可用余额</p>
                      <p className="font-medium text-success">¥{account.available.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">冻结金额</p>
                      <p className="font-medium text-warning">¥{account.frozen.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">今日净流入</p>
                      <p className={`font-medium ${account.todayIn - account.todayOut >= 0 ? 'text-success' : 'text-danger'}`}>
                        {account.todayIn - account.todayOut >= 0 ? '+' : ''}¥{(account.todayIn - account.todayOut).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">查看流水</Button>
                    <Button variant="outline" size="sm" className="flex-1">资金调拨</Button>
                    {account.type === 'platform' && (
                      <Button size="sm" className="flex-1">提现</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 资金预测 Tab */}
        <TabsContent value="forecast" className="space-y-6">
          {/* 预测概览 */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  未来7天资金预测
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-success/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-5 h-5 text-success" />
                      <span>预计收入</span>
                    </div>
                    <span className="text-xl font-bold text-success">+¥{forecastData.next7Days.expectedIn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-danger/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="w-5 h-5 text-danger" />
                      <span>预计支出</span>
                    </div>
                    <span className="text-xl font-bold text-danger">-¥{forecastData.next7Days.expectedOut.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border-2 border-primary/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="font-medium">预计净流入</span>
                    </div>
                    <span className="text-xl font-bold text-primary">+¥{forecastData.next7Days.netFlow.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  未来30天资金预测
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-success/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-5 h-5 text-success" />
                      <span>预计收入</span>
                    </div>
                    <span className="text-xl font-bold text-success">+¥{forecastData.next30Days.expectedIn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-danger/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="w-5 h-5 text-danger" />
                      <span>预计支出</span>
                    </div>
                    <span className="text-xl font-bold text-danger">-¥{forecastData.next30Days.expectedOut.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border-2 border-primary/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="font-medium">预计净流入</span>
                    </div>
                    <span className="text-xl font-bold text-primary">+¥{forecastData.next30Days.netFlow.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 资金预警 */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                资金预警提醒
              </CardTitle>
              <CardDescription>未来重要资金收支事项</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {forecastData.alerts.map((alert, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${alert.type === 'expense' ? 'bg-danger/5 border border-danger/20' : 'bg-success/5 border border-success/20'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.type === 'expense' ? 'bg-danger/10' : 'bg-success/10'}`}>
                        {alert.type === 'expense' ? (
                          <ArrowDownRight className="w-5 h-5 text-danger" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-success" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{alert.desc}</p>
                        <p className="text-sm text-muted-foreground">{alert.date}</p>
                      </div>
                    </div>
                    <span className={`text-xl font-bold ${alert.type === 'expense' ? 'text-danger' : 'text-success'}`}>
                      {alert.type === 'expense' ? '-' : '+'}¥{alert.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 提现管理 Tab */}
        <TabsContent value="withdrawal" className="space-y-6">
          {/* 提现概览 */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">可提现金额</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">¥265,000.00</div>
                <p className="text-xs text-muted-foreground mt-2">来自抖音店铺主账户</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">本月已提现</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">¥185,000.00</div>
                <p className="text-xs text-muted-foreground mt-2">共 4 笔提现</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">提现中金额</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">¥0.00</div>
                <p className="text-xs text-muted-foreground mt-2">无处理中的提现</p>
              </CardContent>
            </Card>
          </div>

          {/* 提现记录 */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>提现记录</CardTitle>
                  <CardDescription>历史提现明细</CardDescription>
                </div>
                <Button className="gap-2">
                  <Banknote className="w-4 h-4" />
                  发起新提现
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>提现单号</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>提现金额</TableHead>
                    <TableHead>来源账户</TableHead>
                    <TableHead>到账账户</TableHead>
                    <TableHead>手续费</TableHead>
                    <TableHead className="text-right">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawalRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell className="font-bold">¥{record.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{record.from}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{record.to}</TableCell>
                      <TableCell>¥{record.fee.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          已完成
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 自动对账 Tab */}
        <TabsContent value="reconciliation" className="space-y-6">
          {/* 对账概览 */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-sm border-l-4 border-l-success">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">今日对账状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                  <span className="text-xl font-bold text-success">账单一致</span>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">平台流水总额</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥45,800.00</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">系统订单总额</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥45,800.00</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">差异金额</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">¥0.00</div>
              </CardContent>
            </Card>
          </div>

          {/* 对账详情 */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">对账规则配置</CardTitle>
                <CardDescription>自动对账匹配规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>订单号自动匹配</span>
                  </div>
                  <Badge variant="secondary">已启用</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>金额容差匹配 (±0.01元)</span>
                  </div>
                  <Badge variant="secondary">已启用</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>自动标记异常流水</span>
                  </div>
                  <Badge variant="secondary">已启用</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>每日自动对账时间</span>
                  </div>
                  <span className="font-medium">00:30</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-warning">
              <CardHeader>
                <CardTitle className="text-base">异常账单提醒</CardTitle>
                <CardDescription>需要人工处理的异常记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 p-4 bg-warning/5 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">发现 2 笔未匹配流水</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2026-01-08 有两笔小额打款未在系统订单中找到对应记录，请手动核销。
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">查看详情</Button>
                      <Button size="sm">去处理</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* 资金调拨对话框 */}
      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>资金调拨</DialogTitle>
            <DialogDescription>
              在不同账户之间调拨资金
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fromAccount" className="text-right">转出账户</Label>
              <Select value={transferForm.fromAccount} onValueChange={(v) => setTransferForm({...transferForm, fromAccount: v})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择转出账户" />
                </SelectTrigger>
                <SelectContent>
                  {accountsData.map((acc) => (
                    <SelectItem key={acc.id} value={String(acc.id)}>{acc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="toAccount" className="text-right">转入账户</Label>
              <Select value={transferForm.toAccount} onValueChange={(v) => setTransferForm({...transferForm, toAccount: v})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择转入账户" />
                </SelectTrigger>
                <SelectContent>
                  {accountsData.map((acc) => (
                    <SelectItem key={acc.id} value={String(acc.id)}>{acc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">调拨金额</Label>
              <Input
                id="amount"
                type="number"
                placeholder="输入金额"
                className="col-span-3"
                value={transferForm.amount}
                onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>取消</Button>
            <Button onClick={handleTransfer} disabled={transferMutation.isPending}>
              {transferMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              确认调拨
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 发起提现对话框 */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>发起提现</DialogTitle>
            <DialogDescription>
              将平台账户资金提现到银行账户
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account" className="text-right">提现账户</Label>
              <Select value={withdrawForm.account} onValueChange={(v) => setWithdrawForm({...withdrawForm, account: v})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择提现账户" />
                </SelectTrigger>
                <SelectContent>
                  {accountsData.filter(acc => acc.type === "platform").map((acc) => (
                    <SelectItem key={acc.id} value={String(acc.id)}>{acc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bankAccount" className="text-right">到账银行</Label>
              <Select value={withdrawForm.bankAccount} onValueChange={(v) => setWithdrawForm({...withdrawForm, bankAccount: v})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择到账银行" />
                </SelectTrigger>
                <SelectContent>
                  {accountsData.filter(acc => acc.type === "bank").map((acc) => (
                    <SelectItem key={acc.id} value={String(acc.id)}>{acc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="withdrawAmount" className="text-right">提现金额</Label>
              <Input
                id="withdrawAmount"
                type="number"
                placeholder="输入金额"
                className="col-span-3"
                value={withdrawForm.amount}
                onChange={(e) => setWithdrawForm({...withdrawForm, amount: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>取消</Button>
            <Button onClick={handleWithdraw} disabled={withdrawMutation.isPending}>
              {withdrawMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              确认提现
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AppLayout>
  );
}
