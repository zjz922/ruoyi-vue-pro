/**
 * 单据关联管理页面
 * 管理单据与订单的关联关系
 */

import { useState, useMemo, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link2, Plus, Trash2, Eye, Loader2, AlertCircle, FileText } from "lucide-react";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import { toast } from "sonner";

// ============ 类型定义 ============

interface DocumentData {
  id: number;
  documentNo: string;
  documentType: string;
  status: string;
  orderCount: number;
  createTime: string;
}

interface OrderData {
  id: number;
  mainOrderNo: string;
  productName: string;
  quantity: number;
  payAmount: number;
  status: string;
}

interface DocumentLinkingApiData {
  documents?: DocumentData[];
  orders?: OrderData[];
  documentOrders?: OrderData[];
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

export default function DocumentLinking() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);

  // 暂时使用空数据，等待Java后端实现
  const isLoading = false;
  const error = null;

  // 从API响应中提取数据 - 暂时使用空数组
  const documents: DocumentData[] = [];
  const orders: OrderData[] = [];
  const documentOrders: OrderData[] = [];

  const documentTypeLabels: Record<string, string> = {
    picking: "配货单",
    outbound: "出库单",
    inbound: "入库单",
    return: "退货单",
  };

  const statusLabels: Record<string, string> = {
    pending: "待处理",
    completed: "已完成",
    cancelled: "已取消",
  };

  /**
   * 关联订单到单据
   */
  const handleLinkOrders = useCallback(async () => {
    if (!selectedDocument || selectedOrderIds.length === 0) {
      toast.error("请选择单据和订单");
      return;
    }

    try {
      // TODO: 调用Java后端API
      toast.info("关联功能待Java后端实现");
      setShowLinkDialog(false);
      setSelectedOrderIds([]);
    } catch (error) {
      console.error("Failed to link orders:", error);
      toast.error("关联失败");
    }
  }, [selectedDocument, selectedOrderIds]);

  /**
   * 取消订单关联
   */
  const handleUnlinkOrder = useCallback(async (documentId: number, orderId: number) => {
    try {
      // TODO: 调用Java后端API
      toast.info("取消关联功能待Java后端实现");
    } catch (error) {
      console.error("Failed to unlink order:", error);
      toast.error("取消关联失败");
    }
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">单据关联管理</h1>
            <p className="text-muted-foreground">
              管理单据与订单的关联关系
            </p>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">单据列表</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>单据号</TableHead>
                        <TableHead>单据类型</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>关联订单数</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-mono text-sm">
                            {doc.documentNo}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {documentTypeLabels[doc.documentType] ||
                                doc.documentType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                doc.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {statusLabels[doc.status] || doc.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">{doc.orderCount}</span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(doc.createTime).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedDocument(doc)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    查看
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>
                                      单据详情 - {doc.documentNo}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          单据号
                                        </p>
                                        <p className="font-mono">
                                          {doc.documentNo}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          单据类型
                                        </p>
                                        <p>
                                          {documentTypeLabels[doc.documentType]}
                                        </p>
                                      </div>
                                    </div>

                                    {/* 关联订单列表 */}
                                    <div>
                                      <h4 className="font-semibold mb-3">
                                        关联订单 ({doc.orderCount})
                                      </h4>
                                      {documentOrders.length > 0 ? (
                                        <div className="overflow-x-auto">
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>订单号</TableHead>
                                                <TableHead>商品</TableHead>
                                                <TableHead>数量</TableHead>
                                                <TableHead>金额</TableHead>
                                                <TableHead>状态</TableHead>
                                                <TableHead>操作</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {documentOrders.map((order) => (
                                                <TableRow key={order.id}>
                                                  <TableCell className="font-mono text-sm">
                                                    {order.mainOrderNo}
                                                  </TableCell>
                                                  <TableCell>
                                                    {order.productName}
                                                  </TableCell>
                                                  <TableCell>
                                                    {order.quantity}
                                                  </TableCell>
                                                  <TableCell>
                                                    ¥{order.payAmount.toFixed(2)}
                                                  </TableCell>
                                                  <TableCell>
                                                    <Badge variant="outline">
                                                      {order.status}
                                                    </Badge>
                                                  </TableCell>
                                                  <TableCell>
                                                    <Button
                                                      size="sm"
                                                      variant="ghost"
                                                      className="text-red-600"
                                                      onClick={() =>
                                                        handleUnlinkOrder(
                                                          doc.id,
                                                          order.id
                                                        )
                                                      }
                                                    >
                                                      <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </div>
                                      ) : (
                                        <EmptyState message="暂无关联订单" icon={FileText} />
                                      )}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setShowLinkDialog(true);
                                }}
                              >
                                <Link2 className="w-4 h-4 mr-1" />
                                关联
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState message="暂无单据数据" icon={FileText} />
              )}
            </CardContent>
          </Card>
        )}

        {/* 关联订单对话框 */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                关联订单 - {selectedDocument?.documentNo}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                选择要关联到此单据的订单
              </p>
              {orders.length > 0 ? (
                <div className="overflow-x-auto max-h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">选择</TableHead>
                        <TableHead>订单号</TableHead>
                        <TableHead>商品</TableHead>
                        <TableHead>数量</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedOrderIds.includes(order.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedOrderIds([
                                    ...selectedOrderIds,
                                    order.id,
                                  ]);
                                } else {
                                  setSelectedOrderIds(
                                    selectedOrderIds.filter(
                                      (id) => id !== order.id
                                    )
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {order.mainOrderNo}
                          </TableCell>
                          <TableCell>{order.productName}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>¥{order.payAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState message="暂无可关联的订单" icon={FileText} />
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLinkDialog(false)}
                >
                  取消
                </Button>
                <Button
                  onClick={handleLinkOrders}
                  disabled={selectedOrderIds.length === 0}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  关联 ({selectedOrderIds.length})
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
