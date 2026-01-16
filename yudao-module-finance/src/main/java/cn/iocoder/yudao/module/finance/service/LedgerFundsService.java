package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.ledger.vo.*;

import java.util.List;
import java.util.Map;

/**
 * 总账管理 - 资金管理 Service 接口
 *
 * @author 闪电帐PRO
 */
public interface LedgerFundsService {

    /**
     * 获取资金总览
     *
     * @param shopId 店铺ID
     * @return 资金总览
     */
    FundsOverviewRespVO getOverview(String shopId);

    /**
     * 获取账户列表
     *
     * @param shopId 店铺ID
     * @return 账户列表
     */
    List<FundsAccountVO> getAccounts(String shopId);

    /**
     * 账户间转账
     *
     * @param reqVO 转账请求
     * @return 转账结果
     */
    Map<String, Object> transfer(FundsTransferReqVO reqVO);

    /**
     * 提现申请
     *
     * @param reqVO 提现请求
     * @return 提现结果
     */
    Map<String, Object> withdraw(FundsWithdrawReqVO reqVO);

    /**
     * 获取资金流水
     *
     * @param shopId 店铺ID
     * @param accountId 账户ID
     * @param type 类型
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 资金流水
     */
    PageResult<FundsTransactionVO> getTransactions(String shopId, Long accountId, String type, 
            String startDate, String endDate, Integer pageNum, Integer pageSize);

    /**
     * 获取资金预测
     *
     * @param shopId 店铺ID
     * @param days 预测天数
     * @return 资金预测
     */
    FundsForecastRespVO getForecast(String shopId, Integer days);

    /**
     * 获取提现记录
     *
     * @param shopId 店铺ID
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 提现记录
     */
    PageResult<FundsWithdrawRecordVO> getWithdrawRecords(String shopId, Integer pageNum, Integer pageSize);

    /**
     * 获取对账规则
     *
     * @param shopId 店铺ID
     * @return 对账规则
     */
    List<FundsReconciliationRuleVO> getReconciliationRules(String shopId);

    /**
     * 保存对账规则
     *
     * @param reqVO 对账规则
     * @return 保存结果
     */
    Map<String, Object> saveReconciliationRule(FundsReconciliationRuleVO reqVO);
}
