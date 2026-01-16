package cn.iocoder.yudao.module.finance.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 授权状态枚举
 *
 * @author 闪电账PRO
 */
@Getter
@AllArgsConstructor
public enum AuthStatusEnum {

    UNAUTHORIZED("未授权", "unauthorized"),
    AUTHORIZED("已授权", "authorized"),
    EXPIRED("已过期", "expired"),
    REVOKED("已撤销", "revoked");

    /**
     * 状态名称
     */
    private final String name;

    /**
     * 状态值
     */
    private final String value;

}
