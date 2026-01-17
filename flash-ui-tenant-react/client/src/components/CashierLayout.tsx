import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  FileCheck,
  AlertTriangle,
  FileText,
  CalendarDays,
  Store,
  Bell,
  Shield,
  Users,
  Settings,
  Search,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Building2,
  Zap,
  ArrowLeft,
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

// 出纳模块导航菜单配置
const cashierNavGroups = [
  {
    title: "资金管理",
    items: [
      { icon: LayoutDashboard, label: "仪表盘", id: "dashboard", path: "/cashier" },
      { icon: Wallet, label: "资金流水", id: "cashflow", path: "/cashier/cashflow" },
      { icon: CreditCard, label: "渠道管理", id: "channels", path: "/cashier/channels" },
    ],
  },
  {
    title: "对账中心",
    items: [
      { icon: FileCheck, label: "平台对账", id: "reconciliation", path: "/cashier/reconciliation" },
      { icon: AlertTriangle, label: "差异分析", id: "differences", path: "/cashier/differences" },
    ],
  },
  {
    title: "报表中心",
    items: [
      { icon: CalendarDays, label: "资金日报", id: "daily-report", path: "/cashier/daily-report" },
      { icon: FileText, label: "资金月报", id: "monthly-report", path: "/cashier/monthly-report" },
      { icon: Store, label: "店铺统计", id: "shop-report", path: "/cashier/shop-report" },
    ],
  },
  {
    title: "预警中心",
    items: [
      { icon: Bell, label: "待处理预警", id: "alerts", path: "/cashier/alerts" },
      { icon: Shield, label: "预警规则", id: "alert-rules", path: "/cashier/alert-rules" },
    ],
  },
  {
    title: "系统管理",
    items: [
      { icon: Users, label: "用户管理", id: "users", path: "/cashier/users" },
      { icon: Settings, label: "系统设置", id: "settings", path: "/cashier/settings" },
    ],
  },
];

interface CashierLayoutProps {
  children: ReactNode;
}

export default function CashierLayout({ children }: CashierLayoutProps) {
  const [location] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-[#001529] transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-white/10">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-base text-white whitespace-nowrap">
                出纳系统
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {cashierNavGroups.map((group) => (
            <div key={group.title} className="mb-2">
              {!sidebarCollapsed && (
                <div className="px-4 py-2 text-xs font-medium text-white/45 uppercase tracking-wider">
                  {group.title}
                </div>
              )}
              <div className="px-2 space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-all group relative",
                        isActive
                          ? "bg-primary text-white border-r-2 border-white"
                          : "text-white/85 hover:bg-white/10"
                      )}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="text-sm">{item.label}</span>
                      )}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Back to Main & Collapse Toggle */}
        <div className="p-2 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">返回主系统</span>}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors"
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
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-gray-200 sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500">
              首页 &gt; 出纳系统
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索订单号/摘要..."
                className="w-60 pl-9 bg-gray-50 border-gray-200 focus:bg-white h-9"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700 h-9 w-9">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center px-1">
                3
              </span>
            </Button>

            {/* User Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-9 px-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                    张
                  </div>
                  <span className="text-sm text-gray-700">张出纳</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>个人设置</DropdownMenuItem>
                <DropdownMenuItem>修改密码</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">退出登录</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
