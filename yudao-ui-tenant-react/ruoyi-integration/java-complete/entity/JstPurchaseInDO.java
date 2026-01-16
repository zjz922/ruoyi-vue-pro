package com.yudao.module.finance.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.yudao.framework.common.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 聚水潭入库单 DO
 */
@TableName("finance_jst_purchase_in")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JstPurchaseInDO extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 租户ID
     */
    private Long tenantId;

    /**
     * 入库单号
     */
    private String purchaseInNo;

    /**
     * 采购单号
     */
    private String purchaseNo;

    /**
     * 仓库ID
     */
    private String warehouseId;

    /**
     * 仓库名称
     */
    private String warehouseName;

    /**
     * 供应商ID
     */
    private String supplierId;

    /**
     * 供应商名称
     */
    private String supplierName;

    /**
     * 入库时间
     */
    private LocalDateTime inboundTime;

    /**
     * 入库类型（采购入库、退货入库等）
     */
    private String inboundType;

    /**
     * 入库状态（待审核、已审核、已入库等）
     */
    private String inboundStatus;

    /**
     * 总数量
     */
    private Integer totalQuantity;

    /**
     * 已入库数量
     */
    private Integer inboundQuantity;

    /**
     * 总金额
     */
    private BigDecimal totalAmount;

    /**
     * 备注
     */
    private String remark;

    /**
     * 外部ID（聚水潭系统ID）
     */
    private String externalId;

    /**
     * 同步状态（0未同步，1已同步）
     */
    private Integer syncStatus;

    /**
     * 最后同步时间
     */
    private LocalDateTime lastSyncTime;
}
