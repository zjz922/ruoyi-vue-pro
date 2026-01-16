package cn.iocoder.yudao.module.finance.dal.dataobject.doudian;

import cn.iocoder.yudao.framework.tenant.core.db.TenantBaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 抖店API配置 DO
 *
 * @author 闪电账PRO
 */
@TableName("finance_doudian_config")
@KeySequence("finance_doudian_config_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoudianConfigDO extends TenantBaseDO {

    /**
     * 主键ID
     */
    @TableId
    private Long id;

    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * 应用Key
     */
    private String appKey;

    /**
     * 应用Secret（加密存储）
     */
    private String appSecret;

    /**
     * 访问令牌
     */
    private String accessToken;

    /**
     * 刷新令牌
     */
    private String refreshToken;

    /**
     * 令牌过期时间
     */
    private LocalDateTime tokenExpireTime;

    /**
     * 状态：0禁用，1启用
     */
    private Integer status;

    /**
     * 最后同步时间
     */
    private LocalDateTime lastSyncTime;

}
