package cn.iocoder.yudao.module.finance.dal.dataobject;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 抖店授权Token DO
 *
 * @author 闪电帐PRO
 */
@TableName("finance_doudian_auth_token")
@KeySequence("finance_doudian_auth_token_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoudianAuthTokenDO extends BaseDO {

    /**
     * Token ID
     */
    @TableId
    private Long id;

    /**
     * 租户ID
     */
    private Long tenantId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 店铺ID
     */
    private String shopId;

    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * Access Token
     */
    private String accessToken;

    /**
     * Refresh Token
     */
    private String refreshToken;

    /**
     * Access Token过期时间
     */
    private LocalDateTime accessTokenExpiresAt;

    /**
     * Refresh Token过期时间
     */
    private LocalDateTime refreshTokenExpiresAt;

    /**
     * 授权范围
     */
    private String scope;

    /**
     * 授权状态
     * 0-未授权 1-已授权 2-已过期 3-已失效
     */
    private Integer authStatus;

    /**
     * 最后同步时间
     */
    private LocalDateTime lastSyncAt;

}
