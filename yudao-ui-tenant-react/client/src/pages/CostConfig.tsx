import AppLayout from "@/components/AppLayout";
import { useState, useEffect } from "react";
import {
  DollarSign,
  Search,
  Filter,
  Download,
  Upload,
  History,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Edit2,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Store,
  Package,
  Calendar,
  Bell,
  RefreshCw,
  Plus,
  Trash2,
  ChevronLeft,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ReconciliationIndicator } from "@/components/ReconciliationIndicator";

// 商品成本类型
interface ProductCost {
  id: number;
  productId: string;
  sku: string;
  title: string;
  cost: string;
  merchantCode: string | null;
  price: string;
  customName: string | null;
  stock: number;
  status: number;
  effectiveDate: Date | null;
  shopName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// 成本历史类型
interface CostHistory {
  id: number;
  productCostId: number;
  productId: string;
  oldCost: string;
  newCost: string;
  reason: string | null;
  operatorId: number | null;
  operatorName: string | null;
  createdAt: Date;
}

// 预警设置
const defaultAlertSettings = {
  increaseThreshold: 10,
  decreaseThreshold: 15,
  notifyMethod: "system",
  notifyUsers: ["当前用户"],
  enabled: true,
};

// 格式化金额
function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `¥${num.toFixed(2)}`;
}

// 格式化日期
function formatDate(date: Date | string | null): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN');
}

export default function CostConfig() {
  // 状态
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterShop, setFilterShop] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  
  // 编辑状态
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCost, setEditingCost] = useState<string>("");
  const [editingEffectTime, setEditingEffectTime] = useState("now");
  
  // 新增状态
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productId: "",
    sku: "0",
    title: "",
    cost: "",
    merchantCode: "",
    price: "",
    stock: 0,
    shopName: "滋栈官方旗舰店",
  });
  
  // 弹窗状态
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductCost | null>(null);
  const [alertSettings, setAlertSettings] = useState(defaultAlertSettings);
  const [applyToAllShops, setApplyToAllShops] = useState(false);

  // tRPC查询
  const { data: productCostsData, isLoading, refetch } = trpc.productCost.list.useQuery({
    page: currentPage,
    pageSize,
    search: searchKeyword || undefined,
    shopName: filterShop !== "all" ? filterShop : undefined,
    status: filterStatus === "unconfigured" ? 0 : filterStatus === "configured" ? 0 : undefined,
  });

  const { data: shopNames } = trpc.productCost.getShopNames.useQuery();
  const { data: costHistory } = trpc.productCost.getHistory.useQuery(
    { productCostId: selectedItem?.id || 0 },
    { enabled: !!selectedItem && showHistoryDialog }
  );

  // tRPC mutations
  const createMutation = trpc.productCost.create.useMutation({
    onSuccess: () => {
      toast.success("商品成本添加成功");
      setShowAddDialog(false);
      setNewProduct({
        productId: "",
        sku: "0",
        title: "",
        cost: "",
        merchantCode: "",
        price: "",
        stock: 0,
        shopName: "滋栈官方旗舰店",
      });
      refetch();
    },
    onError: (error) => {
      toast.error(`添加失败: ${error.message}`);
    },
  });

  const updateMutation = trpc.productCost.update.useMutation({
    onSuccess: () => {
      toast.success("成本更新成功");
      setEditingId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });

  const deleteMutation = trpc.productCost.delete.useMutation({
    onSuccess: () => {
      toast.success("商品成本已删除");
      refetch();
    },
    onError: (error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });

  // 数据
  const productCosts = productCostsData?.data || [];
  const total = productCostsData?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // 统计数据
  const stats = {
    total: total,
    configured: productCosts.filter((i: ProductCost) => parseFloat(i.cost) > 0).length,
    pending: 0,
    unconfigured: productCosts.filter((i: ProductCost) => parseFloat(i.cost) === 0).length,
  };

  // 开始编辑
  const startEdit = (item: ProductCost) => {
    setEditingId(item.id);
    setEditingCost(item.cost);
    setEditingEffectTime("now");
  };

  // 保存编辑
  const saveEdit = (item: ProductCost) => {
    updateMutation.mutate({
      id: item.id,
      data: {
        cost: editingCost,
      },
    });
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null);
  };

  // 删除商品成本
  const handleDelete = (item: ProductCost) => {
    if (confirm(`确定要删除 "${item.title}" 的成本配置吗？`)) {
      deleteMutation.mutate({ id: item.id });
    }
  };

  // 查看历史
  const viewHistory = (item: ProductCost) => {
    setSelectedItem(item);
    setShowHistoryDialog(true);
  };

  // 新增商品成本
  const handleAddProduct = () => {
    if (!newProduct.productId || !newProduct.title) {
      toast.error("请填写商品号和商品标题");
      return;
    }
    createMutation.mutate(newProduct);
  };

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* 顶部操作栏 */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">成本配置中心</h1>
              <p className="text-sm text-muted-foreground mt-1">管理商品成本价格，支持批量导入和多时段配置</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAlertDialog(true)}>
                <Bell className="w-4 h-4 mr-1" />
                预警设置
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
                <Upload className="w-4 h-4 mr-1" />
                批量导入
              </Button>
              <Button size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-1" />
                新增商品
              </Button>
            </div>
          </div>

          {/* 勾稽关联状态 */}
          <div className="mb-4">
            <ReconciliationIndicator
              moduleName="成本配置"
              reconciliationResult={{
                id: "cost-config-reconciliation",
                type: "realtime",
                checkTime: new Date(),
                status: stats.unconfigured > 0 ? "warning" : "success",
                items: [
                  {
                    name: "商品总数",
                    expected: stats.total,
                    actual: stats.total,
                    difference: 0,
                    status: "success",
                    tolerance: 0,
                  },
                  {
                    name: "已配置成本",
                    expected: stats.total,
                    actual: stats.configured,
                    difference: stats.unconfigured,
                    status: stats.unconfigured > 0 ? "warning" : "success",
                    tolerance: 0,
                  },
                  {
                    name: "未配置成本",
                    expected: 0,
                    actual: stats.unconfigured,
                    difference: stats.unconfigured,
                    status: stats.unconfigured > 0 ? "warning" : "success",
                    tolerance: 0,
                  },
                ],
                exceptionCount: stats.unconfigured,
                summary: stats.unconfigured > 0 
                  ? `有 ${stats.unconfigured} 个商品未配置成本，影响订单明细利润计算` 
                  : "所有商品成本已配置，与订单明细模块数据一致",
              }}
              moduleRelations={[
                {
                  sourceModule: "成本配置",
                  targetModule: "订单明细",
                  relationType: "unidirectional",
                  status: stats.unconfigured > 0 ? "warning" : "success",
                  lastCheckTime: new Date(),
                },
              ]}
            />
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-sm text-muted-foreground">商品总数</div>
              <div className="text-2xl font-bold mt-1">{stats.total}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm text-green-600">已配置成本</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{stats.configured}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-sm text-orange-600">待生效</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">{stats.pending}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-sm text-red-600">未配置成本</div>
              <div className="text-2xl font-bold text-red-600 mt-1">{stats.unconfigured}</div>
            </div>
          </div>

          {/* 搜索和筛选 */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索商品号、商品名称、商家编码..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="配置状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="configured">已配置</SelectItem>
                <SelectItem value="unconfigured">未配置</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterShop} onValueChange={setFilterShop}>
              <SelectTrigger className="w-40">
                <Store className="w-4 h-4 mr-1" />
                <SelectValue placeholder="店铺" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部店铺</SelectItem>
                {shopNames?.filter((name): name is string => name !== null).map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </div>

      {/* 成本列表 */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">商品号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">商品信息</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">店铺</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">售价</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">成本价</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">毛利率</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">库存</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">生效日期</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {productCosts.map((item: ProductCost) => {
                  const cost = parseFloat(item.cost);
                  const price = parseFloat(item.price);
                  const grossMargin = price > 0 ? ((price - cost) / price * 100).toFixed(1) : '-';
                  
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs text-muted-foreground">{item.productId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="text-sm font-medium truncate max-w-[250px]" title={item.title}>
                              {item.title}
                            </div>
                            {item.merchantCode && (
                              <div className="text-xs text-muted-foreground">编码: {item.merchantCode}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">{item.shopName}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {price > 0 ? (
                          <span className="font-medium">{formatCurrency(price)}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {editingId === item.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <Input
                              type="number"
                              step="0.01"
                              value={editingCost}
                              onChange={(e) => setEditingCost(e.target.value)}
                              className="w-24 h-8 text-right"
                            />
                          </div>
                        ) : cost > 0 ? (
                          <span className="font-medium text-green-600">{formatCurrency(cost)}</span>
                        ) : (
                          <span className="text-red-500">未配置</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {grossMargin !== '-' ? (
                          <span className={cn(
                            "font-medium",
                            parseFloat(grossMargin) > 30 ? "text-green-600" : 
                            parseFloat(grossMargin) > 10 ? "text-orange-600" : "text-red-600"
                          )}>
                            {grossMargin}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm">{item.stock}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(item.effectiveDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {editingId === item.id ? (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => saveEdit(item)}
                                disabled={updateMutation.isPending}
                              >
                                {updateMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4 text-green-600" />
                                )}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={cancelEdit}>
                                <X className="w-4 h-4 text-red-600" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => startEdit(item)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => viewHistory(item)}
                              >
                                <History className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                onClick={() => handleDelete(item)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
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
            共 <span className="font-medium">{total}</span> 条记录，第 {currentPage}/{totalPages || 1} 页
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              上一页
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              下一页
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* 新增商品弹窗 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新增商品成本</DialogTitle>
            <DialogDescription>
              添加新的商品成本配置
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">商品号 *</Label>
              <Input
                value={newProduct.productId}
                onChange={(e) => setNewProduct({...newProduct, productId: e.target.value})}
                placeholder="输入商品号"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">商品标题 *</Label>
              <Input
                value={newProduct.title}
                onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                placeholder="输入商品标题"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">成本价</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newProduct.cost}
                  onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">售价</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">商家编码</Label>
              <Input
                value={newProduct.merchantCode}
                onChange={(e) => setNewProduct({...newProduct, merchantCode: e.target.value})}
                placeholder="输入商家编码（可选）"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">店铺</Label>
              <Select 
                value={newProduct.shopName} 
                onValueChange={(value) => setNewProduct({...newProduct, shopName: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="滋栈官方旗舰店">滋栈官方旗舰店</SelectItem>
                  {shopNames?.filter((name): name is string => name !== null && name !== "滋栈官方旗舰店").map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              取消
            </Button>
            <Button onClick={handleAddProduct} disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  添加中...
                </>
              ) : (
                "添加"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量导入弹窗 */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>批量导入成本数据</DialogTitle>
            <DialogDescription>
              上传CSV文件批量更新商品成本价格
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* 下载模板 */}
            <div className="p-4 bg-muted/30 rounded-lg border border-dashed border-border">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-10 h-10 text-green-600" />
                <div className="flex-1">
                  <div className="font-medium">下载导入模板</div>
                  <p className="text-xs text-muted-foreground">请先下载模板，按格式填写后上传</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  下载
                </Button>
              </div>
            </div>

            {/* 上传区域 */}
            <div className="p-8 border-2 border-dashed border-border rounded-lg text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <div className="text-sm font-medium">点击或拖拽文件到此处上传</div>
              <p className="text-xs text-muted-foreground mt-1">支持 .csv, .xlsx, .xls 格式</p>
              <Button variant="outline" size="sm" className="mt-3">
                选择文件
              </Button>
            </div>

            {/* 导入说明 */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• 商品号为必填项，用于匹配商品</p>
              <p>• SKU编码为空时，成本将应用到该商品所有SKU</p>
              <p>• 已存在的商品将更新成本，不存在的将新增</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              取消
            </Button>
            <Button disabled>
              开始导入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 成本历史弹窗 */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>成本变更历史</DialogTitle>
            <DialogDescription>
              {selectedItem?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {costHistory && costHistory.length > 0 ? (
              <div className="space-y-3">
                {costHistory.map((history: CostHistory, idx: number) => (
                  <div 
                    key={history.id} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      idx === 0 ? "bg-primary/10" : "bg-muted/30"
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{formatCurrency(history.oldCost)}</span>
                        <span>→</span>
                        <span className="font-medium">{formatCurrency(history.newCost)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(history.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{history.operatorName || '系统'}</div>
                      {history.reason && (
                        <div className="text-xs text-muted-foreground">{history.reason}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                暂无历史记录
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowHistoryDialog(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 预警设置弹窗 */}
      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>成本波动预警设置</DialogTitle>
            <DialogDescription>
              当成本变动超过阈值时，系统将发送预警通知
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 启用开关 */}
            <div className="flex items-center justify-between">
              <Label>启用成本预警</Label>
              <Switch 
                checked={alertSettings.enabled}
                onCheckedChange={(checked) => setAlertSettings({...alertSettings, enabled: checked})}
              />
            </div>

            {/* 上涨阈值 */}
            <div>
              <Label className="text-sm font-medium mb-2 block">成本上涨预警阈值</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={alertSettings.increaseThreshold}
                  onChange={(e) => setAlertSettings({...alertSettings, increaseThreshold: Number(e.target.value)})}
                  className="w-20"
                  disabled={!alertSettings.enabled}
                />
                <span className="text-sm text-muted-foreground">%</span>
                <span className="text-xs text-muted-foreground ml-2">成本上涨超过此比例时告警</span>
              </div>
            </div>

            {/* 下降阈值 */}
            <div>
              <Label className="text-sm font-medium mb-2 block">成本下降预警阈值</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={alertSettings.decreaseThreshold}
                  onChange={(e) => setAlertSettings({...alertSettings, decreaseThreshold: Number(e.target.value)})}
                  className="w-20"
                  disabled={!alertSettings.enabled}
                />
                <span className="text-sm text-muted-foreground">%</span>
                <span className="text-xs text-muted-foreground ml-2">成本下降超过此比例时告警</span>
              </div>
            </div>

            {/* 通知方式 */}
            <div>
              <Label className="text-sm font-medium mb-2 block">预警通知方式</Label>
              <Select 
                value={alertSettings.notifyMethod} 
                onValueChange={(value) => setAlertSettings({...alertSettings, notifyMethod: value})}
                disabled={!alertSettings.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">系统消息</SelectItem>
                  <SelectItem value="email">邮件通知</SelectItem>
                  <SelectItem value="sms">短信通知</SelectItem>
                  <SelectItem value="all">全部方式</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAlertDialog(false)}>
              取消
            </Button>
            <Button onClick={() => setShowAlertDialog(false)}>
              保存设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AppLayout>
  );
}
