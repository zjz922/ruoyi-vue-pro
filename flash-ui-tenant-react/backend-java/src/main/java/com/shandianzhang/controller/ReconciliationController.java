package com.shandianzhang.controller;

import com.shandianzhang.common.Result;
import com.shandianzhang.model.dto.ReconciliationDTO;
import com.shandianzhang.model.entity.ReconciliationEntity;
import com.shandianzhang.model.vo.PageResult;
import com.shandianzhang.model.vo.ReconciliationExceptionVO;
import com.shandianzhang.service.ReconciliationService;
import com.shandianzhang.service.ReconciliationService.FullReconciliationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

/**
 * 勾稽检查控制器
 * 
 * <p>提供勾稽检查相关的REST API接口</p>
 * <p>遵循阿里巴巴Java开发手册规范</p>
 * 
 * @author 闪电账PRO
 * @version 1.0.0
 * @since 2025-01-14
 */
@RestController
@RequestMapping("/api/v1/reconciliation")
public class ReconciliationController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReconciliationController.class);

    @Autowired
    private ReconciliationService reconciliationService;

    /**
     * 执行实时勾稽检查
     * 
     * <p>检查订单管理与订单统计的数据一致性</p>
     * 
     * @param tenantId 租户ID
     * @return 勾稽结果
     */
    @PostMapping("/realtime")
    public Result<ReconciliationDTO> executeRealtimeReconciliation(
            @RequestHeader("X-Tenant-Id") String tenantId) {

        LOGGER.info("执行实时勾稽检查, tenantId={}", tenantId);

        try {
            ReconciliationDTO result = reconciliationService.executeRealtimeReconciliation(tenantId);
            return Result.success(result);
        } catch (Exception e) {
            LOGGER.error("执行实时勾稽检查失败", e);
            return Result.fail("执行实时勾稽检查失败: " + e.getMessage());
        }
    }

    /**
     * 执行日结勾稽检查
     * 
     * <p>检查订单统计与订单明细的数据一致性</p>
     * 
     * @param tenantId 租户ID
     * @param date     日期
     * @return 勾稽结果
     */
    @PostMapping("/daily")
    public Result<ReconciliationDTO> executeDailyReconciliation(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {

        LOGGER.info("执行日结勾稽检查, tenantId={}, date={}", tenantId, date);

        try {
            ReconciliationDTO result = reconciliationService.executeDailyReconciliation(tenantId, date);
            return Result.success(result);
        } catch (Exception e) {
            LOGGER.error("执行日结勾稽检查失败", e);
            return Result.fail("执行日结勾稽检查失败: " + e.getMessage());
        }
    }

    /**
     * 执行月结勾稽检查
     * 
     * <p>检查按月汇总与按年汇总的数据一致性</p>
     * 
     * @param tenantId 租户ID
     * @param month    月份（格式：yyyy-MM）
     * @return 勾稽结果
     */
    @PostMapping("/monthly")
    public Result<ReconciliationDTO> executeMonthlyReconciliation(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestParam String month) {

        LOGGER.info("执行月结勾稽检查, tenantId={}, month={}", tenantId, month);

        try {
            ReconciliationDTO result = reconciliationService.executeMonthlyReconciliation(tenantId, month);
            return Result.success(result);
        } catch (Exception e) {
            LOGGER.error("执行月结勾稽检查失败", e);
            return Result.fail("执行月结勾稽检查失败: " + e.getMessage());
        }
    }

    /**
     * 执行完整勾稽检查
     * 
     * <p>检查8个模块之间的数据一致性</p>
     * 
     * @param tenantId 租户ID
     * @return 完整勾稽结果
     */
    @PostMapping("/full")
    public Result<FullReconciliationResult> executeFullReconciliation(
            @RequestHeader("X-Tenant-Id") String tenantId) {

        LOGGER.info("执行完整勾稽检查, tenantId={}", tenantId);

        try {
            FullReconciliationResult result = reconciliationService.executeFullReconciliation(tenantId);
            return Result.success(result);
        } catch (Exception e) {
            LOGGER.error("执行完整勾稽检查失败", e);
            return Result.fail("执行完整勾稽检查失败: " + e.getMessage());
        }
    }

    /**
     * 获取待处理异常列表
     * 
     * @param tenantId 租户ID
     * @param status   异常状态
     * @param pageNo   页码
     * @param pageSize 每页条数
     * @return 分页结果
     */
    @GetMapping("/exceptions")
    public Result<PageResult<ReconciliationExceptionVO>> getPendingExceptions(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {

        LOGGER.info("获取待处理异常列表, tenantId={}, status={}, pageNo={}, pageSize={}",
                tenantId, status, pageNo, pageSize);

        try {
            PageResult<ReconciliationExceptionVO> result = reconciliationService.getPendingExceptions(
                    tenantId, status, pageNo, pageSize);
            return Result.success(result);
        } catch (Exception e) {
            LOGGER.error("获取待处理异常列表失败", e);
            return Result.fail("获取待处理异常列表失败: " + e.getMessage());
        }
    }

    /**
     * 解决异常
     * 
     * @param tenantId    租户ID
     * @param exceptionId 异常ID
     * @param resolution  解决方案
     * @return 是否成功
     */
    @PostMapping("/exceptions/{exceptionId}/resolve")
    public Result<Boolean> resolveException(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @PathVariable Long exceptionId,
            @RequestParam String resolution) {

        LOGGER.info("解决异常, tenantId={}, exceptionId={}, resolution={}", tenantId, exceptionId, resolution);

        try {
            boolean success = reconciliationService.resolveException(tenantId, exceptionId, resolution);
            return Result.success(success);
        } catch (Exception e) {
            LOGGER.error("解决异常失败", e);
            return Result.fail("解决异常失败: " + e.getMessage());
        }
    }

    /**
     * 获取勾稽日志
     * 
     * @param tenantId 租户ID
     * @param type     勾稽类型
     * @param pageNo   页码
     * @param pageSize 每页条数
     * @return 分页结果
     */
    @GetMapping("/logs")
    public Result<PageResult<ReconciliationEntity>> getReconciliationLogs(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {

        LOGGER.info("获取勾稽日志, tenantId={}, type={}, pageNo={}, pageSize={}",
                tenantId, type, pageNo, pageSize);

        try {
            PageResult<ReconciliationEntity> result = reconciliationService.getReconciliationLogs(
                    tenantId, type, pageNo, pageSize);
            return Result.success(result);
        } catch (Exception e) {
            LOGGER.error("获取勾稽日志失败", e);
            return Result.fail("获取勾稽日志失败: " + e.getMessage());
        }
    }
}
