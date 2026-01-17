package cn.flashsaas.module.finance.api.client.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 聚水潭SKU DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class JstSkuDTO {

    /**
     * SKU ID
     */
    private String skuId;

    /**
     * SKU名称
     */
    private String skuName;

    /**
     * 成本价
     */
    private BigDecimal costPrice;

    /**
     * 销售价
     */
    private BigDecimal salePrice;

    /**
     * 库存数量
     */
    private Integer quantity;
}
