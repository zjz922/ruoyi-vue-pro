package cn.flashsaas.module.finance.controller.admin.cashflow;

import cn.flashsaas.framework.common.pojo.CommonResult;
import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.framework.common.util.object.BeanUtils;
import cn.flashsaas.module.finance.controller.admin.cashflow.vo.CashflowCreateReqVO;
import cn.flashsaas.module.finance.controller.admin.cashflow.vo.CashflowPageReqVO;
import cn.flashsaas.module.finance.controller.admin.cashflow.vo.CashflowRespVO;
import cn.flashsaas.module.finance.controller.admin.cashflow.vo.CashflowUpdateReqVO;
import cn.flashsaas.module.finance.dal.dataobject.CashflowDO;
import cn.flashsaas.module.finance.service.CashflowService;
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
 * 资金流水管理 API
 *
 * @author 闪电账PRO
 */
@Tag(name = "管理后台 - 资金流水管理")
@RestController
@RequestMapping("/finance/cashflow")
@Validated
public class CashflowController {

    @Resource
    private CashflowService cashflowService;

    @PostMapping
    @Operation(summary = "创建资金流水")
    @PreAuthorize("@ss.hasPermission('finance:cashflow:create')")
    public CommonResult<Long> createCashflow(@Valid @RequestBody CashflowCreateReqVO createReqVO) {
        return success(cashflowService.createCashflow(createReqVO));
    }

    @PutMapping
    @Operation(summary = "更新资金流水")
    @PreAuthorize("@ss.hasPermission('finance:cashflow:update')")
    public CommonResult<Boolean> updateCashflow(@Valid @RequestBody CashflowUpdateReqVO updateReqVO) {
        cashflowService.updateCashflow(updateReqVO);
        return success(true);
    }

    @DeleteMapping
    @Operation(summary = "删除资金流水")
    @Parameter(name = "id", description = "资金流水ID", required = true)
    @PreAuthorize("@ss.hasPermission('finance:cashflow:delete')")
    public CommonResult<Boolean> deleteCashflow(@RequestParam("id") Long id) {
        cashflowService.deleteCashflow(id);
        return success(true);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取资金流水")
    @Parameter(name = "id", description = "资金流水ID", required = true)
    @PreAuthorize("@ss.hasPermission('finance:cashflow:query')")
    public CommonResult<CashflowRespVO> getCashflow(@PathVariable("id") Long id) {
        CashflowDO cashflow = cashflowService.getCashflow(id);
        return success(BeanUtils.toBean(cashflow, CashflowRespVO.class));
    }

    @GetMapping("/page")
    @Operation(summary = "获取资金流水分页")
    @PreAuthorize("@ss.hasPermission('finance:cashflow:query')")
    public CommonResult<PageResult<CashflowRespVO>> getCashflowPage(@Valid CashflowPageReqVO pageReqVO) {
        PageResult<CashflowDO> pageResult = cashflowService.getCashflowPage(pageReqVO);
        return success(BeanUtils.toBean(pageResult, CashflowRespVO.class));
    }

    @PutMapping("/{id}/confirm")
    @Operation(summary = "确认资金流水")
    @Parameter(name = "id", description = "资金流水ID", required = true)
    @PreAuthorize("@ss.hasPermission('finance:cashflow:confirm')")
    public CommonResult<Boolean> confirmCashflow(@PathVariable("id") Long id) {
        cashflowService.confirmCashflow(id);
        return success(true);
    }

}
