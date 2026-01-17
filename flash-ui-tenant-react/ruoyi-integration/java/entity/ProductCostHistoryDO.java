package cn.flashsaas.module.finance.dal.dataobject.cost;

import cn.flashsaas.framework.tenant.core.db.TenantBaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.math.BigDecimal;

/**
 * 商品成本历史记录 DO
 *
 * @author 闪电账PRO
 */
@TableName("finance_product_cost_history")
@KeySequence("finance_product_cost_history_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCostHistoryDO extends TenantBaseDO {

    /**
     * 主键ID
     */
    @TableId
    private Long id;

    /**
     * 关联的商品成本ID
     */
    private Long productCostId;

    /**
     * 商品号
     */
    private String productId;

    /**
     * 旧成本价
     */
    private BigDecimal oldCost;

    /**
     * 新成本价
     */
    private BigDecimal newCost;

    /**
     * 变更原因
     */
    private String reason;

    /**
     * 操作人ID
     */
    private Long operatorId;

    /**
     * 操作人名称
     */
    private String operatorName;

}
