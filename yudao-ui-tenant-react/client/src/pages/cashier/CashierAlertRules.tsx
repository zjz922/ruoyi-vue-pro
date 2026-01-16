import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  Plus,
  Settings,
  Trash2,
  Copy,
  Bell,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import {
  useAlertRuleList,
  useAlertRuleCreate,
  useAlertRuleUpdate,
  useAlertRuleDelete,
} from "@/hooks/useCashier";
import { toast } from "sonner";

// ============ 类型定义 ============

interface AlertRule {
  id: number;
  name: string;
  type: string;
  level: string;
  condition: string;
  threshold: string;
  channels: string[];
  notifyMethod: string;
  status: boolean;
  triggerCount: number;
  lastTrigger: string;
}

interface AlertRulesApiData {
  records?: AlertRule[];
  stats?: {
    total: number;
    enabled: number;
    high: number;
    triggerCount: number;
    accuracy: number;
  };
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

export default function CashierAlertRules() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    type: "",
    level: "",
    metric: "",
    operator: "",
    threshold: "",
    channel: "",
    notifySystem: true,
    notifySms: false,
    notifyEmail: false,
    description: "",
  });

  // API调用
  const { data: rulesApiData, isLoading, error, refetch } = useAlertRuleList(shopId);
  const createMutation = useAlertRuleCreate();
  const updateMutation = useAlertRuleUpdate();
  const deleteMutation = useAlertRuleDelete();

  // 类型断言
  const typedApiData = rulesApiData as AlertRulesApiData | undefined;

  // 从API响应中提取数据
  const alertRulesData = useMemo<AlertRule[]>(() => {
    return typedApiData?.records || [];
  }, [typedApiData]);

  const stats = useMemo(() => {
    if (typedApiData?.stats) {
      return typedApiData.stats;
    }
    return {
      total: alertRulesData.length,
      enabled: alertRulesData.filter(r => r.status).length,
      high: alertRulesData.filter(r => r.level === "high").length,
      triggerCount: alertRulesData.reduce((sum, r) => sum + r.triggerCount, 0),
      accuracy: 0,
    };
  }, [typedApiData, alertRulesData]);

  // 检查是否有数据
  const hasData = alertRulesData.length > 0;

  // 刷新
  const handleRefresh = useCallback(() => {
    refetch();
    toast.success("数据已刷新");
  }, [refetch]);

  // 创建规则
  const handleCreateRule = useCallback(() => {
    createMutation.mutate({
      shopId,
      name: newRule.name,
      type: newRule.type,
      level: newRule.level as "high" | "medium" | "low",
      condition: {
        field: newRule.metric,
        operator: newRule.operator as "gt" | "lt" | "eq" | "gte" | "lte",
        value: parseFloat(newRule.threshold) || 0,
      },
      enabled: true,
      notifyChannels: [
        newRule.notifySystem && "system",
        newRule.notifySms && "sms",
        newRule.notifyEmail && "email",
      ].filter(Boolean) as string[],
    }, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setNewRule({
          name: "",
          type: "",
          level: "",
          metric: "",
          operator: "",
          threshold: "",
          channel: "",
          notifySystem: true,
          notifySms: false,
          notifyEmail: false,
          description: "",
        });
        refetch();
      },
    });
  }, [createMutation, shopId, newRule, refetch]);

  // 切换规则状态
  const handleToggleStatus = useCallback((rule: AlertRule) => {
    updateMutation.mutate({
      ruleId: rule.id,
      enabled: !rule.status,
    }, {
      onSuccess: () => refetch(),
    });
  }, [updateMutation, refetch]);

  // 删除规则
  const handleDeleteRule = useCallback((rule: AlertRule) => {
    if (confirm(`确定要删除规则"${rule.name}"吗？`)) {
      deleteMutation.mutate({ ruleId: rule.id }, {
        onSuccess: () => refetch(),
      });
    }
  }, [deleteMutation, refetch]);

  // 复制规则
  const handleCopyRule = useCallback((rule: AlertRule) => {
    toast.info(`复制规则: ${rule.name}`);
  }, []);

  // 编辑规则
  const handleEditRule = useCallback((rule: AlertRule) => {
    toast.info(`编辑规则: ${rule.name}`);
  }, []);

  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">预警规则</h1>
          <p className="text-sm text-gray-500 mt-1">
            配置和管理财务预警规则
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                新增规则
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>新增预警规则</DialogTitle>
                <DialogDescription>
                  配置新的财务预警规则
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>规则名称</Label>
                  <Input 
                    placeholder="输入规则名称" 
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>预警类型</Label>
                    <Select value={newRule.type} onValueChange={(v) => setNewRule(prev => ({ ...prev, type: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fund">资金预警</SelectItem>
                        <SelectItem value="transaction">交易预警</SelectItem>
                        <SelectItem value="reconcile">对账预警</SelectItem>
                        <SelectItem value="business">业务预警</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>预警级别</Label>
                    <Select value={newRule.level} onValueChange={(v) => setNewRule(prev => ({ ...prev, level: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择级别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">高危</SelectItem>
                        <SelectItem value="medium">中危</SelectItem>
                        <SelectItem value="low">低危</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>触发条件</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Select value={newRule.metric} onValueChange={(v) => setNewRule(prev => ({ ...prev, metric: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="指标" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balance">账户余额</SelectItem>
                        <SelectItem value="transaction">单笔交易</SelectItem>
                        <SelectItem value="diff">差异金额</SelectItem>
                        <SelectItem value="refund">退款率</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={newRule.operator} onValueChange={(v) => setNewRule(prev => ({ ...prev, operator: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="条件" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lt">&lt; 小于</SelectItem>
                        <SelectItem value="gt">&gt; 大于</SelectItem>
                        <SelectItem value="eq">= 等于</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      placeholder="阈值" 
                      value={newRule.threshold}
                      onChange={(e) => setNewRule(prev => ({ ...prev, threshold: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>适用渠道</Label>
                  <Select value={newRule.channel} onValueChange={(v) => setNewRule(prev => ({ ...prev, channel: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择渠道" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部渠道</SelectItem>
                      <SelectItem value="douyin">抖音支付</SelectItem>
                      <SelectItem value="alipay">支付宝</SelectItem>
                      <SelectItem value="wechat">微信支付</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>通知方式</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={newRule.notifySystem}
                        onChange={(e) => setNewRule(prev => ({ ...prev, notifySystem: e.target.checked }))}
                        className="rounded" 
                      />
                      <span className="text-sm">系统通知</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={newRule.notifySms}
                        onChange={(e) => setNewRule(prev => ({ ...prev, notifySms: e.target.checked }))}
                        className="rounded" 
                      />
                      <span className="text-sm">短信</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={newRule.notifyEmail}
                        onChange={(e) => setNewRule(prev => ({ ...prev, notifyEmail: e.target.checked }))}
                        className="rounded" 
                      />
                      <span className="text-sm">邮件</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>规则描述</Label>
                  <Textarea 
                    placeholder="描述规则的用途和触发场景" 
                    value={newRule.description}
                    onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  取消
                </Button>
                <Button 
                  onClick={handleCreateRule}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? '保存中...' : '保存规则'}
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
                  <Shield className="w-4 h-4" />
                  规则总数
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-xs text-gray-500 mt-1">
                  已启用 {stats.enabled} 个
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  高危规则
                </div>
                <div className="text-2xl font-bold text-red-600">{stats.high}</div>
                <div className="text-xs text-gray-500 mt-1">需重点关注</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Bell className="w-4 h-4" />
                  本月触发
                </div>
                <div className="text-2xl font-bold text-yellow-600">{stats.triggerCount}</div>
                <div className="text-xs text-gray-500 mt-1">累计触发次数</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  有效率
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
                <div className="text-xs text-gray-500 mt-1">规则触发准确率</div>
              </CardContent>
            </Card>
          </div>

          {/* 规则列表 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">规则列表</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {hasData ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>规则名称</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>级别</TableHead>
                      <TableHead>触发条件</TableHead>
                      <TableHead>适用渠道</TableHead>
                      <TableHead>通知方式</TableHead>
                      <TableHead className="text-center">触发次数</TableHead>
                      <TableHead>最近触发</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alertRulesData.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{rule.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{rule.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="default"
                            className={
                              rule.level === "high"
                                ? "bg-red-100 text-red-700"
                                : rule.level === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }
                          >
                            {rule.level === "high" ? "高危" : rule.level === "medium" ? "中危" : "低危"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {rule.condition}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {rule.channels.join(", ")}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {rule.notifyMethod}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{rule.triggerCount}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {rule.lastTrigger || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={rule.status} 
                            onCheckedChange={() => handleToggleStatus(rule)}
                            disabled={updateMutation.isPending}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditRule(rule)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleCopyRule(rule)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500"
                              onClick={() => handleDeleteRule(rule)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState message="暂无预警规则，请点击新增规则" icon={Shield} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AppLayout>
  );
}
