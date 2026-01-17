package cn.flashsaas.module.finance.dal.dataobject;

import cn.flashsaas.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

/**
 * 抖店店铺信息 DO
 *
 * @author 闪电帐PRO
 */
@TableName("finance_doudian_shop")
@KeySequence("finance_doudian_shop_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoudianShopDO extends BaseDO {

    /**
     * 店铺ID（主键）
     */
    @TableId
    private Long id;

    /**
     * 租户ID
     */
    private Long tenantId;

    /**
     * 抖店店铺ID
     */
    private String shopId;

    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * 店铺Logo
     */
    private String shopLogo;

    /**
     * 店铺类型
     */
    private String shopType;

    /**
     * 店铺状态
     */
    private String shopStatus;

    /**
     * 关联用户ID
     */
    private Long userId;

}
