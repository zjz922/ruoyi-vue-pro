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
  Wallet,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

// 预警规则数据
const alertRulesData = [
  {
    id: 1,
    name: "账户余额不足预警",
    type: "资金预警",
    level: "high",
    condition: "账户余额 < ¥5,000",
    threshold: "5000",
    channels: ["抖音支付", "支付宝"],
    notifyMethod: "系统通知+短信",
    status: true,
    triggerCount: 12,
    lastTrigger: "2024-01-15 09:00",
  },
  {
    id: 2,
    name: "大额交易提醒",
    type: "交易预警",
    level: "medium",
    condition: "单笔交易 > ¥30,000",
    threshold: "30000",
    channels: ["全部渠道"],
    notifyMethod: "系统通知",
    status: true,
    triggerCount: 5,
    lastTrigger: "2024-01-14 11:00",
  },
  {
    id: 3,
    name: "未提现金额超限",
    type: "资金预警",
    level: "high",
    condition: "未提现金额 > ¥50,000 且 > 7天",
    threshold: "50000",
    channels: ["抖音支付", "快手支付"],
    notifyMethod: "系统通知+邮件",
    status: true,
    triggerCount: 3,
    lastTrigger: "2024-01-15 09:00",
  },
  {
    id: 4,
    name: "对账差异超限",
    type: "对账预警",
    level: "medium",
    condition: "累计差异金额 > ¥3,000",
    threshold: "3000",
    channels: ["全部渠道"],
    notifyMethod: "系统通知",
    status: true,
    triggerCount: 8,
    lastTrigger: "2024-01-14 16:00",
  },
  {
    id: 5,
    name: "退款率异常预警",
    type: "业务预警",
    level: "medium",
    condition: "7日退款率 > 3.5%",
    threshold: "3.5",
    channels: ["全部店铺"],
    notifyMethod: "系统通知+短信",
    status: false,
    triggerCount: 2,
    lastTrigger: "2024-01-10 14:00",
  },
];

export default function CashierAlertRules() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
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
                  <Input placeholder="输入规则名称" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>预警类型</Label>
                    <Select>
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
                    <Select>
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
                    <Select>
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
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="条件" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lt">&lt; 小于</SelectItem>
                        <SelectItem value="gt">&gt; 大于</SelectItem>
                        <SelectItem value="eq">= 等于</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="阈值" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>适用渠道</Label>
                  <Select>
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
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">系统通知</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">短信</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">邮件</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>规则描述</Label>
                  <Textarea placeholder="描述规则的用途和触发场景" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsAddModalOpen(false)}>
                  保存规则
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Shield className="w-4 h-4" />
              规则总数
            </div>
            <div className="text-2xl font-bold text-gray-900">{alertRulesData.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              已启用 {alertRulesData.filter(r => r.status).length} 个
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <AlertTriangle className="w-4 h-4" />
              高危规则
            </div>
            <div className="text-2xl font-bold text-red-600">
              {alertRulesData.filter(r => r.level === "high").length}
            </div>
            <div className="text-xs text-gray-500 mt-1">需重点关注</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Bell className="w-4 h-4" />
              本月触发
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {alertRulesData.reduce((sum, r) => sum + r.triggerCount, 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">累计触发次数</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              有效率
            </div>
            <div className="text-2xl font-bold text-green-600">92%</div>
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
                    {rule.lastTrigger}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={rule.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
