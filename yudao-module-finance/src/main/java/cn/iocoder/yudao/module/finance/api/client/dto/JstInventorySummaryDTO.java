package cn.iocoder.yudao.module.finance.api.client.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 聚水潭库存汇总DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class JstInventorySummaryDTO {

    /**
     * 库存总价值
     */
    private BigDecimal totalValue = BigDecimal.ZERO;

    /**
     * 库存总数量
     */
    private Integer totalQuantity = 0;

    /**
     * SKU数量
     */
    private Integer skuCount = 0;

    /**
     * 低库存SKU数量
     */
    private Integer lowStockCount = 0;

    /**
     * 缺货SKU数量
     */
    private Integer outOfStockCount = 0;

    /**
     * 同步时间
     */
    private LocalDateTime syncTime;
}
