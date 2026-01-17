package cn.iocoder.yudao.module.finance.controller.admin.oauth.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 抖店授权状态响应VO
 *
 * @author 闪电帐PRO
 */
@Schema(description = "管理后台 - 抖店授权状态响应VO")
@Data
public class DoudianAuthStatusRespVO {

    @Schema(description = "是否已授权", required = true)
    private Boolean authorized;

    @Schema(description = "已授权的店铺列表")
    private List<AuthorizedShop> shops;

    /**
     * 已授权店铺信息
     */
    @Data
    public static class AuthorizedShop {

        @Schema(description = "店铺ID", required = true)
        private Long shopId;

        @Schema(description = "店铺名称")
        private String shopName;

        @Schema(description = "授权状态：valid-有效, expired-已过期, revoked-已撤销")
        private String status;

        @Schema(description = "过期时间")
        private LocalDateTime expireTime;

        @Schema(description = "授权时间")
        private LocalDateTime authorizeTime;

        @Schema(description = "授权范围")
        private String scope;
    }
}
