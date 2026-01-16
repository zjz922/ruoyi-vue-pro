package cn.iocoder.yudao.module.finance.controller.admin.synclog.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 数据同步日志分页请求 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "数据同步日志分页请求")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncLogPageReqVO extends PageParam {

    @Schema(description = "店铺ID")
    private Long shopId;

    @Schema(description = "同步类型")
    private String syncType;

    @Schema(description = "数据来源")
    private String dataSource;

    @Schema(description = "同步状态")
    private String syncStatus;

}
