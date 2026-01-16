package cn.iocoder.yudao.module.finance.dal.dataobject;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 千川配置 DO
 *
 * @author 闪电帐PRO
 */
@TableName("finance_qianchuan_config")
@KeySequence("finance_qianchuan_config_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QianchuanConfigDO extends BaseDO {

    /**
     * 配置ID
     */
    @TableId
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
     * 广告主ID
     */
    private String advertiserId;

    /**
     * Access Token
     */
    private String accessToken;

    /**
     * Refresh Token
     */
    private String refreshToken;

    /**
     * Token过期时间
     */
    private LocalDateTime tokenExpiresAt;

    /**
     * 授权状态
     * 0-未授权 1-已授权 2-已过期 3-已失效
     */
    private Integer authStatus;

    /**
     * 最后同步时间
     */
    private LocalDateTime lastSyncAt;

    /**
     * 备注
     */
    private String remark;

}
