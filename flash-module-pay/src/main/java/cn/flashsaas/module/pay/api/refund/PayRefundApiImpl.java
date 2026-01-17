package cn.flashsaas.module.pay.api.refund;

import cn.flashsaas.framework.common.util.object.BeanUtils;
import cn.flashsaas.module.pay.api.refund.dto.PayRefundCreateReqDTO;
import cn.flashsaas.module.pay.api.refund.dto.PayRefundRespDTO;
import cn.flashsaas.module.pay.dal.dataobject.refund.PayRefundDO;
import cn.flashsaas.module.pay.service.refund.PayRefundService;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;

/**
 * 退款单 API 实现类
 *
 * @author FlashSaaS
 */
@Service
@Validated
public class PayRefundApiImpl implements PayRefundApi {

    @Resource
    private PayRefundService payRefundService;

    @Override
    public Long createRefund(PayRefundCreateReqDTO reqDTO) {
        return payRefundService.createRefund(reqDTO);
    }

    @Override
    public PayRefundRespDTO getRefund(Long id) {
        PayRefundDO refund = payRefundService.getRefund(id);
        return BeanUtils.toBean(refund, PayRefundRespDTO.class);
    }

}
