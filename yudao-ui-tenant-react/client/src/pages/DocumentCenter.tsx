import AppLayout from "@/components/AppLayout";
import { useState, useMemo, useCallback } from "react";
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
  Loader2,
  AlertCircle,
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
import { useShopSwitcher } from "@/components/ShopSwitcher";
// 暂时不使用trpc，等待Java后端实现
import { toast } from "sonner";

// ============ 类型定义 ============

interface PickingDoc {
  id: string;
  createTime: string;
  orderCount: number;
  productCount: number;
  status: string;
  operator: string;
  shop: string;
  orders: string[];
}

interface OutboundDoc {
  id: string;
  createTime: string;
  relatedDoc: string;
  productCount: number;
  totalAmount: number;
  status: string;
  operator: string;
  warehouse: string;
  logistics: string;
  trackingNo: string;
}

interface InboundDoc {
  id: string;
  createTime: string;
  supplier: string;
  productCount: number;
  totalAmount: number;
  status: string;
  operator: string;
  warehouse: string;
  purchaseNo: string;
}

interface ReturnDoc {
  id: string;
  createTime: string;
  orderId: string;
  productName: string;
  reason: string;
  refundAmount: number;
  status: string;
  operator: string;
  buyer: string;
}

interface DocumentApiData {
  pickingDocs?: PickingDoc[];
  outboundDocs?: OutboundDoc[];
  inboundDocs?: InboundDoc[];
  returnDocs?: ReturnDoc[];
}

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

// 格式化金额
function formatCurrency(value: number): string {
  return `¥${value.toFixed(2)}`;
}

// 获取状态配置
function getStatusConfig(status: string) {
  return documentStatuses.find(s => s.value === status) || documentStatuses[0];
}

export default function DocumentCenter() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [activeTab, setActiveTab] = useState("picking");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<PickingDoc | OutboundDoc | InboundDoc | ReturnDoc | null>(null);

  // 暂时使用空数据，等待Java后端实现
  const isLoading = false;
  const error = null;
  const apiData: DocumentApiData | undefined = undefined;

  // 类型断言
  const typedApiData = apiData as DocumentApiData | undefined;

  // 从API响应中提取数据
  const pickingDocs = useMemo(() => typedApiData?.pickingDocs || [], [typedApiData]);
  const outboundDocs = useMemo(() => typedApiData?.outboundDocs || [], [typedApiData]);
  const inboundDocs = useMemo(() => typedApiData?.inboundDocs || [], [typedApiData]);
  const returnDocs = useMemo(() => typedApiData?.returnDocs || [], [typedApiData]);

  // 统计数据
  const stats = useMemo(() => ({
    picking: { total: pickingDocs.length, pending: pickingDocs.filter(d => d.status === "pending").length },
    outbound: { total: outboundDocs.length, pending: outboundDocs.filter(d => d.status === "processing").length },
    inbound: { total: inboundDocs.length, pending: 0 },
    return: { total: returnDocs.length, pending: returnDocs.filter(d => d.status === "processing").length },
  }), [pickingDocs, outboundDocs, inboundDocs, returnDocs]);

  // 查看详情
  const viewDetail = useCallback((doc: PickingDoc | OutboundDoc | InboundDoc | ReturnDoc) => {
    setSelectedDoc(doc);
    setShowDetail(true);
  }, []);

  // 新建单据
  const handleCreateDoc = useCallback(() => {
    toast.info("新建单据功能待Java后端实现");
  }, []);

  // 导出
  const handleExport = useCallback(() => {
    toast.info("导出功能待Java后端实现");
  }, []);

  // 打印
  const handlePrint = useCallback(() => {
    toast.info("打印功能待Java后端实现");
  }, []);

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
              <Button onClick={handleCreateDoc}>
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
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    activeTab === type.value 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setActiveTab(type.value)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg bg-muted", type.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{type.label}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">{stat.total}</span>
                        {stat.pending > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {stat.pending} 待处理
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 筛选栏 */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索单据号..."
                className="pl-9"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {documentStatuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleExport}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 单据列表 */}
      <div className="flex-1 overflow-auto p-4">
        {/* 加载状态 */}
        {isLoading && <LoadingState />}

        {/* 错误状态 */}
        {error && !isLoading && (
          <EmptyState message="数据加载失败，请检查网络连接" icon={AlertCircle} />
        )}

        {/* 有数据时显示列表 */}
        {!isLoading && !error && (
          <>
            {/* 配货单列表 */}
            {activeTab === "picking" && (
              <div className="space-y-3">
                {pickingDocs.length > 0 ? (
                  pickingDocs.map(doc => (
                    <div 
                      key={doc.id}
                      className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => viewDetail(doc)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <ClipboardList className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.id}</p>
                            <p className="text-sm text-muted-foreground">{doc.createTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">订单数</p>
                            <p className="font-medium">{doc.orderCount}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">商品数</p>
                            <p className="font-medium">{doc.productCount}</p>
                          </div>
                          <Badge className={getStatusConfig(doc.status).color}>
                            {getStatusConfig(doc.status).label}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => viewDetail(doc)}>
                                <Eye className="w-4 h-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handlePrint}>
                                <Printer className="w-4 h-4 mr-2" />
                                打印
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <X className="w-4 h-4 mr-2" />
                                取消
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="暂无配货单数据" icon={ClipboardList} />
                )}
              </div>
            )}

            {/* 出库单列表 */}
            {activeTab === "outbound" && (
              <div className="space-y-3">
                {outboundDocs.length > 0 ? (
                  outboundDocs.map(doc => (
                    <div 
                      key={doc.id}
                      className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => viewDetail(doc)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-green-100">
                            <ArrowUpFromLine className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.id}</p>
                            <p className="text-sm text-muted-foreground">{doc.createTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">商品数</p>
                            <p className="font-medium">{doc.productCount}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">金额</p>
                            <p className="font-medium">{formatCurrency(doc.totalAmount)}</p>
                          </div>
                          <Badge className={getStatusConfig(doc.status).color}>
                            {getStatusConfig(doc.status).label}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => viewDetail(doc)}>
                                <Eye className="w-4 h-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handlePrint}>
                                <Printer className="w-4 h-4 mr-2" />
                                打印
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="暂无出库单数据" icon={ArrowUpFromLine} />
                )}
              </div>
            )}

            {/* 入库单列表 */}
            {activeTab === "inbound" && (
              <div className="space-y-3">
                {inboundDocs.length > 0 ? (
                  inboundDocs.map(doc => (
                    <div 
                      key={doc.id}
                      className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => viewDetail(doc)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-purple-100">
                            <ArrowDownToLine className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.id}</p>
                            <p className="text-sm text-muted-foreground">{doc.createTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">供应商</p>
                            <p className="font-medium">{doc.supplier}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">金额</p>
                            <p className="font-medium">{formatCurrency(doc.totalAmount)}</p>
                          </div>
                          <Badge className={getStatusConfig(doc.status).color}>
                            {getStatusConfig(doc.status).label}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => viewDetail(doc)}>
                                <Eye className="w-4 h-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handlePrint}>
                                <Printer className="w-4 h-4 mr-2" />
                                打印
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="暂无入库单数据" icon={ArrowDownToLine} />
                )}
              </div>
            )}

            {/* 退货单列表 */}
            {activeTab === "return" && (
              <div className="space-y-3">
                {returnDocs.length > 0 ? (
                  returnDocs.map(doc => (
                    <div 
                      key={doc.id}
                      className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => viewDetail(doc)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-orange-100">
                            <RotateCcw className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.id}</p>
                            <p className="text-sm text-muted-foreground">{doc.createTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">商品</p>
                            <p className="font-medium truncate max-w-32">{doc.productName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">退款金额</p>
                            <p className="font-medium text-orange-600">{formatCurrency(doc.refundAmount)}</p>
                          </div>
                          <Badge className={getStatusConfig(doc.status).color}>
                            {getStatusConfig(doc.status).label}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => viewDetail(doc)}>
                                <Eye className="w-4 h-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handlePrint}>
                                <Printer className="w-4 h-4 mr-2" />
                                打印
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="暂无退货单数据" icon={RotateCcw} />
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* 详情侧边栏 */}
      {showDetail && selectedDoc && (
        <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold">单据详情</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowDetail(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">单据号</p>
                <p className="font-medium">{selectedDoc.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">创建时间</p>
                <p className="font-medium">{selectedDoc.createTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">状态</p>
                <Badge className={getStatusConfig(selectedDoc.status).color}>
                  {getStatusConfig(selectedDoc.status).label}
                </Badge>
              </div>
              {'operator' in selectedDoc && (
                <div>
                  <p className="text-sm text-muted-foreground">操作人</p>
                  <p className="font-medium">{selectedDoc.operator}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </AppLayout>
  );
}
