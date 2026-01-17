package cn.flashsaas.module.finance.dal.dataobject.cost;

import cn.flashsaas.framework.mybatis.core.dataobject.BaseDO;
import cn.flashsaas.framework.tenant.core.db.TenantBaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 商品成本 DO
 *
 * @author 闪电账PRO
 */
@TableName("finance_product_cost")
@KeySequence("finance_product_cost_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCostDO extends TenantBaseDO {

    /**
     * 主键ID
     */
    @TableId
    private Long id;

    /**
     * 商品号（抖店商品ID）
     */
    private String productId;

    /**
     * SKU编码
     */
    private String sku;

    /**
     * 商品标题
     */
    private String title;

    /**
     * 商品成本价
     */
    private BigDecimal cost;

    /**
     * 商家编码
     */
    private String merchantCode;

    /**
     * 商品售价
     */
    private BigDecimal price;

    /**
     * 自定义名称
     */
    private String customName;

    /**
     * 库存数量
     */
    private Integer stock;

    /**
     * 状态：0有效，1删除
     */
    private Integer status;

    /**
     * 最新生效时间
     */
    private LocalDateTime effectiveDate;

    /**
     * 店铺名称
     */
    private String shopName;

}
