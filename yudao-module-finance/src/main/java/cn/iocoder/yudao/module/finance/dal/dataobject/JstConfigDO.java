package cn.iocoder.yudao.module.finance.dal.dataobject;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 聚水潭配置 DO
 *
 * @author 闪电帐PRO
 */
@TableName("finance_jst_config")
@KeySequence("finance_jst_config_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JstConfigDO extends BaseDO {

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
     * 聚水潭App Key
     */
    private String appKey;

    /**
     * 聚水潭App Secret
     */
    private String appSecret;

    /**
     * Access Token
     */
    private String accessToken;

    /**
     * Token过期时间
     */
    private LocalDateTime tokenExpiresAt;

    /**
     * API地址
     */
    private String apiUrl;

    /**
     * 授权状态
     * 0-未配置 1-已配置 2-连接失败
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
