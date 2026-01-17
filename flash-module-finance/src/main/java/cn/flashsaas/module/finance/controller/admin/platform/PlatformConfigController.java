package cn.flashsaas.module.finance.controller.admin.platform;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.module.finance.controller.admin.platform.vo.*;
import cn.flashsaas.module.finance.service.PlatformConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

import static cn.flashsaas.framework.common.pojo.CommonResult.success;

/**
 * 管理后台 - 平台集成配置
 * 
 * 包含抖店、千川、聚水潭三个平台的配置管理
 */
@Tag(name = "管理后台 - 平台集成配置")
@RestController
@RequestMapping("/finance/platform-config")
@Validated
public class PlatformConfigController {

    @Resource
    private PlatformConfigService platformConfigService;

    // ==================== 抖店配置 ====================

    @GetMapping("/doudian/page")
    @Operation(summary = "获取抖店配置分页")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:query')")
    public CommonResult<PageResult<DoudianConfigRespVO>> getDoudianConfigPage(@Valid DoudianConfigPageReqVO pageVO) {
        return success(platformConfigService.getDoudianConfigPage(pageVO));
    }

    @GetMapping("/doudian/get")
    @Operation(summary = "获取抖店配置详情")
    @Parameter(name = "id", description = "配置编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:platform-config:query')")
    public CommonResult<DoudianConfigRespVO> getDoudianConfig(@RequestParam("id") Long id) {
        return success(platformConfigService.getDoudianConfig(id));
    }

    @PostMapping("/doudian/create")
    @Operation(summary = "创建抖店配置")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:create')")
    public CommonResult<Long> createDoudianConfig(@Valid @RequestBody DoudianConfigCreateReqVO createReqVO) {
        return success(platformConfigService.createDoudianConfig(createReqVO));
    }

    @PutMapping("/doudian/update")
    @Operation(summary = "更新抖店配置")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:update')")
    public CommonResult<Boolean> updateDoudianConfig(@Valid @RequestBody DoudianConfigUpdateReqVO updateReqVO) {
        platformConfigService.updateDoudianConfig(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/doudian/delete")
    @Operation(summary = "删除抖店配置")
    @Parameter(name = "id", description = "配置编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:platform-config:delete')")
    public CommonResult<Boolean> deleteDoudianConfig(@RequestParam("id") Long id) {
        platformConfigService.deleteDoudianConfig(id);
        return success(true);
    }

    @PostMapping("/doudian/test-connection")
    @Operation(summary = "测试抖店连接")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:query')")
    public CommonResult<Boolean> testDoudianConnection(@RequestParam("id") Long id) {
        return success(platformConfigService.testDoudianConnection(id));
    }

    @PostMapping("/doudian/refresh-token")
    @Operation(summary = "刷新抖店Token")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:update')")
    public CommonResult<Boolean> refreshDoudianToken(@RequestParam("id") Long id) {
        platformConfigService.refreshDoudianToken(id);
        return success(true);
    }

    // ==================== 千川配置 ====================

    @GetMapping("/qianchuan/page")
    @Operation(summary = "获取千川配置分页")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:query')")
    public CommonResult<PageResult<QianchuanConfigRespVO>> getQianchuanConfigPage(@Valid QianchuanConfigPageReqVO pageVO) {
        return success(platformConfigService.getQianchuanConfigPage(pageVO));
    }

    @GetMapping("/qianchuan/get")
    @Operation(summary = "获取千川配置详情")
    @Parameter(name = "id", description = "配置编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:platform-config:query')")
    public CommonResult<QianchuanConfigRespVO> getQianchuanConfig(@RequestParam("id") Long id) {
        return success(platformConfigService.getQianchuanConfig(id));
    }

    @PostMapping("/qianchuan/create")
    @Operation(summary = "创建千川配置")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:create')")
    public CommonResult<Long> createQianchuanConfig(@Valid @RequestBody QianchuanConfigCreateReqVO createReqVO) {
        return success(platformConfigService.createQianchuanConfig(createReqVO));
    }

    @PutMapping("/qianchuan/update")
    @Operation(summary = "更新千川配置")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:update')")
    public CommonResult<Boolean> updateQianchuanConfig(@Valid @RequestBody QianchuanConfigUpdateReqVO updateReqVO) {
        platformConfigService.updateQianchuanConfig(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/qianchuan/delete")
    @Operation(summary = "删除千川配置")
    @Parameter(name = "id", description = "配置编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:platform-config:delete')")
    public CommonResult<Boolean> deleteQianchuanConfig(@RequestParam("id") Long id) {
        platformConfigService.deleteQianchuanConfig(id);
        return success(true);
    }

    @PostMapping("/qianchuan/test-connection")
    @Operation(summary = "测试千川连接")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:query')")
    public CommonResult<Boolean> testQianchuanConnection(@RequestParam("id") Long id) {
        return success(platformConfigService.testQianchuanConnection(id));
    }

    @PostMapping("/qianchuan/refresh-token")
    @Operation(summary = "刷新千川Token")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:update')")
    public CommonResult<Boolean> refreshQianchuanToken(@RequestParam("id") Long id) {
        platformConfigService.refreshQianchuanToken(id);
        return success(true);
    }

    // ==================== 聚水潭配置 ====================

    @GetMapping("/jushuitan/page")
    @Operation(summary = "获取聚水潭配置分页")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:query')")
    public CommonResult<PageResult<JushuitanConfigRespVO>> getJushuitanConfigPage(@Valid JushuitanConfigPageReqVO pageVO) {
        return success(platformConfigService.getJushuitanConfigPage(pageVO));
    }

    @GetMapping("/jushuitan/get")
    @Operation(summary = "获取聚水潭配置详情")
    @Parameter(name = "id", description = "配置编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:platform-config:query')")
    public CommonResult<JushuitanConfigRespVO> getJushuitanConfig(@RequestParam("id") Long id) {
        return success(platformConfigService.getJushuitanConfig(id));
    }

    @PostMapping("/jushuitan/create")
    @Operation(summary = "创建聚水潭配置")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:create')")
    public CommonResult<Long> createJushuitanConfig(@Valid @RequestBody JushuitanConfigCreateReqVO createReqVO) {
        return success(platformConfigService.createJushuitanConfig(createReqVO));
    }

    @PutMapping("/jushuitan/update")
    @Operation(summary = "更新聚水潭配置")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:update')")
    public CommonResult<Boolean> updateJushuitanConfig(@Valid @RequestBody JushuitanConfigUpdateReqVO updateReqVO) {
        platformConfigService.updateJushuitanConfig(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/jushuitan/delete")
    @Operation(summary = "删除聚水潭配置")
    @Parameter(name = "id", description = "配置编号", required = true)
    @PreAuthorize("@ss.hasPermission('finance:platform-config:delete')")
    public CommonResult<Boolean> deleteJushuitanConfig(@RequestParam("id") Long id) {
        platformConfigService.deleteJushuitanConfig(id);
        return success(true);
    }

    @PostMapping("/jushuitan/test-connection")
    @Operation(summary = "测试聚水潭连接")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:query')")
    public CommonResult<Boolean> testJushuitanConnection(@RequestParam("id") Long id) {
        return success(platformConfigService.testJushuitanConnection(id));
    }

    @PostMapping("/jushuitan/refresh-token")
    @Operation(summary = "刷新聚水潭Token")
    @PreAuthorize("@ss.hasPermission('finance:platform-config:update')")
    public CommonResult<Boolean> refreshJushuitanToken(@RequestParam("id") Long id) {
        platformConfigService.refreshJushuitanToken(id);
        return success(true);
    }
}
