package cn.flashsaas.module.finance.controller.admin.sync;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.sync.vo.*;
import cn.flashsaas.module.finance.service.sync.SyncExceptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 同步异常")
@RestController
@RequestMapping("/finance/sync/exception")
@Validated
public class SyncExceptionController {

    @Resource
    private SyncExceptionService syncExceptionService;

    @GetMapping("/get")
    @Operation(summary = "获得同步异常")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:sync:query')")
    public CommonResult<SyncExceptionRespVO> getSyncException(@RequestParam("id") Long id) {
        return success(syncExceptionService.getSyncException(id));
    }

    @GetMapping("/page")
    @Operation(summary = "获得同步异常分页")
    @PreAuthorize("@ss.hasPermission('finance:sync:query')")
    public CommonResult<PageResult<SyncExceptionRespVO>> getSyncExceptionPage(@Valid SyncExceptionPageReqVO pageVO) {
        return success(syncExceptionService.getSyncExceptionPage(pageVO));
    }

    @PostMapping("/retry")
    @Operation(summary = "重试同步异常")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:sync:update')")
    public CommonResult<Boolean> retrySyncException(@RequestParam("id") Long id) {
        syncExceptionService.retrySyncException(id);
        return success(true);
    }

    @PostMapping("/ignore")
    @Operation(summary = "忽略同步异常")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:sync:update')")
    public CommonResult<Boolean> ignoreSyncException(@RequestParam("id") Long id) {
        syncExceptionService.ignoreSyncException(id);
        return success(true);
    }

    @PostMapping("/batch-retry")
    @Operation(summary = "批量重试同步异常")
    @PreAuthorize("@ss.hasPermission('finance:sync:update')")
    public CommonResult<Boolean> batchRetrySyncException(@RequestBody List<Long> ids) {
        syncExceptionService.batchRetrySyncException(ids);
        return success(true);
    }

    @PostMapping("/batch-ignore")
    @Operation(summary = "批量忽略同步异常")
    @PreAuthorize("@ss.hasPermission('finance:sync:update')")
    public CommonResult<Boolean> batchIgnoreSyncException(@RequestBody List<Long> ids) {
        syncExceptionService.batchIgnoreSyncException(ids);
        return success(true);
    }
}
