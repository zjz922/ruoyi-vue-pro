/**
 * 勾稽检查状态指示器组件
 * 用于展示数据勾稽检查的结果
 */

import { CheckCircle2, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReconciliationCheckItem {
  passed: boolean;
  expected: number | string;
  actual: number | string;
  difference?: number | string;
  message?: string;
}

export interface ReconciliationStatusProps {
  status: "passed" | "failed" | "warning" | "loading";
  title: string;
  message?: string;
  details?: Record<string, ReconciliationCheckItem>;
  timestamp?: Date;
  onRetry?: () => void;
}

export function ReconciliationStatus({
  status,
  title,
  message,
  details,
  timestamp,
  onRetry,
}: ReconciliationStatusProps) {
  const statusConfig = {
    passed: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: CheckCircle2,
      label: "通过",
    },
    failed: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: AlertTriangle,
      label: "失败",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      icon: AlertCircle,
      label: "警告",
    },
    loading: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: Loader2,
      label: "检查中",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "border rounded-lg p-4 space-y-3",
        config.bg,
        config.border,
        config.text
      )}
    >
      {/* 标题行 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={cn("w-5 h-5", status === "loading" && "animate-spin")} />
          <div>
            <h3 className="font-semibold">{title}</h3>
            {message && <p className="text-sm opacity-75">{message}</p>}
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-white bg-opacity-50">
            {config.label}
          </span>
        </div>
      </div>

      {/* 详细检查项 */}
      {details && Object.entries(details).length > 0 && (
        <div className="space-y-2 mt-3 pt-3 border-t border-current border-opacity-10">
          {Object.entries(details).map(([key, item]) => (
            <div key={key} className="flex items-start justify-between text-sm">
              <div className="flex-1">
                <div className="font-medium capitalize">{key.replace(/_/g, " ")}</div>
                <div className="text-xs opacity-75 mt-1">
                  {item.message}
                </div>
              </div>
              <div className="text-right ml-4">
                {item.passed ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    通过
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    失败
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 时间戳和重试按钮 */}
      <div className="flex items-center justify-between text-xs opacity-75 mt-3 pt-3 border-t border-current border-opacity-10">
        <span>
          {timestamp
            ? `检查时间: ${new Date(timestamp).toLocaleString()}`
            : ""}
        </span>
        {status === "failed" && onRetry && (
          <button
            onClick={onRetry}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            重试
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * 勾稽异常卡片
 */
export interface ReconciliationExceptionProps {
  id: number;
  exceptionType: string;
  orderId?: number;
  expectedValue?: number;
  actualValue?: number;
  difference?: number;
  status: "pending" | "resolved";
  remark?: string;
  createdAt: Date;
  onResolve?: (id: number) => void;
}

export function ReconciliationException({
  id,
  exceptionType,
  orderId,
  expectedValue,
  actualValue,
  difference,
  status,
  remark,
  createdAt,
  onResolve,
}: ReconciliationExceptionProps) {
  const typeLabels: Record<string, string> = {
    order_count_mismatch: "订单数量不符",
    order_amount_mismatch: "订单金额不符",
    order_status_mismatch: "订单状态不符",
    express_amount_mismatch: "快递费不符",
    commission_amount_mismatch: "佣金不符",
    cost_variance: "成本异常",
    document_not_linked: "单据未关联",
  };

  return (
    <div className="border rounded-lg p-4 bg-red-50 border-red-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h4 className="font-semibold text-red-900">
              {typeLabels[exceptionType] || exceptionType}
            </h4>
          </div>

          {orderId && (
            <p className="text-sm text-red-700 mt-1">订单ID: {orderId}</p>
          )}

          {expectedValue !== undefined && actualValue !== undefined && (
            <div className="text-sm text-red-700 mt-2 space-y-1">
              <p>期望值: {expectedValue}</p>
              <p>实际值: {actualValue}</p>
              {difference !== undefined && (
                <p className="font-medium">差异: {difference}</p>
              )}
            </div>
          )}

          {remark && (
            <p className="text-xs text-red-600 mt-2 italic">备注: {remark}</p>
          )}

          <p className="text-xs text-red-500 mt-2">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>

        <div className="ml-4 flex items-center gap-2">
          {status === "pending" ? (
            <>
              <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                待处理
              </span>
              {onResolve && (
                <button
                  onClick={() => onResolve(id)}
                  className="px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  解决
                </button>
              )}
            </>
          ) : (
            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
              已解决
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
