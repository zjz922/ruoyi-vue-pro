package cn.iocoder.yudao.module.finance.api.client.dto;

import lombok.Data;

import java.util.List;

/**
 * 聚水潭入库单列表DTO
 * 
 * @author 闪电帐PRO
 */
@Data
public class JstInboundListDTO {

    /**
     * 入库单列表
     */
    private List<JstInboundDTO> inbounds;

    /**
     * 总数
     */
    private Long total;
}
