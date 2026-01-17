/**
 * 订单管理导航菜单组件
 * 用于订单管理分组中各模块的导航
 */

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  BarChart3,
  Calendar,
  TrendingUp,
  Settings,
  FileText,
  CheckCircle2,
  RefreshCw,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrderManagementNavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
}

const navItems: OrderManagementNavItem[] = [
  {
    label: "订单管理",
    path: "/orders",
    icon: <ShoppingCart className="w-4 h-4" />,
    description: "查看和管理所有订单",
  },
  {
    label: "订单统计",
    path: "/order-statistics",
    icon: <BarChart3 className="w-4 h-4" />,
    description: "订单统计和分析",
  },
  {
    label: "订单明细",
    path: "/order-detail",
    icon: <FileText className="w-4 h-4" />,
    description: "订单详细信息查询",
  },
  {
    label: "最近30天",
    path: "/order-thirty-days",
    icon: <Calendar className="w-4 h-4" />,
    description: "最近30天订单统计",
  },
  {
    label: "按月汇总",
    path: "/order-monthly-stats",
    icon: <TrendingUp className="w-4 h-4" />,
    description: "按月份汇总统计",
  },
  {
    label: "按年汇总",
    path: "/order-yearly-stats",
    icon: <TrendingUp className="w-4 h-4" />,
    description: "按年份汇总统计",
  },
  {
    label: "成本配置",
    path: "/cost-config",
    icon: <Settings className="w-4 h-4" />,
    description: "商品成本配置",
  },
  {
    label: "单据中心",
    path: "/documents",
    icon: <FileText className="w-4 h-4" />,
    description: "单据管理",
  },
  {
    label: "数据勾稽",
    path: "/reconciliation",
    icon: <CheckCircle2 className="w-4 h-4" />,
    description: "数据勾稽检查",
  },
  {
    label: "订单对账",
    path: "/order-reconciliation",
    icon: <RefreshCw className="w-4 h-4" />,
    description: "从抖店同步和对账",
  },
  {
    label: "单据关联",
    path: "/document-linking",
    icon: <Link2 className="w-4 h-4" />,
    description: "单据与订单关联",
  },
];

interface OrderManagementNavProps {
  layout?: "horizontal" | "vertical";
  showDescription?: boolean;
}

export function OrderManagementNav({
  layout = "horizontal",
  showDescription = false,
}: OrderManagementNavProps) {
  const [location, navigate] = useLocation();

  if (layout === "vertical") {
    return (
      <div className="w-48 bg-white border-r">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">订单管理</h3>
        </div>
        <nav className="space-y-1 p-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location === item.path
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant={location === item.path ? "default" : "outline"}
          size="sm"
          onClick={() => navigate(item.path)}
          className="gap-2 whitespace-nowrap"
          title={item.description}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </div>
  );
}

/**
 * 订单管理导航卡片组件
 * 用于展示所有可用的订单管理模块
 */
export function OrderManagementNavCards() {
  const [, navigate] = useLocation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900">
                {item.label}
              </h3>
              {item.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
