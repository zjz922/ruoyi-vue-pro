package cn.iocoder.yudao.module.finance.controller.admin.sync.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Schema(description = "管理后台 - 同步任务分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class SyncTaskPageReqVO extends PageParam {

    @Schema(description = "租户编号", example = "1")
    private Long tenantId;

    @Schema(description = "任务名称", example = "抖店订单同步")
    private String taskName;

    @Schema(description = "平台类型：1-抖店 2-千川 3-聚水潭", example = "1")
    private Integer platformType;

    @Schema(description = "状态：0-停用 1-启用", example = "1")
    private Integer status;
}
