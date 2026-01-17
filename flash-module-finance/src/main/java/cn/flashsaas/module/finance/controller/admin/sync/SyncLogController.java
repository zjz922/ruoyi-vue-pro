package cn.flashsaas.module.finance.controller.admin.sync;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.sync.vo.*;
import cn.flashsaas.module.finance.service.sync.SyncLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 同步日志")
@RestController
@RequestMapping("/finance/sync/log")
@Validated
public class SyncLogController {

    @Resource
    private SyncLogService syncLogService;

    @GetMapping("/get")
    @Operation(summary = "获得同步日志")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:sync:query')")
    public CommonResult<SyncLogRespVO> getSyncLog(@RequestParam("id") Long id) {
        return success(syncLogService.getSyncLog(id));
    }

    @GetMapping("/page")
    @Operation(summary = "获得同步日志分页")
    @PreAuthorize("@ss.hasPermission('finance:sync:query')")
    public CommonResult<PageResult<SyncLogRespVO>> getSyncLogPage(@Valid SyncLogPageReqVO pageVO) {
        return success(syncLogService.getSyncLogPage(pageVO));
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除同步日志")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:sync:delete')")
    public CommonResult<Boolean> deleteSyncLog(@RequestParam("id") Long id) {
        syncLogService.deleteSyncLog(id);
        return success(true);
    }
}
