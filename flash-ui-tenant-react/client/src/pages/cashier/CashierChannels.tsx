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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  CreditCard,
  Wallet,
  TrendingUp,
  TrendingDown,
  Settings,
  MoreVertical,
  RefreshCw,
  AlertCircle,
  Loader2,
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
} from "recharts";
import { useState, useMemo, useCallback } from "react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useChannelList,
  useChannelAdd,
  useChannelSyncBalance,
  useChannelUpdateStatus,
} from "@/hooks/useCashier";
import { toast } from "sonner";

// ============ 类型定义 ============

interface Channel {
  id: number;
  name: string;
  type: string;
  balance: number;
  todayIncome: number;
  todayExpense: number;
  status: string;
  lastSync: string;
}

interface ChannelsApiData {
  channels?: Channel[];
  stats?: {
    total: number;
    active: number;
    totalBalance: number;
    todayIncome: number;
    todayExpense: number;
    balanceChange: number;
  };
  balanceDistribution?: Array<{ name: string; value: number; color: string }>;
  transactionFrequency?: Array<{ name: string; count: number }>;
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
const COLORS = ["#1890ff", "#52c41a", "#faad14", "#722ed1", "#13c2c2", "#eb2f96"];

export default function CashierChannels() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedChannelIds, setSelectedChannelIds] = useState<number[]>([]);
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    accountNo: "",
    initialBalance: 0,
    remark: "",
  });
  
  // API调用
  const { data: channelApiData, isLoading, error, refetch } = useChannelList(shopId);
  const addMutation = useChannelAdd();
  const syncMutation = useChannelSyncBalance();
  const statusMutation = useChannelUpdateStatus();
  
  // 类型断言
  const typedApiData = channelApiData as ChannelsApiData | undefined;
  
  // 从API响应中提取数据
  const channelsData = useMemo<Channel[]>(() => {
    return typedApiData?.channels || [];
  }, [typedApiData]);

  const stats = useMemo(() => {
    if (typedApiData?.stats) {
      return typedApiData.stats;
    }
    return {
      total: channelsData.length,
      active: channelsData.filter(c => c.status === "正常" || c.status === "normal").length,
      totalBalance: channelsData.reduce((sum, ch) => sum + (ch.balance || 0), 0),
      todayIncome: channelsData.reduce((sum, ch) => sum + (ch.todayIncome || 0), 0),
      todayExpense: channelsData.reduce((sum, ch) => sum + (ch.todayExpense || 0), 0),
      balanceChange: 0,
    };
  }, [typedApiData, channelsData]);

  const balanceDistribution = useMemo(() => {
    if (typedApiData?.balanceDistribution) {
      return typedApiData.balanceDistribution;
    }
    return channelsData.map((ch, index) => ({
      name: ch.name,
      value: ch.balance,
      color: COLORS[index % COLORS.length],
    }));
  }, [typedApiData, channelsData]);

  const transactionFrequency = useMemo(() => {
    if (typedApiData?.transactionFrequency) {
      return typedApiData.transactionFrequency;
    }
    return channelsData.map(ch => ({
      name: ch.name,
      count: 0,
    }));
  }, [typedApiData, channelsData]);

  // 检查是否有数据
  const hasData = channelsData.length > 0;
  
  // 新增渠道
  const handleAddChannel = useCallback(() => {
    if (!formData.name || !formData.type) {
      toast.error("请填写必填字段");
      return;
    }
    addMutation.mutate({
      shopId,
      name: formData.name,
      type: formData.type,
      accountNo: formData.accountNo,
      initialBalance: formData.initialBalance,
      remark: formData.remark,
    }, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setFormData({ name: "", type: "", accountNo: "", initialBalance: 0, remark: "" });
        refetch();
      },
    });
  }, [addMutation, shopId, formData, refetch]);
  
  // 同步余额
  const handleSyncBalance = useCallback(() => {
    const ids = selectedChannelIds.length > 0 ? selectedChannelIds : channelsData.map(ch => ch.id);
    syncMutation.mutate({
      channelIds: ids,
      syncDoudian: true,
      syncQianchuan: true,
      syncJushuitan: true,
    }, {
      onSuccess: () => {
        refetch();
        setSelectedChannelIds([]);
        toast.success("余额同步成功");
      },
    });
  }, [syncMutation, selectedChannelIds, channelsData, refetch]);
  
  // 启用/禁用渠道
  const handleToggleStatus = useCallback((id: number, currentStatus: string) => {
    const newStatus = currentStatus === "normal" || currentStatus === "正常" ? "disabled" : "normal";
    statusMutation.mutate({ id, status: newStatus as "normal" | "disabled" }, {
      onSuccess: () => refetch(),
    });
  }, [statusMutation, refetch]);

  // 刷新
  const handleRefresh = useCallback(() => {
    refetch();
    toast.success("数据已刷新");
  }, [refetch]);

  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">渠道管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            管理所有资金渠道和账户信息
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleSyncBalance}
            disabled={syncMutation.isPending || isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
            {syncMutation.isPending ? '同步中...' : '同步余额'}
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                新增渠道
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>新增资金渠道</DialogTitle>
                <DialogDescription>
                  添加新的资金渠道账户
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>渠道名称</Label>
                  <Input 
                    placeholder="输入渠道名称" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>渠道类型</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platform">电商平台</SelectItem>
                      <SelectItem value="payment">第三方支付</SelectItem>
                      <SelectItem value="bank">银行账户</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>账户标识</Label>
                  <Input 
                    placeholder="账户ID或账号" 
                    value={formData.accountNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountNo: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>初始余额</Label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.initialBalance}
                    onChange={(e) => setFormData(prev => ({ ...prev, initialBalance: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>备注</Label>
                  <Input 
                    placeholder="备注信息（可选）" 
                    value={formData.remark}
                    onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  取消
                </Button>
                <Button 
                  onClick={handleAddChannel}
                  disabled={addMutation.isPending}
                >
                  {addMutation.isPending ? '添加中...' : '确认添加'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <CreditCard className="w-4 h-4" />
                  渠道总数
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-xs text-gray-500 mt-1">
                  活跃 {stats.active} 个
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Wallet className="w-4 h-4" />
                  总余额
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ¥{stats.totalBalance.toLocaleString()}
                </div>
                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  较昨日 {stats.balanceChange >= 0 ? '+' : ''}{stats.balanceChange}%
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <TrendingDown className="w-4 h-4" />
                  今日收入
                </div>
                <div className="text-2xl font-bold text-green-600">
                  +¥{stats.todayIncome.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">所有渠道合计</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  今日支出
                </div>
                <div className="text-2xl font-bold text-red-600">
                  -¥{stats.todayExpense.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">所有渠道合计</div>
              </CardContent>
            </Card>
          </div>

          {/* 图表区域 */}
          {hasData && (
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">渠道余额分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    {balanceDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={balanceDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ¥${(value/1000).toFixed(1)}k`}
                          >
                            {balanceDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState message="暂无余额分布数据" icon={Wallet} />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">渠道交易频率（本月）</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    {transactionFrequency.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={transactionFrequency} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis type="number" stroke="#8c8c8c" fontSize={12} />
                          <YAxis dataKey="name" type="category" stroke="#8c8c8c" fontSize={12} width={80} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#1890ff" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState message="暂无交易频率数据" icon={CreditCard} />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 渠道列表 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">渠道列表</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {hasData ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>渠道名称</TableHead>
                      <TableHead>渠道类型</TableHead>
                      <TableHead className="text-right">当前余额</TableHead>
                      <TableHead className="text-right">今日收入</TableHead>
                      <TableHead className="text-right">今日支出</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>最后同步</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {channelsData.map((channel) => (
                      <TableRow key={channel.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <CreditCard className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium">{channel.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{channel.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ¥{channel.balance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          +¥{channel.todayIncome.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          -¥{channel.todayExpense.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={channel.status === "正常" || channel.status === "normal" ? "default" : "secondary"}
                            className={
                              channel.status === "正常" || channel.status === "normal"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          >
                            {channel.status === "normal" ? "正常" : channel.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {channel.lastSync || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toast.info(`编辑渠道: ${channel.name}`)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleToggleStatus(channel.id, channel.status)}
                              disabled={statusMutation.isPending}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState message="暂无渠道数据，请点击新增渠道" icon={CreditCard} />
              )}
            </CardContent>
          </Card>

          {/* 提示信息 */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">温馨提示</div>
              <div className="text-sm text-blue-700 mt-1">
                建议定期同步各渠道余额，确保账务数据准确。如发现余额异常，请及时核对并处理。
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
