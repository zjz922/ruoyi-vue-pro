import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  Eye,
  Check,
  X,
} from "lucide-react";

// 预警数据
const alertsData = [
  {
    id: 1,
    title: "抖音账户未提现金额超限",
    type: "资金预警",
    level: "high",
    time: "2024-01-15 09:00",
    duration: "3天",
    description: "抖音支付账户尚有 ¥58,200 元超过7天未提现，建议尽快处理",
    status: "待处理",
    handler: "-",
  },
  {
    id: 2,
    title: "退款率异常升高",
    type: "业务预警",
    level: "medium",
    time: "2024-01-15 10:30",
    duration: "1天",
    description: '店铺"抖音旗舰店"近7天退款率达4.2%，超过阈值3.5%',
    status: "待处理",
    handler: "-",
  },
  {
    id: 3,
    title: "对账差异金额超限",
    type: "对账预警",
    level: "high",
    time: "2024-01-14 16:00",
    duration: "2天",
    description: "累计未处理差异金额达 ¥5,280，超过预警阈值 ¥3,000",
    status: "处理中",
    handler: "张出纳",
  },
  {
    id: 4,
    title: "渠道余额不足",
    type: "资金预警",
    level: "medium",
    time: "2024-01-14 14:00",
    duration: "2天",
    description: "支付宝账户余额 ¥2,500，低于预警阈值 ¥5,000",
    status: "已处理",
    handler: "李会计",
  },
  {
    id: 5,
    title: "大额交易提醒",
    type: "交易预警",
    level: "low",
    time: "2024-01-14 11:00",
    duration: "2天",
    description: "检测到单笔交易金额 ¥50,000，超过单笔预警阈值 ¥30,000",
    status: "已处理",
    handler: "王财务",
  },
];

// 预警统计
const alertStats = {
  total: 28,
  pending: 12,
  processing: 5,
  resolved: 11,
  high: 8,
  medium: 12,
  low: 8,
};

export default function CashierAlerts() {
  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">预警中心</h1>
          <p className="text-sm text-gray-500 mt-1">
            财务预警通知与处理
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
          <Button variant="outline" className="gap-2">
            <Check className="w-4 h-4" />
            全部已读
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Bell className="w-4 h-4" />
              总预警数
            </div>
            <div className="text-2xl font-bold text-gray-900">{alertStats.total}</div>
            <div className="text-xs text-gray-500 mt-1">本月累计</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <AlertTriangle className="w-4 h-4" />
              待处理
            </div>
            <div className="text-2xl font-bold text-red-600">{alertStats.pending}</div>
            <div className="text-xs text-red-600 mt-1">
              高危 {alertStats.high} 个
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Clock className="w-4 h-4" />
              处理中
            </div>
            <div className="text-2xl font-bold text-yellow-600">{alertStats.processing}</div>
            <div className="text-xs text-gray-500 mt-1">正在跟进</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <CheckCircle className="w-4 h-4" />
              已处理
            </div>
            <div className="text-2xl font-bold text-green-600">{alertStats.resolved}</div>
            <div className="text-xs text-green-600 mt-1">
              处理率 {Math.round((alertStats.resolved / alertStats.total) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选区域 */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="预警类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="fund">资金预警</SelectItem>
                <SelectItem value="business">业务预警</SelectItem>
                <SelectItem value="reconcile">对账预警</SelectItem>
                <SelectItem value="transaction">交易预警</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="预警级别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部级别</SelectItem>
                <SelectItem value="high">高危</SelectItem>
                <SelectItem value="medium">中危</SelectItem>
                <SelectItem value="low">低危</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="pending">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="处理状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="processing">处理中</SelectItem>
                <SelectItem value="resolved">已处理</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              更多筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 预警列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">预警列表</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">级别</TableHead>
                <TableHead>预警标题</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>触发时间</TableHead>
                <TableHead>持续时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>处理人</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertsData.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    {alert.level === "high" ? (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    ) : alert.level === "medium" ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Bell className="w-5 h-5 text-blue-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{alert.title}</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-md truncate">
                        {alert.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{alert.type}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {alert.time}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {alert.duration}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className={
                        alert.status === "待处理"
                          ? "bg-red-100 text-red-700"
                          : alert.status === "处理中"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {alert.handler}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {alert.status === "待处理" && (
                        <>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400">
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 分页 */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          共 {alertStats.total} 条预警，当前显示 1-5 条
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>
            上一页
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-white">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            下一页
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
