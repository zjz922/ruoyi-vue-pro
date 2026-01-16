/**
 * 资金流水页面
 * 通过tRPC调用Java后端API进行CRUD操作
 * @author Manus AI
 */
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Trash2,
  Tag,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  RefreshCw,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useCallback } from "react";
import {
  useCashflow,
  CHANNEL_OPTIONS,
  TYPE_OPTIONS,
  STATUS_OPTIONS,
  formatAmount,
} from "@/hooks/useCashflow";
import { useShopSwitcher } from "@/components/ShopSwitcher";

/**
 * 资金流水页面组件
 */
export default function CashierCashflow() {
  const { currentShopId } = useShopSwitcher();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 表单状态
  const [formData, setFormData] = useState({
    channel: "",
    type: "",
    transactionDate: new Date().toISOString().split("T")[0],
    transactionTime: new Date().toTimeString().split(" ")[0].substring(0, 5),
    orderNo: "",
    amount: "",
    remark: "",
  });

  // 筛选状态
  const [filterChannel, setFilterChannel] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 使用资金流水Hook
  const {
    items,
    stats,
    pagination,
    page,
    setPage,
    create,
    confirm,
    batchConfirm,
    remove,
    refetch,
    isLoading,
    isCreating,
    isConfirming,
    updateFilters,
  } = useCashflow({
    shopId: currentShopId || undefined,
  });

  // 处理筛选
  const handleFilter = useCallback(() => {
    updateFilters({
      channel: filterChannel || undefined,
      type: filterType || undefined,
      status: filterStatus || undefined,
      keyword: searchKeyword || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  }, [filterChannel, filterType, filterStatus, searchKeyword, startDate, endDate, updateFilters]);

  // 处理新增流水
  const handleCreate = useCallback(async () => {
    if (!currentShopId) return;

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) return;

    await create({
      shopId: currentShopId,
      transactionDate: formData.transactionDate,
      transactionTime: formData.transactionTime + ":00",
      channel: formData.channel,
      type: formData.type,
      income: transactionType === "income" ? amount : 0,
      expense: transactionType === "expense" ? amount : 0,
      orderNo: formData.orderNo || undefined,
      remark: formData.remark || undefined,
    });

    setIsAddModalOpen(false);
    resetForm();
  }, [currentShopId, formData, transactionType, create]);

  // 重置表单
  const resetForm = () => {
    setFormData({
      channel: "",
      type: "",
      transactionDate: new Date().toISOString().split("T")[0],
      transactionTime: new Date().toTimeString().split(" ")[0].substring(0, 5),
      orderNo: "",
      amount: "",
      remark: "",
    });
    setTransactionType("income");
  };

  // 处理选择
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(items.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  // 批量确认
  const handleBatchConfirm = useCallback(async () => {
    if (selectedIds.length === 0) return;
    await batchConfirm(selectedIds);
    setSelectedIds([]);
  }, [selectedIds, batchConfirm]);

  return (
    <AppLayout>
      {/* 页面标题 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">资金流水</h1>
          <p className="text-sm text-gray-500 mt-1">
            管理和查看所有资金流水记录
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={refetch}>
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            导入
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                新增流水
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>新增资金流水</DialogTitle>
                <DialogDescription>录入新的资金流水记录</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>交易类型</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={transactionType === "income" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setTransactionType("income")}
                    >
                      <TrendingDown className="w-4 h-4 mr-2" />
                      收入
                    </Button>
                    <Button
                      variant={transactionType === "expense" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setTransactionType("expense")}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      支出
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>资金渠道</Label>
                    <Select
                      value={formData.channel}
                      onValueChange={(v) => setFormData({ ...formData, channel: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择渠道" />
                      </SelectTrigger>
                      <SelectContent>
                        {CHANNEL_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>业务类型</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) => setFormData({ ...formData, type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>交易日期</Label>
                    <Input
                      type="date"
                      value={formData.transactionDate}
                      onChange={(e) =>
                        setFormData({ ...formData, transactionDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>交易时间</Label>
                    <Input
                      type="time"
                      value={formData.transactionTime}
                      onChange={(e) =>
                        setFormData({ ...formData, transactionTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>订单号 (可选)</Label>
                    <Input
                      placeholder="输入订单号"
                      value={formData.orderNo}
                      onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>金额</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>备注</Label>
                  <Textarea
                    placeholder="详细备注信息（可选）"
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreate} disabled={isCreating}>
                  {isCreating ? "保存中..." : "保存"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <TrendingDown className="w-4 h-4" />
              总收入
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">
                {formatAmount(stats?.totalIncome || 0)}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              已确认 {stats?.confirmedCount || 0} 笔
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              总支出
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">
                {formatAmount(stats?.totalExpense || 0)}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              待确认 {stats?.pendingCount || 0} 笔
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Wallet className="w-4 h-4" />
              净流入
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div
                className={`text-2xl font-bold ${
                  (stats?.netFlow || 0) >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {(stats?.netFlow || 0) >= 0 ? "+" : ""}
                {formatAmount(stats?.netFlow || 0)}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">收入 - 支出</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <FileText className="w-4 h-4" />
              总笔数
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">
                {stats?.transactionCount || 0}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              待确认 {stats?.pendingCount || 0} 笔
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选区域 */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Input
                type="date"
                className="w-36"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-gray-400">至</span>
              <Input
                type="date"
                className="w-36"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Select value={filterChannel} onValueChange={setFilterChannel}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="资金渠道" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部渠道</SelectItem>
                {CHANNEL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="业务类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索订单号/摘要..."
                className="pl-9"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFilter()}
              />
            </div>
            <Button variant="outline" className="gap-2" onClick={handleFilter}>
              <Filter className="w-4 h-4" />
              筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 批量操作 */}
      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={selectedIds.length === 0}
          onClick={() => selectedIds.forEach((id) => remove(id))}
        >
          <Trash2 className="w-4 h-4" />
          批量删除 {selectedIds.length > 0 && `(${selectedIds.length})`}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={selectedIds.length === 0 || isConfirming}
          onClick={handleBatchConfirm}
        >
          <CheckCircle className="w-4 h-4" />
          批量确认 {selectedIds.length > 0 && `(${selectedIds.length})`}
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Tag className="w-4 h-4" />
          批量标记
        </Button>
      </div>

      {/* 数据表格 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedIds.length === items.length && items.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHead>
                <TableHead>日期</TableHead>
                <TableHead>资金渠道</TableHead>
                <TableHead>业务类型</TableHead>
                <TableHead>订单号</TableHead>
                <TableHead className="text-right">收入金额</TableHead>
                <TableHead className="text-right">支出金额</TableHead>
                <TableHead className="text-right">账户余额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={10}>
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedIds.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{item.transactionDate}</div>
                      <div className="text-xs text-gray-400">{item.transactionTime}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.channelName}</Badge>
                    </TableCell>
                    <TableCell>{item.typeName}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {item.orderNo || "-"}
                    </TableCell>
                    <TableCell className="text-right text-green-600 font-medium">
                      {item.income > 0 ? `+¥${item.income.toFixed(2)}` : "-"}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-medium">
                      {item.expense > 0 ? `-¥${item.expense.toFixed(2)}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ¥{item.balance.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === "confirmed" ? "default" : "secondary"}
                        className={
                          item.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {item.statusName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          查看
                        </Button>
                        {item.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirm(item.id)}
                          >
                            确认
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 分页 */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          共 {pagination.total} 条记录，当前显示第 {page} 页
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
            上一页
          </Button>
          <span className="px-3 py-1 text-sm">
            {page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage(page + 1)}
          >
            下一页
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
