package cn.iocoder.yudao.module.finance.controller.admin.synclog;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.finance.controller.admin.synclog.vo.SyncLogPageReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.synclog.vo.SyncLogRespVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.SyncLogDO;
import cn.iocoder.yudao.module.finance.service.SyncLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 数据同步日志管理 API
 *
 * @author 闪电账PRO
 */
@Tag(name = "管理后台 - 数据同步日志管理")
@RestController
@RequestMapping("/finance/sync-log")
@Validated
public class SyncLogController {

    @Resource
    private SyncLogService syncLogService;

    @GetMapping("/{id}")
    @Operation(summary = "获取同步日志")
    @Parameter(name = "id", description = "同步日志ID", required = true)
    @PreAuthorize("@ss.hasPermission('finance:syncLog:query')")
    public CommonResult<SyncLogRespVO> getSyncLog(@PathVariable("id") Long id) {
        SyncLogDO syncLog = syncLogService.getSyncLog(id);
        return success(BeanUtils.toBean(syncLog, SyncLogRespVO.class));
    }

    @GetMapping("/page")
    @Operation(summary = "获取同步日志分页")
    @PreAuthorize("@ss.hasPermission('finance:syncLog:query')")
    public CommonResult<PageResult<SyncLogRespVO>> getSyncLogPage(@Valid SyncLogPageReqVO pageReqVO) {
        PageResult<SyncLogDO> pageResult = syncLogService.getSyncLogPage(pageReqVO);
        return success(BeanUtils.toBean(pageResult, SyncLogRespVO.class));
    }

}
