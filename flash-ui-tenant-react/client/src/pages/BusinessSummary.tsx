import { useState, useMemo, useCallback } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Download, 
  Filter, 
  Search, 
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useShopSwitcher } from "@/components/ShopSwitcher";
import { useDashboardOverview } from "@/hooks/useLedger";
import { toast } from "sonner";

// ============ 类型定义 ============

interface SummaryItem {
  id: number;
  date: string;
  shopName: string;
  orderCount: number;
  salesAmount: number;
  refundAmount: number;
  costAmount: number;
  marketingCost: number;
  platformFee: number;
  grossProfit: number;
  profitRate: string;
  status: string;
}

interface BusinessSummaryApiData {
  list?: SummaryItem[];
  total?: number;
  pageNo?: number;
  pageSize?: number;
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

export default function BusinessSummary() {
  const { currentShopId } = useShopSwitcher();
  const shopId = currentShopId ? Number(currentShopId) : 0;
  const [dateRange, setDateRange] = useState("last30");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [shopFilter, setShopFilter] = useState("all");
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 15;

  // 计算日期范围
  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate: Date;
    switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'yesterday':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'last7':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last30':
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    };
  }, [dateRange]);

  const dateRangeValue = useMemo(() => getDateRange(), [getDateRange]);

  // API调用 - 使用仪表盘概览数据作为经营汇总数据源
  const { data: apiData, isLoading, error } = useDashboardOverview({
    startDate: dateRangeValue.startDate,
    endDate: dateRangeValue.endDate,
  });

  // 类型断言
  const typedApiData = apiData as BusinessSummaryApiData | undefined;

  // 从API响应中提取数据
  const summaryData = useMemo(() => {
    return typedApiData?.list || [];
  }, [typedApiData]);

  const total = useMemo(() => {
    return typedApiData?.total || 0;
  }, [typedApiData]);

  // 检查是否有数据
  const hasData = summaryData.length > 0;

  // 导出报表
  const handleExport = useCallback(() => {
    toast.info("导出功能待Java后端实现");
  }, []);

  // 重置筛选
  const handleReset = useCallback(() => {
    setSearchKeyword("");
    setShopFilter("all");
    setDateRange("last30");
    setPageNo(1);
  }, []);

  // 筛选
  const handleFilter = useCallback(() => {
    setPageNo(1);
    toast.info("筛选功能已触发");
  }, []);

  // 查看详情
  const handleViewDetail = useCallback((item: SummaryItem) => {
    toast.info(`查看详情: ${item.date} - ${item.shopName}`);
  }, []);

  // 分页
  const handlePrevPage = useCallback(() => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  }, [pageNo]);

  const handleNextPage = useCallback(() => {
    if (pageNo * pageSize < total) {
      setPageNo(pageNo + 1);
    }
  }, [pageNo, pageSize, total]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">每日经营汇总</h1>
          <p className="text-muted-foreground">查看每日核心经营数据，支持多维度筛选与导出。</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            导出报表
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="搜索店铺或项目..." 
                className="w-full sm:w-48 h-9"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            
            <Select value={shopFilter} onValueChange={setShopFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="店铺筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部店铺</SelectItem>
                <SelectItem value="flagship">旗舰店</SelectItem>
                <SelectItem value="specialty">专营店</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">今天</SelectItem>
                <SelectItem value="yesterday">昨天</SelectItem>
                <SelectItem value="last7">近7天</SelectItem>
                <SelectItem value="last30">近30天</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleReset}>
                重置
              </Button>
              <Button size="sm" className="gap-2" onClick={handleFilter}>
                <Filter className="w-4 h-4" />
                筛选
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="shadow-sm overflow-hidden">
        {/* 加载状态 */}
        {isLoading && <LoadingState />}

        {/* 错误状态 */}
        {error && !isLoading && (
          <EmptyState message="数据加载失败，请检查网络连接" icon={AlertCircle} />
        )}

        {/* 有数据时显示表格 */}
        {!isLoading && !error && (
          <>
            {hasData ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[120px]">日期</TableHead>
                      <TableHead className="w-[150px]">店铺/项目</TableHead>
                      <TableHead className="text-right">发货单量</TableHead>
                      <TableHead className="text-right">销售额</TableHead>
                      <TableHead className="text-right">退款额</TableHead>
                      <TableHead className="text-right">商品成本</TableHead>
                      <TableHead className="text-right">推广费</TableHead>
                      <TableHead className="text-right">平台扣点</TableHead>
                      <TableHead className="text-right font-bold text-primary">毛利润</TableHead>
                      <TableHead className="text-right">毛利率</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                      <TableHead className="text-center w-[80px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryData.map((row) => (
                      <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{row.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              row.shopName.includes("项目A") ? "bg-primary" : 
                              row.shopName.includes("项目B") ? "bg-chart-5" : "bg-muted-foreground"
                            }`} />
                            {row.shopName}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{row.orderCount}</TableCell>
                        <TableCell className="text-right font-medium">¥{row.salesAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">¥{row.refundAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">¥{row.costAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">¥{row.marketingCost.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">¥{row.platformFee.toLocaleString()}</TableCell>
                        <TableCell className={`text-right font-bold ${row.grossProfit > 0 ? "text-success" : "text-danger"}`}>
                          ¥{row.grossProfit.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right ${parseFloat(row.profitRate) > 20 ? "text-success" : parseFloat(row.profitRate) > 0 ? "text-warning" : "text-danger"}`}>
                          {row.profitRate}%
                        </TableCell>
                        <TableCell className="text-center">
                          {row.status === "audited" ? (
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">已核对</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">待核对</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => handleViewDetail(row)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState message="暂无经营汇总数据" icon={FileText} />
            )}
            
            {/* Pagination */}
            {hasData && (
              <div className="flex items-center justify-between px-4 py-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  显示 {(pageNo - 1) * pageSize + 1} 到 {Math.min(pageNo * pageSize, total)} 条，共 {total} 条记录
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={pageNo <= 1}
                    onClick={handlePrevPage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    上一页
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={pageNo * pageSize >= total}
                    onClick={handleNextPage}
                  >
                    下一页
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
