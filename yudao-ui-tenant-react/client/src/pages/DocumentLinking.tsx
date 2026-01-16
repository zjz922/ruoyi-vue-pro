/**
 * 单据关联管理页面
 * 管理单据与订单的关联关系
 */

import { useState } from "react";
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
import { Link2, Plus, Trash2, Eye } from "lucide-react";

export default function DocumentLinking() {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);

  // 模拟单据数据
  const mockDocuments = [
    {
      id: 1,
      documentNo: "DOC20250114001",
      documentType: "picking",
      status: "completed",
      orderCount: 3,
      createTime: "2025-01-14T10:00:00Z",
    },
    {
      id: 2,
      documentNo: "DOC20250114002",
      documentType: "outbound",
      status: "completed",
      orderCount: 5,
      createTime: "2025-01-14T11:00:00Z",
    },
    {
      id: 3,
      documentNo: "DOC20250114003",
      documentType: "inbound",
      status: "pending",
      orderCount: 0,
      createTime: "2025-01-14T12:00:00Z",
    },
  ];

  // 模拟订单数据
  const mockOrders = [
    {
      id: 1,
      mainOrderNo: "2025011400001",
      productName: "商品A",
      quantity: 1,
      payAmount: 100.0,
      status: "已发货",
    },
    {
      id: 2,
      mainOrderNo: "2025011400002",
      productName: "商品B",
      quantity: 2,
      payAmount: 200.0,
      status: "已发货",
    },
    {
      id: 3,
      mainOrderNo: "2025011400003",
      productName: "商品C",
      quantity: 1,
      payAmount: 150.0,
      status: "待发货",
    },
  ];

  // 模拟单据关联的订单
  const mockDocumentOrders = [
    {
      id: 1,
      mainOrderNo: "2025011400001",
      productName: "商品A",
      quantity: 1,
      payAmount: 100.0,
      status: "已发货",
    },
    {
      id: 2,
      mainOrderNo: "2025011400002",
      productName: "商品B",
      quantity: 2,
      payAmount: 200.0,
      status: "已发货",
    },
  ];

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
  const handleLinkOrders = async () => {
    if (!selectedDocument || selectedOrderIds.length === 0) {
      alert("请选择单据和订单");
      return;
    }

    try {
      // TODO: 调用后端API
      // const response = await fetch('/api/v1/documents/link-orders', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     documentId: selectedDocument.id,
      //     orderIds: selectedOrderIds,
      //     documentType: selectedDocument.documentType
      //   })
      // });
      // const data = await response.json();

      alert(`成功关联${selectedOrderIds.length}个订单`);
      setShowLinkDialog(false);
      setSelectedOrderIds([]);
    } catch (error) {
      console.error("Failed to link orders:", error);
    }
  };

  /**
   * 取消订单关联
   */
  const handleUnlinkOrder = async (documentId: number, orderId: number) => {
    try {
      // TODO: 调用后端API
      // const response = await fetch(`/api/v1/documents/${documentId}/orders/${orderId}`, {
      //   method: 'DELETE'
      // });

      alert("已取消关联");
    } catch (error) {
      console.error("Failed to unlink order:", error);
    }
  };

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

        {/* 单据列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">单据列表</CardTitle>
          </CardHeader>
          <CardContent>
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
                  {mockDocuments.map((doc) => (
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
                                  {mockDocumentOrders.length > 0 ? (
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
                                          {mockDocumentOrders.map((order) => (
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
                                    <div className="text-center py-4 text-muted-foreground">
                                      暂无关联订单
                                    </div>
                                  )}
                                </div>

                                {/* 关联新订单按钮 */}
                                <Dialog
                                  open={showLinkDialog}
                                  onOpenChange={setShowLinkDialog}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      className="w-full gap-2"
                                      onClick={() =>
                                        setSelectedDocument(doc)
                                      }
                                    >
                                      <Link2 className="w-4 h-4" />
                                      关联新订单
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>
                                        选择要关联的订单
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="overflow-x-auto">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>
                                                <input
                                                  type="checkbox"
                                                  onChange={(e) => {
                                                    if (e.target.checked) {
                                                      setSelectedOrderIds(
                                                        mockOrders.map(
                                                          (o) => o.id
                                                        )
                                                      );
                                                    } else {
                                                      setSelectedOrderIds([]);
                                                    }
                                                  }}
                                                />
                                              </TableHead>
                                              <TableHead>订单号</TableHead>
                                              <TableHead>商品</TableHead>
                                              <TableHead>数量</TableHead>
                                              <TableHead>金额</TableHead>
                                              <TableHead>状态</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {mockOrders.map((order) => (
                                              <TableRow key={order.id}>
                                                <TableCell>
                                                  <input
                                                    type="checkbox"
                                                    checked={selectedOrderIds.includes(
                                                      order.id
                                                    )}
                                                    onChange={(e) => {
                                                      if (
                                                        e.target.checked
                                                      ) {
                                                        setSelectedOrderIds([
                                                          ...selectedOrderIds,
                                                          order.id,
                                                        ]);
                                                      } else {
                                                        setSelectedOrderIds(
                                                          selectedOrderIds.filter(
                                                            (id) =>
                                                              id !==
                                                              order.id
                                                          )
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </TableCell>
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
                                                  ¥
                                                  {order.payAmount.toFixed(
                                                    2
                                                  )}
                                                </TableCell>
                                                <TableCell>
                                                  <Badge variant="outline">
                                                    {order.status}
                                                  </Badge>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>

                                      <div className="flex justify-end gap-2">
                                        <Button
                                          variant="outline"
                                          onClick={() =>
                                            setShowLinkDialog(false)
                                          }
                                        >
                                          取消
                                        </Button>
                                        <Button
                                          onClick={handleLinkOrders}
                                          disabled={
                                            selectedOrderIds.length === 0
                                          }
                                        >
                                          确认关联 (
                                          {selectedOrderIds.length})
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 关联统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                已关联单据
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {mockDocuments.filter((d) => d.orderCount > 0).length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                共{mockDocuments.length}个单据
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                已关联订单
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {mockDocuments.reduce((sum, d) => sum + d.orderCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                共{mockOrders.length}个订单
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                关联率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {(
                  (mockDocuments.reduce((sum, d) => sum + d.orderCount, 0) /
                    mockOrders.length) *
                  100
                ).toFixed(1)}
                %
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                订单关联覆盖率
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
