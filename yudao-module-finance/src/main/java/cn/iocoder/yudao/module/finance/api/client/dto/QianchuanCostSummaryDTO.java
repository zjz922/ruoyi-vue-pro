package cn.iocoder.yudao.module.finance.api.client.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 千川推广费用汇总DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class QianchuanCostSummaryDTO {

    /**
     * 总消耗
     */
    private BigDecimal totalCost = BigDecimal.ZERO;

    /**
     * 总展示次数
     */
    private Long totalShow = 0L;

    /**
     * 总点击次数
     */
    private Long totalClick = 0L;

    /**
     * 总转化次数
     */
    private Long totalConvert = 0L;

    /**
     * ROI
     */
    private BigDecimal roi = BigDecimal.ZERO;

    /**
     * 同步时间
     */
    private LocalDateTime syncTime;
}
