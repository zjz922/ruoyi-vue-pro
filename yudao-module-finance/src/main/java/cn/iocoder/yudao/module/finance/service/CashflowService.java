package cn.iocoder.yudao.module.finance.service;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.finance.controller.admin.cashflow.vo.CashflowCreateReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.cashflow.vo.CashflowPageReqVO;
import cn.iocoder.yudao.module.finance.controller.admin.cashflow.vo.CashflowUpdateReqVO;
import cn.iocoder.yudao.module.finance.dal.dataobject.CashflowDO;

import javax.validation.Valid;

/**
 * 资金流水 Service 接口
 *
 * @author 闪电账PRO
 */
public interface CashflowService {

    /**
     * 创建资金流水
     *
     * @param createReqVO 创建信息
     * @return 资金流水ID
     */
    Long createCashflow(@Valid CashflowCreateReqVO createReqVO);

    /**
     * 更新资金流水
     *
     * @param updateReqVO 更新信息
     */
    void updateCashflow(@Valid CashflowUpdateReqVO updateReqVO);

    /**
     * 删除资金流水
     *
     * @param id 资金流水ID
     */
    void deleteCashflow(Long id);

    /**
     * 获取资金流水
     *
     * @param id 资金流水ID
     * @return 资金流水
     */
    CashflowDO getCashflow(Long id);

    /**
     * 获取资金流水分页
     *
     * @param pageReqVO 分页请求
     * @return 资金流水分页
     */
    PageResult<CashflowDO> getCashflowPage(CashflowPageReqVO pageReqVO);

    /**
     * 确认资金流水
     *
     * @param id 资金流水ID
     */
    void confirmCashflow(Long id);

}
