package cn.iocoder.yudao.module.finance.controller.admin.sync.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Schema(description = "管理后台 - 同步异常分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class SyncExceptionPageReqVO extends PageParam {

    @Schema(description = "租户编号", example = "1")
    private Long tenantId;

    @Schema(description = "平台类型：1-抖店 2-千川 3-聚水潭", example = "1")
    private Integer platformType;

    @Schema(description = "异常类型：1-数据格式错误 2-网络超时 3-API限流 4-数据冲突 5-其他", example = "1")
    private Integer exceptionType;

    @Schema(description = "处理状态：0-待处理 1-已重试 2-已忽略 3-已解决", example = "0")
    private Integer handleStatus;
}
