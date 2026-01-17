package cn.flashsaas.module.finance.controller.admin.sync.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 数据同步响应 VO
 *
 * @author 闪电账PRO
 */
@Schema(description = "管理后台 - 数据同步响应 VO")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataSyncRespVO {

    @Schema(description = "同步类型", example = "DOUDIAN_ORDER")
    private String syncType;

    @Schema(description = "同步数量", example = "100")
    private Integer syncCount;

    @Schema(description = "同步状态", example = "SUCCESS")
    private String status;

    @Schema(description = "错误信息", example = "")
    private String errorMessage;
}
