package cn.flashsaas.module.finance.service;

import cn.flashsaas.framework.common.pojo.PageResult;
import cn.flashsaas.framework.common.util.object.BeanUtils;
import cn.flashsaas.module.finance.controller.admin.cashflow.vo.CashflowCreateReqVO;
import cn.flashsaas.module.finance.controller.admin.cashflow.vo.CashflowPageReqVO;
import cn.flashsaas.module.finance.controller.admin.cashflow.vo.CashflowUpdateReqVO;
import cn.flashsaas.module.finance.dal.dataobject.CashflowDO;
import cn.flashsaas.module.finance.dal.mysql.CashflowMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.time.LocalDateTime;

/**
 * 资金流水 Service 实现类
 *
 * @author 闪电账PRO
 */
@Service
public class CashflowServiceImpl implements CashflowService {

    @Resource
    private CashflowMapper cashflowMapper;

    @Override
    @Transactional
    public Long createCashflow(@Valid CashflowCreateReqVO createReqVO) {
        CashflowDO cashflow = BeanUtils.toBean(createReqVO, CashflowDO.class);
        cashflowMapper.insert(cashflow);
        return cashflow.getId();
    }

    @Override
    @Transactional
    public void updateCashflow(@Valid CashflowUpdateReqVO updateReqVO) {
        CashflowDO cashflow = BeanUtils.toBean(updateReqVO, CashflowDO.class);
        cashflowMapper.updateById(cashflow);
    }

    @Override
    @Transactional
    public void deleteCashflow(Long id) {
        cashflowMapper.deleteById(id);
    }

    @Override
    public CashflowDO getCashflow(Long id) {
        return cashflowMapper.selectById(id);
    }

    @Override
    public PageResult<CashflowDO> getCashflowPage(CashflowPageReqVO pageReqVO) {
        LambdaQueryWrapper<CashflowDO> queryWrapper = Wrappers.lambdaQuery(CashflowDO.class)
                .eq(pageReqVO.getShopId() != null, CashflowDO::getShopId, pageReqVO.getShopId())
                .like(pageReqVO.getFlowNo() != null, CashflowDO::getFlowNo, pageReqVO.getFlowNo())
                .eq(pageReqVO.getTradeType() != null, CashflowDO::getTradeType, pageReqVO.getTradeType())
                .eq(pageReqVO.getConfirmStatus() != null, CashflowDO::getConfirmStatus, pageReqVO.getConfirmStatus())
                .orderByDesc(CashflowDO::getTradeTime);
        
        return cashflowMapper.selectPage(pageReqVO, queryWrapper);
    }

    @Override
    @Transactional
    public void confirmCashflow(Long id) {
        CashflowDO cashflow = cashflowMapper.selectById(id);
        if (cashflow == null) {
            throw new RuntimeException("资金流水不存在");
        }
        
        cashflow.setConfirmStatus("已确认");
        cashflow.setConfirmTime(LocalDateTime.now());
        cashflowMapper.updateById(cashflow);
    }

}
