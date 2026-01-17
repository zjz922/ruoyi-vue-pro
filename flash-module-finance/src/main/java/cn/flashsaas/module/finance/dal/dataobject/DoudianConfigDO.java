package cn.flashsaas.module.finance.dal.dataobject;

import cn.flashsaas.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 抖店配置数据对象
 *
 * @author 闪电账PRO
 */
@TableName("finance_doudian_config")
@KeySequence("finance_doudian_config_seq")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoudianConfigDO extends BaseDO {

    /**
     * 配置ID
     */
    private Long id;

    /**
     * 租户ID
     */
    private Long tenantId;

    /**
     * 店铺ID
     */
    private Long shopId;

    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * App Key
     */
    private String appKey;

    /**
     * App Secret
     */
    private String appSecret;

    /**
     * Access Token
     */
    private String accessToken;

    /**
     * Refresh Token
     */
    private String refreshToken;

    /**
     * Token 过期时间
     */
    private Long tokenExpireTime;

    /**
     * 授权状态 (未授权、已授权、已过期)
     */
    private String authStatus;

    /**
     * 授权时间
     */
    private Long authTime;

    /**
     * 是否启用 (0 禁用, 1 启用)
     */
    private Integer enabled;

    /**
     * 备注
     */
    private String remark;

    /**
     * 删除标志 (0 未删除, 1 已删除)
     */
    private Integer delFlag;
}
