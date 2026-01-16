package cn.iocoder.yudao.module.finance.controller.admin.sync;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.DataSyncReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.DataSyncRespVO;
import cn.iocoder.yudao.module.finance.service.DataSyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 数据同步 API
 *
 * @author 闪电账PRO
 */
@Tag(name = "管理后台 - 数据同步")
@RestController
@RequestMapping("/finance/sync")
@Validated
public class DataSyncController {

    @Resource
    private DataSyncService dataSyncService;

    @PostMapping("/doudian/orders")
    @Operation(summary = "同步抖店订单")
    @PreAuthorize("@ss.hasPermission('finance:sync:doudian')")
    public CommonResult<DataSyncRespVO> syncDoudianOrders(@Valid @RequestBody DataSyncReqVO reqVO) {
        int count = dataSyncService.syncDoudianOrders(reqVO.getShopId(), reqVO.getStartDate(), reqVO.getEndDate());
        return success(DataSyncRespVO.builder().syncCount(count).syncType("DOUDIAN_ORDER").build());
    }

    @PostMapping("/doudian/cashflow")
    @Operation(summary = "同步抖店资金流水")
    @PreAuthorize("@ss.hasPermission('finance:sync:doudian')")
    public CommonResult<DataSyncRespVO> syncDoudianCashflow(@Valid @RequestBody DataSyncReqVO reqVO) {
        int count = dataSyncService.syncDoudianCashflow(reqVO.getShopId(), reqVO.getStartDate(), reqVO.getEndDate());
        return success(DataSyncRespVO.builder().syncCount(count).syncType("DOUDIAN_CASHFLOW").build());
    }

    @PostMapping("/qianchuan")
    @Operation(summary = "同步千川推广数据")
    @PreAuthorize("@ss.hasPermission('finance:sync:qianchuan')")
    public CommonResult<DataSyncRespVO> syncQianchuanData(@Valid @RequestBody DataSyncReqVO reqVO) {
        int count = dataSyncService.syncQianchuanData(reqVO.getShopId(), reqVO.getStartDate(), reqVO.getEndDate());
        return success(DataSyncRespVO.builder().syncCount(count).syncType("QIANCHUAN").build());
    }

    @PostMapping("/jst/inbound")
    @Operation(summary = "同步聚水潭入库数据")
    @PreAuthorize("@ss.hasPermission('finance:sync:jst')")
    public CommonResult<DataSyncRespVO> syncJstInbound(@Valid @RequestBody DataSyncReqVO reqVO) {
        int count = dataSyncService.syncJstInbound(reqVO.getShopId(), reqVO.getStartDate(), reqVO.getEndDate());
        return success(DataSyncRespVO.builder().syncCount(count).syncType("JST_INBOUND").build());
    }

    @PostMapping("/jst/outbound")
    @Operation(summary = "同步聚水潭出库数据")
    @PreAuthorize("@ss.hasPermission('finance:sync:jst')")
    public CommonResult<DataSyncRespVO> syncJstOutbound(@Valid @RequestBody DataSyncReqVO reqVO) {
        int count = dataSyncService.syncJstOutbound(reqVO.getShopId(), reqVO.getStartDate(), reqVO.getEndDate());
        return success(DataSyncRespVO.builder().syncCount(count).syncType("JST_OUTBOUND").build());
    }

    @PostMapping("/jst/inventory")
    @Operation(summary = "同步聚水潭库存数据")
    @PreAuthorize("@ss.hasPermission('finance:sync:jst')")
    public CommonResult<DataSyncRespVO> syncJstInventory(@RequestParam("shopId") Long shopId) {
        int count = dataSyncService.syncJstInventory(shopId);
        return success(DataSyncRespVO.builder().syncCount(count).syncType("JST_INVENTORY").build());
    }

    @PostMapping("/all")
    @Operation(summary = "全量同步所有数据")
    @PreAuthorize("@ss.hasPermission('finance:sync:all')")
    public CommonResult<Boolean> syncAllData(@Valid @RequestBody DataSyncReqVO reqVO) {
        dataSyncService.syncAllData(reqVO.getShopId(), reqVO.getStartDate(), reqVO.getEndDate());
        return success(true);
    }

    @PostMapping("/daily-summary")
    @Operation(summary = "执行每日数据汇总")
    @PreAuthorize("@ss.hasPermission('finance:sync:summary')")
    public CommonResult<Boolean> executeDailySummary(@RequestParam("shopId") Long shopId,
                                                      @RequestParam("date") String date) {
        dataSyncService.executeDailySummary(shopId, java.time.LocalDate.parse(date));
        return success(true);
    }

    @PostMapping("/reconciliation")
    @Operation(summary = "执行数据勾稽校验")
    @PreAuthorize("@ss.hasPermission('finance:sync:reconciliation')")
    public CommonResult<Integer> executeDataReconciliation(@Valid @RequestBody DataSyncReqVO reqVO) {
        int differenceCount = dataSyncService.executeDataReconciliation(
                reqVO.getShopId(), reqVO.getStartDate(), reqVO.getEndDate());
        return success(differenceCount);
    }
}
