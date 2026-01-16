package com.yudao.module.finance.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.yudao.framework.common.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 千川配置 DO
 */
@TableName("finance_qianchuan_config")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QianchuanConfigDO extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 租户ID
     */
    private Long tenantId;

    /**
     * App ID
     */
    private String appId;

    /**
     * App Secret
     */
    private String appSecret;

    /**
     * Access Token
     */
    private String accessToken;

    /**
     * Token过期时间
     */
    private Long tokenExpiresIn;

    /**
     * 授权状态（0未授权，1已授权）
     */
    private Integer authStatus;

    /**
     * 最后同步时间
     */
    private Long lastSyncTime;

    /**
     * 备注
     */
    private String remark;
}
