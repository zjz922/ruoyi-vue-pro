package cn.iocoder.yudao.module.finance.dal.dataobject;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 商品成本数据对象
 *
 * @author 闪电账PRO
 */
@TableName("finance_product_cost")
@KeySequence("finance_product_cost_seq")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCostDO extends BaseDO {

    /**
     * 商品成本ID
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
     * 商品ID
     */
    private String productId;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * SKU ID
     */
    private String skuId;

    /**
     * 成本价
     */
    private BigDecimal cost;

    /**
     * 销售价
     */
    private BigDecimal salePrice;

    /**
     * 库存数量
     */
    private Integer stock;

    /**
     * 成本计算方法 (加权平均、最新成本、先进先出等)
     */
    private String costMethod;

    /**
     * 成本更新时间
     */
    private Long costUpdateTime;

    /**
     * 来源平台 (doudian等)
     */
    private String platform;

    /**
     * 平台商品ID
     */
    private String platformProductId;

    /**
     * 备注
     */
    private String remark;

    /**
     * 删除标志 (0 未删除, 1 已删除)
     */
    private Integer delFlag;
}
