/**
 * 勾稽关联状态指示器组件
 * 
 * 用于在订单管理模块的各页面中展示勾稽状态
 * 遵循阿里代码规范
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @since 2025-01-14
 */

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Link2,
  Unlink,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/**
 * 勾稽状态类型
 */
type ReconciliationStatus = "success" | "warning" | "error" | "pending";

/**
 * 勾稽项接口
 */
interface ReconciliationItem {
  name: string;
  expected: number;
  actual: number;
  difference: number;
  status: ReconciliationStatus;
  tolerance: number;
}

/**
 * 勾稽结果接口
 */
interface ReconciliationResult {
  id: string;
  type: string;
  checkTime: Date;
  status: ReconciliationStatus;
  items: ReconciliationItem[];
  exceptionCount: number;
  summary: string;
}

/**
 * 模块关联接口
 */
interface ModuleRelation {
  sourceModule: string;
  targetModule: string;
  relationType: "bidirectional" | "unidirectional";
  status: ReconciliationStatus;
  lastCheckTime: Date;
}

/**
 * 组件属性接口
 */
interface ReconciliationIndicatorProps {
  /** 当前模块名称 */
  moduleName: string;
  /** 勾稽结果 */
  reconciliationResult?: ReconciliationResult;
  /** 模块关联列表 */
  moduleRelations?: ModuleRelation[];
  /** 是否显示详情 */
  showDetails?: boolean;
  /** 刷新回调 */
  onRefresh?: () => void;
  /** 是否正在加载 */
  loading?: boolean;
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
      return <Info className="h-4 w-4 text-gray-400" />;
  }
}

/**
 * 获取状态颜色
 */
function getStatusColor(status: ReconciliationStatus) {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-700 border-green-200";
    case "warning":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "error":
      return "bg-red-100 text-red-700 border-red-200";
    case "pending":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

/**
 * 获取状态文本
 */
function getStatusText(status: ReconciliationStatus) {
  switch (status) {
    case "success":
      return "正常";
    case "warning":
      return "警告";
    case "error":
      return "异常";
    case "pending":
      return "检查中";
    default:
      return "未知";
  }
}

/**
 * 格式化数字
 */
function formatNumber(value: number): string {
  return value.toLocaleString("zh-CN", { maximumFractionDigits: 2 });
}

/**
 * 格式化时间
 */
function formatTime(date: Date): string {
  return new Date(date).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 勾稽关联状态指示器组件
 */
export function ReconciliationIndicator({
  moduleName,
  reconciliationResult,
  moduleRelations = [],
  showDetails = false,
  onRefresh,
  loading = false,
}: ReconciliationIndicatorProps) {
  const [isOpen, setIsOpen] = useState(showDetails);

  // 计算总体状态
  const overallStatus: ReconciliationStatus = reconciliationResult?.status || "pending";

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {/* 头部 */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-3">
            {getStatusIcon(overallStatus)}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{moduleName}</span>
                <Badge
                  variant="outline"
                  className={cn("text-xs", getStatusColor(overallStatus))}
                >
                  {getStatusText(overallStatus)}
                </Badge>
              </div>
              {reconciliationResult && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {reconciliationResult.summary}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
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
                  </TooltipTrigger>
                  <TooltipContent>刷新勾稽状态</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        {/* 详情内容 */}
        <CollapsibleContent>
          <div className="p-3 space-y-4">
            {/* 勾稽检查项 */}
            {reconciliationResult && reconciliationResult.items.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2">
                  勾稽检查项
                </h4>
                <div className="space-y-2">
                  {reconciliationResult.items.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-2 rounded text-sm",
                        item.status === "success"
                          ? "bg-green-50"
                          : item.status === "warning"
                          ? "bg-yellow-50"
                          : "bg-red-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-gray-500">
                          期望: {formatNumber(item.expected)}
                        </span>
                        <span className="text-gray-500">
                          实际: {formatNumber(item.actual)}
                        </span>
                        {item.difference !== 0 && (
                          <span
                            className={cn(
                              "font-medium",
                              item.difference > 0
                                ? "text-red-600"
                                : "text-green-600"
                            )}
                          >
                            差异: {item.difference > 0 ? "+" : ""}
                            {formatNumber(item.difference)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 模块关联 */}
            {moduleRelations.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2">
                  模块关联
                </h4>
                <div className="space-y-2">
                  {moduleRelations.map((relation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {relation.relationType === "bidirectional" ? (
                          <Link2 className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Unlink className="h-4 w-4 text-gray-400" />
                        )}
                        <span>
                          {relation.sourceModule}{" "}
                          {relation.relationType === "bidirectional"
                            ? "↔"
                            : "→"}{" "}
                          {relation.targetModule}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", getStatusColor(relation.status))}
                        >
                          {getStatusText(relation.status)}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {formatTime(relation.lastCheckTime)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 最后检查时间 */}
            {reconciliationResult && (
              <div className="text-xs text-gray-400 text-right">
                最后检查: {formatTime(reconciliationResult.checkTime)}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

/**
 * 简化版勾稽状态指示器（用于表格行内）
 */
export function ReconciliationStatusBadge({
  status,
  tooltip,
}: {
  status: ReconciliationStatus;
  tooltip?: string;
}) {
  const badge = (
    <Badge
      variant="outline"
      className={cn("text-xs gap-1", getStatusColor(status))}
    >
      {getStatusIcon(status)}
      {getStatusText(status)}
    </Badge>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

/**
 * 模块关联图标（用于导航菜单）
 */
export function ModuleRelationIcon({
  hasRelation,
  relationCount,
}: {
  hasRelation: boolean;
  relationCount?: number;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            {hasRelation ? (
              <Link2 className="h-4 w-4 text-blue-500" />
            ) : (
              <Unlink className="h-4 w-4 text-gray-300" />
            )}
            {relationCount && relationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] rounded-full h-3 w-3 flex items-center justify-center">
                {relationCount}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {hasRelation
            ? `已关联 ${relationCount || 0} 个模块`
            : "未建立关联"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ReconciliationIndicator;
