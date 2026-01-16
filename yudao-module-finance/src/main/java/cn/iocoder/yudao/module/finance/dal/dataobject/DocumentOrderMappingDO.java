package cn.iocoder.yudao.module.finance.dal.dataobject;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

/**
 * 单据订单关联 DO
 *
 * @author 闪电帐PRO
 */
@TableName("finance_document_mapping")
@KeySequence("finance_document_mapping_seq")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentOrderMappingDO extends BaseDO {

    /**
     * 关联ID
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
     * 单据ID
     */
    private Long documentId;

    /**
     * 订单ID
     */
    private Long orderId;

    /**
     * 单据类型
     * 如：SALES_ORDER-销售单, PURCHASE_ORDER-采购单, INBOUND-入库单, OUTBOUND-出库单
     */
    private String documentType;

}
