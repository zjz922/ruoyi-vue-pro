package cn.iocoder.yudao.module.finance.controller.admin.sync;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.*;
import cn.iocoder.yudao.module.finance.service.sync.SyncTaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 同步任务")
@RestController
@RequestMapping("/finance/sync/task")
@Validated
public class SyncTaskController {

    @Resource
    private SyncTaskService syncTaskService;

    @PostMapping("/create")
    @Operation(summary = "创建同步任务")
    @PreAuthorize("@ss.hasPermission('finance:sync:create')")
    public CommonResult<Long> createSyncTask(@Valid @RequestBody SyncTaskCreateReqVO createReqVO) {
        return success(syncTaskService.createSyncTask(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新同步任务")
    @PreAuthorize("@ss.hasPermission('finance:sync:update')")
    public CommonResult<Boolean> updateSyncTask(@Valid @RequestBody SyncTaskUpdateReqVO updateReqVO) {
        syncTaskService.updateSyncTask(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除同步任务")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:sync:delete')")
    public CommonResult<Boolean> deleteSyncTask(@RequestParam("id") Long id) {
        syncTaskService.deleteSyncTask(id);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得同步任务")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:sync:query')")
    public CommonResult<SyncTaskRespVO> getSyncTask(@RequestParam("id") Long id) {
        return success(syncTaskService.getSyncTask(id));
    }

    @GetMapping("/page")
    @Operation(summary = "获得同步任务分页")
    @PreAuthorize("@ss.hasPermission('finance:sync:query')")
    public CommonResult<PageResult<SyncTaskRespVO>> getSyncTaskPage(@Valid SyncTaskPageReqVO pageVO) {
        return success(syncTaskService.getSyncTaskPage(pageVO));
    }

    @PostMapping("/execute")
    @Operation(summary = "立即执行同步任务")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:sync:update')")
    public CommonResult<Boolean> executeSyncTask(@RequestParam("id") Long id) {
        syncTaskService.executeSyncTask(id);
        return success(true);
    }
}
