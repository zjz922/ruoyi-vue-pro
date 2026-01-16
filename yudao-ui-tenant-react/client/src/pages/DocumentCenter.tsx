import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  MoreHorizontal,
  Plus,
  Package,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  RotateCcw,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Store,
  User,
  MapPin,
  Box,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReconciliationIndicator } from "@/components/ReconciliationIndicator";

// 单据类型定义
const documentTypes = [
  { value: "picking", label: "配货单", icon: ClipboardList, color: "text-blue-600" },
  { value: "outbound", label: "出库单", icon: ArrowUpFromLine, color: "text-green-600" },
  { value: "inbound", label: "入库单", icon: ArrowDownToLine, color: "text-purple-600" },
  { value: "return", label: "退货单", icon: RotateCcw, color: "text-orange-600" },
];

// 单据状态
const documentStatuses = [
  { value: "pending", label: "待处理", color: "bg-gray-100 text-gray-600" },
  { value: "processing", label: "处理中", color: "bg-blue-100 text-blue-600" },
  { value: "completed", label: "已完成", color: "bg-green-100 text-green-600" },
  { value: "cancelled", label: "已取消", color: "bg-red-100 text-red-600" },
];

// 模拟配货单数据
const mockPickingDocs = [
  {
    id: "PH202601110001",
    createTime: "2026-01-11 10:35:00",
    orderCount: 5,
    productCount: 12,
    status: "pending",
    operator: "张三",
    shop: "旗舰店",
    orders: ["DD202601110001", "DD202601110002", "DD202601110003", "DD202601110004", "DD202601110005"],
  },
  {
    id: "PH202601110002",
    createTime: "2026-01-11 09:20:00",
    orderCount: 3,
    productCount: 8,
    status: "processing",
    operator: "李四",
    shop: "专营店",
    orders: ["DD202601110006", "DD202601110007", "DD202601110008"],
  },
  {
    id: "PH202601100001",
    createTime: "2026-01-10 16:45:00",
    orderCount: 8,
    productCount: 20,
    status: "completed",
    operator: "张三",
    shop: "旗舰店",
    orders: [],
  },
  {
    id: "PH202601100002",
    createTime: "2026-01-10 14:30:00",
    orderCount: 4,
    productCount: 10,
    status: "completed",
    operator: "王五",
    shop: "专营店",
    orders: [],
  },
];

// 模拟出库单数据
const mockOutboundDocs = [
  {
    id: "CK202601110001",
    createTime: "2026-01-11 11:00:00",
    relatedDoc: "PH202601100001",
    productCount: 20,
    totalAmount: 12580,
    status: "completed",
    operator: "张三",
    warehouse: "主仓库",
    logistics: "顺丰速运",
    trackingNo: "SF1234567890",
  },
  {
    id: "CK202601110002",
    createTime: "2026-01-11 10:30:00",
    relatedDoc: "PH202601100002",
    productCount: 10,
    totalAmount: 5680,
    status: "processing",
    operator: "李四",
    warehouse: "主仓库",
    logistics: "中通快递",
    trackingNo: "ZT9876543210",
  },
  {
    id: "CK202601100001",
    createTime: "2026-01-10 17:00:00",
    relatedDoc: "PH202601090001",
    productCount: 15,
    totalAmount: 8920,
    status: "completed",
    operator: "王五",
    warehouse: "分仓A",
    logistics: "韵达快递",
    trackingNo: "YD1122334455",
  },
];

// 模拟入库单数据
const mockInboundDocs = [
  {
    id: "RK202601110001",
    createTime: "2026-01-11 09:00:00",
    supplier: "深圳电子科技有限公司",
    productCount: 100,
    totalAmount: 35000,
    status: "completed",
    operator: "张三",
    warehouse: "主仓库",
    purchaseNo: "CG202601100001",
  },
  {
    id: "RK202601100001",
    createTime: "2026-01-10 14:00:00",
    supplier: "广州配件供应商",
    productCount: 50,
    totalAmount: 12500,
    status: "completed",
    operator: "李四",
    warehouse: "分仓A",
    purchaseNo: "CG202601090001",
  },
  {
    id: "RK202601090001",
    createTime: "2026-01-09 10:30:00",
    supplier: "东莞包装材料厂",
    productCount: 200,
    totalAmount: 8000,
    status: "completed",
    operator: "王五",
    warehouse: "主仓库",
    purchaseNo: "CG202601080001",
  },
];

// 模拟退货单数据
const mockReturnDocs = [
  {
    id: "TH202601110001",
    createTime: "2026-01-11 10:15:00",
    orderId: "DD202601050001",
    productName: "高端无线蓝牙耳机 降噪版",
    reason: "商品质量问题",
    refundAmount: 279,
    status: "processing",
    operator: "客服小王",
    buyer: "张**",
  },
  {
    id: "TH202601100001",
    createTime: "2026-01-10 15:30:00",
    orderId: "DD202601030002",
    productName: "智能手表 运动版",
    reason: "不喜欢/不想要",
    refundAmount: 908,
    status: "completed",
    operator: "客服小李",
    buyer: "李**",
  },
  {
    id: "TH202601090001",
    createTime: "2026-01-09 11:00:00",
    orderId: "DD202601020003",
    productName: "便携式蓝牙音箱",
    reason: "发错商品",
    refundAmount: 129,
    status: "completed",
    operator: "客服小王",
    buyer: "王**",
  },
];

// 格式化金额
function formatCurrency(value: number): string {
  return `¥${value.toFixed(2)}`;
}

// 获取状态配置
function getStatusConfig(status: string) {
  return documentStatuses.find(s => s.value === status) || documentStatuses[0];
}

export default function DocumentCenter() {
  const [activeTab, setActiveTab] = useState("picking");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  // 统计数据
  const stats = {
    picking: { total: mockPickingDocs.length, pending: mockPickingDocs.filter(d => d.status === "pending").length },
    outbound: { total: mockOutboundDocs.length, pending: mockOutboundDocs.filter(d => d.status === "processing").length },
    inbound: { total: mockInboundDocs.length, pending: 0 },
    return: { total: mockReturnDocs.length, pending: mockReturnDocs.filter(d => d.status === "processing").length },
  };

  // 查看详情
  const viewDetail = (doc: any) => {
    setSelectedDoc(doc);
    setShowDetail(true);
  };

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* 顶部操作栏 */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">单据中心</h1>
              <p className="text-sm text-muted-foreground mt-1">管理配货单、出库单、入库单、退货单等业务单据</p>
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="w-4 h-4 mr-1" />
                新建单据
              </Button>
            </div>
          </div>

          {/* 勾稽关联状态 */}
          <div className="mb-4">
            <ReconciliationIndicator
              moduleName="单据中心"
              reconciliationResult={{
                id: "document-center-reconciliation",
                type: "realtime",
                checkTime: new Date(),
                status: (stats.picking.pending + stats.outbound.pending + stats.inbound.pending + stats.return.pending) > 0 ? "warning" : "success",
                items: [
                  {
                    name: "配货单待处理",
                    expected: 0,
                    actual: stats.picking.pending,
                    difference: stats.picking.pending,
                    status: stats.picking.pending > 0 ? "warning" : "success",
                    tolerance: 0,
                  },
                  {
                    name: "出库单待处理",
                    expected: 0,
                    actual: stats.outbound.pending,
                    difference: stats.outbound.pending,
                    status: stats.outbound.pending > 0 ? "warning" : "success",
                    tolerance: 0,
                  },
                  {
                    name: "入库单待处理",
                    expected: 0,
                    actual: stats.inbound.pending,
                    difference: stats.inbound.pending,
                    status: stats.inbound.pending > 0 ? "warning" : "success",
                    tolerance: 0,
                  },
                  {
                    name: "退货单待处理",
                    expected: 0,
                    actual: stats.return.pending,
                    difference: stats.return.pending,
                    status: stats.return.pending > 0 ? "warning" : "success",
                    tolerance: 0,
                  },
                ],
                exceptionCount: stats.picking.pending + stats.outbound.pending + stats.inbound.pending + stats.return.pending,
                summary: (stats.picking.pending + stats.outbound.pending + stats.inbound.pending + stats.return.pending) > 0
                  ? `有 ${stats.picking.pending + stats.outbound.pending + stats.inbound.pending + stats.return.pending} 个单据待处理，需要及时处理`
                  : "所有单据已处理完成，与订单管理模块数据一致",
              }}
              moduleRelations={[
                {
                  sourceModule: "单据中心",
                  targetModule: "订单管理",
                  relationType: "unidirectional",
                  status: "success",
                  lastCheckTime: new Date(),
                },
              ]}
            />
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {documentTypes.map(type => {
              const Icon = type.icon;
              const stat = stats[type.value as keyof typeof stats];
              return (
                <div 
                  key={type.value}
                  className={cn(
                    "rounded-lg p-3 cursor-pointer transition-colors border-2",
                    activeTab === type.value 
                      ? "bg-primary/10 border-primary" 
                      : "bg-muted/30 border-transparent hover:bg-muted/50"
                  )}
                  onClick={() => setActiveTab(type.value)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-5 h-5", type.color)} />
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold">{stat.total}</span>
                    {stat.pending > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {stat.pending} 待处理
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 搜索和筛选 */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索单据编号..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="processing">处理中</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="cancelled">已取消</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="today">
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">今日</SelectItem>
                <SelectItem value="yesterday">昨日</SelectItem>
                <SelectItem value="week">近7天</SelectItem>
                <SelectItem value="month">近30天</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              导出
            </Button>
          </div>
        </div>
      </div>

      {/* 单据列表 */}
      <div className="flex-1 overflow-auto p-4">
        {/* 配货单列表 */}
        {activeTab === "picking" && (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">单据编号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">创建时间</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">订单数</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">商品数</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">店铺</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">状态</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">操作员</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockPickingDocs.map((doc) => {
                  const statusConfig = getStatusConfig(doc.status);
                  return (
                    <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium font-mono">{doc.id}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{doc.createTime}</td>
                      <td className="px-4 py-3 text-center">{doc.orderCount}</td>
                      <td className="px-4 py-3 text-center">{doc.productCount}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline">{doc.shop}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">{doc.operator}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => viewDetail(doc)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Printer className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                标记完成
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ArrowUpFromLine className="w-4 h-4 mr-2" />
                                生成出库单
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <X className="w-4 h-4 mr-2" />
                                取消单据
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 出库单列表 */}
        {activeTab === "outbound" && (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">单据编号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">创建时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">关联配货单</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">商品数</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">出库金额</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">物流</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">状态</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockOutboundDocs.map((doc) => {
                  const statusConfig = getStatusConfig(doc.status);
                  return (
                    <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium font-mono">{doc.id}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{doc.createTime}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-primary cursor-pointer hover:underline">{doc.relatedDoc}</span>
                      </td>
                      <td className="px-4 py-3 text-center">{doc.productCount}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(doc.totalAmount)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="text-sm">
                          <div>{doc.logistics}</div>
                          <div className="text-xs text-muted-foreground">{doc.trackingNo}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Printer className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 入库单列表 */}
        {activeTab === "inbound" && (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">单据编号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">创建时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">供应商</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">商品数</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">入库金额</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">仓库</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">状态</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockInboundDocs.map((doc) => {
                  const statusConfig = getStatusConfig(doc.status);
                  return (
                    <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium font-mono">{doc.id}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{doc.createTime}</td>
                      <td className="px-4 py-3 text-sm">{doc.supplier}</td>
                      <td className="px-4 py-3 text-center">{doc.productCount}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(doc.totalAmount)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline">{doc.warehouse}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Printer className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 退货单列表 */}
        {activeTab === "return" && (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">单据编号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">创建时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">原订单</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">商品</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">退货原因</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">退款金额</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">状态</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockReturnDocs.map((doc) => {
                  const statusConfig = getStatusConfig(doc.status);
                  return (
                    <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium font-mono">{doc.id}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{doc.createTime}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-primary cursor-pointer hover:underline">{doc.orderId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm truncate max-w-[150px] block">{doc.productName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">{doc.reason}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-red-600">
                        -{formatCurrency(doc.refundAmount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                确认收货
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ArrowDownToLine className="w-4 h-4 mr-2" />
                                生成入库单
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            共 <span className="font-medium">
              {activeTab === "picking" && mockPickingDocs.length}
              {activeTab === "outbound" && mockOutboundDocs.length}
              {activeTab === "inbound" && mockInboundDocs.length}
              {activeTab === "return" && mockReturnDocs.length}
            </span> 条记录
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>上一页</Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
            <Button variant="outline" size="sm">下一页</Button>
          </div>
        </div>
      </div>

      {/* 详情侧边栏 */}
      {showDetail && selectedDoc && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50" onClick={() => setShowDetail(false)} />
          <div className="w-[400px] bg-card border-l border-border overflow-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-semibold">单据详情</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowDetail(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">单据编号</span>
                  <span className="font-medium font-mono">{selectedDoc.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">创建时间</span>
                  <span>{selectedDoc.createTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">订单数量</span>
                  <span>{selectedDoc.orderCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">商品数量</span>
                  <span>{selectedDoc.productCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">操作员</span>
                  <span>{selectedDoc.operator}</span>
                </div>
              </div>

              {selectedDoc.orders && selectedDoc.orders.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">关联订单</h3>
                  <div className="space-y-2">
                    {selectedDoc.orders.map((orderId: string) => (
                      <div key={orderId} className="bg-muted/30 rounded p-2 text-sm font-mono">
                        {orderId}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button className="flex-1">
                  <Printer className="w-4 h-4 mr-1" />
                  打印单据
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-1" />
                  导出
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AppLayout>
  );
}
