package cn.iocoder.yudao.module.finance.controller.admin.ledger;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.ledger.vo.*;
import cn.iocoder.yudao.module.finance.service.LedgerFundsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

/**
 * 总账管理 - 资金管理 Controller
 * 
 * 对应前端页面：Funds.tsx
 * API路径前缀：/api/ledger/funds
 *
 * @author 闪电帐PRO
 */
@Tag(name = "管理后台 - 总账管理 - 资金管理")
@RestController
@RequestMapping("/api/ledger/funds")
@Validated
@RequiredArgsConstructor
public class LedgerFundsController {

    private final LedgerFundsService fundsService;

    @GetMapping("/overview")
    @Operation(summary = "获取资金总览")
    public CommonResult<FundsOverviewRespVO> getOverview(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId) {
        return success(fundsService.getOverview(shopId));
    }

    @GetMapping("/accounts")
    @Operation(summary = "获取账户列表")
    public CommonResult<List<FundsAccountVO>> getAccounts(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId) {
        return success(fundsService.getAccounts(shopId));
    }

    @PostMapping("/transfer")
    @Operation(summary = "账户间转账")
    public CommonResult<Map<String, Object>> transfer(@RequestBody FundsTransferReqVO reqVO) {
        return success(fundsService.transfer(reqVO));
    }

    @PostMapping("/withdraw")
    @Operation(summary = "提现申请")
    public CommonResult<Map<String, Object>> withdraw(@RequestBody FundsWithdrawReqVO reqVO) {
        return success(fundsService.withdraw(reqVO));
    }

    @GetMapping("/transactions")
    @Operation(summary = "获取资金流水")
    public CommonResult<PageResult<FundsTransactionVO>> getTransactions(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "账户ID") @RequestParam(value = "accountId", required = false) Long accountId,
            @Parameter(description = "类型") @RequestParam(value = "type", required = false) String type,
            @Parameter(description = "开始日期") @RequestParam(value = "startDate", required = false) String startDate,
            @Parameter(description = "结束日期") @RequestParam(value = "endDate", required = false) String endDate,
            @Parameter(description = "页码") @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页数量") @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return success(fundsService.getTransactions(shopId, accountId, type, startDate, endDate, pageNum, pageSize));
    }

    @GetMapping("/forecast")
    @Operation(summary = "获取资金预测")
    public CommonResult<FundsForecastRespVO> getForecast(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "预测天数") @RequestParam(value = "days", defaultValue = "7") Integer days) {
        return success(fundsService.getForecast(shopId, days));
    }

    @GetMapping("/withdraw-records")
    @Operation(summary = "获取提现记录")
    public CommonResult<PageResult<FundsWithdrawRecordVO>> getWithdrawRecords(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId,
            @Parameter(description = "页码") @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页数量") @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return success(fundsService.getWithdrawRecords(shopId, pageNum, pageSize));
    }

    @GetMapping("/reconciliation-rules")
    @Operation(summary = "获取对账规则")
    public CommonResult<List<FundsReconciliationRuleVO>> getReconciliationRules(
            @Parameter(description = "店铺ID") @RequestParam("shopId") String shopId) {
        return success(fundsService.getReconciliationRules(shopId));
    }

    @PostMapping("/reconciliation-rules")
    @Operation(summary = "保存对账规则")
    public CommonResult<Map<String, Object>> saveReconciliationRule(@RequestBody FundsReconciliationRuleVO reqVO) {
        return success(fundsService.saveReconciliationRule(reqVO));
    }
}
