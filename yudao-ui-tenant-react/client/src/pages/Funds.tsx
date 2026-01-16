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
  CircleDollarSign,
  Loader2
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
import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useFundsOverview, useFundsAccounts, useFundsTransfer, useFundsWithdraw, useFundsTransactions } from "@/hooks/useLedger";
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

// ============ 类型定义 ============

interface AccountData {
  id: number;
  name: string;
  type: string;
  icon: string;
  balance: number;
  available: number;
  frozen: number;
  todayIn: number;
  todayOut: number;
  status: string;
}

interface TransactionData {
  id: string;
  time: string;
  type: string;
  category: string;
  amount: number;
  status: string;
  desc: string;
  account: string;
}

interface ForecastData {
  next7Days: {
    expectedIn: number;
    expectedOut: number;
    netFlow: number;
  };
  next30Days: {
    expectedIn: number;
    expectedOut: number;
    netFlow: number;
  };
  alerts: Array<{
    date: string;
    type: string;
    desc: string;
    amount: number;
  }>;
}

interface WithdrawalRecord {
  id: string;
  date: string;
  amount: number;
  from: string;
  to: string;
  status: string;
  fee: number;
}

interface FundsApiData {
  accounts?: AccountData[];
  transactions?: TransactionData[];
  forecast?: ForecastData;
  withdrawalRecords?: WithdrawalRecord[];
  stats?: {
    totalBalance: number;
    totalAvailable: number;
    totalFrozen: number;
    todayTotalIn: number;
    todayTotalOut: number;
  };
}

// ============ 空状态组件 ============
function EmptyState({ message, icon: Icon = AlertCircle }: { message: string; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Icon className="h-10 w-10 mb-3 opacity-50" />
      <p className="text-sm">{message}</p>
      <p className="text-xs mt-1">请确认Java后端服务已启动</p>
    </div>
  );
}

// ============ 加载状态组件 ============
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
      <p className="text-sm text-muted-foreground">正在加载数据...</p>
    </div>
  );
}

export default function Funds() {
  const [activeTab, setActiveTab] = useState("overview");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({ fromAccount: "", toAccount: "", amount: "" });
  const [withdrawForm, setWithdrawForm] = useState({ account: "", amount: "", bankAccount: "" });
  
  // 获取店铺信息
  const { currentShopId } = useShopSwitcher();
  
  // 获取资金概览数据
  const { data: fundsApiData, isLoading, error, refetch: refetchFunds } = useFundsOverview();
  
  // 获取账户列表
  const { data: accountsApiData } = useFundsAccounts();
  
  // 获取交易流水
  const { data: transactionsApiData } = useFundsTransactions({});
  
  // 资金调拨
  const transferMutation = useFundsTransfer();
  
  // 发起提现
  const withdrawMutation = useFundsWithdraw();
  
  // 类型断言
  const typedFundsData = fundsApiData as FundsApiData | undefined;
  const typedAccountsData = accountsApiData as { accounts?: AccountData[] } | undefined;
  const typedTransactionsData = transactionsApiData as { list?: TransactionData[] } | undefined;
  
  // 从API响应中提取数据
  const accountsData = useMemo(() => {
    return typedAccountsData?.accounts || typedFundsData?.accounts || [];
  }, [typedAccountsData, typedFundsData]);

  const transactions = useMemo(() => {
    return typedTransactionsData?.list || typedFundsData?.transactions || [];
  }, [typedTransactionsData, typedFundsData]);

  const forecastData = useMemo(() => {
    return typedFundsData?.forecast || {
      next7Days: { expectedIn: 0, expectedOut: 0, netFlow: 0 },
      next30Days: { expectedIn: 0, expectedOut: 0, netFlow: 0 },
      alerts: [],
    };
  }, [typedFundsData]);

  const withdrawalRecords = useMemo(() => {
    return typedFundsData?.withdrawalRecords || [];
  }, [typedFundsData]);

  // 计算总资产
  const stats = useMemo(() => {
    if (typedFundsData?.stats) {
      return typedFundsData.stats;
    }
    return {
      totalBalance: accountsData.reduce((sum, acc) => sum + acc.balance, 0),
      totalAvailable: accountsData.reduce((sum, acc) => sum + acc.available, 0),
      totalFrozen: accountsData.reduce((sum, acc) => sum + acc.frozen, 0),
      todayTotalIn: accountsData.reduce((sum, acc) => sum + acc.todayIn, 0),
      todayTotalOut: accountsData.reduce((sum, acc) => sum + acc.todayOut, 0),
    };
  }, [typedFundsData, accountsData]);

  const [showAccountDetail, setShowAccountDetail] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(null);
  
  // 处理同步全部账户
  const handleSyncAll = useCallback(async () => {
    toast.info("同步功能待Java后端实现");
    refetchFunds();
  }, [refetchFunds]);
  
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
      refetchFunds();
    } catch (error) {
      toast.error("调拨失败，请重试");
    }
  }, [transferMutation, currentShopId, transferForm, refetchFunds]);
  
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
      refetchFunds();
    } catch (error) {
      toast.error("提现失败，请重试");
    }
  }, [withdrawMutation, currentShopId, withdrawForm, refetchFunds]);

  // 查看账户详情
  const handleViewAccount = useCallback((account: AccountData) => {
    setSelectedAccount(account);
    setShowAccountDetail(true);
  }, []);

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

      {/* 加载状态 */}
      {isLoading && <LoadingState />}

      {/* 错误状态 */}
      {error && !isLoading && (
        <EmptyState message="数据加载失败，请检查网络连接" icon={AlertCircle} />
      )}

      {/* 有数据时显示内容 */}
      {!isLoading && !error && (
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
                  <div className="text-3xl font-bold text-primary">¥{stats.totalBalance.toLocaleString()}</div>
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">可用资金</p>
                      <p className="font-medium text-success">¥{stats.totalAvailable.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div>
                      <p className="text-muted-foreground text-xs">冻结资金</p>
                      <p className="font-medium text-warning">¥{stats.totalFrozen.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <ArrowDownRight className="w-4 h-4 text-success" />
                    今日收入
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">+¥{stats.todayTotalIn.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    较昨日 <span className="text-success">+12.5%</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-danger" />
                    今日支出
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-danger">-¥{stats.todayTotalOut.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    较昨日 <span className="text-danger">+8.3%</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    关联账户
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{accountsData.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {accountsData.filter(a => a.status === 'normal').length} 个正常 · {accountsData.filter(a => a.status === 'warning').length} 个预警
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 账户列表 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">账户概览</CardTitle>
                <CardDescription>各账户资金余额与今日流水</CardDescription>
              </CardHeader>
              <CardContent>
                {accountsData.length > 0 ? (
                  <div className="space-y-4">
                    {accountsData.map((account) => (
                      <div 
                        key={account.id} 
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleViewAccount(account)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{account.icon}</div>
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-muted-foreground">
                              可用 ¥{account.available.toLocaleString()}
                              {account.frozen > 0 && ` · 冻结 ¥${account.frozen.toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-bold">¥{account.balance.toLocaleString()}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-success">+{account.todayIn.toLocaleString()}</span>
                              <span className="text-danger">-{account.todayOut.toLocaleString()}</span>
                            </div>
                          </div>
                          <Badge variant={account.status === 'normal' ? 'outline' : 'destructive'}>
                            {account.status === 'normal' ? '正常' : '预警'}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState message="暂无账户数据" icon={Wallet} />
                )}
              </CardContent>
            </Card>

            {/* 最近流水 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">最近流水</CardTitle>
                <CardDescription>今日资金变动记录</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>时间</TableHead>
                        <TableHead>类型</TableHead>
                        <TableHead>描述</TableHead>
                        <TableHead>账户</TableHead>
                        <TableHead className="text-right">金额</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.slice(0, 6).map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="text-muted-foreground">{tx.time}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{tx.category}</Badge>
                          </TableCell>
                          <TableCell>{tx.desc}</TableCell>
                          <TableCell className="text-muted-foreground">{tx.account}</TableCell>
                          <TableCell className={`text-right font-medium ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                            {tx.amount > 0 ? '+' : ''}¥{Math.abs(tx.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-success/10 text-success">
                              {tx.status === 'success' ? '成功' : tx.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState message="暂无流水数据" icon={FileText} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 多账户管理 Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">账户管理</CardTitle>
                <CardDescription>管理所有关联账户</CardDescription>
              </CardHeader>
              <CardContent>
                {accountsData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>账户名称</TableHead>
                        <TableHead>类型</TableHead>
                        <TableHead className="text-right">余额</TableHead>
                        <TableHead className="text-right">可用</TableHead>
                        <TableHead className="text-right">冻结</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountsData.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{account.icon}</span>
                              <span className="font-medium">{account.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {account.type === 'platform' ? '平台' : account.type === 'bank' ? '银行' : '推广'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">¥{account.balance.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-success">¥{account.available.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-warning">¥{account.frozen.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={account.status === 'normal' ? 'outline' : 'destructive'}>
                              {account.status === 'normal' ? '正常' : '预警'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewAccount(account)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState message="暂无账户数据" icon={Building2} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 资金预测 Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    未来7天预测
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">预计收入</span>
                      <span className="font-medium text-success">+¥{forecastData.next7Days.expectedIn.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">预计支出</span>
                      <span className="font-medium text-danger">-¥{forecastData.next7Days.expectedOut.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between">
                      <span className="font-medium">净流入</span>
                      <span className={`font-bold ${forecastData.next7Days.netFlow >= 0 ? 'text-success' : 'text-danger'}`}>
                        {forecastData.next7Days.netFlow >= 0 ? '+' : ''}¥{forecastData.next7Days.netFlow.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    未来30天预测
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">预计收入</span>
                      <span className="font-medium text-success">+¥{forecastData.next30Days.expectedIn.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">预计支出</span>
                      <span className="font-medium text-danger">-¥{forecastData.next30Days.expectedOut.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between">
                      <span className="font-medium">净流入</span>
                      <span className={`font-bold ${forecastData.next30Days.netFlow >= 0 ? 'text-success' : 'text-danger'}`}>
                        {forecastData.next30Days.netFlow >= 0 ? '+' : ''}¥{forecastData.next30Days.netFlow.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  资金预警
                </CardTitle>
              </CardHeader>
              <CardContent>
                {forecastData.alerts.length > 0 ? (
                  <div className="space-y-3">
                    {forecastData.alerts.map((alert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Badge variant={alert.type === 'expense' ? 'destructive' : 'default'}>
                            {alert.type === 'expense' ? '支出' : '收入'}
                          </Badge>
                          <div>
                            <p className="font-medium">{alert.desc}</p>
                            <p className="text-sm text-muted-foreground">{alert.date}</p>
                          </div>
                        </div>
                        <span className={`font-bold ${alert.type === 'expense' ? 'text-danger' : 'text-success'}`}>
                          {alert.type === 'expense' ? '-' : '+'}¥{alert.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState message="暂无资金预警" icon={AlertTriangle} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 提现管理 Tab */}
          <TabsContent value="withdrawal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">提现记录</CardTitle>
                <CardDescription>历史提现申请记录</CardDescription>
              </CardHeader>
              <CardContent>
                {withdrawalRecords.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>提现单号</TableHead>
                        <TableHead>日期</TableHead>
                        <TableHead>来源账户</TableHead>
                        <TableHead>目标账户</TableHead>
                        <TableHead className="text-right">金额</TableHead>
                        <TableHead className="text-right">手续费</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawalRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono">{record.id}</TableCell>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.from}</TableCell>
                          <TableCell>{record.to}</TableCell>
                          <TableCell className="text-right font-medium">¥{record.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-muted-foreground">¥{record.fee}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-success/10 text-success">
                              {record.status === 'completed' ? '已完成' : record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState message="暂无提现记录" icon={Banknote} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 自动对账 Tab */}
          <TabsContent value="reconciliation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">自动对账</CardTitle>
                <CardDescription>系统自动对账功能</CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyState message="自动对账功能待Java后端实现" icon={CheckCircle2} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* 资金调拨对话框 */}
      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>资金调拨</DialogTitle>
            <DialogDescription>在不同账户之间转移资金</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>转出账户</Label>
              <Select value={transferForm.fromAccount} onValueChange={(v) => setTransferForm(f => ({ ...f, fromAccount: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="选择转出账户" />
                </SelectTrigger>
                <SelectContent>
                  {accountsData.map((acc) => (
                    <SelectItem key={acc.id} value={String(acc.id)}>{acc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>转入账户</Label>
              <Select value={transferForm.toAccount} onValueChange={(v) => setTransferForm(f => ({ ...f, toAccount: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="选择转入账户" />
                </SelectTrigger>
                <SelectContent>
                  {accountsData.map((acc) => (
                    <SelectItem key={acc.id} value={String(acc.id)}>{acc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>调拨金额</Label>
              <Input 
                type="number" 
                placeholder="请输入金额"
                value={transferForm.amount}
                onChange={(e) => setTransferForm(f => ({ ...f, amount: e.target.value }))}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>发起提现</DialogTitle>
            <DialogDescription>将资金提现到银行账户</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>提现账户</Label>
              <Select value={withdrawForm.account} onValueChange={(v) => setWithdrawForm(f => ({ ...f, account: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="选择提现账户" />
                </SelectTrigger>
                <SelectContent>
                  {accountsData.filter(a => a.type === 'platform').map((acc) => (
                    <SelectItem key={acc.id} value={String(acc.id)}>{acc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>提现金额</Label>
              <Input 
                type="number" 
                placeholder="请输入金额"
                value={withdrawForm.amount}
                onChange={(e) => setWithdrawForm(f => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>收款银行账户</Label>
              <Input 
                placeholder="请输入银行账号"
                value={withdrawForm.bankAccount}
                onChange={(e) => setWithdrawForm(f => ({ ...f, bankAccount: e.target.value }))}
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
