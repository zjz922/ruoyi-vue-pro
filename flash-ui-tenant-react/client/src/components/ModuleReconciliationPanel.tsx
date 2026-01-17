/**
 * 模块勾稽关联面板组件
 * 
 * 用于展示8个订单管理模块之间的勾稽和关联关系
 * 遵循阿里代码规范
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @since 2025-01-14
 */

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ArrowRight,
  ArrowLeftRight,
  FileText,
  BarChart3,
  Calendar,
  CalendarDays,
  CalendarRange,
  DollarSign,
  Package,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * 勾稽状态类型
 */
type ReconciliationStatus = "success" | "warning" | "error" | "pending";

/**
 * 模块定义
 */
interface Module {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  status: ReconciliationStatus;
  lastCheckTime: Date;
  exceptionCount: number;
}

/**
 * 模块关联定义
 */
interface ModuleLink {
  sourceId: string;
  targetId: string;
  type: "bidirectional" | "unidirectional";
  status: ReconciliationStatus;
  description: string;
}

/**
 * 组件属性接口
 */
interface ModuleReconciliationPanelProps {
  /** 刷新回调 */
  onRefresh?: () => void;
  /** 是否正在加载 */
  loading?: boolean;
  /** 点击模块回调 */
  onModuleClick?: (moduleId: string) => void;
}

/**
 * 8个订单管理模块定义
 */
const modules: Module[] = [
  {
    id: "order-management",
    name: "订单管理",
    icon: <Package className="h-5 w-5" />,
    description: "订单CRUD操作",
    status: "success",
    lastCheckTime: new Date(),
    exceptionCount: 0,
  },
  {
    id: "order-statistics",
    name: "订单统计",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "统计分析",
    status: "success",
    lastCheckTime: new Date(),
    exceptionCount: 0,
  },
  {
    id: "order-detail",
    name: "订单明细",
    icon: <FileText className="h-5 w-5" />,
    description: "详细查询",
    status: "success",
    lastCheckTime: new Date(),
    exceptionCount: 0,
  },
  {
    id: "thirty-days",
    name: "最近30天明细",
    icon: <Calendar className="h-5 w-5" />,
    description: "30天汇总",
    status: "success",
    lastCheckTime: new Date(),
    exceptionCount: 0,
  },
  {
    id: "monthly-stats",
    name: "按月汇总统计",
    icon: <CalendarDays className="h-5 w-5" />,
    description: "月度汇总",
    status: "success",
    lastCheckTime: new Date(),
    exceptionCount: 0,
  },
  {
    id: "yearly-stats",
    name: "按年汇总统计",
    icon: <CalendarRange className="h-5 w-5" />,
    description: "年度汇总",
    status: "success",
    lastCheckTime: new Date(),
    exceptionCount: 0,
  },
  {
    id: "cost-config",
    name: "成本配置",
    icon: <DollarSign className="h-5 w-5" />,
    description: "成本管理",
    status: "success",
    lastCheckTime: new Date(),
    exceptionCount: 0,
  },
  {
    id: "document-center",
    name: "单据中心",
    icon: <Link2 className="h-5 w-5" />,
    description: "单据管理",
    status: "success",
    lastCheckTime: new Date(),
    exceptionCount: 0,
  },
];

/**
 * 模块间勾稽关联关系定义
 */
const moduleLinks: ModuleLink[] = [
  {
    sourceId: "order-management",
    targetId: "order-statistics",
    type: "bidirectional",
    status: "success",
    description: "订单数量、金额、状态勾稽",
  },
  {
    sourceId: "order-statistics",
    targetId: "order-detail",
    type: "bidirectional",
    status: "success",
    description: "统计数据与明细数据勾稽",
  },
  {
    sourceId: "order-detail",
    targetId: "thirty-days",
    type: "bidirectional",
    status: "success",
    description: "明细与30天汇总勾稽",
  },
  {
    sourceId: "thirty-days",
    targetId: "monthly-stats",
    type: "bidirectional",
    status: "success",
    description: "30天与月度汇总勾稽",
  },
  {
    sourceId: "monthly-stats",
    targetId: "yearly-stats",
    type: "bidirectional",
    status: "success",
    description: "月度与年度汇总勾稽",
  },
  {
    sourceId: "cost-config",
    targetId: "order-detail",
    type: "unidirectional",
    status: "success",
    description: "成本配置关联订单明细",
  },
  {
    sourceId: "document-center",
    targetId: "order-management",
    type: "unidirectional",
    status: "success",
    description: "单据关联订单",
  },
];

/**
 * 获取状态颜色
 */
function getStatusColor(status: ReconciliationStatus) {
  switch (status) {
    case "success":
      return "text-green-500";
    case "warning":
      return "text-yellow-500";
    case "error":
      return "text-red-500";
    case "pending":
      return "text-gray-400";
    default:
      return "text-gray-400";
  }
}

/**
 * 获取状态背景色
 */
function getStatusBgColor(status: ReconciliationStatus) {
  switch (status) {
    case "success":
      return "bg-green-50 border-green-200";
    case "warning":
      return "bg-yellow-50 border-yellow-200";
    case "error":
      return "bg-red-50 border-red-200";
    case "pending":
      return "bg-gray-50 border-gray-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
}

/**
 * 获取状态图标
 */
function getStatusIcon(status: ReconciliationStatus) {
  switch (status) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "pending":
      return <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />;
    default:
      return null;
  }
}

/**
 * 模块勾稽关联面板组件
 */
export function ModuleReconciliationPanel({
  onRefresh,
  loading = false,
  onModuleClick,
}: ModuleReconciliationPanelProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // 计算总体状态
  const totalModules = modules.length;
  const successModules = modules.filter((m) => m.status === "success").length;
  const warningModules = modules.filter((m) => m.status === "warning").length;
  const errorModules = modules.filter((m) => m.status === "error").length;
  const overallProgress = (successModules / totalModules) * 100;

  // 获取选中模块的关联
  const selectedModuleLinks = selectedModule
    ? moduleLinks.filter(
        (link) =>
          link.sourceId === selectedModule || link.targetId === selectedModule
      )
    : [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">订单管理模块勾稽关联</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {successModules} 正常
            </Badge>
            {warningModules > 0 && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {warningModules} 警告
              </Badge>
            )}
            {errorModules > 0 && (
              <Badge variant="outline" className="bg-red-50 text-red-700">
                {errorModules} 异常
              </Badge>
            )}
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw
                  className={cn("h-4 w-4", loading && "animate-spin")}
                />
              </Button>
            )}
          </div>
        </div>
        <Progress value={overallProgress} className="h-2 mt-2" />
      </CardHeader>
      <CardContent>
        {/* 模块网格 */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {modules.map((module) => (
            <TooltipProvider key={module.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      "p-3 rounded-lg border transition-all text-left",
                      getStatusBgColor(module.status),
                      selectedModule === module.id
                        ? "ring-2 ring-blue-500"
                        : "hover:shadow-md",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    )}
                    onClick={() => {
                      setSelectedModule(
                        selectedModule === module.id ? null : module.id
                      );
                      onModuleClick?.(module.id);
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={getStatusColor(module.status)}>
                        {module.icon}
                      </span>
                      {getStatusIcon(module.status)}
                    </div>
                    <div className="text-sm font-medium truncate">
                      {module.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {module.description}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <div className="font-medium">{module.name}</div>
                    <div className="text-gray-400">{module.description}</div>
                    {module.exceptionCount > 0 && (
                      <div className="text-red-400 mt-1">
                        {module.exceptionCount} 个异常
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* 关联关系展示 */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {selectedModule
              ? `${modules.find((m) => m.id === selectedModule)?.name} 的关联关系`
              : "模块关联关系"}
          </h4>
          <div className="space-y-2">
            {(selectedModule ? selectedModuleLinks : moduleLinks).map(
              (link, index) => {
                const sourceModule = modules.find(
                  (m) => m.id === link.sourceId
                );
                const targetModule = modules.find(
                  (m) => m.id === link.targetId
                );
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-2 rounded",
                      getStatusBgColor(link.status)
                    )}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">
                        {sourceModule?.name}
                      </span>
                      {link.type === "bidirectional" ? (
                        <ArrowLeftRight className="h-4 w-4 text-blue-500" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="font-medium">
                        {targetModule?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {link.description}
                      </span>
                      {getStatusIcon(link.status)}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* 勾稽说明 */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700 mb-2">
            勾稽关系说明
          </h4>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• 双向箭头 (↔) 表示两个模块之间的数据需要双向勾稽验证</li>
            <li>• 单向箭头 (→) 表示源模块的数据关联到目标模块</li>
            <li>• 绿色表示勾稽通过，黄色表示有警告，红色表示有异常</li>
            <li>• 点击模块可查看该模块的所有关联关系</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default ModuleReconciliationPanel;
