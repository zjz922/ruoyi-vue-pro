import { useState } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  Calendar,
  Warehouse,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

interface CostInboundRelationProps {
  productCostId: number;
  productName: string;
  currentCost: number;
}

export function CostInboundRelation({
  productCostId,
  productName,
  currentCost,
}: CostInboundRelationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data, isLoading: isFetching } = trpc.costUpdate.getProductCostWithInbound.useQuery(
    { productCostId },
    { enabled: isExpanded }
  );

  const handleToggle = async () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  if (!data?.success || !data?.data) {
    return null;
  }

  const inboundInfo = data.data;
  const costDiff = inboundInfo.avgInboundCost - currentCost;
  const costDiffPercent = currentCost > 0 ? (costDiff / currentCost) * 100 : 0;

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="w-full justify-between px-0 hover:bg-transparent"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <Warehouse className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">入库关联信息</span>
        </div>
        {inboundInfo.totalInboundQty > 0 && (
          <Badge variant="secondary" className="text-xs">
            {inboundInfo.totalInboundQty}件
          </Badge>
        )}
      </Button>

      {isExpanded && (
        <Card className="border-blue-100 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">成本与入库数据对比</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading || isFetching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                {/* 成本对比 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-white p-3">
                    <div className="text-xs text-gray-600">当前成本价</div>
                    <div className="mt-1 text-lg font-semibold">¥{currentCost.toFixed(2)}</div>
                  </div>
                  <div className="rounded-lg bg-white p-3">
                    <div className="text-xs text-gray-600">平均入库价</div>
                    <div className="mt-1 text-lg font-semibold">
                      ¥{inboundInfo?.avgInboundCost?.toFixed(2) ?? '0.00'}
                    </div>
                  </div>
                </div>

                {/* 成本差异 */}
                {costDiff !== 0 && (
                  <div className="rounded-lg bg-white p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">成本差异</span>
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          costDiff > 0 ? "text-red-600" : "text-green-600"
                        )}
                      >
                        {costDiff > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-semibold">
                          {costDiff > 0 ? "+" : ""}
                          ¥{Math.abs(costDiff).toFixed(2)} ({costDiffPercent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 最近入库记录 */}
                {inboundInfo?.recentInbounds && inboundInfo.recentInbounds.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-700">最近入库记录</div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {inboundInfo.recentInbounds.slice(0, 5).map((inbound: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between rounded bg-white p-2 text-xs">
                          <div className="flex items-center gap-2">
                            <Package className="h-3 w-3 text-gray-400" />
                            <div>
                              <div className="font-medium">{inbound.warehouse}</div>
                              <div className="text-gray-500">
                                {new Date(inbound.ioDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{inbound.qty}件</div>
                            <div className="text-gray-600">¥{parseFloat(inbound.costPrice).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 成本变更历史 */}
                {inboundInfo?.costHistory && inboundInfo.costHistory.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-700">成本变更历史</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {inboundInfo.costHistory.slice(0, 3).map((history: any) => (
                        <div key={history.id} className="flex items-center justify-between rounded bg-white p-2 text-xs">
                          <div>
                            <div className="font-medium">{history.reason}</div>
                            <div className="text-gray-500">
                              {new Date(history.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-600">¥{parseFloat(history.oldCost).toFixed(2)}</div>
                            <div className="font-semibold">→ ¥{parseFloat(history.newCost).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {inboundInfo?.totalInboundQty === 0 && (
                  <div className="rounded bg-white p-3 text-center text-xs text-gray-500">
                    暂无入库记录
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
