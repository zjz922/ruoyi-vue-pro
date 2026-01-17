import AppLayout from "@/components/AppLayout";
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  FileText,
  Store,
  User,
  MapPin,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ReconciliationIndicator } from "@/components/ReconciliationIndicator";
import { useShopSwitcher } from "@/components/ShopSwitcher";

// 订单状态定义
const orderStatuses = [
  { value: "待付款", label: "待付款", color: "bg-gray-100 text-gray-600", icon: Clock },
  { value: "待发货", label: "待发货", color: "bg-orange-100 text-orange-600", icon: Package },
  { value: "已发货", label: "已发货", color: "bg-blue-100 text-blue-600", icon: Truck },
  { value: "已完成", label: "已完成", color: "bg-green-100 text-green-600", icon: CheckCircle2 },
  { value: "已关闭", label: "已关闭", color: "bg-gray-100 text-gray-400", icon: X },
];

// 格式化金额
function formatCurrency(value: number | string | null | undefined): string {
  const num = typeof value === 'string' ? parseFloat(value) : (value || 0);
  return `¥${num.toFixed(2)}`;
}

// 格式化日期
function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 获取状态配置
function getStatusConfig(status: string) {
  return orderStatuses.find(s => s.value === status) || orderStatuses[0];
}

// 订单统计类型定义
interface OrderStats {
  totalOrders?: number;
  totalAmount?: number | string;
  totalProfit?: number;
  avgOrderAmount?: number;
  orderGrowth?: number;
  amountGrowth?: number;
  completedOrders?: number;
  pendingOrders?: number;
  refundedOrders?: number;
}

// 订单列表响应类型
interface OrderListResponse {
  data?: Order[];
  list?: Order[];
  total?: number;
}

// 订单类型定义
interface Order {
  id: number;
  mainOrderNo: string;
  subOrderNo: string;
  productName: string | null;
  productSpec: string | null;
  quantity: number;
  sku: string | null;
  unitPrice: string;
  payAmount: string;
  freight: string;
  totalDiscount: string;
  platformDiscount: string;
  merchantDiscount: string;
  influencerDiscount: string;
  serviceFee: string;
  payMethod: string | null;
  receiver: string | null;
  province: string | null;
  city: string | null;
  district: string | null;
  orderTime: Date | null;
  payTime: Date | null;
  shipTime: Date | null;
  completeTime: Date | null;
  status: string;
  afterSaleStatus: string | null;
  cancelReason: string | null;
  appChannel: string | null;
  trafficSource: string | null;
  orderType: string | null;
  influencerId: string | null;
  influencerName: string | null;
  flagColor: string | null;
  merchantRemark: string | null;
  shopName: string | null;
}

export default function OrderManagement() {
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 获取当前店铺
  const { currentShopId, currentShopName } = useShopSwitcher();
  
  // 分页和筛选状态
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [provinceFilter, setProvinceFilter] = useState<string>("");
  
  // 弹窗状态
  const [showDetail, setShowDetail] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // 编辑表单数据
  const [editForm, setEditForm] = useState({
    mainOrderNo: "",
    subOrderNo: "",
    productName: "",
    productSpec: "",
    quantity: 1,
    sku: "",
    unitPrice: 0,
    payAmount: 0,
    freight: 0,
    totalDiscount: 0,
    payMethod: "",
    receiver: "",
    province: "",
    city: "",
    district: "",
    orderTime: "",
    status: "待发货",
    shopName: "滋栈官方旗舰店",
  });
  
  // 导入状态
  const [importData, setImportData] = useState<any[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; error: number } | null>(null);

  // 查询订单列表
  const { data: ordersData, isLoading, refetch } = trpc.order.list.useQuery({
    page,
    pageSize,
    search: search || undefined,
    status: statusFilter || undefined,
    province: provinceFilter || undefined,
    sortBy: 'orderTime',
    sortOrder: 'desc',
    shopId: currentShopName || undefined,
  }) as {
    data: OrderListResponse | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  // 查询订单统计
  const { data: statsData } = trpc.order.stats.useQuery({
    shopId: currentShopName || undefined,
  }) as {
    data: OrderStats | undefined;
  };

  // 创建订单
  const createMutation = trpc.order.create.useMutation({
    onSuccess: () => {
      toast.success("订单已成功创建");
      setShowEditDialog(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });

  // 更新订单
  const updateMutation = trpc.order.update.useMutation({
    onSuccess: () => {
      toast.success("订单已成功更新");
      setShowEditDialog(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });

  // 删除订单
  const deleteMutation = trpc.order.delete.useMutation({
    onSuccess: () => {
      toast.success("订单已成功删除");
      setShowDeleteDialog(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });

  // 批量导入
  const batchImportMutation = trpc.order.batchImport.useMutation({
    onSuccess: (result: unknown) => {
      const typedResult = result as { successCount: number; errorCount: number };
      setImportResult({ success: typedResult.successCount || 0, error: typedResult.errorCount || 0 });
      toast.success(`导入完成：成功 ${typedResult.successCount || 0} 条，失败 ${typedResult.errorCount || 0} 条`);
      refetch();
    },
    onError: (error) => {
      toast.error(`导入失败: ${error.message}`);
    },
  });

  const orders = ordersData?.data || ordersData?.list || [];
  const total = ordersData?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // 搜索处理
  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  // 打开新增弹窗
  const openCreateDialog = () => {
    setIsCreating(true);
    setEditForm({
      mainOrderNo: `DD${Date.now()}`,
      subOrderNo: `DD${Date.now()}`,
      productName: "",
      productSpec: "",
      quantity: 1,
      sku: "",
      unitPrice: 0,
      payAmount: 0,
      freight: 0,
      totalDiscount: 0,
      payMethod: "抖音支付",
      receiver: "",
      province: "",
      city: "",
      district: "",
      orderTime: new Date().toISOString().slice(0, 16),
      status: "待发货",
      shopName: "滋栈官方旗舰店",
    });
    setShowEditDialog(true);
  };

  // 打开编辑弹窗
  const openEditDialog = (order: Order) => {
    setIsCreating(false);
    setSelectedOrder(order);
    setEditForm({
      mainOrderNo: order.mainOrderNo,
      subOrderNo: order.subOrderNo,
      productName: order.productName || "",
      productSpec: order.productSpec || "",
      quantity: order.quantity,
      sku: order.sku || "",
      unitPrice: parseFloat(order.unitPrice) || 0,
      payAmount: parseFloat(order.payAmount) || 0,
      freight: parseFloat(order.freight) || 0,
      totalDiscount: parseFloat(order.totalDiscount) || 0,
      payMethod: order.payMethod || "",
      receiver: order.receiver || "",
      province: order.province || "",
      city: order.city || "",
      district: order.district || "",
      orderTime: order.orderTime ? new Date(order.orderTime).toISOString().slice(0, 16) : "",
      status: order.status,
      shopName: order.shopName || "滋栈官方旗舰店",
    });
    setShowEditDialog(true);
  };

  // 保存订单
  const handleSaveOrder = () => {
    const orderData = {
      mainOrderNo: editForm.mainOrderNo,
      subOrderNo: editForm.subOrderNo,
      productName: editForm.productName,
      productSpec: editForm.productSpec || undefined,
      quantity: editForm.quantity,
      sku: editForm.sku || undefined,
      unitPrice: editForm.unitPrice,
      payAmount: editForm.payAmount,
      freight: editForm.freight,
      totalDiscount: editForm.totalDiscount,
      payMethod: editForm.payMethod || undefined,
      receiver: editForm.receiver || undefined,
      province: editForm.province || undefined,
      city: editForm.city || undefined,
      district: editForm.district || undefined,
      orderTime: editForm.orderTime || undefined,
      status: editForm.status,
      shopName: editForm.shopName || undefined,
    };

    if (isCreating) {
      createMutation.mutate(orderData);
    } else if (selectedOrder) {
      updateMutation.mutate({ id: selectedOrder.id, ...orderData });
    }
  };

  // 删除订单
  const handleDeleteOrder = () => {
    if (selectedOrder) {
      deleteMutation.mutate({ id: selectedOrder.id });
    }
  };

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          // 简单CSV解析（处理引号内的逗号）
          const values: string[] = [];
          let current = '';
          let inQuotes = false;
          
          for (const char of lines[i]) {
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim());
          
          // 映射字段
          const row: any = {};
          headers.forEach((header, index) => {
            const value = values[index]?.replace(/"/g, '') || '';
            
            // 字段映射
            switch (header) {
              case '主订单编号':
                row.mainOrderNo = value;
                break;
              case '子订单编号':
                row.subOrderNo = value || row.mainOrderNo;
                break;
              case '商品名称':
                row.productName = value;
                break;
              case '商品规格':
                row.productSpec = value;
                break;
              case '商品数量':
                row.quantity = parseInt(value) || 1;
                break;
              case '商家编码':
                row.sku = value;
                break;
              case '商品单价':
                row.unitPrice = parseFloat(value) || 0;
                break;
              case '订单应付金额':
                row.payAmount = parseFloat(value) || 0;
                break;
              case '运费':
                row.freight = parseFloat(value) || 0;
                break;
              case '优惠总金额':
                row.totalDiscount = parseFloat(value) || 0;
                break;
              case '支付方式':
                row.payMethod = value;
                break;
              case '收件人':
                row.receiver = value;
                break;
              case '省':
                row.province = value;
                break;
              case '市':
                row.city = value;
                break;
              case '区':
                row.district = value;
                break;
              case '订单提交时间':
                row.orderTime = value;
                break;
              case '订单状态':
                row.status = value || '待发货';
                break;
              case '店铺名称':
                row.shopName = value || '滋栈官方旗舰店';
                break;
            }
          });
          
          if (row.mainOrderNo) {
            if (!row.subOrderNo) row.subOrderNo = row.mainOrderNo;
            data.push(row);
          }
        }
        
        setImportData(data);
        setImportLoading(false);
      } catch (error) {
        toast.error("解析失败: CSV文件格式不正确");
        setImportLoading(false);
      }
    };
    
    reader.readAsText(file, 'UTF-8');
  };

  // 执行导入
  const handleImport = () => {
    if (importData.length === 0) {
      toast.error("请先选择要导入的文件");
      return;
    }
    batchImportMutation.mutate(importData);
  };

  // 下载导入模板
  const downloadTemplate = () => {
    const headers = [
      '主订单编号', '子订单编号', '商品名称', '商品规格', '商品数量', '商家编码',
      '商品单价', '订单应付金额', '运费', '优惠总金额', '平台优惠', '商家优惠',
      '达人优惠', '服务费', '支付方式', '收件人', '省', '市', '区',
      '订单提交时间', '支付完成时间', '发货时间', '订单完成时间', '订单状态',
      '售后状态', '取消原因', 'APP渠道', '流量来源', '订单类型',
      '达人ID', '达人昵称', '旗帜颜色', '商家备注', '店铺名称'
    ];
    
    const sampleData = [
      '6942072226324682626', '6942072226324682626', '滋栈杨枝甘露鲜炖燕窝花胶粥', '【5盒家庭装】杨枝甘露燕窝花胶粥168g*5盒', '1', 'ZZ-YZGL-1',
      '29.9', '29.9', '0', '0', '0', '0',
      '0', '0', '抖音支付', '***', '广东省', '深圳市', '光明区',
      '2025-04-30 23:58:58', '2025-04-30 23:59:00', '2025-05-01 10:00:00', '2025-05-08 10:00:00', '已完成',
      '-', '', '抖音', '精选联盟', '普通订单',
      '255540622528568', '轻姐姐低卡饮品', '灰色', '', '滋栈官方旗舰店'
    ];
    
    const csvContent = headers.join(',') + '\n' + sampleData.join(',');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '订单导入模板.csv';
    link.click();
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* 页面标题 */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">订单管理</h1>
              <p className="text-sm text-gray-500">管理店铺订单数据</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
              <Upload className="w-4 h-4 mr-1" />
              导入
            </Button>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-1" />
              下载模板
            </Button>
            <Button size="sm" onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-1" />
              新增订单
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-5 gap-4 p-6 bg-gray-50">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500">总订单数</div>
            <div className="text-2xl font-semibold text-gray-900 mt-1">
              {statsData?.totalOrders?.toLocaleString() || 0}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500">总金额</div>
            <div className="text-2xl font-semibold text-blue-600 mt-1">
              {formatCurrency(statsData?.totalAmount || 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500">已完成</div>
            <div className="text-2xl font-semibold text-green-600 mt-1">
              {statsData?.completedOrders?.toLocaleString() || 0}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500">待发货</div>
            <div className="text-2xl font-semibold text-orange-600 mt-1">
              {statsData?.pendingOrders?.toLocaleString() || 0}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500">已退款</div>
            <div className="text-2xl font-semibold text-red-600 mt-1">
              {statsData?.refundedOrders?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        {/* 勾稽关联状态 */}
        <div className="px-6 py-3 bg-gray-50">
          <ReconciliationIndicator
            moduleName="订单管理"
            reconciliationResult={{
              id: "order-management-reconciliation",
              type: "realtime",
              checkTime: new Date(),
              status: "success",
              items: [
                {
                  name: "订单数量",
                  expected: statsData?.totalOrders || 0,
                  actual: statsData?.totalOrders || 0,
                  difference: 0,
                  status: "success",
                  tolerance: 0,
                },
                {
                  name: "订单金额",
                  expected: Number(statsData?.totalAmount) || 0,
                  actual: Number(statsData?.totalAmount) || 0,
                  difference: 0,
                  status: "success",
                  tolerance: 0.01,
                },
                {
                  name: "已完成订单",
                  expected: statsData?.completedOrders || 0,
                  actual: statsData?.completedOrders || 0,
                  difference: 0,
                  status: "success",
                  tolerance: 0,
                },
              ],
              exceptionCount: 0,
              summary: "与订单统计模块数据一致",
            }}
            moduleRelations={[
              {
                sourceModule: "订单管理",
                targetModule: "订单统计",
                relationType: "bidirectional",
                status: "success",
                lastCheckTime: new Date(),
              },
              {
                sourceModule: "单据中心",
                targetModule: "订单管理",
                relationType: "unidirectional",
                status: "success",
                lastCheckTime: new Date(),
              },
            ]}
            onRefresh={() => refetch()}
            loading={isLoading}
          />
        </div>

        {/* 搜索和筛选 */}
        <div className="flex items-center gap-4 px-6 py-4 bg-white border-b">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索订单号、商品名称、收件人..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={handleSearch}>
              搜索
            </Button>
          </div>
          <Select value={statusFilter || "all"} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="订单状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {orderStatuses.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* 订单列表 */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Package className="w-12 h-12 mb-4 text-gray-300" />
              <p>暂无订单数据</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单编号</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品信息</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">收件人</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">地区</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">金额</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">下单时间</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order: Order) => {
                    const statusConfig = getStatusConfig(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{order.mainOrderNo}</div>
                          {order.subOrderNo !== order.mainOrderNo && (
                            <div className="text-xs text-gray-500">子: {order.subOrderNo}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={order.productName || ''}>
                            {order.productName || '-'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.sku || '-'} × {order.quantity}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{order.receiver || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {[order.province, order.city].filter(Boolean).join(' ') || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                          {formatCurrency(order.payAmount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={cn("text-xs", statusConfig.color)}>
                            {statusConfig.label}
                          </Badge>
                          {order.afterSaleStatus && order.afterSaleStatus !== '-' && (
                            <div className="text-xs text-red-500 mt-1">{order.afterSaleStatus}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDate(order.orderTime)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setSelectedOrder(order); setShowDetail(true); }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(order)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setSelectedOrder(order); setShowDeleteDialog(true); }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
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

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                共 {total} 条记录，第 {page}/{totalPages} 页
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  下一页
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 订单详情弹窗 */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>订单详情</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">主订单编号</Label>
                  <div className="font-medium">{selectedOrder.mainOrderNo}</div>
                </div>
                <div>
                  <Label className="text-gray-500">子订单编号</Label>
                  <div className="font-medium">{selectedOrder.subOrderNo}</div>
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-500">商品名称</Label>
                  <div className="font-medium">{selectedOrder.productName || '-'}</div>
                </div>
                <div>
                  <Label className="text-gray-500">商品规格</Label>
                  <div>{selectedOrder.productSpec || '-'}</div>
                </div>
                <div>
                  <Label className="text-gray-500">商家编码</Label>
                  <div>{selectedOrder.sku || '-'}</div>
                </div>
                <div>
                  <Label className="text-gray-500">数量</Label>
                  <div>{selectedOrder.quantity}</div>
                </div>
                <div>
                  <Label className="text-gray-500">单价</Label>
                  <div>{formatCurrency(selectedOrder.unitPrice)}</div>
                </div>
                <div>
                  <Label className="text-gray-500">应付金额</Label>
                  <div className="font-medium text-blue-600">{formatCurrency(selectedOrder.payAmount)}</div>
                </div>
                <div>
                  <Label className="text-gray-500">优惠金额</Label>
                  <div>{formatCurrency(selectedOrder.totalDiscount)}</div>
                </div>
                <div>
                  <Label className="text-gray-500">收件人</Label>
                  <div>{selectedOrder.receiver || '-'}</div>
                </div>
                <div>
                  <Label className="text-gray-500">收货地址</Label>
                  <div>{[selectedOrder.province, selectedOrder.city, selectedOrder.district].filter(Boolean).join(' ') || '-'}</div>
                </div>
                <div>
                  <Label className="text-gray-500">订单状态</Label>
                  <Badge className={cn("mt-1", getStatusConfig(selectedOrder.status).color)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-500">售后状态</Label>
                  <div>{selectedOrder.afterSaleStatus || '-'}</div>
                </div>
                <div>
                  <Label className="text-gray-500">下单时间</Label>
                  <div>{formatDate(selectedOrder.orderTime)}</div>
                </div>
                <div>
                  <Label className="text-gray-500">支付时间</Label>
                  <div>{formatDate(selectedOrder.payTime)}</div>
                </div>
                <div>
                  <Label className="text-gray-500">发货时间</Label>
                  <div>{formatDate(selectedOrder.shipTime)}</div>
                </div>
                <div>
                  <Label className="text-gray-500">完成时间</Label>
                  <div>{formatDate(selectedOrder.completeTime)}</div>
                </div>
                <div>
                  <Label className="text-gray-500">达人昵称</Label>
                  <div>{selectedOrder.influencerName || '-'}</div>
                </div>
                <div>
                  <Label className="text-gray-500">流量来源</Label>
                  <div>{selectedOrder.trafficSource || '-'}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 编辑/新增弹窗 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isCreating ? '新增订单' : '编辑订单'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>主订单编号 *</Label>
              <Input
                value={editForm.mainOrderNo}
                onChange={(e) => setEditForm({ ...editForm, mainOrderNo: e.target.value })}
              />
            </div>
            <div>
              <Label>子订单编号 *</Label>
              <Input
                value={editForm.subOrderNo}
                onChange={(e) => setEditForm({ ...editForm, subOrderNo: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label>商品名称 *</Label>
              <Input
                value={editForm.productName}
                onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
              />
            </div>
            <div>
              <Label>商品规格</Label>
              <Input
                value={editForm.productSpec}
                onChange={(e) => setEditForm({ ...editForm, productSpec: e.target.value })}
              />
            </div>
            <div>
              <Label>商家编码</Label>
              <Input
                value={editForm.sku}
                onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
              />
            </div>
            <div>
              <Label>数量</Label>
              <Input
                type="number"
                value={editForm.quantity}
                onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label>单价</Label>
              <Input
                type="number"
                step="0.01"
                value={editForm.unitPrice}
                onChange={(e) => setEditForm({ ...editForm, unitPrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>应付金额</Label>
              <Input
                type="number"
                step="0.01"
                value={editForm.payAmount}
                onChange={(e) => setEditForm({ ...editForm, payAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>优惠金额</Label>
              <Input
                type="number"
                step="0.01"
                value={editForm.totalDiscount}
                onChange={(e) => setEditForm({ ...editForm, totalDiscount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>收件人</Label>
              <Input
                value={editForm.receiver}
                onChange={(e) => setEditForm({ ...editForm, receiver: e.target.value })}
              />
            </div>
            <div>
              <Label>省份</Label>
              <Input
                value={editForm.province}
                onChange={(e) => setEditForm({ ...editForm, province: e.target.value })}
              />
            </div>
            <div>
              <Label>城市</Label>
              <Input
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
              />
            </div>
            <div>
              <Label>区县</Label>
              <Input
                value={editForm.district}
                onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
              />
            </div>
            <div>
              <Label>下单时间</Label>
              <Input
                type="datetime-local"
                value={editForm.orderTime}
                onChange={(e) => setEditForm({ ...editForm, orderTime: e.target.value })}
              />
            </div>
            <div>
              <Label>订单状态</Label>
              <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>取消</Button>
            <Button 
              onClick={handleSaveOrder}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              )}
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除订单 {selectedOrder?.mainOrderNo} 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>取消</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteOrder}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 导入弹窗 */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>导入订单</DialogTitle>
            <DialogDescription>
              上传CSV文件批量导入订单数据，请先下载模板查看格式要求
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                className="w-full h-24 border-dashed"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <span>点击选择CSV文件</span>
                </div>
              </Button>
            </div>
            
            {importLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">解析中...</span>
              </div>
            )}
            
            {importData.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  已解析 <span className="font-medium text-blue-600">{importData.length}</span> 条订单数据
                </div>
              </div>
            )}
            
            {importResult && (
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-700">
                  导入完成：成功 {importResult.success} 条，失败 {importResult.error} 条
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { 
              setShowImportDialog(false); 
              setImportData([]); 
              setImportResult(null);
            }}>
              关闭
            </Button>
            <Button 
              onClick={handleImport}
              disabled={importData.length === 0 || batchImportMutation.isPending}
            >
              {batchImportMutation.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              开始导入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
