package cn.iocoder.yudao.module.finance.controller.admin.doudian;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.finance.controller.admin.doudian.vo.*;
import cn.iocoder.yudao.module.finance.convert.doudian.DoudianConvert;
import cn.iocoder.yudao.module.finance.dal.dataobject.doudian.DoudianConfigDO;
import cn.iocoder.yudao.module.finance.service.doudian.DoudianService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 管理后台 - 抖店API
 *
 * @author 闪电账PRO
 */
@Tag(name = "管理后台 - 抖店API")
@RestController
@RequestMapping("/finance/doudian")
@Validated
public class DoudianController {

    @Resource
    private DoudianService doudianService;

    // ========== 配置管理 ==========

    @PostMapping("/config/create")
    @Operation(summary = "创建抖店配置")
    @PreAuthorize("@ss.hasPermission('finance:doudian:config')")
    public CommonResult<Long> createConfig(@Valid @RequestBody DoudianConfigCreateReqVO createReqVO) {
        return success(doudianService.createConfig(createReqVO));
    }

    @PutMapping("/config/update")
    @Operation(summary = "更新抖店配置")
    @PreAuthorize("@ss.hasPermission('finance:doudian:config')")
    public CommonResult<Boolean> updateConfig(@Valid @RequestBody DoudianConfigUpdateReqVO updateReqVO) {
        doudianService.updateConfig(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/config/delete")
    @Operation(summary = "删除抖店配置")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:doudian:config')")
    public CommonResult<Boolean> deleteConfig(@RequestParam("id") Long id) {
        doudianService.deleteConfig(id);
        return success(true);
    }

    @GetMapping("/config/get")
    @Operation(summary = "获得抖店配置")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<DoudianConfigRespVO> getConfig(@RequestParam("id") Long id) {
        DoudianConfigDO config = doudianService.getConfig(id);
        return success(DoudianConvert.INSTANCE.convert(config));
    }

    @GetMapping("/config/list")
    @Operation(summary = "获得抖店配置列表")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<List<DoudianConfigRespVO>> getConfigList() {
        List<DoudianConfigDO> list = doudianService.getConfigList();
        return success(DoudianConvert.INSTANCE.convertList(list));
    }

    @GetMapping("/config/check")
    @Operation(summary = "检查API配置状态")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<DoudianConfigCheckRespVO> checkConfig() {
        return success(doudianService.checkConfig());
    }

    // ========== 订单同步 ==========

    @PostMapping("/order/sync")
    @Operation(summary = "同步订单")
    @PreAuthorize("@ss.hasPermission('finance:doudian:sync')")
    public CommonResult<DoudianSyncRespVO> syncOrders(@Valid @RequestBody DoudianSyncReqVO reqVO) {
        return success(doudianService.syncOrders(reqVO));
    }

    @GetMapping("/order/detail")
    @Operation(summary = "获取订单详情")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<Map<String, Object>> getOrderDetail(
            @RequestParam("accessToken") String accessToken,
            @RequestParam("shopOrderId") String shopOrderId) {
        return success(doudianService.getOrderDetail(accessToken, shopOrderId));
    }

    // ========== 商品同步 ==========

    @PostMapping("/product/sync")
    @Operation(summary = "同步商品")
    @PreAuthorize("@ss.hasPermission('finance:doudian:sync')")
    public CommonResult<DoudianSyncRespVO> syncProducts(@Valid @RequestBody DoudianSyncReqVO reqVO) {
        return success(doudianService.syncProducts(reqVO));
    }

    @GetMapping("/product/detail")
    @Operation(summary = "获取商品详情")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<Map<String, Object>> getProductDetail(
            @RequestParam("accessToken") String accessToken,
            @RequestParam("productId") String productId) {
        return success(doudianService.getProductDetail(accessToken, productId));
    }

    // ========== 财务数据 ==========

    @GetMapping("/settle/bill")
    @Operation(summary = "获取结算账单")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<Map<String, Object>> getSettleBill(@Valid DoudianBillReqVO reqVO) {
        return success(doudianService.getSettleBill(reqVO));
    }

    @GetMapping("/account/flow")
    @Operation(summary = "获取资金流水")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<Map<String, Object>> getAccountFlow(@Valid DoudianBillReqVO reqVO) {
        return success(doudianService.getAccountFlow(reqVO));
    }

    @GetMapping("/commission/list")
    @Operation(summary = "获取达人佣金")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<Map<String, Object>> getCommission(@Valid DoudianBillReqVO reqVO) {
        return success(doudianService.getCommission(reqVO));
    }

    // ========== 保险与售后 ==========

    @GetMapping("/insurance/detail")
    @Operation(summary = "获取保险详情")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<Map<String, Object>> getInsurance(
            @RequestParam("accessToken") String accessToken,
            @RequestParam("orderId") String orderId) {
        return success(doudianService.getInsurance(accessToken, orderId));
    }

    @GetMapping("/aftersale/list")
    @Operation(summary = "获取售后列表")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<Map<String, Object>> getAfterSaleList(@Valid DoudianAfterSaleReqVO reqVO) {
        return success(doudianService.getAfterSaleList(reqVO));
    }

    @GetMapping("/aftersale/detail")
    @Operation(summary = "获取售后详情")
    @PreAuthorize("@ss.hasPermission('finance:doudian:query')")
    public CommonResult<Map<String, Object>> getAfterSaleDetail(
            @RequestParam("accessToken") String accessToken,
            @RequestParam("afterSaleId") String afterSaleId) {
        return success(doudianService.getAfterSaleDetail(accessToken, afterSaleId));
    }

}
