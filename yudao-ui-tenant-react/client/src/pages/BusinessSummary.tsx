import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  Filter, 
  Search, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock Data for the table
const summaryData = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  date: `2026-01-${15 - i}`,
  shopName: i % 3 === 0 ? "旗舰店-项目A" : i % 3 === 1 ? "旗舰店-项目B" : "专营店-全店",
  orderCount: Math.floor(Math.random() * 500) + 100,
  salesAmount: Math.floor(Math.random() * 50000) + 10000,
  refundAmount: Math.floor(Math.random() * 5000) + 500,
  costAmount: Math.floor(Math.random() * 30000) + 5000,
  marketingCost: Math.floor(Math.random() * 8000) + 1000,
  platformFee: Math.floor(Math.random() * 2000) + 200,
  grossProfit: 0, // Calculated below
  profitRate: 0, // Calculated below
  status: i === 0 ? "pending" : "audited"
})).map(item => {
  const grossProfit = item.salesAmount - item.refundAmount - item.costAmount - item.marketingCost - item.platformFee;
  return {
    ...item,
    grossProfit,
    profitRate: (grossProfit / item.salesAmount * 100).toFixed(1)
  };
});

export default function BusinessSummary() {
  const [dateRange, setDateRange] = useState("last30");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">每日经营汇总</h1>
          <p className="text-muted-foreground">查看每日核心经营数据，支持多维度筛选与导出。</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
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
              <Input placeholder="搜索店铺或项目..." className="w-full sm:w-48 h-9" />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="店铺筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部店铺</SelectItem>
                <SelectItem value="flagship">旗舰店</SelectItem>
                <SelectItem value="specialty">专营店</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="last30" onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">今天</SelectItem>
                <SelectItem value="yesterday">昨天</SelectItem>
                <SelectItem value="last7">近7天</SelectItem>
                <SelectItem value="last30">近30天</SelectItem>
                <SelectItem value="custom">自定义...</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                重置
              </Button>
              <Button size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                筛选
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="shadow-sm overflow-hidden">
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            显示 1 到 15 条，共 45 条记录
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4" />
              上一页
            </Button>
            <Button variant="outline" size="sm">
              下一页
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
