package cn.iocoder.yudao.module.finance.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 数据同步状态枚举
 *
 * @author 闪电账PRO
 */
@Getter
@AllArgsConstructor
public enum SyncStatusEnum {

    PROCESSING("进行中", "processing"),
    SUCCESS("成功", "success"),
    FAILED("失败", "failed"),
    PARTIAL_SUCCESS("部分成功", "partial_success");

    /**
     * 状态名称
     */
    private final String name;

    /**
     * 状态值
     */
    private final String value;

}
