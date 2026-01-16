package cn.iocoder.yudao.module.finance.controller.admin.doudianconfig;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.finance.controller.admin.doudianconfig.vo.DoudianConfigCreateReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.doudianconfig.vo.DoudianConfigPageReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.doudianconfig.vo.DoudianConfigRespVO;
import cn.iocoder.yudao.module.finance.controller.admin.doudianconfig.vo.DoudianConfigUpdateReqVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.DoudianConfigDO;
import cn.iocoder.yudao.module.finance.service.DoudianConfigService;
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
 * 抖店配置管理 API
 *
 * @author 闪电账PRO
 */
@Tag(name = "管理后台 - 抖店配置管理")
@RestController
@RequestMapping("/finance/doudian-config")
@Validated
public class DoudianConfigController {

    @Resource
    private DoudianConfigService doudianConfigService;

    @PostMapping
    @Operation(summary = "创建抖店配置")
    @PreAuthorize("@ss.hasPermission('finance:doudianConfig:create')")
    public CommonResult<Long> createDoudianConfig(@Valid @RequestBody DoudianConfigCreateReqVO createReqVO) {
        return success(doudianConfigService.createDoudianConfig(createReqVO));
    }

    @PutMapping
    @Operation(summary = "更新抖店配置")
    @PreAuthorize("@ss.hasPermission('finance:doudianConfig:update')")
    public CommonResult<Boolean> updateDoudianConfig(@Valid @RequestBody DoudianConfigUpdateReqVO updateReqVO) {
        doudianConfigService.updateDoudianConfig(updateReqVO);
        return success(true);
    }

    @DeleteMapping
    @Operation(summary = "删除抖店配置")
    @Parameter(name = "id", description = "配置ID", required = true)
    @PreAuthorize("@ss.hasPermission('finance:doudianConfig:delete')")
    public CommonResult<Boolean> deleteDoudianConfig(@RequestParam("id") Long id) {
        doudianConfigService.deleteDoudianConfig(id);
        return success(true);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取抖店配置")
    @Parameter(name = "id", description = "配置ID", required = true)
    @PreAuthorize("@ss.hasPermission('finance:doudianConfig:query')")
    public CommonResult<DoudianConfigRespVO> getDoudianConfig(@PathVariable("id") Long id) {
        DoudianConfigDO doudianConfig = doudianConfigService.getDoudianConfig(id);
        return success(BeanUtils.toBean(doudianConfig, DoudianConfigRespVO.class));
    }

    @GetMapping("/page")
    @Operation(summary = "获取抖店配置分页")
    @PreAuthorize("@ss.hasPermission('finance:doudianConfig:query')")
    public CommonResult<PageResult<DoudianConfigRespVO>> getDoudianConfigPage(@Valid DoudianConfigPageReqVO pageReqVO) {
        PageResult<DoudianConfigDO> pageResult = doudianConfigService.getDoudianConfigPage(pageReqVO);
        return success(BeanUtils.toBean(pageResult, DoudianConfigRespVO.class));
    }

}
