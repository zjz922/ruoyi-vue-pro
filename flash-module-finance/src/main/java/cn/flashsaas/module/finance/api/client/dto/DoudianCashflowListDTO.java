package cn.flashsaas.module.finance.api.client.dto;

import lombok.Data;

import java.util.List;

/**
 * 抖店资金流水列表DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class DoudianCashflowListDTO {

    /**
     * 流水列表
     */
    private List<DoudianCashflowDTO> cashflows;

    /**
     * 总数
     */
    private Integer total;

    /**
     * 当前页
     */
    private Integer page;

    /**
     * 每页大小
     */
    private Integer pageSize;
}
