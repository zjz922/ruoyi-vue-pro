package cn.iocoder.yudao.module.finance.api.client.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 千川每日统计DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class QianchuanDailyStatDTO {

    /**
     * 统计日期
     */
    private String statDate;

    /**
     * 消耗
     */
    private BigDecimal cost;

    /**
     * 展示次数
     */
    private Long showCount;

    /**
     * 点击次数
     */
    private Long clickCount;

    /**
     * 转化次数
     */
    private Long convertCount;
}
