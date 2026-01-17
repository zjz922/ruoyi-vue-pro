package cn.iocoder.yudao.module.finance.enums;

import cn.iocoder.yudao.framework.common.exception.ErrorCode;

/**
 * Finance 错误码枚举类
 *
 * finance 系统，使用 1-006-000-000 段
 */
public interface ErrorCodeConstants {

    // ========== 同步模块 1-006-001-000 ==========
    ErrorCode SYNC_TASK_NOT_EXISTS = new ErrorCode(1_006_001_000, "同步任务不存在");
    ErrorCode SYNC_LOG_NOT_EXISTS = new ErrorCode(1_006_001_001, "同步日志不存在");
    ErrorCode SYNC_EXCEPTION_NOT_EXISTS = new ErrorCode(1_006_001_002, "同步异常不存在");

    // ========== 平台配置模块 1-006-002-000 ==========
    ErrorCode PLATFORM_CONFIG_NOT_EXISTS = new ErrorCode(1_006_002_000, "平台配置不存在");
    ErrorCode DOUDIAN_CONFIG_NOT_EXISTS = new ErrorCode(1_006_002_001, "抖店配置不存在");
    ErrorCode QIANCHUAN_CONFIG_NOT_EXISTS = new ErrorCode(1_006_002_002, "千川配置不存在");
    ErrorCode JST_CONFIG_NOT_EXISTS = new ErrorCode(1_006_002_003, "聚水潭配置不存在");

    // ========== 订单模块 1-006-003-000 ==========
    ErrorCode ORDER_NOT_EXISTS = new ErrorCode(1_006_003_000, "订单不存在");

    // ========== 资金流水模块 1-006-004-000 ==========
    ErrorCode CASHFLOW_NOT_EXISTS = new ErrorCode(1_006_004_000, "资金流水不存在");

    // ========== 对账模块 1-006-005-000 ==========
    ErrorCode RECONCILIATION_NOT_EXISTS = new ErrorCode(1_006_005_000, "对账记录不存在");

    // ========== 预警模块 1-006-006-000 ==========
    ErrorCode ALERT_NOT_EXISTS = new ErrorCode(1_006_006_000, "预警记录不存在");
    ErrorCode ALERT_RULE_NOT_EXISTS = new ErrorCode(1_006_006_001, "预警规则不存在");
}
