package cn.iocoder.yudao.module.finance.controller.admin.sync;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.sync.vo.*;
import cn.iocoder.yudao.module.finance.service.SyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 数据同步管理 Controller
 */
@Tag(name = "管理后台 - 数据同步管理")
@RestController
@RequestMapping("/finance/sync")
@Validated
public class SyncController {

    @Resource
    private SyncService syncService;

    // ==================== 同步任务 ====================

    @GetMapping("/task/page")
    @Operation(summary = "获得同步任务分页")
    public CommonResult<PageResult<SyncTaskVO>> getSyncTaskPage(@Valid SyncTaskQueryVO queryVO) {
        return success(syncService.getSyncTaskPage(queryVO));
    }

    @GetMapping("/task/get")
    @Operation(summary = "获得同步任务详情")
    @Parameter(name = "id", description = "任务编号", required = true)
    public CommonResult<SyncTaskVO> getSyncTask(@RequestParam("id") Long id) {
        return success(syncService.getSyncTask(id));
    }

    @PostMapping("/task/create")
    @Operation(summary = "创建同步任务")
    public CommonResult<Long> createSyncTask(@Valid @RequestBody SyncTaskCreateVO createVO) {
        return success(syncService.createSyncTask(createVO));
    }

    @PutMapping("/task/update")
    @Operation(summary = "更新同步任务")
    public CommonResult<Boolean> updateSyncTask(@Valid @RequestBody SyncTaskUpdateVO updateVO) {
        syncService.updateSyncTask(updateVO);
        return success(true);
    }

    @DeleteMapping("/task/delete")
    @Operation(summary = "删除同步任务")
    @Parameter(name = "id", description = "任务编号", required = true)
    public CommonResult<Boolean> deleteSyncTask(@RequestParam("id") Long id) {
        syncService.deleteSyncTask(id);
        return success(true);
    }

    @PostMapping("/task/execute")
    @Operation(summary = "立即执行同步任务")
    @Parameter(name = "id", description = "任务编号", required = true)
    public CommonResult<Boolean> executeSyncTask(@RequestParam("id") Long id) {
        syncService.executeSyncTask(id);
        return success(true);
    }

    // ==================== 同步日志 ====================

    @GetMapping("/log/page")
    @Operation(summary = "获得同步日志分页")
    public CommonResult<PageResult<SyncLogVO>> getSyncLogPage(@Valid SyncLogQueryVO queryVO) {
        return success(syncService.getSyncLogPage(queryVO));
    }

    @GetMapping("/log/get")
    @Operation(summary = "获得同步日志详情")
    @Parameter(name = "id", description = "日志编号", required = true)
    public CommonResult<SyncLogVO> getSyncLog(@RequestParam("id") Long id) {
        return success(syncService.getSyncLog(id));
    }

    @DeleteMapping("/log/delete")
    @Operation(summary = "删除同步日志")
    @Parameter(name = "id", description = "日志编号", required = true)
    public CommonResult<Boolean> deleteSyncLog(@RequestParam("id") Long id) {
        syncService.deleteSyncLog(id);
        return success(true);
    }

    // ==================== 同步异常 ====================

    @GetMapping("/exception/page")
    @Operation(summary = "获得同步异常分页")
    public CommonResult<PageResult<SyncExceptionVO>> getSyncExceptionPage(@Valid SyncExceptionQueryVO queryVO) {
        return success(syncService.getSyncExceptionPage(queryVO));
    }

    @GetMapping("/exception/get")
    @Operation(summary = "获得同步异常详情")
    @Parameter(name = "id", description = "异常编号", required = true)
    public CommonResult<SyncExceptionVO> getSyncException(@RequestParam("id") Long id) {
        return success(syncService.getSyncException(id));
    }

    @PostMapping("/exception/retry")
    @Operation(summary = "重试同步异常")
    @Parameter(name = "id", description = "异常编号", required = true)
    public CommonResult<Boolean> retrySyncException(@RequestParam("id") Long id) {
        syncService.retrySyncException(id);
        return success(true);
    }

    @PostMapping("/exception/ignore")
    @Operation(summary = "忽略同步异常")
    @Parameter(name = "id", description = "异常编号", required = true)
    public CommonResult<Boolean> ignoreSyncException(@RequestParam("id") Long id) {
        syncService.ignoreSyncException(id);
        return success(true);
    }

    @PostMapping("/exception/batch-retry")
    @Operation(summary = "批量重试同步异常")
    public CommonResult<Boolean> batchRetrySyncException(@RequestBody java.util.List<Long> ids) {
        syncService.batchRetrySyncException(ids);
        return success(true);
    }

    @PostMapping("/exception/batch-ignore")
    @Operation(summary = "批量忽略同步异常")
    public CommonResult<Boolean> batchIgnoreSyncException(@RequestBody java.util.List<Long> ids) {
        syncService.batchIgnoreSyncException(ids);
        return success(true);
    }
}
