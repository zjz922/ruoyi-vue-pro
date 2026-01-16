package cn.iocoder.yudao.module.finance.api.client.dto;

import lombok.Data;

import java.util.List;

/**
 * 抖店订单列表DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class DoudianOrderListDTO {

    /**
     * 订单列表
     */
    private List<DoudianOrderDTO> orders;

    /**
     * 总数
     */
    private Long total;
}
