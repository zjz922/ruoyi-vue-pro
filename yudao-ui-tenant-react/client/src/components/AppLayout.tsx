import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Calculator,
  Wallet,
  Package,
  TrendingUp,
  Receipt,
  Scale,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Building2,
  Zap,
  HelpCircle,
  ShoppingCart,
  BarChart3,
  Activity,
  DollarSign,
  Calendar,
  // 出纳模块图标
  Gauge,
  ArrowLeftRight,
  CreditCard,
  FileCheck,
  GitCompare,
  FileText,
  CalendarDays,
  Store,
  AlertTriangle,
  ShieldAlert,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Navigation items with routes - 包含所有模块页面（与FinanceCommandCenter保持一致）
const navItems = [
  // 总账管理模块
  { icon: LayoutDashboard, label: "经营概览", id: "overview", path: "/", group: "ledger", groupLabel: "总账管理" },
  { icon: Calculator, label: "财务核算", id: "accounting", path: "/accounting", group: "ledger" },
  { icon: Wallet, label: "资金管理", id: "funds", path: "/funds", group: "ledger" },
  { icon: Package, label: "库存成本", id: "inventory", path: "/inventory", group: "ledger" },
  { icon: TrendingUp, label: "经营分析", id: "analysis", path: "/analysis", group: "ledger" },
  { icon: Receipt, label: "费用中心", id: "expense", path: "/expense", group: "ledger" },
  { icon: Scale, label: "税务管理", id: "tax", path: "/tax", group: "ledger" },
  
  // 订单管理模块
  { icon: ShoppingCart, label: "订单管理", id: "orders", path: "/orders", group: "orders", groupLabel: "订单管理" },
  { icon: List, label: "订单明细", id: "order-detail", path: "/order-detail", group: "orders" },
  { icon: BarChart3, label: "订单统计", id: "order-statistics", path: "/order-statistics", group: "orders" },
  { icon: CalendarDays, label: "最近30天明细", id: "order-thirty-days", path: "/order-thirty-days", group: "orders" },
  { icon: Calendar, label: "按月汇总统计", id: "order-monthly-stats", path: "/order-monthly-stats", group: "orders" },
  { icon: Activity, label: "按年汇总统计", id: "order-yearly-stats", path: "/order-yearly-stats", group: "orders" },
  { icon: DollarSign, label: "成本配置", id: "cost-config", path: "/cost-config", group: "orders" },
  { icon: FileText, label: "单据中心", id: "documents", path: "/documents", group: "orders" },
  
  // 出纳管理模块 - 包含资金管理、对账中心、报表中心
  { icon: Gauge, label: "出纳工作台", id: "cashier-dashboard", path: "/cashier", group: "cashier", groupLabel: "出纳管理" },
  { icon: ArrowLeftRight, label: "资金流水", id: "cashier-cashflow", path: "/cashier/cashflow", group: "cashier" },
  { icon: CreditCard, label: "渠道管理", id: "cashier-channels", path: "/cashier/channels", group: "cashier" },
  { icon: FileCheck, label: "平台对账", id: "cashier-reconciliation", path: "/cashier/reconciliation", group: "cashier" },
  { icon: GitCompare, label: "差异分析", id: "cashier-differences", path: "/cashier/differences", group: "cashier" },
  { icon: BarChart3, label: "资金日报", id: "cashier-daily", path: "/cashier/daily-report", group: "cashier" },
  { icon: CalendarDays, label: "资金月报", id: "cashier-monthly", path: "/cashier/monthly-report", group: "cashier" },
  { icon: Store, label: "店铺统计", id: "cashier-shop", path: "/cashier/shop-report", group: "cashier" },
  
  // 出纳模块 - 预警中心
  { icon: AlertTriangle, label: "待处理预警", id: "cashier-alerts", path: "/cashier/alerts", group: "cashier-alert", groupLabel: "预警中心" },
  { icon: ShieldAlert, label: "预警规则", id: "cashier-rules", path: "/cashier/alert-rules", group: "cashier-alert" },
  
  // 系统设置
  { icon: Settings, label: "系统设置", id: "settings", path: "/settings", group: "system" },
  { icon: HelpCircle, label: "帮助中心", id: "help", path: "/help", group: "system" },
];

// 分组顺序
const groupOrder = ["ledger", "orders", "cashier", "cashier-alert", "system"];

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 按分组组织导航项
  const groupedNavItems = navItems.reduce((acc, item) => {
    const group = item.group || "main";
    if (!acc[group]) {
      acc[group] = { items: [], label: (item as any).groupLabel };
    }
    acc[group].items.push(item);
    return acc;
  }, {} as Record<string, { items: typeof navItems; label?: string }>);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-16" : "w-56"
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-base text-sidebar-foreground whitespace-nowrap">
                闪电帐 PRO
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
          {groupOrder.map((groupKey) => {
            const group = groupedNavItems[groupKey];
            if (!group) return null;

            return (
              <div key={groupKey} className="space-y-0.5">
                {/* 分组标题 */}
                {group.label && !sidebarCollapsed && (
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.label}
                  </div>
                )}
                {group.label && sidebarCollapsed && (
                  <div className="h-px bg-sidebar-border mx-2 my-2" />
                )}

                {/* 分组内的导航项 */}
                {group.items.map((item) => {
                  const isActive = location === item.path || 
                    (item.path === "/" && location === "/") ||
                    (item.path !== "/" && location.startsWith(item.path) && item.path.length > 1);
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      {!sidebarCollapsed && (
                        <span className="text-sm font-medium flex-1 truncate">{item.label}</span>
                      )}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <ChevronRight
              className={cn(
                "w-5 h-5 transition-transform",
                sidebarCollapsed ? "" : "rotate-180"
              )}
            />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-56"
        )}
      >
        {/* Top Header */}
        <header className="h-14 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Global Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索订单、报表..."
                className="w-64 pl-9 bg-secondary/50 border-transparent focus:bg-background focus:border-primary/30 h-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh */}
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9">
              <RefreshCw className="w-4 h-4" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground h-9 w-9">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-background" />
            </Button>

            {/* Shop Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 h-9 px-3">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">旗舰店 - 项目A</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>切换店铺/项目</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="w-2 h-2 rounded-full bg-success mr-2" />
                  旗舰店 - 项目A
                  <Badge variant="secondary" className="ml-auto text-[10px]">当前</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground mr-2" />
                  旗舰店 - 项目B
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground mr-2" />
                  专营店 - 全店
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
