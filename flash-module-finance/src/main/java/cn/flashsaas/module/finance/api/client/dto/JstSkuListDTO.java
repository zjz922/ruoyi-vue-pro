package cn.flashsaas.module.finance.api.client.dto;

import lombok.Data;

import java.util.List;

/**
 * 聚水潭SKU列表DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class JstSkuListDTO {

    /**
     * SKU列表
     */
    private List<JstSkuDTO> skus;

    /**
     * 总数
     */
    private Long total;
}
